import { isAirwaysFeatureEnabled } from '@/lib/airways';
import { IntroPageProps } from '@/types/page';
import { Head } from '@inertiajs/react';
import Blogs from './partials/home-4/blogs';
import CallToAction from './partials/home-4/call-to-action';
import FAQs from './partials/home-4/faqs';
import Hero from './partials/home-4/hero';
import Instructor from './partials/home-4/instructor';
import Overview from './partials/home-4/overview';
import Partners from './partials/home-4/partners';
import WhoWeAre from './partials/home-4/who-we-are';
import Testimonials from './partials/home-4/testimonials';
import TopCategories from './partials/home-4/top-categories';
import TopCourse from './partials/home-4/top-course';
import TopCourses from './partials/home-4/top-courses';
import Layout from './partials/layout';

const Home3 = ({ page, system, airways }: IntroPageProps) => {
   const { sections } = page;
   const components: any[] = [];

   sections
      .filter((section) => section.active)
      .map((section) => {
         switch (section.slug) {
            case 'hero':
               components.push(Hero);
               break;
            case 'partners':
               components.push(Partners);
               break;
            case 'top_categories':
               components.push(TopCategories);
               break;
            case 'top_course':
               components.push(TopCourse);
               break;
            case 'overview':
               components.push(Overview);
               break;
            case 'top_courses':
               components.push(TopCourses);
               break;
            case 'instructor':
               if (!isAirwaysFeatureEnabled(airways, 'instructors')) break;
               components.push(Instructor);
               break;
            case 'faqs':
               components.push(FAQs);
               break;
            case 'testimonials':
               components.push(Testimonials);
               break;
            case 'who_we_are':
               components.push(WhoWeAre);
               break;
            case 'blogs':
               if (!isAirwaysFeatureEnabled(airways, 'blog')) break;
               components.push(Blogs);
               break;
            case 'call_to_action':
               components.push(CallToAction);
               break;
            default:
               break;
         }
      });

   return (
      <Layout navbarHeight={false}>
         <Head title={system.fields.name} />

         {components.map((Component, index) => (
            <Component key={`home-3-${index}`} />
         ))}
      </Layout>
   );
};

export default Home3;
