import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Quote, Star, Users2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const Testimonials = () => {
   const { props } = usePage<IntroPageProps>();
   const { customize } = props;
   const [api, setApi] = useState<CarouselApi>();
   const [currentSlide, setCurrentSlide] = useState(0);
   const testimonialsSection = getPageSection(props.page, 'testimonials');
   const testimonials = getPropertyArray(testimonialsSection);

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
      <Section customize={customize} pageSection={testimonialsSection} containerClass="py-12 lg:py-16">
         <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="space-y-8">
               <EditorialHeading
                  eyebrow={testimonialsSection?.title || 'Confiança dos alunos'}
                  title={testimonialsSection?.sub_title || 'A percepção do aluno passa a ser apresentada com mais peso editorial e menos ruído visual.'}
                  description={
                     testimonialsSection?.description ||
                     'As avaliações continuam sendo puxadas do CMS, mas agora fazem parte de um bloco mais sofisticado e compatível com a nova direção visual.'
                  }
               />

               <SectionCard className="grid gap-4 p-6 sm:grid-cols-3">
                  <div className="space-y-2">
                     <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">5.0</div>
                     <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Avaliação média</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">+2.000</div>
                     <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Alunos impactados</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">96%</div>
                     <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Satisfação</div>
                  </div>
               </SectionCard>
            </div>

            <div className="space-y-5">
               <Carousel
                  setApi={setApi}
                  className="relative"
                  opts={{
                     loop: true,
                     align: 'start',
                     slidesToScroll: 'auto',
                  }}
                  plugins={[Autoplay({ delay: 5000 })]}
               >
                  <CarouselContent>
                     {testimonials.length > 0 ? (
                        testimonials.map((review, index) => (
                           <CarouselItem key={`testimonials-${index}`} className="md:basis-1/2">
                              <div className="h-full px-1.5 py-0.5">
                                 <SectionCard className="flex h-full flex-col gap-5 p-6">
                                    <Quote className="h-6 w-6 text-primary" />
                                    <div className="flex items-center gap-1">
                                       {[...Array(Number(review.rating || 5))].map((_, i) => (
                                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                       ))}
                                    </div>
                                    <p className="flex-grow text-sm leading-7 text-slate-600">“{review.description}”</p>
                                    <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
                                       <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                                          <img src={review.image || '/assets/icons/avatar.png'} alt={review.name} className="h-full w-full object-cover" />
                                       </div>
                                       <div>
                                          <p className="text-sm font-semibold text-slate-950">{review.name}</p>
                                          <p className="text-xs text-slate-500">{review.address}</p>
                                       </div>
                                    </div>
                                 </SectionCard>
                              </div>
                           </CarouselItem>
                        ))
                     ) : (
                        <CarouselItem>
                           <div className="px-1.5 py-0.5">
                              <SectionCard className="p-6 text-sm text-slate-600">Não há depoimentos disponíveis no momento.</SectionCard>
                           </div>
                        </CarouselItem>
                     )}
                  </CarouselContent>
               </Carousel>

               <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center justify-center gap-2.5">
                     {api &&
                        testimonials.map(({ id }, index) => (
                           <div
                              key={id}
                              className={cn(
                                 'h-2 cursor-pointer rounded-full transition-all duration-200',
                                 currentSlide === index ? 'bg-primary w-4' : 'w-2 bg-slate-300',
                              )}
                              onClick={() => api.scrollTo(index)}
                           />
                        ))}
                  </div>

                  <div className="flex items-center gap-3">
                     <Button
                        size="icon"
                        variant="outline"
                        disabled={!api?.canScrollPrev()}
                        onClick={() => api?.scrollPrev()}
                        className="h-10 w-10 rounded-full border-slate-200 bg-white shadow-none hover:border-primary hover:bg-primary hover:text-white"
                     >
                        <ChevronLeft />
                     </Button>
                     <Button
                        size="icon"
                        variant="outline"
                        disabled={!api?.canScrollNext()}
                        onClick={() => api?.scrollNext()}
                        className="h-10 w-10 rounded-full border-slate-200 bg-white shadow-none hover:border-primary hover:bg-primary hover:text-white"
                     >
                        <ChevronRight />
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-10 rounded-[32px] border border-slate-200 bg-slate-950 px-6 py-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
               <div className="flex items-center gap-3">
                  <Users2 className="h-5 w-5 text-primary" />
                  <p className="text-sm text-slate-200">A prova social complementa a narrativa institucional e reforça credibilidade.</p>
               </div>
               <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Airways Academy</p>
            </div>
         </div>
      </Section>
   );
};

export default Testimonials;
