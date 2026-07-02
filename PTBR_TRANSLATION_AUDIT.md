# Auditoria de Tradução PT-BR

## Escopo

Auditoria realizada no Airways Academy (Laravel 12, React/Inertia e módulos `nwidart/laravel-modules` 12), cobrindo arquivos de idioma, módulo Language, PHP, Blade, React/TypeScript, notificações, e-mails, menus, painéis, formulários e validações.

Foram inventariados 1.202 arquivos PHP/Blade/JS/TS/TSX fora de `vendor` e `node_modules`. A busca conservadora por texto JSX/Blade identificou 168 arquivos ainda contendo ao menos um literal em inglês. Nem todo resultado é texto traduzível: nomes de produtos, opções técnicas, exemplos, componentes de demonstração e conteúdo administrável também aparecem nessa contagem.

## Arquitetura de internacionalização

### Arquivos

- `lang/en/`: fonte de traduções Laravel usada em execução. Contém `auth`, `button`, `common`, `dashboard`, `frontend`, `input`, `pagination`, `passwords`, `settings`, `table` e `validation`.
- `lang/pt-BR/`: adicionada nesta implementação. Os oito grupos da aplicação herdam todas as chaves inglesas e substituem as traduções disponíveis em PT-BR. Isso mantém fallback completo sem remover inglês.
- `resources/lang/`: não existe neste projeto. `resources/js/types/lang/` contém apenas tipos, não traduções.
- `Modules/*/lang/`: os Service Providers suportam esse caminho, mas nenhum módulo possui catálogo próprio atualmente.
- `storage/app/lang/default/`: modelos dos arquivos ingleses copiados ao criar um idioma pelo painel.
- `storage/app/lang/groups/`: definições administrativas divididas em blocos (`name`, `slug`, `properties`) usadas para popular o banco e montar o editor de traduções.
- Não há catálogo JSON de traduções em uso.

### Fluxo em execução

1. `HandleInertiaRequests` obtém os idiomas ativos da tabela `languages`.
2. O idioma vem do cookie `locale`; na ausência dele, usa o idioma marcado como padrão.
3. `LanguageService::setLanguageProperties()` carrega as propriedades do banco, registra as linhas com `Lang::addLines()` e o Laravel resolve `trans('grupo.chave')`.
4. O middleware compartilha oito grupos no prop Inertia `translate`.
5. O React acessa esses grupos por `useLang()` ou por `page.props.translate`.

### Painel Translation e banco

O painel grava traduções no banco, não nos arquivos PHP:

- `languages`: nome, código, nome nativo, flag, status ativo e status padrão.
- `language_properties`: grupo, nome do bloco, slug, objeto JSON `properties` e `language_id`.

Ao adicionar um idioma, `LanguageService::storeLanguage()` copia `storage/app/lang/default` para `lang/{code}` e cria as propriedades com base em `storage/app/lang/groups`. Ao editar uma propriedade, o Controller atualiza o JSON `language_properties.properties`. Portanto, os arquivos são base/fallback; as edições do painel vivem no banco.

## Problemas encontrados e correções

### Cache compartilhado entre idiomas

O cache usava uma única chave (`language_properties`) independentemente do locale. Isso permitia que um idioma recebesse temporariamente linhas de outro. A chave agora inclui o locale (`language_properties:{locale}`), e a troca de idioma invalida a chave correta.

### Locale inválido ou idioma padrão ausente

Um cookie antigo poderia apontar para idioma inativo/inexistente, e o acesso direto ao idioma padrão poderia gerar erro quando nenhum registro estivesse marcado. O middleware agora valida o locale contra idiomas ativos e possui fallback seguro.

### PT-BR no banco

A migration `2026_07_02_000001_seed_portuguese_brazil_language.php` cria ou atualiza `pt-BR`, mantém `en`, marca PT-BR como ativo/padrão e popula os oito grupos de forma idempotente. Chaves ainda sem tradução usam o texto inglês, evitando valores ausentes e erros no React.

### Configuração padrão

O `.env.example` agora recomenda `APP_LOCALE=pt-BR`, `APP_FALLBACK_LOCALE=en` e `APP_FAKER_LOCALE=pt_BR`. Em produção, a migration define o idioma padrão do painel; a variável de ambiente continua sendo o fallback do framework.

## Cobertura implementada

- Autenticação, botões, entidades comuns, navegação e ações.
- Cursos, aulas, módulos, questionários, provas, atividades e certificados.
- Alunos, professores, matrículas, pagamentos e saques.
- Configurações, backups, páginas, mídia e traduções.
- Formulários, placeholders comuns e mensagens de validação Laravel.
- Detalhes e resultados de provas.
- Carrinho e telas Blade dos gateways.
- Assuntos e textos principais de e-mails de autenticação/aprovação.
- Notificações de professor, curso, prova e fórum.
- Comunicados, currículo de curso e atividades.

