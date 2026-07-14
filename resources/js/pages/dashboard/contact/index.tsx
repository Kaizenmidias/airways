import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head } from '@inertiajs/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Mail, MessageCircle, MessageSquareText, Phone, User, Clock3, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import ContactMessagesTableColumns from './partials/contact-messages-table-columns';

interface ContactMessagesProps extends SharedData {
   messages: Pagination<ContactMessage>;
}

const ContactMessages = ({ messages }: ContactMessagesProps) => {
   const columns = useMemo(() => ContactMessagesTableColumns(), []);
   const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

   const table = useReactTable({
      data: messages.data || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   const formatPhoneDigits = (phone?: string | null) => phone?.replace(/\D/g, '') || '';

   const openWhatsappUrl = (phone?: string | null, message?: string | null, name?: string | null) => {
      const digits = formatPhoneDigits(phone);
      if (!digits) return '#';

      const normalized = digits.startsWith('55') ? digits : `55${digits}`;
      const text = encodeURIComponent(
         `Olá, ${name || 'tudo bem'}! Recebemos sua mensagem pelo site da Airways e vamos dar continuidade ao seu contato. Mensagem enviada: ${message || ''}`,
      );

      return `https://wa.me/${normalized}?text=${text}`;
   };

   const openMailtoUrl = (email?: string | null, message?: string | null, name?: string | null) => {
      if (!email) return '#';

      const subject = encodeURIComponent(`Resposta à sua mensagem, ${name || 'Airways'}`);
      const body = encodeURIComponent(
         `Olá, ${name || ''}\n\nRecebemos sua mensagem pelo formulário do site da Airways.\n\nMensagem recebida:\n${message || ''}\n\nAtenciosamente,\nEquipe Airways`,
      );

      return `mailto:${email}?subject=${subject}&body=${body}`;
   };

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
                           <TableRow
                              key={row.id}
                              className="cursor-pointer transition-colors hover:bg-slate-50"
                              onClick={() => setSelectedMessage(row.original)}
                           >
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

         <Dialog open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessage(null)}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
               {selectedMessage && (
                  <>
                     <DialogHeader className="space-y-2 text-left">
                        <DialogTitle className="text-2xl">Mensagem de {selectedMessage.name}</DialogTitle>
                        <DialogDescription>
                           Detalhes completos do lead, com atalhos para responder por WhatsApp ou e-mail.
                        </DialogDescription>
                     </DialogHeader>

                     <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid h-auto w-full grid-cols-3">
                           <TabsTrigger value="details">Detalhes</TabsTrigger>
                           <TabsTrigger value="whatsapp">Responder no WhatsApp</TabsTrigger>
                           <TabsTrigger value="email">Responder no e-mail</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="mt-6 space-y-5">
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-2xl border bg-slate-50 p-4">
                                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    <User className="h-4 w-4" />
                                    Nome
                                 </div>
                                 <p className="mt-2 text-base font-medium text-slate-950">{selectedMessage.name}</p>
                              </div>

                              <div className="rounded-2xl border bg-slate-50 p-4">
                                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    <Mail className="h-4 w-4" />
                                    E-mail
                                 </div>
                                 <p className="mt-2 break-all text-base font-medium text-slate-950">{selectedMessage.email}</p>
                              </div>

                              <div className="rounded-2xl border bg-slate-50 p-4">
                                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    <Phone className="h-4 w-4" />
                                    Telefone
                                 </div>
                                 <p className="mt-2 text-base font-medium text-slate-950">{selectedMessage.phone || '--'}</p>
                              </div>

                              <div className="rounded-2xl border bg-slate-50 p-4">
                                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    <Clock3 className="h-4 w-4" />
                                    Recebido em
                                 </div>
                                 <p className="mt-2 text-base font-medium text-slate-950">
                                    {new Date(selectedMessage.created_at).toLocaleString('pt-BR', {
                                       dateStyle: 'short',
                                       timeStyle: 'short',
                                    })}
                                 </p>
                              </div>
                           </div>

                           <div className="rounded-2xl border bg-white p-4">
                              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                 <MessageSquareText className="h-4 w-4" />
                                 Mensagem
                              </div>
                              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedMessage.message}</p>
                           </div>

                           <div className="flex flex-wrap gap-2">
                              <Badge variant={selectedMessage.accepted_privacy ? 'default' : 'secondary'}>
                                 <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                 {selectedMessage.accepted_privacy ? 'Privacidade aceita' : 'Privacidade não aceita'}
                              </Badge>
                           </div>
                        </TabsContent>

                        <TabsContent value="whatsapp" className="mt-6 space-y-4">
                           <div className="rounded-2xl border bg-green-50 p-5">
                              <p className="text-sm font-medium text-green-900">Telefone informado pelo lead</p>
                              <p className="mt-1 text-lg font-semibold text-green-950">{selectedMessage.phone || 'Sem telefone informado'}</p>
                              <p className="mt-2 text-sm text-green-800">
                                 O botão abaixo abre uma conversa no WhatsApp com a mensagem preenchida automaticamente.
                              </p>
                           </div>

                           <div className="flex flex-wrap gap-3">
                              <Button asChild className="bg-[#25D366] text-white hover:bg-[#1eb95a]" disabled={!selectedMessage.phone}>
                                 <a href={openWhatsappUrl(selectedMessage.phone, selectedMessage.message, selectedMessage.name)} target="_blank" rel="noreferrer">
                                    <MessageCircle className="h-4 w-4" />
                                    Responder no WhatsApp
                                 </a>
                              </Button>

                              <Button
                                 type="button"
                                 variant="outline"
                                 onClick={() => navigator.clipboard?.writeText(selectedMessage.phone || '')}
                                 disabled={!selectedMessage.phone}
                              >
                                 <Copy className="h-4 w-4" />
                                 Copiar telefone
                              </Button>
                           </div>
                        </TabsContent>

                        <TabsContent value="email" className="mt-6 space-y-4">
                           <div className="rounded-2xl border bg-slate-50 p-5">
                              <p className="text-sm font-medium text-slate-900">E-mail do lead</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{selectedMessage.email}</p>
                              <p className="mt-2 text-sm text-slate-600">
                                 O botão abaixo abre o seu cliente de e-mail com destinatário e texto pré-preenchidos.
                              </p>
                           </div>

                           <div className="flex flex-wrap gap-3">
                              <Button asChild disabled={!selectedMessage.email} className="bg-[#FD122E] text-white hover:bg-[#d90f26]">
                                 <a href={openMailtoUrl(selectedMessage.email, selectedMessage.message, selectedMessage.name)}>
                                    <Mail className="h-4 w-4" />
                                    Responder no e-mail
                                 </a>
                              </Button>

                              <Button
                                 type="button"
                                 variant="outline"
                                 onClick={() => navigator.clipboard?.writeText(selectedMessage.email || '')}
                                 disabled={!selectedMessage.email}
                              >
                                 <Copy className="h-4 w-4" />
                                 Copiar e-mail
                              </Button>
                           </div>

                           <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
                              Se preferirmos, depois podemos evoluir esta aba para um envio direto pelo sistema via SMTP.
                           </div>
                        </TabsContent>
                     </Tabs>
                  </>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
};

ContactMessages.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default ContactMessages;
