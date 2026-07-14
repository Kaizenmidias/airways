import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { isAirwaysFeatureEnabled } from '@/lib/airways';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, Clock3, Share2, Sparkles, User } from 'lucide-react';
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
           .map((n) => n.charAt(0))
           .join('')
           .toUpperCase()
      : frontend.author_initials_fallback;

   const bannerSrc = blog.banner || '/assets/images/blank-image.jpg';
   const thumbnailSrc = blog.thumbnail || '/assets/images/blank-image.jpg';
   const keywords = (blog.keywords || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

   const siteName = (typeof window !== 'undefined' && (window as any)?.App?.name) || frontend.default_site_name;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');
   const pageTitle = `${blog.title} | ${siteName}`;
   const plainText =
      blog.description
         ?.replace(/<[^>]*>/g, ' ')
         .replace(/\s+/g, ' ')
         .trim() || '';
   const pageDescription = plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
   const ogImage = bannerSrc || thumbnailSrc;
   const readingTime = blog.reading_time || '';

   return (
      <LandingLayout customizable={false}>
         <Head>
            <title>{pageTitle}</title>
            {pageDescription && <meta name="description" content={pageDescription} />}
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={blog.title} />
            {pageDescription && <meta property="og:description" content={pageDescription} />}
            <meta property="og:site_name" content={siteName} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogImage && <meta property="og:image:width" content="1200" />}
            {ogImage && <meta property="og:image:height" content="630" />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={blog.title} />
            {pageDescription && <meta name="twitter:description" content={pageDescription} />}
            {ogImage && <meta name="twitter:image" content={ogImage} />}

            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: blog.title,
                  description: pageDescription,
                  image: ogImage,
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

         <div className="relative overflow-hidden bg-slate-50">
            <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(253,18,46,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_26%),linear-gradient(180deg,#07101f_0%,#0f172a_52%,#f8fafc_52%,#f8fafc_100%)]" />

            <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
               <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_320px] lg:items-end">
                  <div className="space-y-5 text-white">
                     <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/15">{blog.category?.name || 'Blog'}</Badge>
                        {keywords.slice(0, 2).map((k) => (
                           <Badge key={k} variant="outline" className="border-white/15 bg-white/5 text-white">
                              #{k}
                           </Badge>
                        ))}
                     </div>

                     <div className="space-y-4">
                        <p className="text-sm font-semibold tracking-[0.3em] text-white/70 uppercase">Leitura</p>
                        <h1 className="max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.3rem] lg:leading-[0.95]">
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

                  <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
                     <CardContent className="space-y-4 p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.24em] text-white/70 uppercase">
                           <Sparkles className="h-4 w-4" />
                           Destaques
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">Categoria</p>
                              <p className="mt-2 text-lg font-semibold">{blog.category?.name || 'Sem categoria'}</p>
                           </div>
                           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">Publicado</p>
                              <p className="mt-2 text-lg font-semibold">{createdAt}</p>
                           </div>
                           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">Leitura</p>
                              <p className="mt-2 text-lg font-semibold">{readingTime}</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                  <article className="space-y-8">
                     <Card className="overflow-hidden border-slate-200/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                        <div className="relative">
                           <img
                              src={bannerSrc}
                              alt={frontend.blog_banner_alt}
                              className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[420px]"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                        </div>

                        <CardContent className="space-y-6 p-5 sm:p-8">
                           <div className="flex flex-wrap items-center gap-2">
                              {keywords.slice(0, 4).map((k) => (
                                 <Badge key={k} variant="secondary" className="rounded-full px-3 py-1.5">
                                    #{k}
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

                  <aside className="space-y-6 lg:sticky lg:top-24">
                     <Card className="border-slate-200/80 shadow-sm">
                        <CardContent className="space-y-5 p-5">
                           <div className="flex items-center gap-3">
                              <Avatar className="h-14 w-14">
                                 <AvatarImage src={blog.user?.photo || undefined} alt={blog.user?.name || frontend.author_alt} />
                                 <AvatarFallback>{authorInitials}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Autor</p>
                                 <p className="text-lg font-semibold text-slate-950">{blog.user?.name}</p>
                              </div>
                           </div>

                           <div className="grid gap-3">
                              <div className="rounded-2xl bg-slate-50 p-4">
                                 <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Publicado em</p>
                                 <p className="mt-2 text-sm font-medium text-slate-950">{createdAt}</p>
                              </div>
                              <div className="rounded-2xl bg-slate-50 p-4">
                                 <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Tempo de leitura</p>
                                 <p className="mt-2 text-sm font-medium text-slate-950">{readingTime}</p>
                              </div>
                              <div className="rounded-2xl bg-slate-50 p-4">
                                 <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Categoria</p>
                                 <p className="mt-2 text-sm font-medium text-slate-950">{blog.category?.name || 'Sem categoria'}</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="border-slate-200/80 shadow-sm">
                        <CardContent className="space-y-4 p-5">
                           <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
                              <Share2 className="h-4 w-4" />
                              Estrutura
                           </div>
                           <div className="space-y-3 text-sm text-slate-600">
                              <div className="flex items-start gap-3">
                                 <div className="mt-1 h-2 w-2 rounded-full bg-[#FD122E]" />
                                 <p>Hero editorial com leitura clara e sem cortar a imagem principal.</p>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="mt-1 h-2 w-2 rounded-full bg-[#0EA5E9]" />
                                 <p>Conteúdo principal com largura confortável para textos longos e mídia embutida.</p>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                                 <p>Comentários e reações continuam funcionando exatamente como antes.</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {keywords.length > 0 && (
                        <Card className="border-slate-200/80 shadow-sm">
                           <CardContent className="space-y-4 p-5">
                              <div className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Palavras-chave</div>
                              <div className="flex flex-wrap gap-2">
                                 {keywords.map((k) => (
                                    <Badge key={k} variant="outline" className="rounded-full px-3 py-1.5">
                                       #{k}
                                    </Badge>
                                 ))}
                              </div>
                           </CardContent>
                        </Card>
                     )}
                  </aside>
               </div>
            </div>
         </div>
      </LandingLayout>
   );
};

export default ShowBlog;
