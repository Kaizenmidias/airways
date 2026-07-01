# Mapa da Arquitetura do Mentor LMS

O Mentor LMS é uma plataforma de aprendizado dividida em três pilares principais de atuação (Aluno, Instrutor e Admin), complementada por fluxos transacionais (Pagamento e Certificação). 

Este documento detalha o mapa funcional do sistema e analisa a modularidade da aplicação.

---

## 1. Fluxo do Aluno (Student Flow)
O aluno é o consumidor final do LMS. Seu fluxo é desenhado para maximizar a conversão (matrícula) e retenção (progresso de curso).
1. **Onboarding:** O visitante navega no catálogo de categorias (`CourseCategory`) e visualiza a ementa de um curso (`CourseSection` e `SectionLesson`). Para comprar, realiza cadastro.
2. **Checkout:** Adiciona cursos ao carrinho (`CourseCart`), aplica cupons (`CourseCoupon`) e prossegue para pagamento.
3. **Aprendizado (Dashboard/Player):** Após a matrícula (`CourseEnrollment`), o curso entra na lista de ativos. Ao clicar em "Assistir", a tela renderizada pelo `PlayerController` isola o ambiente. O aluno consome vídeo (síncrono ou assíncrono - `ZoomLiveService`), baixa os PDFs (`LessonResource`) e realiza exames/quizzes para fixar o conteúdo.
4. **Conclusão:** O sistema grava no `course_progress` e `watche_histories`. Ao fechar 100%, é emitido o certificado e o aluno é estimulado a preencher uma Avaliação (`CourseReview`).

## 2. Fluxo do Instrutor (Instructor Flow)
O instrutor atua como produtor de conteúdo e parceiro de negócios da plataforma.
1. **Credenciamento:** Um usuário comum solicita *upgrade* para perfil de Instrutor (`Instructor`).
2. **Criação de Conteúdo:** Via painel, ele estrutura o curso. A hierarquia obriga a criação do Curso -> Seções -> Lições (Vídeo, Texto, Quizzes). Ele envia a ementa para publicação.
3. **Gestão e Interação:** O instrutor acompanha as matrículas de suas turmas e pode interagir respondendo fóruns (`CourseForumReply`) atrelados aos seus cursos.
4. **Monetização:** O instrutor possui uma carteira virtual ("Wallet"). Conforme a plataforma processa pagamentos dos alunos (deduzindo a taxa da administração), o montante é alocado no saldo do instrutor. Ele então emite uma solicitação de Saque (`payout_histories`), informando seus dados bancários ou PayPal.

## 3. Fluxo do Administrador (Admin Flow)
O Administrador ("Super Admin") gerencia a infraestrutura, a qualidade educacional e as finanças.
1. **Controle de Catálogo:** Cria Categorias Globais, gerencia quais cursos estão públicos ou bloqueados, e modera *Reviews* ofensivos.
2. **Configurações Gerais:** Gerencia o layout do Front-end (`pages`, `navbars`, `footers`) e as chaves de API (`SettingsController` - SMTP, Credenciais S3, Chaves de Pagamento).
3. **Aprovação de Parceiros:** Avalia perfis de candidatos a instrutores e autoriza as submissões de cursos novos.
4. **Operacional e Financeiro:** O admin é quem realiza o pagamento dos "Payouts" solicitados pelos instrutores e configura a taxa de comissão da plataforma. Ele também administra os Módulos do sistema.

## 4. Fluxo dos Pagamentos (Payment Flow)
A transação financeira une Alunos, Plataforma e Gateways.
1. O aluno acessa a etapa de Checkout (Controller `PaymentController` base + `PaymentGatewaysServiceProvider`).
2. Uma requisição de intenção (API ou Frontend) direciona aos Gateways através de serviços dedicados (Stripe, PayPal, Paystack, Razorpay).
3. O pagamento não autoriza o curso imediatamente. O aluno é redirecionado via *callback*, ou o Gateway envia um *Webhook* / IPN (Instant Payment Notification).
4. O backend verifica no servidor oficial da adquirente (ex: `api.paystack.co`) se a transação é real (`PaymentService`).
5. Se aprovada, cria o registro na tabela `payment_histories` e gera a matrícula em `course_enrollments`, ativando o aluno e repartindo os lucros virtuais ao Instrutor correspondente.

## 5. Fluxo dos Certificados (Certificate Flow)
Processo de recompensa técnica ao concluir 100% da trilha.
1. O *Player* do aluno alcança a última aula.
2. O sistema verifica a tabela `course_progress` para confirmar as assistências completas e aprovação em `quiz_submissions`.
3. O Módulo Independente `Certificate` intercepta o status final.
4. O `CertificateServiceProvider` usa um layout HTML pré-formatado e mescla variáveis: `{Nome do Aluno}`, `{Nome do Curso}`, `{Data}`, `{Carga Horária}`, gerando uma string unificada.
5. A biblioteca auxiliar (`dompdf`) converte esse HTML em um arquivo binário `.pdf` seguro, salvando um link definitivo na tabela `course_certificates`.

---

## 6. Modularidade: Quais módulos podem ser removidos sem quebrar o sistema?

O Mentor LMS adota a arquitetura HMVC (Hierarchical Model-View-Controller) suportada por `nwidart/laravel-modules`. Isto significa que certos blocos são completamente "Plug-and-Play".

Você pode **remover com total segurança** os seguintes módulos (basta desativar no arquivo `modules_statuses.json` e remover as pastas) sem quebrar o "Core" (Student/Instructor/Admin):

1. **`Installer`**
   - **Pode remover?** SIM.
   - **Motivo:** O *Installer* serve exclusivamente para guiar a instalação "Next-Next-Finish" configurando banco de dados e arquivos `.env` para usuários leigos. Uma vez em produção, ele não apenas pode, como **deve** ser removido ou desativado por questões de segurança.
   
2. **`Updater`**
   - **Pode remover?** SIM.
   - **Motivo:** Lida com atualização da codebase subindo arquivos ZIP. Se você utiliza GIT / CI/CD (GitHub Actions, Forge, Envoyer) no servidor para gerenciar as versões, o *Updater* se torna inútil e removê-lo é altamente aconselhável.

3. **`Blog`**
   - **Pode remover?** SIM.
   - **Motivo:** É uma funcionalidade paralela apenas para SEO e atração de tráfego (Marketing Content). O LMS operará 100% sem o blog.

4. **`Language`**
   - **Pode remover?** SIM (Com ressalvas pontuais).
   - **Motivo:** Módulo construído para criar traduções dinâmicas pelo banco de dados via interface do admin. Se o seu LMS opera em apenas uma língua ou se você prefere usar arquivos `.php` ou `.json` estáticos padrão da pasta `lang/` do Laravel, a deleção deste módulo remove peso da base.

### Módulos Sensíveis (Não remova diretamente)
- **`PaymentGateways`:** Embora modularizado, as rotas de carrinho e checkout aguardam retornos dos *Providers* encapsulados aqui. Remover o módulo sem limpar as *Views* de "Checkout" resultará em *Route Not Found* na hora de comprar o curso.
- **`Certificate` e `Exam`:** A deleção exige cuidado. O fluxo do Aluno (`course_progress`) pode acionar *endpoints* para requerer o certificado e processar *Assignments* (Provas Discursivas). Requer refatoração nas views do *Course Player* para não expor os botões mortos.
