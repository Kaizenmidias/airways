import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
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
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.18),transparent_22%),radial-gradient(circle_at_100%_10%,rgba(253,18,46,0.24),transparent_18%),linear-gradient(180deg,#02070f_0%,#06101d_48%,#02070f_100%)]" />
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.05),transparent_18%),radial-gradient(circle_at_60%_65%,rgba(255,255,255,0.03),transparent_18%)]" />
         <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />

         <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-14 lg:py-28">
            <div className="mx-auto max-w-6xl text-center">
               <p className="mb-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#FD122E]">
                  <span className="h-[2px] w-8 rounded-full bg-[#FD122E]" />
                  <span>{section?.title || 'POR QUE ESCOLHER A EBIANCH?'}</span>
               </p>

               <h2 className="mx-auto max-w-5xl text-3xl leading-[0.96] font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-[3.95rem] xl:max-w-6xl xl:text-[4.25rem]">
                  {section?.sub_title || 'Uma estrutura feita para acelerar sua formação'}
               </h2>

               <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200/90 sm:text-lg">
                  {section?.description || 'Uma experiência de ensino aérea com conteúdo, suporte e tecnologia alinhados à identidade da Airways Academy.'}
               </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
               {cards.map((item, index) => {
                  const itemTitle = (item.title || fallbackItems[index]?.title || '').toLowerCase();
                  const hideCta = itemTitle.includes('aprova');

                  return (
                     <Card
                        key={`why-choose-${index}`}
                        className={cn(
                           'group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-md',
                           'min-h-[300px] transition-transform duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.05]',
                        )}
                     >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,18,46,0.12),transparent_38%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#FD122E]/65 to-transparent" />

                        <div className="flex justify-center">
                           <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#FD122E]/25 bg-[#FD122E]/12 text-[#FD122E] shadow-[0_0_0_1px_rgba(253,18,46,0.04),0_0_28px_rgba(253,18,46,0.2)]">
                              <DynamicIcon name={item.icon || fallbackItems[index]?.icon || 'star'} className="h-7 w-7" />
                           </div>
                        </div>

                        <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-white">{item.title || fallbackItems[index]?.title}</h3>
                        <p className="mt-4 text-sm leading-7 text-slate-300">{item.description || fallbackItems[index]?.description}</p>

                        {!hideCta && (item.button_text || item.button_link) && (
                           <a
                              href={item.button_link || '#'}
                              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#FD122E]/35 bg-[#FD122E]/12 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#FD122E]/55 hover:bg-[#FD122E]/18"
                           >
                              {item.button_text || 'Saiba mais'}
                              <ArrowRight className="h-4 w-4" />
                           </a>
                        )}
                     </Card>
                  );
               })}
            </div>
         </div>
      </Section>
   );
};

export default WhyChooseEbianch;
