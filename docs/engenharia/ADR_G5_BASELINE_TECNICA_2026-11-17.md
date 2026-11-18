# Qfazer — G5 | Baseline de engenharia proposta e evidência inicial de build
**Data:** 17/11/2026 · **Versão:** 0.3 · **Estado:** TECH_BASELINE_DEFINED / PEER_REVIEW_PENDING · **Autor:** agente de desenvolvimento nesta sessão. **Não equivale a revisão independente nem aceite formal da PO.**

## DECISION técnica proposta para o Protótipo 2
1. **Hospedagem:** site Netlify novo em conta sob controle administrativo da PO; **não** reutilizar o site ID, pipeline, Forms, credenciais ou DNS do Protótipo 1. Netlify Free somente se os limites no painel forem compatíveis; nenhuma conta criada/contratada neste ato.
2. **Frontend:** PWA HTML/CSS/JS modular (sem framework e sem dependências de runtime) em `p2/`. `netlify.toml` publica exclusivamente `p2`, Functions futuras isoladas em `netlify/functions`. A versão de fundação já existe em `feat/qfazer-p2-shell`.
3. **Dados de eventos:** os arquivos reais da pesquisa continuam FORA do repositório e do build público. Para testes em dispositivo controlado, o PWA aceita **importação local** do lote interno com `?homologacao=1`. Para publicação, gerar `p2/catalog-public.json` derivado somente de sessões com `reuso_publico=LIBERADO`, `status=APTO_PARA_PILOTO`, data futura, SP capital e URL oficial HTTPS. Não criar banco de eventos no MVP.
4. **IA:** Netlify Function privada recebe intenção, filtra candidatos no catálogo primeiro e solicita ao modelo somente a escolha de até três IDs; saída validada no servidor; sem acesso do cliente à chave. Modelo e teto de tokens por chamada serão escolhidos no G6 com aprovação **individual** da conta API. Não habilitar IA real antes de confirmar conta, gastos e proteção contra abuso.
5. **Push:** Netlify Functions + **Neon Postgres Free como candidato de persistência** para inscrições, vínculos de salvos, envios pendentes e idempotência; alternativa Cloudflare D1/Workers se o plano/consumo reprovar. A função agendada executa **checagem leve do índice público de sessões a cada minuto**, mas **não consulta o banco** quando não houver lembrete vencendo ou alteração urgente confirmada. O núcleo `shared/schedule.js` e 4 testes já estão implementados.
6. **Evento/usuário:** sem login; salvos locais. Somente após consentimento de Push o servidor armazena assinatura e IDs mínimos, associados a dispositivo anônimo protegido por cookie HttpOnly/Secure/SameSite e checagem de Origin/CSRF, em arquitetura de mesma origem. Opt-out revoga vínculos. Nenhum uso promocional. O modelo de remoção e retenção será validado antes de processamento real.
7. **Agendamento:** cada lembrete vence 24h antes do início em UTC; tentativa observável entre `scheduled_at` e `scheduled_at+5min`; atrasos externos/falhas são registrados, sem prometer SLA de entrega ao SO. Reagendamento/cancelamento revoga jobs anteriores; chave idempotente por dispositivo, sessão, revisão e instante. Mudanças confirmadas dispararão processamento de alteração após a curadoria. Não instalar scheduler sem homologação real.
8. **Governança:** release em `qfazer.com.br` depende de G7/G8. O Protótipo 1 Netlify e seus feedbacks continuam intocados.

## Racional de custos — simulações, NÃO fatura nem medição
Fontes oficiais consultadas em 17/11/2026:
- Netlify Free: 300 créditos/mês com limite rígido; deploy de produção usa créditos e compute de Functions é faturado em unidades de crédito. https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- Scheduled Functions em todos os planos; cron de published deploy, não disparado automaticamente em preview: https://docs.netlify.com/build/functions/scheduled-functions/
- Neon Free: 1 GB e 100 CU-horas/mês conforme anúncio 02/10/2026: https://neon.com/blog/neon-free-plan-1-gb-per-project
- Alternativa Cloudflare D1 Free: 5M linhas lidas/dia, 100k escritas/dia, 5 GB; ao exceder, operações falham sem auto-billing no plano Free: https://developers.cloudflare.com/d1/platform/pricing/
- OpenAI API tem preço variável por tokens e conta separada de ChatGPT Plus: https://developers.openai.com/api/docs/pricing

**Cenário de planejamento:** checagem a cada minuto gera 43.200 invocações/30 dias, mas sem despertar Neon quando não há evento em janela. A 0,1s e 128 MB por chamada, consumo de compute meramente hipotético ≈ 0,15 GB-h/mês, sem incluir overhead, rede, banco, banda, chamadas de IA nem produção. Exige medição real. No modelo anterior com consulta ao Neon a cada 5min, 8.640 consultas mensais poderiam manter compute acordado e superar o Free; por isso ele está **descartado** como padrão.

