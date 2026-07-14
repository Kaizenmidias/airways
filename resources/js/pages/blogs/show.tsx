import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { isAirwaysFeatureEnabled } from '@/lib/airways';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, Clock3, Sparkles, User } from 'lucide-react';
import BlogComments from './partials/blog-comments';
import BlogLikeDislike from './partials/blog-like-dislike';

export interface BlogShowProps extends SharedData {
   blog: Blog;
   likesCount: number;
   dislikesCount: number;
   commentsCount: number;
   userReaction?: 'like' | 'dislike' | null;
}

const ShowBlog = ({ blog }: BlogShowProps) => {
   const { url, props } = usePage<BlogShowProps>();
   const { translate, airways } = props;
   const { frontend } = translate;
   const showBlogSocial = isAirwaysFeatureEnabled(airways, 'blog_social');

   const createdAt = new Date(blog.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
   });

   const authorInitials = blog.user?.name
      ? blog.user.name
           .split(' ')
           .map((name) => name.charAt(0))
           .join('')
           .toUpperCase()
      : frontend.author_initials_fallback;

   const bannerSrc = blog.banner || '/assets/images/blank-image.jpg';
   const keywords = (blog.keywords || '')
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

   const siteName = (typeof window !== 'undefined' && (window as any)?.App?.name) || frontend.default_site_name;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');
   const pageTitle = `${blog.title} | ${siteName}`;
   const plainText = blog.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
   const pageDescription = plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
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
            {bannerSrc && <meta property="og:image" content={bannerSrc} />}
            {bannerSrc && <meta property="og:image:width" content="1200" />}
            {bannerSrc && <meta property="og:image:height" content="630" />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={blog.title} />
            {pageDescription && <meta name="twitter:description" content={pageDescription} />}
            {bannerSrc && <meta name="twitter:image" content={bannerSrc} />}

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

         <div className="bg-slate-50">
            <section className="relative isolate overflow-hidden bg-slate-950 text-white">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.22),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_26%),linear-gradient(180deg,#02070f_0%,#08111f_100%)]" />
               <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_20%)]" />

               <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8 lg:pt-36 lg:pb-20">
                  <div className="max-w-4xl space-y-6">
                     <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/15">{blog.category?.name || 'Blog'}</Badge>
                        {keywords.slice(0, 2).map((keyword) => (
                           <Badge key={keyword} variant="outline" className="border-white/15 bg-white/5 text-white">
                              #{keyword}
                           </Badge>
                        ))}
                     </div>

                     <div className="space-y-4">
                        <p className="text-sm font-semibold tracking-[0.3em] text-white/70 uppercase">Leitura</p>
                        <h1 className="max-w-5xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.3rem] lg:leading-[0.95]">
                           {blog.title}
                        </h1>
                        {pageDescription && <p className="max-w-3xl text-base leading-7 text-white/78 sm:text-lg">{pageDescription}</p>}
                     </div>

                     <div className="flex flex-wrap items-center gap-4 text-sm text-white/78">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-10 w-10 border border-white/15">
                              <AvatarImage src={blog.user?.photo || undefined} alt={blog.user?.name || frontend.author_alt} />
                              <AvatarFallback>{authorInitials}</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-semibold text-white">{blog.user?.name}</p>
                              <p className="text-white/65">Autor da publicação</p>
                           </div>
                        </div>

                        <div className="h-10 w-px bg-white/10" />

                        <div className="flex items-center gap-2">
                           <CalendarDays className="h-4 w-4" />
                           <span>{createdAt}</span>
                        </div>

                        <div className="flex items-center gap-2">
                           <Clock3 className="h-4 w-4" />
                           <span>{readingTime}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
               <article className="space-y-8">
                  <Card className="overflow-hidden border-slate-200/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                     <div className="relative">
                        <img src={bannerSrc} alt={frontend.blog_banner_alt} className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[420px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                     </div>

                     <CardContent className="space-y-6 p-5 sm:p-8 lg:p-10">
                        <div className="flex flex-wrap items-center gap-2">
                           {keywords.slice(0, 4).map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="rounded-full px-3 py-1.5">
                                 #{keyword}
                              </Badge>
                           ))}
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:tracking-[-0.04em] prose-p:leading-8 prose-img:rounded-2xl prose-img:border">
                           <TiptapRenderer>{blog.description}</TiptapRenderer>
                        </div>

                        <Separator />

                        {showBlogSocial && (
                           <div className="space-y-6">
                              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                                 <BlogLikeDislike />
                              </div>

                              <Separator />

                              <div className="rounded-3xl border border-slate-200 bg-white p-1 sm:p-2">
                                 <BlogComments />
                              </div>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </article>
            </div>
         </div>
      </LandingLayout>
   );
};

export default ShowBlog;
