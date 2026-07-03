import { getPageSection } from '@/lib/page';
import { getColorWithOpacity } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Layers3 } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const TopCategories = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, topCategories } = props;
   const topCategoriesSection = getPageSection(page, 'top_categories');

   return (
      <Section customize={customize} pageSection={topCategoriesSection} containerClass="py-12 lg:py-16" contentClass="relative">
         <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <EditorialHeading
               eyebrow={topCategoriesSection?.title || 'Programas de formação'}
               title={topCategoriesSection?.sub_title || 'Estruturamos os cursos para formar profissionais com clareza, disciplina e visão de carreira.'}
               description={
                  topCategoriesSection?.description ||
                  'Cada trilha mantém o conteúdo do CMS, mas a apresentação fica mais editorial, institucional e alinhada ao universo aeronáutico.'
               }
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
               {topCategories.length > 0 ? (
                  topCategories.map((category, index) => {
                     const accent = [
                        'rgba(253,18,46,1)',
                        'rgba(30,41,59,1)',
                        'rgba(71,85,105,1)',
                        'rgba(15,23,42,1)',
                        'rgba(253,18,46,1)',
                     ][index % 5];

                     return (
                        <Link key={category.id} href={route('category.courses', { category: category.slug })} className="group block">
                           <SectionCard className="h-full p-5 transition-transform duration-300 group-hover:-translate-y-1">
                              <div className="flex h-full flex-col justify-between gap-8">
                                 <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                       <div
                                          className="flex h-12 w-12 items-center justify-center rounded-full border"
                                          style={{
                                             borderColor: getColorWithOpacity(accent, 0.18),
                                             backgroundColor: getColorWithOpacity(accent, 0.08),
                                             color: accent,
                                          }}
                                       >
                                          <DynamicIcon name={category.icon as any} className="h-6 w-6" />
                                       </div>

                                       <ArrowRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                                    </div>

                                    <div className="space-y-2">
                                       <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{category.title}</h3>
                                       <p className="text-sm leading-6 text-slate-600 line-clamp-3">
                                          {category.description || 'Conteúdo estruturado para uma formação sólida, com linguagem objetiva e visual premium.'}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                                    <span className="font-medium text-slate-500">{category.courses_count} cursos</span>
                                    <span className="font-semibold text-primary">Ver programa</span>
                                 </div>
                              </div>
                           </SectionCard>
                        </Link>
                     );
                  })
               ) : (
                  <SectionCard className="col-span-full p-8 text-sm text-slate-600">
                     <div className="flex items-center gap-3">
                        <Layers3 className="h-5 w-5 text-primary" />
                        <span>Não há categorias disponíveis no momento.</span>
                     </div>
                  </SectionCard>
               )}
            </div>
         </div>
      </Section>
   );
};

export default TopCategories;
