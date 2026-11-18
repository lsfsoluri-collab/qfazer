# Qfazer — Painel integrado de execução (Curadoria × App × GitHub)
**Fotografia:** 18/11/2026 · **Estado:** IN_REVIEW · **Responsabilidade:** coordenação de produto.
**Origem:** inspeção direta da planilha e APIs GitHub + relatórios internos v0.6/v0.7. Não é mecanismo de sincronização em tempo real.

## Estado verificável
| Trilha | Realizado | Bloqueio | Próxima ação / gate |
|---|---|---|---|
| Curadoria | 240 IDs únicos; 186 aptos internos, 43 pendentes, 11 descartados | 0 reuso público + 0 editorial aprovado | Revisar direitos por fonte e aprovação por sessão; equipe editorial, G5/G6 |
| Exportação | Código Sheets→projeção pública→validador no PR #5; arquivo público vazio válido | Google Service Account, variáveis e revisão do workflow | Responsável Google/GitHub configura acesso, testa em ambiente isolado; G6 |
| App P2 | Branch `feat/p2-taxonomia-fotos-scroll`; shell, filtros, salvos, fichas, comparação e curadoria interna | QA físico e paridade integral visual pendentes | QA técnico e UAT da PO; G7 |
| Chat | Tela de produto existe; sem recomendações reais geradas por IA | arquitetura/custo/abuso não homologados | Engenharia revisa contrato, quotas e privacidade; G5→G6 |
| Web Push | Spec e `shared/schedule.js` | Infra, consentimento, contas e dispositivos sem homologação | Eng. valida custos até R$ 50/mês, UAT iOS/Android; G5→G7 |
| Docs/GitHub | PR #5 técnico draft e PR #6 documental draft | Dependências de PRs #1→#4→#5 e revisão de merge | Revisão independente; nenhum merge automático |
| Release | P1 legado preservado; P2 ainda isolado | Nenhum release G8 autorizado | UAT e decisão humana de deploy para a feira 05/12 |

### Fonte de verdade e prevenção de conflito
1. **Sessões e estados correntes:** Google Sheets privado → aba CURADORIA.
2. **Código, testes e PRs:** `lsfsoluri-collab/qfazer`, branch técnica e PR #5.
3. **Aprovações:** decisões identificadas em `docs/decisoes/`, `docs/produto/` e `docs/governanca/`.
4. **Referência visual:** HTML interno da PO de 18/11 identificado por SHA-256 `b13baa1f37334c2e03100462f9f944bd7102580db44e061dce0234c30caf4a1e`; não enviar seu snapshot privado ao Git público.
5. **Documentação de passagem entre áreas:** este painel e PR #6. Publicação de um comentário em outro chat não atualiza estes artefatos automaticamente.

## Evidências
- Planilha central, aba CURADORIA A1:V246: 240 sessões, zero duplicados, 186/43/11, 0 liberados e 0 editorial aprovados (18/11).
- PR #5 SHA `d8b6e15ebf687d25a5b863e0676f0f1cfce68392`; GitHub Actions runs 44412988762 e 44412988770: `completed/success`.
- PR #5 inclui `docs/catalogo/SPEC_SINCRONIZACAO_INTEGRADA_v0.5.md` com UAT-SYNC-01..05.
- GitHub Actions programado na branch técnica: `.github/workflows/catalogo-publico.yml`; **não ativo na main**.

## Regras de decisão
- **FACT:** 186 aptas para HOMOLOGAÇÃO INTERNA, não para o público.
- **ASSUMPTION:** após autorização de release, P2 lê o catálogo público autorizado do mesmo domínio.
- **DECISION:** não trocar o HTML visual designado, não tocar no P1, não criar base paralela, não publicar catálogo não autorizado; organizar artefatos em público/privado.
- **OPEN_QUESTION:** conta de serviço, permissões para reuso/editorial, responsável pelo aceite de IA/Push e autorização de release. Cada bloqueio tem gate próprio.

## Critério de conclusão do MVP público
UAT da interface/catálogo/PWA realizada e aprovada, 0 violações de dados internos, sessões públicas somente após três gates, IA/Push operacionais ou exceções formalmente aprovadas, custo e privacidade revisados, deploy G8 autorizado. **Estado atual: NÃO CONCLUÍDO.**
