# Auditoria do layout público — Airways Academy

## 1. Escopo e método

Auditoria estática do front público Laravel 12 + React/Inertia + Vite. Foram analisados rotas, controllers, páginas TSX, layouts, componentes, configuração Airways, seeders e estrutura do builder. Nenhum código funcional foi alterado.

Limitações do ambiente: não há `.env`, `vendor/` nem conexão de banco disponível neste checkout. Assim, não foi possível confirmar qual das cinco Homes está ativa nem os valores já editados no banco. O relatório distingue **estrutura disponível no repositório** de **conteúdo efetivamente ativo**, que deve ser validado em ambiente conectado antes da implementação.

A Airbus foi considerada somente como referência de linguagem corporativa: narrativa por propósito, mídia ampla, hierarquia editorial, blocos de missão e conteúdo institucional. Não se recomenda copiar identidade, textos, composição exata ou componentes.

## 2. Arquitetura pública atual

- Entrada Inertia: `resources/js/app.tsx`.
- Casca pública principal: `resources/js/layouts/landing-layout.tsx`, composta por `Main`, `Navbar` e `Footer`.
- Dados globais: `app/Http/Middleware/HandleInertiaRequests.php` compartilha `page`, `system`, `navbar`, `footer`, autenticação, traduções, idioma, carrinho e flags `airways`.
- Home ativa: resolvida por `AppServiceProvider` a partir de `settings.type = home_page`; renderiza `intro/{slug}`.
- Builder: seções persistidas em `pages`/`page_sections`, ordenáveis, ativáveis e editáveis com `?customize=true` por administrador.
- Páginas institucionais: rota curinga `/{slug}` registrada ao final em `bootstrap/app.php`, limitada aos slugs existentes como `inner_page`.
- Navbar e footer: carregados do banco pelos slugs fixos `navbar_1` e `footer_1`.
- Modo Airways: `config/airways.php` assume `school`, marketplace desligado; instrutores, vagas, payouts, fórum e newsletter desligados; blog ligado.

## 3. Inventário de páginas públicas antes do login

### Escopo institucional solicitado

| Página | URL/rota | Controller/Inertia | Arquivos React principais | Origem do conteúdo |
|---|---|---|---|---|
| Home | `/`, `home` | `HomeController@index` → `intro/{home-1..5}` | `pages/intro/home-1.tsx` a `home-5.tsx`, partials de cada variante | Builder + consultas de cursos/categorias/blog/instrutores |
| Sobre Nós | `/about-us`, `inner.page` | `HomeController@inner_page` → `inner/index` | `pages/inner/index.tsx`, `partials/hero.tsx`, `sections/*` | Builder (`page_sections`) |
| Cursos | `/courses/{category}/{category_child?}`, normalmente `/courses/all` | `CourseController@category_courses` → `courses/index` | `pages/courses/index.tsx`, `layout.tsx`, `partials/course-filter.tsx`, `components/cards/course-card-1.tsx` | Banco (curso/categoria) + UI/SEO hardcoded/traduções |
| Detalhe do curso | `/courses/details/{slug}/{id}` | `CourseController@show` → `courses/show` | `pages/courses/show.tsx`, `partials/course-*`, `overview`, `curriculum`, `details`, `instructor`, `course-reviews` | Banco (curso e relações) + composição TSX fixa |
| Blog | `/blogs/{category}` | `BlogController@guest_blogs` → `blogs/index` | `pages/blogs/index.tsx`, `partials/layout.tsx`, `blog-filter.tsx`, `components/cards/blog-card-1.tsx` | Banco + layout fixo |
| Post | `/read/blogs/{id}` | `BlogController@show` → `blogs/show` | `pages/blogs/show.tsx`, comentários e like/dislike | Banco + layout fixo; interações exigem login |
| Contato | `/contact-us` | `HomeController@inner_page` | `pages/inner/index.tsx`, `partials/hero.tsx`, renderer Tiptap | `pages.description`; seed em `InnerSections.php` |
| Cookies | `/cookie-policy` | idem | idem | `pages.description`; seed |
| Termos | `/terms-and-conditions` | idem | idem | `pages.description`; seed |
| Privacidade | `/privacy-policy` | idem | idem | `pages.description`; seed |
| Reembolso | `/refund-policy` | idem | idem | `pages.description`; seed |
| Login | `/login` | `AuthenticatedSessionController@create` → `auth/login` | `pages/auth/login.tsx`, `layouts/auth-layout.tsx` | Traduções + configurações de Google/reCAPTCHA |
| Cadastro | `/register` | `RegisteredUserController@create` → `auth/register` | `pages/auth/register.tsx`, `layouts/auth-layout.tsx` | Traduções + configurações de Google/reCAPTCHA |
| Carrinho / etapa pré-checkout | `/course-cart` | `CourseCartController@index` → `cart/index` | `pages/cart/index.tsx`, `partials/course-card.tsx`, `cart-summery.tsx` | Banco/cálculos backend + composição fixa |
| Checkout/gateway | `/payments/{from}/{item}/{id}` | módulo PaymentGateways → página de pagamento | `Modules/PaymentGateways` e página Inertia correspondente | Backend/gateways; exige autenticação e verificação |

