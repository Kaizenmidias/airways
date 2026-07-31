import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import EmailTemplateToolbar from './email-template-toolbar';

const FORM_ID = 'email-template-builder-form';

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
      <section className="space-y-6 md:px-3">
         <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
               <Link
                  href={route('settings.email-templates')}
                  className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-foreground transition-colors hover:bg-muted"
               >
                  <ArrowLeft className="h-5 w-5" />
               </Link>
               <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                     <h1 className="text-2xl font-bold">Editar template de e-mail</h1>
                     <Badge variant="secondary" className="rounded-full">
                        {template.sub_type.replaceAll('_', ' ')}
                     </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                     Assunto e corpo ficam salvos neste template. O editor abaixo salva HTML real para os e-mails automáticos.
                  </p>
               </div>
            </div>

            <LoadingButton
               form={FORM_ID}
               loading={processing}
               type="submit"
               className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800"
            >
               Salvar template
            </LoadingButton>
         </div>

         <form id={FORM_ID} onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-6">
               <Card className="overflow-hidden border-border/60 shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                     <CardTitle className="text-base">Configurações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                     <div className="space-y-2">
                        <Label>Assunto do e-mail</Label>
                        <Input
                           value={data.subject}
                           onChange={(e) => setData('subject', e.target.value)}
                           placeholder="Digite o assunto do e-mail"
                        />
                        <InputError message={errors.subject} />
                     </div>

                     <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Template</p>
                        <p className="mt-2 text-sm leading-6 text-foreground">{template.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                           Este template é usado para automatizar mensagens do sistema.
                        </p>
                     </div>
                  </CardContent>
               </Card>

               <Card className="overflow-hidden border-border/60 shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                     <CardTitle className="text-base">Placeholders</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
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
                  </CardContent>
               </Card>

               <Card className="overflow-hidden border-border/60 shadow-sm">
                  <CardHeader className="border-b bg-slate-950 text-white">
                     <CardTitle className="text-base">Dica</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                     <p className="text-sm leading-6 text-muted-foreground">
                        Use o editor visual para criar mensagens com cores, links, imagens, listas e tabelas.
                        O conteúdo final será salvo como HTML e enviado exatamente como está no e-mail.
                     </p>
                  </CardContent>
               </Card>
            </div>

            <div className="space-y-6">
               <Card className="overflow-hidden border-border/60 shadow-sm">
                  <CardHeader className="border-b bg-slate-950 text-white">
                     <CardTitle className="text-base">Conteúdo do e-mail</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-5">
                     <div className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
                        <TiptapEditor
                           ssr
                           output="html"
                           hideMenuBar
                           hideStatusBar
                           initialContent={data.body}
                           contentMinHeight={860}
                           contentMaxHeight={1200}
                           slotBefore={<EmailTemplateToolbar />}
                           placeholder={{
                              paragraph: 'Comece a editar seu e-mail...',
                              imageCaption: 'Legenda da imagem',
                           }}
                           onContentChange={(value) => setData('body', value as string)}
                        />
                     </div>

                     <InputError message={errors.body} />
                  </CardContent>
               </Card>

               <Card className="overflow-hidden border-border/60 shadow-sm">
                  <CardHeader className="border-b bg-slate-950 text-white">
                     <CardTitle className="text-base">Prévia ao vivo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 bg-slate-100 p-4">
                     <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Assunto</p>
                        <p className="mt-2 text-sm font-medium text-foreground">{previewSubject || template.title}</p>
                     </div>

                     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <iframe
                           title={`Preview - ${template.title}`}
                           srcDoc={previewHtml}
                           className="h-[860px] w-full border-0 bg-white"
                           sandbox=""
                        />
                     </div>
                  </CardContent>
               </Card>
            </div>
         </form>
      </section>
   );
};

export default EmailTemplateForm;
