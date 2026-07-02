# Auditoria PT-BR da Dashboard

## Escopo

Segunda auditoria focada exclusivamente em textos visíveis da interface autenticada React/Inertia: sidebar, header, páginas administrativas e componentes compartilhados. Rotas, slugs, imports, nomes técnicos, enums e valores enviados ao backend não foram alterados.

A busca conservadora encontrou 466 ocorrências JSX candidatas em 105 arquivos. Esse total inclui falsos positivos como textos já traduzidos, iniciais de avatar (`IM`, `CN`), nomes de produtos, moedas, siglas, componentes de demonstração, comentários e valores técnicos. Cada ocorrência foi classificada antes da edição.

## Causa da sidebar em inglês

`resources/js/layouts/dashboard/partials/routes.tsx` exportava um array estático com todos os nomes em inglês. Como o array não recebia `page.props.translate`, trocar o idioma nunca afetava a navegação.

A sidebar agora é criada por `getDashboardRoutes(translate)`. Todos os labels usam o grupo `button` com fallback inglês (`button.chave ?? 'English fallback'`). As regras de acesso, paths, slugs e chamadas `route()` permaneceram iguais.

## Novas chaves do catálogo

Foram adicionadas ao grupo `button`:

- `exams`
- `certificates`
- `course_coupons`
- `manage_exams`
- `create_exam`
- `exam_coupons`
- `course_enrollments`
- `exam_enrollments`
- `marksheet`
- `authentication`
- `translation`
- `toggle_theme`
- `system_theme`

As chaves foram sincronizadas em:

- `lang/en/button.php`
- `lang/pt-BR/_overrides.php`
- `storage/app/lang/groups/button.php`
- `resources/js/types/lang/button.d.ts`

Isso mantém fallback inglês, tipagem e disponibilidade para novos idiomas criados pelo painel Translation. Nenhuma migration foi criada ou executada.

## Textos hardcoded encontrados

Lista consolidada dos textos visíveis identificados. Repetições em telas diferentes aparecem uma única vez nesta lista.

### Sidebar e navegação

`Main Menu`, `Dashboard`, `Courses`, `Categories`, `Manage Courses`, `Create Course`, `Course Coupons`, `Exams`, `Manage Exams`, `Create Exam`, `Exam Coupons`, `Enrollments`, `Course Enrollments`, `Exam Enrollments`, `Instructors`, `Manage Instructors`, `Create Instructor`, `Applications`, `Payout Report`, `Payout Request`, `Payout History`, `Payouts`, `Withdraw`, `Settings`, `Job Circulars`, `All Jobs`, `Create Job`, `Blogs`, `Create Blog`, `Manage Blog`, `Newsletters`, `All Users`, `Certificates`, `Certificate`, `Marksheet`, `Account`, `System`, `Pages`, `Storage`, `Payment`, `Auth`, `Live Class`, `Translation`, `Maintenance`.

### Header e componentes comuns

`Toggle theme`, `Light`, `Dark`, `System`, `Sidebar`, `Displays the mobile sidebar`, `Toggle Sidebar`, `Close`, `More`, `Previous slide`, `Next slide`, `Selected File`, `Upload Error`, `Delete account`, `Warning`, confirmações de exclusão e mensagens auxiliares.

### Cursos, atividades e matrículas

`Select User`, `Course Coupons`, `Manage discount coupons for your Courses`, `Coupon Code`, `Global Coupon`, `Unlimited`, `Select Course`, `Valid From`, `Valid To`, `Usage Limit`, `Active`, `Expiry period type`, `Expiry date`, `Preview Video`, `Resource Type`, `Resource`, `Summary`, `Lesson type`, `Pending`, `Graded`, `Resubmitted`, `Late Submission`, `Submissions`, `View Submissions`, `Update Assignment`, `Submission`, `Marks`, `Not Graded`, `Submitted At`, `Assignment`, `Total Marks`, `Attempt Number`, `Submission Details`, `Student Comment`, `Back`.

### Provas

`Exam Categories`, `Manage exam categories and organize your exams`, `Exam Coupons`, `Manage discount coupons for your exams`, `Create Coupon`, `Add Coupon`, `Coupon List`, `Select Exam`, `All exams (global coupon)`, `Create Exam`, `View Exam`, `Submit for Review`, `Change Status`, `Change Exam Status`, `Exam Details`, `Pricing`, `Total Questions`, `Duration`, `Pass Mark`, `Max Attempts`, `Level`, `Performance Analytics`, `Total Attempts`, `Completed Attempts`, `Average Score`, `Pass Rate`, `Recent Attempts`, `No attempts yet`, `Quick Actions`, `Recent Enrollments`, `No enrollments yet`, `Reviews`, `Exam FAQs`, `Requirements`, `Learning Outcomes`, `Exam Resources`, `No resources available`, `Meta Title`, `Meta Keywords`, `Meta Description`, `OG Title`, `OG Description`, `No Questions Yet`, `Exam Questions`, `Matching Pairs`, `Accepted Answers`, `Correct Order`, `Guidelines`, `Instructions`, `Short Description`, `Full Description`, `Difficulty Level`, `Beginner`, `Intermediate`, `Advanced`, `Expert`, `Draft`, `Published`, `Archived`.

