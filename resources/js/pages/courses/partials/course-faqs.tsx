import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CourseFaqs = ({ faqs = [] }: { faqs?: CourseFaq[] }) => {
   return (
      <Accordion type="single" collapsible className="space-y-4">
         {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id as string} className="overflow-hidden rounded-lg border border-slate-200 px-4">
               <AccordionTrigger className="cursor-pointer text-left text-base font-semibold text-slate-900 hover:no-underline [&[data-state=open]]:text-[#FD122E]">
                  {faq.question}
               </AccordionTrigger>
               <AccordionContent className="pt-1 pb-4 text-slate-600">{faq.answer}</AccordionContent>
            </AccordionItem>
         ))}
      </Accordion>
   );
};

export default CourseFaqs;
