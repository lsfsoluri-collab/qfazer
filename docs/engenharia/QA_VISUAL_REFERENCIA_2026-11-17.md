# Qfazer P2 — QA visual da Sprint 1, referências de 17/11/2026

**Artefatos examinados:** três pranchas fornecidas pela Product Owner (desktop, biblioteca de componentes, mobile).
**Branch:** `feat/qfazer-p2-shell`; **gate:** G5 ainda em revisão; execução isolada e reversível.

## Design implementado
- Desktop: logotipo oficial, navegação compacta, hero com Q neon editorial, campo de busca creme, chips por categoria, área de destaques, agenda real em cards, filtros e chat visual.
- Mobile: header compacto, hero simplificado, categorias em 3 colunas, trilhos horizontais, cards legíveis, navegação inferior fixa com 4 destinos.
- Componentes: cores `#0B0B0B`, `#F7F5EE`, `#D7FF46`; botões arredondados, foco visível, estado salvo, ações de filtro e comparação.
- **Exceção de escopo validada anteriormente:** 4 abas e sem Perfil, apesar do mockup com 5 destinos.
- **Exceção de integridade:** sem fotos específicas sem comprovar direito de uso; mídia visual abstrata, não atribuída a eventos reais. Sem reserva direta, ingresso confirmado ou chat fingindo IA.

## Resultados executados nesta sessão
1. `npm run check`: testes Node de catálogo, agendamento e contrato de interface; todos os executados PASS, teste opcional de 161 registros SKIP quando JSON privado não está disponível.
2. Chromium via Playwright com HTML/JS/CSS locais injetados (não hospedados), usando JSON real fornecido na sessão: **64/64 PASS** em 320, 390, 768 e 1360 px.
3. Conferência funcional: 161 sessões importadas localmente, 17 resultados de busca `MASP`, salvar e recuperar no mesmo contexto, comparar, abrir ficha, troca de quatro abas, sem erro JS nem overflow.
4. Screenshots foram gerados localmente fora do repositório, pois incluem sessões internas cujo reuso público não foi liberado.

## Limitações honestas
- Não foi possível validar ambiente servido via `localhost`: navegador bloqueou `http://127.0.0.1` por política administrativa. Foi usada injeção local de HTML/CSS/JS para verificar renderização e interação.
- Instalação de PWA em HTTPS, Web Push, desempenho real, Garet webfont licenciado, iPhone e Android físicos e fidelidade pixel-a-pixel ainda **NOT_RUN**.
- O catálogo foi importado **somente na homologação**, sem publicar o JSON. Não há fotos de eventos associadas até direitos serem revisados.
- Nenhum deploy, merge, DNS ou gasto autorizado/executado.
