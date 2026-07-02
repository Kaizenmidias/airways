# Airways Academy - Auditoria de Adequação ao Modelo EAD Privado

## Escopo e conclusão executiva

Esta auditoria considera a Airways Academy uma operação EAD privada: somente a própria empresa publica cursos e provas, recebe pagamentos e atende alunos. Nenhuma alteração de código, rota, migration ou banco foi executada.

O projeto possui um modo global `administrative`, mas ele não elimina a arquitetura de marketplace. Ele apenas oculta ou bloqueia parte dela. A entidade `Instructor` continua estruturalmente obrigatória porque `courses.instructor_id` e `exams.instructor_id` são chaves estrangeiras não nulas. Assim, a estratégia segura é:

1. Fixar o sistema no modo administrativo e ocultar interfaces irrelevantes.
2. Desativar endpoints de cadastro público, aprovação, vagas, payouts e recursos sociais escolhidos.
3. Refatorar autoria e receita antes de remover código de instrutor.
4. Remover tabelas somente após migração de dados, telemetria e período de observação.

Não foi encontrado um sistema de multi-tenant, planos SaaS ou white label com cobrança recorrente. A personalização de páginas, navbar, footer, tema, storage e identidade visual é configuração normal de uma instalação única e deve permanecer.

## Funcionalidades irrelevantes

### Sistema de vagas e recrutamento

**Classificação:** Pode ser removido. **Impacto:** Baixo. **Risco:** Seguro remover após ocultação e verificação de conteúdo.

O recurso é isolado e não participa de cursos, matrículas ou pagamentos.

Dependências encontradas:

- Backend: `JobCircularController`, `JobCircularService`, `JobCircularRequest`, `JobCircular`.
- Rotas: recurso administrativo `dashboard/job-circulars`, toggle de status, página pública `job-circulars/{job_circular}` e página genérica `/careers`.
- Banco: `job_circulars`.
- Frontend: `resources/js/pages/dashboard/job-circulars/**`, `resources/js/pages/job-circulars/show.tsx`, `resources/js/pages/inner/sections/career.tsx` e item da sidebar.
- Conteúdo: `HomeController::inner_page()` injeta vagas na página Careers; `PageData` cria a página `careers`.
- Traduções/tipos: chaves `job_circulars`, `job_*`, `career` e tipos relacionados.

### Cadastro e aprovação pública de instrutores

**Classificação:** Pode ser removido. **Impacto:** Médio. **Risco:** Precisa de refatoração.

O fluxo de candidatura é irrelevante, mas compartilha Controller, Service, Model e notificações com a entidade técnica usada como autora de cursos.

Dependências encontradas:

- Rotas `become-instructor.store`, `become-instructor.update`, `instructors.applications`, `instructors.status`, CRUD de instrutores e `instructors.show`.
- `InstructorController`, `InstructorService`, requests de criação/atualização e `InstructorApprovalNotification`.
- Telas `student/tabs-content/become-instructor`, `dashboard/instructors/**` e links nos navbars/perfil.
- Middleware `checkCourseCreation`, enum `TeachingType` e `system_settings.sub_type`.
- `users.role = instructor` e `users.instructor_id`.

O fluxo de candidatura pode ser desligado antes da entidade `Instructor` ser removida.

### Multi-instrutor, perfil público e marketplace

**Classificação:** Pode ser removido somente após refatoração. **Impacto:** Alto. **Risco:** Não remover diretamente.

Dependências estruturais:

- `courses.instructor_id` é obrigatório e referencia `instructors`.
- `exams.instructor_id` também referencia `instructors`.
- `Course::instructor()`, `Exam::instructor()`, `Instructor::courses()` e `Instructor::exams()`.
- Criação de curso/prova define `instructor_id`; admins escolhem professor no modo colaborativo.
- `CourseService`, `ExamService`, cupons, matrículas, dashboard e páginas públicas carregam `instructor.user`.
- Cards, SEO, cabeçalhos, detalhes, avaliações e páginas iniciais exibem professor.
- Aprovação de curso/prova notifica o usuário associado ao instrutor.
- Home pages possuem seções `top_instructors` e `instructor`.
- Há 163 arquivos com referências relevantes a instrutor, receita ou payout.

Recomendação: no curto prazo, manter um único registro técnico de autor interno ligado ao admin ou à marca Airways Academy. No longo prazo, decidir entre:

- preservar `instructor_id` como “autor interno” sem qualquer perfil público; ou
- migrar para `created_by`/`author_user_id`, tornar a relação antiga nullable, migrar dados e só então remover `instructors`.

