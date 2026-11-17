# Qfazer — GRILLME crítico da Etapa 1 / Gate G5
**Data:** 17/11/2026 · **Atualizado:** 17/11/2026 · **Estado:** IN_REVIEW · **Escopo:** migração, identidade, comportamento funcional e preparação da integração
**Protocolo:** GRILLME_PROTOCOL (Business, Architecture, Spec), Constituição, ciclo de vida, baseline funcional REV7 aprovada, G4 UX, manual de marca v2, mockups, SPEC de integração e inventário de arquivos do PR #1.

## Status do gate
**G5 BLOQUEADO para aprovação irrestrita do build e para release público**, embora a preparação do kit visual e os ajustes não destrutivos possam ser planejados. Testes de UAT são NOT_RUN e não há parecer de revisão independente.

## Findings (sem inventar decisões)
| ID | Impacto | Evidência | Risco e encaminhamento |
|---|---|---|---|
| G5-01 | CRITICAL | PR #1 contém 5 arquivos texto; binários visuais ausentes e `guia.mjs` na raiz, enquanto `netlify.toml` aponta `netlify/functions` | baseline migrada não comprovadamente executável; engenharia deve completar assets e corrigir/testar rota em preview isolado |
| G5-02 | CRITICAL | 204 registros com `reuso_publico=PENDENTE_REVISAO`, 161 aptos apenas internamente | usar dataset só em homologação com acesso controlado; não publicar JSON ou fotos/licenças indefinidas |
| G5-03 | CRITICAL | index.html e guia.mjs do legado contêm 10 eventos fictícios | centralizar fonte do catálogo; aplicar status, data, cidade antes da IA; impedir recomendações inventadas |
| G5-04 | HIGH | mockup de chat: “Tem sim! Você pode reservar direto pelo app”; baseline REV7 exclui checkout e exige canal oficial | corrigir texto/interface para “Consultar ingresso no canal oficial”, sem prometer reserva ou estoque |
| G5-05 | HIGH | arquivos Garet Book/Heavy em ZIP sem documento de licença identificado; Montserrat com OFL | confirmar direito de distribuição e hospedagem em repositório público; não commitar fontes Garet até verificar; evitar compartilhar arquivos fora do ambiente necessário |
| G5-06 | HIGH | baseline REV7 aprovou Web Push com app fechado, mas dependências de autenticação anônima, opt-in, segurança, privacidade e operações continuam | não ativar com usuários reais até desenho técnico, avaliação de privacidade, dono operacional e evidências |
| G5-07 | MEDIUM | arquivo `Fira_Sans_Condensed,Montserrat.zip` inclui fontes extras, mas manual v2 determina Montserrat+Garet | não utilizar Fira sem decisão explícita |
| G5-08 | MEDIUM | mockup de componentes mostra 5 abas; decisão de 17/11 define 4 abas Início, Salvos, Buscar, Chat | decisão já resolvida; atualizar fonte de interface, não implementar Perfil como aba |
| G5-09 | MEDIUM | mockups incluem 6 categorias; catálogo consolidado 13 categorias | mapear chips ↔ taxonomia, preservar sessões em “Todos”, definir comportamento “Mais” para categorias adicionais |
| G5-10 | MEDIUM | imagens de cards mockadas, PNGs de referência e textura não são equivalentes a fotos licenciadas de sessões | fallback neutro; obter autorização de imagens reais; não reutilizar imagens genéricas sem rotular |
| G5-11 | MEDIUM | fotos e materiais da marca recebidos na conversa, não verificados na branch | gerar derivados com verificação de transparência, máscara PWA e permissões; não anunciar kit aplicado antes de commit |
| G5-12 | HIGH | não há ambiente de homologação, dono de Netlify/deploy, política de segredos, custos e rollback documentados | engenharia define isolamento, credenciais, orçamento, rota, evidências de build e reversão |
| G5-13 | MEDIUM | coleta acadêmica, formulário Netlify e navegação antigos; G4 DEC-UX-02 exige pesquisa voluntária fora da jornada principal | rever aviso, privacidade e fluxo; não interromper ingresso/reserva com pesquisa |
| G5-14 | MEDIUM | baseline prevê salvos locais que reconsultam IDs; importação altera IDs/status e dados | validar estado salvo expirado/cancelado, session IDs estáveis e mensagens de atualização |
| G5-15 | HIGH | mockups de desktop e mobile são referências com layouts não equivalentes ao HTML legado; revisão independent QA ausente | declarar diferenças aprovadas, evidência visual, contraste e testes keyboard/mobile antes de gate |

