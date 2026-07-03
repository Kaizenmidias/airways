import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react';
import Section from '../section';
import { EditorialHeading, MetricValue, SectionCard } from './ui';

const Overview = () => {
   const { props } = usePage<IntroPageProps>();
   const overviewSection = getPageSection(props.page, 'overview');
   const stats = getPropertyArray(overviewSection).slice(0, 4);

   return (
      <Section customize={props.customize} pageSection={overviewSection} containerClass="py-10 lg:py-16">
         <SectionCard className="overflow-hidden">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1.45fr] lg:items-center lg:p-10">
               <EditorialHeading
                  eyebrow={overviewSection?.title || 'Diferenciais Airways'}
                  title={overviewSection?.sub_title || 'Formação aeronáutica com padrão corporativo e foco em carreira.'}
                  description={
                     overviewSection?.description ||
                     'Nossa escola combina conteúdo técnico, experiência de mercado e uma apresentação institucional mais clara para transmitir segurança, tecnologia e alto nível de formação.'
                  }
                  className="max-w-2xl"
               />

               <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.length > 0 ? (
                     stats.map((stat: any, index: number) => (
                        <MetricValue
                           key={`element-${index}`}
                           value={
                              <div className="flex items-baseline gap-2">
                                 <span>{stat.count}</span>
                                 {stat.icon && <Sparkles className="h-5 w-5 text-primary" />}
                              </div>
                           }
                           label={stat.title}
                        />
                     ))
                  ) : (
                     <>
                        <MetricValue value="100%" label="Foco institucional" />
                        <MetricValue value="24/7" label="Acesso ao conteúdo" />
                        <MetricValue value="+2.000" label="Alunos impactados" />
                        <MetricValue value="A+" label="Visão premium" />
                     </>
                  )}
               </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
               <div className="flex flex-col gap-3 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                     <span>Layout sem aparência de marketplace genérico, com foco em escola de aviação premium.</span>
                  </div>

                  <div className="flex items-center gap-2">
                     <BadgeCheck className="h-4 w-4 text-primary" />
                     <span>Builder e conteúdos dinâmicos continuam funcionando normalmente.</span>
                     <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
               </div>
            </div>
         </SectionCard>
      </Section>
   );
};

export default Overview;
