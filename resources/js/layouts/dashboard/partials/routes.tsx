import { routeLastSegment } from '@/lib/route';
import { Award, Book, Briefcase, CassetteTape, LayoutDashboard, Newspaper, Receipt, School, Settings, Users } from 'lucide-react';

export const getDashboardRoutes = (translate: LanguageTranslations): DashboardRoute[] => {
   const { button } = translate;

   return [
   {
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
                  name: button.course_coupons ?? 'Course Coupons',
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
                  name: button.manage_exams ?? 'Manage Exams',
                  slug: routeLastSegment(route('exams.index')),
                  path: route('exams.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.create_exam ?? 'Create Exam',
                  slug: routeLastSegment(route('exams.create')),
                  path: route('exams.create'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.exam_coupons ?? 'Exam Coupons',
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
                  name: button.course_enrollments ?? 'Course Enrollments',
                  slug: routeLastSegment(route('course-enrollments.index')),
                  path: route('course-enrollments.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
               {
                  name: button.exam_enrollments ?? 'Exam Enrollments',
                  slug: routeLastSegment(route('exam-enrollments.index')),
                  path: route('exam-enrollments.index'),
                  access: ['admin', 'instructor', 'collaborative', 'administrative'],
               },
            ],
         },
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
         {
            Icon: Newspaper,
            name: button.newsletters ?? 'Newsletters',
            path: route('newsletters.index'),
            slug: routeLastSegment(route('newsletters.index')),
            active: true,
            access: ['admin', 'collaborative', 'administrative'],
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
            name: button.certificates ?? 'Certificates',
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
                  name: button.marksheet ?? 'Marksheet',
                  slug: routeLastSegment(route('marksheet.templates.index')),
                  path: route('marksheet.templates.index'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
               // {
               //    name: 'Create Certificate',
               //    slug: routeLastSegment(route('certificate.templates.create')),
               //    path: route('certificate.templates.create'),
               //    access: ['admin', 'collaborative', 'administrative'],
               // },
               // {
               //    name: 'Create Marksheet',
               //    slug: routeLastSegment(route('marksheet.templates.create')),
               //    path: route('marksheet.templates.create'),
               //    access: ['admin', 'collaborative', 'administrative'],
               // },
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
                  name: button.translation ?? 'Translation',
                  slug: routeLastSegment(route('language.index')),
                  path: route('language.index'),
                  access: ['admin', 'collaborative', 'administrative'],
               },
            ],
         },
      ],
   },
   ];
};
