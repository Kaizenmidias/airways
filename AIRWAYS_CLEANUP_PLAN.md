# Airways Academy - Plano de Limpeza

## Princípios

- Este plano não foi executado.
- Cada fase deve ser aprovada separadamente.
- Não editar migrations históricas; criar migrations novas e reversíveis.
- Fazer backup e medir dados antes de excluir qualquer tabela/coluna.
- Preservar checkout, matrículas, player, provas, certificados e histórico financeiro.
- Tratar `Payment` e `Payout` como domínios diferentes.

## Critérios de aceite globais

Antes e depois de cada fase, validar:

1. Admin cria, edita, publica e vende curso próprio.
2. Novo aluno consegue cadastrar/autenticar conforme jornada definida.
3. Compra aprovada cria `payment_history` e matrícula correta.
4. Aluno acessa player, aulas, recursos, atividades e progresso.
5. Provas, tentativas e resultados funcionam.
6. Certificado é emitido e baixado.
7. E-mails essenciais e notificações funcionam.
8. Dashboard mostra receita e matrículas sem consultas a payout.
9. Nenhum menu aponta para rota removida.
10. Build frontend, testes Laravel e route cache passam.

## Fase 1 - Apenas ocultar itens da interface

**Objetivo:** adequar imediatamente a experiência ao EAD privado com alterações reversíveis, sem remover backend ou dados.

### Configuração

- Fixar `system.sub_type` em `administrative`.
- Ocultar/remover do painel a opção `collaborative`.
- Definir um único autor institucional interno para cursos/provas existentes e novos.

### Sidebar admin

- Ocultar Instructors e seus filhos.
- Ocultar Payout Report.
- Ocultar Job Circulars.
- Ocultar Newsletter e Blog conforme decisão de marketing.
- Manter Payment Settings.

### Aluno e navegação pública

- Ocultar Become Instructor e status de candidatura.
- Ocultar perfis/links públicos de instrutores.
- Ocultar Careers e links de vagas.
- Ocultar Top Instructors/Instructor nas home pages.
- Ocultar Fórum se a decisão for removê-lo.
- Revisar navbar/footer persistidos no banco.

### Dashboard

- Ocultar total de instrutores, saques pendentes, payout history e comparações admin/instructor.
- Exibir receita total Airways, vendas, matrículas, alunos e cursos.

### Entregáveis sugeridos

- Feature flags centralizadas para `instructors`, `jobs`, `payouts`, `forum`, `blog_social` e `newsletter`.
- Menus condicionados pelas flags sem chamar `route()` de módulo desativado.
- Inventário/exportação de page sections e navbar/footer antes da limpeza visual.

### Risco

Baixo, desde que rotas e Models permaneçam. Não desabilitar módulos nesta fase.

## Fase 2 - Desativar funcionalidades

**Objetivo:** impedir acesso direto aos endpoints que a interface já não mostra, mantendo código e dados para rollback.

### Vagas

- Bloquear rotas públicas e administrativas de Job Circulars.
- Remover injeção de vagas em `HomeController::inner_page()`.
- Marcar/despublicar a página Careers e links persistidos.

### Instrutores

- Bloquear `become-instructor.*`, candidatura, aprovação e criação independente.
- Impedir novos usuários com role `instructor`.
- Restringir criação/edição de cursos e provas a admin/equipe interna.
- Manter a entidade técnica de autor enquanto as FKs existirem.

### Payouts e revenue share

- Bloquear rotas de `routes/payout.php` e rotas payout admin/instructor.
- Parar criação de `payout_histories`.
- Fazer novas vendas registrarem 100% da receita para Airways, preservando o valor total e histórico.
- Substituir consultas dinâmicas `SUM({role}_revenue)` por uma métrica explícita de receita.

### Recursos sociais

- Bloquear fórum e respostas, se aprovado.
- Bloquear likes/dislikes e comentários do Blog, mantendo leitura/publicação editorial se desejado.
- Desativar notificações específicas desses fluxos.

### Blog e Newsletter

- Se não forem usados, desabilitar os módulos/endpoints somente depois de remover consumidores de rotas e page sections.
- Se Newsletter permanecer, mover envio em massa para filas e validar consentimento/LGPD.

### Segurança

- Garantir autorização no backend; ocultação React não é controle de acesso.
- Retornar 404/403 consistente para endpoints desativados.
- Adicionar testes que garantam que aluno não acessa dashboard/admin e que instrutor público não pode ser criado.

### Risco

Baixo para vagas; médio para fórum/blog/newsletter; alto para autoria e receita.

## Fase 3 - Remover código morto

**Objetivo:** retirar implementação sem uso depois de um ciclo de produção estável e sem acessos aos endpoints desativados.

### Ordem recomendada

1. Job Circulars/Careers.
2. Payouts de professores.
3. Become Instructor e aprovação.
4. Interações sociais do Blog.
5. Fórum de curso.
6. Blog/Newsletter completos, somente se rejeitados pelo marketing.
7. Multi-instrutor e revenue share, após a refatoração estrutural.

### Limpeza por domínio

