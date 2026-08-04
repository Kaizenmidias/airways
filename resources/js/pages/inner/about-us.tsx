import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import Section from '@/pages/intro/partials/section';
import { usePage } from '@inertiajs/react';
import { InnerPageProps } from '.';

const defaultPillars = [
   {
      title: 'Missão',
      description:
         'Criar uma experiência digital clara, confiável e útil, aproximando pessoas de conteúdos, serviços e informações que realmente fazem diferença.',
   },
   {
      title: 'Visão',
      description:
         'Evoluir como uma referência de jornada digital leve e elegante, com uma presença consistente em todo o site e foco total na experiência do usuário.',
   },
   {
      title: 'Valores',
      description:
         'Simplicidade, transparência, consistência visual e compromisso com uma navegação acessível, rápida e bem organizada.',
   },
];

const AboutUs = () => {
   const { props } = usePage<InnerPageProps>();
   const { innerPage, customize } = props;

   const heroSection = getPageSection(innerPage, 'hero');
   const valuesSection = getPageSection(innerPage, 'success_statistics');

   const heroImage = heroSection?.properties?.array?.[0]?.image || valuesSection?.properties?.array?.[0]?.image || '/assets/aviao.png';

   return (
      <div className="about-us-page bg-[#f4f7fb] text-slate-900">
         <section className="relative overflow-hidden border-b border-slate-200/70 bg-[url('/assets/images/intro/home-1/bg-line.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[#071A3D]/70" />

            <Section customize={customize} pageSection={heroSection} containerClass="!max-w-none !px-0" contentClass="relative">
               <div className="relative mx-auto flex min-h-[340px] max-w-[1280px] items-center px-5 py-20 md:min-h-[420px] md:py-28 lg:px-8">
                  <div className="max-w-3xl space-y-4">
                     <h1 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.95] font-normal tracking-[-0.06em] text-white">
                        {heroSection?.title || 'Sobre nós'}
                     </h1>
                     <div className="h-1 w-16 rounded-full bg-white/90" />
                  </div>
               </div>
            </Section>
         </section>

         <section className="bg-white">
            <Section customize={customize} pageSection={valuesSection} containerClass="!max-w-none !px-0" contentClass="relative">
               <div className="mx-auto max-w-[1280px] px-5 py-16 md:py-24 lg:px-8">
                  <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
                     <div className="space-y-4">
                        <p className="text-[11px] font-normal tracking-[0.34em] text-[#1d3f7b] uppercase">Nossa identidade</p>
                        <h2 className="text-[clamp(2rem,3vw,3.5rem)] leading-[0.98] font-normal tracking-[-0.06em] text-slate-950">
                           {valuesSection?.title || 'Missão, visão e valores'}
                        </h2>
                        {valuesSection?.description && (
                           <div
                              className={cn(
                                 'max-w-[50rem] text-[16px] leading-8 font-normal text-slate-600',
                                 '[&_p]:mb-5 [&_p]:text-[16px] [&_p]:font-normal [&_p]:leading-8 [&_p]:text-slate-600',
                              )}
                           >
                              <TiptapRenderer>{valuesSection.description}</TiptapRenderer>
                           </div>
                        )}
                     </div>

                     <div className="relative">
                        <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[36px] bg-[#dce6f1]" />
                        <div className="relative overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
                           <img src={heroImage} alt={heroSection?.title || innerPage.name} className="h-[360px] w-full object-cover object-center md:h-[500px]" />
                        </div>
                     </div>
                  </div>

                  <div className="mt-10 grid gap-6 lg:grid-cols-3">
                     {defaultPillars.map((pillar, index) => (
                        <article
                           key={pillar.title}
                           className="group rounded-[28px] border border-slate-200 bg-[#f8fafc] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1"
                        >
                           <div className="mb-6 flex items-center gap-3">
                              <span className="h-3 w-3 rounded-full bg-[#1d3f7b]" />
                              <span className="text-[11px] tracking-[0.28em] text-slate-500 uppercase">0{index + 1}</span>
                           </div>

                           <h3 className="text-2xl leading-tight font-normal tracking-[-0.04em] text-slate-950">{pillar.title}</h3>
                           <p className="mt-4 text-[16px] leading-8 font-normal text-slate-600">{pillar.description}</p>
                        </article>
                     ))}
                  </div>
               </div>
            </Section>
         </section>
      </div>
   );
};

export default AboutUs;
