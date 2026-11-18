# Qfazer — Estado da consolidação documental
**Data:** 18/11/2026 · **Estado:** IN_REVIEW. Não se trata de relatório de testes da aplicação.

## FACT
1. O Protótipo 1 legado está em `madyeec/qual-a-boa-pime`; branch `main` não foi alterada por esta iniciativa.
2. O código PWA P2, documentação, scripts e testes estão na branch `feat/p2-taxonomia-fotos-scroll` de `lsfsoluri-collab/qfazer`, vinculada a PR #5 draft.
3. `lsfsoluri-collab/qfazer` é **público** e permite escrita da conta conectada. Sua `main` ainda contém documentação e não o P2 completo.
4. A referência visual privada enviada em 18/11 contém 180 sessões embutidas num recorte de 240 registros totais; reuso público pendente. HTML v0.5 não substitui essa referência.
5. Há registros de QA anterior no repositório. **Nenhum teste, novo deploy ou UAT do app foi realizado por este PR documental.**

## DECISION
- Duplo repositório e classificação de arquivos aprovados em 18/11.
- Manter P1 e seus formulários intocados; P2 em isolamento.
- Não inserir dados privados em Git público.

## ASSUMPTION
- O futuro repositório privado e a configuração colaborativa poderão receber os documentos com direitos/acessos validados. Necessário confirmar.

## OPEN_QUESTION / riscos por gate
| ID | Risco | Gate afetado | Encaminhamento |
|---|---|---|---|
| OPEN-REP-01 | Privado ainda não criado | Governança | Criar repo específico, configurar colaboração |
| OPEN-VIS-01 | Implementação P2 pode divergir do HTML aprovado | G6/G7 | Revisão visual/funcional e UAT por versão |
| OPEN-CAT-01 | Reuso de dados e fotos não liberado | G6/G8 | Revisar direitos por campo e fonte |
| OPEN-INT-01 | IA/Push, custo, LGPD e segurança não homologados | G5/G6/G7 | Parecer técnico independente e testes |
| OPEN-REL-01 | Não há aceite de release | G8 | Plano de rollback, UAT e autorização específica |

## Gate de aprovação
A PO aprovou a **estrutura de versionamento**; as especificações de sua execução e este índice estão em revisão até conferência. Não promover PR automaticamente.

## Atualização cruzada: 18/11/2026
- **FACT SHEETS:** leitura direta de 240 registros, 240 IDs distintos; 186 aptos internos, 43 pendentes, 11 não utilizar, 0 com aprovações públicas/editoriais.
- **FACT GITHUB:** PR #5, commit `d8b6e15`; checks de código/Chromium `success` para esse SHA. Este PR de governança foi sincronizado sem tocar nos arquivos do aplicativo.
- **BLOCKED:** credencial Google de serviço / ID nas variáveis e ativação do workflow na branch principal; revisão de direitos/editorial das sessões; homologação UAT; decisões de IA e Push.
- **NEXT:** revisar PR #6 → finalizar revisão de especificações G5 → executar UAT G7 em ambiente isolado → apenas com gate G8 publicar release. Nenhuma coleta ou sincronização ao vivo foi ativada.