## Regras confirmadas (FACT / DECISION)
- **FACT:** GitHub novo é público; PR #1 draft isolado; cinco arquivos texto copiados, assets binários não migrados naquele PR.
- **FACT:** manual v2 define preto `#0B0B0B`, creme `#F7F5EE`, lime `#D7FF46`; Montserrat para títulos, Garet para interface.
- **FACT:** catálogo consolidado em 17/11 possui 204 registros; 161 aptos para testes internos, 33 pendentes e 10 rejeitados.
- **DECISION:** quatro abas Início / Salvos / Buscar / Chat na ordem aprovada em 17/11; Perfil não é aba do MVP.
- **DECISION:** sessões `PENDENTE_VERIFICACAO` e `NAO_UTILIZAR` não são apresentadas em busca, conversa ou comparação.
- **DECISION:** sem compra/reserva interna. CTA aponta para canal oficial; disponibilidade não pode ser prometida sem confirmação.
- **DECISION:** pesquisa acadêmica voluntária e não intercepta a saída para canal oficial.

## ASSUMPTIONS para testar
- PNGs de marca são suficientes para MVP sem SVG mestre; verificar nitidez PWA e tamanhos.
- Ícones de UI podem ser implementados consistentemente sem exportar pacote próprio, se a equipe de design aceitar a equivalência.
- O módulo de conversa pode ser adaptado sem mudança estrutural relevante; backend isolado e contratos precisam provar.

## OPEN_QUESTIONS prioritárias à PO
1. **Escopo de demonstração em 05/12:** haverá público testando o produto em endereço publicamente acessível, ou somente acesso interno/controlado? Consequências: dados e reuso, privacidade, planejamento de release.
2. **Push:** o requisito Web Push real precisa estar funcional já em 05/12 ou pode ser demonstrado como indisponível/planejado enquanto G5 de segurança não fecha? Isso é alteração de escopo e requer aprovação explícita, não deve ser suposto.
3. **UI / conteúdo:** confirmar que o texto “reservar direto pelo app” é removido do mockup e substituído por ação de consulta em canal oficial (regra já aprovada; confirmação de cópia, não mudança de regra).
4. **Imagens:** para eventos sem foto autorizada, aceita fallback gráfico neutro sem imagem do evento? Isso evita mostrar conteúdo genérico como se fosse real.
5. **Acesso operacional:** quem é o responsável técnico e quem controla o Netlify da demo e eventual orçamento? Não indicar nome sem comprovação; registrar responsável.

## UAT a preparar
- UAT-UX-01: 4 abas no mobile e nenhuma aba Perfil.
- UAT-CAT-01: nenhuma sessão pendente/rejeitada entre recomendações.
- UAT-CTA-01: nenhum botão promete reserva interna; links externos são oficiais.
- UAT-VIS-01: logos, tipografia, cores e foco seguem manual.
- UAT-PUSH-01: disponibilidade ou limitação de notificações é comunicada corretamente, sem prometer funcionalidade não implementada.
- UAT-PRIV-01: pesquisa voluntária não intercepta saída para ingresso.
Todos: **NOT_RUN**, sem evidência técnica ainda.

## Recomendações para o gate
- **G5 técnico:** resolver G5-01, G5-03, G5-05, G5-12 e revisão independente antes de build de integração.
- **G7/UAT e G8:** resolver direitos de uso de eventos, textos de privacidade, alertas, revalidação e autorização explícita.
- Não fazer merge nem deploy sem revisão, plano de rollback e aprovação específica.

**Condicional:** o GRILLME não encerra o gate apenas por este relatório. As respostas da PO devem entrar como DECISION/OPEN_QUESTION antes de nova avaliação.


---

## Rodada de respostas da Product Owner — 17/11/2026

**Fonte:** respostas explícitas da PO nesta conversa; substituem apenas as perguntas respondidas, sem alterar automaticamente regras não mencionadas.

| Registro | Classificação | Resposta | Consequência |
|---|---|---|---|
| G5-R1-01 | **OPEN_QUESTION** | Acesso na feira de 05/12: **ainda não definido** | Não presumir site público nem demonstração restrita; preparar cenários e exigir decisão anterior ao G8 |
| G5-R1-02 | **DECISION** | Web Push **deve funcionar em 05/12/2026** | Requisito obrigatório do MVP; não marcar como futuro ou opcional; especificar operação, consentimento, segurança, testes e contingência |
| G5-R1-03 | **FACT / atribuição de responsabilidade** | **Luana** foi indicada como responsável pelo código e pelo Netlify | Luana é ponto focal e responsável por coordenar a entrega; isso não prova que todas as credenciais, acessos ou competências de implementação foram validados; execução e revisão técnica exigem evidências |

### Impactos na triagem GRILLME

- **G5-06: HIGH → CRITICAL (prazo/segurança)**. A obrigação de Web Push com o aplicativo fechado fica no caminho crítico, exigindo arquitetura compatível, permissão explícita, inscrição e revogação, notificações sem revelar dados pessoais, tratamento de erros, verificação em dispositivos e navegador elegíveis, política de retenção de subscriptions e custos.
- **G5-12 permanece HIGH.** Responsável identificado (**Luana**), porém destino de homologação, acesso efetivo ao painel Netlify, gestão de credenciais e orçamento não foram verificados.
- **G5-02 permanece CRITICAL.** A indefinição do nível de acesso e a revisão de direitos para o catálogo impedem assumir deploy público de eventos.
- **G5-04 permanece HIGH**, com correção de texto já coberta pela baseline: não é decisão comercial nova.
- **OPEN_QUESTION**: política de fallback visual para eventos sem foto e critérios de aceite do comportamento da pesquisa acadêmica; podem ser resolvidos pela especificação sem mudar o negócio se não alterarem jornadas aprovadas.

