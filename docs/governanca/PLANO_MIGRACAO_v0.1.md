# Plano de implementação da organização aprovada
**Versão:** 0.1 · **Estado:** IN_REVIEW · **Escopo deste PR:** inventário e governança, **não** implementação de funcionalidades.

## Etapa A — concluída neste PR
- Inventariar código/arquivos presentes na branch P2 e localizar decisões/specs existentes.
- Registrar referências com estado e versão, separar fatos de suposições, preservar os três PRs existentes.
- Registrar hash da referência visual selecionada e bloquear promoção da v0.5 como baseline.
- Definir política de exposição e requisitos mínimos de rastreabilidade.

## Etapa B — pendente: Product Studio privado
Criar repositório privado **específico do Qfazer**; conceder permissões mínimas e revisar titulares dos arquivos. Adotar:
```
01-product/              briefings, decisões de escopo e público
02-design/               design-system, referências e histórico
03-specifications/       REQ, BR, SPEC, jornadas, contratos
04-curadoria/            fontes, modelo, snapshots internos e direitos
05-quality/              cenários UAT, QA e evidências
06-decisions/            logs, ADRs e mudanças
07-releases/             manifests, hashes, histórico e rollback
```
Migrar **cópias válidas**, com hashes, estados e proveniência. Não presumir que a posse de um arquivo implica autorização de compartilhamento.

## Etapa C — pendente: alinhamento de código e requisitos
Comparar a referência HTML (hash no índice) a `p2/` e documentar divergências, resolver a navegação e regressões sem redesenho unilateral. Unificar fontes de catálogo: Sheets operacional, snapshot privado de QA, projeção pública versionada e auditada, com política de direitos.

## Etapa D — pendente: gates técnicos e release
Revisar arquitetura/segurança, executar testes com evidências, UAT da PO, revisão de dados/imagens e autorização expressa G8. Não conectar PR de docs a deploy automático, não alterar P1.

## Bloqueios
- Criação/controle do novo repositório privado não disponível via ferramenta conectada nesta sessão.
- Catálogo/publicação depende de autorizações de reuso e da revisão editorial.
- Prontidão de IA, push, domínio, hospedagem, custo e UAT não demonstrada.
- Histórico completo da Library/Sheets não foi materializado nem aprovado para distribuição.

**Resultado aceitável desta etapa:** índice/estrutura PR aberto para revisão, sem dados internos no Git público.
