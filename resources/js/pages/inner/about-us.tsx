import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import SectionEditor from '@/components/section-editor';
import { Button } from '@/components/ui/button';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import Section from '@/pages/intro/partials/section';
import { usePage } from '@inertiajs/react';
import { Check, Pencil } from 'lucide-react';
import { InnerPageProps } from '.';

type Pillar = {
   title?: string;
   description?: string;
};

const fallbackPillars: Pillar[] = [
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
   const pillarsSection = getPageSection(innerPage, 'success_statistics');
   const pillarsImage = pillarsSection?.thumbnail || '/assets/images/team-1.jpg';
   const pillars = (pillarsSection?.properties?.array as Pillar[] | undefined)?.filter((item) => Boolean(item?.title || item?.description))?.length
      ? ((pillarsSection?.properties?.array as Pillar[]) || fallbackPillars)
      : fallbackPillars;

   const heroBackgroundImage = heroSection?.background_image || '/assets/images/intro/home-4/hero-bg.png';
   const heroBackgroundVideo = heroSection?.video_url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(heroSection.video_url) ? heroSection.video_url : null;

   return (
      <div className="about-us-page bg-[#f4f7fb] text-slate-900">
         <section className="relative isolate overflow-hidden border-b border-white/10 bg-slate-950">
            {heroBackgroundVideo ? (
               <video
                  key={heroBackgroundVideo}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={heroBackgroundVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
               />
            ) : (
               <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
                  aria-hidden="true"
               />
            )}

            <div className="absolute inset-0 bg-[#071A3D]/72" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(88,140,255,0.22),transparent_26%),radial-gradient(circle_at_82%_28%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(180deg,rgba(7,26,61,0.18)_0%,rgba(7,26,61,0.58)_100%)]" />

            <Section customize={false} pageSection={heroSection} containerClass="!max-w-none !px-0" contentClass="relative">
               {customize && heroSection && (
                  <div className="absolute top-24 right-5 z-[70] pointer-events-auto sm:top-28 md:top-32">
                     <SectionEditor
                        section={heroSection}
                        actionComponent={
                           <Button
                              size="icon"
                              variant="secondary"
                              className="h-11 w-11 rounded-full bg-white/90 text-slate-900 shadow-[0_12px_40px_rgba(2,6,23,0.2)] ring-1 ring-black/10 backdrop-blur hover:bg-white"
                           >
                              <Pencil className="h-5 w-5" />
                           </Button>
                        }
                     />
                  </div>
               )}

               <div className="relative mx-auto flex min-h-[520px] max-w-[1600px] items-end px-5 pb-20 pt-28 sm:min-h-[560px] sm:pb-24 md:min-h-[620px] md:px-10 lg:px-14">
                  <div className="max-w-[1100px] space-y-5">
                     <h1 className="max-w-[1050px] text-[clamp(2.5rem,4vw,4.75rem)] leading-[0.95] font-normal tracking-[-0.06em] text-white [text-shadow:0_4px_18px_rgba(2,6,23,0.55)]">
                        {heroSection?.title || 'Sobre nós'}
                     </h1>
                     <div className="h-1.5 w-16 rounded-full bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.25)]" />
                  </div>
               </div>
            </Section>
         </section>

         <section className="bg-white">
            <Section customize={customize} pageSection={pillarsSection} containerClass="!max-w-none !px-0" contentClass="relative">
               <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-center">
                     <div className="max-w-[52rem] space-y-4 about-us-reveal">
                        <p className="text-[11px] font-normal tracking-[0.34em] text-[#1d3f7b] uppercase">Nossa identidade</p>
                        <h2 className="text-[clamp(2rem,3vw,3.5rem)] leading-[0.98] font-normal tracking-[-0.06em] text-slate-950">
                           {pillarsSection?.title || 'Missão, visão e valores'}
                        </h2>
                        {pillarsSection?.description && (
                           <div
                              className={cn(
                                 'max-w-[52rem] text-[16px] leading-8 font-normal text-slate-600',
                                 '[&_p]:mb-5 [&_p]:text-[16px] [&_p]:font-normal [&_p]:leading-8 [&_p]:text-slate-600',
                              )}
                           >
                              <TiptapRenderer>{pillarsSection.description}</TiptapRenderer>
                           </div>
                        )}

                        <div className="space-y-3 pt-2">
                           {pillars.map((pillar, index) => {
                              const bulletText = [pillar.title, pillar.description].filter(Boolean).join(' - ');

                              return (
                                 <div
                                    key={`${pillar.title || 'pillar'}-${index}`}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] about-us-reveal"
                                    style={{ animationDelay: `${index * 120}ms` }}
                                 >
                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d3f7b] text-white">
                                       <Check className="h-4 w-4" />
                                    </div>
                                    <p className="text-[16px] leading-7 font-normal text-slate-700">{bulletText}</p>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.10)] about-us-float">
                        <img
                           src={pillarsImage}
                           alt={pillarsSection?.title || 'Idealizador do projeto'}
                           className="h-full min-h-[420px] w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,61,0.02)_0%,rgba(7,26,61,0.10)_100%)]" />
                     </div>
                  </div>

                  <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-3">
                     {pillars.map((pillar, index) => (
                        <article
                           key={`${pillar.title || 'pillar'}-${index}`}
                           className="group rounded-[28px] border border-slate-200 bg-[#f8fafc] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1 about-us-reveal"
                           style={{ animationDelay: `${index * 120}ms` }}
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
