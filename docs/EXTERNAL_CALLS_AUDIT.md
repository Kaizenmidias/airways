# Auditoria de Chamadas Externas (HTTP / cURL / Proxy)

Este documento centraliza todas as requisições de rede originadas pelo backend do Mentor LMS para serviços de terceiros e leituras em *streams* via `file_get_contents`.

## 1. Requisições via Facade `Http::`

### Paystack Verification (HTTP GET)
- **Domínio:** `api.paystack.co`
- **Finalidade:** Verificação de status e validação do retorno da transação via servidor para fechar a compra com segurança (evitando bypass de front-end).
- **Classificação:** ✅ Legítimo
- **Ocorrências:**
  - `app/Services/Payout/PaystackService.php` (Linha 49)
  - `app/Http/Controllers/Payout/PaystackController.php` (Linha 49)
  - `Modules/PaymentGateways/app/Http/Controllers/PaystackController.php` (Linha 81)

### Exchange Rate API (HTTP GET)
- **Domínio:** `api.exchangerate-api.com`
- **Finalidade:** Conversão de moedas base para as moedas suportadas pelo Gateway de pagamento durante o checkout.
- **Classificação:** ✅ Legítimo
- **Ocorrências:**
  - `app/Services/Payment/PaymentService.php` (Linha 78)
  - `app/Http/Controllers/Payout/PaystackController.php` (Linha 131)
  - `Modules/PaymentGateways/app/Services/PaymentService.php` (Linha 163)

---

## 2. Requisições via `cURL` (Nativo)

### Integração Zoom Live Classes (Múltiplos cURL)
- **Domínio:** `api.zoom.us` e `zoom.us`
- **Finalidade:** Criar, editar, e deletar reuniões ao vivo integradas ao LMS (OAuth e CRUD de Meetings).
- **Classificação:** ✅ Legítimo
- **Ocorrências:**
  - `app/Services/LiveClass/ZoomLiveService.php` (Linhas 50, 83, 109, 130)

### Integração SSLCommerz Gateway (cURL)
- **Domínio:** URLs dinâmicas do ambiente SslCommerz (Sandbox ou Live).
- **Finalidade:** Envio do Payload de transação via POST (`AbstractSslCommerz.php`) e checagem antifraude do IPN (`SslCommerzNotification.php`).
- **Classificação:** ✅ Legítimo
- **Ocorrências:**
  - `Modules/PaymentGateways/app/Services/SslCommerz/AbstractSslCommerz.php` (Linha 49)
  - `Modules/PaymentGateways/app/Services/SslCommerz/SslCommerzNotification.php` (Linha 53)

---

## 3. Utilizações de `file_get_contents`

O sistema faz uso do `file_get_contents` tanto para leitura estática de sistema quanto para *streams* de dados.

### Download de Recursos de Curso / Avaliação
- **Domínio:** Dinâmico (Inserido via painel por instrutores/admins, armazenado na variável `$resourceUrl`).
- **Finalidade:** Forçar o download de anexos nas aulas ou exames. O servidor puxa o arquivo do link de origem para repassar em uma *Response Stream*.
- **Classificação:** 🚨 **SUSPEITO (Vulnerável)** - Risco crasso de SSRF (Server-Side Request Forgery) e LFI (Local File Inclusion), visto que não há filtros forçando `https://` seguros ou restringindo domínios.
- **Ocorrências:**
  - `app/Http/Controllers/Course/LessonResourceController.php` (Linha 64)
  - `Modules/Exam/app/Http/Controllers/ExamResourceController.php` (Linha 63)

### Operações de Sistema de Arquivos Local (I/O)
- **Domínio:** Ambiente Local (`base_path()`).
- **Finalidade:** Ler o arquivo de migração para update do banco (`FileService.php`), verificar a string de versão do software (`version.txt`) e ler arquivos de ambiente para o processo de onboarding (`.env`).
- **Classificação:** ✅ Legítimo
- **Ocorrências:**
  - `Modules/Updater/app/Services/FileService.php` (Linha 128)
  - `Modules/Updater/app/Http/Controllers/UpdaterController.php` (Linha 28)
  - `Modules/Installer/app/Helpers/Utils.php` (Linha 27)

---

## Observações Globais
- **GuzzleHttp (`new Client`):** A aplicação não utiliza invocações verbosas do `GuzzleHttp\Client` diretamente. Todos os clientes HTTP estão envolvidos apropriadamente pela fachada *wrapper* `Illuminate\Support\Facades\Http`.
- Não foram encontrados *webhooks* ou *beacons* maliciosos direcionando o tráfego oculto da plataforma para domínios desconhecidos. O tráfego externo rastreado engloba 100% de ferramentas nativas e necessárias ao fluxo de negócios (Pagamentos e Câmbio de Moedas).
