# Qfazer — Parecer técnico G5: arquitetura, segurança, Web Push e reversão
**Versão:** v0.1 (proposta submetida à revisão técnica independente)  
**Data-base:** 17/11/2026 · **Estado:** IN_REVIEW / G5 NÃO APROVADO  
**Meta de negócio:** MVP público em 05/12/2026; Web Push real obrigatório em dispositivos compatíveis; acesso sem cadastro; quatro abas Início, Salvos, Buscar e Chat.  
**Aprovação de negócio:** Product Owner. **Arquitetura / segurança / execução:** engenharia e revisor independente, ainda não designados/comprovados. Nenhum deploy, contratação, acesso a credenciais ou tratamento de dados reais foi autorizado por este parecer.

## 1. Fontes e evidências
- Baseline funcional `QUAL_A_BOA_PWA_BASELINE_FUNCIONAL_v0.3_REV7_APPROVED.md`, DEC-005..011, REQ-011..013 e SPEC-011..013.
- `FACTORY_CONSTITUTION.md`, `PROJECT_LIFECYCLE.md`, `GRILLME_PROTOCOL.md`, `SPEC_STANDARD.md`, `UAT_PROTOCOL.md` e `AUTONOMY_POLICY.md`.
- Repositório novo (PR #1): `index.html` (~898 linhas), `guia.mjs` (~51), `netlify.toml` (`publish="."`; `functions="netlify/functions"`), `_headers`, `robots.txt`; árvore anterior possui imagens binárias ainda não migradas.
- Fontes técnicas consultadas em 17/11/2026: [Netlify Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/), [Netlify Functions](https://docs.netlify.com/build/functions/configuration/), [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/), [Netlify Billing](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), [MDN PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription), [Apple WebKit Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/), [ANPD](https://www.gov.br/anpd/pt-br).
- Não houve acesso ao painel da Netlify, suas credenciais, preços específicos da conta, banco ou dispositivos físicos. Nenhum teste em runtime, cobrança, carga ou entrega de Push foi executado.

## 2. Achados técnicos atuais
| ID | Severidade | Evidência | Impacto |
|---|---|---|---|
| A-01 | CRITICAL | `publish="."` | Publicação de arquivos não destinados à web se copiados ao diretório raiz; separar build público de documentos, fontes privadas, testes e funções. |
| A-02 | CRITICAL | Não há `manifest.webmanifest`, service worker, inscrição Push nem backend de push no código verificado | Requisito de Web Push obrigatório ainda não implementado. |
| A-03 | HIGH | `guia.mjs` está na raiz, enquanto a pasta de Functions configurada é `netlify/functions` | Integração de IA possivelmente inoperante; não atribuir status PASS sem teste. |
| A-04 | CRITICAL | Catálogo de 10 sessões fictícias replicado no HTML e em `guia.mjs` | Recomendações não utilizam base real. O produto não pode afirmar funcionar com sessões reais. |
| A-05 | CRITICAL | 204 registros com reuso público pendente | Nenhuma das 161 aptas internas é automaticamente publicável; criar projeção pública liberada. |
| A-06 | HIGH | Não há prova de mecanismo servidor para associar inscrição a sessões salvas e impedir edições não autorizadas | Risco de notificações indevidas, subscription hijacking e spam. |
| A-07 | HIGH | Não há verificação de acesso ao Netlify nem orçamento, ambiente de teste, backup ou roteiro de reversão | Bloqueia G5/G8. |
| A-08 | HIGH | Formulários Netlify antigos e ausência de textos/política de privacidade para push | Não habilitar usuários reais até revisão e minimização LGPD. |
| A-09 | HIGH | Promessa obrigatória de lembrete 24h e avisos confirmados | Agendamento, deduplicação, atualização e revogação precisam de persistência confiável. |

## 3. Arquitetura candidata A — menor superfície operacional
```
Navegador / PWA (HTTPS)
  ├── frontend (4 abas), manifest, service worker
  ├── salvos em armazenamento local (IDs canônicos)
  └── permissão de Push só após convite e clique
       │ chamadas HTTPS same-origin; cookie opaco seguro
       ▼
Netlify Functions (fora do diretório público)
  ├── catalogo / busca / recomendacao (somente projeção pública autorizada)
  ├── push-inscrever / push-preferencias / push-revogar
  ├── eventos de atualização confirmados
  └── gateway operacional com autenticação restrita
       │ SQL parametrizado, segredos exclusivos de Functions
       ▼
Banco relacional (projeto, schema e acessos separados)
  ├── public_sessions (apenas fonte liberada e futura)
  ├── device_sessions (id aleatório não adivinhável, expiração)
  ├── push_subscriptions (endpoint/keys criptografáveis; mínimo necessário)
  ├── saved_session_links (device_id, session_id, ativo)
  ├── notification_outbox (tipo, versão, instante, status, idempotency_key)
  └── audit_events (sem guardar payload sensível)
       ▲
       │
Job agendado autenticado (Netlify Scheduled Function)
  └── consulta pendências vencidas; revalida elegibilidade e consentimento
      imediatamente antes de enviar via protocolo Web Push
```
**Decisão proposta (não aprovada):** Netlify para frontend/funções + banco relacional gerenciado (Netlify Database ou outro fornecedor aprovado) + job agendado. Não presumir preço zero. Priorizar um fornecedor conhecido e não adicionar pgvector, coleta automática, checkout ou sincronização de contas.

### Alternativa B — fila sob demanda
Netlify + banco relacional + serviço externo de mensagens adiadas (ex.: QStash, sujeito a contrato, limites e orçamento). Pode evitar consultas de agendamento frequentes, mas exige um fornecedor extra, callbacks autenticados, controle de reprogramação/revogação e tratamento de mensagens com atraso superior aos limites do plano. Exemplo: [QStash delay, limite gratuito de até 7 dias](https://upstash.com/docs/qstash/features/delay).
**Recomendação de engenharia para análise:** começar com A para simplicidade operacional **apenas se** o custo estimado das consultas/jobs for aceitável e o relógio cumprir critério de 24h. Se não, comparar B com prova de revogação/atualização antes de decidir.

### Alternativa C — plataforma terceirizada de Push
Pode reduzir programação de envio, mas eleva dependência de fornecedor, contratos/privacidade e o desafio de vincular notificações com segurança aos IDs salvos sem login. Exige POC e avaliação. Não recomendada sem comprovar os fluxos personalizados.

## 4. Contratos técnicos candidatos (sem implementar)
- `GET /api/events`: lista somente eventos publicáveis, `status=APTO_PARA_PILOTO`, início futuro, `codigo_ibge=3550308`, `reuso_publico=LIBERADO` após revisão; paginação e projeção mínima. Nunca envia registros rejeitados/pendentes nem auditoria bruta.
- `POST /api/device/init`: cria sessão anônima com token opaco; vinculação a cookie `Secure`, `HttpOnly`, `SameSite` com duração e rotação definidas; CSRF/origin/replay protegidos. Não usar `session_id` de evento como credencial.
- `POST /api/push/subscribe`: recebe PushSubscription após ação consentida; valida origin, autenticação do dispositivo, formato/chaves/tamanho, rate limiting e escopo; armazenar só campos necessários, sem duplicar inscrição.
- `PUT /api/push/preferences`: controle geral de notificações; validar identidade do dispositivo e permissão; desligamento impede envios futuros sem apagar salvos locais.
- `PUT /api/device/saved-sessions`: sincroniza somente associações de IDs salvos **para notificações consentidas**, não cria conta ou histórico genérico; valida IDs autorizados, cardinalidade e propriedade.
- `DELETE /api/push/subscribe`: revogação por dispositivo autenticado, invalida jobs/outbox; mesma operação é idempotente.
- `POST /internal/catalog/publish`: **exclusivamente operador autenticado**, publica alteração confirmada, invalida agendamentos antigos, recalcula ou cancela; nunca aceitar requisição anônima ou pública.
- Worker processa apenas outbox autorizada e revalida `active`, versão da sessão, cancelamento, agendamento e dispositivo antes do envio; idempotência via chave `subscription_id + session_id + tipo + versao/instante`, com transação e controle de concorrência.

## 5. Regras de negócio da baseline preservadas
- Salvos locais sem login e sem sincronização entre dispositivos. O servidor recebe apenas associação mínima consentida para enviar alertas.
- Convite após primeiro salvo. Sem interação positiva não solicitar permissão nativa. Recusa não impede uso do produto.
- 1 lembrete no instante `inicio - 24h` para sessão com horário confirmado; fuso `America/Sao_Paulo`. **Precisão temporal/tolerância operacional ainda requer definição**, pois polling a cada 5/15 min não é igual a disparo exato.
- Mudança confirmada de data/hora/local gera aviso único por versão publicada. Cancelamento confirmado envia aviso, impede lembrete de comparecimento. Sessão sem hora não recebe lembrete.
- Revogar geral ou remover um salvo cessa novos envios. Reprogramação de evento não emite aviso sobre a data antiga.
- iOS/iPadOS: suporte apenas nas condições compatíveis, com web app adicionado à tela de início e gesto explícito; no restante usar capability detection. Não prometer entrega universal.
- Nunca disparar sobre sessões pendentes/rejeitadas ou não publicáveis; não confundir `APTO_PARA_PILOTO` com autorização pública.

## 6. Segurança e privacidade — controles mínimos
1. **Segredos**: VAPID private key, credenciais do banco, chave administrativa, API de IA somente em secret store do fornecedor e escopo de Functions; nunca em Git, frontend, arquivos `.env` públicos ou logs.
2. **Autorização**: sessão de dispositivo por cookie HttpOnly; verificar Origin/CSRF, token de operação e rate limit em mutações; validação de URLs para evitar SSRF. Assinatura Push é dado confidencial de roteamento; não usar como bearer token de acesso aos demais registros.
3. **Mínimo de dados**: permitir apenas IDs salvos consentidos, dados técnicos de inscrição, timestamps e status. Sem nome, e-mail, telefone, localização precisa, histórico de chat ou marketing.
4. **Operação**: endpoint operacional administrativo inacessível ao visitante, restrição por identidade; chave de pausa geral (`PUSH_ENABLED=false` como hipótese de emergência, com reinício/rollback disciplinados), logs de tentativas sem endpoints/segredos.
5. **Segurança de envio**: prevenir duplicidades por chaves únicas e lock transacional; revalidar revogação e alteração instantes antes de enviar; lidar com erro 404/410 para limpar assinatura.
6. **Origem confiável**: HTTPS, escopo correto de service worker, CSP/headers testados, tratamento de XSS no chat e metadados; não permitir conteúdo arbitrário em notificações.
7. **LGPD**: revisar controlador, finalidade, base legal, transparência, fornecedores/transferências, retenção, eliminação e solicitação de direitos. Opt-in do navegador **não** substitui avaliação legal. Aprovação por responsável competente pendente.
8. **Mitigação de abuso**: cotas por dispositivo, origem e endpoint; proteção anti-spam e limites de custo para IA, logs sem prompts completos sempre que não necessários.
9. **Fontes visuais**: verificar licença da Garet para disponibilização em repo público; Montserrat acompanhada de OFL. Não republicar imagens de evento sem direitos.

## 7. Ambientes, caminhos e credenciais
- `main`: somente versão aprovada; PR #1 rascunho, sem merge automático.
- `chore/migracao-baseline-pwa`: staging de código e docs; sem dados sensíveis.
- **Preview isolado** da branch/PR com funções e conjunto sintético, sem subscriptions reais.
- **Staging funcional privado** sob projeto/URL e credenciais isoladas para testar cron real; Deploy Previews não acionam cron automaticamente (permitem invocação manual). Não publicar publicamente dados de pesquisa em staging.
- **Produção** HTTPS pública somente após G7/G8. Ajustar `netlify.toml` para `publish = "dist"` (ou outra pasta construída e verificada), `functions = "netlify/functions"`; função `guia` nessa pasta. Nunca colocar docs, banco, ZIPs, testes e `.env` no public output.
- Confirmar acesso real da Luana ao time Netlify e ao DNS, sem pedir senha neste documento. Responsável de execução/revisão técnica ainda a designar.
- Criar secrets separados por contexto e fornecedor, com mínimo privilégio, rotação possível e sem propagação inadvertida entre ambientes.
- Confirmar proteção de staging e desativar agendamento/Push fora do teste aprovado.

## 8. Custos, limites e orçamento — não assumir plano de conta
**Netlify (documentação pública, 2026):** plano Free credit-based indica 300 créditos/mês, mas contas antigas podem estar em planos legacy; a conta do projeto não foi inspecionada. Consumo depende de requests, bandwidth, compute, deploys e banco. [Planos](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) e [billing](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/).
- Modelo A cron 5min: 288 execuções/dia (~8.640/30 dias) **antes** de reprocessamento de envios. A 15min: 96/dia (~2.880/30 dias). São quantidades de execuções, **não** valores de cobrança. Cada execução pode gerar consulta e impedir o sono do banco; medir.
- Banco: consultar plano atual do provedor e métricas de compute/armazenamento/bandwidth, inatividade, backups e quotas; custo fixo = desconhecido.
- IA: custo por requisição varia por modelo, tokens e tráfego; teto e rate limit precisam de aprovação.
- Upstash/QStash (se B): preço e limites em [tabela oficial](https://upstash.com/pricing/qstash); custo = volume de mensagens/agendamentos/retries e eventual plano. Limite de atraso exige política para sessões distantes.
- **Teto de gasto mensal: OPEN_QUESTION da PO**, não autorizado. Não contratar serviço nem habilitar auto-upgrade sem decisão.
- Medições necessárias: requests/dia, execução do cron, compute-minutes, dados armazenados, quantidade de subscriptions, notificações/dia, erros e custo IA; gatilho de alerta orçamentário e desligamento.

## 9. Plano de reversão (G5 → G6 → G8)
**Antes de construir**: fotografar hashes de artefatos, commit do branch, `netlify.toml`, manifesto, status do catálogo, migrações e backups do banco de teste. Revisão independente.
**Falha de UI**: reverter para deploy anterior do frontend, sem apagar salvos; comunicar indisponibilidade.
**Falha de IA**: desativar função de IA e oferecer busca determinística, sem prometer recomendações geradas.
**Falha de Push**: pausar emissão global, bloquear jobs futuros, preservar auditoria mínima; restaurar somente após corrigir defeito e revalidar consentimentos. Não apagar chaves ou inscrições sem plano de recuperação.
**Falha de catálogo**: restaurar versão anterior da projeção pública autorizada, jamais retornar ao catálogo fictício sob aparência de dado real.
**Falha do banco/migração**: migrar só com backup e rollback testado; procedimento/limitações do fornecedor devem ser comprovados; rollback de frontend não reverte automaticamente estado do banco.
**Incidente de segurança**: revogar/rotacionar credenciais, pausar envios e endpoints vulneráveis, preservar evidências sem vazamento e avaliar notificações regulatórias conforme orientação competente.
**Prova de rollback**: executar em staging (não em produção), documentar tempo, versão, resultado e logs minimizados; UAT de recuperação NOT_RUN.

## 10. Plano de testes e UAT (todos NOT_RUN)
| ID | REQ / BR / SPEC | Teste | Aceite e evidência |
|---|---|---|---|
| T-G5-01 | REQ-013 / SPEC-013 | Após primeiro salvo, dispensar convite | Não chama prompt nativo; salvo permanece |
| T-G5-02 | REQ-013 / SPEC-013 | Aceitar convite em Android compatível | Inscrição criada, vinculada só ao próprio dispositivo |
| T-G5-03 | REQ-013 / SPEC-013 | iOS compatível instalado / não instalado | Permissão suportada no instalado; instrução no não instalado |
| T-G5-04 | REQ-012 / BR-014 / SPEC-012 | Sessão válida com 24h de antecedência | Um único agendamento/envio elegível; carimbo temporal documentado |
| T-G5-05 | REQ-012 / BR-018/019 / SPEC-012 | Cancelamento e remarcação | Cancela agendamento antigo, envia aviso confirmado e não duplica |
| T-G5-06 | REQ-013 / BR-016/020 / SPEC-013 | Remover salvo e desligar global | Não enviar após revogação, mesmo com fila pendente |
| T-G5-07 | REQ-011/013 | Tentar alterar inscrição de outro dispositivo | 401/403 sem vazamento; rate limit, CSRF e origem testados |
| T-G5-08 | REQ-012/013 | Reprocessar o mesmo job/versão concorrente | Uma única mensagem idempotente e sem duplo envio |
| T-G5-09 | REQ-012/013 | Notificação com PWA fechado | Recebimento em dispositivo elegível com evidência, sem prometer SLA do SO |
| T-G5-10 | REQ-CAT-01 | Evento pendente ou rejeitado | Nunca aparece nem gera notificação |
| T-G5-11 | REQ-LAUNCH-01 | URL pública + PWA | Sem doc/CSV/credenciais acessíveis, sem dados internos |
| T-G5-12 | REQ-013 | Controlar falha de fornecedor, cota e pause | Erros informados, sem sucesso falso, jobs suspensos |
| T-G5-13 | REQ-LAUNCH-01 | Rollback em staging | Reversão verificada sem expor ou perder dados indevidos |
| T-G5-14 | REQ-012/013 | Simular bursts e abusos | Limites operacionais e autorização preservados |
| T-G5-15 | REQ-LAUNCH-01 | Revisão LGPD e secrets | Parecer de privacidade, evidência de permissões e ausência de secrets no bundle |
Para cada teste: ambiente, versão, dispositivo, pré-condição, resultado esperado/observado, evidência, responsável, data e PASS/FAIL/BLOCKED/NOT_RUN.

## 11. Gate e decisões pendentes
| Item | Tipo | Dono | Estado |
|---|---|---|---|
| Acesso público em 05/12 | DECISION (negócio) | PO | APPROVED |
| Web Push obrigatório em 05/12 | DECISION (negócio) | PO | APPROVED |
| Navegação 4 abas | DECISION (negócio) | PO | APPROVED |
| Fonte de dados a publicar | EVIDENCE_GAP | curadoria/privacidade | BLOCKED |
| Arquitetura A/B/C, banco e cron | ENGINEERING REVIEW | engenharia/revisor | IN_REVIEW |
| Exatidão da tolerância do lembrete 24h | OPEN_QUESTION / SPEC | PO + engenharia | OPEN |
| Plano/conta, teto de gastos e upgrade | OPEN_QUESTION | PO | OPEN |
| Executor, revisor técnico e substituto operacional | OPEN_QUESTION / RESOURCE | PO | OPEN |
| Privacidade LGPD, retenção e transparência | EVIDENCE_GAP | PO + revisão competente | BLOCKED |
| Dispositivo de teste iOS/Android e ambiente controlado | EVIDENCE_GAP | engenharia/PO | OPEN |
| GitHub assets e licenças, caminho do build | ENGINEERING | engenharia | OPEN |
| Rollback comprovado | TEST | engenharia | NOT_RUN |

**PARECER:** `G5 CONDITIONALLY SPECIFIED / NOT APPROVED`. O desenho de solução e os testes foram especificados; faltam revisão independente, autorização de fornecedores/custos/dados, validação técnica e evidência de privacidade. **Não iniciar G6 integral nem G8** com essas lacunas. Pode-se preparar código/configuração em branch isolada após autorização de implementação e sem serviços/dados reais, conforme política de autonomia.


---

## Adendo G5 / 17-11-2026 — Respostas GRILLME rodada 2 e domínio

**DECISION (PO):** orçamento de operação de até **R$ 50/mês**, condicionado à aprovação separada de **cada serviço/contratação**. Não presumir autorização de pagamento, contratação, auto-upgrade ou uso de cartão.

**FACT:** dispositivos para homologação: **iPhone, computador e Android**. Não declarar testes concluídos sem evidências de execução.

**DECISION (PO):** tolerância de até **5 minutos após o instante programado** (24h antes do evento) para *disparo/tentativa do servidor*. A chegada da notificação na tela não tem prazo universal garantido.

**OPEN_QUESTION:** revisor técnico independente não identificado.

**FACT:** aquisição efetuada apenas do **domínio qfazer.com.br** no Registro.br; **não houve contratação de hospedagem informada**. Netlify é **candidata** por compatibilidade com código anterior, não plataforma aprovada. Nenhum DNS alterado.

### Impactos no parecer
1. Reestimar arquitetura A/B/C considerando total mensal de hospedagem, dados, cron/fila, banda, funções, IA e notificações dentro de R$ 50. Sem dados da conta/provedor, **custo total permanece não verificado**.
2. Confirmar status de acesso à Netlify anterior, se disponível, plano atual, limitações de agendamento, suporte a custom domain, HTTPS e gestão de segredos antes de escolhê-la.
3. Ajustar SPEC do lembrete: `scheduled_for = start_at - 24h` e `attempted_at` deve estar na janela `[scheduled_for, scheduled_for + 5 min]` em condições operacionais de teste; servidor não deve prometer entrega no dispositivo nesse intervalo.
4. Elaborar matriz de testes para iPhone compatível (instalado como PWA, autorização explícita, app fechado), Android compatível (Chrome/PWA, aplicativo fechado), navegador desktop, revogação e remoção de salvo; registrar versão de SO/navegador.
5. Sem parecer técnico independente, acesso à hospedagem e testes reais, manter **G5 IN_REVIEW / NOT APPROVED**.

Documento complementar: `docs/decisoes/GRILLME_G5_RESPOSTAS_RODADA2_2026-11-17.md`.

### Adendo corretivo — inventário de dispositivos atualizado
**FACT (PO, rodada 2 atualizada):** além de iPhone e computador, existe **Android disponível para testes**. A informação anterior de ausência de Android foi substituída. Requer UAT separado no Android (permite/nega permissão; inscrição; app fechado; recebimento; revogação) e registro de OS, navegador, versão do PWA e evidência. **Todos NOT_RUN.** Sem alteração do teto de R$ 50/mês, tolerância de 5 minutos, caráter obrigatório do Web Push e revisor ainda não designado.


---

## Adendo de governança — hospedagem do protótipo anterior / delimitação do gate
**FACT (PO, 17/11/2026):** o painel Netlify do protótipo anterior está na **conta de outra integrante da equipe**. O projeto comprou apenas o domínio `qfazer.com.br`; a equipe não informou hospedagem própria contratada. Não presume-se acesso, propriedade da conta, transferência autorizada ou acesso a variáveis secretas do ambiente legado.

**ASSUMPTION a validar:** uma infraestrutura própria sob controle da equipe será operacionalmente mais segura para a versão pública. A Netlify é apenas candidata a provedora; nenhuma transferência/mudança de DNS está autorizada.

**Architecture Grill — decisão técnica pendente:** comparar criação de uma hospedagem nova sob conta controlada pelo projeto com transferência formal de site autorizada pela titular da conta antiga, avaliando custo, propriedade, risco de dependência, acesso a logs/secrets, continuidade e reversibilidade. Não solicitar senhas da integrante. Se migração, configurar credenciais novas, não copiar segredos sem aprovação.

### Correção de escopo do gate
Conforme `PROJECT_LIFECYCLE.md`, o **G5** exige arquitetura, contratos, testes *planejados*, riscos, dependências claras, plano executável e **revisão técnica independente**. A execução integral de código e QA é **G6**, aceite em dispositivos é **G7**, publicação pública autorizada é **G8**. Testes reais de Web Push, deploy, DNS e rollback operacional permanecem pendências de G6/G7/G8 e não devem ser classificados isoladamente como impedimento de aprovação de baseline G5 se houver plano verificável e riscos tratados.

### Checklist específico para encerrar G5
- [ ] Arquitetura de hospedagem/DB/funções/cron/Push escolhida com comparativo de custo e dependências; ponto de controle do domínio e owner identificados
- [ ] Teto de R$ 50/mês demonstrado por cenários de uso e limites; contratação ainda depende de aprovação individual
- [ ] Contratos de API e modelo de dados seguros, incluindo device/session, inscrições, revogação, reprogramação e isolamento catálogo interno/público
- [ ] Matriz de riscos, controles mínimos de LGPD, credenciais, abuso e custos revisada com responsáveis
- [ ] Plano de implementação G6, UAT de iPhone/Android/desktop e rollback G8 com critérios verificáveis
- [ ] Revisão independente concluída e parecer de engenharia documentado
- [ ] PO aprova a baseline técnica e qualquer consequência comercial/financeira específica

**Estado:** G5 IN_REVIEW; pendência adicional de governança da hospedagem anterior identificada. Nenhuma hospedagem, DNS ou deploy alterado.


---

## Registro de colaboração da integrante titular Netlify (17/11/2026)
**FACT (PO):** a integrante responsável pela conta Netlify do protótipo anterior **permanece no desenvolvimento do Qfazer**. Não há evidência de transferência, autorização de uso da conta pessoal na nova produção, acesso de Luana ao painel, ou plano/limites de faturamento.

**Parecer atualizado:** antes de substituir a infraestrutura, avaliar **nova hospedagem Netlify controlada pela equipe Qfazer com colaboração da integrante**, preservando o protótipo anterior; transferência formal da hospedagem antiga é opção, não requisito. Confrontar com Cloudflare Workers/D1 caso custo ou capacidade inviabilizem Netlify. Opções, riscos e critérios em `docs/engenharia/G5_DECISAO_HOSPEDAGEM_COLABORATIVA_v0.1_IN_REVIEW.md`.

**Gate G5 segue IN_REVIEW:** escolha técnica final, custos e limites verificáveis, definição de owner/backup, revisão de privacidade e revisão técnica independente ainda pendentes. Não confundir aprovação de continuidade da metodologia com autorização de deploy, contratação ou mudança de acesso.
