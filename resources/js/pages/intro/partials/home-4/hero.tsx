import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronRight, Plane, Sparkles, Star } from 'lucide-react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const { page } = props;
   const heroSection = getPageSection(page, 'hero');
   const heroImage = heroSection?.thumbnail || '/assets/aviao.png';
   const heroAvatars = getPropertyArray(heroSection).slice(0, 4);
   const backgroundImage = heroSection?.background_image || '/assets/images/intro/home-4/hero-bg.png';
   const backgroundVideo = heroSection?.video_url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(heroSection.video_url) ? heroSection.video_url : null;

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass="!max-w-none !px-4 !pt-4 sm:!px-6 lg:!px-8"
         contentClass="relative isolate overflow-hidden rounded-[30px] border border-white/10 bg-[#07111f] shadow-[0_32px_120px_rgba(0,0,0,0.45)]"
      >
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.24),transparent_30%),radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,#050915_0%,#07111f_45%,#0b1321_100%)]" />
         <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

         <div className="relative z-10 grid min-h-[calc(100vh-1.5rem)] grid-cols-1 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative flex items-center overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(253,18,46,0.28),transparent_25%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_22%)]" />

               <div className="relative max-w-3xl text-white">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/90 backdrop-blur-xl">
                     <Sparkles className="h-3.5 w-3.5 text-primary" />
                     <span>{heroSection?.title || 'Airways Academy'}</span>
                  </div>

                  <h1 className={cn('mt-6 max-w-3xl text-4xl leading-[0.98] font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.9rem]')}>
                     {heroSection?.sub_title || 'Sua Carreira na Aviação Começa Aqui'}
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200/90 sm:text-lg">
                     {heroSection?.description || 'Aprenda com especialistas da aviação, desenvolva conhecimentos práticos e prepare-se para os desafios do setor aeronáutico com cursos e treinamentos online de alta qualidade.'}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                     {heroSection?.properties?.button_text_1 && (
                        <Button asChild className="h-12 rounded-full bg-[#FD122E] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(253,18,46,0.35)] hover:bg-[#e6112b]">
                           <Link href={heroSection?.properties?.button_link_1 || '#'}>{heroSection?.properties?.button_text_1}</Link>
                        </Button>
                     )}

                     {heroSection?.properties?.button_text_2 && (
                        <Button asChild variant="outline" className="h-12 rounded-full border-white/15 bg-white/10 px-7 text-sm font-semibold text-white shadow-none backdrop-blur-xl hover:bg-white/15 hover:text-white">
                           <Link href={heroSection?.properties?.button_link_2 || '#'}>
                              {heroSection?.properties?.button_text_2}
                              <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                     )}
                  </div>

                  {heroSection?.properties?.ratings || heroSection?.properties?.subscribers ? (
                     <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                        {heroSection?.properties?.ratings && (
                           <div className="flex items-center gap-3 text-white/90">
                              <RatingStars rating={5} starClass="h-4 w-4" />
                              <p className="text-sm font-semibold">
                                 {heroSection?.properties?.ratings}
                                 <span className="font-normal text-slate-300"> Mais de 2.000 alunos e profissionais impactados</span>
                              </p>
                           </div>
                        )}

                        {heroSection?.properties?.subscribers && <p className="text-sm text-slate-300">{heroSection?.properties?.subscribers}</p>}
                     </div>
                  ) : null}

                  <div className="mt-8 flex items-center gap-4">
                     <div className="flex -space-x-3 *:ring-2 *:ring-[#0b1220]">
                        {heroAvatars.map((item, index) => (
                           <Avatar key={`${item.image || 'avatar'}-${index}`} className="h-11 w-11 border border-white/10 bg-white/5">
                              <AvatarImage src={item.image || ''} alt={item.name || `Aluno ${index + 1}`} className="object-cover" />
                              <AvatarFallback>AA</AvatarFallback>
                           </Avatar>
                        ))}
                     </div>

                     <div className="text-sm text-slate-300">
                        <p className="font-medium text-white/90">Formação com foco prático e visual premium.</p>
                        <p className="mt-1">Edição completa disponível no CMS/Builder.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden bg-[#0f1b2f] lg:min-h-[780px]">
               {backgroundVideo ? (
                  <video className="absolute inset-0 h-full w-full object-cover object-center" src={backgroundVideo} autoPlay muted loop playsInline poster={backgroundImage} />
               ) : (
                  <img src={heroImage} alt={heroSection?.sub_title || heroSection?.title || 'Airways Academy'} className="absolute inset-0 h-full w-full object-cover object-center" />
               )}

               <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,23,0.1)_0%,rgba(8,13,23,0.22)_50%,rgba(8,13,23,0.35)_100%)]" />
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_75%,rgba(253,18,46,0.38),transparent_16%),radial-gradient(circle_at_68%_14%,rgba(255,255,255,0.16),transparent_18%)]" />

               <div className="absolute inset-x-6 top-6 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl sm:inset-x-8 sm:top-8">
                  <div className="flex items-center justify-between gap-4 text-white">
                     <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                           <Plane className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Airways</p>
                           <p className="text-sm font-semibold">Academy</p>
                        </div>
                     </div>

                     <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 md:flex">
                        <Star className="h-3.5 w-3.5 fill-current text-[#facc15]" />
                        Landing page editável no Builder
                     </div>
                  </div>
               </div>

               <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
                  <div className="max-w-[16rem] rounded-2xl border border-white/10 bg-[#08111d]/65 px-4 py-3 text-white backdrop-blur-xl">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">Destaque</p>
                     <p className="mt-2 text-sm leading-6 text-slate-100">A foto do avião é carregada do CMS e pode ser trocada sem perder o layout.</p>
                  </div>

                  <div className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-white/80 backdrop-blur-xl lg:flex">
                     <ChevronRight className="mr-2 h-4 w-4" />
                     Arraste para explorar
                  </div>
               </div>
            </div>
         </div>
      </Section>
   );
};

export default Hero;
