# Qfazer — G5 | Validação da arquitetura com catálogo real
**Data:** 17/11/2026 · **Parecer:** tecnicamente plausível, **G5 AINDA NÃO APROVADO** · **Revisor:** Factory (revisão documental + QA local; não independente da arquitetura de autoria própria)

## Resultado objetivo
**Não usar catálogo fictício.** A arquitetura deve integrar os dois lotes reais já produzidos. **Não criar banco para armazenar as 204 sessões nesta etapa**: tratá-las como catálogo JSON versionado, com dois ambientes e publicação controlada; usar persistência separada para inscrições/agendamentos do Web Push.

### Evidência executada localmente
Fontes locais: `catalogo_qfazer_piloto.json` (100 sessões) e `catalogo_qfazer_expansao_v0.1.json` (104). Teste local com 7 assertions/verificações de estrutura/IDs/status/direitos/elegibilidade na fotografia `2026-11-17T12:50:00-03:00`:
- **204 registros e 204 `session_id` únicos.**
- **161** `APTO_PARA_PILOTO`, **33** `PENDENTE_VERIFICACAO`, **10** `NAO_UTILIZAR`.
- **161** futuros elegíveis internos em São Paulo capital no corte indicado.
- **204/204** com `reuso_publico=PENDENTE_REVISAO`; **0** com campo `reuso_publico=LIBERADO`.
- Nenhum dos 161 aptos internos sem início horário ou URL oficial; disponibilidade e preço não estão garantidos.
- **Importante:** dados reais e elegíveis para teste não significam autorização de republicação pública. Evitar afirmar direitos absolutos sem diligência por fonte.

### Arquitetura candidata para o agente de desenvolvimento
1. **Frontend PWA separado:** Netlify candidata em ambiente sob administração da PO. Build público isolado `dist/`, 4 abas, assets aprovados, `manifest`/service worker; o Protótipo 1 Netlify continua intocado coletando Forms.
2. **Catálogo:** JSON real versionado em local privado de homologação; antes de publicar, gerar uma **projeção pública mínima**, **somente** com sessões aprovadas por fonte/atribuição/termos de reuso, futuras, `APTO_PARA_PILOTO`, `codigo_ibge=3550308`; não expor evidências internas brutas. Revalidar perto de 05/12.
3. **Filtros:** determinísticos por data/bairro/categoria/orçamento, preservando os IDs de sessão. Comparar até 3 sessões; preço desconhecido não é gratuito; estoque não verificado não é ingresso confirmado.
4. **IA:** Function protegida da Netlify após corrigir `guia.mjs` (na raiz) versus `netlify.toml` (pasta `netlify/functions`); filtrar primeiro e passar somente IDs candidatos ao LLM, validando IDs retornados, no máximo 3, sem alucinações.
5. **Web Push:** armazenamento separado para token/inscrição consentida e outbox (Neon Postgres candidata), autenticação por dispositivo sem login, revogação, reprogramação e deduplicação; job agendado tenta disparo dentro de `[T-24h, T-24h+5min]`. Não há garantia de chegada ao aparelho nesse intervalo.
6. **Segurança:** segredos em Functions, não em código público; Origin/CSRF, rate limit, device ownership, logs minimizados, retenção e aviso de privacidade, kill switch; fotos de evento só com direitos verificados.
7. **Governança:** a conta do Protótipo 2 é administrada por Luana e não altera o deploy/Forms do legado; DNS `qfazer.com.br` somente após autorização G8.

### Risco crítico de custo e prazo — não comprovado
- [Netlify Free](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/): 300 créditos/mês, limite rígido; custo real depende de build, requests, banda e compute.
- [Neon Free (02/10/2026)](https://neon.com/blog/neon-free-plan-1-gb-per-project): 1 GB e 100 CU-horas/mês. Polling a cada 5 min (~8.640/mês) pode impedir o banco de dormir; se compute mínimo de 0,25 CU ficasse ativo continuamente por 30 dias, consumiria ~180 CU-horas (**exemplo de risco**, não medição).
- [Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/): só cron na versão publicada, Deploy Previews permitem invocação manual; limite 30s. Cron não é SLA de envio de 5 minutos sob falha. Comparar fila sob demanda ou backend Cloudflare/D1 se risco do banco persistir.
- API de IA tem cobrança por tokens separada de ChatGPT Plus. O teto **R$ 50/mês total** exige simulação e aprovação individual de cada fornecedor/serviço, sem auto-upgrade.
- [Web Push em iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) exige PWA compatível instalado e gesto explícito. Android/desktop também terão testes específicos.

### Rastreabilidade mínima REQ → BR → SPEC → UAT
| REQ | BR | SPEC | UAT (NOT_RUN) |
|---|---|---|---|
| CAT | Só sessões reais, aptas, futuras e liberadas para publicação | Projeção JSON autorizada + filtro determinístico + versão + dedupe | Rejeitados/pendentes nunca exibidos; nenhum registro sem liberação pública |
| IA | Recomendar até 3 opções verificáveis | LLM recebe candidatos filtrados e só retorna IDs válidos | Zero evento inventado, expirado ou fora de filtro |
| PUSH | Lembretes 24h e avisos confirmados por dispositivo consentido | Outbox idempotente, cron/fila, autenticação, revogação | Teste iPhone/Android/desktop, falhas e duplicatas |
| PWA | Quatro abas, marca oficial, instalação e navegação | Frontend isolado, manifest e SW com cache do shell | Mobile/desktop, offline honesto, sem vazamento interno |
| ENV | Prototipo 1 continua captando feedback | Sites, CI/CD, contas e dados separados | Legado não sofre modificação durante G6 |

### Gate
**FACT:** QA local do catálogo passou para integridade e regras de elegibilidade; não houve teste de banco, API, Netlify, Web Push, custos, dispositivo ou revisão de licença de eventos.  
**DECISION (PO):** catálogo real, quatro abas, identidade Qfazer, domínio futuro, teto R$50, Push obrigatório em 05/12, +5 min para tentativa de disparo, conta sob Luana, preservação do legado.  
**ASSUMPTION:** Netlify para UI/Functions e JSON estático autorizado é solução de baixo retrabalho; Neon para Push é somente candidata.  
**OPEN_QUESTION P0 (G5):** agente executor deve assinar ADR definitiva com custo total e mecanismo de Push/cron revisável; revisão por outro autor, tratamento de riscos e aprovação da PO. **G5 NÃO PODE SER DECLARADO ENCERRADO sem essas evidências.**  
**OPEN_QUESTION P0 (G8):** autorização de reuso público por fonte e campos; publicar apenas subconjunto explicitamente revisado.

**Estado:** revisão factual e proposta de simplificação concluídas; G5 em revisão, G6 não iniciado. Não autoriza contratação, alteração de DNS, merge ou deploy.
