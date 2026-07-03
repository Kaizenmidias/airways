import RatingStars from '@/components/rating-stars';
import { Button } from '@/components/ui/button';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const { page } = props;
   const heroSection = getPageSection(page, 'hero');

   const backgroundImage = heroSection?.background_image || heroSection?.thumbnail || '/assets/images/intro/home-4/airways-hero.svg';
   const backgroundVideo = heroSection?.video_url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(heroSection.video_url) ? heroSection.video_url : null;

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass="!max-w-none !px-0 !pt-0"
         contentClass="relative isolate overflow-hidden"
         editorButtonClassName="top-[96px] right-6"
      >
         <div className="relative min-h-screen">
            <div className="absolute inset-0">
               {backgroundVideo ? (
                  <video
                     className="h-full w-full object-cover object-center"
                     src={backgroundVideo}
                     autoPlay
                     muted
                     loop
                     playsInline
                     poster={backgroundImage}
                  />
               ) : (
                  <img
                     src={backgroundImage}
                     alt={heroSection?.sub_title || heroSection?.title || 'Airways Academy'}
                     className="h-full w-full object-cover object-center"
                  />
               )}

               <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18)_0%,rgba(15,23,42,0.45)_35%,rgba(15,23,42,0.84)_100%)]" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.2),transparent_34%),radial-gradient(circle_at_right_center,rgba(30,41,59,0.16),transparent_24%)]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] items-start lg:items-center">
               <div className="w-full px-6 pt-[7.5rem] pb-20 sm:px-8 sm:pt-32 lg:px-12 lg:py-24">
                  <div className="max-w-3xl text-white">
                     <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur-md">
                        <span className="bg-primary h-2 w-2 rounded-full" />
                        <span>{'Airways Academy'}</span>
                     </div>

                     <h1 className="mt-6 max-w-4xl text-4xl leading-[1.03] font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.4rem]">
                        {heroSection?.title || 'Formação premium para profissionais da aviação.'}
                     </h1>

                     {heroSection?.description && <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{heroSection?.description}</p>}

                     <div className="mt-8 flex flex-wrap items-center gap-4">
                        {heroSection?.properties?.button_text_1 && (
                           <Button asChild className="h-12 rounded-full bg-[#FD122E] px-7 text-sm font-semibold text-white shadow-none hover:bg-[#d90f27]">
                              <Link href={heroSection?.properties?.button_link_1 || '#'}>{heroSection?.properties?.button_text_1}</Link>
                           </Button>
                        )}

                        {heroSection?.properties?.button_text_2 && (
                           <Button asChild variant="outline" className="h-12 rounded-full border-white/20 bg-white/8 px-7 text-sm font-semibold text-white shadow-none hover:bg-white/12">
                              <Link href={heroSection?.properties?.button_link_2 || '#'}>{heroSection?.properties?.button_text_2}</Link>
                           </Button>
                        )}
                     </div>
                     {heroSection?.properties?.ratings || heroSection?.properties?.subscribers ? (
                        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-200">
                           {heroSection?.properties?.ratings && (
                              <div className="flex items-center gap-2">
                                 <RatingStars rating={5} starClass="h-4 w-4" />
                                 <p className="font-medium text-white">{heroSection?.properties?.ratings}</p>
                              </div>
                           )}

                           {heroSection?.properties?.subscribers && <p className="text-sm text-slate-300">{heroSection?.properties?.subscribers}</p>}
                        </div>
                     ) : null}
                  </div>
               </div>
            </div>
         </div>
      </Section>
   );
};

export default Hero;
