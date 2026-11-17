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

## Interface v0.2 — referência visual aprovada em 17/11/2026
A estrutura desktop/mobile reproduz as três pranchas enviadas pela Product Owner: cabeçalho e logotipo, hero com Q grande, busca creme, chips de categorias, seleções e cartões de eventos, filtros por sessão, chat em dois tipos de balão e barra inferior no mobile. **Decisão funcional prevalecente:** são 4 abas (Início, Salvos, Buscar, Chat), sem Perfil.

Cards recebem exclusivamente título, data, local e preço do catálogo real importado. **As áreas gráficas são padrões abstratos ilustrativos**; não são fotografias específicas dos eventos e não constituem evidência de realização nem disponibilidade. Fotos editoriais e Garet dependem de direitos de uso/licenças.

QA local: `npm run check` valida JavaScript e contrato visual; `tests/browser_reference_smoke.py` (exige Python/Playwright/Chromium e variável `QFAZER_INTERNAL_CATALOG` definida apenas no ambiente de testes) validou interações em larguras 320, 390, 768 e 1360 px; evidências locais **64/64 PASS**. Os testes de navegador usam conteúdo HTML/JS injetado, não hospedagem HTTP real, por restrição de rede local. Não comprovam instalação PWA, Push ou funcionamento em hardware físico.
