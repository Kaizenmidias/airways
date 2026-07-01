# Auditoria de Segurança: Mentor LMS

Este relatório detalha os achados de uma auditoria técnica de segurança estática no código do projeto, com foco em potenciais injeções, funções de execução remota, vulnerabilidades de SSRF e ofuscação.

## 1. Achado: SSRF e LFI Potencial via `file_get_contents`
- **Arquivo:** `app/Http/Controllers/Course/LessonResourceController.php`
- **Linha:** 64
- **Severidade:** ALTA
- **Explicação:** O método `download` utiliza a função `file_get_contents($resourceUrl)` dentro de um response stream. Essa URL vem diretamente do banco de dados, da tabela referente aos materiais da lição. Se um Instrutor mal-intencionado ou um usuário com privilégios de salvar o campo `resource` conseguir preenchê-lo com `file:///etc/passwd` ou uma URL interna tipo `http://169.254.169.254` (dados de metadata em AWS), ele conseguirá ler arquivos locais do servidor (LFI) ou forjar requisições em nome do backend (SSRF).
  - *Recomendação:* Utilizar as ferramentas do Laravel Storage para retornar o arquivo em anexo, e caso seja imperativo usar links externos diretos em vez de download, apenas redirecionar o usuário ou validar rigidamente a URL origem (allowlists de domínio e negação severa aos schemas `file://` e IPs locais).

## 2. Achado: Uso de `base64_decode`
- **Arquivo:** `app/Http/Controllers/ChunkedUploadController.php`
- **Linha:** 106
- **Severidade:** BAIXA / INFORMATIVA
- **Explicação:** Funções de decodificação Base64 são frequentemente utilizadas por backdoors ofuscados em repositórios comprometidos. Neste caso específico, a função é chamada no meio do controle do upload (`$chunk = base64_decode($base64Content);`). Isso indica o uso em um fluxo legítimo de reconstrução de arquivos "chunked", mas ressalta a necessidade de garantir que o arquivo reconstruído não seja executável ou gravado em um diretório público onde o PHP o interprete.

## 3. Achado: Método Nomeado `system` (Falso Positivo de Execução)
- **Arquivo:** `app/Http/Controllers/SettingController.php`
- **Linha:** 68
- **Severidade:** INFORMATIVA
- **Explicação:** Foi detectada a string `public function system(Request $request)`. Um scanner superficial poderia apontar isso como a função perigosa `system()` nativa do PHP. O código, entretanto, revela tratar-se apenas de um método de rota (endpoint) responsável por salvar/carregar as configurações do sistema. Não há execução remota de comandos do SO atrelada.

## 4. Achado: Comentários/Chamadas de Webhooks
- **Arquivo:** `Modules/PaymentGateways/app/Http/Controllers/MollieController.php`
- **Linha:** 43
- **Severidade:** BAIXA / INFORMATIVA
- **Explicação:** O código apresenta mapeamento de configuração de *webhooks* comentados ou em standby (`"webhookUrl" => route('webhooks.mollie')`). Ao ativar qualquer endpoint de webhook exposto para gateways (Stripe, Mollie, PayPal), é imprescindível que o middleware verifique rigidamente a assinatura/hash do payload para impedir que atacantes simulem eventos do tipo "pagamento confirmado", fraudando compras gratuitas no carrinho.

---

## Observações Gerais e Testes de Funções Perigosas

Durante o rastreio abrangente pelo código do sistema, incluindo os sub-diretórios (`app/`, `Modules/` e `routes/`), **não** foram encontradas ocorrências ativas de:
- `eval()`
- `gzinflate()`
- `shell_exec()`, `exec()`, `passthru()`, `system()`
- `proc_open()`, `popen()`

**Rotas ou Middlewares ocultos e Seeders Administrativos Automáticos:**
Foi feita uma verificação no arquivo de `DatabaseSeeder.php` e nas configurações das rotas principais. Não foram identificados acessos do tipo backdoor codificados ou rotas maliciosas invisíveis. As chamadas de rotas seguem o padrão arquitetural HMVC das pastas de Módulos e roteamento nativo.

**Conclusão da Avaliação de Código Malicioso Injetado:**
Tratando o código como de uma "fonte não confiável", até o escopo das buscas, a base de código não apresenta indícios de estar intencionalmente "infectada" ou abrigando shells escondidos em funções de base nativa. A falha prioritária mapeada é uma brecha arquitetural em um dos Controllers (`LessonResourceController`) que deve ser corrigida imediatamente.
