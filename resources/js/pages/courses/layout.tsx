import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandingLayout from '@/layouts/landing-layout';
import { getPageSection } from '@/lib/page';
import { getQueryParams } from '@/lib/route';
import Section from '@/pages/intro/partials/section';
import { router, usePage } from '@inertiajs/react';
import { Grid, List, Search } from 'lucide-react';
import { FormEvent, ReactNode, useState } from 'react';
import { CoursesIndexProps } from './index';

const Layout = ({ children }: { children: ReactNode }) => {
   const { url, props } = usePage<CoursesIndexProps>();
   const { category, categoryChild, categories, courses, page, customize, catalogPage } = props;
   const urlParams = getQueryParams(url);
   const viewType = urlParams['view'] ?? 'grid';
   const selectedCategory = categoryChild ? `${category?.slug || 'all'}::${categoryChild.slug}` : category?.slug || 'all';
   const [search, setSearch] = useState(urlParams['search'] || '');
   const [courseCategory, setCourseCategory] = useState(selectedCategory);
   const [minPrice, setMinPrice] = useState((urlParams['min_price'] || '').replace(/\D/g, ''));
   const [maxPrice, setMaxPrice] = useState((urlParams['max_price'] || '').replace(/\D/g, ''));
   const catalogPageData = catalogPage || page;
   const heroSection = getPageSection(catalogPageData, 'hero');

   const heroTitle = category?.title || categoryChild?.title || heroSection?.title || 'Encontre sua próxima formação';
   const heroDescription = heroSection?.description || 'Cursos online para quem quer evoluir na aviação com uma trilha objetiva, suporte especializado e conteúdo aplicado.';

   const formatCurrencyInput = (value: string) => {
      if (!value) {
         return '';
      }

      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
         maximumFractionDigits: 0,
      }).format(Number(value));
   };

   const normalizeCurrencyInput = (value: string) => value.replace(/\D/g, '');

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
      if (minPrice) query.min_price = minPrice;
      if (maxPrice) query.max_price = maxPrice;
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
      <LandingLayout customizable navbarHeight={false}>
         <section className="bg-slate-950 pt-32 pb-14 text-white lg:pt-40 lg:pb-20">
            <Section
               customize={Boolean(customize)}
               pageSection={heroSection}
               containerClass="!max-w-none"
               contentClass="relative"
               editorButtonClassName="top-4 right-4 bg-emerald-600 text-white hover:bg-emerald-700"
            >
               <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                  <p className="text-sm font-semibold tracking-[0.28em] text-[#FD122E] uppercase">Catálogo Airways</p>
                  <h1 className="mx-auto mt-4 max-w-5xl text-4xl leading-[0.95] font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-[3.7rem] xl:whitespace-nowrap xl:text-[4rem]">
                     {heroTitle}
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{heroDescription}</p>
               </div>

               {!category && !categoryChild ? (
                  <form
                     onSubmit={searchHandler}
                     className="mx-auto mt-10 max-w-6xl rounded-[28px] border border-white/15 bg-white/[0.06] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-md lg:p-7"
                  >
                  <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr_1.25fr_0.85fr_auto] lg:items-end">
                     <label className="flex flex-col gap-2">
                        <span className="text-xs font-bold tracking-[0.24em] text-slate-400 uppercase">Buscar curso</span>
                        <Input
                           value={search}
                           onChange={(event) => setSearch(event.target.value)}
                           placeholder="Ex: piloto privado, comissário, ANAC"
                           className="h-12 rounded-2xl border-white/10 bg-white text-slate-950 placeholder:text-slate-500"
                        />
                     </label>

                     <label className="flex flex-col gap-2">
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

                     <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold tracking-[0.24em] text-slate-400 uppercase">Preço</span>
                        <div className="grid grid-cols-2 gap-2">
                           <Input
                              value={formatCurrencyInput(minPrice)}
                              onChange={(event) => setMinPrice(normalizeCurrencyInput(event.target.value))}
                              inputMode="numeric"
                              placeholder="De R$ 0"
                              className="h-12 rounded-2xl border-white/10 bg-white text-slate-950 placeholder:text-slate-500"
                           />
                           <Input
                              value={formatCurrencyInput(maxPrice)}
                              onChange={(event) => setMaxPrice(normalizeCurrencyInput(event.target.value))}
                              inputMode="numeric"
                              placeholder="Até R$ 0"
                              className="h-12 rounded-2xl border-white/10 bg-white text-slate-950 placeholder:text-slate-500"
                           />
                        </div>
                     </div>

                     <div className="flex lg:h-full lg:items-end">
                        <Button type="submit" className="h-12 w-full rounded-2xl bg-[#FD122E] px-7 font-semibold text-white shadow-none hover:bg-[#d90f26] lg:w-auto">
                           <Search className="h-5 w-5" />
                           Pesquisar
                        </Button>
                     </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                     <p className="text-sm text-slate-300">{courses?.total || 0} cursos encontrados para sua busca.</p>
                  </div>
                  </form>
               ) : null}
            </Section>
         </section>

         <div className="container py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold capitalize">
                     {category || categoryChild ? category?.title || categoryChild?.title : 'Todos os'} cursos
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
                           <p>Visualização em grade</p>
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
                           <p>Visualização em lista</p>
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
