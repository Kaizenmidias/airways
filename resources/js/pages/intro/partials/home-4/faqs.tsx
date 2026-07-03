import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const FAQs = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize } = props;
   const faqsCoursesSection = getPageSection(page, 'faqs');

   const array = getPropertyArray(faqsCoursesSection);
   const midPoint = Math.ceil(array.length / 2);
   const firstPart = array.slice(0, midPoint);
   const secondPart = array.slice(midPoint);

   return (
      <Section customize={customize} pageSection={faqsCoursesSection} containerClass="py-12 lg:py-16">
         <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <EditorialHeading
               eyebrow={faqsCoursesSection?.title || 'Perguntas frequentes'}
               title={faqsCoursesSection?.sub_title || 'As dúvidas ficam organizadas em um bloco limpo, direto e com mais cara de instituição.'}
               description={
                  faqsCoursesSection?.description ||
                  'O conteúdo continua vindo do CMS, mas a apresentação agora ajuda a reforçar clareza, confiança e sofisticação.'
               }
            />

            <SectionCard className="overflow-hidden p-4 sm:p-6">
               <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <Accordion type="single" collapsible defaultValue="faq-0-first" className="space-y-3">
                        {firstPart.map((faq, index) => (
                           <AccordionItem key={`faq-${index}-first`} value={`faq-${index}-first`} className="rounded-2xl border border-slate-200 px-5">
                              <AccordionTrigger className="cursor-pointer py-4 text-left text-base font-semibold text-slate-950 hover:no-underline">
                                 {faq.title}
                              </AccordionTrigger>
                              <AccordionContent className="pt-0 pb-4 text-sm leading-7 text-slate-600">{faq.description}</AccordionContent>
                           </AccordionItem>
                        ))}
                     </Accordion>
                  </div>

                  <div>
                     <Accordion type="single" collapsible className="space-y-3">
                        {secondPart.map((faq, index) => (
                           <AccordionItem key={`faq-${index}-second`} value={`faq-${index}-second`} className="rounded-2xl border border-slate-200 px-5">
                              <AccordionTrigger className="cursor-pointer py-4 text-left text-base font-semibold text-slate-950 hover:no-underline">
                                 {faq.title}
                              </AccordionTrigger>
                              <AccordionContent className="pt-0 pb-4 text-sm leading-7 text-slate-600">{faq.description}</AccordionContent>
                           </AccordionItem>
                        ))}
                     </Accordion>
                  </div>
               </div>

               <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                     <HelpCircle className="h-5 w-5 text-primary" />
                     <span>Se algo precisar de ajuste, o editor do CMS continua disponível em ?customize=true.</span>
                  </div>

                  <Button asChild variant="outline" className="h-11 rounded-full border-slate-200 bg-white text-slate-950 shadow-none hover:border-primary hover:bg-primary hover:text-white">
                     <a href="#contato">
                        Falar com a equipe
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </a>
                  </Button>
               </div>
            </SectionCard>
         </div>
      </Section>
   );
};

export default FAQs;
