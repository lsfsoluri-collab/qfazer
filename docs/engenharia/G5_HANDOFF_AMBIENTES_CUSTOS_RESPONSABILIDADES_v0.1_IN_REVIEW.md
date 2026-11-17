# Qfazer — G5 | Handoff: dois ambientes, conta, custos e segurança

**Data:** 17/11/2026 · **Estado:** IN_REVIEW / NÃO AUTORIZA DEPLOY OU CONTRATAÇÃO

## Topologia decidida (nível de negócio)
```
Protótipo 1 / site legado (Netlify da integrante)
  └── URL e formulário existentes continuam ativos, sem mudanças

GitHub oficial: lsfsoluri-collab/qfazer
  └── branch isolada + PR #1
       └── Protótipo 2 (nova infraestrutura sob administração de Luana)
            ├── ambiente preview/homologação, sem exposição dos dados internos
            └── produção futura em qfazer.com.br, após G8 e aceitação
```

## Escopo de engenharia para proposta de aprovação G5
| ID | Tarefa | Evidência necessária | Responsável | Estado |
|---|---|---|---|---|
| G5-ENV-01 | Identificar titular de site antigo e confirmar continuidade da coleta | confirmação da integrante, sem credenciais compartilhadas | PO + integrante | PENDENTE |
| G5-ENV-02 | Propor nova conta/equipe e funções de acesso ao Protótipo 2 | plano de papéis owner/backup/dev/revisor; conta futura sem gasto | PO + engenharia | EM REVISÃO |
| G5-ENV-03 | Avaliar Netlify nova vs alternativa, incluindo banco, jobs, push e IA | tabela de custo com premissas/limites e teto R$ 50 total | engenharia | PENDENTE |
| G5-ENV-04 | Propor build isolado com diretório público próprio e Functions isoladas | layout `dist/`, `netlify/functions/`, no secrets, no internal CSV, deploy-preview protegido | engenharia | ESPECIFICADO, NÃO TESTADO |
| G5-ENV-05 | Fechar contratos de subscrição e job com prazo de 5 min | diagramas/API, autenticação de dispositivo, deduplicação, erros, limpeza e rate limit | engenharia | ESPECIFICADO, REVISÃO PENDENTE |
| G5-ENV-06 | Planejar controle de custos e abuso | alertas, cotas, kill-switch push, limites de IA e plano de interrupção | engenharia + PO | PENDENTE |
| G5-ENV-07 | Plano do formulário antigo | coleta mantida, acesso e retenção dos feedbacks preservados; eventual exportação só autorizada | PO + integrante | DECIDIDO, EVIDÊNCIA PENDENTE |
| G5-ENV-08 | Parecer independente | revisão de segurança, arquitetura, custo, viabilidade do prazo e mitigação dos riscos | revisor distinto do autor | PENDENTE |
| G5-ENV-09 | Gate humano | aceite da baseline e autorizações específicas para gastos/acessos/deploy | PO | PENDENTE |

## Matriz de papéis proposta
| Atividade | Luana (PO/admin novo) | Integração/desenvolvimento | Revisor independente |
|---|---|---|---|
| Regra de negócio, branding, orçamento | aprova | consulta | verifica consequências |
| Criação/gerência de conta da nova hospedagem | controla/administra | acesso mínimo necessário | consulta |
| Construção, código, pipeline de preview | supervisiona | executa | revisa |
| Segredos e credenciais | autoriza política de acesso | configura somente se autorizada, sem expor em commits | audita |
| Testes automatizados e UAT em dispositivos | coordena e executa UAT | executa QA | valida independência |
| Deploy público / DNS | autoriza separadamente | executa depois de aceite | verifica checklist |
| Site antigo e Forms | preserva coleta; solicita relatório se necessário | titular da conta gerencia, sem interferência | verifica isolamento |

## Critérios de separação e segurança
1. **Nunca reutilizar o site ID/pipeline de deploy do antigo como destino da nova branch** sem change request. O simples fato de ambas usarem Netlify não torna as configurações compartilhadas.
2. No repositório oficial público, manter somente documentação sanitizada e código sem secrets; catálogo interno, fontes cuja licença de redistribuição não foi provada e respostas do Forms ficam fora da publicação.
3. Não copiar `OPENAI_API_KEY` nem outros secrets do projeto anterior. Configurar novas credenciais após autorização explícita.
4. Evitar sincronização de feedback do antigo para o banco do Protótipo 2 neste momento. A meta é manter pesquisa em execução, não migrar dados pessoais.
5. Não alterar `qfazer.com.br` até gate de release: conexão DNS, domínio na hospedagem e certificado devem ser parte do plano G8.
6. Alvo de Web Push: iOS, Android e desktop em condições compatíveis; testes de entrega com PWA fechado no G6/G7, nunca declarar antes de evidência.

## Gate G5 e próximo checkpoint
**Fechamento G5 exige:** arquitetura escolhida com custos/contingência, dono dos ambientes e acessos, política de privacidade/segurança suficiente, contratos/UAT planejados, riscos tratados e revisão independente registrada. **Não exige concluir execução dos UAT reais**, que pertencem ao G6/G7.

**Resultado atual:** decisões de negócio e proposta operacional documentadas; arquitetura financeira/técnica ainda NÃO aprovada. Implementação principal permanece condicionada ao gate.