### Caminho crítico recomendado
1. **Engenharia de notificações:** validar plataforma/infra e demonstrar fluxo em ambiente restrito, incluindo solicitar permissão, inscrever dispositivo, envio válido, fechamento do PWA, cancelamento de inscrição e reabertura; sem prometer entrega universal por restrições de SO/navegador.
2. **Responsabilidade e acesso:** confirmar que Luana possui permissões efetivas do GitHub, domínio, Netlify e configurações da demo; designar um executor de engenharia e revisor independente, mesmo que sejam diferentes do ponto focal.
3. **Migração:** finalizar assets e configuração da função Netlify na branch; nenhuma credencial ou arquivo protegido em repositório público.
4. **Dados:** manter 161 sessões elegíveis somente para teste interno, excluindo os 43 registros pendentes/rejeitados; não usar publicação pública como alternativa para facilitar testes.
5. **Decidir acesso à feira** antes da autorização de release; preparar alternativas público/restrito sem assumir uma delas.

### UAT adicionais para Web Push (NOT_RUN)
- **UAT-PUSH-02:** consentimento é solicitado após ação contextual; recusa não impede uso de descoberta.
- **UAT-PUSH-03:** após opt-in, mensagem de teste chega ao dispositivo elegível com o PWA fechado dentro das condições suportadas, com registro de ambiente e hora; sem garantia de entrega universal.
- **UAT-PUSH-04:** usuário desativa notificações; nenhuma nova notificação é enviada pelo sistema à assinatura revogada.
- **UAT-PUSH-05:** quando serviço estiver indisponível ou permissão negada, interface informa limitação sem afirmar sucesso.
- **UAT-PUSH-06:** mensagens notificadas não revelam dados privados; registros de subscriptions possuem controle de acesso e retenção definidos.

### Estado após respostas
**Decisão de Web Push registrada; responsável operacional identificado; acesso em 05/12 permanece OPEN_QUESTION. G5 segue bloqueado** até revisão independente, contrato de notificações, ambiente de teste e permissões de dados. Nenhum teste de push, merge ou deploy foi executado pela atualização documental.


---

## Rodada de respostas da Product Owner — Acesso público (17/11/2026)

**DECISION — DEC-G5-19:** o Qfazer estará **aberto ao público na feira de 05/12/2026**, com acesso no navegador e como PWA, após os gates de liberação. Esta decisão **fecha** a antiga `OPEN_QUESTION` G5-R1-01 e substitui qualquer indicação anterior de que o formato público/restrito ainda não esteja definido.

**Distinção obrigatória:** o requisito de **acesso público** está aprovado; o **deploy** e a **publicação dos dados** NÃO estão autorizados nem concluídos. A política de autonomia exige autorização expressa específica para deploy em produção, mudanças reais de acesso e publicação externa.

### Impactos diretos
- **G5-02 CRITICAL:** nenhum dos 204 registros da fotografia possui liberação geral de `reuso_publico`. A engenharia deve construir um conjunto público licenciado/revisado separado da base interna; se não houver sessão liberada, não fabricar conteúdo para preencher o catálogo.
- **G5-06 CRITICAL:** Web Push real permanece obrigatório em dispositivo compatível, com consentimento, revogação e testes de app fechado; integra caminho crítico do lançamento público.
- **G5-12 HIGH:** Luana é responsável de coordenação por GitHub/Netlify conforme resposta; acesso efetivo ao Netlify, responsável executor e revisão independente permanecem sem evidência.
- **G5-04 HIGH:** chamadas que prometem reservar dentro do próprio Qfazer devem ser corrigidas para consulta/encaminhamento oficial.
- **G5-13 MEDIUM→HIGH:** política de privacidade e termos de uso da inscrição push e formulários passam a ser dependências de release público.

### Próximos passos
1. Reconciliar e aprovar plano técnico de Web Push, incluindo origem HTTPS, service worker, gerenciamento seguro de subscriptions, persistência mínima, revogação e taxa de envio.
2. Concluir migração visual e funcional isolada no PR #1; não fazer merge sem revisão.
3. Diligenciar direitos dos eventos; separar dados privados, dataset apto interno e dataset público liberado.
4. Definir domínio, ambiente de homologação, limite operacional, privacidade e plano de contingência.
5. Executar testes com evidências; submeter aprovação da versão e autorização específica de deploy.

**Status atual:** G5 IN_REVIEW / G8 release público bloqueado por evidências e aprovações pendentes.
