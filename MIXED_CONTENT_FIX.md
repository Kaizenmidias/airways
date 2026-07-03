# Mixed Content Fix

## Causa raiz

O mixed content vinha de duas fontes principais:

1. Geração de URL pública baseada em `APP_URL` sem normalização de esquema.
2. URLs internas persistidas em campos do banco com `http://airwaysacademy.com.br`, especialmente em arquivos de mídia e settings.

O problema aparecia no Safari porque parte do conteúdo era servido em HTTPS, mas imagens e links internos ainda eram montados com `http://`.

## Correções aplicadas

### Geração futura de URLs

- Adicionados helpers centralizados em [`app/Helpers/App.php`](/c:/Users/lucas/Downloads/airways/app/Helpers/App.php):
  - `airways_should_force_https()`
  - `airways_normalize_url()`
  - `airways_app_url()`
  - `airways_frontend_url()`
  - `airways_asset_url()`
  - `airways_storage_url()`
- `config/app.php` passou a expor `asset_url` e `frontend_url`.
- `config/filesystems.php` agora monta a URL do disk `public` com `airways_storage_url()`.
- `AppServiceProvider` força HTTPS em ambiente não local e gera o reset password link com URL normalizada.
- `resources/views/app.blade.php` passou a usar `airways_app_url()` no `og:url`.
- `LocalFileUploadService` passou a gerar `file_url` via `Storage::disk(...)->url(...)`, não via `asset()`.
- URLs de notificações e callbacks de pagamento foram normalizadas para usar helpers próprios do projeto.
- `config/sanctum.php` passou a usar o frontend URL normalizado.
- O instalador também foi ajustado para gravar `APP_URL` já normalizado.

### Saneamento do banco

Criei o comando seguro:

```bash
php artisan airways:normalize-internal-urls
php artisan airways:normalize-internal-urls --apply
```

Ele faz dry-run por padrão e só persiste com `--apply`.

## Arquivos alterados

- `.env.example`
- `app/Helpers/App.php`
- `app/Http/Controllers/Auth/GoogleAuthController.php`
- `app/Http/Controllers/Auth/PasswordResetLinkController.php`
- `app/Http/Controllers/Payout/MollieController.php`
- `app/Http/Controllers/Payout/PaypalController.php`
- `app/Http/Controllers/Payout/PaystackController.php`
- `app/Http/Controllers/Payout/StripeController.php`
- `app/Notifications/CourseApprovalNotification.php`
- `app/Notifications/ForumNotification.php`
- `app/Providers/AppServiceProvider.php`
- `app/Services/LocalFileUploadService.php`
- `config/app.php`
- `config/filesystems.php`
- `config/sanctum.php`
- `resources/views/app.blade.php`
- `routes/console.php`
- `Modules/Installer/app/Http/Controllers/InstallerController.php`
- `Modules/PaymentGateways/app/Http/Controllers/MollieController.php`
- `Modules/PaymentGateways/app/Http/Controllers/PaypalController.php`
- `Modules/PaymentGateways/app/Http/Controllers/PaystackController.php`
- `Modules/PaymentGateways/app/Http/Controllers/RazorpayController.php`
- `Modules/PaymentGateways/app/Http/Controllers/SslCommerzController.php`
- `Modules/PaymentGateways/app/Http/Controllers/StripeController.php`
- `Modules/PaymentGateways/app/Services/SslCommerz/SslCommerzNotification.php`

## Tabelas e campos com URLs HTTP encontrados

### Diretamente mapeados para saneamento

- `settings.fields`
- `pages.banner`
- `pages.favicon`
- `pages.description`
- `pages.meta_description`
- `pages.meta_keywords`
- `page_sections.thumbnail`
- `page_sections.background_image`
- `page_sections.video_url`
- `page_sections.description`
- `page_sections.flags`
- `page_sections.properties`
- `media.custom_properties`
- `media.responsive_images`
- `media.manipulations`
- `media.generated_conversions`
- `chunked_uploads.file_url`
- `chunked_uploads.metadata`
- `navbar_items.value`
- `navbar_items.items`
- `footer_items.items`
- `blogs.thumbnail`
- `blogs.banner`
- `blogs.description`
- `blogs.meta_description`
- `blogs.meta_keywords`

### Tabelas sem coluna de URL direta

- `navbars`
- `footers`

Essas tabelas não possuem coluna própria de URL no schema atual. O conteúdo navegável fica nos itens relacionados.

## Risco controlado

- Não foram alterados arquivos físicos.
- Não foram alteradas rotas.
- Não foi forçado HTTPS em local.
- URLs externas de terceiros não são tocadas pelo comando.
- O comando de saneamento atua apenas em `http://airwaysacademy.com.br`.

## Comandos de deploy

```bash
php artisan optimize:clear
php artisan migrate --force
php artisan airways:normalize-internal-urls --apply
npm run build
```

Se o servidor estiver com `vendor` incompleto, rode `composer install` antes de `php artisan optimize:clear`.

## Observação final

Para produção, mantenha estas variáveis definidas com HTTPS:

- `APP_URL`
- `FRONTEND_URL`
- `ASSET_URL`
- `APP_FORCE_HTTPS=true`

