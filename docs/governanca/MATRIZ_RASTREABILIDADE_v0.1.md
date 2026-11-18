# Rastreabilidade inicial — REQ → BR → SPEC → UAT
**Versão:** 0.1 · **Estado:** IN_REVIEW. IDs extraídos de decisões e specs existentes; não representar como testes executados.

| REQ | BR | SPEC | UAT | Evidência / estado |
|---|---|---|---|---|
| REQ-UX-NAV-01 | BR-UX-NAV-01 | SPEC-UX-NAV-01 | UAT-UX-NAV-01 a 04 | `docs/produto/DEC_NAVEGACAO_MVP_2026-11-17.md`; NOT_RUN |
| REQ-ENV-01 | BR-ENV-01 | SPEC-ENV-01 | UAT-ENV-01 | `docs/decisoes/DEC_G5_AMBIENTES_PROTOTIPO1_PROTOTIPO2_2026-11-17.md`; NOT_RUN |
| REQ-ENV-02 | Permissões administrativas aprovadas | SPEC-ENV-02 | UAT-ENV-02 | Mesmo documento; NOT_RUN |
| REQ-LAUNCH-01 | BR-LAUNCH-01 | SPEC-LAUNCH-01 a 03 | UAT-LAUNCH-01 a 06 | `docs/decisoes/DEC_G5_ACESSO_PUBLICO_FEIRA_2026-11-17.md`; NOT_RUN |
| REQ-CAT-01 a 08 | BR-CAT-01 a 08 | SPEC-CAT-01 a 08 | UAT-CAT-01 a 12 | `docs/engenharia/SPEC_INTEGRACAO_CATALOGO_v0.1_IN_REVIEW.md`; IN_REVIEW/NOT_RUN |
| REQ-CUR-01 a 07 | BR-CUR-01 a 07 | SPEC-CUR-01 a 07 | UAT-CUR-01 a 12 | `docs/catalogo/SPEC_CURADORIA_INTERFACE_v0.4.md`; UAT NOT_RUN |

### Critérios de completude para o próximo gate
- Conferir que cada requisito tenha responsável, regra, spec implementável e cenários positivos/negativos.
- Associar QA e UAT à **mesma versão/commit e mesma origem de dados**.
- Registrar bloqueios de reuso público, imagens, IA e Push; não marcar `PASS` por existência de arquivo de teste.
- Migrar matriz para a pasta `03-specifications/` do futuro Product Studio, preservando o vínculo por IDs.

| REQ-SYNC-01 | BR-SYNC-01: três aprovações | SPEC-SYNC-01: projeção pública validada | UAT-SYNC-01,02 | `docs/catalogo/SPEC_SINCRONIZACAO_INTEGRADA_v0.5.md`; UAT NOT_RUN |
| REQ-SYNC-02 | BR-SYNC-02: zero dados internos públicos | SPEC-SYNC-02: campos permitidos, auditoria | UAT-SYNC-03 | Mesmo documento; UAT NOT_RUN |
| REQ-SYNC-03 | BR-SYNC-03: PR humano + gate habilitado | SPEC-SYNC-03: workflow gated | UAT-SYNC-04,05 | Mesmo documento; um cenário BLOCKED por credenciais |
