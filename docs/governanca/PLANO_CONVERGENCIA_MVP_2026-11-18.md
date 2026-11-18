# Plano de convergência aprovado — Qfazer 2026
**Status:** IN_REVIEW operacional; não modifica decisões de negócio existentes.

## Prioridades por bloqueio
**P0 / dados:** concluir a revisão editorial/reuso por sessão. Até então, 0 sessões públicas. Não contornar com 186 sessões internas. Manter o catálogo completo restrito à homologação e os 43 pendentes/11 descartados excluídos de recomendações.

**P0 / integração hospedada:** responsável de Google/GitHub cria/seleciona conta de serviço de leitura e configura `GOOGLE_SERVICE_ACCOUNT_JSON`, `QFAZER_CATALOG_SHEET_ID`, `QFAZER_CATALOG_SYNC_ENABLED` no GitHub, sem expor credenciais. Testar manualmente o workflow isolado e verificar que só cria PR; não habilitar agendamento nem merge antes de gates.

**P0 / app:** comparar código `p2/` do PR #5 com HTML privado da PO 18/11; corrigir divergências visuais/funcionais sem recriar o design. Homologar quatro abas, busca, filtros, ficha, salvos, comparação até três, saída oficial, ausência de dados fictícios, acessibilidade e mobile/desktop.

**P1 / IA:** definir/validar contrato de candidatos reais, segurança de chave, rate limit, custos e fallback de indisponibilidade; construir com revisão técnica após G5. Não exibir mensagens inventadas.

**P1 / notificações:** implementar consentimento, revogação, gatilhos e persistência conforme baseline, sujeitos a custo R$50/mês; homologar em dispositivos e browsers compatíveis.

**P0 / documentação:** revisar PR #6, concluir Product Studio privado, importar só artefatos aprovados com hashes e permissões. Publicar manifesto de release apenas após G8.

## Dependências e gates
| Gate | Resultado exigido | Dono |
|---|---|---|
| G5 arquitetura | custo, segurança, IA/Push, fluxo de dados/credenciais revisados independentemente | Engenharia + PO |
| G6 Build/QA | integração e testes com evidência por SHA, auditoria de superfície pública | Engenharia |
| G7 UAT | casos de aceitação em aparelhos, status PASS/FAIL, correção de falhas | Product Owner |
| G8 Release | autorização de publicação específica e rollback | Product Owner |

Nenhum chat dispara automaticamente tarefas de outro chat. Para sincronização entre responsáveis, atualizar a aba CURADORIA e PR #5/#6 com os fatos e links correspondentes.
