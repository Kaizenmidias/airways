# Roadmap de Transição: Mentor LMS (Marketplace) para Airways Academy (Escola Própria)

Este documento detalha o plano estratégico de adaptação do sistema, transformando um modelo *Marketplace* (onde múltiplos criadores vendem cursos e dividem lucros) em um modelo de *Escola Exclusiva* (onde a Airways Academy detém 100% do conteúdo, faturamento e os instrutores atuam apenas como professores).

Nenhuma tabela será removida nesta fase primária para garantir a integridade do banco de dados existente. A estratégia será baseada em **Ocultação UI/UX**, **Adaptação de Lógica** e **Isolamento de Domínio**.

---

## 1. Funcionalidades que Devem Ser Ocultadas (Fase 1: UI/UX)
Para remover a percepção de "Marketplace" do usuário final, as seguintes funcionalidades devem sumir imediatamente do Front-end:

- **"Become an Instructor" (Seja um Instrutor):** Remover links no cabeçalho (Navbar), rodapé (Footer) e páginas institucionais que convidam usuários a criar perfil de vendas.
- **Registro Público de Instrutores:** Desativar a rota/formulário de cadastro autônomo de instrutores (`/instructor/register`). Novos professores serão adicionados manualmente pelo Administrador.
- **Módulo de Saques (Payouts):** Ocultar os menus "Payouts", "Withdrawals" e "Earnings" do painel do Instrutor.
- **Widgets Financeiros:** Ocultar gráficos de vendas e saldo em carteira do *Dashboard* do Instrutor. O professor não deve ver faturamento da escola, apenas métricas educacionais.
- **Listagem de Autores Crossover:** Remover blocos de "Top Instrutores" da página inicial que dão aspecto de plataforma aberta (focar em blocos de "Cursos Airways" ou "Nossos Especialistas").

## 2. Funcionalidades que Devem Ser Reaproveitadas (Fase 2: Core LMS)
A essência do aprendizado permanece inalterada e será o motor da Airways Academy:

- **Catálogo e Carrinho:** Toda a lógica de navegação, categorias, cupons de desconto (`course_coupons`) e carrinho de compras (`course_carts`).
- **Reprodutor de Curso (Player):** O consumo de vídeo, PDFs, quizzes e controle de progresso continua idêntico.
- **Gateways de Pagamento:** Stripe, PayPal, etc., agora direcionando 100% da receita para as chaves API globais do Administrador (Escola).
- **Certificados:** A emissão automática em PDF permanece, sendo apenas refatorada esteticamente para a identidade corporativa da Airways.
- **Fóruns e Reviews:** Fóruns internos de dúvidas e avaliações de estrelas continuarão a fomentar o engajamento estudantil interno.

## 3. Funcionalidades que Devem Ser Adaptadas (Fase 3: Fluxos e Permissões)
Mudanças no comportamento de regras de negócios:

- **Papel do Instrutor -> Professor Contratado:** O `Instructor` no banco de dados agora atua como um funcionário. Ele ganha permissão apenas para gerenciar as ementas, corrigir provas e responder dúvidas dos seus alunos alocados.
- **Forçar Comissão 100% para o Admin:** Se houver lógicas baseadas em cálculo de taxa de plataforma (ex: 80% instrutor, 20% admin), nas configurações de Settings do sistema (`SettingController`), a taxa do admin deve ser fixada silenciosamente em 100%, para que toda entrada de dinheiro vá para a escola e o saldo do instrutor fique zerado/ignorado.
- **Páginas de Venda do Curso:** Adaptar os selos de autoria. Em vez de *"Vendido por Instrutor X"*, mudar para *"Professor Especialista: X"*. A venda é sempre atribuída à *Airways Academy*.
- **Criação de Cursos Centralizada:** Todo novo curso preferencialmente será rascunhado pelo Administrador master e então atribuído a um professor para preencher o currículo, impedindo publicação autônoma indiscriminada.

## 4. Funcionalidades que Podem Ser Removidas Futuramente (Fase 4: Limpeza Técnica)
Após a estabilização da Fase 3, e assegurando que nenhum serviço secundário quebrou, o código morto poderá ser desidratado gradualmente:

- **Tabelas de Payout:** Exclusão da tabela `payout_histories` e remoção de Models correspondentes.
- **Lógica de Comissionamento:** Remoção do cálculo de `Admin Tax` e divisão de lucros dentro do `PaymentService` / `CourseEnrollmentService`.
- **Rotas de Saque:** Deleção dos arquivos `PayoutController`, requests de validação bancária de instrutor e *Views* React/Blade associadas a pagamentos a terceiros.
- **Campos de Banco Financeiro do Instrutor:** Remoção das colunas da tabela `instructors` referentes a chaves Stripe, contas PayPal pessoais e saldos.

---

## ROADMAP SEGURO DE IMPLEMENTAÇÃO

Abaixo as etapas de desenvolvimento em ordem sequencial para garantir que nada quebre (Safe Deployment):

1. **Sprint 1: Brand e Frontend (Sem impacto em lógica)**
   - Trocar logo e paleta de cores.
   - Deletar botões `Seja um Instrutor` dos menus e landing pages.
   - Esconder a view de saldo (`Earnings`) e (`Payouts`) no React/Inertia do instrutor.
   - Fechar rotas POST/GET de cadastro de instrutores soltos.
2. **Sprint 2: Mock de Comissões e Perfil**
   - Alterar no banco/configurações a fatia do Administrador para `100%`.
   - Modificar os textos de front-end: `Instructor` vira `Professor Airways`.
3. **Sprint 3: Teste End-to-End**
   - Simularemos o Admin criando um curso e atribuindo ao Professor A.
   - Simularemos o Aluno B comprando.
   - Validaremos se o valor de checkout correu limpo pelo Gateway e se o Professor A consegue ver a compra, responder a dúvida, mas sem ter um painel de dinheiro aberto.
4. **Sprint 4: Consolidação e Limpeza Técnica (Avançado)**
   - Deletar de fato os Controllers de Payout e expurgar as tabelas (Fase 4 detalhada acima).
