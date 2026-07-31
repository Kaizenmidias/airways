import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { type FormEvent, useEffect, useState } from 'react';
import EmailTemplateToolbar from './email-template-toolbar';

interface EmailTemplateFormProps {
   template: Settings<EmailTemplateFields> & { preview_html?: string };
}

const placeholders: Record<string, string[]> = {
   verification: ['{{ $user->name }}', '{{ $url }}', '{{ $count }}', "{{ config('mail.from.name') }}"],
   password_reset: ['{{ $user->name }}', '{{ $url }}', '{{ $count }}', "{{ config('mail.from.name') }}"],
   change_email: ['{{ $user->name }}', '{{ $url }}', "{{ config('mail.from.name') }}"],
   course_approval: ['{{ $user->name }}', '{{ $course->title }}', '{{ $course->slug }}', '{{ $status }}', '{{ $feedback }}'],
   instructor_approval: ['{{ $user->name }}', '{{ $status }}', '{{ $feedback }}', "{{ route('dashboard') }}"],
};

const EmailTemplateForm = ({ template }: EmailTemplateFormProps) => {
   const { data, setData, post, errors, processing } = useForm({
      subject: template.fields?.subject ?? '',
      body: template.fields?.body ?? '',
   });

   const [previewHtml, setPreviewHtml] = useState(template.preview_html ?? '');
   const [previewSubject, setPreviewSubject] = useState(template.fields?.subject ?? '');
   const availablePlaceholders = placeholders[template.sub_type] ?? [];

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      post(route('settings.email-templates.update', { id: template.id }), {
         preserveScroll: true,
      });
   };

   useEffect(() => {
      const timeout = window.setTimeout(async () => {
         try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
            const response = await fetch(route('settings.email-templates.preview'), {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-CSRF-TOKEN': csrfToken,
               },
               body: JSON.stringify({
                  sub_type: template.sub_type,
                  subject: data.subject,
                  body: data.body,
               }),
            });

            if (!response.ok) {
               return;
            }

            const payload = await response.json();
            setPreviewHtml(payload.html ?? '');
            setPreviewSubject(payload.subject ?? data.subject);
         } catch {
            setPreviewHtml(template.preview_html ?? '');
            setPreviewSubject(data.subject);
         }
      }, 450);

      return () => window.clearTimeout(timeout);
   }, [data.body, data.subject, template.preview_html, template.sub_type]);

   return (
      <div className="space-y-6">
         <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="border-b bg-muted/20">
               <CardTitle className="text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <Label>Assunto do e-mail</Label>
                     <Input value={data.subject} onChange={(e) => setData('subject', e.target.value)} placeholder="Digite o assunto do e-mail" />
                     <InputError message={errors.subject} />
                  </div>

                  <div className="space-y-3">
                     <Label>Mensagem</Label>
                     <div className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
                        <TiptapEditor
                           ssr
                           output="html"
                           hideStatusBar
                           initialContent={data.body}
                           contentMinHeight={540}
                           contentMaxHeight={980}
                           slotBefore={<EmailTemplateToolbar />}
                           placeholder={{
                              paragraph: 'Escreva a mensagem do e-mail aqui...',
                              imageCaption: 'Legenda da imagem',
                           }}
                           onContentChange={(value) => setData('body', value as string)}
                        />
                     </div>
                     <InputError message={errors.body} />
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                     <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Placeholders</h3>
                        <div className="flex flex-wrap gap-2">
                           {availablePlaceholders.length ? (
                              availablePlaceholders.map((placeholder) => (
                                 <Badge key={placeholder} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                    {placeholder}
                                 </Badge>
                              ))
                           ) : (
                              <p className="text-sm text-muted-foreground">Este template não possui placeholders especiais.</p>
                           )}
                        </div>
                     </div>

                     <div className="rounded-2xl border border-border bg-slate-950 p-4 text-slate-100">
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Dica</h3>
                        <p className="text-sm leading-6 text-slate-300">
                           O conteúdo é salvo em HTML real e enviado como e-mail real. Você pode usar cores, fontes, tamanhos, tabelas, imagens e links.
                        </p>
                     </div>
                  </div>

                  <div className="flex justify-end">
                     <LoadingButton loading={processing} type="submit" className="rounded-xl bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800">
                        Salvar alterações
                     </LoadingButton>
                  </div>
               </form>
            </CardContent>
         </Card>

         <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="border-b bg-slate-950 text-white">
               <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">Prévia</p>
               <CardTitle className="mt-1 text-lg">{previewSubject || template.title}</CardTitle>
            </CardHeader>
            <CardContent className="bg-slate-100 p-4">
               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <iframe title={`Preview - ${template.title}`} srcDoc={previewHtml} className="h-[860px] w-full border-0 bg-white" sandbox="" />
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default EmailTemplateForm;
