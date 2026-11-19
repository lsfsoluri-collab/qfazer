# Qfazer P2 — Justificativa editorial por evento (SPEC-EDIT-01)
**Versão:** 0.1 · **Data:** 18/11/2026 · **Estado:** IN_REVIEW · **Gate:** G4/G6, UAT G7 pendente

## Objetivo e decisão de negócio
A PO solicitou que a ficha de detalhe, já aprovada visualmente (caixa **Por que vale a pena?**), tenha textos curtos que expliquem **por que considerar cada evento**, usando somente atributos verificados no catálogo, sem clichês nem promessas inventadas. O layout existente de quatro abas e a hierarquia da ficha não serão alterados. A redação foi autorizada; a aprovação editorial para publicação **não** foi concedida por essa autorização.

## Fonte e escopo
- Fonte operacional única: Google Sheets privado **Qfazer | Catálogo central de eventos — Gestão interna**, aba `CURADORIA`.
- Campo existente `por_que_vale_a_pena` (coluna AK), vinculado a `event_id`; as diferentes `session_id` do mesmo evento compartilham o texto, sem confundir modalidade/dia.
- Fotografia de 18/11/2026: 240 sessões, 161 IDs de evento, 186 aptas internas, 43 pendentes, 11 não utilizar; `reuso_publico` e `revisao_editorial` permanecem pendentes para todas. 0 publicáveis. A base `BASE_ORIGINAL` não será editada.
- Descrição, categoria, subcategoria, tags e local servem como pistas editoriais; apenas características documentadas fundamentam frases. Não derivar qualidade, exclusividade, segurança, line-up, ambiente ou gratuidade apenas de categorias e tags. Quando não há informação para diferenciar, citar apenas o formato confirmado e solicitar pesquisa complementar.
- Identidade de código de origem: `feat/p2-taxonomia-fotos-scroll`, commit `1b02ac17e88d6faf2218fbf611745fec87691a66`.

## Rastreabilidade
| REQ | BR | SPEC |
|---|---|---|
| REQ-EDIT-01 | BR-EDIT-01: um texto honesto, curto e específico por evento | SPEC-EDIT-01: 45 a 170 caracteres, preferencialmente 12–22 palavras; 1–2 diferenciais confirmados, tom editorial direto; sem fatos inferidos |
| REQ-EDIT-02 | BR-EDIT-02: sessões do mesmo evento não podem contradizer uma à outra | SPEC-EDIT-02: reconciliar pelo `event_id`, não pela ordem da planilha; conservar `session_id` e estados |
| REQ-EDIT-03 | BR-EDIT-03: conteúdo editorial não libera publicação | SPEC-EDIT-03: preencher apenas AK na `CURADORIA`; nunca modificar `revisao_editorial`, `reuso_publico` ou status; exportador mantém três gates |
| REQ-EDIT-04 | BR-EDIT-04: a ficha não pode exibir texto genérico como recomendação | SPEC-EDIT-04: renderizar `item.why` quando existe; na homologação, indicar pendência quando vazio; no público, omitir a caixa vazia |
| REQ-EDIT-05 | BR-EDIT-05: manter a referência visual aprovada | SPEC-EDIT-05: preservar layout, CSS, navegação, CTA e modal; só mudar a condição de conteúdo do quadro já existente |

## Fluxo
`CURADORIA.por_que_vale_a_pena` → snapshot **privado** de homologação por `build-internal-preview.mjs` → `normalizeCuration` → `showDetail`.

Se e somente se os três gates forem liberados e a sessão for futura: `CURADORIA` → `scripts/catalog-pipeline.mjs` → `p2/catalog-public.json` → `normalizeSessions` → `showDetail`.

O snapshot antigo e a projeção pública **não** se atualizam diretamente com a edição da planilha; a sincronização hospedada continua condicionada às credenciais, PR e release.

## UAT antes da implementação
| UAT | Cenário dado/quando/então | Inicial |
|---|---|---|
| UAT-EDIT-01 | Dado o lote privado de 240 sessões, ao gerar nova prévia, as 240 fichas mostram sua justificativa vinculada ao evento certo | NOT_RUN |
| UAT-EDIT-02 | Dadas duas sessões do mesmo evento, ao abrir ambas, o texto é coerente e não cita modalidade exclusiva da outra sessão | NOT_RUN |
| UAT-EDIT-03 | Dado novo evento sem `por_que_vale_a_pena`, a ficha privada marca texto pendente, sem inventá-lo | NOT_RUN |
| UAT-EDIT-04 | Dado catálogo público sem justificativa, a ficha omite a caixa vazia, preservando os demais dados e CTA | NOT_RUN |
| UAT-EDIT-05 | Dado evento com reuso/editorial pendentes, a exportação pública permanece vazia mesmo após preencher o campo editorial | NOT_RUN |
| UAT-EDIT-06 | Dadas 4 abas, filtros, modal e scroll aprovados, a interface mantém aparência e comportamento em mobile/desktop | NOT_RUN |
| UAT-EDIT-07 | Dada justificativa contendo texto externo malicioso, a interface renderiza como texto, sem executar HTML | NOT_RUN |
| UAT-EDIT-08 | Conferir `BASE_ORIGINAL`, status, aprovações e demais colunas: nenhuma alteração por esta tarefa | NOT_RUN |

## Riscos, critérios de revisão e limitações
- Texto é **rascunho para revisão humana** mesmo quando fundamentado nos campos de curadoria. Em particular, títulos de cinema com sinopse insuficiente pedem segunda pesquisa antes de aprovação editorial.
- Não colocar planilha ou snapshots no GitHub público; não deduzir direitos de republicação a partir de endereço oficial.
- Manter autoria/versão e revisão textual por evento; a linha ainda pode estar factualmente pendente e não deve ser recomendada.
- Critério G6: 240/240 preenchidas na CURADORIA, 161/161 eventos únicos, ausência de duplicidade/divergência, código testado em branch isolada.
- Critério G7: PO aprova a linguagem e a experiência de leitura nas fichas. G8/deploy permanece separado.