**Proteção comercial:** limite operacional **R$ 50/mês total**. Sem auto-upgrade, cartão, conta API ativada, backend real ou contratação. A produção do MVP só ativa IA e Push após validação de uso/cotas e aprovação do serviço individual.

## Modelo de ameaça e controles (baseline de G5)
| Risco | Controle planejado | Evidência necessária em G6/G7 |
|---|---|---|
| Cliente publica dados internos | `p2/` único publish; projeção por direitos; verificação de artefatos | auditoria build com lista de arquivos públicos |
| IA inventa eventos | filtros determinísticos, IDs válidos checados após LLM | testes de prompt malicioso, eventos vencidos, filtros, no máximo 3 |
| Outro dispositivo altera salvos/assinatura | token opaco seguro em cookie HttpOnly, Origin/CSRF, rate-limit | testes de adulteração e revogação |
| Push duplicado/atrasado | índice de agenda, rechecagem no envio, chave idempotente, outbox, monitoramento | relógio controlado e logs da tentativa, iOS/Android/desktop |
| Exaustão de custos | contas Free sem auto-upgrade, quota da API, rate-limit, kill switch | dashboard de consumo e desligamento em testes |
| Privacidade do usuário | minimização, consentimento, exclusão e retenção, logging sem endpoint | revisão de aviso e inspeção do banco |
| Protótipo 1 interrompido | outro projeto, outra conta, sem DNS ou merge para legado | contraste da URL e Forms antes/depois |

## Testes executados (evidência do código, não de hosting)
- **10/10 testes unitários Node passaram**, com lote real de 161 sessões testado localmente como uso interno e 0 como publicável.
- **20/20 interações automatizadas em Chromium passaram** em 390px mobile e 1360px desktop com HTML/JS injetado localmente, sem tráfego externo: quatro abas, importação de 161 sessões, busca 17 resultados para “MASP”, salvar, comparar, Chat não-fictício, sem overflow e sem erro JS.
- **Não testado:** runtime HTTP normal via navegador (bloqueado pela política de ambiente do executor), PWA instalado, service worker em HTTPS, iPhone/Android físico, Netlify/Neon, push real, API de IA, custo real, deploy e UAT humano.

## Rastreabilidade e progresso real
| REQ/BR | SPEC implementada | UAT | Situação |
|---|---|---|---|
| REQ-UX-NAV-01/BR-UX-NAV-01 | 4 abas funcionais em `p2/` | navegação mobile/desktop | QA automático PASS; UAT humano NOT_RUN |
| REQ-S1-03/BR-S1-03 | manifesto e service worker de shell | instalação PWA | código criado; dispositivo NOT_RUN |
| REQ-CAT/BR-ELEG | carregamento local real, filtros e comparação, bloqueio de reuso público | exclusão de pendentes | testes Node/Chromium PASS; release BLOQUEADO |
| REQ-SALVOS/BR-LOCAL | localStorage no dispositivo | save/remover | QA navegador PASS; UAT humano NOT_RUN |
| REQ-PUSH/BR-24H | core determinístico `shared/schedule.js` | tempo+idempotência | 4 testes unitários PASS; servidor NOT_RUN |

## Condição do gate
**FACT:** engenharia de frontend iniciou em branch e testes locais passaram. Provedores reais, gastos e Web Push não foram acionados. Catálogo de reuso público segue 0/204 liberado na base auditada em 17/11.

**DECISION técnica proposta:** Netlify novo + JSON real sob projeção pública + Function de IA + Neon candidato para Push com cron de índice esparso. Sem pagamento/contratação.

**ASSUMPTION:** a frequência de cron leve e a esparsidade dos eventos manterão a DB dentro da cota. **Não comprovado sem ambiente real.**

**OPEN_QUESTION bloqueante de aprovação formal G5:** revisão técnica independente de autor distinto; validação financeira/segurança no ambiente escolhido, responsabilidade operacional do Push e aceite específico da baseline pela PO. Como este ADR foi redigido pelo mesmo agente que implementou o código, **não representa revisão independente**. A autorização ampla da PO para avançar tarefas reversíveis não equivale a contratação, deploy nem autocertificação de gate.

**Estado honesto:** `G5 TECHNICAL BASELINE DOCUMENTED, FORMAL GATE IN_REVIEW`; `G6 reversible preparatory build IN_PROGRESS`, sem deploy. Gate não pode ser declarado fechado sem revisão independente e aceite por versão.
