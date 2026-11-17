# Qfazer — G5 | Comparativo de infraestrutura, custos e escolha candidata
**Versão:** 0.2 · **Data:** 17/11/2026 · **Estado:** IN_REVIEW · **Sem contratação, alterações de DNS, deploy ou testes reais**

## 1. Contexto e decisões vinculantes
- Protótipo 1: site Netlify na conta de outra integrante, continua ativo para captar feedbacks. **Não tocar.**
- Protótipo 2: ambiente separado e sob **controle administrativo de Luana**, repositório `lsfsoluri-collab/qfazer`, domínio futuro `qfazer.com.br` registrado no Registro.br.
- Feira: **05/12/2026**, acesso público previsto, PWA com 4 abas, catálogo real publicável, IA e Web Push obrigatório em plataformas compatíveis.
- Orçamento total de operação: **R$ 50/mês**, sujeito à aprovação individual de cada serviço.
- Testes disponíveis: iPhone, Android e computador.
- Lembrete: iniciar tentativa de disparo no período de **até 5 minutos após** `inicio_evento - 24h`, sem garantia de entrega pelo dispositivo.
- Revisor técnico independente: **OPEN_QUESTION**.

## 2. Comparação por consequências
| Critério | A. Netlify Free + Neon Free + Web Push nativo | B. Netlify + Netlify Database | C. Cloudflare Workers + D1 |
|---|---|---|---|
| Reuso do protótipo anterior | Alto: HTML e Functions de Netlify | Alto | Médio/baixo: reescrever o backend |
| Hospedagem e HTTPS | Netlify | Netlify | Cloudflare |
| Banco | Neon Postgres | Netlify Database (Postgres) | D1 (SQL) |
| Agendamento | Netlify Scheduled Functions | Netlify Scheduled Functions | Workers Cron |
| Esforço | Moderado | Moderado | Médio/alto |
| Risco central | banco pode esgotar CU-hours por acionamento recorrente | créditos compartilhados entre DB, funções, tráfego, deploy | limites Worker Free de CPU e adaptação para integração IA/Push |
| Governança | 2 provedores, secrets separados | 1 provedor, maior concentração de créditos | 1 provedor, mais migração |
| Custo mensal verificado | NÃO: apenas limites públicos gratuitos | NÃO: crédito por uso depende de workload | NÃO: depende de uso e limitações |
| Parecer | **candidata preferida para revisão de engenharia, não aprovada** | fallback em caso de menor custo operacional comprovado | alternativa se A/B falharem |

## 3. Fontes públicas e limites confirmados, consultados em 17/11/2026
1. **Netlify credit-based Free:** 300 créditos/mês e limite rígido. Requisições: 2 créditos por 10 mil; web bandwidth: 20 créditos por GB; compute: 10 créditos por GB-hora; banco usa créditos também. A conta antiga pode estar em plano Legacy; a conta nova deve ser consultada no painel. Fontes: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ e https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/
2. **Netlify Scheduled Functions:** agenda UTC, execução agendada de até 30 segundos; não roda automaticamente em Deploy Previews, somente na versão publicada, exigindo staging isolado para validar. Fonte: https://docs.netlify.com/build/functions/scheduled-functions/
3. **Neon Free:** a comunicação oficial de 02/10/2026 confirma 1 GB por projeto e 100 CU-horas de compute/mês, com escalonamento; custo $0 dentro dos limites. Fonte: https://neon.com/blog/neon-free-plan-1-gb-per-project
4. **Cloudflare Workers Free:** até 100 mil requests/dia, 10 ms de CPU/request e 128 MB RAM; invocações a APIs externas são possíveis mas precisam de teste de CPU e IO, restrições e segurança. Fonte: https://developers.cloudflare.com/workers/platform/limits/
5. **Cloudflare D1:** limites de leitura/gravação/armazenamento; checar tabela de preços atual no momento da escolha. Fonte: https://developers.cloudflare.com/d1/platform/pricing/
6. **OpenAI API:** cobrança independente de ChatGPT Plus, medida por tokens. `guia.mjs` legado usa `gpt-4.1-mini` por padrão e a Responses API; confirmar preço atual e escolher modelo/teto de tokens com o executor. Fonte: https://developers.openai.com/api/docs/models/gpt-4.1-mini

## 4. Custos por cenário — hipóteses, não cotação
São cenários de planejamento; **não há métricas reais do Protótipo 2 nem preços de todos os provedores na conta do projeto**.

