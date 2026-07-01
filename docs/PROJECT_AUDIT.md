# Auditoria do Projeto: Mentor LMS

## 1. Versão do Laravel
- **Laravel Framework:** `^12.0`
- **PHP:** `^8.2`

## 2. Estrutura das Pastas
O projeto segue a arquitetura padrão do Laravel combinada com Inertia.js no front-end e uso intenso de módulos. As principais pastas são:
- `app/`: Contém os Controllers, Models, Middleware, Services e lógicas principais de negócio.
- `Modules/`: Contém os módulos da aplicação (arquitetura HMVC) para separar funcionalidades grandes.
- `database/`: Migrations, seeders e factories de banco de dados.
- `resources/js/`: Código fonte do Front-end em React + Inertia, com páginas divididas em auth, courses, student dashboard, etc.
- `routes/`: Múltiplos arquivos de rotas para separação de domínios (`web.php`, `admin.php`, `instructor.php`, `student.php`, etc.).
- `public/`: Ponto de entrada web, com assets buildados via Vite.

## 3. Módulos Existentes
Utilizando o pacote `nwidart/laravel-modules`, as funcionalidades independentes e plugins da aplicação estão nesta estrutura:
- **Blog**
- **Certificate**
- **Exam**
- **Installer**
- **Language**
- **PaymentGateways**
- **Updater**

## 4. Tabelas do Banco de Dados
Mapeadas nas *migrations*, o sistema conta com uma estrutura bem consolidada:
- **Acesso/Usuários:** `users`, `instructors`, `personal_access_tokens`
- **Catálogo de Cursos:** `courses`, `course_categories`, `course_category_children`, `course_sections`, `section_lessons`, `lesson_resources`
- **Avaliações:** `section_quizzes`, `quiz_questions`, `question_answers`, `quiz_submissions`, `course_assignments`, `assignment_submissions`
- **Interação:** `course_reviews`, `course_forums`, `course_forum_replies`, `course_faqs`, `course_requirements`, `course_outcomes`
- **Engajamento dos Alunos:** `course_enrollments`, `course_progress`, `watche_histories`, `course_wishlists`, `course_certificates`
- **Comercial e Pagamentos:** `course_carts`, `course_coupons`, `payment_gateways`, `payment_histories`, `payment_settings`, `payout_histories`
- **Sistema Geral:** `media` (via Spatie), `pages`, `page_sections`, `notifications`, `settings`, `navbars`, `footers`, `chunked_uploads`

## 5. Fluxo de Autenticação
- Implementado utilizando pacotes base do ecossistema: **Laravel Breeze**, **Sanctum** e **Socialite**.
- O front-end React consome propriedades Inertia para sessões de usuário autenticadas.
- Possui fluxos de permissão distintos para **Estudantes**, **Instrutores** e **Administradores**.
- Permite login via redes sociais (Google Auth) através da biblioteca Socialite.

## 6. Fluxo de Cursos
1. **Criação do Curso:** Administrador ou Instrutor cria a estrutura em árvore (`Course` -> `Section` -> `Lesson/Quiz/Assignment`).
2. **Gerenciamento de Conteúdo:** O upload de mídias é tratado, e pode ser feito através do banco local ou hospedagem de terceiros (como AWS S3).
3. **Consumo:** Após se inscrever, o aluno tem acesso à interface do `course-player`. O seu progresso em cada aula e as respostas de quizzes são gravados individualmente nas tabelas `course_progress` e `watche_histories`.
4. **Interação:** Os alunos podem perguntar no fórum do curso ou deixar um "review" final (`course_reviews`).

## 7. Fluxo de Pagamentos
1. O aluno adiciona os cursos em um carrinho (`course_carts`).
2. Pode aplicar cupons de desconto validados na tabela `course_coupons`.
3. Ao prosseguir, o sistema aciona o módulo **PaymentGateways**.
4. Há múltiplas integrações (Stripe, PayPal, Mollie, Paytm, Razorpay).
5. Após retorno de sucesso via webhook/callback, é gravado em `payment_histories` e o acesso é liberado, gerando a matrícula (`course_enrollments`).
6. Os instrutores recebem uma fração da venda; e solicitam os valores em modo de repasse ("payouts") guardados em `payout_histories`.

## 8. Fluxo de Certificados
1. Ao preencher 100% de `course_progress` (ou conforme regras de cada curso), o sistema marca o curso como concluído.
2. O módulo **Certificate** é responsável por gerar o layout e preencher as variáveis (Nome do aluno, Data, Carga horária).
3. Salva uma instância única em `course_certificates`.
4. O aluno pode exportar um PDF renderizado pela biblioteca `barryvdh/laravel-dompdf`.

## 9. Dependências Instaladas
Principais bibliotecas composer e npm identificadas:
- `laravel/framework` (^12.0)
- `inertiajs/inertia-laravel` e React JS
- `nwidart/laravel-modules` (Gestão HMVC)
- `spatie/laravel-medialibrary` (Uso intenso para imagens e arquivos atrelados a models)
- `barryvdh/laravel-dompdf`
- Pacotes de Pagamentos: `stripe/stripe-php`, `srmklive/paypal`, `razorpay/razorpay`, `paytm/paytmchecksum`, `mollie/laravel-mollie`
- Ferramentas Google: `google/apiclient`, `anhskohbo/no-captcha`
- Storage: `league/flysystem-aws-s3-v3`

## 10. Integrações Externas
O sistema está conectado com serviços variados:
- **Gateways de Pagamento Global e Regional:** Stripe, PayPal, Razorpay, Paytm, Mollie.
- **Armazenamento de Mídia:** Amazon AWS S3.
- **Autenticação de Terceiros:** Google (via Socialite/API Client).
- **Segurança de Form:** Google reCAPTCHA.

---

### Como o sistema funciona (End-to-End)
A plataforma é um LMS (Learning Management System) full-stack altamente robusto, moderno (SPA via React com Inertia) e extensível.

1. **Visitante:** Acessa a página principal gerada a partir das tabelas `pages` e `page_sections`. Visualiza categorias e listagem dos cursos disponíveis.
2. **Onboarding:** Ao decidir comprar um curso ou acessar um curso grátis, o usuário é direcionado para a etapa de autenticação (Breeze/Socialite).
3. **Checkout:** Ao confirmar a intenção de compra, todos os itens no carrinho são calculados (com cupons possíveis) e enviados para uma API de integração de pagamento, gerenciada em módulos isolados para evitar sujeira de código. 
4. **Learning Experience:** Após matricular-se (`course_enrollments`), o aluno é enviado ao "Student Dashboard", onde encontra seus cursos, wishlists e opções financeiras. Ao iniciar um curso, o player renderizado acompanha via eventos JavaScript o tempo consumido e submete updates para o backend registrar `course_progress` contínuo. Avaliações são renderizadas por etapas (lições de vídeo seguidas de submissões de Quizzes ou Assignments criados no módulo `Exam`).
5. **Certificação:** Quando todos os passos necessários de conteúdo ou aproveitamento de prova são alcançados, o sistema de `Certificate` valida o usuário e gera um documento permanente para ele atestar sua conclusão.
6. **A Visão do Instrutor/Administrador:** Paralelamente a isso, o Instrutor monitora pelo "Dashboard" quantas matrículas foram feitas, gerencia suas finanças em solicitações de saque de seus ganhos repassados pela plataforma (payouts) e interage nos fóruns tirando dúvidas dos alunos. O Admin master gerencia traduções (`Language`), atualizações de software (`Updater`) e as integrações por módulos de pagamento. Tudo gerando uma roda completa de gestão EAD.