### Comissão, revenue share e ganhos de instrutor

**Classificação:** Pode ser removido após refatoração. **Impacto:** Alto. **Risco:** Precisa de refatoração.

Dependências encontradas:

- `payment_histories.admin_revenue` e `payment_histories.instructor_revenue`.
- `PaymentService` calcula separação de receita usando configurações do sistema.
- `DashboardService` monta dinamicamente `SUM({role}_revenue)`.
- Configuração `instructor_revenue` em Settings e formulário administrativo.
- Gráfico de receita, estatísticas e tipos frontend.

`payment_histories`, valor total, imposto, cupom, transação, invoice, usuário e item comprado devem permanecer. Apenas a divisão admin/instrutor é irrelevante.

### Payouts e pagamentos para professores

**Classificação:** Pode ser removido. **Impacto:** Médio. **Risco:** Precisa de refatoração.

O subsistema de payout é separado do checkout de alunos, apesar dos nomes parecidos.

Removível:

- `PayoutController`, `App\Services\Payout\*`, `App\Http\Controllers\Payout\*`.
- `PayoutHistory`, tabela `payout_histories`, requests de payout e telas `dashboard/payouts/**`.
- Rotas de saque em `routes/instructor.php`, relatórios em `routes/admin.php` e processamento em `routes/payout.php`.
- `Instructor.payout_methods` e formulários de conta bancária/gateway do professor.
- Pendências de saque e widgets de payout no dashboard.

Deve permanecer:

- `Modules/PaymentGateways`.
- `App\Services\Payment\*` e Controllers de compra.
- `payment_gateways`, `payment_histories`, carrinho, cupons e matrículas.

Não remover `PaymentGateways` ao remover payouts: ele processa vendas de cursos e provas.

### Fórum e discussões de curso

**Classificação:** Pode ser ocultado ou removido. **Impacto:** Médio. **Risco:** Precisa de refatoração localizada.

Dependências:

- Tabelas `course_forums` e `course_forum_replies`.
- Models `CourseForum`, `CourseForumReply`; relações em `Course` e `SectionLesson`.
- `CourseForumController`, `CourseForumReplyController`, `CourseForumService`, `ForumNotification`.
- Rotas em `routes/student.php`.
- Aba `forum` e formulários do course player.
- Notificações ao aluno/autor interno.

O fórum não é necessário para entrega do curso. Pode ser ocultado imediatamente, mas sua remoção deve limpar eager loads, relações, tipos e notificações.

### Blog

**Classificação:** Pode ser ocultado; remover depende da estratégia de marketing. **Impacto:** Médio. **Risco:** Precisa de decisão de negócio.

O módulo Blog é desacoplado da entrega EAD, mas está acoplado às home pages e pode ser útil para SEO/conteúdo.

Dependências:

- Módulo `Modules/Blog`, rotas públicas e administrativas.
- Tabelas `blogs`, `blog_categories`, `blog_comments`, `blog_like_dislikes`.
- Cards e seções `blogs` nas cinco home pages.
- Busca de conteúdo no editor de seções.

Recomendação: manter publicação de blog se houver estratégia de marketing, mas desativar likes/dislikes e comentários se a Airways não quiser comunidade. Se não houver uso editorial, o módulo inteiro pode ser removido em fase posterior.

### Newsletter e assinantes

**Classificação:** Pode ser ocultado; remover depende do marketing. **Impacto:** Baixo/Médio. **Risco:** Seguro remover como conjunto após decidir.

Há dois recursos relacionados:

- `subscribes`: captura de e-mails públicos.
- `newsletters`: criação e envio interno via `NewsletterNotification` para usuários por role.

Dependências: `NewsletterController`, `NewsletterService`, `NewsletterNotification`, Models e tabelas `newsletters`/`subscribes`, telas administrativas e formulários públicos. O envio percorre usuários sincronamente; em base grande, deveria usar fila.

### Likes, dislikes e comentários do blog

**Classificação:** Pode ser removido mesmo mantendo o Blog. **Impacto:** Baixo. **Risco:** Seguro remover com limpeza localizada.

Dependências: `BlogLikeDislikeController`, `BlogCommentController`, Models, Services, rotas autenticadas, componentes de leitura e tabelas `blog_like_dislikes`/`blog_comments`.

### Wishlist

**Classificação:** Pode ser ocultado; relevância comercial opcional. **Impacto:** Baixo. **Risco:** Seguro remover por domínio.

