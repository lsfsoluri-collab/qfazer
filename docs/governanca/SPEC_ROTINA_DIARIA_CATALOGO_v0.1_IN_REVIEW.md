# Qfazer — Arquitetura de manutenção diária do catálogo
**ID:** SPEC-CAT-OPS-001 · **Versão:** 0.1 · **Estado:** IN_REVIEW · **Data:** 18/11/2026
**Origem:** proposta da Product Owner em 18/11 + regras da aba REGRAS + SPEC de sincronização existente.
**Escopo aprovado previamente:** curadoria interna em Sheets, publicação pública com três gates, interface preservada, P1 intocado. **Esta proposta não constitui aprovação de escrita automática, merge ou deploy.**

## 1. Objetivo e princípios
Manter opções futuras, verificadas e relevantes no Qfazer sem apagar a trilha da pesquisa, inventar fatos, publicar conteúdo não liberado ou criar base paralela. **Não confundir "apto para protótipo interno" com "público liberado".**

**FACT (18/11):** CURADORIA com 240 `session_id` únicos: 186 `APTO_PARA_PILOTO`, 43 `PENDENTE_VERIFICACAO`, 11 `NAO_UTILIZAR`, 0 `reuso_publico=LIBERADO`, 0 `revisao_editorial=APROVADO`. `BASE_ORIGINAL` é preservada e **não deve ser editada**. A documentação do PR #5 já contém `SPEC_SINCRONIZACAO_INTEGRADA_v0.5.md`, `scripts/export_public_catalog.mjs`, `p2/public-catalog.js` e `p2/catalog-public.json` vazio, com testes automatizados. Cron de publicação **não ativado**.

## 2. Duas camadas, duas ferramentas
**Camada editorial/semântica:** uma tarefa agendada do ChatGPT `Curadoria diária Qfazer` faz triagem e pesquisa de URLs oficiais. Início previsto 19/11/2026, aproximadamente 09h, fuso America/Sao_Paulo. **Piloto somente leitura**, limitado a até 15 pendências prioritárias e 10 novas sessões candidatas por execução. A tarefa gera relatório com URLs, IDs e alterações propostas; não afirma capacidade de extração automática indiscriminada e não grava na planilha.

**Camada determinística/operacional:** código versionado e Google Sheets. Em produção, o P2 filtra sessões vencidas na consulta/renderização em horário atual de São Paulo; o exportador publica só projeção pública permitida. Workflow GitHub **já preparado** para 09:15 BRT em novembro (12:15 UTC), mas não ativo no branch padrão, sem conta de serviço/variáveis e sem revisão humana. O workflow cria PR, nunca faz merge; release/deploy exige gate específico. Não oferecer cron como tempo real nem presumir pontualidade exata.

## 3. Fluxos TO-BE
### FL-01 — Expiração e alterações urgentes (automação determinística)
- Para **toda** sessão carregada, se `inicio_utc <= agora`, excluir de destaques, busca, comparação e recomendações, **sem excluir de CURADORIA e BASE_ORIGINAL**.
- Reavaliar na abertura do app e ao voltar de aba/suspensão. Especificar atualização periódica para telas abertas durante a virada de horário (sujeito a implementação/QA), sem recarregar a página inteira indevidamente.
- Evento cancelado ou alterado pela fonte deve ser marcado para revalidação imediata; salvos por ID precisam refletir a alteração. Evento recorrente é nova sessão, não reaproveitar ID de evento antigo.
- **Bloqueio:** não tratar sessão iniciada como "disponível" só porque há estoque no link. Fuso de negócio America/Sao_Paulo; persistência e comparação com instante UTC.

### FL-02 — Investigação das pendências (ChatGPT com evidências)
- Entrada: `CURADORIA` + `REGRAS`, campos `motivo_status`, `restricoes`, `observacoes_equipe`, `verificado_em`, `fonte_id` e URLs existentes.
- Para cada `session_id`, decompor a pendência em campos precisos (data, início, local/endereço, bairro/município, preço/taxas, condição de acesso, confirmação oficial, cancelamento, categoria, disponibilidade) com prioridade.
- Ordem candidata: sessões de data mais próxima → fonte oficial com atualização recente → sessões de alta relevância → verificação mais antiga; sem pesquisá-las todas diariamente por padrão.
- Consultar primeiro canal oficial/organizador/produtor e regulamento, respeitando acesso/termos; páginas de redes sociais não autorizam extração em massa. Registrar `URL da evidência`, `verificado_em`, `valor anterior`, `valor proposto`, `motivo_status`, `restrições` e `data da próxima rechecagem`.
- **Se confirmar todos os requisitos factuais sem divergência:** propor `status=APTO_PARA_PILOTO` para revisão de curadoria interna. **Se não:** manter `PENDENTE_VERIFICACAO`, especificar faltante e próxima consulta. **Se fonte negar realização ou evento cancelado:** propor `NAO_UTILIZAR` ou cancelado conforme taxonomia aprovada, com evidência e revisão.
- Nunca inferir preço 0, disponibilidade, cancelamento ou elegibilidade; conflito entre fontes deixa bloqueado até esclarecimento.
- Alterações em `CURADORIA` só após revisão/aprovação do lote ou política explícita de autopromoção, por uma operação de escrita com re-leitura da linha/ID, diff por coluna, backup, confirmação e log. Nenhuma escrita na `BASE_ORIGINAL`.

