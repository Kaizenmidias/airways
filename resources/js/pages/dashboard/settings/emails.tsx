import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Link } from '@inertiajs/react';
import { ArrowRight, Mail, PenLine } from 'lucide-react';
import { ReactNode } from 'react';

interface Props extends SharedData {
   templates: Settings<EmailTemplateFields>[];
}

const templateDescriptions: Record<string, string> = {
   verification: 'E-mail enviado quando o aluno cria a conta e precisa confirmar o endereço.',
   password_reset: 'Mensagem para redefinição de senha com link temporário.',
   change_email: 'Confirmação usada quando o aluno altera o e-mail cadastrado.',
   course_approval: 'Notificação enviada quando um curso é aprovado ou precisa de ajustes.',
   instructor_approval: 'Aviso sobre a solicitação de instrutor, aprovada ou rejeitada.',
};

const Emails = ({ templates }: Props) => {
   return (
      <section className="space-y-6 md:px-3">
         <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
               <Mail className="h-5 w-5" />
            </div>
            <div>
               <h1 className="text-2xl font-bold">Templates de e-mail</h1>
               <p className="text-sm text-muted-foreground">
                  Gerencie os templates automáticos enviados pela plataforma. Cada template abre um builder dedicado para edição.
               </p>
            </div>
         </div>

         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
               <article
                  key={template.id}
                  className="group rounded-3xl border border-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
               >
                  <div className="flex items-start justify-between gap-4">
                     <div className="space-y-2">
                        <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                           {template.sub_type.replaceAll('_', ' ')}
                        </div>
                        <h2 className="text-lg font-semibold leading-tight">{template.title}</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                           {templateDescriptions[template.sub_type] ?? 'Template automático do sistema.'}
                        </p>
                     </div>
                     <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                        <PenLine className="h-5 w-5" />
                     </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Assunto atual</p>
                     <p className="mt-2 text-sm leading-6 text-foreground">{template.fields?.subject}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                     <span className="text-xs text-muted-foreground">Clique para abrir o builder visual</span>
                     <Link
                        href={route('settings.email-templates.edit', { id: template.id })}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                     >
                        Editar
                        <ArrowRight className="h-4 w-4" />
                     </Link>
                  </div>
               </article>
            ))}
         </div>
      </section>
   );
};

Emails.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Emails;
