import Tabs from '@/components/tabs';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LandingLayout from '@/layouts/landing-layout';
import { shouldShowCollaborativeUi } from '@/lib/airways';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import CourseHeader from './partials/course-header';
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

const Show = ({ course, system, translate }: CourseDetailsProps & { translate: any }) => {
   const { button, frontend } = translate;
   const { props } = usePage<CourseDetailsProps>();
   const showInstructorTab = shouldShowCollaborativeUi(props.airways, system.sub_type);

   const tabs = [
      {
         value: 'overview',
         label: button.overview,
         Component: <Overview course={course} />,
      },
      {
         value: 'curriculum',
         label: button.curriculum,
         Component: <Curriculum course={course} />,
      },
      {
         value: 'details',
         label: button.details,
         Component: <Details course={course} />,
      },
      {
         value: 'instructor',
         label: button.instructor,
         Component: <Instructor course={course} />,
      },
      {
         value: 'reviews',
         label: button.reviews,
         Component: <CourseReviews />,
      },
   ].filter((tab) => {
         if (tab.value === 'instructor') {
         return showInstructorTab;
      }

      return true;
   });

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

   return (
      <>
         <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={system.fields?.author || frontend.default_author} />

            {/* Open Graph Tags */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:site_name" content={siteName} />

            {/* Open Graph Image */}
            <meta property="og:image" content={courseImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={course.title} />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={ogDescription} />
            {courseImage && <meta name="twitter:image" content={courseImage} />}

            {/* Course-specific meta */}
            <meta name="course:title" content={course.title} />
            <meta name="course:level" content={course.level} />
            <meta name="course:language" content={course.language} />
            <meta name="course:price" content={course.price?.toString() || '0'} />
            <meta name="course:pricing_type" content={course.pricing_type} />
            {course.instructor && <meta name="course:instructor" content={course.instructor.user?.name || ''} />}

            {/* Schema.org structured data */}
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

               <div className="container relative mx-auto grid max-w-[1600px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:px-14 lg:py-28">
                  <div className="relative z-10 space-y-7">
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

                  <div className="relative z-10 mx-auto w-full max-w-[420px]">
                     <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-md">
                        <img
                           className="h-[320px] w-full rounded-[28px] object-cover object-center sm:h-[420px] lg:h-[520px]"
                           src={course.thumbnail ?? '/assets/images/blank-image.jpg'}
                           alt={course.title}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <div className="container grid grid-cols-1 gap-7 py-10 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
               <CourseHeader course={course} />

               <Tabs defaultValue="overview" className="bg-card overflow-hidden rounded-md border shadow">
                  <div className="overflow-x-auto overflow-y-hidden">
                     <TabsList className="vertical-tabs-list">
                        {tabs.map(({ label, value }) => (
                           <TabsTrigger key={value} value={value} className="vertical-tabs-trigger">
                              <span>{label}</span>
                           </TabsTrigger>
                        ))}
                     </TabsList>
                  </div>

                  <Separator className="mt-[1px]" />

                  {tabs.map(({ value, Component }) => (
                     <TabsContent key={value} value={value} className="m-0 p-5">
                        {Component}
                     </TabsContent>
                  ))}
               </Tabs>
            </div>

            <div>
               <CoursePreview />
            </div>
         </div>
      </>
   );
};

Show.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Show;
