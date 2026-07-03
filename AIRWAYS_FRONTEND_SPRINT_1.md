# AIRWAYS_FRONTEND_SPRINT_1

Sprint 1 concluida: fundacao visual do front publico, sem alterar backend, migrations, rotas, models, controllers ou regras de negocio.

## Arquivos alterados

- `resources/css/app.css`
- `resources/js/components/app-logo.tsx`
- `resources/js/components/public/public-container.tsx`
- `resources/js/components/public/eyebrow.tsx`
- `resources/js/components/public/editorial-heading.tsx`
- `resources/js/components/public/media-frame.tsx`
- `resources/js/components/public/institutional-cta.tsx`
- `resources/js/components/public/metric-strip.tsx`
- `resources/js/components/public/program-card.tsx`
- `resources/js/components/public/trust-band.tsx`
- `resources/js/layouts/landing-layout.tsx`
- `resources/js/layouts/navbar/index.tsx`
- `resources/js/layouts/footer/index.tsx`

## Componentes criados

- `PublicContainer`
- `Eyebrow`
- `EditorialHeading`
- `MediaFrame`
- `InstitutionalCTA`
- `MetricStrip`
- `ProgramCard`
- `TrustBand`

## O que foi redesenhado

- Header/navbar publico
- Footer publico
- Estrutura base visual do `LandingLayout`
- Tokens visuais da area publica via `.landing-shell`

## Funcionalidades preservadas

- Builder/CMS continuo ativo
- `?customize=true` continua suportado
- Menus e itens do CMS continuam sendo renderizados
- Footer do CMS continua sendo renderizado
- Logo do sistema continua sendo usado
- Login e cadastro continuam acessiveis
- Carrinho continua acessivel
- Seletor de idioma continua acessivel quando habilitado
- Theme toggle continua acessivel quando habilitado
- Responsividade mobile continua preservada
- Links e rotas publicas existentes nao foram alterados
- Checkout, cursos, blog, player, provas e pagamentos nao foram tocados

## Melhorias visuais aplicadas

- Paleta da Airways aplicada ao shell publico
- Predominio de branco, cinza e azul escuro com vermelho apenas de destaque
- Header com linha institucional superior e navegacao mais limpa
- Footer mais editorial e corporativo
- Fallback visual seguro para logo ausente
- Menu publico com tratamento mais limpo para itens de perfil e acoes
- Ocultacao de elementos mais marketplace-like no menu de perfil

## Riscos encontrados

- O ambiente local nao tem `vendor/`, entao o Laravel nao sobe com `php artisan serve` aqui.
- O navegador controlado nao estava disponivel nesta sessao, entao nao consegui fazer a verificacao visual por browser local.
- O build do front passou, mas a verificacao de render em runtime ainda depende de um ambiente Laravel com dependencias instaladas e banco disponivel.

## Validacao executada

- `npm run build` concluido com sucesso
- Tentativa de subir o Laravel local falhou por ausencia de `vendor/autoload.php`

## Proximos passos recomendados

1. Subir o ambiente Laravel com dependencias instaladas e banco configurado.
2. Validar a Home, cursos, detalhe do curso, blog, login, cadastro e checkout no browser.
3. Conferir o modo `?customize=true` no admin com navbar e footer.
4. Avaliar pequenos ajustes de espaco e hierarquia antes da Sprint 2.
