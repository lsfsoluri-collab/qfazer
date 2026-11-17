# Qfazer — DEC-G5-19 | Acesso público na feira

**Data:** 17/11/2026 · **Estado:** APPROVED BY PO (requisito de negócio) · **Meta:** 05/12/2026
**Origem:** declaração expressa da Product Owner: “quero que fique aberto ao publico. vamos seguir”.

## DECISION
O **Qfazer deverá estar acessível ao público** na feira acadêmica de **05/12/2026**. O requisito de lançamento inclui experiência pública em navegador e PWA, sem presumir necessidade de cadastro para descobrir eventos.

**Esta decisão NÃO é autorização para deploy de produção, abertura de ambiente existente, contratação, configuração de credenciais, publicação de bases com reuso pendente ou alteração de permissões de usuários.** Essas ações possuem gates e autorizações separados.

## Requisitos herdados
- Quatro abas: **Início, Salvos, Buscar, Chat**; Perfil não é aba principal.
- PWA mobile-first, links para canais oficiais, sem checkout/reserva dentro do app.
- Salvos locais sem login conforme baseline funcional REV7; Web Push funcional em dispositivos compatíveis, com app fechado, consentimento e revogação.
- Lembrete 24 horas antes da sessão salva e alertas de mudança confirmada (data, horário, local ou cancelamento), conforme baseline. Não prometer entrega universal.
- Catálogo consolidado: 204 registros auditados, dos quais 161 aptos para homologação INTERNA na fotografia de 17/11; 33 pendentes e 10 rejeitados não aparecem em busca/recomendação. **Aptidão interna NÃO significa autorização de publicação pública.**

## REQ / BR / SPEC / UAT
| ID | Definição |
|---|---|
| REQ-LAUNCH-01 | Acesso público ao PWA na feira, com jornada de descoberta sem cadastro obrigatório |
| BR-LAUNCH-01 | Não expor ao público informações ou assets sem direito de uso confirmado; nenhum evento pendente/rejeitado pode ser recomendado |
| SPEC-LAUNCH-01 | URL HTTPS estável, teste em desktop/mobile, PWA manifest e ícones adequados, erros de rede, navegação e acessibilidade; ambiente de homologação separado de produção |
| SPEC-LAUNCH-02 | Separar catálogo interno/auditoria da projeção pública autorizada; verificação de permissão por fonte/campo e revalidação temporal antes de publicar |
| SPEC-LAUNCH-03 | Web Push condicionado à permissão da pessoa, com inscrição segura por dispositivo, revogação, prevenção de duplicidades, controles operacionais e monitoramento |
| UAT-LAUNCH-01 | Visitante abre endereço público sem login, pesquisa e encontra apenas sessões autorizadas, futuras, confirmadas e na capital |
| UAT-LAUNCH-02 | Busca/filtros/IA não retornam pendentes, rejeitados ou dados internos |
| UAT-LAUNCH-03 | Pessoa salva sessão e, se consentir em dispositivo compatível, testa recebimento de Web Push com PWA fechado |
| UAT-LAUNCH-04 | Pessoa revoga notificações e o sistema impede novos disparos da inscrição revogada |
| UAT-LAUNCH-05 | Sem estoque comprovado, interface não declara ingresso garantido nem reserva interna |
| UAT-LAUNCH-06 | Degradação de rede/serviço não expõe chaves, dados privados nem respostas inventadas |

**Todos os testes permanecem NOT_RUN.**

## Caminho crítico para o gate público
1. Engenharia valida ambiente isolado, arquitetura de Web Push, segurança de inscrições, privacidade e custo.
2. Confirmar direitos de republicação de eventos, textos e imagens. Se a autorização limitar o catálogo, selecionar apenas o subconjunto liberado; o restante permanece na base interna.
3. Completar a migração do PWA e da identidade; corrigir funções Netlify e preservar a baseline aprovada.
4. Testar cenário de público real, inclusive uso simultâneo, formulário e proteção contra abuso; definir plano de contingência e rollback.
5. Registrar parecer independente, evidências de QA e UAT, aceite da PO e **autorização específica de deploy**.

## Fact / Assumption / Decision / Open question
- **FACT:** em 17/11 a migração do PWA está no PR #1 rascunho; funções, assets e integração de eventos ainda não foram homologados.
- **DECISION:** acesso público em 05/12; Web Push obrigatório; navegação com 4 abas.
- **ASSUMPTION:** é viável obter uma publicação estável até a feira; depende de engenharia e conformidade.
- **OPEN_QUESTION:** domínio final, credenciais/controle Netlify, executor/revisor técnicos, teto de gastos, avaliação LGPD e permissões de republicação por fonte.

**Gate:** G5 IN_REVIEW / release público NÃO AUTORIZADO neste ato.
