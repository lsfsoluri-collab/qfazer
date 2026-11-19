# Qfazer — Auditoria do preenchimento editorial da CURADORIA
**Data:** 18/11/2026 · **Estado:** RASCUNHOS GERADOS / REVISÃO HUMANA PENDENTE

## FACT (verificação direta, Google Sheets CURADORIA)
- A coluna **AK** `por_que_vale_a_pena` estava vazia em 240 sessões.
- Foram redigidas e gravadas **161 justificativas distintas**, uma para cada `event_id`, distribuídas por **240 `session_id`**.
- Faixa aplicada: `CURADORIA!AK2:AK241`. Validação após gravação: **240/240 preenchidas**, **161/161 distintas por evento**, nenhum conflito entre sessões do mesmo evento.
- Duas correções em eventos com sessões de diferentes modalidades/programações tornaram o texto válido para todas elas.
- Após a escrita, a planilha permaneceu com **186 APTO_PARA_PILOTO, 43 PENDENTE_VERIFICACAO, 11 NAO_UTILIZAR**; `reuso_publico=PENDENTE_REVISAO` e `revisao_editorial=PENDENTE_REVISAO` nas 240. **0 liberadas publicamente**.
- Coluna AK tinha formato TEXT, sem validação/dropdown; edição restrita a essa coluna. Não foi alterada `BASE_ORIGINAL`.
- O texto não deve ser confundido com validação da fonte, autorização de direitos, revisão editorial final ou rechecagem do evento.

## Qualidade e limites
- Cada motivo se baseou em título, descrição, categoria, subcategoria, tags e local registrados na CURADORIA.
- Tom: uma frase curta, em geral 45–170 caracteres, sem prometer estoque, preço, clima, exclusividade ou line-up não documentado.
- Algumas sessões do Festival de Cinema Italiano tinham apenas descrição genérica sobre o festival; nesses casos a redação menciona a sessão e a programação conhecida, **sem inventar sinopse**. Recomenda-se pesquisar material oficial específico antes de marcar `revisao_editorial=APROVADO`.
- Registros pendentes ou não utilizar receberam texto para a **visão de curadoria**, mas continuam excluídos de recomendação.
- O HTML/snapshot de homologação já gerado antes desta edição não se atualiza sozinho; é necessário regenerá-lo com exportação privada atual do Sheets.

## Evidência técnica
- Componentes existentes já transportavam `por_que_vale_a_pena` do Sheets ao adaptador P2; esta branch reforça o trim e remove mensagem vazia da interface pública.
- O exportador público continua exigindo as três aprovações, e o catálogo público permanece uma projeção vazia aprovada pelo contrato.
- UAT na SPEC correspondente, não executado pela PO. Nenhum merge, deploy, configuração de credenciais ou ativação de sync nesta tarefa.
