# Qfazer — Contratos, componentes e dependências
**Versão:** 0.1 · **Estado:** IN_REVIEW · **Data:** 18/11/2026.

| Área | Artefato primário | Dependência e contrato | Estado/risco |
|---|---|---|---|
| Navegação e UI | `p2/index.html`, `p2/app.css`, `p2/app.js` | 4 abas, cards, ficha, estados, filtros | Código em branch; validação final com referência privada pendente |
| Design | `p2/assets/*`, `docs/produto/DEC_NAVEGACAO_MVP_2026-11-17.md` | Identidade, acessibilidade e direitos de uso | Pendências de licenciamento não devem ser ocultadas |
| Catálogo editorial | Google Sheets CURADORIA / `docs/catalogo/OPERACAO_CATALOGO_SHEETS.md` | Origem operacional; `session_id` estável | Planilha não é pública; sincronização automática não ativada |
| Normalização | `scripts/catalog-pipeline.mjs` e `p2/curation.js` | Valida eventos/sessões/URLs/status/tempo | Testes no repo, aceite específico não documentado |
| Catálogo público | `scripts/export_public_catalog.mjs` → `p2/catalog-public.json` | Exige `APTO_PARA_PILOTO`, `LIBERADO`, editorial `APROVADO` | Arquivo público **ausente intencionalmente**, 0 liberado no snapshot |
| Busca e comparação | `p2/app.js`, `p2/catalog.js`, `p2/taxonomy.js` | Até 3 seleções por sessão válida; local/hora/preço | Revalidar funcionamento com dados e critérios atuais |
| Chat/IA | `docs/engenharia/ADR_G5_BASELINE_TECNICA_2026-11-17.md` | Filtro determinístico antes da IA; no máximo 3 IDs válidos | **Não conectado**; `guia.mjs` antigo contém catálogo fictício e não deve ser reutilizado |
| Salvos | `p2/app.js` | Referências por ID, persistência local | Notificações não implícitas |
| Web Push | `shared/schedule.js` + arquitetura em ADR | Consentimento, revogação, horários e idempotência | Backend e dispositivo real não homologados; custo sob gate |
| PWA/hosting | `p2/sw.js`, `p2/manifest.webmanifest`, `netlify.toml` | Ambiente separado do P1; HTTPS/manifest/cache | Sem deploy por esta mudança |
| QA/UAT | `tests/`, `docs/engenharia/QA_VISUAL_REFERENCIA_2026-11-17.md` | Evidências vinculadas ao commit e ambiente | QA histórico existe; UAT atual NOT_RUN |
| Feedback P1 | `madyeec/qual-a-boa-pime` + Netlify legado | Não interferência e preservação de respostas | Independente do P2 |

### Prioridade de resolução
(1) confirmar correspondência visual da referência HTML com o código P2; (2) revisar disponibilidade e direitos das sessões; (3) liberar e validar projeção pública; (4) homologar filtros/salvos/compare; (5) revisar arquitetura de IA e Push, custo, LGPD e abuso; (6) homologação e release.

## Evidência adicional de convergência
No commit técnico `d8b6e15`, existem `p2/public-catalog.js` (validador), `p2/catalog-public.json` (projeção pública vazia), `scripts/audit-public-surface.mjs` e `tests/integration-sync.test.mjs`. A fotografia real de 240 linhas foi lida diretamente da planilha e não incorporada no repositório público. O workflow `.github/workflows/catalogo-publico.yml` só inicia a sincronização se `QFAZER_CATALOG_SYNC_ENABLED=true`, ID de planilha e credencial protegida estiverem configurados. Geração de PR não equivale a publicação.
