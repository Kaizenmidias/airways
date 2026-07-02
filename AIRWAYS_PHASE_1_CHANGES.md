# AIRWAYS Phase 1 Changes

## Objetivo

Implementar apenas a camada visual e reversível de "school mode" para a Airways Academy, ocultando áreas irrelevantes do modelo de negócio sem remover rotas, migrations, tabelas ou lógica de backend.

## Flags criadas

Arquivo central: `config/airways.php`

Flags expostas via `.env`:

- `AIRWAYS_MODE`
- `AIRWAYS_FEATURE_MARKETPLACE`
- `AIRWAYS_FEATURE_INSTRUCTORS`
- `AIRWAYS_FEATURE_JOBS`
- `AIRWAYS_FEATURE_PAYOUTS`
- `AIRWAYS_FEATURE_FORUM`
- `AIRWAYS_FEATURE_BLOG`
- `AIRWAYS_FEATURE_BLOG_SOCIAL`
- `AIRWAYS_FEATURE_NEWSLETTER`

Padrão adotado para escola própria:

- marketplace: `false`
- instructors: `false`
- jobs: `false`
- payouts: `false`
- forum: `false`
- blog: `true`
- blog_social: `false`
- newsletter: `false`

## Arquivos alterados

- `.env.example`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `config/airways.php`
- `resources/js/lib/airways.ts`
- `resources/js/types/global.d.ts`
- `resources/js/layouts/dashboard/partials/nav-main.tsx`
- `resources/js/layouts/dashboard/partials/routes.tsx`
- `resources/js/layouts/partials/intro-navbar.tsx`
- `resources/js/layouts/partials/landing-navbar.tsx`
- `resources/js/pages/blogs/partials/blog-comments.tsx`
- `resources/js/pages/blogs/partials/blog-like-dislike.tsx`
- `resources/js/pages/blogs/show.tsx`
- `resources/js/pages/course-player/partials/content-summery.tsx`
- `resources/js/pages/course-player/partials/forum.tsx`
- `resources/js/pages/courses/show.tsx`
- `resources/js/pages/dashboard/courses/create.tsx`
- `resources/js/pages/dashboard/courses/partials/basic.tsx`
- `resources/js/pages/dashboard/exams/create.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/basic.tsx`
- `resources/js/pages/dashboard/index.tsx`
- `resources/js/pages/dashboard/settings/pages/index.tsx`
- `resources/js/pages/dashboard/settings/pages/partials/home-pages-table-columns.tsx`
- `resources/js/pages/dashboard/settings/system/partials/website.tsx`
- `resources/js/pages/inner/index.tsx`
- `resources/js/pages/inner/sections/career.tsx`
- `resources/js/pages/inner/sections/index.tsx`
- `resources/js/pages/intro/home-1.tsx`
- `resources/js/pages/intro/home-2.tsx`
- `resources/js/pages/intro/home-3.tsx`
- `resources/js/pages/intro/home-4.tsx`
- `resources/js/pages/intro/home-5.tsx`
- `resources/js/pages/intro/partials/home-5/faqs.tsx`
- `resources/js/pages/student/partials/tab-lists.tsx`

## Menus ocultados

### Sidebar admin

- Instructors
- Payout Report
- Payouts
- Job Circulars
- Newsletters

### Navegação pública e do aluno

- Become Instructor
- Instructor Application
- Links públicos de instrutor
- Top Instructors, quando a flag `instructors` está desativada
- Seções de marketplace dependentes de `marketplace=false`
- Careers / Job Circulars quando a flag `jobs` está desativada
- Fórum, quando a flag `forum=false`

## Componentes ajustados

- Sidebar/dash routes com filtragem por feature flags antes de chamar `route()`
- Header/navbar pública com remoção de atalhos de instrutor quando marketplace está off
- Home/dashboard com remoção de métricas de instrutor, saques pendentes e blocos de marketplace
- Settings > Pages com modo administrativo como padrão visual
- Settings > System para esconder campos ligados a receita de instrutor
- Criação/edição de cursos e provas para esconder seletor de instrutor quando não existe modo colaborativo
- Página pública de curso para ocultar a aba de instrutor quando o marketplace está desativado
- Course player para ocultar fórum
- Blog para ocultar curtidas/comentários quando `blog_social=false`
- Seções de landing pages para esconder blocos de instrutor/blog quando a flag correspondente estiver desligada

## Riscos encontrados

- `php artisan optimize:clear` não pôde ser executado localmente porque `vendor/autoload.php` não existe neste workspace. O comando deve ser rodado no servidor após `composer install`.
- As mudanças são visuais e reversíveis, mas dependem da presença correta de `airways` na prop compartilhada do Inertia. Isso já foi implementado no middleware.
- Alguns componentes continuam acessando rotas existentes em outras áreas do sistema. Elas não foram bloqueadas nesta fase, apenas deixadas fora da navegação quando a flag está desativada.

## Itens que ficam para a Fase 2

- Bloqueio funcional de endpoints irrelevantes
- Remoção ou desativação de rotas de multi-instructor e marketplace
- Ajustes de policies, middleware e permissões
- Limpeza de código morto em controllers, services e jobs
- Revisão de tabelas e migrations que só fazem sentido em marketplace
- Revisão de telas administrativas remanescentes que ainda mostrem contadores ou atalhos de instrutor

## Validações

- `npm run build`: aprovado
- `php artisan optimize:clear`: não executado localmente por ausência de `vendor/autoload.php`

