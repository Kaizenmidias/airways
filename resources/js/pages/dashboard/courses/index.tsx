import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { RowSelectionState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { ReactNode } from 'react';
import BulkCourseActions from './partials/bulk-course-actions';
import TableColumn from './partials/table-columns';

interface Props extends SharedData {
   courses: Pagination<Course>;
   categories: CourseCategory[];
}

const Index = (props: Props) => {
   const { isAdmin } = useAuth();
   const { translate } = props;
   const { button, dashboard, frontend } = translate;
   const [sorting, setSorting] = React.useState<SortingState>([]);
   const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);

   React.useEffect(() => {
      setRowSelection({});
   }, [page.url]);

   const selectedCategory = String(urlParams.category ?? 'all');
   const selectedChildCategory = String(urlParams.category_child ?? '');

   const navigateFolder = (categorySlug: string, childSlug?: string) => {
      const nextParams: Record<string, string> = {
         ...Object.fromEntries(Object.entries(urlParams).filter(([key]) => key !== 'page')),
         category: categorySlug,
      };

      if (childSlug) {
         nextParams.category_child = childSlug;
      } else {
         delete nextParams.category_child;
      }

      router.get(route('courses.index', nextParams), {}, { preserveState: true, preserveScroll: true });
   };

   const renderFolder = (category: CourseCategory, depth = 0) => {
      const hasActiveChild = category.category_children?.some((child) => selectedChildCategory === child.slug);
      const isActive = selectedCategory === category.slug || hasActiveChild;

      return (
         <div key={category.id} className="space-y-1">
            <button
               type="button"
               onClick={() => navigateFolder(category.slug)}
               className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
                  isActive ? 'bg-[#FD122E] text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                  depth > 0 && 'pl-5',
               )}
            >
               <span className="flex items-center gap-2">
                  <span className="text-base leading-none">📁</span>
                  <span className="font-medium">{category.title}</span>
               </span>
               <span className="text-xs font-semibold opacity-80">{category.courses_count ?? 0}</span>
            </button>

            {category.category_children?.length ? (
               <div className="space-y-1 pl-4">
                  {category.category_children.map((child) => {
                     const childActive = selectedChildCategory === child.slug;

                     return (
                        <button
                           key={child.id}
                           type="button"
                           onClick={() => navigateFolder(category.slug, child.slug)}
                           className={cn(
                              'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
                              childActive ? 'bg-[#FD122E] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                           )}
                        >
                           <span className="flex items-center gap-2">
                              <span className="text-sm leading-none">📁</span>
                              <span>{child.title}</span>
                           </span>
                           <span className="text-xs font-semibold opacity-80">{child.courses_count ?? 0}</span>
                        </button>
                     );
                  })}
               </div>
            ) : null}
         </div>
      );
   };

   const table = useReactTable({
      data: props.courses.data,
      columns: TableColumn(isAdmin, translate),
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting, rowSelection },
      enableRowSelection: isAdmin,
   });

   const selectedCourseIds = table.getSelectedRowModel().rows.map((row) => row.original.id);

   return (
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
         <Card className="h-fit p-4">
            <div className="mb-4 flex items-center justify-between">
               <div>
                  <p className="text-lg font-semibold text-slate-900">Pastas</p>
                  <p className="text-sm text-slate-500">Filtre pelos cursos de uma categoria</p>
               </div>
               <Button size="sm" variant="secondary" onClick={() => navigateFolder('all')}>
                  Todos
               </Button>
            </div>

            <div className="space-y-1 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 230px)' }}>
               {props.categories
                  .filter((category) => category.slug !== 'default')
                  .map((category) => renderFolder(category))}
            </div>
         </Card>

         <div>
            <Link href={route('courses.create')}>
               <Button>{button.create_course}</Button>
            </Link>

            <Separator className="my-6" />

            <Card>
               <TableFilter
                  data={props.courses}
                  title={dashboard.course_list}
                  globalSearch={true}
                  component={<BulkCourseActions selectedCourseIds={selectedCourseIds} onClearSelection={() => setRowSelection({})} />}
                  tablePageSizes={[10, 15, 20, 25]}
                  routeName="courses.index"
               />

               <Table className="border-border border-y">
                  <TableHeader table={table} />

                  <TableBody>
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                              ))}
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell className="h-24 text-center">{frontend.no_results}</TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>

               <TableFooter className="p-5 sm:p-7" routeName="courses.index" paginationInfo={props.courses} />
            </Card>
         </div>
      </div>
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
