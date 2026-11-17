# Qfazer | Regra de elegibilidade do catálogo — G5
**Versão:** 0.1 · **Data:** 2026-11-17 · **Estado:** DECISION APPROVED (PO) para homologação interna.

## Decisão expressa da Product Owner
"Os eventos que estão com pendência devem ser desconsiderados até que as informações pendentes sejam confirmadas."

## REQ-CAT-01 — Elegibilidade exclusiva de sessões aptas
**BR-CAT-01:** Somente sessões com `status=APTO_PARA_PILOTO` podem participar da busca, filtros, comparação e recomendação em ambiente **interno**. Registros `PENDENTE_VERIFICACAO` e `NAO_UTILIZAR` ficam inacessíveis às respostas do produto e permanecem disponíveis somente na auditoria.

**SPEC-CAT-01:** Aplicar filtro no dataset antes de busca textual, embeddings, ranqueamento, comparação e consulta à IA. Os critérios mínimos combinados são:
- `status === "APTO_PARA_PILOTO"`;
- `municipio === "São Paulo"` e `codigo_ibge === "3550308"`;
- `inicio_local` válido, com sessão **ainda não iniciada** no fuso `America/Sao_Paulo` na hora da consulta;
- evento não cancelado, identificador da sessão único, origem rastreável;
- filtro de acesso, preço e estoque **não deve inventar** valores não confirmados; lacunas nesses campos não mudam automaticamente status para pendente, mas impedem afirmações de preço final ou disponibilidade garantida.

**SPEC-CAT-02 — Transição de status:** `PENDENTE_VERIFICACAO` só pode mudar para `APTO_PARA_PILOTO` após evidência primária nova, registro de data/fonte, resolução das lacunas e revisão do curador. Preservar status e motivo anteriores na trilha. Rejeitados só podem ser reconsiderados após revisão fundamentada; cancelados nunca podem ser recomendados.

**SPEC-CAT-03 — Escopo de publicação:** `APTO_PARA_PILOTO` **não** indica liberação pública. A publicação depende ainda de `reuso_publico`, verificação de direitos/condições, recência do dado e gate humano de release.

## Contagem de referência (fotografia interna de 17/11)
| Lote | Total | APTO_PARA_PILOTO | PENDENTE_VERIFICACAO | NAO_UTILIZAR |
|---|---:|---:|---:|---:|
| Piloto | 100 | 92 | 1 | 7 |
| Expansão | 104 | 69 | 32 | 3 |
| Consolidado | **204** | **161** | **33** | **10** |

Estas contagens são da fotografia validada, **não** significam que todas as 161 sessões continuam futuras em qualquer dia de execução.

## Cenários de aceite (NOT_RUN)
- **UAT-CAT-01** | Dado registro pendente em 05/12; quando buscar por data, bairro ou texto; então não deve aparecer em nenhuma resposta nem comparação.
- **UAT-CAT-02** | Dado registro rejeitado/cancelado; quando buscar recomendações; então não deve ser exibido, inclusive se o texto for idêntico ao título.
- **UAT-CAT-03** | Dado registro apto mas já iniciado; quando consultar; então o resultado não deve aparecer como futura opção.
- **UAT-CAT-04** | Dado registro pendente com nova evidência primária e revisão aprovada; quando reimportar a versão revisada; então pode entrar na homologação interna, mantendo histórico.
- **UAT-CAT-05** | Dado registro apto com estoque não verificado; quando solicitar "ingresso garantido"; então não pode afirmar disponibilidade.
- **UAT-CAT-06** | Dado catálogo de 204 linhas e referência temporal anterior às sessões; quando carregar a consulta interna; então somente as 161 aptas passam pelo filtro de status (e subsequentemente data/condições aplicáveis).

## Gate
Regra de negócio aprovada; implementação no PWA e UAT ainda **NOT_RUN**. A eventual incorporação de dados ao site público requer decisão separada.