### FL-03 — Descoberta de eventos novos (ChatGPT com curadoria)
- Entrada: fontes P0/P1 do mapa de 134 canais, **somente os pesquisáveis conforme regras por fonte**. Conferir programação futura dos próximos 30 dias em São Paulo capital, com atenção à feira 05/12.
- Criar até 10 candidatos no relatório diário, com `event_id`, `session_id` proposto, título, categoria, data/hora completa e fuso, local/bairro/município, preço/taxas ou "a confirmar", URL oficial, `fonte_id`, último acesso e pendências.
- Deduplicar antes de importar por `session_id` e assinatura `event_id + data/hora + local` (rever diferenças de grafia); sessões distintas do mesmo evento devem ser preservadas.
- Novos candidatos **não** entram direto na BASE_ORIGINAL nem na superfície pública. Após aceite de curadoria, acrescentar registro em CURADORIA (nova linha, ID estável) e manter proveniência; usar status apto interno apenas com requisitos completos e comprovados.

### FL-04 — Aprovação e sincronização (implementação existente + gate)
- Fonte de verdade: `CURADORIA` Google Sheets. Integração hospedada lê apenas esta aba, com credencial restrita de leitura.
- Elegibilidade pública simultânea: `status=APTO_PARA_PILOTO` **e** `reuso_publico=LIBERADO` **e** `revisao_editorial=APROVADO` **e** data futura válida, município SP capital e fonte/URL oficial. Imagem só após licença independente.
- Depois de aprovação de fato/uso/editorial, pipeline gera `p2/catalog-public.json` mínimo, audita dados e cria PR. A **aprovação/merge do PR** continua humana; só então um pipeline de deploy previamente homologado/autorizado poderá refletir a alteração automaticamente no app (não no P1).
- A sincronização diária do GitHub depende de `GOOGLE_SERVICE_ACCOUNT_JSON` (secret), `QFAZER_CATALOG_SHEET_ID` (variável) e `QFAZER_CATALOG_SYNC_ENABLED=true` (após gate). Conta técnica nunca recebe permissão de edição desnecessária. Erros preservam a última versão válida do catálogo público.
- Em qualquer momento, app público vazio é comportamento correto se zero sessões tiverem os gates.

## 4. Registro operacional mínimo e relatório
**Já há campos úteis na planilha atual:** `session_id`, `status`, `motivo_status`, `restricoes`, `verificado_em`, `observacoes_equipe`, `fonte_id`, `url_oficial`, `revisado_em`, `responsavel_revisao`, `reuso_publico`, `revisao_editorial`.

**Proposta para implementação futura (não criar abas sem aprovação):**
- `FILA_PESQUISA`: `session_id`, `campos_pendentes`, `motivo`, `fonte_prioritaria`, `prioridade`, `ultima_tentativa`, `proxima_rechecagem`, `status_investigacao`.
- `LOG_VERIFICACOES` imutável por execução: `run_id`, `session_id`, `campo`, `anterior`, `proposto`, `url_evidencia`, `verificado_em`, `decisao_aprovador`, `versao_linha`.
- `NOVOS_CANDIDATOS` ou relatório de staging: novos IDs não publicáveis até triagem.
- Impedir duplicidade e sobrescrita concorrente: reconsultar linha e valores na hora de escrever; se mudou desde pesquisa, criar conflito, nunca substituir silenciosamente.

**Relatório por execução:** `data/hora`, `fonte/snapshot`, `vencidas ocultas`, `pendencias examinadas`, `resolvidas`, `ainda bloqueadas + campo a buscar + próxima data`, `novas candidatas`, `alteracoes aprovadas`, `status da projeção/PR`, `riscos`. Para cada alteração: ID, campo, antes → depois, link oficial e decisão exigida. Não relatar "site atualizado" apenas porque Sheets mudou.

