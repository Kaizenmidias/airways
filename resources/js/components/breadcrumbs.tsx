import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs, className, listClassName }: { breadcrumbs: any[]; className?: string; listClassName?: string }) {
   return (
      <>
         {breadcrumbs.length > 0 && (
            <Breadcrumb className={className}>
               <BreadcrumbList className={listClassName}>
                  {breadcrumbs.map((item, index) => {
                     const isLast = index === breadcrumbs.length - 1;
                     return (
                        <Fragment key={`breadcrumbs-${index}`}>
                           <BreadcrumbItem>
                              {isLast ? (
                                 <BreadcrumbPage className={cn('text-white/70 transition-colors hover:text-[#FD122E]', item.className)}>{item.title}</BreadcrumbPage>
                              ) : (
                                 <BreadcrumbLink asChild className={cn('text-white/70 transition-colors hover:text-[#FD122E]', item.className)}>
                                    <Link href={item.href}>{item.title}</Link>
                                 </BreadcrumbLink>
                              )}
                           </BreadcrumbItem>
                           {!isLast && <BreadcrumbSeparator key={`separator-${index}`} />}
                        </Fragment>
                     );
                  })}
               </BreadcrumbList>
            </Breadcrumb>
         )}
      </>
   );
}