## Textos não traduzidos por risco técnico

- Nomes de rotas, parâmetros de rota, slugs, nomes de tabelas e colunas.
- Valores enviados ao backend, como `pending`, `approved`, `production`, `local`, `mysql`, `ltr`, `rtl`, `video_url` e identificadores de abas.
- Nomes e termos próprios de integrações: Stripe, PayPal, Paystack, Razorpay, Mollie, SSLCommerz, Paytm, Zoom, SMTP, AWS, S3, API, webhook e OAuth.
- Chaves, IDs, secrets, URLs, moedas e exemplos de credenciais.
- Títulos e descrições armazenados em `pages`, `page_sections`, `navbars`, `navbar_items`, `footers`, `footer_items`, cursos, blogs e comunicados. São conteúdo administrável, não catálogo de interface; devem ser traduzidos no painel/editor.
- Mensagens técnicas de exceção provenientes de SDKs, banco, filesystem ou gateways. Traduzi-las diretamente poderia esconder informação necessária para suporte.
- Componentes de demonstração/teste (`test-dialog`, `data-table-demo`) que não pertencem ao fluxo confirmado de produção.
- Literais restantes sem correspondência segura no catálogo. Eles continuam em inglês por fallback e podem ser traduzidos gradualmente no painel Translation ou migrados para novas chaves em uma etapa posterior.

## Arquivos alterados

- `.env.example`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Notifications/CourseApprovalNotification.php`
- `app/Notifications/ForumNotification.php`
- `app/Notifications/InstructorApprovalNotification.php`
- `app/Notifications/ResetPasswordNotification.php`
- `app/Notifications/VerifyEmailNotification.php`
- `Modules/Exam/app/Notifications/ExamApprovalNotification.php`
- `Modules/Language/app/Http/Controllers/LanguageController.php`
- `Modules/Language/app/Services/LanguageService.php`
- `Modules/Language/database/migrations/2026_07_02_000001_seed_portuguese_brazil_language.php`
- `Modules/PaymentGateways/resources/views/gateways/razorpay.blade.php`
- `Modules/PaymentGateways/resources/views/partials/CourseCard.blade.php`
- `lang/pt-BR/_loader.php`
- `lang/pt-BR/_overrides.php`
- `lang/pt-BR/auth.php`
- `lang/pt-BR/button.php`
- `lang/pt-BR/common.php`
- `lang/pt-BR/dashboard.php`
- `lang/pt-BR/frontend.php`
- `lang/pt-BR/input.php`
- `lang/pt-BR/pagination.php`
- `lang/pt-BR/passwords.php`
- `lang/pt-BR/settings.php`
- `lang/pt-BR/table.php`
- `lang/pt-BR/validation.php`
- `resources/js/components/exam/coupon-input.tsx`
- `resources/js/components/exam/exam-card-1.tsx`
- `resources/js/components/exam/question-answer-result.tsx`
- `resources/js/components/exam/question-status-badge.tsx`
- `resources/js/pages/courses/partials/overview.tsx`
- `resources/js/pages/dashboard/courses/partials/assignment.tsx`
- `resources/js/pages/dashboard/courses/partials/curriculum.tsx`
- `resources/js/pages/dashboard/settings/translation/index.tsx`
- `resources/js/pages/exams/partials/details.tsx`
- `resources/js/pages/exams/partials/overview.tsx`
- `resources/js/pages/inner/sections/career.tsx`
- `resources/js/pages/inner/sections/success-statistics.tsx`
- `resources/views/mail/email-change-verification.blade.php`
- `resources/views/mail/email-verification.blade.php`
- `resources/views/mail/reset-password.blade.php`
- `PTBR_TRANSLATION_AUDIT.md`

## Implantação

Depois do `git pull`, execute:

```bash
php artisan migrate --force
php artisan optimize:clear
npm ci
npm run build
```

Se o servidor já possui `node_modules` consistente com o lockfile, `npm ci` pode ser omitido. Usuários com cookie de idioma antigo continuam sendo validados contra os idiomas ativos; para selecionar PT-BR imediatamente, basta recarregar a sessão após a migration.

## Verificações realizadas

- Sintaxe PHP: aprovada em todos os arquivos PHP alterados.
- Paridade de traduções: 1.408 chaves conferidas nos oito grupos, sem chave ausente em PT-BR.
- `npm run build`: aprovado; 5.430 módulos processados pelo Vite.
- `git diff --check`: aprovado.
- `php artisan optimize:clear`: não executado localmente porque `vendor/autoload.php` não está instalado neste workspace; deve ser executado no servidor após `composer install`.
- `npm run types`: o projeto já possui erros de tipagem fora do escopo desta tradução (tipos de tabelas, Paytm, estruturas de questões e módulo `ziggy-js`). O build de produção não foi impedido e os erros não apontam para os arquivos TSX alterados nesta implementação.
