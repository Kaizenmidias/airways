import { getPageSection } from '@/lib/page';
import { cn, getCourseDuration, systemCurrency } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Clock3, GraduationCap, Layers3, Star, Users } from 'lucide-react';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const HomeCourseCard = ({ course }: { course: Course }) => {
   const { props } = usePage<IntroPageProps>();
   const currency = systemCurrency(props.system.fields['selling_currency']);

   return (
      <SectionCard className="group overflow-hidden transition-transform duration-300 hover:-translate-y-1">
         <Link
            href={route('course.details', {
               slug: course.slug,
               id: course.id,
            })}
            className="block h-full"
         >
            <div className="grid h-full gap-0 lg:grid-cols-[0.95fr_1.05fr]">
               <div className="relative min-h-[240px] lg:min-h-full">
                  <img
                     src={course.thumbnail || '/assets/images/blank-image.jpg'}
                     alt={course.title}
                     className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                     onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/images/blank-image.jpg';
                     }}
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.45))]" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 backdrop-blur">
                     {course.course_category.title}
                  </div>
               </div>

               <div className="flex flex-col justify-between p-6 sm:p-7">
                  <div className="space-y-4">
                     <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                           <Layers3 className="h-3.5 w-3.5 text-primary" />
                           Estrutura própria
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                           <GraduationCap className="h-3.5 w-3.5 text-primary" />
                           Formação prática
                        </span>
                     </div>

                     <h3 className="text-2xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2rem]">{course.title}</h3>

                     <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                           <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                           {course.average_rating || 0} ({course.reviews_count || 0})
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                           <Users className="h-4 w-4" />
                           {course.enrollments_count || 0} alunos
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                           <Clock3 className="h-4 w-4" />
                           {getCourseDuration(course, 'readable')}
                        </span>
                     </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                     <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Investimento</p>
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                           {course.pricing_type === 'free' ? 'Gratuito' : `${currency?.symbol}${course.price}`}
                        </p>
                     </div>

                     <span className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-950 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                        Ver curso
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </span>
                  </div>
               </div>
            </div>
         </Link>
      </SectionCard>
   );
};

const TopCourses = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, topCourses, customize } = props;
   const topCoursesSection = getPageSection(page, 'top_courses');

   return (
      <Section customize={customize} pageSection={topCoursesSection} containerClass="py-12 lg:py-16">
         <div className="grid gap-10">
            <EditorialHeading
               eyebrow={topCoursesSection?.title || 'Formação própria'}
               title={topCoursesSection?.sub_title || 'Cursos próprios apresentados como programas estratégicos, não como catálogo genérico.'}
               description={
                  topCoursesSection?.description ||
                  'A vitrine principal da Airways Academy ganha mais respiro, mais contraste e um desenho mais alinhado a um posicionamento institucional.'
               }
            />

            <div className={cn('grid gap-6', topCourses.length > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-1')}>
               {topCourses.length > 0 ? (
                  topCourses.map((course) => <HomeCourseCard key={course.id} course={course} />)
               ) : (
                  <SectionCard className="p-8 text-sm text-slate-600">Não há cursos destacados no momento.</SectionCard>
               )}
            </div>
         </div>
      </Section>
   );
};

export default TopCourses;
