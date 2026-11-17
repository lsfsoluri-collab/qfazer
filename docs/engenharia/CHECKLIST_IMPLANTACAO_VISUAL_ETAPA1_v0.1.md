# Qfazer — Handoff de implementação visual | Etapa 1

**Data:** 17/11/2026 · **Status:** IN_REVIEW · **Branch:** `chore/migracao-baseline-pwa` · **Gate:** G5 → G6 pendente

## Fontes de verdade
1. Manual de marca Qfazer v2.0 (13/11/2026), recebido na conversa; contém regras oficiais versus propostas.
2. Pranchas de elementos gráficos, sistema de componentes, mockups mobile e desktop e PNGs aprovados.
3. Decisão de navegação **DEC-UX-02**, aprovada expressamente pela Product Owner em 17/11/2026.
4. Baseline funcional REV7 aprovada; nenhuma alteração silenciosa nas regras de busca, conversa, comparação e salvos.

**Atenção:** os PNGs, ZIPs de fontes e o manual foram recebidos **na conversa**; não estão versionados nesta branch por este commit.

## Design tokens [OFICIAL]
- `brand.black = #0B0B0B`
- `brand.cream = #F7F5EE`
- `brand.lime = #D7FF46`
- Títulos e destaques: **Montserrat**.
- Corpo, navegação e interface: **Garet**.
- Fira Sans Condensed está no ZIP, mas **não é fonte oficial do PWA**.
- Direção: Urban Utility × Bold Minimalism × Cultural Discovery; mobile-first, dark-first.
- Tokens auxiliares de contraste/superfície, medidas e pesos são hipóteses técnicas para validação, não componentes de marca oficialmente aprovados.

## Escopo da etapa 1 — sequenciamento
### P0. Kit de marca
- [ ] Confirmar exportação dos PNGs aprovados do logo claro, logo escuro, logo combinado, app-icon e motivo dos três traços.
- [ ] Checar transparência, proporção, recortes, fundos e legibilidade em 16/32/192/512 px.
- [ ] Adicionar assets ao novo repo na branch de migração, mantendo os arquivos mestres e versões otimizadas; não reconstruir o lettering manualmente.
- [ ] Gerar favicon, apple-touch-icon, ícones PWA 192/512 e versão maskable com zona segura real, sem deformar o Q.
- [ ] Verificar direitos/licenças das fontes. Montserrat inclui licença OFL no pacote; licença de distribuição de Garet **a confirmar** antes de fazer commit de seus binários em repo público. Não expor fontes na resposta do assistente.
### P0. Estilo base
- [ ] Remover acentos cromáticos da marca anterior, substituir tokens por paleta oficial.
- [ ] Aplicar Montserrat em headlines e Garet no corpo/componentes, somente após resolver licença de distribuição ou usar fallback temporário.
- [ ] Estilizar botões, campos, chips, navegação e cards conforme pranchas sem incorporar screenshots como interface.
- [ ] Criar estados hover/foco/selecionado/desabilitado/erro e contraste legível. Seleção indicada também por ícone/texto.
### P0. Navegação
- [ ] Implementar exatamente 4 abas: **Início · Salvos · Buscar · Chat**, nessa ordem.
- [ ] Remover Perfil do menu inferior. Não criar rota/registro/autenticação de Perfil.
- [ ] Ficha, filtros e comparação contextuais; preservar retorno à aba anterior.
### P0. Restrições de funcionalidade
- [ ] Preservar o fluxo aprovado. Não anunciar venda/reserva dentro do app: encaminhamento é para canais oficiais.
- [ ] O catálogo exibido no código legado é fictício e deverá permanecer sinalizado como demonstração isolada até a integração segura dos dados.
- [ ] Não colocar lote de eventos internos, pendentes ou sem liberação de reuso em frontend público.
- [ ] Corrigir o caminho da função Netlify que atualmente aponta para `netlify/functions`, mas o arquivo de origem `guia.mjs` está na raiz; validar no build isolado.
### P1. Visual e conteúdo
- [ ] Criar fallback neutro para cartões sem foto verificada, sem reutilizar imagem de outra experiência.
- [ ] Exportar ou implementar ícones individuais consistentes com a prancha; não assumir que screenshot fornece vetor original.
- [ ] Textura e grafismos são opcionais para o MVP. Não bloquear as jornadas por eles.
- [ ] Preservar credenciais fora do código, verificar modo offline/PWA se constar na baseline.
- [ ] Verificar créditos institucionais existentes sem inventar marca da faculdade.

## Evidências de aceite
| ID | Critério | Evidência obrigatória | Estado |
|---|---|---|---|
| UAT-VIS-01 | Logo correto sobre fundo preto e creme | Capturas mobile/desktop com assets identificados | NOT_RUN |
| UAT-VIS-02 | Tokens oficiais, tipografia e CTA lime/preto | Capturas + valores CSS/inspeção do build | NOT_RUN |
| UAT-VIS-03 | Navegação exatamente quatro abas aprovadas | Vídeo/captura dos estados e roteamento | NOT_RUN |
| UAT-VIS-04 | Imagens, ícones e fontes sem links quebrados | Relatório de build e teste de carregamento | NOT_RUN |
| UAT-VIS-05 | Layout responsivo e leitura acessível | Evidência mobile/desktop, foco, contraste | NOT_RUN |
| UAT-VIS-06 | Sem alterações indevidas de fluxos ou dados | Comparação com REV7 + evidências de regressão | NOT_RUN |
| UAT-VIS-07 | Nenhum evento pendente, rejeitado ou dado interno publicado | Inspeção do conteúdo de homologação e do deploy | NOT_RUN |
| UAT-VIS-08 | Configuração das funções funciona no teste isolado | Requisição de teste com evidência e sem segredo | NOT_RUN |

## Antes de merge / deploy
1. Engenharia entrega parecer sobre implementação, direitos/licenças de assets, riscos de privacidade, custos e reversão.
2. Exibir preview de homologação isolado, capturas e resultados dos testes.
3. PO aprova fidelidade da nova identidade e preservação da baseline.
4. Só depois decidir merge e publicação; **este documento não os autoriza**.

## Registro operacional
**FACT:** identidade visual oficial entregue, decisão de 4 abas aprovada, PR #1 já existe em rascunho.
**ASSUMPTION:** os PNGs fornecidos são masters de qualidade adequada para todas as exportações web; validar visualmente.
**DECISION:** quatro abas, ordem e labels aprovados; Perfil fora da barra principal.
**OPEN_QUESTION:** qual licença permite hospedar Garet publicamente? Os ícones individuais serão exportados ou implementados por biblioteca? Qual preview isolado será usado pela engenharia?
