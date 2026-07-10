import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Section from '../section';

const fallbackItems = [
   {
      icon: 'star',
      title: 'Mais de 25 Anos',
      description:
         'Desde 1998 publicamos conteúdo na área de ensino para aviação. Sabia que somos a maior editora de livros didáticos para aviação do país? São mais de 40 publicações e 200.000 livros vendidos.',
   },
   {
      icon: 'dollar-sign',
      title: 'Aprovação Garantida',
      description:
         'Temos o exclusivo programa de "Aprovação Garantida – Risco Zero", sistema que garante a devolução do valor pago caso o aluno não tenha sucesso na prova presencial da ANAC após nosso curso teórico.',
      button_text: 'Saiba mais',
      button_link: '/courses/all',
   },
   {
      icon: 'graduation-cap',
      title: 'Professores Pilotos',
      description:
         'Tenha aula com professores experientes, que trabalham há mais de 20 anos em suas áreas de atuação e suporte com pilotos formados e experientes.',
   },
   {
      icon: 'play',
      title: 'Conteúdo e Vídeos',
      description:
         'Centenas de horas de vídeo aulas para facilitar o seu aprendizado. Nosso curso online de Piloto Privado contém todo o conteúdo programático previsto para a prova teórica da ANAC.',
   },
   {
      icon: 'calendar-days',
      title: 'Plano de Estudos',
      description:
         'Desenvolvemos um plano de estudos para que você se prepare para a prova de Piloto Privado com bastante eficiência. Além disso pode se aperfeiçoar em nossos outros Cursos de Aviação',
   },
   {
      icon: 'check',
      title: 'Simulado de Provas',
      description:
         'São diversas questões de Piloto Privado, Piloto Comercial, INV e Comissário de Voo para você treinar seus conhecimentos e chegar preparado na prova da Anac.',
   },
   {
      icon: 'message-square',
      title: 'Suporte',
      description:
         'Ensinar vai além de disponibilizar o conteúdo para o aluno, é preciso ter uma equipe de professores disponível para dar todo o suporte que o aluno precisa.',
   },
   {
      icon: 'tablet-smartphone',
      title: 'Plataforma',
      description:
         'Uma plataforma moderna, cheia de funcionalidades e de fácil utilização. Tudo isso para que você se preparar da melhor forma possível.',
   },
];

const WhyChooseEbianch = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize } = props;
   const section = getPageSection(page, 'why_choose_ebianch');
   const items = getPropertyArray(section);
   const cards = items.length > 0 ? items : fallbackItems;

   return (
      <Section customize={customize} pageSection={section} containerClass="!w-full !max-w-none !px-0 overflow-hidden" contentClass="relative isolate w-full">
         <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#1b2430_0%,#1b2430_100%)]" />
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_24%)]" />

         <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-14 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
               <p className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/90">
                  <span className="h-[2px] w-8 rounded-full bg-white/80" />
                  <span>{section?.title || 'Por que escolher a eBianch?'}</span>
               </p>

               <h2 className="text-3xl leading-[0.98] font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-[4.25rem]">
                  {section?.sub_title || 'Por que escolher a eBianch?'}
               </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
               {cards.map((item, index) => (
                  <Card
                     key={`why-choose-${index}`}
                     className={cn(
                        'rounded-[18px] border-0 bg-white px-5 py-8 text-center text-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
                        'min-h-[280px]',
                     )}
                  >
                     <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full text-[#0d63ff]">
                           <DynamicIcon name={item.icon || fallbackItems[index]?.icon || 'star'} className="h-8 w-8" />
                        </div>
                     </div>

                     <h3 className="mt-6 text-xl font-medium text-slate-950">{item.title || fallbackItems[index]?.title}</h3>
                     <p className="mt-4 text-sm leading-7 text-slate-600">{item.description || fallbackItems[index]?.description}</p>

                     {(item.button_text || item.button_link) && (
                        <a
                           href={item.button_link || '#'}
                           className="mt-4 inline-flex items-center justify-center text-sm font-medium text-[#0d63ff] hover:underline"
                        >
                           {item.button_text || 'Saiba mais'}
                        </a>
                     )}
                  </Card>
               ))}
            </div>
         </div>
      </Section>
   );
};

export default WhyChooseEbianch;
