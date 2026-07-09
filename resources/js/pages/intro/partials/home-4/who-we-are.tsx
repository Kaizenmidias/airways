import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Section from '../section';

const defaultDescription = [
   'O Grupo Bianchi atua na área de ensino aeronáutico desde 1998, contando com editora própria, loja física e portal de formação EAD.',
   'A Airways Academy é um CIAC (Centro de Instrução de Aviação Civil) homologado pela ANAC, tornando-se o braço de Ensino a Distância do nosso grupo. Sendo fundada em 2014, a plataforma de formação utiliza toda nossa didática de ensino que foi refinada ao longo de décadas de experiência.',
   'Como pioneiro do Grupo está Denis Bianchini, Comandante e Instrutor de Boeing 737, que popularizou no mercado a didática focada no estudante que se prepara de modo solo, fora de uma sala de aula física.',
   'Ao longo dessa trajetória já tivemos mais de 200.000 livros vendidos e mais de 10.000 alunos já matriculados em nosso portal de ensino.',
].join('\n\n');

const defaultStats = [
   { icon: 'users', count: '+10.523', title: 'Alunos' },
   { icon: 'calendar-days', count: '+25', title: 'Anos' },
   { icon: 'bar-chart-3', count: '+91%', title: 'Aprovação' },
];

const WhoWeAre = () => {
   const { props } = usePage<IntroPageProps>();
   const { page } = props;
   const section = getPageSection(page, 'who_we_are');
   const stats = getPropertyArray(section).slice(0, 3);
   const descriptionBlocks = (section?.description || defaultDescription)
      .split(/\n\s*\n/g)
      .map((block) => block.trim())
      .filter(Boolean);
   const topImage = section?.thumbnail || '/assets/images/intro/home-4/hero-image.png';
   const bottomImage = section?.background_image || '/assets/images/students-2.jpg';
   const cards = stats.length > 0 ? stats : defaultStats;

   return (
      <Section customize={props.customize} pageSection={section} containerClass="!w-full !max-w-none !px-0 overflow-hidden" contentClass="relative isolate w-full">
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.18),transparent_22%),radial-gradient(circle_at_100%_10%,rgba(253,18,46,0.28),transparent_18%),linear-gradient(180deg,#02070f_0%,#06101d_48%,#02070f_100%)]" />
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.05),transparent_18%),radial-gradient(circle_at_60%_65%,rgba(255,255,255,0.03),transparent_18%)]" />

         <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:px-14 lg:py-28">
            <div className="relative z-10 space-y-7">
               <div className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#FD122E]">
                  <span className="h-[2px] w-8 rounded-full bg-[#FD122E]" />
                  <span>{section?.title || 'QUEM SOMOS'}</span>
               </div>

               <div className="space-y-4">
                  <h2 className="max-w-xl text-3xl leading-[0.96] font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-[4.5rem]">
                     {section?.sub_title || 'Quem somos?'}
                  </h2>
                  <div className="h-1.5 w-16 rounded-full bg-[#FD122E]" />
               </div>

               <div className="space-y-6 max-w-2xl text-lg leading-8 text-slate-200/92">
                  {descriptionBlocks.map((block, index) => (
                     <p key={`who-we-are-text-${index}`} className={cn(index === 0 && 'text-xl leading-9 text-slate-100')}>{block}</p>
                  ))}
               </div>

               <div className="grid gap-4 pt-2 sm:grid-cols-3">
                  {cards.map((item, index) => (
                     <Card
                        key={`who-we-are-stat-${index}`}
                        className="rounded-[22px] border border-white/12 bg-white/[0.03] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md"
                     >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FD122E]/35 bg-[#FD122E]/12 text-[#FD122E]">
                           <DynamicIcon name={item.icon || defaultStats[index]?.icon || 'circle'} className="h-5 w-5" />
                        </div>

                        <p className="mt-6 text-4xl leading-none font-black tracking-[-0.06em] text-white">
                           {item.count || defaultStats[index]?.count}
                        </p>
                        <p className="mt-2 text-base text-slate-300">{item.title || defaultStats[index]?.title}</p>
                     </Card>
                  ))}
               </div>
            </div>

            <div className="relative z-10 pb-6 lg:pr-14">
               <div className="relative mx-auto min-h-[580px] max-w-[760px] lg:min-h-[760px]">
                  <div className="absolute top-28 right-[14%] hidden h-[46%] w-[42%] rounded-[34px] border border-[#FD122E]/90 lg:block" />
                  <div className="absolute top-[8%] left-[13%] hidden h-[250px] w-[250px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-2xl lg:block" />
                  <div className="absolute top-[18%] left-[8%] hidden grid grid-cols-8 gap-2 opacity-20 lg:grid">
                     {Array.from({ length: 64 }).map((_, index) => (
                        <span key={index} className="h-1 w-1 rounded-full bg-white/70" />
                     ))}
                  </div>

                  <div className="relative z-20 overflow-hidden rounded-[34px] border border-white/10 bg-[#0d1728] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] lg:absolute lg:top-0 lg:right-0 lg:w-[82%]">
                     <img
                        src={topImage}
                        alt={section?.sub_title || section?.title || 'Quem somos'}
                        className="h-[320px] w-full rounded-[28px] object-cover object-center sm:h-[420px] lg:h-[600px]"
                     />
                  </div>

                  <div className="relative z-30 mt-6 overflow-hidden rounded-[34px] border border-white/10 bg-[#0d1728] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:w-[76%]">
                     <img
                        src={bottomImage}
                        alt={`${section?.sub_title || section?.title || 'Quem somos'} 2`}
                        className="h-[260px] w-full rounded-[28px] object-cover object-center sm:h-[340px] lg:h-[420px]"
                     />
                  </div>
               </div>
            </div>
         </div>
      </Section>
   );
};

export default WhoWeAre;
