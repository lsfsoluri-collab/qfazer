# Qfazer — Centro de governança dos artefatos
**Versão:** 0.1 · **Estado deste índice:** IN_REVIEW · **Data:** 18/11/2026
**Repositório:** `lsfsoluri-collab/qfazer` · **Base técnica inventariada:** `feat/p2-taxonomia-fotos-scroll` (`320c9079a4da926b823f7944f475386347cd824c`).

Esta pasta reúne **índices, vínculos e regras de versionamento**, sem mudar a aplicação. Não significa que todos os documentos indexados estejam aprovados, implementados ou testados.

## Dois repositórios, funções distintas
1. **Aplicação (público, já existente):** este repositório; código em `p2/`, assets licenciados, testes, specs publicáveis, documentação de engenharia e projeção de dados **apenas quando autorizada**.
2. **Product Studio (privado, PENDENTE DE CRIAÇÃO):** briefing, specs internas, referências visuais e versões históricas, curadoria completa, evidências, decisões e relatórios com acesso controlado.

A criação de outro repositório ainda não foi realizada. Não usar repositórios privados de outros projetos como substitutos.

## Acesso aos registros
- [Decisão de organização](DEC_REPO_001_2026-11-18.md)
- [Índice de artefatos](INDEX_ARTEFATOS_v0.1.md)
- [Baseline e aprovações](BASELINES_E_APROVACOES_v0.1.md)
- [Política de versões e dados](POLITICA_VERSOES_E_ACESSO_v0.1.md)
- [Mapa de integrações](MAPA_INTEGRACOES_v0.1.md)
- [REQ → BR → SPEC → UAT](MATRIZ_RASTREABILIDADE_v0.1.md)
- [Plano de migração](PLANO_MIGRACAO_v0.1.md)
- [Estado, riscos e gate](RELATORIO_ESTADO_v0.1.md)

## Orientação fundamental
O último arquivo criado não é necessariamente o mais recente **aprovado**. A v0.5 HTML independente foi rejeitada como substituição visual; a referência indicada pela PO é o HTML privado enviado em 18/11/2026 (hash no manifesto). O **código P2** e essa **referência HTML** são artefatos distintos: equivalência funcional/visual depende de QA e UAT.

Não fazer merge, deploy, alterar DNS, configurar credenciais, publicar catálogo nem acionar integrações em produção por causa deste índice.
