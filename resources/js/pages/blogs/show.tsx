import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LandingLayout from '@/layouts/landing-layout';
import { isAirwaysFeatureEnabled } from '@/lib/airways';
import { SharedData } from '@/types/global';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, ChevronRight, Clock3 } from 'lucide-react';
import BlogComments from './partials/blog-comments';
import BlogLikeDislike from './partials/blog-like-dislike';

export interface BlogShowProps extends SharedData {
   blog: Blog;
   latestBlogs: Blog[];
   likesCount: number;
   dislikesCount: number;
   commentsCount: number;
   userReaction?: 'like' | 'dislike' | null;
}

const stripHtml = (value?: string | null) =>
   (value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

const limitText = (value: string, length = 160) => {
   if (value.length <= length) {
      return value;
   }

   return `${value.slice(0, length).trimEnd()}...`;
};

const formatDate = (value: string) =>
   new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
   });

const ShowBlog = ({ blog }: BlogShowProps) => {
   const { url, props } = usePage<BlogShowProps>();
   const { translate, airways, latestBlogs = [] } = props;
   const { frontend } = translate;
   const showBlogSocial = isAirwaysFeatureEnabled(airways, 'blog_social');

   const createdAt = formatDate(blog.created_at);
   const authorInitials = blog.user?.name
      ? blog.user.name
           .split(' ')
           .map((name) => name.charAt(0))
           .join('')
           .toUpperCase()
      : frontend.author_initials_fallback;

   const bannerSrc = blog.banner || blog.thumbnail || '/assets/images/blank-image.jpg';
   const shortDescription = blog.summary || limitText(stripHtml(blog.description), 220);
   const keywords = (blog.keywords || '')
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

   const siteName = (typeof window !== 'undefined' && (window as any)?.App?.name) || frontend.default_site_name;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');
   const pageTitle = `${blog.title} | ${siteName}`;
   const pageDescription = limitText(shortDescription, 160);
   const readingTime = blog.reading_time || '';

   return (
      <LandingLayout customizable={false} navbarHeight={false}>
         <Head>
            <title>{pageTitle}</title>
            {pageDescription && <meta name="description" content={pageDescription} />}
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={blog.title} />
            {pageDescription && <meta property="og:description" content={pageDescription} />}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:image" content={bannerSrc} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={blog.title} />
            {pageDescription && <meta name="twitter:description" content={pageDescription} />}
            <meta name="twitter:image" content={bannerSrc} />

            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: blog.title,
                  description: pageDescription,
                  image: bannerSrc,
                  url: siteUrl,
                  mainEntityOfPage: siteUrl,
                  datePublished: blog.created_at,
                  dateModified: blog.updated_at,
                  author: blog.user?.name
                     ? {
                          '@type': 'Person',
                          name: blog.user.name,
                       }
                     : undefined,
                  publisher: {
                     '@type': 'Organization',
                     name: siteName,
                     url: siteOrigin,
                  },
                  keywords: keywords.join(', '),
               })}
            </script>
         </Head>

         <main className="bg-white text-slate-950">
            <section className="relative isolate min-h-[520px] overflow-hidden bg-slate-950 text-white sm:min-h-[600px]">
               <img src={bannerSrc} alt={blog.title} className="absolute inset-0 h-full w-full object-cover" />
               <div className="absolute inset-0 bg-slate-950/70" />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/62 to-slate-950/35" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

               <div className="relative mx-auto flex min-h-[520px] max-w-[1500px] items-end px-5 pt-28 pb-16 sm:min-h-[600px] sm:px-10 sm:pt-32 sm:pb-20 lg:px-14">
                  <div className="max-w-4xl space-y-6">
                     <div className="flex flex-wrap items-center gap-2 text-xs text-white/78">
                        <Badge className="rounded-full border-white/20 bg-white/12 px-3 py-1.5 text-white hover:bg-white/16">
                           {blog.category?.name || 'Notícias'}
                        </Badge>
                        {keywords.slice(0, 2).map((keyword) => (
                           <Badge key={keyword} variant="outline" className="rounded-full border-white/20 bg-white/5 px-3 py-1.5 text-white">
                              {keyword}
                           </Badge>
                        ))}
                     </div>

                     <div className="space-y-4">
                        <h1 className="text-4xl leading-[0.98] font-normal tracking-[-0.055em] text-white sm:text-5xl lg:text-[4.7rem]">
                           {blog.title}
                        </h1>
                        {shortDescription && <p className="max-w-3xl text-base leading-8 text-white/82 sm:text-lg">{shortDescription}</p>}
                     </div>

                     <div className="flex flex-wrap items-center gap-5 text-sm text-white/76">
                        <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10 border border-white/20">
                              <AvatarImage src={blog.user?.photo || undefined} alt={blog.user?.name || frontend.author_alt} />
                              <AvatarFallback>{authorInitials}</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-medium text-white">{blog.user?.name}</p>
                              <p className="text-white/58">Autor</p>
                           </div>
                        </div>

                        <div className="hidden h-10 w-px bg-white/14 sm:block" />

                        <div className="flex items-center gap-2">
                           <CalendarDays className="h-4 w-4" />
                           <span>{createdAt}</span>
                        </div>

                        {readingTime ? (
                           <div className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4" />
                              <span>{readingTime}</span>
                           </div>
                        ) : null}
                     </div>
                  </div>
               </div>
            </section>

            <article className="mx-auto max-w-[780px] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
               <div className="prose prose-slate prose-headings:mt-12 prose-headings:font-semibold prose-headings:tracking-[-0.035em] prose-headings:text-[#123568] prose-p:text-[15px] prose-p:leading-8 prose-p:text-slate-700 prose-a:text-[#123568] prose-a:no-underline hover:prose-a:underline prose-img:w-full prose-img:rounded-none prose-img:border prose-img:border-slate-200 prose-img:shadow-none max-w-none">
                  <TiptapRenderer>{blog.description}</TiptapRenderer>
               </div>

               {keywords.length > 0 ? (
                  <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6">
                     <span className="mr-1 text-xs tracking-[0.22em] text-slate-500 uppercase">Tags</span>
                     {keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">
                           {keyword}
                        </Badge>
                     ))}
                  </div>
               ) : null}

               {showBlogSocial ? (
                  <div className="mt-12 space-y-8 border-t border-slate-200 pt-8">
                     <BlogLikeDislike />
                     <Separator />
                     <BlogComments />
                  </div>
               ) : null}
            </article>

            {latestBlogs.length > 0 ? (
               <section className="border-t border-slate-200 bg-[#f4f7fb] px-5 py-14 sm:px-10 lg:px-14 lg:py-18">
                  <div className="mx-auto max-w-[1500px]">
                     <div className="mb-7">
                        <p className="text-[11px] tracking-[0.3em] text-slate-500 uppercase">Últimas</p>
                        <h2 className="mt-2 text-3xl font-normal tracking-[-0.04em] text-[#123568] sm:text-4xl">Últimas notícias</h2>
                     </div>

                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {latestBlogs.map((item, index) => {
                           const image = item.banner || item.thumbnail || '/assets/images/blank-image.jpg';
                           const itemDescription = item.summary || limitText(stripHtml(item.description), 120);

                           return (
                              <Link
                                 key={item.id}
                                 href={route('blogs.read', { slug: item.slug, id: item.id })}
                                 className={index === 0 ? 'group md:col-span-2 lg:col-span-2' : 'group'}
                              >
                                 <article className="relative flex min-h-[260px] overflow-hidden bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-transform duration-300 group-hover:-translate-y-1">
                                    <img
                                       src={image}
                                       alt={item.title}
                                       className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/42 to-slate-950/14" />
                                    <div className="relative mt-auto w-full p-5">
                                       <Badge className="mb-3 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#123568] hover:bg-white">
                                          {item.category?.name || 'Notícias'}
                                       </Badge>
                                       <h3 className="flex items-start gap-2 text-lg leading-tight font-normal tracking-[-0.035em]">
                                          <span className="min-w-0 flex-1">{item.title}</span>
                                          <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 opacity-75 transition-transform group-hover:translate-x-1" />
                                       </h3>
                                       {index === 0 ? <p className="mt-3 max-w-xl text-sm leading-6 text-white/76">{itemDescription}</p> : null}
                                       <p className="mt-4 text-xs text-white/65">
                                          {formatDate(item.created_at)}
                                          {item.reading_time ? ` — ${item.reading_time}` : ''}
                                       </p>
                                    </div>
                                 </article>
                              </Link>
                           );
                        })}
                     </div>

                     <div className="mt-8">
                        <Button asChild variant="outline" className="rounded-full border-[#123568]/20 bg-white text-[#123568] hover:bg-white">
                           <Link href={route('blogs.guest', { category: 'all' })}>
                              Ver todas as notícias
                              <ChevronRight className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                     </div>
                  </div>
               </section>
            ) : null}
         </main>
      </LandingLayout>
   );
};

export default ShowBlog;
