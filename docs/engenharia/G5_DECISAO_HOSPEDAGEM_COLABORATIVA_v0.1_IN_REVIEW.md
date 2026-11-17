# Qfazer — G5 | Hospedagem colaborativa e alternativas de infraestrutura
**Versão:** 0.1 · **Data:** 17/11/2026 · **Estado:** IN_REVIEW · **Escopo:** decisão de arquitetura (não contratação)

## Fonte de decisão e fatos
**FACT (PO):** a integrante titular da conta Netlify do protótipo anterior **permanece na equipe de desenvolvimento**. O Qfazer possui domínio `qfazer.com.br` registrado no Registro.br, mas não contratou hospedagem.  
**DECISION já aprovada:** acesso público em 05/12; Web Push obrigatório; 4 abas; limite de R$ 50/mês com aprovação por serviço; tolerância de até 5 minutos após o instante de disparo calculado para `start_at - 24h`.  
**ASSUMPTION:** Netlify é caminho de menor mudança dado o código antigo. Não significa que a conta da integrante foi transferida, que ela autorizou seu uso para produção ou que os limites comportam tráfego público.  
**OPEN_QUESTION:** qual equipe/conta deterá o projeto público? A titular autoriza colaborar/transferir? Quem será revisor independente? Qual é o plano efetivo da conta e orçamento total incluindo API de IA?

## Alternativas comparadas
| Alternativa | Vantagem de negócio | Complexidade/risco | Custo estimado | Gate |
|---|---|---|---|---|
| **A. Criar site Qfazer em equipe/conta Netlify controlada pelo projeto** | Mantém código/function padrão, separa legado e facilita governança | Configurar DNS, permissões, secrets, funções, banco, jobs e publicação separada | **Desconhecido sem plano/volume**; validar teto total R$ 50 | **Candidata preferida para engenharia avaliar** |
| **B. Transferir formalmente o site anterior para uma equipe Qfazer** | Pode reaproveitar histórico e settings | Transferência depende da titular e das permissões; risco de quebrar domínio atual, deploy/segredos, formulários | **Desconhecido**; requisitos e créditos por equipe | Não transferir sem consentimento e plano de reversão |
| **C. Manter publicação Qfazer na equipe pessoal da integrante e conceder acesso à PO** | Início aparentemente simples | Dependência de uma pessoa, custos e incidentes atrelados à conta pessoal; limita governança | **Desconhecido** | Não recomendado como solução definitiva pública sem acordo formal |
| **D. Cloudflare Workers + D1 + Cron** | Infraestrutura potencialmente integrada com cotas gratuitas | Reescrever função Netlify, implantar banco/ciclo novo e revisar Web Push | **Desconhecido**; estimar por requests/dados/cpu/IA | Plano alternativo caso A inviável |

Referências públicas (consultadas em 17/11/2026):
- [Netlify — Team-owned sites](https://docs.netlify.com/manage/accounts-and-billing/team-management/team-owned-sites/)
- [Netlify — Transfer a project](https://docs.netlify.com/manage/projects/transfer-project/)
- [Netlify — Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Netlify — Credit-based pricing](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [Cloudflare — Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare — D1 FAQ](https://developers.cloudflare.com/d1/reference/faq/)

## Parecer preliminar
**Priorizar A para avaliação**, sem aprovar fornecedor/contratação/deploy. Integrante da equipe pode colaborar por permissões de papel apropriadas, evitando compartilhar credenciais. Conservar protótipo antigo isolado; versão pública nova recebe novo site e build próprio. Se A falhar por custos/limites, comparar D e uma fila sob demanda para lembretes.

## Contrato de governança mínimo antes de G5
1. **Titularidade/controle**: identificar conta de produção, owner e pessoa de backup; não deixar conta pública inacessível à PO.
2. **Papel da integrante**: confirmar colaboração com permissões concedidas legitimamente, e se o código/artefatos do protótipo poderão ser reaproveitados.
3. **Build e segredo**: publicar apenas `dist/` (ou diretório equivalente), Functions fora dele; secrets e DB geridos no provedor; não copiar segredos do site anterior.
4. **Segregação**: branch/preview sem subscriptions reais, staging isolado, produção com dados liberados; nenhum JSON bruto interno no frontend.
5. **Push**: agendamento e banco com idempotência, revogação, consentimento, atualização confirmada e trilha mínima de auditoria; alvo de tentativa dentro de 5 min, entrega no dispositivo sem SLA.
6. **Custos**: plano/limites reais de Netlify + banco + IA + agendamento + tráfego; alertas e pausa; teto mensal total de R$ 50; aprovação separada para cada contratação.
7. **Revista independente**: autor técnico distinto do revisor, com parecer antes de aprovação final.
8. **Reversibilidade**: voltar deploy anterior e pausar mensagens via kill switch; backups/teste no G6/G7, não exigir execução de testes antes de aprovar a especificação G5.

## Ações reversíveis permitidas no G5
- Documentação, comparativo, matriz de riscos, contratos e casos UAT sem deploy.
- Preparação de PR em branch isolada após confirmar escopo de execução e política de autonomia.
- Solicitar à titular uma captura não sensível das informações de plano, equipe, consumo e papéis, nunca senha/token.

## Bloqueios residuais G5
- **HIGH:** confirmar alternativa A/B e responsáveis por ambiente/backup e execução.
- **HIGH:** revisar desenho de banco + cron/push e viabilidade em R$ 50/mês.
- **HIGH:** revisão de engenharia independente e decisão arquitetural final.
- **HIGH:** medidas e responsáveis por privacidade e segurança revisados.
- **CRITICAL para G8, não necessariamente G5:** liberação de reuso público do catálogo e testes UAT com evidência.

**Gate:** G5 IN_REVIEW. Este documento não prova acesso à Netlify, não autoriza transferência, gastos nem deploy.
