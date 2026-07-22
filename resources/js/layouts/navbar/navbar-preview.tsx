import AppLogo from '@/components/app-logo';
import Appearance from '@/components/appearance';
import Notification from '@/components/notification';
import ProfileToggle from '@/components/profile-toggle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { buildNavbarTree, type NavbarTreeNode } from '@/lib/navbar-tree';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
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
         {item.subtitle ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8]">{item.subtitle}</span> : null}
         <span className="text-inherit">{item.title}</span>
      </span>
   );

   const renderCourseItems = (courses: Course[]) =>
      courses.map((course) => (
         <DropdownMenuItem key={course.id} asChild className="cursor-pointer px-5">
            <Link href={resolveCourseHref(course)} className="block w-full text-foreground transition-colors hover:bg-white hover:text-primary focus:bg-white focus:text-primary data-[highlighted]:bg-white data-[highlighted]:text-primary">
               <span className="flex flex-col leading-tight">
                  {course.sub_title ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8]">{course.sub_title}</span> : null}
                  <span className="text-inherit">{course.title}</span>
               </span>
            </Link>
         </DropdownMenuItem>
      ));

   const renderSubCategoryItems = (category: CourseCategory, childCategories: CourseCategoryChild[]) =>
      childCategories.map((child) => {
         const childCourses = child.courses ?? [];
         const childHref = route('category.courses', { category: category.slug, category_child: child.slug });

         if (childCourses.length > 0) {
            return (
               <DropdownMenuSub key={child.id}>
                  <DropdownMenuSubTrigger className="flex cursor-pointer items-center py-1 text-sm text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary">
                     <span className="flex flex-col leading-tight">
                        <span>{child.title}</span>
                     </span>
                     <ChevronRight className="ml-auto h-4 w-4" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-20">
                     {renderCourseItems(childCourses)}
                  </DropdownMenuSubContent>
               </DropdownMenuSub>
            );
         }

         return (
            <DropdownMenuItem key={child.id} asChild className="cursor-pointer px-5">
               <Link href={childHref} className="block w-full text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
                  <span className="flex flex-col leading-tight">
                     <span>{child.title}</span>
                  </span>
               </Link>
            </DropdownMenuItem>
         );
      });

   const renderCategoryNode = (item: NavbarItem, keySuffix = '') => {
      const category = item.course_category;
      const courses = category?.courses ?? [];
      const childCategories = category?.category_children ?? [];
      const categoryHref = route('category.courses', { category: category?.slug || item.slug });

      if (keySuffix) {
         return (
            <DropdownMenuSub key={`${item.id}${keySuffix}`}>
               <DropdownMenuSubTrigger className="flex cursor-pointer items-center py-1 text-sm text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary">
                  {renderNavLabel(item)}
                  <ChevronRight className="ml-auto h-4 w-4" />
               </DropdownMenuSubTrigger>
               <DropdownMenuSubContent className="min-w-20">
                  {courses.length > 0 ? renderCourseItems(courses) : null}
                  {childCategories.length > 0 ? renderSubCategoryItems(category as CourseCategory, childCategories) : null}
               </DropdownMenuSubContent>
            </DropdownMenuSub>
         );
      }

      return (
         <DropdownMenu key={item.id}>
            <DropdownMenuTrigger className="flex cursor-pointer items-center py-1 text-sm text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary">
               {renderNavLabel(item)}
               <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-20">
               {courses.length > 0 ? renderCourseItems(courses) : null}
               {childCategories.length > 0 ? renderSubCategoryItems(category as CourseCategory, childCategories) : null}
               {childCategories.length === 0 && courses.length === 0 ? (
                  <DropdownMenuItem asChild className="cursor-pointer px-5">
                     <Link href={categoryHref} className="block w-full text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
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
         .map((subNode, idx) => {
            const subItem = subNode.item;

            if (subItem.type === 'category') {
               return renderCategoryNode(subItem, `-${parentKey}-${idx}`);
            }

            if (subNode.children.length > 0) {
               return (
                  <DropdownMenuSub key={`${parentKey}-${idx}`}>
                     <DropdownMenuSubTrigger className="flex cursor-pointer items-center py-1 text-sm text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[state=open]:bg-white data-[state=open]:!text-primary">
                        {renderNavLabel(subItem)}
                        <ChevronRight className="ml-auto h-4 w-4" />
                     </DropdownMenuSubTrigger>
                     <DropdownMenuSubContent className="min-w-20">
                        {renderChildren(subNode.children, `${parentKey}-${idx}`)}
                     </DropdownMenuSubContent>
                  </DropdownMenuSub>
               );
            }

            const subHref = subItem.value || '';

            if (!subHref) {
               return (
                  <DropdownMenuItem key={`${parentKey}-${idx}`} className="cursor-default px-5">
                     {renderNavLabel(subItem)}
                  </DropdownMenuItem>
               );
            }

            return (
               <DropdownMenuItem key={`${parentKey}-${idx}`} asChild className="cursor-pointer px-5">
                  <Link href={subHref} className="block w-full text-foreground transition-colors hover:bg-white hover:!text-primary focus:bg-white focus:!text-primary data-[highlighted]:bg-white data-[highlighted]:!text-primary">
                     {renderNavLabel(subItem)}
                  </Link>
               </DropdownMenuItem>
            );
         });

   const renderMobileCourseItems = (courses: Course[]) =>
      courses.map((course) => (
         <Link
            key={course.id}
            href={resolveCourseHref(course)}
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-xl border border-border px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
         >
            <span className="flex flex-col leading-tight">
               {course.sub_title ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8]">{course.sub_title}</span> : null}
                  <span className="text-inherit">{course.title}</span>
            </span>
         </Link>
      ));

   const renderMobileSubCategories = (category: CourseCategory, childCategories: CourseCategoryChild[]) => (
      <Accordion type="single" collapsible className="space-y-2">
         {childCategories.map((child) => {
            const childCourses = child.courses ?? [];
            const childHref = route('category.courses', { category: category.slug, category_child: child.slug });

            if (childCourses.length > 0) {
               return (
                  <AccordionItem key={child.id} value={`child-${child.id}`} className="border-b-0">
                     <AccordionTrigger className="rounded-xl px-3 py-2 text-left text-sm font-medium text-foreground hover:no-underline [&>svg]:text-muted-foreground">
                        <span className="flex flex-col leading-tight">
                           <span className="text-inherit">{child.title}</span>
                        </span>
                     </AccordionTrigger>
                     <AccordionContent className="pb-0 pt-2">
                        <div className="space-y-2 pl-3">{renderMobileCourseItems(childCourses)}</div>
                     </AccordionContent>
                  </AccordionItem>
               );
            }

            return (
               <Link
                  key={child.id}
                  href={childHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl border border-border px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
               >
                  <span className="flex flex-col leading-tight">
                     <span className="text-inherit">{child.title}</span>
                  </span>
               </Link>
            );
         })}
      </Accordion>
   );

   const renderMobileNode = (node: NavbarTreeNode, parentKey: string | number) => {
      const { item } = node;
      const href = item.value || '';

      if (item.type === 'category') {
         const category = item.course_category;
         const courses = category?.courses ?? [];
         const childCategories = category?.category_children ?? [];
         const hasContent = courses.length > 0 || childCategories.length > 0;

         if (!hasContent) {
            return (
               <Link
                  key={item.id}
                  href={route('category.courses', { category: category?.slug || item.slug })}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl border border-border px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
               >
                  {renderNavLabel(item)}
               </Link>
            );
         }

         return (
            <AccordionItem key={item.id} value={`cat-${parentKey}-${item.id}`} className="border-b-0">
               <AccordionTrigger className="rounded-xl px-3 py-2 text-left text-sm font-medium text-foreground hover:no-underline [&>svg]:text-muted-foreground">
                  {renderNavLabel(item)}
               </AccordionTrigger>
               <AccordionContent className="pb-0 pt-2">
                  <div className="space-y-3 pl-3">
                     {courses.length > 0 ? <div className="space-y-2">{renderMobileCourseItems(courses)}</div> : null}
                     {childCategories.length > 0 ? renderMobileSubCategories(category as CourseCategory, childCategories) : null}
                  </div>
               </AccordionContent>
            </AccordionItem>
         );
      }

      if (node.children.length > 0) {
         return (
            <AccordionItem key={item.id} value={`node-${parentKey}-${item.id}`} className="border-b-0">
               <AccordionTrigger className="rounded-xl px-3 py-2 text-left text-sm font-medium text-foreground hover:no-underline [&>svg]:text-muted-foreground">
                  {renderNavLabel(item)}
               </AccordionTrigger>
               <AccordionContent className="pb-0 pt-2">
                  <div className="space-y-2 pl-3">{node.children.map((childNode, index) => renderMobileNode(childNode, `${parentKey}-${index}`))}</div>
               </AccordionContent>
            </AccordionItem>
         );
      }

      if (!href) {
         return (
            <div key={item.id} className="rounded-xl border border-border px-3 py-2">
               <span className="flex flex-col leading-tight text-muted-foreground">
                  {item.subtitle ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ccccccb8]">{item.subtitle}</span> : null}
                  <span className="text-inherit">{item.title}</span>
               </span>
            </div>
         );
      }

      return (
         <Link
            key={item.id}
            href={href}
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-xl border border-border px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
         >
            {renderNavLabel(item)}
         </Link>
      );
   };

   const renderNode = (node: NavbarTreeNode) => {
      const { item } = node;
      const href = item.value || '';

      if (item.type === 'category') {
         return renderCategoryNode(item);
      }

      if (node.children.length > 0) {
         return (
            <DropdownMenu key={item.id}>
               <DropdownMenuTrigger className="flex cursor-pointer items-center py-1 text-sm">
                  {renderNavLabel(item)}
                  <ChevronDown className="ml-1 h-4 w-4" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="min-w-20">
                  {renderChildren(node.children, item.id)}
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
               <div className="space-y-4 py-4">
                  <Accordion type="single" collapsible className="space-y-3">
                     {linkTree.map((node, index) => renderMobileNode(node, index))}
                  </Accordion>
               </div>
            </ScrollArea>
         )}
      </div>
   );
};

export default NavbarPreview;
