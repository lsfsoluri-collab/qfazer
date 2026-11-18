# Sincronização integrada — v0.5, 18/11/2026

Estado: implementação candidata na branch isolada; UAT e release pendentes.

FACT: CURADORIA contém 240 sessões (186 aptas, 43 pendentes, 11 não utilizar), não 204. A releitura de 18/11 confirmou zero liberações públicas. A base original permanece intocada.

DECISION: aplicar a arquitetura aprovada Sheets → validação → PR público → aplicativo. A visão interna conserva todos os registros e seus bloqueios. Aptidão interna não autoriza publicação. Não criar outro banco, coletor de redes sociais ou endpoint público para a planilha.

REQ-SYNC-01 / BR-SYNC-01: somente apto + reuso liberado + editorial aprovado + requisitos factuais válidos podem alimentar a projeção pública. SPEC: exportador existente, contrato público compartilhado e auditoria no CI; saída vazia válida quando nenhuma sessão está liberada.

REQ-SYNC-02 / BR-SYNC-02: nenhum dado interno deve entrar no aplicativo público. SPEC: lista explícita de campos aceitos; rejeitar colunas de observações, responsáveis, evidências e snapshots internos. Falhas de rede/contrato não carregam dados parciais ou fictícios.

REQ-SYNC-03 / BR-SYNC-03: atualizações exigem PR humano; cron somente com habilitação explícita e credenciais de leitura. SPEC: variável QFAZER_CATALOG_SYNC_ENABLED=true além das duas configurações de acesso; sem merge ou deploy automático. Erro de exportação mantém o arquivo anterior.

ASSUMPTION: o catálogo público será servido na mesma origem que o P2 após release aprovado.

OPEN_QUESTION: conta de serviço Google e secrets/variáveis ainda não confirmados; o conector GitHub não permitiu consultar seus metadados. Nenhuma credencial foi criada nem compartilhamento alterado.

GRILLME: não retroceder para 204; não publicar os 240 para preencher o app; não acionar coleta nas 134 fontes, cuja análise não autoriza extração. Manter canais de descoberta e revisão humana na entrada da CURADORIA.

| UAT | Vínculo | Dado / quando / então | Estado |
|---|---|---|---|
| UAT-SYNC-01 | REQ-SYNC-01 | Fonte com zero aprovações / gerar catálogo / saída pública vazia e curadoria interna completa | NOT_RUN |
| UAT-SYNC-02 | REQ-SYNC-01 | Sessão sintética aprovada / exportar e ler no app / mesma sessão, preço e ID | NOT_RUN |
| UAT-SYNC-03 | REQ-SYNC-02 | Snapshot interno ou campo privado / carregar ou auditar / rejeição integral | NOT_RUN |
| UAT-SYNC-04 | REQ-SYNC-03 | Credencial ausente ou gate desabilitado / workflow / sem leitura nem PR | NOT_RUN |
| UAT-SYNC-05 | REQ-SYNC-03 | Integração configurada em homologação / nova revisão / PR aguarda decisão humana | BLOCKED: credencial |

Responsável pelo aceite: Product Owner. Testes automatizados não substituem UAT. Reversão: reverter commit do catálogo aprovado e desabilitar gate; o serviço worker não armazena o catálogo. Sem produção alterada nesta implementação.
