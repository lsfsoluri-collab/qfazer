# Qfazer — DEC-G5-25 | Dois protótipos e governança da hospedagem

**Data:** 17/11/2026 · **Status:** APPROVED BY PO · **Fase:** G5 / passagem planejada ao G6

## DECISION — aprovação expressa da Product Owner
1. **Protótipo 1 (legado)** permanece disponível em sua hospedagem Netlify atual, sob a conta de outra integrante que continua na equipe, para **continuar recebendo respostas do formulário de feedback**. Não alterar URL, deploy, formulário, dados existentes nem permissões sem aprovação específica.
2. **Protótipo 2 (Qfazer)** será construído em ambiente **separado** do site legado, a partir do repositório oficial `lsfsoluri-collab/qfazer`, com identidade Qfazer, quatro abas `Início · Salvos · Buscar · Chat`, dados e Web Push conforme baselines aprovadas.
3. **Luana terá controle administrativo** da hospedagem futura do Protótipo 2. A integrante anterior permanece colaboradora de desenvolvimento, com permissões compatíveis com a função e sem necessidade de compartilhar senhas.
4. O domínio `qfazer.com.br`, comprado no Registro.br, será o endereço da futura versão pública, **somente após G7/UAT e autorização de deploy G8**.
5. O teto de custo operacional é **R$ 50/mês**, com aprovação individual para cada serviço. Nenhuma contratação está implícita.

## FACT
- Protótipo 1: site acadêmico anterior publicado na Netlify, com formulário de feedback; painel administrado por outra integrante.
- O nome de domínio comprado inclui **somente registro**, não hospedagem contratada.
- PR #1 do repositório oficial é uma migração em rascunho; não houve merge nem deploy do Protótipo 2.

## ASSUMPTION (a validar)
- Nova equipe/conta Netlify controlada por Luana pode aproveitar o padrão de configuração do protótipo anterior com baixo retrabalho. O fornecedor e os custos **não** estão aprovados.
- A continuidade do formulário na conta legada independe da configuração do novo projeto, desde que não se alterem os recursos compartilhados.

## OPEN_QUESTION
- Confirmação de qual site/conta, plano e limites serão usados para o Protótipo 2, com papéis administrativos documentados.
- Quem será executor e revisor técnico independente da nova arquitetura.
- Como serão acessados, exportados e preservados os feedbacks do legado, se necessário; **não migrar dados pessoais nem exportar respostas sem autorização específica e plano de privacidade**.
- Viabilidade de infra de push, banco e IA no teto mensal, domínio e limites de consumo.

## Regra de não interferência
- **Sem sobrescrever o deploy do Protótipo 1.**
- **Sem conectar o GitHub oficial ao site legado para deploy automático.**
- **Sem editar nem migrar Netlify Forms do legado.**
- **Sem alterar DNS do domínio oficial.**
- Segredos novos por ambiente, sem copiar variáveis de produção anterior.
- Testes do Protótipo 2 em ambiente isolado, com dados sintéticos/autorizados; releases públicos exigem aceite e autorização expressa.
- Se o protótipo antigo for desativado futuramente, fazer change request com responsabilidade pelos feedbacks, comunicação, exportação autorizada e plano de reversão.

## Rastreabilidade
- **REQ-ENV-01:** preservar continuidade do canal atual de feedback.
- **BR-ENV-01:** fluxo de respostas do Protótipo 1 não deve ser afetado pelo desenvolvimento do Protótipo 2.
- **SPEC-ENV-01:** projetos e pipelines de deploy independentes, papéis/segredos isolados, URLs e dados separados.
- **UAT-ENV-01:** ao desenvolver e testar Protótipo 2, URL e formulário do Protótipo 1 continuam funcionando e registram respostas no ambiente correto. **NOT_RUN.**
- **REQ-ENV-02:** Product Owner controla administrativamente a produção nova.
- **SPEC-ENV-02:** papel administrativo concedido a Luana no projeto novo; integrante com acesso limitado à execução; acessos auditáveis.
- **UAT-ENV-02:** acesso administrativo e permissões conferidos sem uso de senhas compartilhadas. **NOT_RUN.**

**Gate:** decisão de negócio aprovada, infraestrutura efetiva a revisar tecnicamente em G5; implementação isolada apenas após avaliação e autorização pertinente. Não é autorização de contratação, alteração de acesso existente, DNS, merge ou deploy.