Para cada domínio, remover em conjunto:

- Rotas.
- Controllers e Requests.
- Services.
- Notifications/Mails.
- Models e relações.
- Pages/Components React.
- Tipos TypeScript.
- Traduções.
- Imports, eager loads e props Inertia.
- Seeds/page sections/navbar/footer.
- Middleware/aliases sem consumidores.
- Testes antigos e adicionar testes do novo comportamento.

### Refatoração de autoria

Escolher e implementar uma opção antes de remover `Instructor`:

**Opção A - Autor institucional preservado:** manter tabela/relação internamente, renomear conceitos na UI e garantir um único registro Airways. Menor risco e menor esforço, mas mantém dívida técnica.

**Opção B - Autoria por usuário:** adicionar `author_user_id`/`created_by` a cursos e provas, preencher com admin institucional, alterar Services/queries/cards, tornar `instructor_id` nullable, observar produção e depois remover a relação. Arquitetura mais limpa, risco e esforço maiores.

### Refatoração financeira

- Definir campos canônicos: `gross_amount`, `tax_amount`, `discount_amount`, `net_amount` ou equivalentes.
- Migrar relatórios e dashboard.
- Manter invoice, transação, gateway, usuário e item comprado.
- Parar leituras de `admin_revenue`/`instructor_revenue` antes de remover colunas.

### Risco

Médio/alto. Exige testes de regressão e período de observação.

## Fase 4 - Remover tabelas e migrations somente se seguro

**Objetivo:** eliminar dados/estruturas sem consumidores após confirmação em produção.

### Pré-condições obrigatórias

- Backup validado e restauração testada.
- Contagem e exportação dos registros.
- Busca sem referências no código, jobs, filas, logs e integrações.
- Pelo menos um ciclo de produção sem acesso aos endpoints antigos.
- Todas as FKs e relações migradas.
- Aprovação explícita por tabela/coluna.

### Candidatas de baixo risco

- `job_circulars`.
- `blog_like_dislikes` e `blog_comments`, se interações saírem.
- `newsletters` e `subscribes`, se marketing não usar.

### Candidatas de risco médio

- `payout_histories`.
- `course_forums` e `course_forum_replies`.
- `course_wishlists` e `exam_wishlists`, se recurso sair.
- `blogs` e `blog_categories`, se o módulo inteiro sair.
- `instructors.payout_methods`.

### Candidatas de alto risco

- `instructors`.
- `users.instructor_id`.
- `courses.instructor_id`.
- `exams.instructor_id`.
- `payment_histories.admin_revenue`.
- `payment_histories.instructor_revenue`.

Essas estruturas só podem ser removidas depois de migrations de transição e deploys intermediários compatíveis com os dois schemas.

### Estruturas que não devem ser removidas

- `jobs`, `job_batches`, `failed_jobs` apenas por causa da remoção de vagas; são filas Laravel.
- `payment_gateways` e `payment_histories`.
- Cursos, conteúdo, progresso, matrículas, tentativas, certificados e usuários.
- `notifications` enquanto houver notificações essenciais.

### Tratamento de migrations

- Não apagar nem editar migrations já aplicadas.
- Criar migrations novas para drops.
- Separar alterações de alto risco em releases: adicionar novo campo, migrar dados, trocar leituras/escritas, observar, depois remover campo antigo.
- Implementar `down()` apenas quando rollback não causar perda silenciosa; para drops de dados, depender também de backup.

## Decisões necessárias antes da implementação

1. Blog será canal oficial de marketing/SEO?
2. Newsletter e captura de leads serão usadas?
3. Reviews e wishlist permanecem?
4. Fórum será removido ou usado como suporte pedagógico?
5. Aluno pode se cadastrar publicamente ou somente comprar/ser convidado?
6. A equipe interna precisa de perfis além de admin?
7. Autoria será preservada como registro institucional ou migrada para usuário?
8. Live Class será utilizada?
9. Updater/backup pelo painel permanecerá ou o deploy será exclusivamente Git/infra?

## Estratégia de releases sugerida

| Release | Conteúdo | Banco | Rollback |
|---|---|---|---|
| R1 | Feature flags, modo administrativo e menus ocultos | Sem alteração destrutiva | Reativar flags |
| R2 | Endpoints desativados e dashboard simplificado | Sem drops | Reativar rotas/flags |
| R3 | Remoção de Jobs/Payouts/fluxo Become Instructor | Apenas campos novos de transição | Reverter código |
| R4 | Nova autoria e novo modelo de receita | Migração de dados compatível | Leitura dupla/campos antigos |
| R5 | Remoção de código social/marketing aprovado | Sem drops inicialmente | Reverter deploy |
| R6 | Drops finais aprovados | Migrations destrutivas + backup | Restaurar backup/migration avaliada |

## Resultado esperado

Ao fim, a Airways Academy terá dois atores principais (`admin/equipe interna` e `student`), catálogo próprio, checkout e receita integral da empresa, matrículas, entrega pedagógica, provas e certificados, sem superfícies de marketplace, recrutamento ou pagamentos a professores.
