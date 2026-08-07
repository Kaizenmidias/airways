import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn, getReadingTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
interface Props {
   blog: Blog;
   viewType?: 'grid' | 'list';
   className?: string;
}

const stripHtml = (value: string) =>
   value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

const excerptText = (value: string, maxLength = 180) => {
   const plain = stripHtml(value);

   if (plain.length <= maxLength) {
      return plain;
   }

   return `${plain.slice(0, maxLength).trimEnd()}...`;
};

const BlogCard1 = ({ blog, viewType = 'grid', className }: Props) => {
   const categoryLabel = blog.category?.name || 'Notícias';
   const publishedAt = new Date(blog.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
   });
   const readingTime = getReadingTime(blog.description);
   const blogExcerpt = excerptText(blog.description, viewType === 'list' ? 240 : 190);

   return (
      <Card
         className={cn(
            'group overflow-hidden border-slate-200/80 bg-white/95 p-0 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]',
            viewType === 'list' && 'sm:flex sm:w-full sm:flex-row sm:items-stretch',
            className,
         )}
      >
         <CardHeader className="p-0">
            <div className={cn('p-3 pb-0 sm:p-4', viewType === 'list' && 'pb-0 sm:w-[280px] sm:flex-none sm:p-3')}>
               <Link
                  href={route('blogs.read', {
                     slug: blog.slug,
                     id: blog.id,
                  })}
               >
                  <div
                     className={cn(
                        'relative aspect-[16/10] overflow-hidden rounded-[18px] bg-slate-100',
                        viewType === 'list' && 'sm:h-full sm:min-h-[220px] sm:rounded-[22px]',
                     )}
                  >
                     <img
                        src={blog.thumbnail || '/assets/images/blank-image.jpg'}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = '/assets/images/blank-image.jpg';
                        }}
                     />
                  </div>
               </Link>
            </div>
         </CardHeader>

         <div className={cn('flex min-w-0 flex-1 flex-col', viewType === 'list' && 'w-full')}>
            <CardContent className={cn('flex flex-1 flex-col gap-4 p-4 sm:p-5', viewType === 'list' && 'justify-between sm:p-6')}>
               <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex w-fit items-center rounded-full bg-[#1d3f7b] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white uppercase">
                     {categoryLabel}
                  </span>
                  <span className="text-[11px] tracking-[0.22em] text-slate-400 uppercase">{readingTime}</span>
               </div>

               <Link
                  className={cn('block space-y-3', viewType === 'list' && 'sm:flex sm:h-full sm:flex-col sm:justify-between')}
                  href={route('blogs.read', {
                     slug: blog.slug,
                     id: blog.id,
                  })}
               >
                  <h3 className="flex items-start gap-2 text-[1.15rem] leading-tight font-normal tracking-[-0.04em] text-slate-950 transition-colors group-hover:text-[#1d3f7b] sm:text-[1.3rem]">
                     <span className="min-w-0 flex-1">{blog.title}</span>
                     <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1d3f7b]" />
                  </h3>

                  <p className="line-clamp-4 text-sm leading-7 text-slate-600 sm:text-[15px]">{blogExcerpt}</p>
               </Link>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-200/70 px-4 py-4 sm:px-5">
               <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-1 ring-slate-200">
                     <AvatarImage src={blog.user.photo || ''} alt={blog.user.name} className="object-cover" />
                     <AvatarFallback>{blog.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                     <p className="truncate text-sm font-semibold text-slate-900">{blog.user.name}</p>
                     <p className="text-xs text-slate-500">Autor</p>
                  </div>
               </div>

               <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{publishedAt}</p>
                  <p className="text-xs text-slate-500">{formatDistanceToNowStrict(new Date(blog.created_at), { addSuffix: true, locale: ptBR })}</p>
               </div>
            </CardFooter>
         </div>
      </Card>
   );
};

export default BlogCard1;
