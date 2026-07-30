import Tabs from '@/components/tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/dashboard/layout';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { ReactNode } from 'react';
import EmailTemplateForm from './partials/email-template-form';

interface Props extends SharedData {
   templates: Settings<EmailTemplateFields>[];
}

const Emails = ({ templates }: Props) => {
   const { url } = usePage<SharedData>();
   const params = getQueryParams(url);

   const tabs = templates.map((template) => ({
      ...template,
      Component: EmailTemplateForm,
   }));

   return (
      <section className="space-y-6 md:px-3">
         <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
               <Mail className="h-5 w-5" />
            </div>
            <div>
               <h1 className="text-2xl font-bold">Templates de e-mail</h1>
               <p className="text-sm text-muted-foreground">
                  Edite os e-mails automáticos enviados pela plataforma. HTML e variáveis Blade são aceitos.
               </p>
            </div>
         </div>

         <Tabs value={params['tab'] ?? tabs[0]?.sub_type} className="grid grid-rows-1 gap-5 md:grid-cols-4">
            <div>
               <TabsList className="horizontal-tabs-list">
                  {tabs.map(({ id, title, sub_type }) => (
                     <TabsTrigger
                        key={id}
                        value={sub_type}
                        className="horizontal-tabs-trigger"
                        onClick={() =>
                           router.get(
                              route('settings.email-templates', {
                                 tab: sub_type,
                              }),
                           )
                        }
                     >
                        {title}
                     </TabsTrigger>
                  ))}
               </TabsList>
            </div>

            <div className="md:col-span-3">
               {tabs.map((template) => (
                  <TabsContent key={template.id} value={template.sub_type} className="m-0">
                     <template.Component template={template} />
                  </TabsContent>
               ))}
            </div>
         </Tabs>
      </section>
   );
};

Emails.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Emails;