### Certificados e boletins

`Certificate Templates`, `Course Certificate Templates`, `Exam Certificate Templates`, `Marksheet Templates`, `Course Marksheet Templates`, estados vazios, `Basic Information`, `Template Type`, `Template Name`, `Logo & Branding`, `Logo Image`, recomendação de arquivo, `Colors`, `Primary Color`, `Secondary Color`, `Background Color`, `Border Color`, `Typography`, `Font Family`, estilos de fonte, `Certificate Text`, `Marksheet Content`, `Title Text`, `Description Text`, `Completion Text`, `Header Text`, `Institution Name`, `Footer Text`, `Live Preview`, `Course Certificate Generator`, `Certificate Size`, `Download Format`, `Certificate Preview`, `Certificate of Completion`, `This is to certify that`, `Authorized Certificate of Achievement`.

### Settings e integrações

`Contact Information`, `Phone`, `Media`, `Logo Dark`, `Logo Light`, `Additional Settings`, `None`, `Show`, `Hide`, `Save Changes`, `Full Name`, `Designation`, `Resume`, `Skills`, `Biography`, `No results`, `Add New Page`, `ReCaptcha Settings`, instrução do ReCaptcha, `Site Key`, `Secret Key`, `Meeting SDK Credentials`, `Setup Instructions`, etapas do Zoom e `Required Scopes`.

### Gateways e payouts

`Mollie Settings`, `PayPal Settings`, `Paystack Settings`, `Stripe Settings`, descrições de configuração, `Currency`, `Test Mode`, `API Credentials`, `Test API Key`, `Live API Key`, `Sandbox Credentials`, `Production Credentials`, `Test Credentials`, `Live Credentials`, `Webhook Settings`, `Webhook Secret` e descrição de webhooks.

### Blog e vagas

`No categories found`, orientação para criar categoria do blog e orientação para criar a primeira vaga.

## Textos preservados intencionalmente

- Valores técnicos: `pending`, `approved`, `active`, `draft`, `published`, `archived`, `video_url`, `production`, `local`, `mysql`, `ltr`, `rtl`, `smtp`, `tls`, `ssl`.
- Nomes de produtos e protocolos: Stripe, PayPal, Paystack, Mollie, Zoom, ReCaptcha, SMTP, AWS S3, OAuth, SDK, API e webhook. Os textos ao redor foram traduzidos.
- Códigos e siglas de moeda: USD, BRL, EUR, GBP, INR, CAD, AUD, JPY etc. Alguns nomes de moedas permanecem em inglês porque fazem parte de listas padronizadas de gateways.
- SEO, OG, URL, HTML, SVG, PNG, JPG e outros formatos técnicos.
- Iniciais/fallbacks de avatar (`IM`, `CN`).
- Componentes de demonstração `test-dialog.tsx` e `table/data-table-demo.tsx`, sem evidência de uso na dashboard de produção.
- Comentários JSX e código comentado, que não são renderizados.
- Conteúdo dinâmico vindo do banco, como títulos de páginas, navbar/footer, cursos e notificações antigas.

## Arquivos alterados

### Catálogos e tipos

- `lang/en/button.php`
- `lang/pt-BR/_overrides.php`
- `storage/app/lang/groups/button.php`
- `resources/js/types/lang/button.d.ts`

### Layout e componentes compartilhados

- `resources/js/layouts/dashboard/partials/routes.tsx`
- `resources/js/layouts/dashboard/partials/nav-main.tsx`
- `resources/js/components/appearance.tsx`
- `resources/js/components/chunked-uploader.tsx`
- `resources/js/components/certificate-generator.tsx`
- `resources/js/components/delete-user.tsx`
- `resources/js/components/exam/question-answer-result.tsx`
- `resources/js/components/ui/breadcrumb.tsx`
- `resources/js/components/ui/carousel.tsx`
- `resources/js/components/ui/dialog.tsx`
- `resources/js/components/ui/sheet.tsx`
- `resources/js/components/ui/sidebar.tsx`

