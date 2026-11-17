# Qfazer — plano de expansão do catálogo
Versão 0.1 · 17/11/2026 · G5 IN_REVIEW

## Baseline observada
Lote anterior: 100 linhas, 92 aptas para **teste interno**, 1 pendente, 7 rejeitadas. 51 experiências; forte concentração em instituições e Centro Histórico/Campos Elíseos/Cerqueira César/Sé, com cinema apenas em novembro. Nenhum registro pode ser tratado como liberado para publicação sem avaliação de reuso.

## Objetivo da rodada 2
Ampliar **diversidade, não volume bruto**. Buscar sessões verificáveis entre 18/11 e 31/12/2026 em São Paulo capital, dando atenção especial ao período 04–06/12. Meta inicial exploratória: 40–80 sessões novas, ajustável conforme evidências e permissões.

## Critério de prioridade de pesquisa
1. Festas, música eletrônica, shows menores, bares com evento e vida noturna para 18–29 anos.
2. Gastronomia como experiência (feiras, festivais, degustações, pop-ups, oficinas culinárias).
3. Esportes e movimento (corridas, skate, escalada, coletivos, aulas abertas, competições para assistir).
4. Categorias aprovadas no mockup ainda não atendidas; validar a lista original antes de congelar a taxonomia.
5. Diversificação geográfica (Pinheiros, Vila Madalena, Bela Vista, Liberdade, Vila Mariana, Mooca, Tatuapé, Santana, Centro, Barra Funda, outras áreas da capital) e faixa de preço, sem criar cota artificial.

## Canal de descoberta x fonte de verdade
- Descoberta: Instagram público, perfis de produtores, newsletters, guias e comunidades.
- Confirmação: agenda oficial do organizador/estabelecimento, formulário oficial, ingresso ou ficha oficial específica da sessão.
- Reuso: registrar termos, licença, política e autorização. Instagram público não equivale a licença para scraping, cópia de fotografias, legendas ou base de contatos.
- Se só houver um story/post não verificável: registrar como LEAD_PENDENTE, **não publicar**.

## Contrato mínimo da sessão
session_id; event_id; titulo; categoria; subcategoria; tags_editoriais; descricao_editorial_original; data_local; hora_local; inicio_local; fuso; local; endereco; bairro; municipio; codigo_ibge; oferta/tipo_preco/preco_min_centavos/preco_max_centavos/taxas; disponibilidade e data da verificação; url_oficial; url_acesso e escopo; fonte_id; evidencias; status; escopo_reuso; reuso_publico.

Preservar modelo Evento/Sessão/Oferta/Fonte/Evidências e campos preexistentes. **Novos campos são candidatos** e devem passar por mapeamento retrocompatível.

## Estado dos leads
DESCOBERTO → AGUARDA_CONFIRMACAO → VERIFICADO_INTERNO → APTO_PARA_PILOTO → LIBERADO_PARA_PUBLICACAO (após compliance + aprovação PO).
Separar CANCELADO, EXPIRADO, DUPLICADO_COM_EVIDENCIA e NAO_UTILIZAR. A disponibilidade de ingresso é uma dimensão distinta.

## Regras de QA
- Datas futuras e hora local; não derivar 'grátis' da ausência de preço.
- Não prometer disponibilidade, taxa final, estoque ou acesso sem evidência.
- Comparação até 3 session_id; ausência de opções resulta em resposta honesta.
- Duplicidade candidata por nome+local+data+hora; não fundir sessões distintas.
- Não reproduzir foto/copy de terceiros sem direitos. Não coletar dados pessoais de participantes ou perfis fechados.
- IDs estáveis; registrar data de consulta, fontes e alterações.

## Gates e próximos passos
P0: reconciliar taxonomia com mockups; confirmar dono do código neste repositório.
P1: pesquisa de 40–80 sessões com evidências de origem e direitos.
P2: avaliação QA, deduplicação e bloqueios.
P3: integrar subset seguro ao ambiente de homologação, não ao site público.
P4: executar UAT e revalidação de sessões próximas à feira.
P5: aprovar publicação e release somente com evidências.

## Não fazer
Não ativar scraping indiscriminado, automatizar login/contornar barreiras, fazer deploy, publicar base bruta neste repositório público, nem inferir que apuração acadêmica é autorização de republicação.