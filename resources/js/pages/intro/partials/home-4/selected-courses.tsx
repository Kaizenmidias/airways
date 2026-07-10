import CourseCard1 from '@/components/cards/course-card-1';
import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Section from '../section';

const SelectedCourses = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, selectedCourses, customize } = props;
   const selectedCoursesSection = getPageSection(page, 'selected_courses');
   const [api, setApi] = useState<CarouselApi>();
   const [currentSlide, setCurrentSlide] = useState(0);

   useEffect(() => {
      if (!api) {
         return;
      }

      const handleSelect = () => {
         setCurrentSlide(api.selectedScrollSnap());
      };

      api.on('select', handleSelect);

      return () => {
         api.off('select', handleSelect);
      };
   }, [api]);

   return (
      <Section customize={customize} pageSection={selectedCoursesSection} containerClass="!w-full !max-w-none !px-0 overflow-hidden" contentClass="relative isolate w-full">
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(253,18,46,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#02070f_0%,#06101d_48%,#02070f_100%)]" />
         <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:26px_26px] opacity-40" />

         <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-14 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
               <p className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#FD122E]">
                  <span className="h-[2px] w-8 rounded-full bg-[#FD122E]" />
                  <span>{selectedCoursesSection?.title || 'CURSOS SELECIONADOS'}</span>
               </p>
               <h2 className="text-3xl leading-[0.98] font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-[4.5rem]">
                  {selectedCoursesSection?.sub_title || 'Escolha os cursos que vão aparecer na home'}
               </h2>
               <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  {selectedCoursesSection?.description || 'Selecione no Builder os cursos que você quer exibir neste carrossel da página inicial.'}
               </p>
            </div>

            <div className="relative mt-12">
               {selectedCourses && selectedCourses.length > 0 ? (
                  <Carousel
                     setApi={setApi}
                     className="relative z-10"
                     opts={{
                        align: 'start',
                        loop: true,
                        slidesToScroll: 1,
                     }}
                     plugins={[Autoplay({ delay: 3500 })]}
                  >
                     <CarouselContent>
                        {selectedCourses.map((course) => (
                           <CarouselItem key={course.id} className="basis-full md:basis-1/2 xl:basis-1/3">
                              <div className="h-full px-1.5 py-0.5">
                                 <CourseCard1 course={course} className="h-full" />
                              </div>
                           </CarouselItem>
                        ))}
                     </CarouselContent>
                  </Carousel>
               ) : (
                  <div className="rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-slate-200 backdrop-blur-md">
                     <p className="text-lg font-medium">Nenhum curso foi selecionado ainda.</p>
                     <p className="mt-2 text-sm text-slate-400">Abra o Builder e escolha os cursos deste carrossel no campo Contents.</p>
                  </div>
               )}

               <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-center gap-2.5">
                     {api &&
                        selectedCourses.map(({ id }, index) => (
                           <div
                              key={id}
                              className={cn(
                                 'cursor-pointer rounded-full transition-all duration-200',
                                 currentSlide === index ? 'bg-primary h-2 w-4' : 'h-2 w-2 bg-gray-300',
                              )}
                              onClick={() => api.scrollTo(index)}
                           />
                        ))}
                  </div>

                  <div className="space-x-4">
                     <Button
                        size="icon"
                        variant="outline"
                        disabled={!api?.canScrollPrev()}
                        onClick={() => api?.scrollPrev()}
                        className="border-white/12 bg-white/5 text-white hover:border-primary hover:bg-white/10 hover:text-white"
                     >
                        <ChevronLeft />
                     </Button>
                     <Button
                        size="icon"
                        variant="outline"
                        disabled={!api?.canScrollNext()}
                        onClick={() => api?.scrollNext()}
                        className="border-white/12 bg-white/5 text-white hover:border-primary hover:bg-white/10 hover:text-white"
                     >
                        <ChevronRight />
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </Section>
   );
};

export default SelectedCourses;
