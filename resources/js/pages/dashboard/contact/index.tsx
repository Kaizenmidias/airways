import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, useForm } from '@inertiajs/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Clock3, Copy, Mail, MessageCircle, MessageSquareText, Phone, ShieldCheck, User } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import ContactMessagesTableColumns from './partials/contact-messages-table-columns';

interface ContactMessagesProps extends SharedData {
   messages: Pagination<ContactMessage>;
}

const ContactMessages = ({ messages }: ContactMessagesProps) => {
   const columns = useMemo(() => ContactMessagesTableColumns(), []);
   const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
   const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
      reply_subject: '',
      reply_body: '',
   });

   const table = useReactTable({
      data: messages.data || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   const formatPhoneDigits = (phone?: string | null) => phone?.replace(/\D/g, '') || '';

   const openWhatsappUrl = (phone?: string | null, message?: string | null, name?: string | null) => {
      const digits = formatPhoneDigits(phone);

      if (!digits) {
         return '#';
      }

      const normalized = digits.startsWith('55') ? digits : `55${digits}`;
      const text = encodeURIComponent(
         `Olá, ${name || 'tudo bem'}! Recebemos sua mensagem pelo site da Airways e vamos dar continuidade ao seu contato. Mensagem enviada: ${message || ''}`,
      );

      return `https://wa.me/${normalized}?text=${text}`;
   };

   useEffect(() => {
      if (!selectedMessage) {
         reset();
         clearErrors();
         return;
      }

      setData({
         reply_subject: `Resposta à sua mensagem, ${selectedMessage.name}`,
         reply_body: `Olá, ${selectedMessage.name}.\n\nObrigado pelo seu contato. Recebemos sua mensagem e retornaremos com as próximas orientações.\n\nAtenciosamente,\nEquipe Airways`,
      });
      clearErrors();
   }, [clearErrors, reset, selectedMessage, setData]);

   const handleEmailReplySubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedMessage) {
         return;
      }

      post(route('contact-messages.reply', { contactMessage: selectedMessage.id }), {
         preserveScroll: true,
         onSuccess: () => {
            reset();
            clearErrors();
         },
      });
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
                        <DialogDescription>Detalhes completos do lead, com atalhos para responder por WhatsApp ou e-mail.</DialogDescription>
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
                              <p className="mt-2 text-sm text-green-800">O botão abaixo abre uma conversa no WhatsApp com a mensagem preenchida automaticamente.</p>
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
                              <p className="mt-2 text-sm text-slate-600">A mensagem abaixo será enviada diretamente pelo sistema usando o SMTP configurado.</p>
                           </div>

                           <form onSubmit={handleEmailReplySubmit} className="space-y-4 rounded-2xl border bg-white p-5">
                              <div className="space-y-2">
                                 <Label htmlFor="reply_subject">Assunto</Label>
                                 <Input
                                    id="reply_subject"
                                    value={data.reply_subject}
                                    onChange={(e) => setData('reply_subject', e.target.value)}
                                    placeholder="Assunto do e-mail"
                                 />
                                 <InputError message={errors.reply_subject} />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="reply_body">Mensagem</Label>
                                 <Textarea
                                    id="reply_body"
                                    rows={8}
                                    value={data.reply_body}
                                    onChange={(e) => setData('reply_body', e.target.value)}
                                    placeholder="Escreva a resposta ao lead"
                                 />
                                 <InputError message={errors.reply_body} />
                              </div>

                              <div className="flex flex-wrap gap-3">
                                 <LoadingButton type="submit" loading={processing} className="bg-[#FD122E] text-white hover:bg-[#d90f26]">
                                    <Mail className="h-4 w-4" />
                                    Enviar e-mail
                                 </LoadingButton>

                                 <Button type="button" variant="outline" onClick={() => navigator.clipboard?.writeText(selectedMessage.email || '')} disabled={!selectedMessage.email}>
                                    <Copy className="h-4 w-4" />
                                    Copiar e-mail do lead
                                 </Button>
                              </div>
                           </form>
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
