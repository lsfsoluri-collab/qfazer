# Qfazer — GRILLME G5 | Rodada 2 e infraestrutura contratada
**Data:** 17/11/2026 · **Status:** DECISÕES DE NEGÓCIO REGISTRADAS / G5 EM REVISÃO

## Entradas explícitas da Product Owner
| ID | Tipo | Registro | Consequência |
|---|---|---|---|
| DEC-G5-20 | DECISION | Orçamento operacional teto **R$ 50/mês**, com **aprovação individual prévia de qualquer serviço** | R$ 50 não é autorização de compra, contratação, upgrade automático ou cobrança |
| FACT-G5-21 | FACT | Dispositivos disponíveis para UAT: **iPhone, computador e Android** | Testes de iOS, Android e desktop podem ser planejados; nenhum deles foi executado ou aprovado ainda |
| DEC-G5-22 | DECISION | Lembrete: aceita **até 5 minutos depois do instante de 24 horas antes do evento** | É tolerância para o instante de disparo/aceite pelo serviço; entrega efetiva no dispositivo depende de sistema operacional, rede e provedor |
| OQ-G5-23 | OPEN_QUESTION | Revisor técnico independente **ainda não identificado** | Bloqueia parecer independente e aprovação do gate |
| FACT-G5-24 | FACT | Foi comprado **somente o domínio qfazer.com.br no Registro.br**, sem hospedagem contratada | A infraestrutura de hospedagem/backend/banco/push não está contratada; Netlify permanece **candidata** por compatibilidade com o legado |
| DEC-G5-19 | DECISION anterior mantida | Qfazer público na feira de 05/12/2026 | Requisito de lançamento aprovado; NÃO é autorização de deploy |

## Impactos na arquitetura
- Verificar se o site antigo utiliza conta Netlify já operacional e os limites dessa conta. A existência de uma demo anterior na Netlify não implica nova contratação nem acesso operacional comprovado.
- Registrar.br apenas gerencia domínio/DNS; domínio **não** inclui automaticamente hospedagem, funções, banco, cron ou envio de Push.
- Comparar opções de hospedagem por **custo mensal total**, risco, esforço e possibilidade de PWA + serviço worker + Web Push; priorizar reuso do legado para evitar retrabalho, sem vendor lock-in automático.
- Considerar **teto total R$ 50/mês**, incluindo hospedagem, banco, scheduler/fila, IA, tráfego e eventual provedor extra de push. Despesas únicas e extrapolações exigem aprovação explícita.
- Lembrete com disparo até 5 min depois da janela prevista; gravar `scheduled_for`, `attempted_at` e `sent_at` quando aplicável. Não declarar entrega em 5 minutos: push remoto não tem SLA universal.
- Preparar UAT em iPhone compatível instalado na tela inicial, Android e computador. Capacidade de notificação no dispositivo será confirmada em teste; não supor sucesso.
- Revisão independente pendente; não preencher com aprovação do mesmo executor.

## Bloqueios para fechar G5
1. Escolher infraestrutura/provedor e medir custos do plano **sem contratar**, confirmar Netlify atual e domínio sob gestão da PO.
2. Revisor técnico independente e responsável executor identificados.
3. Prova de Web Push em iPhone e Android compatíveis, com PWA instalado e app fechado, além de teste desktop, revogação e agendamento dentro de 5 min em ambiente isolado.
4. Catálogo público autorizado, segurança e privacidade revisados.
5. Testes, rollback e evidências de build concluídos.

**Status:** planejamento/documentação autorizados. Sem contratação, DNS, deploy, migração de usuários, ativação de Web Push ou serviço externo neste registro.

## Atualização da PO — dispositivos (rodada 2, resposta mais recente)
**FACT-G5-21 corrigido:** a disponibilidade informada é **iPhone, computador e Android**. Esta atualização substitui somente a lista anterior de dispositivos, não altera orçamento, tolerância, domínio, Web Push obrigatório nem o status de revisão independente. **UAT iOS/Android/Desktop: NOT_RUN**.
