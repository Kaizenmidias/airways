import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandingLayout from '@/layouts/landing-layout';
import { getQueryParams } from '@/lib/route';
import { router, usePage } from '@inertiajs/react';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { FormEvent, ReactNode, useState } from 'react';
import { CoursesIndexProps } from './index';
import CourseFilter from './partials/course-filter';

const Layout = ({ children }: { children: ReactNode }) => {
   const { url, props } = usePage<CoursesIndexProps>();
   const { category, categoryChild, categories, levels, prices, courses, translate } = props;
   const { frontend } = translate;
   const [open, setOpen] = useState(false);
   const urlParams = getQueryParams(url);
   const viewType = urlParams['view'] ?? 'grid';
   const selectedCategory = categoryChild ? `${category?.slug || 'all'}::${categoryChild.slug}` : category?.slug || 'all';
   const [search, setSearch] = useState(urlParams['search'] || '');
   const [courseCategory, setCourseCategory] = useState(selectedCategory);
   const [price, setPrice] = useState(urlParams['price'] || 'all');
   const [level, setLevel] = useState(urlParams['level'] || 'all');

   const getQueryRoute = (newParams: Record<string, string>, category: string, category_child?: string) => {
      const updatedParams = { ...urlParams };

      if ('search' in updatedParams) {
         delete updatedParams.search;
      }

      return route('category.courses', {
         category,
         category_child,
         ...updatedParams,
         ...newParams,
      });
   };

   const gridListHandler = (view: string) => {
      router.get(getQueryRoute({ view }, category?.slug || 'all', categoryChild?.slug));
   };

   const searchHandler = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const [routeCategory, routeCategoryChild] = courseCategory.split('::');
      const query: Record<string, string> = {};

      if (search) query.search = search;
      if (price !== 'all') query.price = price;
      if (level !== 'all') query.level = level;
      if (viewType) query.view = viewType;

      router.get(
         route('category.courses', {
            category: routeCategory || 'all',
            category_child: routeCategoryChild || '',
            ...query,
         }),
      );
   };

   return (
      <LandingLayout customizable={false}>
         <section className="bg-slate-950 pt-28 pb-14 text-white lg:pt-36 lg:pb-20">
            <div className="container">
               <div className="mx-auto max-w-4xl text-center">
                  <p className="text-sm font-semibold tracking-[0.28em] text-[#FD122E] uppercase">Catalogo Airways</p>
                  <h1 className="mt-4 text-4xl leading-tight font-black text-white sm:text-5xl lg:text-6xl">Encontre sua proxima formacao</h1>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                     Cursos online para quem quer evoluir na aviacao com uma trilha objetiva, suporte especializado e conteudo aplicado.
                  </p>
               </div>

               <form
                  onSubmit={searchHandler}
                  className="mx-auto mt-10 max-w-6xl rounded-[28px] border border-white/15 bg-white/[0.06] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-md lg:p-7"
               >
                  <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_0.85fr_0.85fr_auto] lg:items-end">
                     <label className="space-y-2">
                        <span className="text-xs font-bold tracking-[0.24em] text-slate-400 uppercase">Buscar curso</span>
                        <Input
                           value={search}
                           onChange={(event) => setSearch(event.target.value)}
                           placeholder="Ex: piloto privado, comissario, ANAC"
                           className="h-12 rounded-2xl border-white/10 bg-white text-slate-950 placeholder:text-slate-500"
                        />
                     </label>

                     <label className="space-y-2">
                        <span className="text-xs font-bold tracking-[0.24em] text-slate-400 uppercase">Categoria</span>
                        <Select value={courseCategory} onValueChange={setCourseCategory}>
                           <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white text-slate-950">
                              <SelectValue placeholder="Todas" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              {categories.map((item) => {
                                 if (item.slug === 'default') return null;

                                 return (
                                    <SelectItem key={item.slug} value={item.slug}>
                                       {item.title}
                                    </SelectItem>
                                 );
                              })}
                              {categories.flatMap((item) =>
                                 (item.category_children || []).map((child) => (
                                    <SelectItem key={`${item.slug}-${child.slug}`} value={`${item.slug}::${child.slug}`}>
                                       {item.title} / {child.title}
                                    </SelectItem>
                                 )),
                              )}
                           </SelectContent>
                        </Select>
                     </label>

                     <label className="space-y-2">
                        <span className="text-xs font-bold tracking-[0.24em] text-slate-400 uppercase">Preco</span>
                        <Select value={price} onValueChange={setPrice}>
                           <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white text-slate-950">
                              <SelectValue placeholder="Todos" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              {prices.map((item) => (
                                 <SelectItem key={item} value={item} className="capitalize">
                                    {item}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </label>

                     <label className="space-y-2">
                        <span className="text-xs font-bold tracking-[0.24em] text-slate-400 uppercase">Nivel</span>
                        <Select value={level} onValueChange={setLevel}>
                           <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white text-slate-950">
                              <SelectValue placeholder="Todos" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              {levels.map((item) => (
                                 <SelectItem key={item} value={item} className="capitalize">
                                    {item}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </label>

                     <Button type="submit" className="h-12 rounded-2xl bg-[#FD122E] px-7 font-semibold text-white shadow-none hover:bg-[#d90f26]">
                        <Search className="h-5 w-5" />
                        Pesquisar
                     </Button>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                     <p className="text-sm text-slate-300">{courses?.total || 0} cursos encontrados para sua busca.</p>
                     <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                           <Button type="button" variant="secondary" className="h-10 rounded-full bg-white/12 px-5 text-white hover:bg-white/18">
                              <SlidersHorizontal className="h-4 w-4" />
                              Filtros avancados
                           </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="border-border w-[280px]">
                           <ScrollArea className="h-full pr-4">
                              <CourseFilter setOpen={setOpen} />
                           </ScrollArea>
                        </SheetContent>
                     </Sheet>
                  </div>
               </form>
            </div>
         </section>

         <div className="container py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold capitalize">
                     {category || categoryChild ? category?.title || categoryChild?.title : frontend.all} {frontend.courses}
                  </h2>
                  {((category && category.description) || (categoryChild && categoryChild.description)) && (
                     <p className="text-muted-foreground mt-1 text-sm">{category?.description || categoryChild?.description}</p>
                  )}
               </div>

               <div className="flex gap-2">
                  <TooltipProvider delayDuration={0}>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button size="icon" variant={viewType === 'grid' ? 'default' : 'outline'} onClick={() => gridListHandler('grid')}>
                              <Grid className="h-4 w-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{frontend.grid_view}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={0}>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button size="icon" variant={viewType === 'list' ? 'default' : 'outline'} onClick={() => gridListHandler('list')}>
                              <List className="h-4 w-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{frontend.list_view}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               </div>
            </div>

            {children}
         </div>
      </LandingLayout>
   );
};

export default Layout;
