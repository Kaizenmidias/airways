import { isAirwaysFeatureEnabled, isMarketplaceEnabled } from '@/lib/airways';
import { routeLastSegment } from '@/lib/route';
import { SharedData } from '@/types/global';
import { Award, Book, Briefcase, CassetteTape, LayoutDashboard, Mail, Newspaper, Receipt, School, Settings, Users } from 'lucide-react';

export const getDashboardRoutes = (translate: LanguageTranslations, airways: SharedData['airways']): DashboardRoute[] => {
   const { button } = translate;
   const routes: DashboardRoute[] = [];
   const showMarketplace = isMarketplaceEnabled(airways);
   const showInstructors = showMarketplace && isAirwaysFeatureEnabled(airways, 'instructors');
   const showPayouts = showMarketplace && isAirwaysFeatureEnabled(airways, 'payouts');
   const showJobs = isAirwaysFeatureEnabled(airways, 'jobs');
   const showBlog = isAirwaysFeatureEnabled(airways, 'blog');
   const showNewsletter = isAirwaysFeatureEnabled(airways, 'newsletter');

   routes.push({
      title: button.main_menu ?? 'Main Menu',
      slug: 'main-menu',
      pages: [
         {
            Icon: LayoutDashboard,
            name: button.dashboard ?? 'Dashboard',
            path: route('dashboard'),
            slug: routeLastSegment(route('dashboard')),
            active: true,
            access: ['admin', 'instructor', 'collaborative', 'administrative'],
            children: [],
         },
         {
            Icon: School,
            name: button.courses ?? 'Courses',
            path: '',
            slug: 'courses',
            active: true,
            access: ['admin', 'instructor', 'collaborative', 'administrative'],
            children: [
               {
                  name: button.categories ?? 'Categories',
                  path: route('categories.index'),
                  slug: routeLastSegment(route('categories.index')),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.manage_courses ?? 'Manage Courses',
                  slug: routeLastSegment(route('courses.index')),
                  path: route('courses.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.create_course ?? 'Create Course',
                  slug: routeLastSegment(route('courses.create')),
                  path: route('courses.create'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.course_coupons ?? 'Cupons de cursos',
                  slug: routeLastSegment(route('course-coupons.index')),
                  path: route('course-coupons.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
            ],
         },
         {
            Icon: Book,
            name: button.exams ?? 'Exams',
            path: '',
            slug: 'exams',
            active: true,
            access: ['admin', 'instructor', 'collaborative', 'administrative'],
            children: [
               {
                  name: button.categories ?? 'Categories',
                  slug: routeLastSegment(route('exam-categories.index')),
                  path: route('exam-categories.index'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.manage_exams ?? 'Gerenciar provas',
                  slug: routeLastSegment(route('exams.index')),
                  path: route('exams.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.create_exam ?? 'Criar prova',
                  slug: routeLastSegment(route('exams.create')),
                  path: route('exams.create'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.exam_coupons ?? 'Cupons de provas',
                  slug: routeLastSegment(route('exam-coupons.index')),
                  path: route('exam-coupons.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
            ],
         },
         {
            Icon: CassetteTape,
            name: button.enrollments ?? 'Enrollments',
            path: '',
            slug: 'enrollments',
            active: true,
            access: ['admin', 'instructor', 'collaborative', 'administrative'],
            children: [
               {
                  name: button.course_enrollments ?? 'Matrículas em cursos',
                  slug: routeLastSegment(route('course-enrollments.index')),
                  path: route('course-enrollments.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.exam_enrollments ?? 'Matrículas em provas',
                  slug: routeLastSegment(route('exam-enrollments.index')),
                  path: route('exam-enrollments.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
            ],
         },
         ...(showInstructors
            ? [
                 {
                    Icon: Users,
                    name: button.instructors ?? 'Instructors',
                    path: '',
                    slug: 'instructors',
                    active: true,
                    access: ['admin', 'collaborative'],
                    children: [
                       {
                          name: button.manage_instructors ?? 'Manage Instructors',
                          slug: routeLastSegment(route('instructors.index')),
                          path: route('instructors.index'),
                          access: ['admin', 'collaborative'],
                       },
                       {
                          name: button.create_instructor ?? 'Create Instructor',
                          slug: routeLastSegment(route('instructors.create')),
                          path: route('instructors.create'),
                          access: ['admin', 'collaborative'],
                       },
                       {
                          name: button.applications ?? 'Applications',
                          slug: routeLastSegment(route('instructors.applications')),
                          path: route('instructors.applications', {
                             status: 'pending',
                          }),
                          access: ['admin', 'collaborative'],
                       },
                    ],
                 },
              ]
            : []),
         ...(showPayouts
            ? [
                 {
                    Icon: Receipt,
                    name: button.payout_report ?? 'Payout Report',
                    path: '',
                    slug: 'payouts',
                    active: true,
                    access: ['admin', 'collaborative'],
                    children: [
                       {
                          name: button.payout_request ?? 'Payout Request',
                          slug: routeLastSegment(route('payouts.request.index')),
                          path: route('payouts.request.index'),
                          access: ['admin', 'collaborative'],
                       },
                       {
                          name: button.payout_history ?? 'Payout History',
                          slug: routeLastSegment(route('payouts.history.index')),
                          path: route('payouts.history.index'),
                          access: ['admin', 'collaborative'],
                       },
                    ],
                 },
                 {
                    Icon: Receipt,
                    name: button.payouts ?? 'Payouts',
                    path: '',
                    slug: 'payouts',
                    active: true,
                    access: ['instructor', 'collaborative'],
                    children: [
                       {
                          name: button.withdraw ?? 'Withdraw',
                          slug: routeLastSegment(route('payouts.index')),
                          path: route('payouts.index'),
                          access: ['instructor', 'collaborative'],
                       },
                       {
                          name: button.settings ?? 'Settings',
                          slug: routeLastSegment(route('payouts.settings.index')),
                          path: route('payouts.settings.index'),
                          access: ['instructor', 'collaborative'],
                       },
                    ],
                 },
              ]
            : []),
         ...(showJobs
            ? [
                 {
                    Icon: Briefcase,
                    name: button.job_circulars ?? 'Job Circulars',
                    path: '',
                    slug: 'job-circulars',
                    active: true,
                    access: ['admin', 'collaborative', 'administrative'],
                    children: [
                       {
                          name: button.all_jobs ?? 'All Jobs',
                          slug: routeLastSegment(route('job-circulars.index')),
                          path: route('job-circulars.index'),
                          access: ['admin', 'collaborative', 'administrative'],
                       },
                       {
                          name: button.create_job ?? 'Create Job',
                          slug: routeLastSegment(route('job-circulars.create')),
                          path: route('job-circulars.create'),
                          access: ['admin', 'collaborative', 'administrative'],
                       },
                    ],
                 },
              ]
            : []),
         ...(showBlog
            ? [
                 {
                    Icon: Book,
                    name: button.blogs ?? 'Blogs',
                    path: '',
                    slug: 'blogs',
                    active: true,
                    access: ['admin', 'instructor', 'collaborative', 'administrative'],
                    children: [
                       {
                          name: button.categories ?? 'Categories',
                          slug: routeLastSegment(route('blogs.categories.index')),
                          path: route('blogs.categories.index'),
                          access: ['admin', 'instructor', 'collaborative', 'administrative'],
                       },
                       {
                          name: button.create_blog ?? 'Create Blog',
                          slug: routeLastSegment(route('blogs.create')),
                          path: route('blogs.create'),
                          access: ['admin', 'instructor', 'collaborative', 'administrative'],
                       },
                       {
                          name: button.manage_blog ?? 'Manage Blog',
                          slug: routeLastSegment(route('blogs.index')),
                          path: route('blogs.index'),
                          access: ['admin', 'instructor', 'collaborative', 'administrative'],
                       },
                    ],
                 },
              ]
            : []),
         ...(showNewsletter
            ? [
                 {
                    Icon: Newspaper,
                    name: button.newsletters ?? 'Newsletters',
                    path: route('newsletters.index'),
                    slug: routeLastSegment(route('newsletters.index')),
                    active: true,
                    access: ['admin', 'collaborative', 'administrative'],
                    children: [],
                 },
              ]
            : []),
         {
            Icon: Mail,
            name: 'Contato',
            path: route('contact-messages.index'),
            slug: routeLastSegment(route('contact-messages.index')),
            active: true,
            access: ['admin'],
            children: [],
         },
         {
            Icon: Users,
            name: button.all_users ?? 'All Users',
            path: route('users.index'),
            slug: routeLastSegment(route('users.index')),
            active: true,
            access: ['admin', 'collaborative', 'administrative'],
            children: [],
         },
         {
            Icon: Award,
                    name: button.certificates ?? 'Certificados',
            path: '',
            slug: 'certification',
            active: true,
            access: ['admin', 'collaborative', 'administrative'],
            children: [
               {
                  name: button.certificate ?? 'Certificate',
                  slug: routeLastSegment(route('certificate.templates.index')),
                  path: route('certificate.templates.index'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                    name: button.marksheet ?? 'Boletim',
                  slug: routeLastSegment(route('marksheet.templates.index')),
                  path: route('marksheet.templates.index'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
            ],
         },
         {
            Icon: Settings,
            name: button.settings ?? 'Settings',
            path: '',
            slug: 'settings',
            active: true,
            access: ['admin', 'instructor', 'collaborative', 'administrative'],
            children: [
               {
                  name: button.account ?? 'Account',
                  slug: routeLastSegment(route('settings.account')),
                  path: route('settings.account'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.system ?? 'System',
                  slug: routeLastSegment(route('settings.system')),
                  path: route('settings.system'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.pages ?? 'Pages',
                  slug: routeLastSegment(route('settings.pages')),
                  path: route('settings.pages'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.storage ?? 'Storage',
                  slug: routeLastSegment(route('settings.storage')),
                  path: route('settings.storage'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.payment ?? 'Payment',
                  slug: routeLastSegment(route('settings.payment')),
                  path: route('settings.payment'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: 'SMTP',
                  slug: routeLastSegment(route('settings.smtp')),
                  path: route('settings.smtp'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.authentication ?? 'Auth',
                  slug: routeLastSegment(route('settings.auth0')),
                  path: route('settings.auth0'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                  name: button.live_class ?? 'Live Class',
                  slug: routeLastSegment(route('settings.live-class')),
                  path: route('settings.live-class'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               {
                    name: button.translation ?? 'Tradução',
                  slug: routeLastSegment(route('language.index')),
                  path: route('language.index'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
            ],
         },
      ],
   });

   return routes;
};
