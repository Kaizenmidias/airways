import AppLogo from '@/components/app-logo';
import Appearance from '@/components/appearance';
import Notification from '@/components/notification';
import ProfileToggle from '@/components/profile-toggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { buildNavbarTree, type NavbarTreeNode } from '@/lib/navbar-tree';
import { Link } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface NavbarPreviewProps {
   auth: boolean;
   navbar: Navbar;
}

const NavbarPreview = ({ auth, navbar }: NavbarPreviewProps) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const items = useMemo(() => [...navbar.navbar_items].sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.id) - Number(b.id)), [navbar.navbar_items]);
   const linkTree = useMemo(() => buildNavbarTree(items.filter((item) => item.type !== 'action' && item.active)), [items]);

   const resolveCourseHref = (course: Course) => route('course.details', { slug: course.slug, id: course.id });

   const renderNavLabel = (item: NavbarItem) => (
      <span className="flex flex-col leading-tight">
         {item.subtitle ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300/80">{item.subtitle}</span> : null}
         <span>{item.title}</span>
      </span>
   );

   const renderNode = (node: NavbarTreeNode) => {
      const { item } = node;
      const href = item.value || '';

      if (item.type === 'category') {
         const courses = item.course_category?.courses ?? [];

         if (courses.length > 0) {
            return (
               <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center py-1 text-sm">
                     {renderNavLabel(item)}
                     <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-20">
                     {courses.map((course) => (
                        <DropdownMenuItem key={course.id} asChild className="cursor-pointer px-5">
                           <Link href={resolveCourseHref(course)}>{course.title}</Link>
                        </DropdownMenuItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         }

         return (
            <Link key={item.id} href={route('category.courses', { category: item.course_category?.slug || item.slug })} className="py-1 text-sm font-normal">
               {renderNavLabel(item)}
            </Link>
         );
      }

      if (node.children.length > 0) {
         return (
            <DropdownMenu key={item.id}>
               <DropdownMenuTrigger className="flex cursor-pointer items-center py-1 text-sm">
                  {renderNavLabel(item)}
                  <ChevronDown className="ml-1 h-4 w-4" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="min-w-20">
                  {node.children.map((subNode, idx) => {
                     const subHref = subNode.item.value || '';

                     if (!subHref) {
                        return (
                           <DropdownMenuItem key={`${item.id}-${idx}`} className="cursor-default px-5">
                              {renderNavLabel(subNode.item)}
                           </DropdownMenuItem>
                        );
                     }

                     return (
                        <DropdownMenuItem key={`${item.id}-${idx}`} asChild className="cursor-pointer px-5">
                           <Link href={subHref}>{renderNavLabel(subNode.item)}</Link>
                        </DropdownMenuItem>
                     );
                  })}
               </DropdownMenuContent>
            </DropdownMenu>
         );
      }

      if (!href) {
         return <span key={item.id} className="py-1 text-sm font-normal">{renderNavLabel(item)}</span>;
      }

      return (
         <Link key={item.id} href={href} className="py-1 text-sm font-normal">
            {renderNavLabel(item)}
         </Link>
      );
   };

   const renderActionItems = (item: NavbarItem) => {
      if (item.type === 'action' && item.active) {
         switch (item.slug) {
            // case 'search':
            //    return <SearchInput placeholder="Search courses, instructors..." onChangeValue={() => {}} />;

            case 'theme':
               return <Appearance />;

            case 'notification':
               return <Notification />;

            case 'profile':
               return <ProfileToggle />;

            default:
               return null;
         }
      }

      return null;
   };

   return (
      <div className="border-border bg-background rounded-lg border px-4 transition-colors">
         <div className="flex h-16 items-center justify-between">
            {/* Logo */}
               <div className="flex items-center gap-10">
                  <Link href="/">
                     <AppLogo />
                  </Link>

                  {/* Desktop Navigation */}
                  <div className="hidden gap-4 md:flex md:items-center">
                     {linkTree.map((node) => renderNode(node))}
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  {auth ? (
                     items.map((item) => <div key={item.id}>{renderActionItems(item)}</div>)
                  ) : (
                     <>
                     <Button asChild variant="outline" className="h-auto rounded-sm px-5 py-2.5 shadow-none">
                        <Link href={route('register')}>Sign Up</Link>
                     </Button>
                     <Button asChild className="h-auto rounded-sm px-5 py-2.5 shadow-none">
                        <Link href={route('login')}>Log In</Link>
                     </Button>
                  </>
               )}

               {/* Mobile menu button */}
               <Button size="icon" variant="secondary" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
               </Button>
            </div>
         </div>

         {/* Mobile Menu */}
         {isMenuOpen && (
            <ScrollArea className="animate-fade-in h-[calc(100vh-72px)] border-t md:hidden">
               <div className="flex flex-col space-y-4 py-4">
                  {linkTree.map((node) => renderNode(node))}
               </div>
            </ScrollArea>
         )}
      </div>
   );
};

export default NavbarPreview;