## 5. Requisitos, regras e critérios de aceite
| REQ | BR | SPEC | Critério de aceite |
|---|---|---|---|
| REQ-OPS-01 | BR-OPS-01: sessões iniciadas não são sugeridas | SPEC-OPS-01: filtro de instante em runtime sem deleção | Zero sessões vencidas em busca/compare ao abrir/retomar |
| REQ-OPS-02 | BR-OPS-02: pendências nunca viram fatos inventados | SPEC-OPS-02: pesquisa oficial por campo, estado bloqueado | Toda proposta possui URL/evidência e conflito explícito |
| REQ-OPS-03 | BR-OPS-03: novas sessões sem duplicidade | SPEC-OPS-03: dedupe por ID e fingerprint | Re-importação não duplica `session_id` |
| REQ-OPS-04 | BR-OPS-04: aprovação interna ≠ publicação | SPEC-OPS-04: máquina de estados e gate triplo | 0 eventos públicos sem liberação de reuso e editorial |
| REQ-OPS-05 | BR-OPS-05: atualização reversível | SPEC-OPS-05: escrita por diff, log e rollback | Restaurar valores anteriores sem apagar auditoria |
| REQ-OPS-06 | BR-OPS-06: aprovação aciona atualização controlada | SPEC-OPS-06: projeção pública, PR e gate G8 | Site muda só após aprovação/release e sem vazamento interno |

### UAT previamente definidos — todos NOT_RUN nesta versão
- **UAT-OPS-01:** sessão de ontem permanece em CURADORIA, não aparece na busca ou recomendação.
- **UAT-OPS-02:** sessão passa do horário de início enquanto o app está aberto → desaparece da lista ativa após atualização de estado.
- **UAT-OPS-03:** data alterada por fonte oficial → mesmo ID lógico reconciliado, salvos não exibem data antiga sem aviso.
- **UAT-OPS-04:** falta hora/condição de acesso → manter pendente, relatório nomeia campo e URL a reconsultar; nada no público.
- **UAT-OPS-05:** preço contraditório e disponibilidade não confirmada → não considerar gratuito nem prometer vaga, bloquear filtros de orçamento que exigem certeza.
- **UAT-OPS-06:** todas as evidências factuais presentes → candidato a APTO_PARA_PILOTO interno; reuso/editorial permanecem pendentes.
- **UAT-OPS-07:** pesquisa traz evento já existente → não gerar sessão duplicada.
- **UAT-OPS-08:** reexecutar mesma sessão de pesquisa sem novidades → nenhuma alteração duplicada nem notificação enganosa de sucesso.
- **UAT-OPS-09:** duas alterações concorrentes da mesma linha → atualização rejeitada e exibida como conflito.
- **UAT-OPS-10:** 0 direitos liberados → `catalog-public.json` contém 0 sessões, site não expõe dados privados.
- **UAT-OPS-11:** registro autorizado/publicável e PR aprovado após G8 → atualização alcança P2, preservando P1 e formulário.
- **UAT-OPS-12:** falha de fonte/Google/CI → manter última projeção válida, gerar relatório de erro, sem merge nem deploy.

## 6. Segurança, custo, responsáveis e gates
- **Decisão da PO ainda necessária:** autorização específica para (i) escrita automática em CURADORIA, (ii) tratamento de status interno sem revisão humana, (iii) criação das abas auxiliares e (iv) gatilho de publicação por PR/deploy. A autorização de estrutura do GitHub **não** cobriu essas decisões.
- **Custos:** respeitar teto previamente decidido de R$ 50/mês para serviços do P2; tarefas do ChatGPT e requisições às APIs devem ter quotas/revisão de plano, sem assumir preço zero ou SLA.
- **Engenharia:** validar limitações do serviço de agendamentos, de acesso a fontes, das contas conectadas, da integridade de escrita em Sheets e limites de execução antes de ativar autopromoção.
- **G5:** revisão técnica independente; **G6:** implementação isolada e testes automatizados por commit; **G7:** UAT em dispositivo real; **G8:** aprovação de publicação e plano de rollback.
- **Situação atual:** tarefa ChatGPT diária de **pesquisa e proposta de alterações** criada, execução inicial prevista 19/11; nenhum fluxo de escrita em Sheets e nenhum cron GitHub foram ativados aqui.

## 7. Decisões e questões em aberto
- **DECISION vigente:** Sheets CURADORIA central, BASE_ORIGINAL imutável, P2 e P1 independentes, publicação triplo gate.
- **ASSUMPTION:** tarefa agendada conseguirá acessar as fontes conectadas na execução futura; se não, registrar bloqueio, não inventar resultados.
- **OPEN_QUESTION HIGH:** quem aprova o lote diário de correções factuais e quando uma mudança pode ser gravada automaticamente?
- **OPEN_QUESTION HIGH:** quais fontes e modalidades de consulta estão expressamente permitidas para pesquisa recorrente?
- **OPEN_QUESTION HIGH:** qual mecanismo autoriza o release da projeção após merge e como ele notifica a PO sobre rollback?
