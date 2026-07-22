import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getQueryParams } from '@/lib/route';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { ReactNode } from 'react';
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
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);
   const [selectedCategory, setSelectedCategory] = React.useState(String(urlParams.category ?? 'all'));

   React.useEffect(() => {
      setSelectedCategory(String(urlParams.category ?? 'all'));
   }, [page.url]);

   const categoryOptions = React.useMemo(
      () =>
         props.categories.flatMap((category) => [
            { label: category.title, value: category.slug },
            ...(category.category_children?.map((child) => ({ label: `--${child.title}`, value: child.slug })) ?? []),
         ]),
      [props.categories],
   );

   const handleCategoryFilter = () => {
      router.get(
         route('courses.index', {
            ...urlParams,
            category: selectedCategory,
         }),
         {},
         {
            preserveState: true,
            preserveScroll: true,
         },
      );
   };

   const table = useReactTable({
      data: props.courses.data,
      columns: TableColumn(isAdmin, translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
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
               filters={
                  <div className="flex w-full items-center gap-2 md:max-w-[340px]">
                     <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-10 w-full md:min-w-[180px]">
                           <SelectValue placeholder={translate.common.category || 'Categoria'} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">{frontend.all || 'All'}</SelectItem>
                           {categoryOptions.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                 {category.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>

                     <Button type="button" className="h-10" onClick={handleCategoryFilter}>
                        {button.filter}
                     </Button>
                  </div>
               }
               tablePageSizes={[10, 15, 20, 25]}
               routeName="courses.index"
               // Icon={<Users className="h-6 w-6 text-primary" />}
               // exportPath={route('users.export')}
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
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