Existem wishlists separadas para cursos e provas (`course_wishlists`, `exam_wishlists`), rotas, Controllers, Services, botões/cards e aba do aluno. Não é marketplace-específico; pode aumentar conversão. Recomenda-se manter inicialmente e decidir por métricas.

### Reviews

**Classificação:** Deve permanecer inicialmente. **Impacto:** Médio. **Risco:** Não remover sem decisão comercial.

Avaliações de cursos e provas não dependem de marketplace e podem fornecer prova social e feedback. Se a operação não quiser conteúdo público de alunos, podem ser ocultadas e posteriormente removidas (`course_reviews`, `exam_reviews`).

### Notificações

**Classificação:** Deve permanecer parcialmente. **Impacto:** Médio.

Manter verificação de e-mail, redefinição de senha, matrículas, pagamentos e avisos essenciais. Remover apenas notificações ligadas a candidatura/aprovação de instrutor, payout e fórum. `CourseApprovalNotification` e `ExamApprovalNotification` podem ser simplificadas se o fluxo editorial interno deixar de exigir aprovação.

### Filas e jobs

Não foram encontrados Jobs de domínio específicos para marketplace. As tabelas Laravel `jobs`, `job_batches` e `failed_jobs` são infraestrutura de filas e não representam vagas. Não devem ser confundidas com `job_circulars` e devem permanecer enquanto notificações/e-mails puderem usar filas. O envio de newsletter atualmente itera usuários e merece migração para queue se for mantido.

## Menus irrelevantes

### Sidebar administrativa

Pode ser ocultado imediatamente:

- Instructors: Manage Instructors, Create Instructor, Applications.
- Payout Report: Payout Request e Payout History.
- Job Circulars: All Jobs e Create Job.
- Newsletters, se não houver marketing interno.
- Blogs, se não houver estratégia editorial.

Deve permanecer:

- Dashboard, Courses, Exams, Enrollments, All Users, Certificates e Settings.
- Payment em Settings é venda para alunos e deve permanecer.
- Translation, SMTP, Storage, Pages, System e Live Class permanecem conforme uso operacional.

### Sidebar/perfil do aluno

Pode ser ocultado:

- Become Instructor / Instructor Application.
- Fórum, se aprovado para retirada.
- Wishlist, somente por decisão comercial.

Devem permanecer: cursos, provas, progresso, certificados, perfil, notificações e histórico relevante.

### Dashboard

Pode ser ocultado/refatorado:

- Total de instrutores.
- Revenue share admin/instrutor.
- Pendências e histórico de saque.
- Gráficos calculados por coluna `{role}_revenue`.
- Filtros por instrutor.

Manter: receita bruta da Airways, vendas, matrículas, alunos, cursos, aulas, provas e progresso.

### Navegação pública

Pode ser ocultado:

- Links Become Instructor.
- Perfil público e links de instrutor.
- Seções Top Instructors/Instructor.
- Careers/vagas.
- Blog/newsletter conforme decisão de marketing.
- Cadastro público (`register`) se a política for criar aluno somente após compra/convite. Esta decisão afeta checkout e autenticação e deve ser validada antes.

## Módulos irrelevantes

| Módulo | Classificação | Impacto | Risco | Observação |
|---|---|---:|---|---|
| Blog | Pode ser ocultado/removido | Médio | Precisa de decisão | Útil para SEO; interações sociais podem sair separadamente. |
| Certificate | Deve permanecer | Alto | Não remover | Certificados de conclusão de alunos e templates são parte do EAD. Não é “certificado de instrutor”. |
| Exam | Deve permanecer | Alto | Não remover | Provas, questões, tentativas, matrículas e resultados. Refatorar apenas autoria por instrutor. |
| Installer | Deve permanecer | Médio | Não remover agora | Protege instalação e bootstrap; pode ser desabilitado em produção após instalação, não apagado sem análise operacional. |
| Language | Deve permanecer | Médio | Não remover | Tradução PT-BR e painel de idiomas. |
| PaymentGateways | Deve permanecer | Alto | Não remover | Checkout de alunos; distinto de payout. |
| Updater | Pode ser ocultado | Médio | Precisa de decisão operacional | Backup/update pelo painel pode ser desnecessário no deploy via Git, mas backups continuam importantes. |

`modules_statuses.json` também contém `GoogleAuth`, embora não exista diretório `Modules/GoogleAuth`; é uma entrada residual a revisar. O login Google real está implementado em Controllers/configurações da aplicação.