### Dashboard

- `resources/js/pages/dashboard/blogs/categories.tsx`
- `resources/js/pages/dashboard/certificate/certificate.tsx`
- `resources/js/pages/dashboard/certificate/certificate-builder.tsx`
- `resources/js/pages/dashboard/certificate/marksheet.tsx`
- `resources/js/pages/dashboard/certificate/marksheet-builder.tsx`
- `resources/js/pages/dashboard/certificate/partials/certificate-builder-form.tsx`
- `resources/js/pages/dashboard/certificate/partials/marksheet-builder-form.tsx`
- `resources/js/pages/dashboard/courses/coupons/coupon-form.tsx`
- `resources/js/pages/dashboard/courses/coupons/coupon-table-columns.tsx`
- `resources/js/pages/dashboard/courses/coupons/index.tsx`
- `resources/js/pages/dashboard/courses/partials/assignment-table-column.tsx`
- `resources/js/pages/dashboard/courses/partials/forms/assignment-grade-form.tsx`
- `resources/js/pages/dashboard/courses/partials/forms/lesson-form.tsx`
- `resources/js/pages/dashboard/courses/partials/forms/resource-form.tsx`
- `resources/js/pages/dashboard/courses/partials/grade-submission-dialog.tsx`
- `resources/js/pages/dashboard/courses/partials/media.tsx`
- `resources/js/pages/dashboard/courses/partials/pricing.tsx`
- `resources/js/pages/dashboard/courses/partials/resource-list.tsx`
- `resources/js/pages/dashboard/courses/partials/submissions.tsx`
- `resources/js/pages/dashboard/courses/partials/submissions-table-column.tsx`
- `resources/js/pages/dashboard/enrollments/partials/enrollment-modal.tsx`
- `resources/js/pages/dashboard/exams/categories/index.tsx`
- `resources/js/pages/dashboard/exams/coupons/coupon-form.tsx`
- `resources/js/pages/dashboard/exams/coupons/coupon-table-columns.tsx`
- `resources/js/pages/dashboard/exams/coupons/index.tsx`
- `resources/js/pages/dashboard/exams/create.tsx`
- `resources/js/pages/dashboard/exams/index.tsx`
- `resources/js/pages/dashboard/exams/show.tsx`
- `resources/js/pages/dashboard/exams/partials/exam-update-header.tsx`
- `resources/js/pages/dashboard/exams/partials/exam-table-columns.tsx`
- `resources/js/pages/dashboard/exams/partials/forms/exam-basic-form.tsx`
- `resources/js/pages/dashboard/exams/partials/forms/exam-settings-form.tsx`
- `resources/js/pages/dashboard/exams/partials/question-dialog.tsx`
- `resources/js/pages/dashboard/exams/partials/question-types/fill-blank-form.tsx`
- `resources/js/pages/dashboard/exams/partials/question-types/listening-form.tsx`
- `resources/js/pages/dashboard/exams/partials/question-types/matching-form.tsx`
- `resources/js/pages/dashboard/exams/partials/question-types/ordering-form.tsx`
- `resources/js/pages/dashboard/exams/partials/question-types/short-answer-form.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/basic.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/info.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/media.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/pricing.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/questions.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/resources.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/seo.tsx`
- `resources/js/pages/dashboard/exams/partials/tabs-content/settings.tsx`
- `resources/js/pages/dashboard/job-circulars/index.tsx`
- `resources/js/pages/dashboard/payouts/partials/mollie.tsx`
- `resources/js/pages/dashboard/payouts/partials/paypal.tsx`
- `resources/js/pages/dashboard/payouts/partials/paystack.tsx`
- `resources/js/pages/dashboard/payouts/partials/stripe.tsx`
- `resources/js/pages/dashboard/settings/live-class.tsx`
- `resources/js/pages/dashboard/settings/pages/index.tsx`
- `resources/js/pages/dashboard/settings/partials/recaptcha.tsx`
- `resources/js/pages/dashboard/settings/partials/update-profile.tsx`
- `resources/js/pages/dashboard/settings/system/partials/website.tsx`
- `resources/js/pages/dashboard/settings/translation/index.tsx`

## Validação

- `npm run build`: aprovado.
- Vite: 5.430 módulos transformados.
- Catálogo `button`: 214 chaves em inglês e PT-BR, nenhuma chave ausente.
- Sintaxe PHP dos catálogos/base: aprovada.
- Nenhuma migration criada ou executada.
- `php artisan optimize` e `view:cache` não foram executados.

O build manteve apenas avisos preexistentes sobre duas imagens resolvidas em runtime e import dinâmico do `highlight.js`.
