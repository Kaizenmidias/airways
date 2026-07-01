# Auditoria de Dependências: Mentor LMS (Composer)

Este relatório compila a verificação de superfície dos pacotes PHP carregados via `composer.json` e `composer.lock`, com ênfase na identificação de dependências abandonadas, desatualizadas, suspeitas ou que representam riscos arquiteturais por histórico de CVEs (Common Vulnerabilities and Exposures).

## 1. Pacotes Abandonados / Descontinuados
- **Pacote:** `anhskohbo/no-captcha` (`^3.7`)
  - **Status:** **Desatualizado / Baixa Manutenção**
  - **Impacto:** Este pacote para integração do Google reCAPTCHA não recebe manutenções frequentes e a comunidade migrou majoritariamente para soluções ativas (como `biscolab/laravel-recaptcha`). Seu uso em PHP 8.2+ e Laravel 12 pode incorrer em avisos de depreciação de tipos e, futuramente, vulnerabilidades ignoradas por falta de atualizações de segurança pelo autor.

## 2. Pacotes Suspeitos ou com Riscos Criptográficos
- **Pacote:** `paytm/paytmchecksum` (`^1.1`)
  - **Status:** **Alerta Criptográfico**
  - **Impacto:** Bibliotecas de checksum específicas para gateways asiáticos como Paytm frequentemente utilizam algoritmos de hash que, com a evolução da criptoanálise, tornam-se propensos a colisões ou não operam perfeitamente em modo estrito no PHP 8. É crucial garantir que esta versão específica não utilize métodos fracos que possibilitem fraudes na verificação da assinatura do callback de pagamento.

## 3. Dependências com Histórico Crítico de CVE (Atenção ao Uso)
- **Pacote:** `barryvdh/laravel-dompdf` (`^3.1`)
  - **Status:** **Alerta de Configuração (SSRF / RCE)**
  - **Impacto:** Este é um pacote extremamente popular e legítimo, responsável por gerar os Certificados do Módulo `Certificate`. No entanto, o motor `dompdf` subjacente possui **histórico severo de vulnerabilidades**. Se um usuário mal-intencionado (ex: Instrutor) injetar código HTML ou CSS carregando fontes remotas, o `dompdf` pode ser forçado a tentar interpretar arquivos Phar maliciosos (deserialização RCE) ou fazer requisições SSRF pela rede local.
  - **Ação de Mitigação Obrigatória:** Garantir que no arquivo `config/dompdf.php`, as configurações `isRemoteEnabled` e `isPhpEnabled` estejam estritamente definidas como `false` quando renderizando PDFs a partir de dados não higienizados fornecidos pelo usuário.

## 4. Ecossistema Seguro Confirmado
As ferramentas centrais de controle e autorização estão na sua forma higienizada e robusta:
- `laravel/framework: ^12.0` (LTS ou versão segura mantida)
- Gateway Libraries (`stripe/stripe-php: ^16.6`, `mollie/laravel-mollie: ^3.1`, `srmklive/paypal: ~3.0`) - São pacotes oficiais das provedoras financeiras, atenuando a chance de ataques de typosquatting ou injeções *supply chain*.
- Storage (`league/flysystem-aws-s3-v3: ^3.29`) e Uploads (`spatie/laravel-medialibrary: ^11.12`) - Pacotes gold-standard da comunidade.

## Conclusão de Segurança de Pacotes
A base do projeto utiliza majoritariamente pacotes confiáveis de autores estabelecidos no ecossistema Laravel. Não foram encontrados pacotes *typosquatted* (pacotes falsos imitando os reais com malware). Recomenda-se apenas a migração do validador de Captcha e um isolamento de configuração rigoroso no gerador de PDFs.
