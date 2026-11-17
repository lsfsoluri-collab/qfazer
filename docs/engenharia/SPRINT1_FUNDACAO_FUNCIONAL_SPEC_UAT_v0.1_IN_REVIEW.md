# Qfazer — Sprint 1 | Fundação funcional — SPEC + UAT
**Versão:** 0.1 · **Data:** 17/11/2026 · **Fase:** G6 futura · **Status:** IN_REVIEW / NÃO INICIADA
**PO e revisora de negócio:** Luana · **Executor técnico previsto:** agente de IA de desenvolvimento · **Revisor de especificações/código:** assistente coordenador, independente do agente executor quando este for autor do artefato. **Revisão ainda NÃO EXECUTADA.**
**Origem:** Manual de marca v2, baseline REV7 aprovada, DEC-UX-02, decisão de 2 protótipos, checklist visual e parecer G5.

## Objetivo e exclusões
**Objetivo:** entregar uma **versão navegável, responsiva e instalável como PWA** sob nova marca Qfazer, em ambiente isolado, sem publicar informações fictícias como reais, sem perturbar o Protótipo 1.

**Incluído:** estruturar o projeto, recursos gráficos permitidos, 4 abas, componentes visuais-base, shell da aplicação, manifesto e service worker de base, instalação e estados vazios/demonstração claramente rotulados, testes e evidências.  
**Excluído:** catálogo real público, recomendações de IA funcionais, envio efetivo de push, banco/cron, checkout/reserva, login/perfil, migração de respostas de formulários, deploy público e DNS. Web Push será arquitetado no G5 e implementado em Sprint posterior; a Sprint 1 não pode alegar esse comportamento.

## Dependências e pré-condições
1. Aprovação G5, revisão técnica independente e autorização da PO para Sprint 1; desenvolver somente em branch isolada, com dados sintéticos.
2. Acesso autorizado aos arquivos master aprovados de marca; **não compartilhar nem adicionar arquivos de fontes sem confirmar licença** (Garet). Montserrat possui OFL; não incluir Fira Sans Condensed na interface.
3. Determinação da organização de arquivos/build e do provedor *sem* colocar arquivos internos no diretório servido.
4. Configuração de testes que não disparem Functions, Forms ou chaves reais do site antigo.

## Requisitos rastreáveis
| REQ | BR | SPEC | UAT | Critério |
|---|---|---|---|---|
| REQ-S1-01 | BR-S1-01: novo projeto independente | SPEC-S1-01: build público separado dos documentos e Functions; sem artefatos internos | UAT-S1-01, 02 | Protótipo 1 permanece inalterado; preview isolado |
| REQ-S1-02 | BR-S1-02: marca oficial Qfazer | SPEC-S1-02: cores `#0B0B0B`, `#F7F5EE`, `#D7FF46`, Montserrat em títulos, Garet na interface quando licenciado; logos aprovados preservados | UAT-S1-03, 04 | sem marca antiga em cabeçalhos, cores e estados básicos |
| REQ-UX-NAV-01 | BR-UX-NAV-01: 4 destinos | SPEC-UX-NAV-01: Início, Salvos, Buscar, Chat nesta ordem; sem Perfil | UAT-UX-NAV-01..04 | navegação por toque/teclado, foco e estado ativo |
| REQ-S1-03 | BR-S1-03: PWA instalável | SPEC-S1-03: manifest correto, icons adequados, service worker registrado de modo seguro, shell offline sem dados falsos | UAT-S1-05, 06 | instalação em dispositivos compatíveis; fallback offline honesto |
| REQ-S1-04 | BR-S1-04: sem eventos fictícios apresentados como verdade | SPEC-S1-04: não expor catálogo legado; vazio instruído ou simulação sinalizada sem CTA oficial falso; sem reuso de dados internos | UAT-S1-07, 08 | nenhuma oferta/evento/canal oficial fictício se passando por real |
| REQ-S1-05 | BR-S1-05: responsividade e acessibilidade | SPEC-S1-05: viewport mobile, foco visível, labels, contraste testado e áreas de toque ~44px | UAT-S1-09, 10 | jornada navegável sem sobreposições em mobile/desktop |
| REQ-S1-06 | BR-S1-06: fluxos não implementados não simulam sucesso | SPEC-S1-06: estados claros de indisponível, sem push fake, sem IA fake, sem chat que sugira sessão inexistente | UAT-S1-11, 12 | usuário percebe limitações, sem dados enganosos |

## Estrutura técnica candidata para o executor
```
repo raiz:
  docs/                # documentação, fora do build
  src/                 # UI, lógica de navegação, estados
  public/assets/       # somente assets cuja publicação está autorizada
  netlify/functions/    # funções server-side, fora do publish
  dist/                # output publicável exclusivo, gerado por build
  netlify.toml         # publish=dist e functions fora de dist; confirmar stack
  tests/               # testes automatizados sem acesso a dados reais
```
Pode ser implementação HTML/CSS/JS modular, framework leve ou abordagem equivalente; **não adicionar framework pesado sem justificativa de negócio**. Não reaproveitar a antiga pasta `publish = "."` de forma insegura.

