import AppLogo from '@/components/app-logo';
import Appearance from '@/components/appearance';
import AppearanceToggleTab from '@/components/appearance-tabs';
import CourseCart from '@/components/course-cart';
import Language from '@/components/language';
import Notification from '@/components/notification';
import SearchInput from '@/components/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import PublicContainer from '@/components/public/public-container';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, GraduationCap, LayoutDashboard, LogOut, Menu, SettingsIcon, UserCircle, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType } from 'react';

interface NavbarProps {
   language?: boolean;
   heightCover?: boolean;
   customizable?: boolean;
}

type NavbarAction = NavbarItem & {
   type?: string;
   value?: string | null;
   items?: NavbarAction[] | null;
};

const Navbar = ({ language = true, heightCover = true, customizable = true }: NavbarProps) => {
   const { props } = usePage<SharedData>();
   const { ziggy, navbar, translate, system, auth } = props;
   const isAdmin = auth?.user?.role === 'admin';
   const [isSticky, setIsSticky] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const sortedItems = useMemo(() => {
      return Array.isArray(navbar?.navbar_items) ? [...navbar.navbar_items].sort((a, b) => a.sort - b.sort) : [];
   }, [navbar]);

   const linkItems = sortedItems.filter((item) => (item.type === 'url' || item.type === 'dropdown') && item.active !== false);
   const actionItems = sortedItems.filter((item) => item.type === 'action' && item.active !== false);
   const customizeLink = props.customize ? ziggy.location : '?customize=true';
   const user = auth?.user;

   useEffect(() => {
      const handleScroll = () => {
         setIsSticky(window.scrollY > 100);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   const resolveHref = (item: NavbarAction) => item.value || '';
   const isExternal = (href: string) => /^https?:\/\//i.test(href);

   const renderNavItem = (item: NavbarAction) => {
      const href = resolveHref(item);
      const linkClass = 'text-sm font-medium text-slate-700 transition-colors hover:text-slate-950';

      if (item.type === 'dropdown' && Array.isArray(item.items) && item.items.length > 0) {
         return (
            <DropdownMenu key={item.id}>
               <DropdownMenuTrigger className={cn('flex cursor-pointer items-center gap-1 outline-none', linkClass)}>
                  <span>{item.title}</span>
                  <ChevronDown className="h-4 w-4" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="min-w-56">
                  {item.items
                     .filter((subItem) => subItem.active !== false)
                     .map((subItem, index) => {
                     const subHref = subItem.value || '';
                     if (!subHref) {
                        return (
                           <DropdownMenuItem key={`${item.id}-${index}`} className="cursor-default px-4 py-2">
                              {subItem.title}
                           </DropdownMenuItem>
                        );
                     }

                     return (
                        <DropdownMenuItem key={`${item.id}-${index}`} className="cursor-pointer px-0 py-0" asChild>
                           {isExternal(subHref) ? (
                              <a href={subHref} className="block w-full px-4 py-2">
                                 {subItem.title}
                              </a>
                           ) : (
                              <Link href={subHref} className="block w-full px-4 py-2">
                                 {subItem.title}
                              </Link>
                           )}
                        </DropdownMenuItem>
                     );
                     })}
               </DropdownMenuContent>
            </DropdownMenu>
         );
      }

      if (!href) {
         return (
            <span key={item.id} className={linkClass}>
               {item.title}
            </span>
         );
      }

      if (isExternal(href)) {
         return (
            <a key={item.id} href={href} className={linkClass}>
               {item.title}
            </a>
         );
      }

      return (
         <Link key={item.id} href={href} className={linkClass}>
            {item.title}
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
               {user.photo ? (
                  <Avatar className="h-10 w-10 border border-slate-200">
                     <AvatarImage src={user.photo} alt={user.name ?? ''} className="h-full w-full content-center object-cover" />
                     <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
               ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
                     <UserCircle className="h-6 w-6 text-slate-500" />
                  </div>
               )}
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
         <div className="border-b border-slate-200/70 bg-slate-950 text-white">
            <PublicContainer className="flex h-9 items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em]">
               <span className="truncate text-slate-300">{system.fields.slogan || system.fields.description || system.fields.name}</span>
               <div className="hidden items-center gap-5 md:flex">
                  {system.fields.email && (
                     <a href={`mailto:${system.fields.email}`} className="text-slate-300 transition-colors hover:text-white">
                        {system.fields.email}
                     </a>
                  )}
                  {system.fields.phone && (
                     <a href={`tel:${system.fields.phone}`} className="text-slate-300 transition-colors hover:text-white">
                        {system.fields.phone}
                     </a>
                  )}
               </div>
            </PublicContainer>
         </div>

         <div
            className={cn(
               'fixed top-0 left-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl',
               isSticky && 'shadow-[0_12px_40px_rgba(15,23,42,0.08)]',
            )}
         >
            <PublicContainer className={cn('relative flex h-[80px] items-center justify-between gap-4', customizable && isAdmin && 'section-edit')}>
               <div className="flex items-center gap-3">
                  <Link href="/" className="inline-flex items-center">
                     <AppLogo className="h-8 w-auto" />
                  </Link>
               </div>

               <div className="hidden flex-1 items-center justify-center gap-6 xl:flex">
                  {linkItems.length > 0 && <nav className="flex items-center gap-6">{linkItems.map((item) => renderNavItem(item))}</nav>}

                  <SearchInput
                     className="hidden min-w-[230px] max-w-[280px] 2xl:block"
                     placeholder={translate.common?.search || 'Search'}
                     onChangeValue={(value) => router.get(route('category.courses', { category: 'all', search: value }))}
                  />
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
                           return <Notification key={item.id} />;
                        }

                        if (item.slug === 'cart') {
                           return <CourseCart key={item.id} />;
                        }

                        return null;
                     })}
                  </div>

                  {customizable && isAdmin && (
                     <Button asChild variant="outline" className="hidden h-10 rounded-full px-5 shadow-none lg:inline-flex">
                        <Link href={customizeLink}>{props.customize ? translate.button.back || 'Back' : translate.button.edit || 'Customize'}</Link>
                     </Button>
                  )}

                  {user ? (
                     <div className="hidden items-center gap-3 lg:flex">{renderProfileMenu()}</div>
                  ) : (
                     <div className="hidden items-center gap-2 lg:flex">
                        <Button asChild variant="outline" className="h-10 rounded-full px-5 shadow-none">
                           <Link href={route('register')}>{translate.button.sign_up || 'Sign up'}</Link>
                        </Button>
                        <Button asChild className="h-10 rounded-full bg-primary px-5 shadow-none hover:bg-primary/90">
                           <Link href={route('login')}>{translate.button.log_in || 'Log in'}</Link>
                        </Button>
                     </div>
                  )}

                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full lg:hidden" onClick={() => setIsMenuOpen((value) => !value)}>
                     {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
               </div>
            </PublicContainer>

            {isMenuOpen && (
               <ScrollArea className="border-t border-slate-200 bg-white lg:hidden">
                  <div className="space-y-6 px-5 py-6">
                     <SearchInput
                        className="w-full max-w-none"
                        placeholder={translate.common?.search || 'Search'}
                        onChangeValue={(value) => router.get(route('category.courses', { category: 'all', search: value }))}
                     />

                     {linkItems.length > 0 && <nav className="flex flex-col gap-4">{linkItems.map((item) => renderNavItem(item))}</nav>}

                     <div className="grid gap-3 sm:grid-cols-2">
                        {actionItems.map((item) => {
                           if (item.slug === 'theme') {
                              return <AppearanceToggleTab key={item.id} className="w-full" />;
                           }

                           if (item.slug === 'language' && system.fields.language_selector && language) {
                              return (
                                 <div key={item.id} className="flex items-center justify-between rounded-[18px] border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">{translate.button.language || 'Language'}</span>
                                    <Language />
                                 </div>
                              );
                           }

                           if (item.slug === 'cart') {
                              return (
                                 <div key={item.id} className="flex items-center justify-between rounded-[18px] border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">{translate.button.cart || 'Cart'}</span>
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
                        <div className="space-y-3 border-t border-slate-200 pt-4">
                           <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                              {user.photo ? (
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.photo} alt={user.name ?? ''} className="h-full w-full content-center object-cover" />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                 </Avatar>
                              ) : (
                                 <UserCircle className="h-10 w-10 text-slate-500" />
                              )}
                              <div className="min-w-0">
                                 <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
                                 <p className="truncate text-xs text-slate-500">{user.email}</p>
                              </div>
                           </div>

                           {(user.role === 'admin' || user.role === 'instructor') && (
                              <Button asChild className="w-full rounded-full bg-primary shadow-none hover:bg-primary/90">
                                 <Link href={route('dashboard')}>{translate.button.dashboard || 'Dashboard'}</Link>
                              </Button>
                           )}

                           {(user.role === 'student' || user.role === 'instructor') && (
                              <>
                                 <Button asChild variant="outline" className="w-full rounded-full shadow-none">
                                    <Link href={route('student.index', { tab: 'courses' })}>{translate.button.my_courses || 'My Courses'}</Link>
                                 </Button>
                                 <Button asChild variant="outline" className="w-full rounded-full shadow-none">
                                    <Link href={route('student.index', { tab: 'profile' })}>{translate.button.profile || 'Profile'}</Link>
                                 </Button>
                                 <Button asChild variant="outline" className="w-full rounded-full shadow-none">
                                    <Link href={route('student.index', { tab: 'settings' })}>{translate.button.settings || 'Settings'}</Link>
                                 </Button>
                              </>
                           )}

                           <Button variant="secondary" className="w-full rounded-full" onClick={() => router.post('/logout')}>
                              <LogOut className="mr-2 h-4 w-4" />
                              {translate.button.logout || 'Log out'}
                           </Button>
                        </div>
                     ) : (
                        <div className="space-y-3 border-t border-slate-200 pt-4">
                           <Button asChild variant="outline" className="w-full rounded-full shadow-none">
                              <Link href={route('register')}>{translate.button.sign_up || 'Sign up'}</Link>
                           </Button>
                           <Button asChild className="w-full rounded-full bg-primary shadow-none hover:bg-primary/90">
                              <Link href={route('login')}>{translate.button.log_in || 'Log in'}</Link>
                           </Button>
                        </div>
                     )}
                  </div>
               </ScrollArea>
            )}
         </div>

         {heightCover && <div className="relative z-20 h-[80px] bg-transparent" />}
      </div>
   );
};

export default Navbar;
