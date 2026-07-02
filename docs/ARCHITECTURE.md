# Mentor LMS - Arquitetura do Sistema

Este documento mapeia os principais componentes arquiteturais da aplicação, bem como os relacionamentos de banco de dados.

## 1. Models
Os modelos (Eloquent) representam a camada de dados e lógica de negócio de baixo nível da aplicação.
- **Modelos Globais (`app/Models`)**: `User`, `Instructor`, `JobCircular`, `Setting`, `ChunkedUpload`, `PaymentHistory`, `PayoutHistory`, `Page`, `PageSection`, `Navbar`, `Footer`, `Newsletter`, `Subscribe`.
- **Modelos de Curso (`app/Models/Course`)**: `Course`, `CourseCategory`, `CourseCategoryChild`, `CourseSection`, `SectionLesson`, `SectionQuiz`, `QuizQuestion`, `QuestionAnswer`, `QuizSubmission`, `CourseAssignment`, `AssignmentSubmission`, `LessonResource`, `CourseEnrollment`, `CourseCart`, `CourseCoupon`, `CourseProgress`, `WatchHistory`, `CourseReview`, `CourseCertificate`, `CourseFaq`, `CourseForum`, `CourseRequirement`, `CourseOutcome`.

## 2. Controllers
A camada HTTP que recebe as requisições, interage com os Services e devolve respostas (JSON ou Inertia/React).
- **Controllers Gerais (`app/Http/Controllers`)**: `HomeController`, `DashboardController`, `InstructorController`, `StudentController`, `PaymentController`, `SettingController`, `NotificationController`, `JobCircularController`, `ChunkedUploadController`.
- **Controllers de Curso (`app/Http/Controllers/Course`)**: `CourseController`, `PlayerController`, `CurriculumController`, `CourseCartController`, `CourseEnrollmentController`, `QuizController`, `LessonResourceController`, `CourseAssignmentController`, `CourseCouponController`, `CourseReviewController`.

## 3. Services
Camada de serviços que encapsula a lógica de negócio complexa para não sobrecarregar os Controllers.
- **Serviços Globais (`app/Services`)**: `AuthService`, `AccountService`, `InstructorService`, `StudentService`, `SettingsService`, `S3MultipartUploadService`, `LocalFileUploadService`, `MediaService`, `PageService`.
- **Serviços de Curso (`app/Services/Course`)**: `CourseService`, `CoursePlayerService`, `CourseSectionService`, `CourseEnrollmentService`, `SectionQuizService`, `CourseCartService`, `AssignmentSubmissionService`.

## 4. Middleware
Filtros HTTP para verificar permissões, configurações e modificações nas requisições.
- `CheckRole`: Verifica permissões de acesso (ex: admin, instructor, student).
- `CheckEnroll`: Verifica se o usuário tem matrícula válida no curso antes de liberar o `PlayerController`.
- `HandleInertiaRequests`: Compartilha variáveis globais com o React (dados da sessão, flash messages).
- `AppConfig`, `AuthConfig`, `SmtpConfig`: Carregam ou verificam as configurações do sistema dinamicamente.
- Outros: `IpDetectorMiddleware`, `VerifiedAccess`, `CheckCourseCreation`.

## 5. Jobs, Events & Policies
- **Jobs**: A pasta `app/Jobs` não está presente. Processamentos assíncronos podem estar alocados nos módulos ou utilizando funções anônimas (closures) na fila de execução padrão do Laravel.
- **Events**: A pasta `app/Events` não está presente. A comunicação reativa é gerida diretamente nos Services ou Observers.
- **Policies**: A pasta `app/Policies` não está presente. A autorização é controlada amplamente através dos Middlewares (`CheckRole`) e lógicas no `AuthService`/Controllers.

## 6. Migrations (Tabelas do Banco de Dados)
A estruturação do banco de dados está concentrada em `database/migrations`.
- **Usuários**: `users`, `instructors`, `personal_access_tokens`.
- **Conteúdo EAD**: `courses`, `course_categories`, `course_sections`, `section_lessons`, `lesson_resources`.
- **Avaliações**: `section_quizzes`, `quiz_questions`, `question_answers`, `course_assignments`.
- **Progresso/Ações**: `course_enrollments`, `course_progress`, `watche_histories`, `course_certificates`.
- **Financeiro**: `course_carts`, `course_coupons`, `payment_gateways`, `payment_histories`, `payout_histories`.
- **Estrutura Visual**: `pages`, `page_sections`, `navbars`, `footers`, `media`.

---

## 7. Relacionamentos entre as Tabelas (Diagrama Lógico)

Abaixo estão as cardinalidades das principais tabelas do sistema:

### Usuários e Instrutores
- **`users` -> `instructors`**: `1 : 1` (Um usuário pode ter um perfil de instrutor cadastrado).
- **`users` -> `course_enrollments`**: `1 : N` (Um usuário pode se matricular em múltiplos cursos).
- **`users` -> `payment_histories`**: `1 : N` (Um usuário tem vários históricos de pagamento).
- **`users` -> `course_reviews`**: `1 : N` (Um usuário pode fazer diversas avaliações).

### Estrutura de Cursos
- **`course_categories` -> `courses`**: `1 : N` (Uma categoria tem vários cursos).
- **`instructors` -> `courses`**: `1 : N` (Um instrutor pode criar múltiplos cursos).
- **`courses` -> `course_sections`**: `1 : N` (Um curso é dividido em vários módulos/seções).
- **`course_sections` -> `section_lessons`**: `1 : N` (Uma seção contém múltiplas aulas em vídeo/texto).
- **`course_sections` -> `section_quizzes`**: `1 : N` (Uma seção pode ter vários quizzes associados).
- **`section_lessons` -> `lesson_resources`**: `1 : N` (Aulas podem conter PDFs/Links extras).

### Avaliações (Quizzes)
- **`section_quizzes` -> `quiz_questions`**: `1 : N` (Um quiz contém diversas perguntas).
- **`quiz_questions` -> `question_answers`**: `1 : N` (Uma pergunta tem várias alternativas de resposta).
- **`users` -> `quiz_submissions`**: `1 : N` (O usuário envia suas submissões de respostas).

### Consumo e Matrícula
- **`courses` e `users` via `course_enrollments`**: `N : M` (Relacionamento de muitos-para-muitos; registra que o aluno tem acesso).
- **`course_enrollments` -> `course_progress`**: `1 : N` (Registra percentuais de aulas e módulos concluídos).
- **`users` e `section_lessons` via `watche_histories`**: `N : M` (Guarda exatamente em qual minuto e segundo do vídeo o aluno parou).
- **`users` e `courses` via `course_certificates`**: `N : M` (Após a conclusão, um certificado único é gerado atrelando usuário e curso).

### Finanças
- **`users` -> `course_carts`**: `1 : N` (Itens temporários no carrinho de compras).
- **`course_carts` -> `courses`**: `N : 1` (Cada item no carrinho referencia um curso).
- **`payment_histories` -> `course_enrollments`**: (Após o pagamento ser efetuado, converte-se em matrícula real).
- **`instructors` -> `payout_histories`**: `1 : N` (Solicitações de saque dos valores arrecadados pelas vendas).
