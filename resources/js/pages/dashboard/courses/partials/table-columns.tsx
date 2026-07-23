import DeleteModal from '@/components/inertia/delete-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';
import CourseStatusFilter from './course-status-filter';

const buildBasicPayload = (course: Course, title: string) => ({
   tab: 'basic',
   title,
   sub_title: course.sub_title ?? '',
   short_description: course.short_description ?? '',
   description: course.description ?? '',
   status: course.status,
   drip_content: Boolean(course.drip_content),
   is_development: Boolean(course.is_development),
   course_category_id: course.course_category_id,
   course_category_child_id: course.course_category_child_id ?? '',
});

const InlineCourseTitleCell = ({ course }: { course: Course }) => {
   const [isEditing, setIsEditing] = React.useState(false);
   const [draftTitle, setDraftTitle] = React.useState(course.title);
   const inputRef = React.useRef<HTMLInputElement>(null);

   React.useEffect(() => {
      setDraftTitle(course.title);
   }, [course.title]);

   React.useEffect(() => {
      if (isEditing) {
         inputRef.current?.focus();
         inputRef.current?.select();
      }
   }, [isEditing]);

   const cancelEditing = () => {
      setDraftTitle(course.title);
      setIsEditing(false);
   };

   const saveTitle = () => {
      const nextTitle = draftTitle.trim();

      if (!nextTitle || nextTitle === course.title) {
         cancelEditing();
         return;
      }

      router.post(route('courses.update', { id: course.id }), buildBasicPayload(course, nextTitle), {
         preserveScroll: true,
         preserveState: true,
         onSuccess: () => setIsEditing(false),
         onError: () => {
            setDraftTitle(course.title);
            setIsEditing(true);
            inputRef.current?.focus();
            inputRef.current?.select();
         },
      });
   };

   if (isEditing) {
      return (
         <div className="py-1 pl-4">
            <Input
               ref={inputRef}
               value={draftTitle}
               onChange={(e) => setDraftTitle(e.target.value)}
               onBlur={saveTitle}
               onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     e.preventDefault();
                     saveTitle();
                  }

                  if (e.key === 'Escape') {
                     e.preventDefault();
                     cancelEditing();
                  }
               }}
               className="h-9 border-border bg-background px-3 text-sm font-medium"
            />
         </div>
      );
   }

   return (
      <div className="py-1 pl-4">
         <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="block max-w-full text-left text-sm font-medium text-primary transition-colors hover:underline"
            title="Clique para renomear"
         >
            {course.title}
         </button>
      </div>
   );
};

const TableColumn = (isAdmin: boolean, translate: LanguageTranslations): ColumnDef<Course>[] => {
   const { button, table } = translate;
   const statusLabels: Record<string, string> = {
      draft: 'Rascunho',
      upcoming: 'Próximo',
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
   };

   return [
      ...(isAdmin
         ? [
              {
                 id: 'select',
                 header: ({ table }) => (
                    <div className="flex justify-center pl-4">
                       <Checkbox
                          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                          aria-label="Selecionar todos os cursos"
                       />
                    </div>
                 ),
                 cell: ({ row }) => (
                    <div className="flex justify-center pl-4">
                       <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) => row.toggleSelected(!!value)}
                          aria-label="Selecionar curso"
                       />
                    </div>
                 ),
                 enableSorting: false,
                 enableHiding: false,
              } as ColumnDef<Course>,
           ]
         : []),
      {
         accessorKey: 'title',
         header: () => <div className="pl-4">{table.course_title}</div>,
         cell: ({ row }) => <InlineCourseTitleCell course={row.original} />,
      },
      {
         accessorKey: 'status',
         header: ({ column }) => (
            <div className="flex justify-center">
               <CourseStatusFilter />
            </div>
         ),
         cell: ({ row }) => <div className="py-1 text-center capitalize">{statusLabels[String(row.getValue('status'))] ?? row.getValue('status')}</div>,
      },
      {
         accessorKey: 'category',
         header: ({ column }) => {
            return (
               <div className="flex items-center justify-center">
                  <p>{table.category}</p>
               </div>
            );
         },
         cell: ({ row }) => (
            <div className="py-1 text-center capitalize">
               <p>{row.original.course_category.title}</p>
            </div>
         ),
      },
      {
         accessorKey: 'category_child',
         header: ({ column }) => {
            return (
               <div className="flex items-center justify-center">
                  <p>{table.category_child}</p>
               </div>
            );
         },
         cell: ({ row }) => (
            <div className="py-1 text-center capitalize">
               <p>{row.original.course_category_child?.title || '--'}</p>
            </div>
         ),
      },
      {
         accessorKey: 'price',
         header: ({ column }) => (
            <div className="flex items-center justify-center">
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  {table.price}
                  <ArrowUpDown />
               </Button>
            </div>
         ),
         cell: ({ row }) => (
            <div className="py-1 text-center capitalize">
               <p>{row.original.pricing_type === 'free' ? table.free : formatCurrency(row.original.price, 'BRL')}</p>
            </div>
         ),
      },
      {
         id: 'actions',
         header: () => <div className="pr-4 text-end">{table.action}</div>,
         cell: ({ row }) => {
            const course = row.original;

            return (
               <div className="flex justify-end gap-2 py-1 pr-4">
                  <Button
                     size="icon"
                     variant="secondary"
                     className="h-8 w-8"
                     title={table.edit_page || button.edit}
                     onClick={() =>
                        router.get(
                           route('courses.edit', {
                              course: course.id,
                           }),
                        )
                     }
                  >
                     <Pencil />
                  </Button>

                  <Button
                     size="icon"
                     variant="secondary"
                     className="h-8 w-8"
                     title={button.duplicate}
                     onClick={() => router.post(route('courses.duplicate', { id: course.id }))}
                  >
                     <Copy className="h-4 w-4" />
                  </Button>

                  {isAdmin && (
                     <DeleteModal
                        routePath={route('courses.destroy', course.id)}
                        message={table.delete_course_warning}
                        actionComponent={
                           <Button size="icon" variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8 p-0">
                              <Trash2 className="text-destructive text-sm" />
                           </Button>
                        }
                     />
                  )}
               </div>
            );
         },
      },
   ];
};

export default TableColumn;
