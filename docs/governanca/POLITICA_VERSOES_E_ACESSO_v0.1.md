# Política operacional — versões, acesso e proteção de dados
**Versão:** 0.1 · **Estado:** IN_REVIEW; organização em dois repositórios aprovada pela PO.

## Estados de artefato
- **DRAFT:** material de trabalho não aprovado.
- **IN_REVIEW:** pronto para revisão, com pendências rastreadas.
- **APPROVED:** aprovado por responsável identificado para **escopo e versão específicos**.
- **RETIRED:** não vigente; preservado como histórico, sem exclusão do controle.

Os estados de artefato não substituem estados de engenharia como `PEER_REVIEW_PENDING`, `PASS/FAIL/BLOCKED/NOT_RUN` ou autorização de publicação `LIBERADO`.

## Metadados obrigatórios para cada nova versão
`ID`, `nome`, `versao`, `estado`, `origem`, `data`, `aprovador` (se houver), `commit SHA/arquivo SHA-256`, `dependencias`, `risco`, `substitui`, `requisitos/decisoes`, `evidencias de QA/UAT`, `status de publicação`.

## Regras de Git
1. Desenvolver em branch dedicada, PR em rascunho para revisão. Não alterar `main` por conveniência.
2. Revisar diff, compatibilidade com P1 e P2, testes e conteúdo do pacote antes de merge.
3. Releases devem ter tag/manifesto imutável, hash do código e do catálogo público aprovado, responsável por homologação e plano de rollback.
4. Nunca copiar tokens, chaves, `.env`, respostas de formulários, documentos com dados pessoais, fotografias sem licença, planilha privada ou catálogo interno para Git público.
5. URLs externas/citações podem estar em documentação pública quando lícitas; não equipará-las a licença de redistribuição.
6. O catálogo público só pode ser gerado a partir de permissões explícitas por sessão e campo; nenhuma automação pode promover `PENDENTE_REVISAO`.
7. Dados privados e histórico ficam em repositório privado, com equipe e retenção definidas. **Privado não dispensa base legal, revisão de acesso e consentimento quando aplicável.**
8. Artefato ausente ou sem aprovação deve ser marcado `PENDENTE`; nunca reconstruído silenciosamente.

## Estratégia de reversão
Git: reverter commit/merge; app: implantar versão anterior aprovada somente com autorização de release; catálogo: reverter projeção pública e revogar entradas. O funcionamento do formulário P1 não pode ser interrompido para corrigir P2.
