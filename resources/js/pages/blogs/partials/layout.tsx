import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useScreen from '@/hooks/use-screen';
import LandingLayout from '@/layouts/landing-layout';
import { getQueryParams } from '@/lib/route';
import { router, usePage } from '@inertiajs/react';
import { ListFilter } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { BlogsIndexProps } from '..';
import BlogFilter from './blog-filter';

const Layout = ({ children }: { children: ReactNode }) => {
   const { url, props } = usePage<BlogsIndexProps>();
   const { category } = props;
   const [open, setOpen] = useState(false);
   const urlParams = getQueryParams(url);
   const { screen } = useScreen();

   const getQueryRoute = (newParams: Record<string, string>, category: string, category_child?: string) => {
      const updatedParams = { ...urlParams };

      if ('search' in updatedParams) {
         delete updatedParams.search;
      }

      return route('blogs.guest', {
         category,
         category_child,
         ...updatedParams,
         ...newParams,
      });
   };

   const gridListHandler = (view: string) => {
      router.get(getQueryRoute({ view }, category?.slug || 'all'));
   };

   return (
      <LandingLayout customizable={false}>
         <section className="overflow-hidden bg-slate-950 text-white">
            <div className="relative isolate overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.22),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.16),transparent_28%),linear-gradient(180deg,#02070f_0%,#04101f_58%,#02070f_100%)]" />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950/94 via-slate-950/82 to-slate-950/94" />

               <div className="container relative mx-auto max-w-[1600px] px-6 pt-28 pb-16 text-center sm:px-10 sm:pt-32 sm:pb-20 lg:px-14">
                  <h1 className="mx-auto max-w-4xl text-4xl leading-[0.96] font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.5rem]">
                     Confira nossos artigos
                  </h1>
               </div>
            </div>
         </section>

         <div className="container flex items-start gap-6 py-6">
            {screen > 768 && (
               <Card className="sticky top-24 w-64 p-4">
                  <BlogFilter />
               </Card>
            )}

            {/* Main Content */}
            <div className="flex-1">
               <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     {screen < 768 && (
                        <Sheet open={open} onOpenChange={setOpen}>
                           <SheetTrigger asChild>
                              <Button size="icon" variant="outline">
                                 <ListFilter className="h-5 w-5" />
                              </Button>
                           </SheetTrigger>

                           <SheetContent side="left" className="border-border w-[220px]">
                              <ScrollArea className="h-full">
                                 <BlogFilter setOpen={setOpen} />
                              </ScrollArea>
                           </SheetContent>
                        </Sheet>
                     )}

                     <div>
                        <h2 className="text-2xl font-bold capitalize">{category ? category?.name : 'Todos os artigos'}</h2>
                        {category && category.description && <p className="text-muted-foreground mt-1 text-sm">{category?.description}</p>}
                     </div>
                  </div>
               </div>

               {/* Blog Grid */}
               {children}
            </div>
         </div>
      </LandingLayout>
   );
};

export default Layout;
