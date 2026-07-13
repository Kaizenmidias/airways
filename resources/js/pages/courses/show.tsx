import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LandingLayout from '@/layouts/landing-layout';
import { shouldShowCollaborativeUi } from '@/lib/airways';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import CourseFaqs from './partials/course-faqs';
import CourseLearnings from './partials/course-learnings';
import CoursePreview from './partials/course-preview';
import CourseReviews from './partials/course-reviews';
import Curriculum from './partials/curriculum';
import Details from './partials/details';
import Instructor from './partials/instructor';
import Overview from './partials/overview';

export interface CourseDetailsProps extends SharedData {
   course: Course;
   enrollment: CourseEnrollment;
   watchHistory: WatchHistory | null;
   approvalStatus: CourseApprovalValidation;
   wishlists: CourseWishlist[];
   reviews: Pagination<CourseReview>;
   totalReviews: CourseTotalReview;
}

const SectionShell = ({
   eyebrow,
   title,
   children,
}: {
   eyebrow: string;
   title: string;
   children: ReactNode;
}) => {
   return (
      <Card className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.22em] text-[#FD122E] uppercase">
               <span className="h-[2px] w-8 rounded-full bg-[#FD122E]" />
               <span>{eyebrow}</span>
            </div>
            <div className="space-y-3">
               <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">{title}</h2>
               <Separator className="h-[2px] w-16 bg-[#FD122E]" />
            </div>
         </div>

         <div className="mt-6">{children}</div>
      </Card>
   );
};

const Show = ({ course, system, translate }: CourseDetailsProps & { translate: any }) => {
   const { frontend } = translate;
   const { props } = usePage<CourseDetailsProps>();
   const showInstructorTab = shouldShowCollaborativeUi(props.airways, system.sub_type);

   // Generate meta information for the course
   const pageTitle = course.meta_title || `${course.title} | ${system.fields?.name}`;
   const pageDescription = course.meta_description || course.short_description || course.description || frontend.learn_comprehensive_course;
   const pageKeywords = course.meta_keywords || `${course.title}, ${frontend.online_course_learning_lms}, ${system.fields?.keywords || 'LMS'}`;
   const ogTitle = course.og_title || course.title;
   const ogDescription = course.og_description || pageDescription;
   const courseImage = course.thumbnail || '';
   const siteName = system.fields?.name;
   const siteUrl = window.location.href;
   const heroDescription = course.short_description || course.description || pageDescription;
   const hasLearnings = Boolean(course.learnings && course.learnings.length > 0);
   const hasFaqs = Boolean(course.faqs && course.faqs.length > 0);
   const hasDescription = Boolean(course.description);

   return (
      <>
         <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={system.fields?.author || frontend.default_author} />

            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:site_name" content={siteName} />

            <meta property="og:image" content={courseImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={course.title} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={ogDescription} />
            {courseImage && <meta name="twitter:image" content={courseImage} />}

            <meta name="course:title" content={course.title} />
            <meta name="course:level" content={course.level} />
            <meta name="course:language" content={course.language} />
            <meta name="course:price" content={course.price?.toString() || '0'} />
            <meta name="course:pricing_type" content={course.pricing_type} />
            {course.instructor && <meta name="course:instructor" content={course.instructor.user?.name || ''} />}

            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Course',
                  name: course.title,
                  description: pageDescription,
                  image: courseImage,
                  provider: {
                     '@type': 'Organization',
                     name: siteName,
                     url: window.location.origin,
                  },
                  instructor: course.instructor
                     ? {
                          '@type': 'Person',
                          name: course.instructor.user?.name || '',
                       }
                     : undefined,
                  courseCode: course.slug,
                  educationalLevel: course.level,
                  inLanguage: course.language,
                  offers:
                     course.pricing_type === 'paid'
                        ? {
                             '@type': 'Offer',
                             price: course.price || 0,
                             priceCurrency: 'USD',
                             availability: 'https://schema.org/InStock',
                          }
                        : {
                             '@type': 'Offer',
                             price: 0,
                             priceCurrency: 'USD',
                             availability: 'https://schema.org/InStock',
                          },
               })}
            </script>
         </Head>

         <section className="overflow-hidden bg-slate-950 text-white">
            <div className="relative isolate overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.22),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.18),transparent_26%),linear-gradient(180deg,#02070f_0%,#04101f_55%,#02070f_100%)]" />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/80 to-slate-950/92" />

               <div className="container relative mx-auto max-w-[1600px] px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-[4.5rem] lg:px-14 lg:pt-36 lg:pb-16">
                  <div className="max-w-4xl space-y-7">
                     <div className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.28em] text-[#FD122E] uppercase">
                        <span className="h-[2px] w-8 rounded-full bg-[#FD122E]" />
                        <span>Detalhes do curso</span>
                     </div>

                     <div className="space-y-4">
                        <h1 className="max-w-3xl text-4xl leading-[0.96] font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.5rem]">
                           {course.title}
                        </h1>
                        <div className="h-1.5 w-16 rounded-full bg-[#FD122E]" />
                     </div>

                     <p className="max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">{heroDescription}</p>
                  </div>
               </div>
            </div>
         </section>

         <div className="container grid grid-cols-1 gap-7 py-10 md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-7">
               {hasLearnings && (
                  <SectionShell eyebrow="Aprendizado" title="O que você irá aprender neste curso">
                     <CourseLearnings learnings={course.learnings} />
                  </SectionShell>
               )}

               {hasDescription && (
                  <SectionShell eyebrow="Descrição do curso" title="Sobre este curso">
                     <Overview course={course} />
                  </SectionShell>
               )}

               <SectionShell eyebrow="Programa" title="Estrutura e módulos">
                  <Curriculum course={course} compact />
               </SectionShell>

               <SectionShell eyebrow="Aprendizado" title="O que você vai aprender">
                  <Details course={course} compact />
               </SectionShell>

               {showInstructorTab && (
                  <SectionShell eyebrow="Professor do curso" title="Quem vai te acompanhar">
                     <Instructor course={course} compact />
                  </SectionShell>
               )}

               <SectionShell eyebrow="Avaliações" title="O que os alunos estão dizendo">
                  <CourseReviews compact />
               </SectionShell>

               {hasFaqs && (
                  <SectionShell eyebrow="Perguntas frequentes" title="Dúvidas sobre o curso">
                     <CourseFaqs faqs={course.faqs} />
                  </SectionShell>
               )}
            </div>

            <div className="relative z-20 md:-mt-24 lg:-mt-40">
               <CoursePreview />
            </div>
         </div>
      </>
   );
};

Show.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} navbarHeight={false} />;

export default Show;
