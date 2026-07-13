import { Button } from '@/components/ui/button';
import { getPageSection } from '@/lib/page';
import Section from '@/pages/intro/partials/section';
import { Link, usePage } from '@inertiajs/react';
import { InnerPageProps } from '..';

const SuccessStatistics = () => {
   const { props } = usePage<InnerPageProps>();
   const { customize, innerPage } = props;
   const successStatistics = getPageSection(innerPage, 'success_statistics');
   const stats = successStatistics?.properties.array || [];

   return (
      <div className="overflow-hidden bg-slate-950">
         <Section customize={customize} pageSection={successStatistics} containerClass="!w-full !max-w-none !px-0" contentClass="relative isolate">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.18),transparent_24%),linear-gradient(180deg,#02070f_0%,#06101d_52%,#02070f_100%)]" />

            <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:px-14 lg:py-28">
               <div className="relative z-10 space-y-7">
                  <div className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.28em] text-[#FD122E] uppercase">
                     <span className="h-[2px] w-8 rounded-full bg-[#FD122E]" />
                     <span>Resultados</span>
                  </div>

                  <div className="space-y-4">
                     <h2 className="max-w-2xl text-4xl leading-[0.98] font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.75rem]">
                        {successStatistics?.title}
                     </h2>
                     <div className="h-1.5 w-16 rounded-full bg-[#FD122E]" />
                  </div>

                  <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{successStatistics?.description}</p>

                  <Button asChild className="h-12 rounded-full bg-[#FD122E] px-7 text-sm font-semibold text-white shadow-none hover:bg-[#d90f26]">
                     <Link href="/courses/all">Explorar Cursos</Link>
                  </Button>

                  <div className="grid gap-4 pt-2 sm:grid-cols-3">
                     {stats.map((stat, index) => (
                        <div
                           key={`stat-${index}`}
                           className="rounded-[22px] border border-white/12 bg-white/[0.03] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md"
                        >
                           <h6 className="text-4xl leading-none font-black tracking-[-0.06em]">{stat.count}</h6>
                           <p className="mt-2 text-sm text-slate-300">{stat.title}</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative z-10 min-h-[560px] lg:min-h-[680px]">
                  <div className="absolute top-[8%] right-[10%] h-[62%] w-[46%] rounded-[34px] border border-[#FD122E]/85" />
                  <div className="absolute top-[4%] left-[2%] grid grid-cols-8 gap-2 opacity-20">
                     {Array.from({ length: 64 }).map((_, index) => (
                        <span key={index} className="h-1 w-1 rounded-full bg-white/70" />
                     ))}
                  </div>

                  {stats.slice(0, 3).map((stat, index) => {
                     const imageClass =
                        index === 0
                           ? 'top-0 left-0 z-20 w-[58%] sm:w-[52%]'
                           : index === 1
                             ? 'top-[18%] right-0 z-30 w-[56%] sm:w-[50%]'
                             : 'bottom-0 left-[16%] z-40 w-[62%] sm:w-[54%]';

                     const heightClass = index === 2 ? 'h-[260px] sm:h-[340px] lg:h-[390px]' : 'h-[320px] sm:h-[420px] lg:h-[500px]';

                     return (
                        <div
                           key={`image-${index}`}
                           className={`absolute overflow-hidden rounded-[34px] border border-white/10 bg-[#0d1728] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] ${imageClass}`}
                        >
                           <img src={stat.image} alt={stat.title} className={`${heightClass} w-full rounded-[28px] object-cover object-center`} />
                        </div>
                     );
                  })}

                  <div className="absolute right-[8%] bottom-[8%] hidden max-w-[230px] rounded-[24px] border border-white/12 bg-white/[0.04] p-5 text-sm leading-6 text-slate-200 backdrop-blur-md xl:block">
                     Formacao, constancia e evolucao profissional em um mesmo ecossistema.
                  </div>
               </div>
            </div>
         </Section>
      </div>
   );
};

export default SuccessStatistics;
