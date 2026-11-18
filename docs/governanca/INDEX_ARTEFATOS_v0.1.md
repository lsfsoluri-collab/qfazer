# Qfazer — Inventário operacional e índice de artefatos
**Versão:** 0.1 · **Estado:** IN_REVIEW · **Fotografia:** 18/11/2026.
**Regra:** localização existente ≠ aprovação de conteúdo ≠ implementação ≠ publicação.

## Aplicação e componentes (código existente na branch P2)
| Família | Arquivo/caminho | Estado observado |
|---|---|---|
| Shell web | `p2/index.html`, `p2/app.css`, `p2/app.js` | Presente em branch de desenvolvimento |
| Dados | `p2/catalog.js`, `p2/curation.js`, `p2/taxonomy.js` | Presente; integração pública sujeita a gates |
| PWA | `p2/manifest.webmanifest`, `p2/sw.js` | Presente; instalação real não homologada |
| Identidade | `p2/assets/app-192.svg`, `app-512.svg`, `logo-qfazer.svg` | Presente; direitos de ativos externos devem permanecer controlados |
| Curadoria | `scripts/catalog-pipeline.mjs`, `scripts/export_public_catalog.mjs`, `scripts/build-internal-preview.mjs`, `scripts/image-candidates.mjs` | Presente |
| Agendamento | `shared/schedule.js` | Núcleo de lógica presente; Push operacional não demonstrado |
| Testes | `tests/*.test.mjs`, `tests/browser*.mjs`, `tests/browser_reference_smoke.py` | Arquivos presentes; não equivale a novos testes nesta atualização |
| CI / hospedagem | `.github/workflows/*.yml`, `netlify.toml`, `package.json` | Presente; não pressupor serviço ativo ou deploy |
| Legado | `index.html`, `guia.mjs` na raiz | Código antigo ainda presente na branch; **não confundir** com `p2/` |

## Produto e decisões (existentes)
- `docs/produto/DEC_NAVEGACAO_MVP_2026-11-17.md`: **APPROVED BY PO**; quatro abas.
- `docs/decisoes/DEC_G5_ACESSO_PUBLICO_FEIRA_2026-11-17.md`: **APPROVED BY PO** para requisito de acesso público em 05/12; **não** autoriza deploy.
- `docs/decisoes/DEC_G5_AMBIENTES_PROTOTIPO1_PROTOTIPO2_2026-11-17.md`: **APPROVED BY PO**; separação dos protótipos, limite operacional R$50/mês, administração do futuro P2.
- `docs/decisoes/GRILLME_G5_RESPOSTAS_RODADA{1,2}_2026-11-17.md`: evidências/decisões a consultar; estados específicos prevalecem.
- `docs/produto/TAXONOMIA_CATEGORIAS_v0.1.md`: verificar critérios de aprovação por campo.

## Engenharia, catálogo e qualidade (existentes)
- `docs/catalogo/OPERACAO_CATALOGO_SHEETS.md`: operação e gates de publicação.
- `docs/catalogo/SPEC_CURADORIA_INTERFACE_v0.4.md`: regras e UAT da visão interna; UAT permanece NOT_RUN no documento.
- `docs/catalogo/PLANO_EXPANSAO_v0.1.md`, `REGRA_ELEGIBILIDADE_G5_v0.1.md`, `RELATORIO_CONSOLIDACAO_G5_v0.1.md`.
- `docs/engenharia/SPEC_INTEGRACAO_CATALOGO_v0.1_IN_REVIEW.md`, `SPRINT1_FUNDACAO_FUNCIONAL_SPEC_UAT_v0.1_IN_REVIEW.md`: **IN_REVIEW**.
- `docs/engenharia/ADR_G5_BASELINE_TECNICA_2026-11-17.md`: baseline técnica proposta, revisão independente pendente.
- `docs/engenharia/QA_VISUAL_REFERENCIA_2026-11-17.md`: relatório de QA anterior, não substitui UAT atual.
- Outras análises G5 encontram-se em `docs/engenharia/`; **não** convertê-las automaticamente em APPROVED.
- `README_PROTOTIPO2.md`: instruções operacionais P2 e limitações documentadas.

## Artefatos que devem ficar SOMENTE no Product Studio privado
- HTML de referência **Qfazer_PREVIEW_INTERNO_ATUALIZADO_2026-11-18 (1).html**, fornecido em 18/11, **SHA-256: `b13baa1f37334c2e03100462f9f944bd7102580db44e061dce0234c30caf4a1e`**.
- Snapshot contido na referência: metadados indicam **240 registros na curadoria**, **180 sessões futuras aptas**; o HTML embute **180 sessões**, não a base completa. Dados de reuso público pendentes.
- Backup privado separado: `Qfazer_BACKUP_PRIVADO_HOMOLOGACAO_2026-11-18.zip` (SHA-256 `778ebaedab8c88d065bf3943356cb2c1971c3437032a5a99b0e6ac338029d2ed`).
- `Qfazer_PREVIEW_FUNCIONAL_v05_INTERNO.html` (SHA-256 `4bf5d1e33739721b08d0a9608a71de63a56b3cc5e529dd1a9c5b0a1b105529bd`): **RETIRED para efeito de referência visual**, preservado como histórico.
- Biblioteca de pesquisa, fontes de eventos, capturas e evidências de homologação, conforme autorização de acesso e propriedade intelectual; inventário nominal completo PENDENTE.
- Google Sheets CURADORIA é fonte operacional; não espelhar indiscriminadamente o arquivo para Git público. Documentar ID/URL e controle de versão apenas na área restrita, quando disponível.

## Lacunas explícitas
Ainda não existe, neste repositório, um pacote verificadamente completo de **todos** os artefatos históricos e anexos da equipe. O índice descreve o que foi efetivamente localizado; itens não localizados continuam PENDENTES, não ausentes por conclusão.
