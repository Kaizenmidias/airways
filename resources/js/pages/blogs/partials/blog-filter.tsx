import SearchInput from '@/components/search-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getQueryParams } from '@/lib/route';
import { Link, router, usePage } from '@inertiajs/react';
import { BlogsIndexProps } from '..';

interface BlogFilterProps {
   setOpen?: (open: boolean) => void;
}

const BlogFilter = ({ setOpen }: BlogFilterProps) => {
   const page = usePage<BlogsIndexProps>();
   const urlParams = getQueryParams(page.url);
   const { category, categories, translate } = page.props;
   const { common } = translate;

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

   return (
      <div className="space-y-6 p-4">
         <div className="space-y-3">
            <p className="text-[11px] tracking-[0.28em] text-slate-500 uppercase">Filtro</p>
            <SearchInput
               placeholder="Pesquisar"
               className="max-w-none"
               onChangeValue={(value) => router.get(route('blogs.guest', { category: 'all', search: value }))}
            />
         </div>

         <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.04em] text-slate-900 uppercase">{common.categories}</h3>
            <RadioGroup value={category?.slug || 'all'} className="space-y-3">
               <Link
                  className="flex items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-950"
                  href={getQueryRoute({}, 'all')}
               >
                  <RadioGroupItem className="cursor-pointer border-slate-400 text-[#1d3f7b]" id="category" value="all" />
                  <label htmlFor="category" className="cursor-pointer">
                     Todos os artigos
                  </label>
               </Link>

               {categories.map((category, ind) => {
                  const key = `category${ind}`;
                  if (category.slug === 'default') return null;

                  return (
                     <div key={key} className="capitalize">
                        <Link
                           className="flex items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-950"
                           href={getQueryRoute({}, category.slug)}
                           onFinish={() => !urlParams.search && setOpen && setOpen(false)}
                        >
                           <RadioGroupItem className="cursor-pointer border-slate-400 text-[#1d3f7b]" id={key} value={category.slug} />
                           <label htmlFor={key} className="cursor-pointer">
                              {category.name}
                           </label>
                        </Link>
                     </div>
                  );
               })}
            </RadioGroup>
         </div>
      </div>
   );
};

export default BlogFilter;
