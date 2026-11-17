# Qfazer — Protótipo 2, Fundação Funcional (em construção)

**Origem:** branch isolada de construção, sem deploy/merge em produção. O Protótipo 1 permanece intacto.

- Site em `p2/`, sem dependências de build: abra via servidor estático HTTPS para ativar service worker/instalação PWA.
- Paleta oficial preto #0B0B0B, creme #F7F5EE, lime #D7FF46. Ícones/wordmark provenientes de arquivos oficiais aprovados.
- Exatamente quatro abas: Início, Salvos, Buscar, Chat. Salvos persistem apenas no navegador deste dispositivo.
- Para homologar com o catálogo **real e interno**, abrir `/?homologacao=1`, selecionar o JSON `catalogo_homologacao_interna_161.json` **localmente**. Não transmite nem publica o conteúdo; filtros, comparações, ficha e links oficiais funcionam em homologação; não habilitar acesso público a este modo sem revisão de segurança.
- `p2/catalog-public.json` **não está presente** intencionalmente. Um pipeline separado, após revisão de condições de reuso, deve gerar uma projeção com sessões liberadas para publicação. O parser exige `reuso_publico=LIBERADO`, status, município, data futura e URL oficial válida.
- Chat e notificações são identificados claramente como ainda indisponíveis; nenhuma API/Push/banco criados.
- `npm test` usa apenas Node 22+; o teste opcional com dados reais usa variável `QFAZER_INTERNAL_CATALOG=/caminho/arquivo.json npm test`.

## Segurança, status e testes
- Nenhuma credencial/JSON interno ou arquivo de fonte proprietária deve entrar no site ou no GitHub público. Garet é fallback de CSS até verificação de licença. Montserrat pode ser adicionada com licença OFL.
- Nenhum endpoint de IA foi ligado; `guia.mjs` legado permanece isolado do diretório `p2/` e não é implantado nesta fase.
- O service worker cacheia apenas shell e imagens; não cacheia catálogo nem API. O modo de homologação é um utilitário de testes, não funcionalidade aprovada para o produto público.
- UAT manual ainda necessária: iPhone, Android, desktop, instalação PWA, acessibilidade, diferenças de hora, persistência de salvos, ficha e integração com o catálogo real.
