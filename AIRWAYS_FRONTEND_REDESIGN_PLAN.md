# Plano de redesign do front público — Airways Academy

## 1. Princípios da nova direção

- Escola de aviação premium e consolidada; nunca vitrine de instrutores independentes.
- Predomínio de `#F8FAFC`, branco e `#1E293B`; `#FD122E` somente em CTA, foco, marcador e pequenos acentos.
- Imagens aeronáuticas amplas, autênticas e com propósito; evitar banco de imagens genérico de e-learning.
- Tipografia forte, títulos grandes, texto editorial curto e muito espaço em branco.
- Blocos assimétricos e cinematográficos, mas navegação e conversão diretas.
- Ícones lineares; sem neon, gradientes fortes ou estética startup.
- Referência Airbus apenas em princípios corporativos: propósito claro, mídia de escala, storytelling editorial, missões e conteúdo em camadas. Composição, identidade e texto devem ser próprios da Airways.

## 2. Fundação visual proposta

Criar, em sprint aprovada, uma camada `public-v2` ou equivalente com tokens e componentes próprios, sem modificar contratos de backend:

- Tokens semânticos: `airways-red`, `ink`, `surface`, `surface-muted`, `border`, escala de espaços e tipografia.
- Primitivos: `PublicContainer`, `Eyebrow`, `EditorialHeading`, `MediaFrame`, `TextLinkArrow`, `InstitutionalCTA`, `MetricStrip`.
- Composições: `PublicHeader`, `PublicFooter`, `AviationHero`, `EditorialSplit`, `ProgramCard`, `StoryCard`, `TrustBand`.
- Estado de rollout por página/variante, permitindo coexistência com layout legado.

## 3. Nova estrutura visual da Home

Ordem recomendada, mapeada sobre slugs já existentes sempre que possível:

1. **Header corporativo** — logo, Cursos, Sobre, Blog, Contato; CTA “Conheça os cursos” ou “Inscreva-se”; login secundário. Menu e URLs continuam no banco.
2. **Hero aeronáutico** — imagem ou vídeo amplo, headline de posicionamento, texto curto e até dois CTAs. Conteúdo e mídia no builder.
3. **Faixa de confiança** — métricas verificáveis: alunos formados, horas de instrução, anos de experiência, índices relevantes. Reaproveita `overview`/`statistics`.
4. **Formações em destaque** — 3–6 programas com cards grandes, pouca metadata e CTA claro. Reaproveita `top_courses`.
5. **Por que Airways** — segurança, tecnologia, metodologia, corpo técnico e suporte. Pode mapear `features` ou `overview`.
6. **Experiência de formação** — bloco editorial com imagem ampla de simulador, cockpit, sala ou operação; texto institucional editável.
7. **Trilhas/categorias** — categorias como caminhos de carreira, não taxonomia de marketplace. Reaproveita `top_categories`.
8. **Autoridade e estrutura** — certificações, parceiros e infraestrutura; reaproveita `partners` com critérios de uso de marca.
9. **Histórias/resultados** — depoimentos reais com consentimento e contexto, sem estrelas de marketplace.
10. **Conteúdo editorial** — 3 posts recentes sobre carreira, segurança, tecnologia e formação; reaproveita `blogs`.
11. **CTA final** — orientação de matrícula/contato, não desconto genérico. Reaproveita `call_to_action`.
12. **Footer institucional** — contato, endereço, navegação, políticas e redes; meios de pagamento discretos ou no checkout.

Não tentar adaptar as cinco Homes simultaneamente. Escolher uma variante canônica após confirmar a ativa; manter as demais disponíveis como legado até decisão posterior.

## 4. Nova página de cursos

1. Hero curto “Formações Airways” com introdução e imagem editorial opcional.
2. Navegação por trilhas/categorias em chips ou tabs horizontais.
3. Busca e filtros em barra compacta; filtros avançados em drawer no mobile/desktop, preservando todos os query params atuais.
4. Grid de `ProgramCard` com imagem ampla, título, resumo, modalidade/duração/nível e CTA. Preço existe, mas não domina o card.
5. Indicadores de resultado/certificação somente quando verdadeiros e alimentados pelo curso.
6. Paginação existente preservada.
7. CTA de orientação ao final: “Não sabe qual formação escolher?” para contato/atendimento.

