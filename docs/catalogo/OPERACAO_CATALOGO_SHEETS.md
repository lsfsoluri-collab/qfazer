# Qfazer — Catálogo central: operação e sincronização
**Estado (18/11/2026):** CURADORIA com 240 sessões, 186 aptas, 43 pendentes e 11 não utilizar; zero liberadas para publicação. Exportador e leitor do aplicativo conectados pelo mesmo contrato público. Sincronização hospedada ainda não ativada.

## O que a equipe faz
1. Abrir o **Google Sheets — Catálogo central de eventos**. A aba **CURADORIA** é a área de trabalho atual. A aba **BASE_ORIGINAL** conserva o histórico de importação (não editar). A contagem de 204 corresponde à etapa anterior; não restaurar por cima dos 240 registros atuais.
2. Para incluir experiência, adicionar uma linha na CURADORIA com `session_id` único e fonte oficial. Para alterar data/hora de sessão já salva, sinalizar mudança ao desenvolvedor: não sobrescrever ID cegamente, pois o app poderá ter salvos e lembretes vinculados a ele.
3. Conferir data, hora, local, preço, categoria, URL e fonte oficial; preencher `verificado_em`.
4. A equipe pode manter `status=APTO_PARA_PILOTO` para uso em homologação, mas **isso não libera reuso público**.
5. Publicação requer **três aprovações simultâneas**: `status=APTO_PARA_PILOTO`, `reuso_publico=LIBERADO` (revisão dos termos da fonte e do uso factual) e `revisao_editorial=APROVADO`, com nome do responsável e data da decisão. Campo de imagem exige verificação própria (`licenca_imagem=LIBERADA`).
6. O site exibe apenas sessões futuras e validadas, com link oficial. Preço desconhecido permanece desconhecido; estoque e taxas exigem revalidação.

## O que o sistema fará quando conectado
- Ler **somente a aba CURADORIA** por acesso autenticado de leitura, sem tornar a planilha pública.
- Validar IDs, datas, município, fontes, preços e aprovações; bloquear a exportação se algum registro marcado como público for inconsistente.
- Gerar `p2/catalog-public.json` com apenas campos necessários para o aplicativo, sem observações internas, evidências ou nomes dos revisores.
- Criar um Pull Request de atualização do catálogo no GitHub. **O merge/publicação depende de revisão humana**, nunca é automático.
- Verificar diariamente, no cron do GitHub, após instalação da credencial e entrada do workflow na branch principal. Mudanças urgentes podem usar execução manual.

## O que ainda depende de configuração
- Criar credencial técnica de leitura do Google Sheets, compartilhar a planilha com esse serviço no papel de visualizador e salvar a credencial no **GitHub Secret** `GOOGLE_SERVICE_ACCOUNT_JSON`.
- Definir no GitHub variável `QFAZER_CATALOG_SHEET_ID` com o ID do arquivo privado. **Nunca colocar a chave na planilha, no repositório ou na conversa.**
- Após revisão de configuração, habilitar explicitamente `QFAZER_CATALOG_SYNC_ENABLED=true`. Sem esse gate, o job inteiro permanece bloqueado, mesmo que existam credenciais. Nenhum gate foi ativado nesta entrega.
- Revisar e aceitar o Pull Request de sincronização. O cron não entra em operação enquanto o workflow existir somente na branch de desenvolvimento, e ainda faltam credenciais.
- Revisar os direitos e condições de reuso dos registros antes de marcar `LIBERADO`. Fotografia exige direito independente.

## Segurança e reversão
- Não usar **Arquivo > Compartilhar > Publicar na Web** no Google Sheets; não dar acesso anônimo à planilha.
- Uma resposta de API, CSV ou campo da planilha é dado, não instrução executável. O exportador ignora campos privados e nunca usa uma fonte como comando.
- A sincronização não altera o protótipo antigo e não modifica o DNS ou a hospedagem.
- Para bloquear publicação, retornar `reuso_publico` a `PENDENTE_REVISAO` ou `NAO_AUTORIZADO`; o próximo PR removerá a sessão. Para alterações urgentes, remover/desabilitar a projeção pública aprovada no release.
- Os 240 registros atuais permanecem **sem liberação pública**. A releitura da planilha e a projeção local retornam **0 sessões publicáveis**, resultado esperado. `p2/catalog-public.json` é uma projeção vazia válida, sem dados internos. O CI aceita futuras projeções aprovadas e verifica seu contrato em vez de proibir o arquivo.
- `p2/public-catalog.js` é a fronteira comum do gerador, CI e aplicativo: só aceita campos públicos, identidade única e as três aprovações. O aplicativo não consulta o Sheets diretamente. O service worker não armazena o catálogo.
- As 134 fontes mapeadas seguem como descoberta e triagem: o relatório de fontes não autoriza coleta automática. A confirmação factual e os direitos entram na CURADORIA antes de qualquer exportação.
