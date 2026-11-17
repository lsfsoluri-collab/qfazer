# G5 — Etapa 3: consolidação e QA do catálogo
**Versão:** g5-consolidado-v0.1-rc1 · **Data:** 17/11/2026 · **Estado:** CANDIDATO_HOMOLOGACAO_INTERNA · **Gate:** G5 IN_REVIEW.

## Resultado documentado
- Piloto: 100 registros = 92 aptos somente para teste interno, 1 pendente, 7 rejeitados.
- Expansão: 104 registros = 69 aptos somente para teste interno, 32 pendentes, 3 rejeitados.
- Consolidação: **204 registros**, dos quais **161 aptos internamente**, 33 pendentes e 10 rejeitados.
- Janela crítica: **56 sessões aptas entre 04 e 06/12/2026**, das quais **29 em 05/12**.
- 13 categorias técnicas; os agrupamentos e chips do PWA seguem sujeitos à validação do mockup original.

## Evidências da auditoria executada
- 19 verificações locais de arquivos aprovadas: paridade JSON/CSV por lote, correspondência SHA256 do piloto citado pela expansão, unicidade de `session_id`, duplicatas exatas e similares no mesmo endereço/data, consistência data/hora/UTC, campos mínimos, preço e evidências.
- **Zero colisões de `session_id`** entre os dois lotes e nenhuma duplicata exata identificada na exportação combinada. As 8 ocorrências repetidas relatadas na expansão já foram excluídas antes do envio do segundo lote.
- 3 registros fora de São Paulo são rejeitados intencionalmente (não integram as sessões aptas).
- 6 pares de sessões distintas apresentam sobreposição de janela temporal estimada no mesmo endereço; exigem inspeção humana, mas não devem ser fundidos automaticamente.
- 21 sessões aptas sem preço informado. 159 sessões aptas sem estoque positivamente confirmado no instantâneo. 60 de 83 sessões pagas com valores de taxas incompletos.
- **Reuso público:** todos os 204 registros mantêm `PENDENTE_REVISAO`. Nada está liberado para publicação por este documento.

## Contrato candidato de integração
Os dois arquivos de entrada continuam identificados por origem; auditoria completa tem 204 linhas e a seleção de homologação tem 161 linhas. Contrato de 62 campos do segundo lote + `lote_origem` e `origem_linha`, sem eliminar campos do primeiro lote. Aplicar na leitura o filtro adicional de início futuro em `America/Sao_Paulo`, status apto e município confirmado. As regras de preço, disponibilidade e permissão pública permanecem independentes do status de teste.

## Próximas ações
1. Validar mapeamento da taxonomia para os chips do mockup aprovado, sem alterar silenciosamente os filtros.
2. Resolver sobreposições de horário e alertas de fonte; revalidar 56 sessões da janela 04–06/12 antes da feira.
3. A engenharia identifica repositório do código e ambiente de homologação, oferece importação idempotente com rollback por versão.
4. Revisar autorização de reuso campo a campo e obter aprovação expressa antes de expor dados no PWA público.
5. Executar UAT vinculados a REQ/BR/SPEC, com estado atual **NOT_RUN**; G6/G7/G8 ainda não foram aprovados.

## Política de armazenamento
**Não fazer commit de JSON/CSV brutos, lotes internos, cópias de páginas, imagens ou planilhas de auditoria neste repositório público.** Os artefatos internos foram gerados e entregues separadamente; deverão permanecer em armazenamento com controle de acesso até a liberação de reuso. Este arquivo documenta números, metodologia, restrições e decisões abertas, não concede autorização de publicação.

## Estados
- **FACT:** 204 registros recebidos; 161 aptos apenas para teste; auditoria executada.
- **ASSUMPTION:** o modelo candidato 1.2.0 poderá ser consumido por um adaptador sem alteração do comportamento aprovado.
- **DECISION PROPOSTA:** congelar `g5-consolidado-v0.1-rc1` como fotografia interna imutável para o ensaio de integração.
- **OPEN_QUESTION:** responsável e destino de homologação, mapeamento final de categorias, permissões por fonte e versão do PWA de referência.
