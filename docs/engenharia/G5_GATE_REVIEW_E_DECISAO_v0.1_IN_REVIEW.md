# Qfazer — G5 | Checklist decisório para autorizar G6 / Sprint 1
**Versão:** 0.1 · **Data:** 17/11/2026 · **Estado:** IN_REVIEW; autorização de G6 ainda NÃO registrada

## Objetivo do gate
Pelo PROJECT_LIFECYCLE, G5 exige arquitetura, contratos, testes planejados, riscos tratados, dependências claras, plano executável e revisão técnica independente. **Não exige código implementado ou UAT executado**, que pertencem a G6/G7. O objetivo imediato é a aprovação de arquitetura suficiente para implementar a Sprint 1 sem comprometer o site antigo nem custos.

## Entradas verificadas
- Manual de marca Qfazer v2 e PNGs/fontes/mocks recebidos na conversa; licença de redistribuição Garet ainda não verificada.
- Baseline funcional REV7 aprovada em 12/11/2026 e DEC-UX-02 aprovada em 17/11/2026, quatro abas `Início · Salvos · Buscar · Chat`.
- PR #1 `chore/migracao-baseline-pwa`: possui `index.html`, `guia.mjs`, `netlify.toml`, `_headers`, `robots.txt` como staging legado; `main` não tem app, não há `manifest.webmanifest` na branch, binários e fontes oficiais não versionados.
- Protótipo 1 Netlify continua independente, em conta de outra integrante que permanece na equipe; formulários de feedback devem continuar.
- Protótipo 2 terá administração de Luana, domínio `qfazer.com.br` reservado para release autorizado, orçamento total até R$50/mês, sem contratação implícita.
- Push obrigatório em 05/12, tolerância de 5 minutos para tentativa de disparo do servidor; homologação planejada em iPhone, Android e computador.
- Catálogo de 204 registros com 161 aptos para testes internos na fotografia de 17/11: **reuso público pendente para todos**. Não usar dados de pesquisa em public build.

## Matriz do gate
| Critério | Estado | Evidência ou resolução |
|---|---|---|
| G5-CK-01 Escopo e regras aprovadas | PASS_DOCUMENTAL | baseline REV7, marca v2, DEC-UX-02, DEC-G5-25 |
| G5-CK-02 Arquitetura candidata comparada | PASS_DOCUMENTAL | parecer G5 + comparativo Netlify/Neon/Cloudflare |
| G5-CK-03 Fornecedor/conta/provedor escolhidos e arquitetura assinada | BLOCKED | parecer da engenharia + plano de operação; nenhum provedor aprovado |
| G5-CK-04 Custos e limites estimados para R$50/mês | BLOCKED | projeção assinada de hospedagem, banco, cron/fila, IA, tráfego, uso anormal; painéis não acessados |
| G5-CK-05 Contratos de segurança/API | IN_REVIEW | contratos candidatos de catalogo/push; aprovação técnica e controles de privacidade pendentes |
| G5-CK-06 Riscos/retorno e separação de protótipos | PASS_DOCUMENTAL / IMPLEMENTAÇÃO PENDENTE | plano de rollback, preservação da coleta do Protótipo 1; teste em G6 |
| G5-CK-07 UAT previstos antes de implementar | PASS_DOCUMENTAL | cenários abaixo e SPEC da Sprint 1; execução NOT_RUN |
| G5-CK-08 Revisão independente | IN_REVIEW / NOT_RUN | PO será revisora de negócio; assistente coordenador revisará a ADR de autoria do agente executor, não a própria arquitetura candidata; parecer ainda não emitido |
| G5-CK-09 Aceite de baseline técnica pela PO | BLOCKED | após evidências 03-08 |
| G5-CK-10 Permissões de catálogo publicável | G8_BLOCKER | diligência em paralelo; não bloqueia *planejamento* de Sprint 1 com placeholders, mas bloqueia release público |

## Restrições operacionais de entrada no G6
- A Product Owner especifica e aprova produto, orçamento e gates. **Agente de IA implementa e apresenta commits/testes**. Integrante da equipe colabora, mas só será revisora independente se não tiver produzido a alteração que revisará.
- Não criar conta/projeto de hospedagem, publicar preview aberto, transferir site, configurar DNS, introduzir credenciais, instalar serviços pagos ou gastar créditos reais sem checagem de autonomia/autorização pertinente.
- Separar frontend publicável (`dist/` ou equivalente) de Functions/secret store, documentos, datasets internos e masters de fonte com licença pendente.
- Códigos de push, catálogo e IA posteriores podem ser desenvolvidos isoladamente depois de arquitetura aprovada; Sprint 1 **não promete** IA, push ou catálogo real funcionais.
- Nunca confundir demo sintética com eventos reais: card real apenas com fonte verificável e reuso autorizado; usar estado vazio ou demo explicitamente rotulada, sem links fictícios apresentados como oficiais.

## Próximas ações para fechamento do G5
1. Engenharia apresenta escolha justificada (preferência *candidata* Netlify em projeto administrado pela PO) e detalhamento do serviço de Push, persistência/scheduler, custo e rollback.
2. Agente executor elabora ADR própria ([Issue #2](https://github.com/lsfsoluri-collab/qfazer/issues/2)); o assistente revisor avalia o trabalho **desse agente** e a PO julga os impactos de negócio. Não autocertificar a proposta redigida pelo coordenador.
3. Conferir permissões/límites de planos antes de escolher provedor; cotação não constitui contratação.
4. PO aprova o pacote G5, uma versão específica, e autoriza o G6 da Sprint 1 expressamente.
**Status:** `G5 NOT APPROVED`, Sprint 1 `READY FOR REVIEW / NOT STARTED`.

## Designação de revisão — 17/11/2026
**DECISION (PO):** revisores serão Luana (negócio/UAT) e assistente coordenador (especificações, segurança e evidências), separados do **agente de IA executor**. **Limite:** a revisão da própria arquitetura previamente elaborada pelo coordenador não é independente; o agente executor deve produzir ADR própria para que sua revisão seja tecnicamente separada da autoria. Issues operacionais: [#2 G5 ADR](https://github.com/lsfsoluri-collab/qfazer/issues/2), [#3 Sprint 1 bloqueada](https://github.com/lsfsoluri-collab/qfazer/issues/3). O G5 permanece NÃO APROVADO.
