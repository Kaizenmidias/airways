import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

interface EmailTemplateFormProps {
   template: Settings<EmailTemplateFields>;
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

   const availablePlaceholders = placeholders[template.sub_type] ?? [];

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.email-templates.update', { id: template.id }), {
         preserveScroll: true,
      });
   };

   return (
      <Card className="border-border/60 shadow-sm">
         <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg">{template.title}</CardTitle>
         </CardHeader>
         <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <Label>Assunto do e-mail</Label>
                     <Input value={data.subject} onChange={(e) => setData('subject', e.target.value)} placeholder="Digite o assunto do e-mail" />
                     <InputError message={errors.subject} />
                  </div>

                  <div className="space-y-2">
                     <Label>Mensagem</Label>
                     <Textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Digite o conteúdo do e-mail usando HTML e variáveis Blade"
                        className="min-h-[520px] font-mono text-sm"
                     />
                     <InputError message={errors.body} />
                     <p className="text-xs text-muted-foreground">
                        Você pode usar HTML e variáveis Blade, como <code>{'{{ $user->name }}'}</code> e <code>{'{{ $url }}'}</code>.
                     </p>
                  </div>

                  <div className="flex justify-end">
                     <LoadingButton loading={processing} type="submit">
                        Salvar alterações
                     </LoadingButton>
                  </div>
               </div>

               <div className="space-y-4">
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
                        O conteúdo é salvo exatamente como você escrever. Se o template ficar inválido, o sistema usa o e-mail padrão como fallback.
                     </p>
                  </div>
               </div>
            </form>
         </CardContent>
      </Card>
   );
};

export default EmailTemplateForm;