### Outras superfícies públicas encontradas

Estas também fazem parte do front acessível antes do login e precisam entrar na regressão visual, ainda que possam ficar fora da navegação da escola:

| Superfície | Rota | Observação |
|---|---|---|
| Demonstrações das Homes | `/demo/{slug}` | Pré-visualiza qualquer Home; existe duplicidade declarativa em `routes/web.php` e `routes/admin.php` |
| Equipe | `/our-team` | Página institucional via builder |
| Carreiras | `/careers` | Página interna; lista vagas somente se `features.jobs` estiver ligada |
| Detalhe de vaga | `/job-circulars/{job_circular}` | Rota pública, mesmo com feature desligada na UI |
| Perfil de instrutor | `/instructors/{instructor}` | Rota pública herdada; risco de marketplace em modo escola |
| Exames | `/exams/{category?}` | Catálogo público do módulo Exam |
| Detalhe de exame | `/exams/details/{slug}/{id}` | Produto público paralelo aos cursos |
| Inscrição de newsletter | `/subscribes` | `index/store`; feature desligada por padrão |
| Recuperar senha | `/forgot-password`, `/password-reset/{token}` | Páginas de autenticação públicas |
| OAuth Google | `/auth/google` e callback | Fluxo público condicional |
| Manutenção/instalação | `/system/maintenance`, `/install/*` | Superfícies técnicas, não devem participar do redesign institucional |

## 4. Homes e seções controladas pelo builder/CMS

O modelo `PageSection` controla, conforme cada seção: `active`, `sort`, `title`, `description`, `thumbnail`, `background_image`, `properties`, arrays de itens, seleção de conteúdos e limites. `SectionEditor` edita os campos e `DataSortModal` altera ordem/visibilidade.

| Variante | Composição disponível |
|---|---|
| Home 1 | hero, parceiros, categorias, cursos em destaque, overview/indicadores, novos cursos, instrutores, FAQ, blog, newsletter/CTA |
| Home 2 | hero, categorias, overview, cursos em destaque, novos cursos, instrutores, depoimentos, parceiros, CTA, blog |
| Home 3 | hero, overview, parceiros, cursos por categoria, instrutores, features, categorias, novos cursos, depoimentos, CTA, blog |
| Home 4 | hero de curso, parceiros, categorias, curso principal, overview, instrutor, FAQ, depoimentos, blog, CTA |
| Home 5 | hero, estatísticas, categorias, curso principal, cursos, instrutor, FAQ, depoimentos, CTA, blog |
| Sobre | hero, estatísticas de sucesso, equipe, CTA; dados de instrutor podem ser anexados conforme configuração |
| Equipe | hero, instrutores, parceiros |

Os componentes de cada seção ficam em `resources/js/pages/intro/partials/home-{n}/`. A ponte comum do builder é `resources/js/pages/intro/partials/section.tsx`; seleção e ordem são aplicadas nas páginas `home-{n}.tsx`. Páginas internas usam `resources/js/pages/inner/sections/index.tsx`.

### Conteúdo que já deve permanecer editável pelo painel

- Títulos, descrições, imagens e fundos das seções da Home.
- Ordem e estado ativo/inativo das seções.
- FAQs, depoimentos, estatísticas, logos de parceiros e arrays editoriais.
- Seleções e limites de cursos, categorias, posts e instrutores em seções dinâmicas.
- Dados editoriais das páginas `Page`: nome, título, descrição rica e metadados SEO.
- Conteúdo dos cursos: mídia, título, resumo, descrição, currículo, requisitos, resultados, FAQ, preço e SEO.
- Posts e categorias do blog.
- Logo, nome, descrição e demais campos de `system_settings`.
- Itens, títulos, URLs, ordem e visibilidade de navbar/footer.

## 5. Menus, navbar e footer vindos do banco

### Navbar

`HandleInertiaRequests` chama `SettingsService::getNavbar('navbar_1')`. `resources/js/layouts/navbar/index.tsx` renderiza itens `url` e `dropdown`; `partials/actions.tsx` renderiza ações por `slug` (`theme`, `language`, `notification`, `cart`, `profile`). Ordem e estado vêm de `navbar_items`.