## Tabelas possivelmente desnecessárias

| Tabela/coluna | Classificação | Dependências | Risco |
|---|---|---|---|
| `job_circulars` | Pode ser removida | Vagas, Careers, HomeController | Baixo |
| `payout_histories` | Pode ser removida | PayoutService, gateways de saque, dashboard | Médio |
| `instructors` | Não remover agora | Courses, Exams, Users, páginas e serviços | Alto |
| `users.instructor_id` | Não remover agora | Relação reversa e filtros | Alto |
| `users.role = instructor` | Pode ser desativado antes de remover | Middleware, menus, Services | Médio/Alto |
| `instructors.payout_methods` | Pode ser removida após desligar payouts | Configurações de payout | Médio |
| `payment_histories.instructor_revenue` | Pode ser removida após migração | PaymentService, dashboard | Alto |
| `payment_histories.admin_revenue` | Refatorar para receita total | Dashboard/relatórios | Alto |
| `course_forums` | Pode ser removida | Player, Services, notificações | Médio |
| `course_forum_replies` | Pode ser removida | Fórum | Médio |
| `blog_like_dislikes` | Pode ser removida | Interação do Blog | Baixo |
| `blog_comments` | Pode ser removida | Comentários do Blog | Baixo |
| `blogs`, `blog_categories` | Decisão de marketing | Blog e home pages | Médio |
| `newsletters` | Decisão de marketing | Envio interno | Baixo |
| `subscribes` | Decisão de marketing | Captura pública | Baixo |
| `course_wishlists`, `exam_wishlists` | Opcional | Favoritos do aluno | Baixo |
| `jobs`, `job_batches`, `failed_jobs` | Deve permanecer | Infraestrutura Laravel Queue | Não remover |
| `notifications` | Deve permanecer | Notificações essenciais | Não remover |
| `payment_gateways`, `payment_histories` | Deve permanecer | Venda e auditoria financeira | Não remover |

## Permissões desnecessárias

Não há migrations/Models de permissions ou package ACL. A autorização usa:

- `users.role`: `admin`, `instructor`, `student`.
- Middleware `role:...` em `bootstrap/app.php` e módulos.
- `system_settings.sub_type`: `collaborative`/`administrative`.
- Middleware `checkCourseCreation`.
- Arrays `access` em `resources/js/layouts/dashboard/partials/routes.tsx`.

Elementos desnecessários após a transição:

- Role `instructor` para login e acesso independente.
- Acessos `collaborative` usados para liberar marketplace.
- Permissões implícitas de instrutor em cursos, provas, blogs, matrículas e payouts.
- Alternância administrativa que permite voltar ao modo colaborativo.

Recomendação: manter `admin` e `student`; se houver equipe interna de conteúdo, criar futuramente roles explícitas como `content_manager` somente com autorização backend real. Não confiar apenas em menus React.

## Rotas desnecessárias

### Removíveis após ocultação

- `job-circulars.*` públicas e administrativas.
- `become-instructor.store` e `become-instructor.update`.
- `instructors.applications`, `instructors.status`, CRUD e perfil público, após resolver autoria.
- `payouts.index`, `payouts.settings.*`, `payouts.request.index`, `payouts.history.index`.
- Todas as rotas de `routes/payout.php`, que são pagamento de saques, não checkout do aluno.
- `course-forums.*` e `course-forum-replies.*`, se fórum sair.
- `blogs.like-dislike.toggle` e `blogs.comments.*`, se interações sociais saírem.

### Não remover

- Rotas de `Modules/PaymentGateways` e Services `Payment`: compras.
- Cursos, player, matrículas, progresso, provas, tentativas, certificados e autenticação.
- Notifications essenciais e configurações de pagamento.

## Dependências encontradas

### Cadeia crítica de autoria

`users` -> `instructors` -> `courses/exams` -> matrículas, cupons, conteúdo, avaliações, pagamentos, cards e SEO.

Essa cadeia impede exclusão direta de `instructors`. O caminho seguro é criar um autor interno canônico ou migrar a autoria.

### Cadeia crítica financeira

Compra do aluno -> `PaymentGateways`/`App\Services\Payment` -> `payment_histories` -> matrícula.

Repasse ao professor -> `instructor_revenue` -> saldo -> `payout_histories` -> `App\Services\Payout`.

A segunda cadeia pode ser retirada; a primeira deve permanecer.

### Cadeia de páginas públicas