## Sequência técnica autorizável após gate
- **S1-T01** inventariar PR #1 e marcar componentes do legado reaproveitáveis; manter originais rastreáveis em commit.
- **S1-T02** criar estrutura de build e pacote de testes, com artefatos públicos isolados; não copiar dados internos.
- **S1-T03** preparar kit de marca e PWA a partir de masters autorizados; testar qualidade 16/32/192/512px, opacidade e maskable; licença Garet antes de redistribuição.
- **S1-T04** aplicar design tokens e componentes de layout; revisar fontes, contrastes, feedbacks/estados.
- **S1-T05** implementar navegação de 4 abas e estado de rota/voltar, inclusive teclado e leitor de tela.
- **S1-T06** preparar páginas/superfícies e empty states de Início, Salvos, Buscar e Chat; nenhum fluxo comunica dado falso ou função ainda indisponível como ativa.
- **S1-T07** criar `manifest.webmanifest` e service worker mínimo com cache apenas do shell autorizado, sem cache de respostas com dados pessoais, feeds sem permissão ou endpoints privados; estratégia de atualização/reversão.
- **S1-T08** revisar `guia.mjs` legado e resolver conflito de pasta Functions **sem publicar chave ou ativar IA**; backend desativado/sinalizado até Sprint específica.
- **S1-T09** rodar build/checks e UAT com screenshots mobile/desktop; recolher evidências e parecer de revisão independente; PR separado ou commits rastreáveis.
- **S1-T10** checkpoint de PO: aprovar apenas versão/escopo comprovados; sem deploy aberto nem merge sem gate apropriado.

## UAT detalhados (todos NOT_RUN)
| ID | Dado / Quando | Então (resultado esperado) | Evidência |
|---|---|---|---|
| UAT-S1-01 | Dado o ambiente do Protótipo 1, quando desenvolver no repositório novo | O site antigo segue na mesma URL e não muda o Form nem a coleta | comparação de URL e fluxo do Form (sem enviar respostas reais sem autorização) |
| UAT-S1-02 | Dada build pública do Protótipo 2, quando revisar arquivos servidos | Não há documentos internos, secrets, bases privadas, respostas de Form ou fontes sem licença | manifesto de build + inspeção |
| UAT-S1-03 | Dadas telas home e outras, quando inspecionar identidade | Logotipos aprovados, cores oficiais e roles tipográficos corretos | screenshots e CSS |
| UAT-S1-04 | Dadas imagens e ícones, quando instalar/abrir | Ícones legíveis, sem distorção nem assets quebrados | teste visual em dispositivos e network |
| UAT-S1-05 | Dado Android/navegador compatível, quando instalar PWA | Nome/ícone corretos, navegação abre em standalone | captura de instalação e launch |
| UAT-S1-06 | Dada falta de rede, quando abrir shell previamente instalado | Estado offline verdadeiro, sem lista de eventos obsoleta fingindo atualidade | vídeo/captura offline |
| UAT-S1-07 | Dadas telas de busca e Início, quando não houver fonte pública liberada | Não exibe eventos fictícios como reais; apresenta estado vazio/limitação | captura + teste de fonte de dados |
| UAT-S1-08 | Dado convite para evento, quando procurar CTA | Nenhum CTA afirma reserva interna ou link fictício | inspeção de todos os cards e links |
| UAT-S1-09 | Dado viewport 360px, quando navegar | Nenhum item essencial oculto; 4 abas e toque acessíveis | captura e roteiro |
| UAT-S1-10 | Dado desktop, quando navegar por teclado | Foco identificável, labels e rotas utilizáveis | vídeo/registro manual |
| UAT-S1-11 | Dado Chat sem backend aprovado, quando acessar | UI comunica indisponibilidade sem gerar eventos ou respostas programadas como IA real | captura negativa |
| UAT-S1-12 | Dado Push não implementado na Sprint 1, quando acessar Salvos | Nenhuma notificação fictícia nem promessa falsa de envio real | captura e inspeção do código |

**Condição de aceite Sprint 1:** versão em branch isolada navegável em desktop/mobile, fidelidade à identidade e quatro abas, manifesto/service worker de base, evidências dos 12 cenários, sem segredos/dados internos, revisão independente, nenhuma falha crítica. Não implica liberação de IA, push ou catálogo.

## Rollback da Sprint 1
- Não alterar site antigo nem domínio; conservar commit e branch de referência.
- Reverter commit da implementação isolada e, se houver preview autorizado, voltar ao deploy de preview anterior; limpar/atualizar cache do service worker para evitar shell antigo persistente.
- Se assets/fontes não forem autorizados, remover do pacote público antes de qualquer publicação.
- Não há migração de banco ou dados reais prevista na Sprint 1.

## Riscos / OPEN_QUESTIONS
- G5 ainda não aprovado e arquitetura/hospedagem não escolhidas.
- Revisores designados: Luana (negócio) e assistente coordenador (artefatos do agente executor). Parecer independente sobre a ADR do executor e revisão do código ainda NOT_RUN.
- Licença da Garet para redistribuição web/repo público.
- Formato final das pranchas editáveis e ícones individuais; PNG pode ser suficiente para MVP, sujeito à inspeção.
- Fonte pública de sessões e catálogo publicável pertencem às Sprints posteriores.
- Validação de acessibilidade, escopo do service worker e iOS/Android em dispositivos reais pertence à execução de G6/G7.

**Gate:** pronta para revisão/aceite após G5; nenhuma afirmação de implementação, teste, merge ou deploy.

## Controle de entrada em G6 / atualização 17-11-2026
Abrir Sprint 1 somente após G5 com ADR do executor, parecer do assistente sobre o documento de outro autor e aprovação explícita da PO. Registro de trabalho: [Issue #3](https://github.com/lsfsoluri-collab/qfazer/issues/3). Até esse momento, backlog **especificado mas bloqueado**, sem código ou QA executados por esse registro.