O seeder inclui: Courses, Exams, About Us, Our Team, Careers, Blogs, Search, Theme, Notification, Cart, Language e Profile. Login e cadastro **não** são itens do banco: são CTAs hardcoded no componente de ações.

### Footer

`SettingsService::getFooter('footer_1')` alimenta `resources/js/layouts/footer/index.tsx`. Banco controla listas, endereço, redes sociais, meios de pagamento e copyright. Logo e descrição institucional vêm de configurações do sistema.

O seeder ainda contém conteúdo inadequado: endereço em Bangladesh, e-mail `uilib@gmail.com`, telefone genérico, copyright UI Lib e textos em inglês. Esses valores podem já ter sido alterados no banco, mas precisam ser verificados no ambiente ativo.

## 6. Seções e decisões hardcoded

Mesmo quando o texto vem do banco, a estrutura visual e a posição são fixas nos TSX. Os principais hardcodes são:

- Cinco árvores de componentes de Home, uma por variante; o builder reordena/ativa instâncias conhecidas, mas não cria novos tipos de bloco.
- Navbar fixa em 72 px, comportamento sticky em card arredondado, breakpoint e posicionamento.
- Botões de login/cadastro e rótulos administrativos `Back`/`Customize` no TSX.
- Footer em colunas, área de meios de pagamento e estilo de redes sociais.
- Catálogo com sidebar de filtros, alternância grid/lista e `CourseCard1` obrigatória.
- SEO do catálogo escrito em inglês, com fallbacks `Mentor Learning Management System` e autor `UiLib`.
- Detalhe de curso em grid 2/3 + 1/3 e tabs fixas: overview, curriculum, details, instructor, reviews.
- Cabeçalho do curso sempre tenta renderizar instrutor, rating, idioma, certificado, matriculados e duração.
- Blog com sidebar de filtros e título hardcoded no formato `All Blogs`.
- Página institucional sem seções usa uma caixa central `bg-muted`, largura limitada e Tiptap.
- Auth usa tela central mínima com logo, sem narrativa institucional ou imagem aeronáutica.
- Carrinho usa card de resumo sticky, cupom, imposto e totais.
- `cart-summery.tsx` contém CTA literal **“Test”** e o link de continuação para pagamento comentado. É um risco funcional preexistente e deve ser tratado em sprint própria com validação de fluxo; não foi alterado nesta auditoria.

Textos seedados em `database/data/PageData.php`, `database/data/utils/IntroSections.php` e `InnerSections.php` são código de inicialização, não conteúdo vivo depois de persistidos. Alterá-los isoladamente não atualiza instalações existentes.

## 7. Elementos de marketplace ainda visíveis

| Elemento | Onde aparece | Situação |
|---|---|---|
| Catálogo por “top/new/category courses” | Homes e catálogo | Útil, mas linguagem precisa virar portfólio formativo, não vitrine de vendedores |
| Instrutor como entidade pública clicável | `course-header.tsx`, cards, perfil público | O tab é condicionado por modo, porém o cabeçalho do detalhe continua mostrando/linkando instrutor |
| Avaliação por estrelas e contagem de reviews | cards e detalhe | Pode ser preservada como prova social, mas hoje domina visualmente como marketplace |
| Número de alunos/matrículas | cards e detalhe | Pode virar indicador institucional; repetição em cada card parece marketplace |
| Wishlist/coração | `course-card-1/2/6`, rotas e área do aluno | Funcionalidade existente; não remover. Reduzir protagonismo ou mostrar somente autenticado |
| Preço riscado, desconto e cupom | cards/carrinho | Necessário comercialmente, porém apresentação atual é de varejo promocional |
| Categorias e filtros extensos | catálogo | Úteis, mas sidebar densa reforça padrão marketplace |
| Top instructors / “learn with me” | Homes 1–5 | Inadequado ao posicionamento da escola; flags escondem parte, não todo o legado |
| Become instructor, payouts e perfis | áreas autenticadas/rotas | Flags ajudam a ocultar; manter backend intacto e impedir vazamento no público |
| Exames como produto paralelo | navbar/seeder e módulo público | Deve ser decidido editorialmente: módulo acadêmico pode permanecer, mas não como segundo marketplace |
| Theme switcher | navbar | Recurso genérico de produto SaaS; avaliar remoção apenas da navegação pública, preservando capacidade interna |
| Meios de pagamento no footer | footer | Visual de e-commerce; pode ficar restrito ao checkout ou em versão discreta |

## 8. Elementos irrelevantes ou desalinhados com escola de aviação

