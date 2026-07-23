import AppLogo from '@/components/app-logo';
import Appearance from '@/components/appearance';
import AppearanceToggleTab from '@/components/appearance-tabs';
import CourseCart from '@/components/course-cart';
import Language from '@/components/language';
import Notification from '@/components/notification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import PublicContainer from '@/components/public/public-container';
import { cn } from '@/lib/utils';
import { buildNavbarTree, type NavbarTreeNode } from '@/lib/navbar-tree';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, GraduationCap, LayoutDashboard, LogOut, Menu, SettingsIcon, UserCircle, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType } from 'react';

interface NavbarProps {
   language?: boolean;
   heightCover?: boolean;
   customizable?: boolean;
}

const Navbar = ({ language = true, heightCover = true, customizable = true }: NavbarProps) => {
   const { props } = usePage<SharedData>();
   const { ziggy, navbar, translate, system, auth } = props;
   const isAdmin = auth?.user?.role === 'admin';
   const [isSticky, setIsSticky] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [mobileOpenItems, setMobileOpenItems] = useState<Record<string, boolean>>({});

   const sortedItems = useMemo(() => {
      return Array.isArray(navbar?.navbar_items) ? [...navbar.navbar_items].sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.id) - Number(b.id)) : [];
   }, [navbar]);

   const linkItems = useMemo(() => sortedItems.filter((item) => item.type !== 'action' && item.active !== false), [sortedItems]);
   const linkTree = useMemo(() => buildNavbarTree(linkItems), [linkItems]);
   const actionItems = sortedItems.filter((item) => item.type === 'action' && item.active !== false);
   const customizeLink = props.customize ? ziggy.location : '?customize=true';
   const user = auth?.user;
   const buttonLabels = translate.button as unknown as Record<string, string>;

   useEffect(() => {
      const handleScroll = () => {
         setIsSticky(window.scrollY > 100);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   const resolveHref = (item: NavbarItem) => item.value || '';
   const isExternal = (href: string) => /^https?:\/\//i.test(href);

   const resolveCourseHref = (course: Course) => route('course.details', { slug: course.slug, id: course.id });
   const resolveCategoryHref = (item: NavbarItem) => {
      const category = item.course_category;

      if (item.display_courses_in_menu === false) {
         return route('category.courses', { category: category?.slug || item.slug });
      }

      return route('category.courses', { category: category?.slug || item.slug });
   };

   const toggleMobileItem = (key: string) => {
      setMobileOpenItems((current) => ({
         ...current,
         [key]: !current[key],
      }));
   };

   const renderNavLabel = (item: NavbarItem, className = '') => (
      <span className={cn('flex flex-col leading-tight', className)}>
         {item.subtitle ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8] group-hover:text-primary">{item.subtitle}</span> : null}
         <span className="text-inherit group-hover:text-primary">{item.title}</span>
      </span>
   );

   const renderCourseMenuItems = (courses: Course[]) =>
      courses.map((course) => (
         <DropdownMenuItem key={course.id} asChild className="mb-1 cursor-pointer rounded-md px-4 py-2 last:mb-0">
               <Link href={resolveCourseHref(course)} className="block w-full text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
               <span className="flex flex-col leading-tight">
                  {course.sub_title ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8]">{course.sub_title}</span> : null}
                  <span className="text-inherit">{course.title}</span>
               </span>
            </Link>
         </DropdownMenuItem>
      ));

   const renderSubCategoryMenuItems = (category: CourseCategory, childCategories: CourseCategoryChild[]) =>
      childCategories.map((child) => {
         const childCourses = child.courses ?? [];
         const childHref = route('category.courses', { category: category.slug, category_child: child.slug });

         if (childCourses.length > 0) {
            return (
               <DropdownMenuSub key={child.id}>
                  <DropdownMenuSubTrigger className="group mb-1 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary last:mb-0">
                     <span className="flex flex-col leading-tight">
                        <span>{child.title}</span>
                     </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="flex min-w-56 flex-col gap-1 border-white/10 bg-slate-950/95 p-2 text-white">
                     {renderCourseMenuItems(childCourses)}
                  </DropdownMenuSubContent>
               </DropdownMenuSub>
            );
         }

         return (
            <DropdownMenuItem key={child.id} asChild className="mb-1 cursor-pointer rounded-md px-4 py-2 last:mb-0">
               <Link href={childHref} className="block w-full text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
                  <span className="flex flex-col leading-tight">
                     <span>{child.title}</span>
                  </span>
               </Link>
            </DropdownMenuItem>
         );
      });

   const renderCategoryMenu = (item: NavbarItem, keySuffix = '') => {
      const category = item.course_category;
      const courses = category?.courses ?? [];
      const childCategories = category?.category_children ?? [];
      const categoryHref = resolveCategoryHref(item);

      if (item.display_courses_in_menu === false) {
         return (
            <Link
               key={item.id}
               href={categoryHref || '#'}
               className={cn('group flex cursor-pointer items-center gap-1 outline-none', 'text-sm font-medium text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary')}
            >
               {renderNavLabel(item)}
            </Link>
         );
      }

      if (keySuffix) {
         return (
           <DropdownMenuSub key={`${item.id}${keySuffix}`}>
                  <DropdownMenuSubTrigger className="group mb-1 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary last:mb-0">
                     {renderNavLabel(item)}
                  </DropdownMenuSubTrigger>
               <DropdownMenuSubContent className="min-w-56 border-white/10 bg-slate-950/95 text-white">
                  {courses.length > 0 ? renderCourseMenuItems(courses) : null}
                  {childCategories.length > 0 ? renderSubCategoryMenuItems(category as CourseCategory, childCategories) : null}
               </DropdownMenuSubContent>
            </DropdownMenuSub>
         );
      }

      return (
         <DropdownMenu key={item.id}>
            <DropdownMenuTrigger className={cn('group flex cursor-pointer items-center gap-1 outline-none', 'text-sm font-medium text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary')}>
               {renderNavLabel(item)}
               <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="flex min-w-56 flex-col gap-1 border-white/10 bg-slate-950/95 p-2 text-white">
               {courses.length > 0 ? renderCourseMenuItems(courses) : null}
               {childCategories.length > 0 ? renderSubCategoryMenuItems(category as CourseCategory, childCategories) : null}
               {childCategories.length === 0 && courses.length === 0 ? (
                  <DropdownMenuItem asChild className="cursor-pointer px-0 py-0">
                     <Link href={categoryHref} className="block w-full px-4 py-2 text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
                        {renderNavLabel(item)}
                     </Link>
                  </DropdownMenuItem>
               ) : null}
            </DropdownMenuContent>
         </DropdownMenu>
      );
   };

   const renderChildren = (children: NavbarTreeNode[], parentKey: string | number) =>
      children
         .filter((subNode) => subNode.item.active !== false)
         .map((subNode, index) => {
            const subItem = subNode.item;

            if (subItem.type === 'category') {
               return renderCategoryMenu(subItem, `-${parentKey}-${index}`);
            }

            if (subNode.children.length > 0) {
               return (
                 <DropdownMenuSub key={`${parentKey}-${index}`}>
                     <DropdownMenuSubTrigger className="group flex cursor-pointer items-center gap-2 px-3 py-2 text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary">
                        {renderNavLabel(subItem)}
                        <ChevronRight className="ml-auto h-4 w-4" />
                     </DropdownMenuSubTrigger>
                     <DropdownMenuSubContent className="flex min-w-56 flex-col gap-1 border-white/10 bg-slate-950/95 p-2 text-white">
                        {renderChildren(subNode.children, `${parentKey}-${index}`)}
                     </DropdownMenuSubContent>
                  </DropdownMenuSub>
               );
            }

            const subHref = subItem.value || '';

            if (!subHref) {
               return (
                  <DropdownMenuItem key={`${parentKey}-${index}`} className="mb-1 cursor-default rounded-md px-4 py-2 text-white/80 last:mb-0">
                     {renderNavLabel(subItem, 'text-white/80')}
                  </DropdownMenuItem>
               );
            }

            return (
               <DropdownMenuItem key={`${parentKey}-${index}`} className="mb-1 cursor-pointer rounded-md px-4 py-2 last:mb-0" asChild>
                  {isExternal(subHref) ? (
                     <a href={subHref} className="block w-full text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
                        {renderNavLabel(subItem)}
                     </a>
                  ) : (
                     <Link href={subHref} className="block w-full text-white/90 transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
                        {renderNavLabel(subItem)}
                     </Link>
                  )}
               </DropdownMenuItem>
            );
         });

   const renderMobileCourseItems = (courses: Course[]) =>
      courses.map((course) => (
         <Link
            key={course.id}
            href={resolveCourseHref(course)}
            onClick={() => setIsMenuOpen(false)}
            className="group block rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-white transition-colors hover:bg-white hover:text-primary"
         >
            <span className="flex flex-col leading-tight">
               {course.sub_title ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8] group-hover:text-primary">{course.sub_title}</span> : null}
               <span className="text-inherit group-hover:text-primary">{course.title}</span>
            </span>
         </Link>
      ));

   const renderMobileSubCategories = (category: CourseCategory, childCategories: CourseCategoryChild[], parentKey: string) =>
      childCategories.map((child) => {
         const childCourses = child.courses ?? [];
         const childHref = route('category.courses', { category: category.slug, category_child: child.slug });
         const childKey = `child-${parentKey}-${child.id}`;
         const childOpen = Boolean(mobileOpenItems[childKey]);

         if (childCourses.length > 0) {
            return (
               <div key={child.id} className="space-y-2">
                  <button
                     type="button"
                     onClick={() => toggleMobileItem(childKey)}
                  className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-left text-white transition-colors hover:bg-white hover:text-primary"
               >
                  <span className="flex flex-col leading-tight">
                        <span className="text-inherit group-hover:text-primary">{child.title}</span>
                  </span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', childOpen && 'rotate-180')} />
               </button>

                  {childOpen ? <div className="space-y-2 pl-4">{renderMobileCourseItems(childCourses)}</div> : null}
               </div>
            );
         }

         return (
            <Link
               key={child.id}
               href={childHref}
               onClick={() => setIsMenuOpen(false)}
               className="group block rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-white transition-colors hover:bg-white hover:text-primary"
            >
               <span className="flex flex-col leading-tight">
                  <span className="text-inherit group-hover:text-primary">{child.title}</span>
               </span>
            </Link>
         );
      });

   const renderMobileNode = (node: NavbarTreeNode, parentKey: string | number) => {
      const { item } = node;
      const href = resolveHref(item);
      const mobileKey = `${parentKey}-${item.id}`;

      if (item.type === 'category') {
         const category = item.course_category;
         const courses = category?.courses ?? [];
         const childCategories = category?.category_children ?? [];
         const hasContent = item.display_courses_in_menu !== false && (courses.length > 0 || childCategories.length > 0);
         const isOpen = Boolean(mobileOpenItems[mobileKey]);

         if (!hasContent) {
            return (
               <Link
                  key={item.id}
                  href={resolveCategoryHref(item) || '#'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-white transition-colors hover:bg-white hover:text-primary"
               >
                  {renderNavLabel(item)}
               </Link>
            );
         }

         return (
            <div key={item.id} className="space-y-2">
               <button
                  type="button"
                  onClick={() => toggleMobileItem(mobileKey)}
                  className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-left text-white transition-colors hover:bg-white hover:text-primary"
               >
                  {renderNavLabel(item)}
                  <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
               </button>

               {isOpen ? (
                  <div className="space-y-3 pl-3">
                     {courses.length > 0 ? <div className="space-y-2">{renderMobileCourseItems(courses)}</div> : null}
                     {childCategories.length > 0 ? <div className="space-y-3">{renderMobileSubCategories(category as CourseCategory, childCategories, mobileKey)}</div> : null}
                  </div>
               ) : null}
            </div>
         );
      }

      if (node.children.length > 0) {
         const isOpen = Boolean(mobileOpenItems[mobileKey]);

         return (
            <div key={item.id} className="space-y-2">
               <button
                  type="button"
                  onClick={() => toggleMobileItem(mobileKey)}
                  className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-left text-white transition-colors hover:bg-white hover:text-primary"
               >
                  {renderNavLabel(item)}
                  <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
               </button>

               {isOpen ? <div className="space-y-2 pl-3">{node.children.map((childNode, index) => renderMobileNode(childNode, `${mobileKey}-${index}`))}</div> : null}
            </div>
         );
      }

      if (!href) {
         return <div key={item.id} className="rounded-xl border border-white/10 bg-[#050b14] px-3 py-2">{renderNavLabel(item, 'text-white/80')}</div>;
      }

      return (
         <Link
            key={item.id}
            href={href}
            onClick={() => setIsMenuOpen(false)}
            className="group block rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-white transition-colors hover:bg-white hover:text-primary"
         >
            {renderNavLabel(item)}
         </Link>
      );
   };

   const renderNavItem = (node: NavbarTreeNode) => {
      const { item } = node;
      const href = resolveHref(item);
      const linkClass = 'text-sm font-medium text-white/90 transition-colors hover:text-white';

      if (item.type === 'category') {
         return renderCategoryMenu(item);
      }

      if (node.children.length > 0) {
         return (
            <DropdownMenu key={item.id}>
               <DropdownMenuTrigger className={cn('group flex cursor-pointer items-center gap-1 outline-none', linkClass)}>
                  {renderNavLabel(item)}
                  <ChevronDown className="h-4 w-4" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="min-w-56 border-white/10 bg-slate-950/95 text-white">
                  {renderChildren(node.children, item.id)}
               </DropdownMenuContent>
            </DropdownMenu>
         );
      }

      if (!href) {
         return (
            <span key={item.id} className={linkClass}>
               {renderNavLabel(item)}
            </span>
         );
      }

      if (isExternal(href)) {
         return (
            <a key={item.id} href={href} className={linkClass}>
               {renderNavLabel(item)}
            </a>
         );
      }

      return (
         <Link key={item.id} href={href} className={linkClass}>
            {renderNavLabel(item)}
         </Link>
      );
   };

   const renderProfileMenu = () => {
      if (!user) return null;

      const items = [
         (user.role === 'admin' || user.role === 'instructor') && {
            id: 'dashboard',
            label: translate.button.dashboard || 'Dashboard',
            icon: LayoutDashboard,
            onClick: () => router.get(route('dashboard')),
         },
         (user.role === 'student' || user.role === 'instructor') && {
            id: 'courses',
            label: translate.button.my_courses || 'My Courses',
            icon: GraduationCap,
            onClick: () => router.get(route('student.index', { tab: 'courses' })),
         },
         (user.role === 'student' || user.role === 'instructor') && {
            id: 'profile',
            label: translate.button.profile || 'Profile',
            icon: UserCircle,
            onClick: () => router.get(route('student.index', { tab: 'profile' })),
         },
         (user.role === 'student' || user.role === 'instructor') && {
            id: 'settings',
            label: translate.button.settings || 'Settings',
            icon: SettingsIcon,
            onClick: () => router.get(route('student.index', { tab: 'settings' })),
         },
      ].filter(Boolean) as { id: string; label: string; icon: ComponentType<{ className?: string }>; onClick: () => void }[];

      return (
         <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-none">
               <div className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white">
                  {user.photo ? (
                     <Avatar className="h-6 w-6 border border-white/15">
                        <AvatarImage src={user.photo} alt={user.name ?? ''} className="h-full w-full content-center object-cover" />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                     </Avatar>
                  ) : (
                     <UserCircle className="h-5 w-5 text-white/80" />
                  )}
                  <span>{translate.button.profile || 'Perfil'}</span>
               </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               {items.map(({ id, label, icon: Icon, onClick }) => (
                  <DropdownMenuItem key={id} className="cursor-pointer px-3" onClick={onClick}>
                     <Icon className="mr-2 h-4 w-4" />
                     <span>{label}</span>
                  </DropdownMenuItem>
               ))}
               <DropdownMenuItem className="cursor-pointer px-3" onClick={() => router.post('/logout')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{translate.button.logout || 'Log out'}</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      );
   };

   return (
      <div className={cn('landing-navbar', isMenuOpen && 'bg-white')}>
         <div
            className={cn(
               'fixed top-0 inset-x-0 z-50 w-full rounded-none border-x-0 border-b border-white/12 bg-[linear-gradient(180deg,rgba(102,122,153,0.36)_0%,rgba(40,58,83,0.38)_100%)] text-white backdrop-blur-xl transition-colors duration-300',
               isSticky && 'border-white/10 bg-[#060F1B] shadow-[0_18px_50px_rgba(8,15,27,0.35)]',
            )}
         >
            <PublicContainer className={cn('relative flex h-[84px] items-center justify-between gap-4 py-2', customizable && isAdmin && 'section-edit')}>
               <div className="flex items-center gap-3">
                  <Link href="/" className="inline-flex items-center">
                     <div className="origin-left scale-[1.55]">
                        <AppLogo className="h-12 w-auto" />
                     </div>
                  </Link>
               </div>

               <div className="hidden flex-1 items-center justify-center gap-6 xl:flex">
                  {linkTree.length > 0 && <nav className="flex items-center gap-10">{linkTree.map((node) => renderNavItem(node))}</nav>}
               </div>

               <div className="flex items-center gap-2">
                  <div className="hidden items-center gap-2 2xl:flex">
                     {actionItems.map((item) => {
                        if (item.slug === 'theme') {
                           return <Appearance key={item.id} />;
                        }

                        if (item.slug === 'language' && system.fields.language_selector && language) {
                           return <Language key={item.id} />;
                        }

                       if (item.slug === 'notification' && user) {
                           return (
                              <Notification key={item.id} iconOnly />
                           );
                        }

                        if (item.slug === 'cart') {
                           return (
                              <CourseCart key={item.id} iconOnly />
                           );
                        }

                        return null;
                     })}
                  </div>

                  {customizable && isAdmin && (
                     <Button asChild variant="outline" className="hidden h-10 rounded-full border-white/25 bg-transparent px-5 text-white shadow-none hover:bg-white/10 lg:inline-flex">
                        <Link href={customizeLink}>{props.customize ? translate.button.back || 'Back' : translate.button.edit || 'Customize'}</Link>
                     </Button>
                  )}

                  {user ? (
                     <div className="hidden items-center gap-3 lg:flex">{renderProfileMenu()}</div>
                  ) : (
                     <div className="hidden items-center gap-2 lg:flex">
                        <Button asChild variant="outline" className="h-10 rounded-full border-white/20 bg-white/5 px-5 text-white shadow-none hover:bg-white/10">
                           <Link href={route('register')}>{translate.button.sign_up || 'Sign up'}</Link>
                        </Button>
                        <Button asChild className="h-10 rounded-full bg-primary px-5 text-white shadow-none hover:bg-primary/90">
                           <Link href={route('login')}>{translate.button.log_in || 'Log in'}</Link>
                        </Button>
                     </div>
                  )}

                  <Button
                     size="icon"
                     variant="outline"
                     className="h-10 w-10 rounded-full border-white/20 bg-white/10 text-white shadow-none hover:bg-white/15 hover:text-white lg:hidden"
                     onClick={() => setIsMenuOpen((value) => !value)}
                  >
                     {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
               </div>
            </PublicContainer>

            {isMenuOpen && (
               <ScrollArea className="border-t border-white/10 bg-slate-950/95 text-white lg:hidden">
                  <div className="space-y-6 px-5 py-6">
                     {linkTree.length > 0 ? <div className="space-y-3">{linkTree.map((node, index) => renderMobileNode(node, index))}</div> : null}

                     <div className="grid gap-3 sm:grid-cols-2">
                        {actionItems.map((item) => {
                           if (item.slug === 'theme') {
                              return <AppearanceToggleTab key={item.id} className="w-full" />;
                           }

                           if (item.slug === 'language' && system.fields.language_selector && language) {
                              return (
                                 <div key={item.id} className="flex items-center justify-between rounded-[18px] border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-white/90">{buttonLabels.language || 'Language'}</span>
                                    <Language />
                                 </div>
                              );
                           }

                           if (item.slug === 'cart') {
                              return (
                                 <div key={item.id} className="flex items-center justify-between rounded-[18px] border border-white/10 px-4 py-3">
                                    <span className="text-sm font-medium text-white/90">{buttonLabels.cart || 'Carrinho'}</span>
                                    <CourseCart />
                                 </div>
                              );
                           }

                           return null;
                        })}
                     </div>

                     {customizable && isAdmin && (
                        <Button asChild variant="outline" className="w-full rounded-full shadow-none">
                           <Link href={customizeLink}>{props.customize ? translate.button.back || 'Back' : translate.button.edit || 'Customize'}</Link>
                        </Button>
                     )}

                     {user ? (
                        <div className="space-y-3 border-t border-white/10 pt-4">
                           <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                              {user.photo ? (
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.photo} alt={user.name ?? ''} className="h-full w-full content-center object-cover" />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                 </Avatar>
                              ) : (
                                 <UserCircle className="h-10 w-10 text-slate-500" />
                              )}
                              <div className="min-w-0">
                                 <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                                 <p className="truncate text-xs text-slate-300">{user.email}</p>
                              </div>
                           </div>

                           {(user.role === 'admin' || user.role === 'instructor') && (
                              <Button asChild className="w-full rounded-full bg-primary text-white shadow-none hover:bg-primary/90">
                                 <Link href={route('dashboard')}>{translate.button.dashboard || 'Dashboard'}</Link>
                              </Button>
                           )}

                           {(user.role === 'student' || user.role === 'instructor') && (
                              <>
                                 <Button asChild variant="outline" className="w-full rounded-full border-white/20 bg-white/5 text-white shadow-none hover:bg-white/10">
                                    <Link href={route('student.index', { tab: 'courses' })}>{translate.button.my_courses || 'My Courses'}</Link>
                                 </Button>
                                 <Button asChild variant="outline" className="w-full rounded-full border-white/20 bg-white/5 text-white shadow-none hover:bg-white/10">
                                    <Link href={route('student.index', { tab: 'profile' })}>{translate.button.profile || 'Profile'}</Link>
                                 </Button>
                                 <Button asChild variant="outline" className="w-full rounded-full border-white/20 bg-white/5 text-white shadow-none hover:bg-white/10">
                                    <Link href={route('student.index', { tab: 'settings' })}>{translate.button.settings || 'Settings'}</Link>
                                 </Button>
                              </>
                           )}

                           <Button variant="secondary" className="w-full rounded-full bg-white/10 text-white hover:bg-white/15" onClick={() => router.post('/logout')}>
                              <LogOut className="mr-2 h-4 w-4" />
                              {translate.button.logout || 'Log out'}
                           </Button>
                        </div>
                     ) : (
                        <div className="space-y-3 border-t border-slate-200 pt-4">
                           <Button asChild variant="outline" className="w-full rounded-full border-white/20 bg-white/5 text-white shadow-none hover:bg-white/10">
                              <Link href={route('register')}>{translate.button.sign_up || 'Sign up'}</Link>
                           </Button>
                           <Button asChild className="w-full rounded-full bg-primary text-white shadow-none hover:bg-primary/90">
                              <Link href={route('login')}>{translate.button.log_in || 'Log in'}</Link>
                           </Button>
                        </div>
                     )}
                  </div>
               </ScrollArea>
            )}
         </div>

         {heightCover && <div className="relative z-20 h-[92px] bg-transparent" />}
      </div>
   );
};

export default Navbar;
