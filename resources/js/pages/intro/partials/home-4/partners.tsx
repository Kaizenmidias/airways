import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ShieldCheck } from 'lucide-react';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const Partners = () => {
   const { props } = usePage<IntroPageProps>();
   const { customize, page } = props;
   const partnersSection = getPageSection(page, 'partners');
   const partners = getPropertyArray(partnersSection);

   return (
      <Section customize={customize} pageSection={partnersSection} containerClass="py-10 lg:py-14">
         <SectionCard className="overflow-hidden">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:p-10">
               <EditorialHeading
                  eyebrow={partnersSection?.title || 'Confiança do setor'}
                  title={partnersSection?.sub_title || 'A presença de parceiros e referências continua, agora com leitura mais elegante e corporativa.'}
                  description={
                     partnersSection?.description ||
                     'Os logos e imagens vindos do CMS permanecem, mas a apresentação passa a reforçar credibilidade e solidez institucional.'
                  }
               />

               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                     Referências e apoiadores
                  </div>

                  {partners.length > 0 ? (
                     <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 2400 })]}>
                        <CarouselContent>
                           {partners.map((partner, index) => (
                              <CarouselItem key={`item-${index}`} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                                 <div className="flex h-24 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                    <img src={partner.image} alt="" className="max-h-10 w-auto opacity-80 grayscale transition-opacity hover:opacity-100" />
                                 </div>
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                     </Carousel>
                  ) : (
                     <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                        Nenhum parceiro configurado no momento.
                     </div>
                  )}
               </div>
            </div>
         </SectionCard>
      </Section>
   );
};

export default Partners;