- Textos Mentor LMS, UI Lib, Figma, “creative courses”, AR/VR genérico, métricas fictícias e depoimentos com nomes genéricos.
- Blocos “Top Instructors”, “Reasons to Learn with Me” e páginas individuais de vendedores.
- Chamadas centradas em descontos e atualização de cursos em vez de carreira, segurança, conformidade e excelência operacional.
- Endereço, contatos e copyright seedados de demonstração.
- Exames, vagas, newsletter, social do blog e seleção de tema quando expostos sem estratégia institucional.
- Visual de cards pequenos e repetitivos, filtros laterais densos, excesso de badges, estrelas, preços e corações.
- Metadados SEO em inglês e referências a “online learning platform”, “expert instructors” e `USD` hardcoded no schema do curso.

## 9. Componentes reutilizáveis

### Reaproveitar com nova apresentação

- `LandingLayout`, `Main`, `Navbar`, `Footer`: mantêm integração e dados; trocar estrutura visual internamente.
- `AppLogo`: já consome logos configuráveis do sistema.
- `Section`, `SectionEditor`, `DataSortModal` e campos do editor: núcleo do builder.
- Componentes de conteúdo dinâmico (`courses`, `categories`, `blogs`) e serviços de seleção.
- `TiptapRenderer`: páginas institucionais, posts e descrição de curso.
- `CourseFilter` e paginação: preservar comportamento, adaptar para drawer/chips/filtros discretos.
- `Curriculum`, `Overview`, `Details`, `CoursePreview`, botões de matrícula/player: preservar regras e ações.
- UI primitives (`Button`, `Accordion`, `Tabs`, `Sheet`, `Dialog`, `Carousel`, `Card`) como base técnica.
- Auth forms, validação, reCAPTCHA e Google OAuth: manter lógica e redesenhar invólucro.
- Blog comments/like-dislike: preservar, subordinando-os ao editorial.
- Carrinho, cálculo, cupom e integração de gateway: preservar integralmente; corrigir fluxo somente com escopo aprovado.

### Substituir visualmente ou encapsular

- As cinco implementações de Hero por um hero institucional Airways compatível com o schema do builder.
- `CourseCard1` como card padrão público; criar card editorial de formação e manter ações existentes.
- Navbar flutuante em card por header corporativo responsivo com estados transparente/sólido.
- Footer atual por footer institucional, continuando a consumir `footer_items`.
- Layouts de catálogo e blog com sidebar padrão marketplace.
- Cabeçalho e tabs do detalhe do curso por narrativa “programa de formação”.
- Caixote genérico de páginas legais/institucionais por templates editoriais.
- `AuthLayout` por composição de marca coerente, sem alterar formulários.
- Seções de instrutor/marketplace nas Homes por blocos de autoridade institucional, estrutura, metodologia, segurança e carreira.

“Substituir” significa criar nova camada visual e migrar chamadas; os componentes legados não devem ser apagados até regressão e aprovação.

## 10. Matriz conteúdo × código

| Deve ser editável no painel | Deve permanecer no código/design system |
|---|---|
| Headlines, textos, CTAs e URLs editoriais | Grid, breakpoints, espaçamento e hierarquia tipográfica |
| Imagem/vídeo/poster do hero | Comportamento responsivo e tratamento de mídia |
| Seleção/ordem de cursos e posts | Variante visual dos cards |
| Métricas e respectivos rótulos | Componente de indicadores e acessibilidade |
| Parceiros, depoimentos e FAQs | Carrossel/grid e estados de interação |
| Conteúdo legal e institucional | Templates de página e largura de leitura |
| Menu, footer, contatos e redes | Header/footer visual e regras responsivas |
| SEO de páginas, cursos e posts | Fallbacks seguros e schema estruturado |
| Informações acadêmicas/comerciais do curso | Orquestração de matrícula, carrinho e checkout |

## 11. Riscos e validações obrigatórias antes do redesign

1. Confirmar Home ativa e exportar `pages`, `page_sections`, `navbar_items`, `footer_items` e settings do ambiente real.
2. Capturar screenshots desktop/mobile de todas as rotas públicas e estados autenticado/não autenticado.
3. Inventariar quais flags Airways estão efetivamente ligadas em produção.
4. Testar curso gratuito, pago, já matriculado, wishlist, cupom, carrinho vazio/cheio e gateways.
5. Decidir o papel público de exames, instrutores, equipe, vagas e newsletter sem remover rotas.
6. Corrigir fallbacks SEO/brand legados durante a implementação visual, sem mudança de regra de negócio.
7. Tratar o CTA “Test” do carrinho como defeito preexistente de alta prioridade, após aprovação específica.

## 12. Conclusão

O projeto tem boa separação de dados e apresentação para evoluir sem tocar no backend, mas o builder é um **editor de instâncias de seções conhecidas**, não um page builder livre. A estratégia segura é preservar contratos de props, slugs, ações e rotas; introduzir uma camada visual Airways; e migrar página por página com fallback para os componentes existentes.
