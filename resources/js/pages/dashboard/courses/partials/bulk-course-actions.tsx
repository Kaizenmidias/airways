import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { ChevronDown, Trash2, WandSparkles, CircleCheck, PencilLine, Clock3 } from 'lucide-react';

interface Props {
   selectedCourseIds: Array<string | number>;
   onClearSelection: () => void;
}

const BulkCourseActions = ({ selectedCourseIds, onClearSelection }: Props) => {
   const selectedCount = selectedCourseIds.length;

   if (selectedCount <= 0) {
      return null;
   }

   const submitAction = (action: string) => {
      if (action === 'delete' && !window.confirm(`Excluir ${selectedCount} curso(s) selecionado(s)? Esta ação não pode ser desfeita.`)) {
         return;
      }

      router.post(
         route('courses.bulk-actions'),
         {
            action,
            course_ids: selectedCourseIds,
         },
         {
            preserveScroll: true,
            onSuccess: () => {
               onClearSelection();
            },
         },
      );
   };

   return (
      <div className="flex items-center gap-3">
         <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
            {selectedCount} selecionado(s)
         </Badge>

         <Button type="button" variant="outline" size="sm" onClick={onClearSelection}>
            Limpar
         </Button>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button type="button" size="sm" className="gap-2">
                  Ações em massa
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-56">
               <DropdownMenuItem onSelect={() => submitAction('approve')}>
                  <CircleCheck className="h-4 w-4" />
                  Aprovar cursos
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => submitAction('draft')}>
                  <PencilLine className="h-4 w-4" />
                  Marcar como rascunho
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => submitAction('pending')}>
                  <Clock3 className="h-4 w-4" />
                  Marcar como pendente
               </DropdownMenuItem>

               <DropdownMenuSeparator />

               <DropdownMenuItem onSelect={() => submitAction('development_on')}>
                  <WandSparkles className="h-4 w-4" />
                  Ativar modo de desenvolvimento
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => submitAction('development_off')}>
                  <WandSparkles className="h-4 w-4" />
                  Desativar modo de desenvolvimento
               </DropdownMenuItem>

               <DropdownMenuSeparator />

               <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => submitAction('delete')}>
                  <Trash2 className="h-4 w-4" />
                  Excluir selecionados
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default BulkCourseActions;
