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
         <div className="blogs-page font-sans font-normal text-slate-900">
            <section className="relative isolate overflow-hidden border-b border-white/10 bg-slate-950 text-white">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.22),transparent_24%),radial-gradient(circle_at_82%_28%,rgba(37,99,235,0.16),transparent_26%),linear-gradient(180deg,#02070f_0%,#08111f_100%)]" />
               <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_22%)]" />

               <div className="relative mx-auto flex min-h-[390px] max-w-[1600px] flex-col justify-center px-5 py-28 sm:px-10 sm:py-32 lg:px-14">
                  <div className="max-w-4xl space-y-5">
                     <p className="text-[11px] tracking-[0.34em] text-white/60 uppercase">Airways Academy</p>
                     <h1 className="max-w-5xl text-4xl leading-[0.96] font-normal tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.4rem]">
                        Notícias
                     </h1>
                     <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                        Conteúdos, atualizações e leituras selecionadas para acompanhar a rotina da Airways.
                     </p>
                  </div>
               </div>
            </section>

            <section className="bg-[#f4f7fb]">
               <div className="mx-auto grid max-w-[1600px] gap-6 px-5 py-10 sm:px-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-14 lg:py-12">
                  {screen > 768 ? (
                     <aside className="sticky top-24 self-start">
                        <Card className="overflow-hidden border-slate-200/80 bg-white/95 shadow-[0_14px_50px_rgba(15,23,42,0.06)]">
                           <BlogFilter />
                        </Card>
                     </aside>
                  ) : null}

                  <div className="min-w-0">
                     <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="space-y-2">
                           <p className="text-[11px] tracking-[0.3em] text-slate-500 uppercase">Artigos</p>
                           <h2 className="text-2xl leading-tight font-normal tracking-[-0.04em] text-slate-950 capitalize sm:text-[2rem]">
                              {category ? category?.name : 'Todos os artigos'}
                           </h2>
                           {category && category.description ? (
                              <p className="max-w-2xl text-sm leading-7 text-slate-600">{category.description}</p>
                           ) : null}
                        </div>

                        {screen < 768 ? (
                           <Sheet open={open} onOpenChange={setOpen}>
                              <SheetTrigger asChild>
                                 <Button size="icon" variant="outline" className="h-11 w-11 rounded-full border-slate-200 bg-white text-slate-700">
                                    <ListFilter className="h-5 w-5" />
                                 </Button>
                              </SheetTrigger>

                              <SheetContent side="left" className="w-[300px] border-slate-200 bg-[#f4f7fb] p-0">
                                 <ScrollArea className="h-full p-4">
                                    <Card className="border-slate-200/80 bg-white shadow-[0_14px_50px_rgba(15,23,42,0.06)]">
                                       <BlogFilter setOpen={setOpen} />
                                    </Card>
                                 </ScrollArea>
                              </SheetContent>
                           </Sheet>
                        ) : null}
                     </div>

                     {children}
                  </div>
               </div>
            </section>
         </div>
      </LandingLayout>
   );
};

export default Layout;
