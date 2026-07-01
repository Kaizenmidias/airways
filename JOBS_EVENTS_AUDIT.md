# Auditoria de Jobs, Events e Listeners: Mentor LMS

Este relatório cobre a verificação de código assíncrono e eventos em background na aplicação, buscando identificar vulnerabilidades ou lógicas ocultas relativas à execução remota, chamadas de rede, criação de contas e alteração de privilégios.

## 1. Visão Geral Estrutural
Durante a auditoria na árvore de diretórios raiz (`app/`) e na arquitetura de módulos (`Modules/`), constatou-se que **o sistema não utiliza a arquitetura de Eventos, Listeners ou Jobs personalizados**.
- As pastas `app/Jobs`, `app/Events` e `app/Listeners` **não existem**.
- Nenhum módulo de domínio (ex: Blog, Exam, Certificate) implementa classes que estendem `Job` ou implementam `ShouldQueue` como rotinas de trabalho isoladas.
- O desacoplamento de ações no sistema é feito primariamente através de `Services`, operando de forma **síncrona** na request do usuário.

## 2. Processamento de Fila (Notifications)
A única exceção de processamento assíncrono identificada no core do projeto é o sistema de notificações (localizado em `app/Notifications/`). Ele conta com os seguintes arquivos:
- `CourseApprovalNotification`
- `ForumNotification`
- `InstructorApprovalNotification`
- `NewsletterNotification`
- `ResetPasswordNotification`
- `VerifyEmailNotification`

Estas notificações usam os drivers de e-mail e fila do Laravel estritamente para o disparo de mensagens transacionais (`MailMessage`) ou inserção no banco de dados, sem realizar processamento agressivo.

---

## 3. Análise dos Vetores Solicitados

Como as lógicas não estão escondidas em *Jobs* ou *Listeners*, analisamos a sua presença nos fluxos síncronos da aplicação:

### A. Execução Remota em Background
**Nenhuma encontrada.** Como não existem *Jobs* para orquestrar tarefas invisíveis, toda e qualquer chamada a processos (como a limpeza de cache `Artisan::call` ou migrações detectadas previamente) acontece por ativação direta de uma Rota / Controller em modo síncrono. Não há *workers* realizando injeção de processos ou avaliação (`eval`) no sistema operacional do servidor de modo agendado.

### B. Chamadas HTTP Ocultas
**Seguro.** Não há *Jobs* programados para efetuar *polling* para servidores externos ou realizar exfiltração de dados ("phone home"). As únicas chamadas HTTP detectadas na base inteira pertencem a gateways de pagamento no momento exato em que a transação de compra do carrinho (`Checkout`) é ativada pelo cliente.

### C. Criação Silenciosa de Usuários
**Seguro.** Nenhum *Listener* reage a eventos genéricos para criar usuários backdoor no banco de dados. A modelagem de registros e contas ocorre apenas via endpoints do Laravel Breeze/Sanctum e lógicas de OAuth localizadas nos respectivos Controllers de Autenticação (`AuthService`).

### D. Alteração Automática de Permissões
**Seguro.** A elevação de privilégios e mapeamento de perfis (`role`) não é engatilhada por Eventos complexos. Por exemplo, quando um usuário aplica para ser um Instrutor, o fluxo passa por um painel administrativo. O administrador utiliza um *Controller* para aprovar a requisição, e a delegação da permissão ocorre sequencialmente e de forma auditável dentro do `InstructorService`, e apenas então uma *Notification* é enfileirada para enviar um e-mail confirmando o aceite.

## Conclusão
O Mentor LMS não emprega a orquestração assíncrona complexa do Laravel (`Events/Listeners/Jobs`). O código é amplamente procedural/síncrono (Controllers acionando Services), o que, do ponto de vista de auditoria estática de código fechado, **elimina completamente a ameaça de backdoors atuando silenciosamente por Workers/Filas** ou engatilhados por reflexões de eventos do sistema. Toda lógica de negócio roda transparente na Thread da requisição HTTP principal.
