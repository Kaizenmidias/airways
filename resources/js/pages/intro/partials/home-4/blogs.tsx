import { Button } from '@/components/ui/button';
import { getPageSection } from '@/lib/page';
import { getReadingTime } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Clock3, Newspaper } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const Blogs = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, blogs } = props;
   const blogsSection = getPageSection(page, 'blogs');
   const featuredBlog = blogs[0];
   const secondaryBlogs = blogs.slice(1, 4);

   return (
      <Section customize={customize} pageSection={blogsSection} containerClass="py-12 lg:py-16">
         <div className="grid gap-10">
            <EditorialHeading
               eyebrow={blogsSection?.title || 'Conteúdo e atualizações'}
               title={blogsSection?.sub_title || 'O blog passa a funcionar como uma área editorial da escola, com tom institucional e menos cara de catálogo.'}
               description={
                  blogsSection?.description ||
                  'Mantemos a origem dinâmica das postagens, mas reestruturamos a apresentação para parecer uma publicação corporativa de aviação.'
               }
            />

            {blogs.length > 0 ? (
               <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                  {featuredBlog && (
                     <SectionCard className="overflow-hidden">
                        <Link href={route('blogs.read', { slug: featuredBlog.slug, id: featuredBlog.id })} className="block h-full">
                           <div className="grid h-full lg:grid-cols-2">
                              <div className="relative min-h-[280px]">
                                 <img
                                    src={featuredBlog.thumbnail || '/assets/images/blank-image.jpg'}
                                    alt={featuredBlog.title}
                                    className="h-full w-full object-cover object-center"
                                    onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.src = '/assets/images/blank-image.jpg';
                                    }}
                                 />
                                 <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.5))]" />
                                 <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur">
                                    Destaque
                                 </div>
                              </div>

                              <div className="flex flex-col justify-between p-6 sm:p-8">
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                                       <Newspaper className="h-4 w-4 text-primary" />
                                       Blog Airways
                                    </div>
                                    <h3 className="text-2xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{featuredBlog.title}</h3>
                                    <p className="line-clamp-4 text-sm leading-7 text-slate-600">{featuredBlog.description}</p>
                                 </div>

                                 <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-1.5">
                                       <Clock3 className="h-4 w-4" />
                                       {getReadingTime(featuredBlog.description)}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                       <CalendarDays className="h-4 w-4" />
                                       {formatDistanceToNowStrict(new Date(featuredBlog.created_at), { addSuffix: true })}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </Link>
                     </SectionCard>
                  )}

                  <div className="grid gap-6">
                     {secondaryBlogs.map((blog) => (
                        <SectionCard key={blog.id} className="overflow-hidden">
                           <Link href={route('blogs.read', { slug: blog.slug, id: blog.id })} className="grid h-full gap-0 sm:grid-cols-[0.42fr_0.58fr]">
                              <div className="relative min-h-[180px]">
                                 <img
                                    src={blog.thumbnail || '/assets/images/blank-image.jpg'}
                                    alt={blog.title}
                                    className="h-full w-full object-cover object-center"
                                    onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.src = '/assets/images/blank-image.jpg';
                                    }}
                                 />
                              </div>

                              <div className="flex flex-col justify-between p-5">
                                 <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Publicação</p>
                                    <h4 className="text-lg leading-tight font-semibold tracking-[-0.03em] text-slate-950">{blog.title}</h4>
                                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">{blog.description}</p>
                                 </div>

                                 <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                                    <span>{getReadingTime(blog.description)}</span>
                                    <span className="inline-flex items-center gap-1">
                                       Ler matéria
                                       <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                 </div>
                              </div>
                           </Link>
                        </SectionCard>
                     ))}
                  </div>
               </div>
            ) : (
               <SectionCard className="p-8 text-center text-sm text-slate-600">Não há posts de blog disponíveis no momento.</SectionCard>
            )}

            <div className="flex justify-center">
               <Button asChild className="h-12 rounded-full bg-slate-950 px-6 text-white shadow-none hover:bg-primary">
                  <Link href={route('blogs.index')}>Ver blog completo</Link>
               </Button>
            </div>
         </div>
      </Section>
   );
};

export default Blogs;
