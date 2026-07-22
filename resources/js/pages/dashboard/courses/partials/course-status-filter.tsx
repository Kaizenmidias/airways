import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

const CourseStatusFilter = () => {
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);
   const statuses = page.props.statuses as string[];
   const { button, common, frontend } = page.props.translate;
   const statusLabels: Record<string, string> = {
      all: frontend.all || 'All',
      draft: 'Rascunho',
      upcoming: 'Próximo',
      pending: common.pending || 'Pendente',
      approved: button.approved || 'Approved',
      rejected: 'Rejeitado',
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="flex items-center justify-center">
            <Button variant="ghost" className="text-muted-foreground capitalize">
               <span>{statusLabels[String(urlParams['status'] ?? 'all')] ?? urlParams['status'] ?? 'Status'}</span>
               <ChevronsUpDown className="h-3 w-3 text-gray-700" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="center" className="min-w-[72px]">
            {['all', ...statuses].map((status) => (
               <DropdownMenuItem
                  key={status}
                  onClick={() =>
                     router.get(
                        route('courses.index', {
                           ...urlParams,
                           status: status,
                        }),
                     )
                  }
                  className={cn('cursor-pointer text-center capitalize', urlParams['status'] === status && 'bg-gray-100')}
               >
                  {statusLabels[status] ?? status}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default CourseStatusFilter;