Wishlist, rating, matrículas e descontos permanecem funcionais. Podem ser visualmente secundários e condicionados a contexto/autenticação, nunca removidos sem nova aprovação.

## 5. Nova página de detalhe do curso

1. **Hero do programa** — breadcrumb, categoria, título, resumo, imagem/vídeo e CTA de matrícula.
2. **Resumo operacional** — modalidade, duração, nível, idioma, certificado e acesso; dados existentes.
3. **Barra de conversão** — preço/condição e botão que usa exatamente as ações atuais de matrícula/carrinho/player.
4. **Visão geral** — descrição rica do curso.
5. **Para quem é / pré-requisitos / resultados** — reutiliza requirements e outcomes.
6. **Programa do curso** — currículo em accordion, preservando aulas, quizzes e estados.
7. **Metodologia e experiência Airways** — conteúdo institucional editável, inicialmente por campos existentes ou bloco complementar compatível.
8. **FAQ** — relações atuais do curso.
9. **Prova social** — reviews em seção secundária, não como selo de marketplace.
10. **Cursos relacionados** — somente se já houver dados/consulta disponível; não criar regra de recomendação nesta etapa.

O vínculo público de instrutor deve ser condicionado de forma consistente ao modo escola. Como isso toca apresentação e potencial null-safety, implementar sem mudar a modelagem: no modo escolar, usar “Equipe de instrução Airways” ou ocultar o link individual, mantendo os dados e o tab legado disponíveis.

## 6. Nova estrutura do Blog

### Listagem

1. Hero editorial “Conteúdo Airways”.
2. Post principal em formato feature.
3. Categorias como navegação horizontal.
4. Grid editorial com imagem, categoria, título, resumo, data e tempo de leitura quando disponível.
5. Busca/filtro em drawer ou barra discreta; preservar queries atuais.
6. CTA institucional contextual no final.

### Post

1. Categoria, título, subtítulo, autor/data e hero image.
2. Corpo com largura de leitura, tipografia e mídia cuidadas.
3. Compartilhamento discreto; like/dislike não deve dominar.
4. Comentários preservados, com convite a login quando necessário.
5. Posts relacionados e CTA para cursos somente com dados já disponíveis ou consulta aprovada futuramente.

## 7. Páginas institucionais

### Sobre Nós

- Hero de posicionamento.
- História/propósito.
- Pilares: segurança, tecnologia, profissionalismo e excelência.
- Estrutura/metodologia.
- Números verificáveis.
- Equipe ou corpo técnico em linguagem institucional.
- CTA para cursos/contato.

### Contato

- Hero curto, canais de atendimento, endereço/mapa quando disponível, horários e CTA.
- Se não existe formulário backend, não inventar envio nesta etapa; usar canais configuráveis no painel.

### Políticas e termos

- Header compacto com título, data de atualização se o modelo suportar, índice local gerado no cliente e corpo Tiptap com largura de leitura.
- Não alterar conteúdo jurídico automaticamente; painel continua como fonte.

### Login e cadastro

- Composição dividida: formulário limpo + imagem/manifesto curto da Airways.
- Manter campos, erros, reCAPTCHA, Google OAuth, recuperação de senha e destinos das rotas.

### Checkout

- Layout focado, com progresso simples, resumo do curso, confiança e meios de pagamento.
- Preservar cálculo, cupom, impostos, autenticação, callbacks e gateways.
- Antes do redesign, restaurar/validar o CTA funcional hoje substituído por “Test”, em tarefa separada e aprovada.

## 8. Preservação do builder existente

### Contrato que não deve mudar

- Slugs de página e seção.
- IDs, `active`, `sort`, `title`, `description`, imagens, `properties`, `contents` e `content_limit`.
- Endpoints `page.section.update` e `page.section.sort`.
- `SectionEditor`, upload de mídia e seleção de cursos/categorias/posts.
- Props fornecidas por `PageService`.

### Estratégia de compatibilidade

1. Criar um registry visual por slug: o mesmo `PageSection` escolhe renderer Airways ou legado.
2. Adaptadores transformam dados existentes em props do novo componente, sem mudar banco.
3. Campos ausentes recebem fallback visual seguro; conteúdo não é inventado.
4. Editor continua envolvendo a seção com `Section`, inclusive no novo layout.
5. Preview/customize e ordenação são testes obrigatórios em cada seção migrada.
6. Novos campos editoriais, se indispensáveis no futuro, exigem etapa posterior com aprovação de backend/migration; não fazem parte deste redesign inicial.

