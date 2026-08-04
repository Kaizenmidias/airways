import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
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

type BulletPoint = {
   title?: string;
};

const defaultStats = [
   { icon: 'users', count: '+10.523', title: 'Alunos' },
   { icon: 'calendar-days', count: '+25', title: 'Anos' },
   { icon: 'bar-chart-3', count: '+91%', title: 'Aprovação' },
];

const defaultBulletPoints: BulletPoint[] = [
   { title: 'Formação aeronáutica com base prática e confiável' },
   { title: 'Didática refinada ao longo de décadas de experiência' },
   { title: 'Estrutura pensada para uma jornada clara e objetiva' },
];

const WhoWeAre = () => {
   const { props } = usePage<IntroPageProps>();
   const { page } = props;
   const section = getPageSection(page, 'who_we_are');
   const stats = getPropertyArray(section).slice(0, 3);
   const bulletPoints = ((section?.properties?.bullet_points as BulletPoint[] | undefined) || []).filter((item) => Boolean(item?.title?.trim()));
   const descriptionBlocks = (section?.description || defaultDescription)
      .split(/\n\s*\n/g)
      .map((block) => block.trim())
      .filter(Boolean);
   const bulletsToRender = bulletPoints.length > 0 ? bulletPoints : defaultBulletPoints;
   const topImage = section?.thumbnail || '/assets/images/intro/home-4/hero-image.png';
   const bottomImage = section?.background_image || '/assets/images/students-2.jpg';
   const cards = stats;

   return (
      <Section customize={props.customize} pageSection={section} containerClass="!w-full !max-w-none !px-0 overflow-hidden" contentClass="relative isolate w-full bg-[#f4f7fb] text-slate-900">
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(29,63,123,0.08),transparent_24%),radial-gradient(circle_at_90%_15%,rgba(255,255,255,0.95),transparent_22%),linear-gradient(180deg,#f4f7fb_0%,#ffffff_56%,#eef3f9_100%)]" />

         <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-14 lg:py-28">
            <div className="relative order-2 z-10 space-y-7 lg:order-1">
               <div className="inline-flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.34em] text-[#1d3f7b]">
                  <span className="h-[2px] w-8 rounded-full bg-[#1d3f7b]" />
                  <span>{section?.title || 'QUEM SOMOS'}</span>
               </div>

               <div className="space-y-4">
                  <h2 className="max-w-xl text-[42px] leading-[0.94] font-normal tracking-[-0.06em] text-slate-950">
                     {section?.sub_title || 'Quem somos?'}
                  </h2>
                  <div className="h-1.5 w-16 rounded-full bg-[#1d3f7b]" />
               </div>

               <div className="max-w-2xl space-y-6 text-[16px] leading-8 font-normal text-slate-600">
                  {descriptionBlocks.map((block, index) => (
                     <p key={`who-we-are-text-${index}`} className="text-[16px] leading-8 font-normal text-slate-600">
                        {block}
                     </p>
                  ))}
               </div>

               <div className="max-w-2xl space-y-3">
                  {bulletsToRender.map((bullet, index) => (
                     <div
                        key={`who-we-are-bullet-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                     >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d3f7b] text-white">
                           <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                           </svg>
                        </div>
                        <p className="text-[14px] leading-6 font-normal text-slate-700">{bullet.title}</p>
                     </div>
                  ))}
               </div>

               {cards.length > 0 ? (
                  <div className="grid gap-4 pt-4 sm:grid-cols-3">
                     {cards.map((item, index) => (
                        <Card
                           key={`who-we-are-stat-${index}`}
                           className="rounded-[22px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
                        >
                           {item.icon ? (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1d3f7b]/20 bg-[#1d3f7b]/10 text-[#1d3f7b]">
                                 <DynamicIcon name={item.icon} className="h-5 w-5" />
                              </div>
                           ) : null}

                           <p className="mt-6 text-4xl leading-none font-normal tracking-[-0.06em] text-slate-950">
                              {item.count || defaultStats[index]?.count}
                           </p>
                           <p className="mt-2 text-base font-normal text-slate-600">{item.title || defaultStats[index]?.title}</p>
                        </Card>
                     ))}
                  </div>
               ) : null}
            </div>

            <div className="relative order-1 z-10 pb-6 lg:order-2 lg:pr-14">
               <div className="relative mx-auto min-h-[540px] max-w-[760px] pb-8 sm:min-h-[640px] lg:min-h-[760px]">
                  <div className="absolute top-24 right-[14%] h-[46%] w-[42%] rounded-[34px] border border-[#1d3f7b]/20 opacity-0 lg:opacity-100" />
                  <div className="absolute top-[8%] left-[13%] h-[250px] w-[250px] rounded-full bg-[radial-gradient(circle,rgba(29,63,123,0.10)_0%,transparent_70%)] blur-2xl opacity-70 lg:opacity-100" />
                  <div className="absolute top-[18%] left-[8%] grid grid-cols-8 gap-2 opacity-12">
                     {Array.from({ length: 64 }).map((_, index) => (
                        <span key={index} className="h-1 w-1 rounded-full bg-slate-400/70" />
                     ))}
                  </div>

                  <div className="absolute top-0 right-0 z-20 w-[84%] overflow-hidden rounded-[34px] border border-slate-200 bg-white p-2 shadow-[0_30px_100px_rgba(15,23,42,0.10)] sm:w-[82%] lg:w-[82%]">
                     <img
                        src={topImage}
                        alt={section?.sub_title || section?.title || 'Quem somos'}
                        className="h-[320px] w-full rounded-[28px] object-cover object-center sm:h-[420px] lg:h-[600px]"
                     />
                  </div>

                  <div className="absolute bottom-0 left-0 z-30 w-[78%] overflow-hidden rounded-[34px] border border-slate-200 bg-white p-2 shadow-[0_30px_100px_rgba(15,23,42,0.10)] sm:w-[76%] lg:w-[76%]">
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
