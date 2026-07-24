import RatingStars from '@/components/rating-stars';
import { Button } from '@/components/ui/button';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { type CSSProperties } from 'react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const { page } = props;
   const heroSection = getPageSection(page, 'hero');
   const heroImage = heroSection?.thumbnail || '';
   const backgroundImage = heroSection?.background_image || '';
   const backgroundVideo = heroSection?.video_url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(heroSection.video_url) ? heroSection.video_url : null;
   const sectionBackground = heroSection?.background_color || '#06101d';
   const heroBackdrop = backgroundImage || heroImage || '';
   const sectionStyle: CSSProperties = {
      backgroundColor: sectionBackground,
      backgroundImage: backgroundVideo ? undefined : heroBackdrop ? `url('${heroBackdrop}')` : undefined,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
   };
   const logos = getPropertyArray(heroSection)
      .filter((partner) => Boolean(partner.image))
      .slice(0, 6);

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass="!max-w-none !px-0 !pt-0"
         containerStyle={sectionStyle}
         contentClass="relative isolate overflow-hidden"
         editorButtonClassName="top-[96px] right-6"
      >
         {backgroundVideo ? (
            <video
               className="absolute inset-0 h-full w-full object-cover object-center"
               src={backgroundVideo}
               autoPlay
               muted
               loop
               playsInline
               poster={heroBackdrop || undefined}
            />
         ) : null}

         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.34),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_50%_110%,rgba(253,18,46,0.18),transparent_16%),linear-gradient(135deg,#050b16_0%,#06101d_44%,#071425_100%)]" />
         <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:28px_28px] opacity-25" />

         <div className="relative z-10 mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 pt-[118px] sm:pt-[136px] lg:grid-cols-[1.02fr_0.98fr] lg:pt-0">
            <div className="relative order-1 flex items-center px-6 py-8 pb-12 sm:px-10 sm:py-16 sm:pb-14 lg:order-1 lg:px-14 lg:py-20 lg:pb-20">
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(253,18,46,0.22),transparent_24%),radial-gradient(circle_at_72%_70%,rgba(253,18,46,0.18),transparent_20%)] blur-2xl" />

               <div className="relative max-w-3xl text-white">
                  <h1 className="max-w-[680px] text-3xl leading-[1] font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-[4.15rem] lg:leading-[0.96]">
                     {heroSection?.title || 'Sua Carreira na Aviação Começa Aqui'}
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200/90 sm:text-lg">
                     {heroSection?.description ||
                        'Aprenda com especialistas da aviação, desenvolva conhecimentos práticos e prepare-se para os desafios do setor aeronáutico com cursos e treinamentos online de alta qualidade.'}
                  </p>

                  <div className="mt-8 flex flex-nowrap gap-3 sm:flex-wrap sm:gap-4">
                     {heroSection?.properties?.button_text_1 && (
                        <div className="relative flex-1 sm:flex-none">
                           <span className="pointer-events-none absolute -inset-6 rounded-full bg-[#FD122E]/40 blur-3xl" />
                           <Button
                              asChild
                              className="relative h-12 w-full rounded-full bg-[#FD122E] px-4 text-sm font-semibold whitespace-nowrap text-white shadow-[0_0_22px_rgba(253,18,46,0.8),0_0_48px_rgba(253,18,46,0.4),0_18px_45px_rgba(253,18,46,0.38)] transition-shadow hover:bg-[#e6112b] hover:shadow-[0_0_28px_rgba(253,18,46,0.9),0_0_60px_rgba(253,18,46,0.45),0_22px_55px_rgba(253,18,46,0.45)] sm:w-auto sm:px-7"
                           >
                              <Link href={heroSection?.properties?.button_link_1 || '#'}>{heroSection?.properties?.button_text_1}</Link>
                           </Button>
                        </div>
                     )}

                     {heroSection?.properties?.button_text_2 && (
                        <Button
                           asChild
                           variant="outline"
                           className="h-12 flex-1 rounded-full border-white/18 bg-white/10 px-4 text-sm font-semibold whitespace-nowrap text-white shadow-none backdrop-blur-xl hover:bg-white/15 hover:text-white sm:flex-none sm:px-7"
                        >
                           <Link href={heroSection?.properties?.button_link_2 || '#'}>
                              {heroSection?.properties?.button_text_2}
                              <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                     )}
                  </div>

                  {heroSection?.properties?.ratings || heroSection?.properties?.subscribers ? (
                     <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-200">
                        {heroSection?.properties?.ratings && (
                           <div className="flex items-center gap-2">
                              <RatingStars rating={5} starClass="h-4 w-4" />
                              <p className="font-medium text-white">{heroSection?.properties?.ratings}</p>
                           </div>
                        )}

                        {heroSection?.properties?.subscribers && <p className="text-sm text-slate-300">{heroSection?.properties?.subscribers}</p>}
                     </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4 opacity-95 sm:gap-x-7">
                     {logos.map((partner, index) => (
                        <img
                           key={`${partner.name || partner.image || 'partner'}-${index}`}
                           src={partner.image || ''}
                           alt={partner.name || `Partner ${index + 1}`}
                           className="h-5 w-auto opacity-90 brightness-0 invert sm:h-6"
                        />
                     ))}
                  </div>
               </div>
            </div>

            <div className="relative order-2 flex min-h-[420px] items-end justify-center px-6 pt-4 pb-6 sm:px-10 sm:pt-6 sm:pb-8 lg:order-2 lg:min-h-[720px] lg:items-center lg:justify-end lg:px-8 lg:py-10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(253,18,46,0.22),transparent_16%),radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.08),transparent_14%)]" />
            </div>
         </div>
      </Section>
   );
};

export default Hero;
