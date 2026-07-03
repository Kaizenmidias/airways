import SubscribeInput from '@/components/subscribe-input';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Section from '../section';
import { SectionCard } from './ui';

const CallToAction = () => {
   const { props } = usePage<IntroPageProps>();
   const ctaSection = getPageSection(props.page, 'call_to_action');

   return (
      <Section customize={props.customize} pageSection={ctaSection} containerClass="py-12 lg:py-16">
         <SectionCard className="overflow-hidden border-slate-900 bg-slate-950 text-white">
            <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-12 lg:py-14">
               <div className="space-y-5">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                     <Sparkles className="h-4 w-4 text-primary" />
                     Comunicação institucional
                  </div>

                  <h2 className="max-w-2xl text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-4xl">{ctaSection?.title}</h2>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{ctaSection?.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                     <span className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Conteúdo próprio
                     </span>
                     <span className="inline-flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        Editor do CMS preservado
                     </span>
                  </div>
               </div>

               <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <SubscribeInput buttonText={ctaSection?.properties?.button_text} />
               </div>
            </div>
         </SectionCard>
      </Section>
   );
};

export default CallToAction;