## 9. Como aceitar futuras instruções sem quebrar funcionalidades

- Separar componentes de **comportamento** (matrícula, carrinho, filtro, paginação, auth) de componentes de **apresentação**.
- Criar contratos TypeScript explícitos para cada seção e página.
- Centralizar tokens e variantes; não espalhar hex, tamanhos e estilos por dezenas de TSX.
- Usar slots/composição para hero, cards, meta e CTA, evitando forks por página.
- Manter componentes legados durante rollout; trocar imports/registry por feature flag local.
- Criar catálogo interno dos estados: vazio, loading, erro, gratuito, pago, desconto, matriculado, não autenticado.
- Testes de rota e ação para links, filtros, carrinho, matrícula, login, cadastro e checkout.
- Checklist de conteúdo para indicar claramente “painel” versus “código”.
- Registrar decisões em um mapa `slug → renderer → campos consumidos`.

## 10. Ordem segura de implementação em sprints

### Sprint 0 — baseline e conteúdo

- Exportar dados reais do builder/menu/footer/settings.
- Screenshots de todas as páginas e estados críticos.
- Confirmar Home ativa e papel de exames/instrutores/vagas/newsletter.
- Validar fluxo completo de compra e registrar o defeito “Test”.
- Definir fontes licenciadas, biblioteca de imagens e conteúdo Airways real.

**Saída:** baseline aprovado, sem alteração visual.

### Sprint 1 — design system e casca pública

- Tokens, tipografia, containers e primitivas.
- Novo header/footer consumindo os mesmos dados.
- Responsividade, acessibilidade, foco e contraste.
- Rollout protegido com fallback legado.

**Regressão:** todas as rotas públicas, menu mobile, auth states, admin customize.

### Sprint 2 — Home canônica

- Hero, métricas, programas, diferenciais, parceiros, histórias, blog e CTA.
- Adaptadores do builder e edição inline.
- Não migrar as cinco variantes; apenas a ativa/aprovada.

**Regressão:** ativar/desativar, reordenar, editar texto/imagem e selecionar conteúdos.

### Sprint 3 — catálogo de cursos

- Hero, trilhas, filtros responsivos, grid/lista e `ProgramCard`.
- Preservar URLs, queries, paginação e wishlist.

**Regressão:** categorias, subcategorias, filtros combinados, vazio e mobile.

### Sprint 4 — detalhe do curso

- Hero, resumo, conversão, conteúdo, currículo, FAQ e reviews.
- Consistência do modo escola para instrutores.

**Regressão:** gratuito/pago, matriculado/não matriculado, preview, carrinho, player e SEO.

### Sprint 5 — Blog e institucionais

- Listagem/post, Sobre, Contato, Equipe e páginas legais.
- Preservar Tiptap, comentários e social conforme flags.

**Regressão:** slugs curinga, conteúdo longo, mídia, links e estados sem seções.

### Sprint 6 — Auth, carrinho e checkout

- Novo AuthLayout, carrinho e UI de pagamento.
- Resolver primeiro o CTA “Test” com validação funcional e autorização específica.

**Regressão:** login, cadastro, Google, reCAPTCHA, recuperação, cupom, imposto e todos os gateways ativos.

### Sprint 7 — endurecimento e rollout

- Performance de mídia, Core Web Vitals, SEO/schema, acessibilidade WCAG, analytics e QA cross-browser.
- Remover apenas referências visuais legadas comprovadamente sem uso; não apagar funcionalidades.
- Rollout gradual e plano de rollback por página.

## 11. Critérios de aceite globais

- Nenhuma rota, payload, regra de negócio ou migration alterada no escopo visual.
- Builder continua editando, ordenando e ativando as seções migradas.
- Curso, carrinho, matrícula, auth, blog e checkout mantêm comportamento.
- Navegação por teclado, contraste, alt text e mobile validados.
- Nenhuma ocorrência pública visível de Mentor, UI Lib ou conteúdo demo.
- Vermelho `#FD122E` usado apenas como destaque; branco/cinza predominantes.
- A página comunica formação aeronáutica, segurança e autoridade antes de preço e avaliação.

## 12. Aprovação necessária

Este documento é somente planejamento. A implementação visual deve começar apenas após aprovação explícita, idealmente com confirmação da Home ativa, prioridade das páginas e papel público de exames/instrutores.
