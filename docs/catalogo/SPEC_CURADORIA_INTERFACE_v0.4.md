# Curadoria completa na interface interna

Decisão da PO em 18/11/2026: revalidar pendências, atualizar somente fatos resolvidos e disponibilizar todos os registros novos na interface, com filtros para bloqueios.

## Fatos
- Origem canônica: aba CURADORIA do catálogo central, 240 sessões e 38 colunas na leitura de 18/11.
- Branch de trabalho: feat/p2-taxonomia-fotos-scroll, PR 5 ainda draft.
- Nenhuma sessão tem autorização de publicação pública. Nenhuma imagem tem licença liberada.
- Preview funcional v0.5 contém uma amostra menor. Ele não é o site publicado.

## Decisões desta alteração
- REQ-CUR-01 / BR-CUR-01 / SPEC-CUR-01: homologação mostra todos os IDs importados, inclusive registros pendentes ou rejeitados, numa visão de curadoria claramente identificada. Isso substitui a exclusão visual apenas nesta visão interna, conforme a nova solicitação.
- REQ-CUR-02 / BR-CUR-02 / SPEC-CUR-02: recomendações, destaques e comparação continuam limitados às sessões aptas, futuras e rastreáveis. Estar visível na curadoria não torna um evento recomendável.
- REQ-CUR-03 / BR-CUR-03 / SPEC-CUR-03: filtros de situação factual, bloqueio e liberação pública operam sobre o mesmo catálogo, sem duplicar IDs. Cards e ficha mostram o motivo.
- REQ-CUR-04 / BR-CUR-04 / SPEC-CUR-04: desconhecido não vira gratuito. Divergência de preço não é resolvida escolhendo o menor; o valor fica vazio e a restrição é explícita.
- REQ-CUR-05 / BR-CUR-05 / SPEC-CUR-05: preservar IDs ao resolver horário anteriormente vazio e registrar mudança, fonte, status anterior e campos alterados. Não adivinhar mudança de data de evento com fontes conflitantes.
- REQ-CUR-06 / BR-CUR-06 / SPEC-CUR-06: snapshot interno em arquivo local, fora do Git público. Exportação pública continua exigindo os gates existentes. Nenhum novo cron, credencial, merge ou deploy.
- REQ-CUR-07 / BR-CUR-07 / SPEC-CUR-07: preservar navegação e desenho da versão existente; atualização do HTML funcional é nova versão interna com catálogo completo embutido.

## Cenários UAT definidos antes da implementação
| ID | Ação | Resultado esperado | Estado inicial |
|---|---|---|---|
| UAT-CUR-01 | Abrir prévia interna atualizada | Todos os 240 IDs carregados, sem importação manual | NOT_RUN |
| UAT-CUR-02 | Filtrar Pendentes | Somente PENDENTE_VERIFICACAO; motivo legível | NOT_RUN |
| UAT-CUR-03 | Filtrar Não utilizar | Rejeitados visíveis na auditoria, sem comparação/recomendação | NOT_RUN |
| UAT-CUR-04 | Abrir uma pendência sem horário/fonte | Mostrar A confirmar; não fabricar dado ou link de compra | NOT_RUN |
| UAT-CUR-05 | Filtrar publicação pendente | Exibir registros internos, sem alterar autorização pública | NOT_RUN |
| UAT-CUR-06 | Buscar evento multicategoria/tag | Mesmo ID encontra-se em todas as categorias próprias e tags | NOT_RUN |
| UAT-CUR-07 | Solicitar sugestões ou abrir destaques | Zero pendentes/rejeitados/já iniciados | NOT_RUN |
| UAT-CUR-08 | Atualizar um salvo que ficou pendente | Apresentar situação atual e bloquear comparação | NOT_RUN |
| UAT-CUR-09 | Rolar catálogo de 240 sessões | Progressão sem duplicação e fallback Ver mais | NOT_RUN |
| UAT-CUR-10 | Abrir mobile e desktop | Preservar quatro abas, ficha e ausência de rolagem horizontal | NOT_RUN |
| UAT-CUR-11 | Exportar público com gates pendentes | Zero sessões exportadas | NOT_RUN |
| UAT-CUR-12 | Conferir planilha depois da escrita | Apenas células planejadas alteradas; fórmulas e dados originais preservados | NOT_RUN |

## Limites e perguntas abertas
- UAT com a PO e homologação em aparelhos físicos permanecem etapas humanas.
- Sincronização hospedada autenticada depende da credencial já identificada no PR. A atualização entregue aqui é um snapshot verificado, não uma conexão contínua.
- Divergências persistentes de organizadores e direitos de reuso permanecem bloqueios reais.