`PageData`/`PageSeeder` -> `pages`/`page_sections` -> `PageService` -> `HomeController` -> componentes React por tipo de seção.

Remover Careers, Top Instructors ou Blog exige limpar tanto os componentes quanto os registros/seeds de seção. Conteúdo já persistido no banco deve ser migrado ou desativado.

### Providers e módulos

Cada módulo registra rotas, migrations, views e Providers automaticamente. Desabilitar um módulo em `modules_statuses.json` é reversível, mas pode quebrar chamadas `route()` feitas durante renderização de menus. Primeiro é necessário remover/condicionar consumidores frontend e backend.

## Configurações administrativas

- Fixar `system.sub_type` em `administrative` é o controle reversível mais próximo do negócio atual.
- Remover do painel a possibilidade de selecionar `collaborative` evita reativação acidental do marketplace.
- `instructor_revenue` deixa de ser configurável; receita passa a ser 100% Airways.
- Configurações de payout de professor deixam de existir.
- Settings de payment, SMTP, storage, auth, pages, translation, live class e system permanecem.
- Navbar/footer/page editor devem ser revisados no banco porque podem conter links para Careers, Blog, Instructors ou Become Instructor independentemente do código.

## Recomendações

1. Começar apenas por ocultação e modo administrativo; não dropar tabelas.
2. Criar testes de smoke para compra, matrícula, player, prova, certificado e painel admin antes da desativação.
3. Separar nomenclatura `Payment` (recebimento) de `Payout` (repasse) em documentação e testes.
4. Criar um autor institucional Airways antes de alterar `Instructor`.
5. Migrar relatórios para receita bruta/receita líquida da empresa antes de remover colunas de revenue share.
6. Decidir formalmente Blog, Newsletter, Wishlist, Reviews e Fórum; eles não são obrigatoriamente marketplace.
7. Auditar dados existentes antes de cada drop: contagem, referências, exportação e backup.
8. Usar migrations novas e reversíveis; nunca editar migrations já executadas em produção.
9. Desabilitar registro público apenas após validar a jornada de compra de novos alunos.
10. Manter Installer protegido/desativado em produção e avaliar Updater conforme estratégia de deploy/backup.

## Matriz final

| Funcionalidade | Ocultar | Remover | Risco | Observações |
|---|:---:|:---:|---|---|
| Vagas / Job Circulars / Careers | Sim | Sim | Baixo | Domínio isolado. |
| Become Instructor | Sim | Sim | Médio | Separar do Model Instructor. |
| Candidatura e aprovação de instrutor | Sim | Sim | Médio | Remove rotas, telas, e-mails e notificações. |
| Perfil público de instrutor | Sim | Sim | Alto | Cards e páginas dependem de `instructor.user`. |
| Multi-instrutor | Sim | Sim, depois | Alto | FK obrigatória em cursos e provas. |
| Autor institucional técnico | Não | Não agora | Alto | Necessário enquanto `instructor_id` existir. |
| Comissão / revenue share | Sim | Sim, depois | Alto | Refatorar PaymentService e relatórios. |
| Payouts / saques de professor | Sim | Sim | Médio | Não confundir com checkout. |
| Pagamentos de alunos | Não | Não | Alto | Função central da plataforma. |
| Fórum de curso | Sim | Opcional | Médio | Remoção localizada, mas cruza player/notificações. |
| Blog editorial | Opcional | Opcional | Médio | Decisão de SEO/marketing. |
| Likes/dislikes/comentários do Blog | Sim | Sim | Baixo | Pode sair sem remover Blog. |
| Newsletter interna | Opcional | Opcional | Baixo/Médio | Decisão de comunicação. |
| Captura de assinantes | Opcional | Opcional | Baixo | Decisão de marketing/LGPD. |
| Wishlist | Opcional | Opcional | Baixo | Não é exclusiva de marketplace. |
| Reviews | Opcional | Opcional | Médio | Úteis para prova social/feedback. |
| Certificados de aluno | Não | Não | Alto | Função EAD central. |
| Provas | Não | Não | Alto | Função EAD central. |
| Live Class | Não, se usada | Opcional | Médio | Validar operação pedagógica. |
| Installer | Não apagar | Não agora | Médio | Desativar acesso em produção. |
| Updater pelo painel | Sim | Opcional | Médio | Depende da estratégia Git/backup. |
| Language/Translation | Não | Não | Médio | Necessário para PT-BR. |
| White label / multi-tenant / planos SaaS | N/A | N/A | Nenhum | Não foram encontrados subsistemas desse tipo. |

