import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head } from '@inertiajs/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ReactNode, useMemo } from 'react';
import ContactMessagesTableColumns from './partials/contact-messages-table-columns';

interface ContactMessagesProps extends SharedData {
   messages: Pagination<ContactMessage>;
}

const ContactMessages = ({ messages }: ContactMessagesProps) => {
   const columns = useMemo(() => ContactMessagesTableColumns(), []);

   const table = useReactTable({
      data: messages.data || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   return (
      <div className="space-y-7">
         <Head title="Contato" />

         <Card>
            <div className="flex items-center justify-between gap-4 border-b px-6 py-5">
               <div>
                  <h1 className="text-2xl font-bold">Contato</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Respostas enviadas pelo formulário público do site.</p>
               </div>

               <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {messages.total} mensagem{messages.total !== 1 ? 's' : ''}
               </div>
            </div>

            <CardContent className="p-0">
               <Table className="border-border border-y">
                  <TableHeader table={table} />

                  <TableBody>
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                              ))}
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell className="h-24 text-center">Nenhuma mensagem encontrada.</TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>

               <TableFooter className="p-5 sm:p-7" routeName="contact-messages.index" paginationInfo={messages} />
            </CardContent>
         </Card>
      </div>
   );
};

ContactMessages.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default ContactMessages;
