import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle, Clock, Eye, MoreVertical, Pencil } from 'lucide-react';
import AssignmentForm from './forms/assignment-form';

const AssignmentTableColumn = (slug: string, translate: LanguageTranslations, enrollmentsCount: number): ColumnDef<CourseAssignment>[] => {
   const { table } = translate;

   return [
      {
         accessorKey: 'title',
         header: 'Detalhes da atividade',
         cell: ({ row }) => {
            const assignment = row.original;
            return (
               <div className="space-y-1 py-2">
                  <p className="text-base font-semibold">{assignment.title}</p>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                     <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Total: {assignment.total_mark}
                     </span>
                     <span className="flex items-center gap-1">Nota mínima: {assignment.pass_mark}</span>
                     <span className="flex items-center gap-1">Tentativas: {assignment.retake}</span>
                  </div>
               </div>
            );
         },
      },
      {
         accessorKey: 'deadline',
         header: 'Prazo final',
         cell: ({ row }) => {
            const deadline = row.getValue('deadline') as string;
            const isExpired = new Date() > new Date(deadline);

            return (
               <div className="py-2">
                  <div className="flex items-center gap-2">
                     {isExpired ? (
                        <AlertCircle className="text-destructive h-4 w-4 flex-shrink-0" />
                     ) : (
                        <Clock className="text-primary h-4 w-4 flex-shrink-0" />
                     )}
                     <div>
                        <p className={`text-sm font-medium ${isExpired ? 'text-destructive' : ''}`}>{format(new Date(deadline), 'dd MMM yyyy', { locale: ptBR })}</p>
                        <p className="text-muted-foreground text-xs">{format(new Date(deadline), 'HH:mm')}</p>
                     </div>
                  </div>
                  {isExpired && (
                     <Badge variant="destructive" className="mt-1 text-xs">
                        Expirado
                     </Badge>
                  )}
               </div>
            );
         },
      },
      {
         accessorKey: 'late_submission',
         header: () => <div className="text-center">Envio atrasado</div>,
         cell: ({ row }) => {
            const assignment = row.original;
            const lateAllowed = assignment.late_submission;

            return (
               <div className="py-2 text-center">
                  <Badge variant={lateAllowed ? 'default' : 'secondary'}>{lateAllowed ? 'Permitido' : 'Não permitido'}</Badge>
                  {lateAllowed && assignment.late_deadline && (
                     <div className="text-muted-foreground mt-1 text-xs">Até: {format(new Date(assignment.late_deadline), 'dd MMM', { locale: ptBR })}</div>
                  )}
               </div>
            );
         },
      },
      {
         accessorKey: 'submissions',
         header: () => <div className="text-center">Envios</div>,
         cell: ({ row }) => {
            const assignment = row.original;
            const totalSubmissions = assignment.submissions?.length || 0;
            const gradedCount = assignment.submissions?.filter((s) => s.status === 'graded').length || 0;
            const pendingCount = totalSubmissions - gradedCount;

            return (
               <div className="py-2 text-center">
                  <span className="font-semibold">{totalSubmissions}</span> of <span className="font-semibold">{enrollmentsCount}</span>
                  {/* <div className="flex items-center justify-center gap-1">
                     <Users className="text-primary h-4 w-4" />
                     <span className="text-lg font-semibold">{totalSubmissions}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs">
                     <span className="text-green-600">✓ {gradedCount}</span>
                     {pendingCount > 0 && <span className="text-orange-600">⏳ {pendingCount}</span>}
                  </div> */}
               </div>
            );
         },
      },
      {
         id: 'actions',
         header: () => <div className="text-end">{table.action}</div>,
         cell: ({ row }) => {
            const assignment = row.original;

            return (
               <div className="flex justify-end py-2">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                           <span className="sr-only">Abrir menu</span>
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="space-y-1">
                        <DropdownMenuItem asChild>
                           <Link
                              href={route('courses.edit', {
                                 course: assignment.course_id,
                                 tab: slug,
                                 assignment: assignment.id,
                              })}
                              className="flex w-full cursor-pointer items-center gap-2"
                           >
                              <Eye className="h-4 w-4" />
                              <span>Visualizar envios</span>
                           </Link>
                        </DropdownMenuItem>
                        <AssignmentForm
                           title={'Update Assignment'}
                           assignment={assignment}
                           handler={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex w-full cursor-pointer items-center gap-2">
                                 <Pencil className="h-4 w-4" />
                                 <span>Atualizar atividade</span>
                              </DropdownMenuItem>
                           }
                        />
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            );
         },
      },
   ];
};

export default AssignmentTableColumn;
