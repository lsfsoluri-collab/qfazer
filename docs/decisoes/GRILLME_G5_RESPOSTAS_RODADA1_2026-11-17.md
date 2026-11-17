# Qfazer — Registro das respostas GRILLME G5 / Rodada 1

**Data:** 17/11/2026 · **Origem:** resposta expressa da Product Owner nesta conversa · **Gate:** G5 IN_REVIEW

| ID | Tipo | Registro | Status |
|---|---|---|---|
| DEC-G5-17 | **DECISION** | Web Push funcional até a feira de **05/12/2026** é requisito obrigatório. | APROVADO |
| FACT-G5-18 | **FACT** | **Luana** é a pessoa indicada para responder por código e Netlify da demo. Não equivale a verificação das permissões ou da implementação. | REGISTRADO |
| OQ-G5-19 | **OPEN_QUESTION** | O acesso na feira será público ou restrito/controlado? | ABERTO |
| ASS-G5-20 | **ASSUMPTION** | Pode ser viável desenvolver e testar Web Push em ambiente de homologação separado, com permissão do dispositivo e infraestrutura aprovada. | NÃO VALIDADA |

## Requisitos funcionais e aceite para Web Push — proposta técnica IN_REVIEW
- **REQ-PUSH-01 / BR-PUSH-01:** usuário que optou pelas notificações pode receber alertas relevantes mesmo com PWA fechado, onde plataforma/navegador permitirem.
- **REQ-PUSH-02 / BR-PUSH-02:** consentimento é voluntário; negar/revogar não bloqueia descoberta nem busca.
- **REQ-PUSH-03 / BR-PUSH-03:** notificações não devem afirmar disponibilidade de ingresso/preço sem atualização confirmada.
- **SPEC-PUSH-01:** arquitetura definida pela engenharia, com canal de envio autorizado, gerenciamento seguro de subscriptions e controle de segredos. VAPID/service worker são opções a confirmar, não tecnologia imposta pela coordenação de negócio.
- **SPEC-PUSH-02:** controle de opt-in, opt-out, política de retenção e erros compatíveis com dispositivos suportados; sem promessa de entrega universal.
- **SPEC-PUSH-03:** registrar identidade anônima/assinatura por dispositivo conforme baseline aprovada, com proteção contra disparo para assinaturas de terceiros e envio abusivo.
- **SPEC-PUSH-04:** testes verificáveis com app fechado, dispositivo e navegador identificados, além de privacidade e revogação.
- **UAT-PUSH-01:** opt-in concluído após ação explícita e consentimento.
- **UAT-PUSH-02:** notificação recebida em dispositivo compatível com PWA fechado; evidência de data/hora e ambiente.
- **UAT-PUSH-03:** permissão negada ou revogada, sem bloqueio do produto nem nova tentativa indevida.
- **UAT-PUSH-04:** links de notificação levam à sessão elegível atual ou a estado de indisponibilidade/expiração correto.
- **UAT-PUSH-05:** sessão pendente/rejeitada não gera notificação recomendando o evento.
- **UAT-PUSH-06:** assinaturas e logs não expõem dados pessoais ou credenciais.

**Todos os UAT: NOT_RUN.** A arquitetura e a priorização técnica permanecem pendentes de revisão independente. Custos, credenciais, novos serviços e publicação exigem aprovação específica.

## Próximos bloqueios (priorizados)
1. **CRITICAL:** definir e revisar a solução Web Push e prová-la em dispositivo real no prazo.
2. **CRITICAL:** resolver formato de acesso à feira **antes do release** e política de direitos para o catálogo público.
3. **HIGH:** confirmar quem executará e revisará tecnicamente, com acesso adequado e responsabilidades de incidentes/segredos.
4. **HIGH:** completar migração de assets e reparar função do protótipo, com teste isolado.
5. **HIGH:** integrar a mesma fonte de eventos ao filtro e à IA, sempre excluindo pendentes e rejeitados.
6. **HIGH:** conferir política de licença das fontes, principalmente Garet, antes de disponibilizar arquivos em repositório público.

**Gate:** a rodada de decisão foi registrada, mas o G5 não está aprovado.
