# Buscar e detalhes — v0.6

18/11/2026. Decisão funcional: pedido expresso da PO e duas imagens fornecidas nesta conversa. Escopo: lista Buscar e ficha de qualquer sessão; outras abas e referência original preservadas. UAT humano ainda NOT_RUN.

| REQ / BR | SPEC | UAT preparado antes da implementação |
|---|---|---|
| BUS-01 / sessões únicas | Acrescentar lotes de 18 por proximidade do fim; manter nós existentes, posição e filtros. Botão Ver mais como alternativa. | Rolar de 18 até 240; IDs únicos, primeiro card preservado e fim sem repetição. |
| BUS-02 / mesma ficha para todas | Seta amarela abre a sessão exata: capa/categoria, salvar, compartilhar, título, descrição, quando, onde, preço, verificação, justificativa, tags e link oficial. | Abrir apto, pendente, não utilizar e sessão sem horário; conferir ID e campos, fechar e retomar posição. |
| BUS-03 / fidelidade às referências | Cards creme em uma coluna no celular; modal escuro com borda e cantos arredondados, X destacado, ações sobre capa, fatos com ícones, caixa de justificativa e CTA limão. | Conferir 390/1360 px, título longo e rolagem do modal sem corte horizontal. |
| BUS-04 / sem inventar | Preço/descrição/justificativa ausentes são explicitados. Fotos só com liberação e origem; usar a arte abstrata existente quando não há foto. | Preço vazio não vira grátis; sem fonte, nenhum link inventado; sem licença, sem foto. |
| BUS-05 / preservar decisões | Pendentes/rejeitados continuam visíveis na curadoria, fora de sugestões e comparação. Publicação permanece independente. | Filtrar status, abrir ficha e verificar motivo; nenhuma aprovação alterada. |
| BUS-06 / acessibilidade | Fechar por X/Escape; título acessível; foco volta ao acionador sem saltar a página. | Teclado, rolagem e retorno ao mesmo card depois de salvar/fechar. |

Aceite de negócio: Product Owner. Testes automatizados são evidência técnica, não UAT humano. Sem deploy ou alteração de aprovação de dados.