| Variável | Baixo | Piloto público | Estresse feira |
|---|---:|---:|---:|
| Sessões/visitas de usuário ao mês (HIPÓTESE) | 100 | 1.000 | 5.000 |
| Interações IA por visita (HIPÓTESE) | 1 | 2 | 3 |
| Chamadas IA mensais (CALCULADO) | 100 | 2.000 | 15.000 |
| Mensagens Push/mês (HIPÓTESE) | 100 | 1.000 | 5.000 |
| Funções cron / 30 dias com polling de 5 min (CALCULADO) | 8.640 | 8.640 | 8.640 |

**Atenção a cenários:**
- Cron periódico de 5 min dispara aproximadamente 8.640 vezes em 30 dias independentemente de usuários. Essa é contagem de execuções, não dinheiro.
- CPU, memória, duração, volume do DB, tempo ativo Neon, bandwidth e quantidade de tokens são variáveis a medir; estimar valor em R$ sem esses dados seria falsa precisão.
- Um banco que suspende após inatividade pode não voltar a dormir se o cron consultar a cada 5 min. Esse risco pode tornar A inviável no tier gratuito, apesar de 1 GB de armazenamento disponível.
- O custo da IA não está incluído na assinatura ChatGPT da PO. Confirmar conta de faturamento, limites de uso e prevenção de abuso.
- **Não considerar plano Free como disponibilidade garantida para a feira.** Estabelecer medição e política de fallback quando atingir cota.

## 5. Estratégia de mitigação e viabilidade
- Engenharia deve escolher scheduler baseado em consulta periódica *somente* após simular 1 semana de carga/consumo, ou propor uma fila sob demanda que mantenha o DB elegível a auto-pause.
- Para a tolerância `0..5 min`, poll exatamente a cada 5 min pode sofrer atraso; validar margem/buffer e concorrência, sem prometer SLA de entrega do SO.
- Separar envio do Web Push, outbox idempotente, inscrições e registros de eventos. Assinatura só após consentimento; revogação e reprogramação com verificação imediata antes do envio.
- Limite de tokens/requisições de IA, quotas por dispositivo/IP e kill switch de push; bloquear exposição de dados internos, segredos e documentos.
- Em Netlify Free, esgotar créditos pode suspender site; definir monitoramento e ações preventivas antes da feira.
- Definir limites máximos de gastos separados para IA e infraestrutura, dentro do teto total, mantendo auto-upgrade desativado sem nova autorização.

## 6. Governança de ambientes
```
Netlify da integrante → Protótipo 1 (intocado, formulário preservado)
GitHub oficial → branch de integração do Protótipo 2
Nova conta/equipe sob administração de Luana → staging independente → produção futura
Registro.br qfazer.com.br → DNS só no Gate G8 autorizado
```
A criação de conta/contratação de serviços, concessão de acesso, configuração de segredos e alterações de DNS exigem autorização e execução controlada. **Nenhuma ação dessa natureza ocorreu neste comparativo.**

## 7. Critérios para fechar G5 (não confundir com G6/G7)
1. Escolha técnica A/B/C justificada por custo operacional estimado e riscos; documentação de reversibilidade e donos de ambiente.
2. Contratos completos dos endpoints de IA/catálogo/push e modelo de dados com permissões, rate limiting, revogação e idempotência.
3. Riscos de segurança/privacidade, orçamento e de direitos do catálogo tratados com donos e plano.
4. Matriz UAT prevista iPhone/Android/desktop, tolerância push, cenários negativos, rollback e custos.
5. Revisão técnica independente assina parecer e PO aprova consequências de negócio.
**Testes reais e publicação pública pertencem a G6/G7/G8**, não são condição isolada para aprovar o desenho G5.

## 8. Registros
- **FACT:** domínio comprado sem hospedagem; Netlify antiga pertence à integrante que continua na equipe; orçamento R$ 50/mês; dispositivos iPhone/Android/desktop.
- **DECISION:** Protótipo 1 inalterado; Protótipo 2 com administração de Luana; Web Push obrigatório; 4 abas; público em 05/12.
- **ASSUMPTION:** Netlify + Neon apresenta menor retrabalho, mas pode falhar por custos/consumo.
- **OPEN_QUESTION:** limites/planos reais, estratégia de backend, revisão independente, propriedade de chaves e conta da API de IA, direitos do catálogo público.

**Status final: G5 IN_REVIEW — arquitetura candidata documentada, não certificada.**
