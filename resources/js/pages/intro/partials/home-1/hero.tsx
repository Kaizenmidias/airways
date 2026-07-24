import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PublicContainer from '@/components/public/public-container';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Play } from 'lucide-react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const heroSection = getPageSection(props.page, 'hero');
   const stats = [
      { value: heroSection?.properties?.ratings || '4.9/5', label: 'Student rating' },
      { value: heroSection?.properties?.subscribers || '1,200+', label: 'Learners trained' },
      { value: 'Professional', label: 'Aviation focus' },
   ];

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass="!max-w-none !px-0 !pt-0"
         contentClass="relative overflow-hidden"
      >
         <div className="relative min-h-[calc(100vh-80px)]">
            <div className="absolute inset-0">
               {heroSection?.thumbnail ? (
                  <img
                     src={heroSection?.thumbnail}
                     alt={heroSection?.sub_title || heroSection?.title || 'Airways Academy'}
                     className="h-full w-full object-cover object-center"
                  />
               ) : null}
               <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.2)_0%,rgba(15,23,42,0.45)_32%,rgba(15,23,42,0.82)_100%)]" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.18),transparent_34%),radial-gradient(circle_at_right_center,rgba(30,41,59,0.12),transparent_24%)]" />
            </div>

            <PublicContainer className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col justify-between py-10 lg:py-12">
               <div className="max-w-3xl pt-16 text-white sm:pt-20 lg:pt-24">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur-md">
                     <span className="bg-primary h-2 w-2 rounded-full" />
                     <span>{heroSection?.title || 'Airways Academy'}</span>
                  </div>

                  <h1 className="mt-6 max-w-4xl text-4xl leading-[1.03] font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[5.2rem]">
                     {heroSection?.sub_title || 'Training aviation professionals with premium standards.'}
                  </h1>

                  {heroSection?.description && <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{heroSection?.description}</p>}

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                     {heroSection?.properties?.button_text && (
                        <Button asChild className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-white shadow-none hover:bg-primary/90">
                           <Link href={heroSection?.properties?.button_link || ''}>{heroSection?.properties?.button_text}</Link>
                        </Button>
                     )}

                     <button className="inline-flex h-12 items-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 text-sm font-semibold text-white backdrop-blur-md">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                           <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </span>
                        Explore the academy
                     </button>
                  </div>

                  <div className="mt-10 grid gap-3 sm:grid-cols-3">
                     {stats.map((item) => (
                        <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-md">
                           <p className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.value}</p>
                           <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{item.label}</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex items-end justify-between gap-8 pb-4 text-white/90">
                  <div className="flex items-center gap-4">
                     <div className="*:data-[slot=avatar]:ring-background flex -space-x-4 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                        {getPropertyArray(heroSection)
                           .filter((item) => Boolean(item.image))
                           .slice(0, 4)
                           .map((item, index) => (
                           <Avatar key={index} className="h-11 w-11">
                              <AvatarImage src={item.image || ''} alt={item.name} className="object-cover" />
                              <AvatarFallback>IM</AvatarFallback>
                           </Avatar>
                        ))}
                     </div>

                     <div>
                        {heroSection?.properties?.ratings && (
                           <div className="flex items-center gap-2">
                              <RatingStars rating={5} starClass="h-4 w-4" />
                              <p className="font-medium">{heroSection?.properties?.ratings}</p>
                           </div>
                        )}
                        {heroSection?.properties?.subscribers && <p className="text-sm text-slate-300">{heroSection?.properties?.subscribers}</p>}
                     </div>
                  </div>

                  <div className="hidden items-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur-md lg:flex">
                     <ChevronDown className="h-4 w-4" />
                     Scroll for more
                  </div>
               </div>
            </PublicContainer>
         </div>
      </Section>
   );
};

export default Hero;
