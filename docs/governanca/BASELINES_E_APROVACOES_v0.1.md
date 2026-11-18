# Qfazer — Registro de baselines e estado de aprovação
**Versão:** 0.1 · **Estado do registro:** IN_REVIEW · **Data:** 18/11/2026.

| ID | Referência | Estado verificado | Consequência |
|---|---|---|---|
| BL-ENV | `docs/decisoes/DEC_G5_AMBIENTES_PROTOTIPO1_PROTOTIPO2_2026-11-17.md` | APPROVED BY PO (negócio) | P1 permanece intacto; P2 separado |
| BL-NAV | `docs/produto/DEC_NAVEGACAO_MVP_2026-11-17.md` | APPROVED BY PO | Início, Salvos, Buscar, Chat; sem Perfil como aba |
| BL-LAUNCH | `docs/decisoes/DEC_G5_ACESSO_PUBLICO_FEIRA_2026-11-17.md` | APPROVED BY PO (objetivo) | Acesso público pretendido 05/12; não autoriza deploy |
| BL-REPO | `docs/governanca/DEC_REPO_001_2026-11-18.md` | APPROVED BY PO (estrutura) | Aplicação pública + Product Studio privado |
| BL-VISUAL | HTML interno fornecido pela PO em 18/11 (SHA-256 em `INDEX_ARTEFATOS_v0.1.md`) | REFERÊNCIA DESIGNADA PELA PO | Não substituir pelo HTML v0.5; QA pixel/funcional pendente |
| BL-CAT | Planilha CURADORIA; `OPERACAO_CATALOGO_SHEETS.md` | Modelo operacional; publicações NÃO autorizadas | Nenhum registro `APTO_PARA_PILOTO` vira público automaticamente |
| BL-ENG | `ADR_G5_BASELINE_TECNICA_2026-11-17.md` | Proposta, peer review pendente | Não afirmar arquitetura homologada |
| BL-SPEC | `SPEC_INTEGRACAO_CATALOGO_v0.1_IN_REVIEW.md` | IN_REVIEW | Não aprovar implementação por inferência |
| BL-P2 | `feat/p2-taxonomia-fotos-scroll` | Branch técnica, PR 5 draft | Não é release oficial nem conteúdo da main |

## Reconciliação de números
- 17/11: documentação G5 informa **204 registros auditados / 161 aptos / 33 pendentes / 10 rejeitados**.
- 18/11: referência privada traz **240 registros de curadoria / 180 sessões futuras aptas embutidas**.
- São **fotografias com datas/escopos distintos**, não substituir retrospectivamente uma pela outra.
- Ambos os estados indicam que **nenhuma sessão foi formalmente liberada para publicação pública**.
- O catálogo atual, contagem e disponibilidade precisam ser consultados no Sheets e revalidados antes de qualquer release.

## Regras de avanço
Aprovação de design não aprova comportamento técnico. Aprovação de conteúdo para testes não libera direitos de republicação. Resultado de teste histórico não é UAT atual. Nenhuma aprovação de documentação autoriza contratação, acesso, deploy ou alteração de DNS.

## Atualização de fotografia: 18/11/2026
A consulta **direta** à CURADORIA confirmou **240 IDs únicos: 186 APTO_PARA_PILOTO, 43 PENDENTE_VERIFICACAO, 11 NAO_UTILIZAR**. Todos os 240 têm `reuso_publico=PENDENTE_REVISAO` e `revisao_editorial=PENDENTE_REVISAO`. **0 publicáveis.**
A referência HTML antiga com 180 sessões embutidas deve ser preservada apenas como baseline **visual**; o snapshot interno v0.6 é separado e não substitui a planilha.
CI de 18/11 para `d8b6e15`: verificação de código e smoke Chromium com conclusão `success` (runs 44412988762 e 44412988770). Isto não é UAT, teste de credenciais ou deploy.
