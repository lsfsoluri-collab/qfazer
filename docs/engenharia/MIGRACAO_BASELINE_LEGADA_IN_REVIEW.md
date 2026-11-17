# Revisão de migração do protótipo anterior — 17/11/2026

**Estado:** em preparação / **não apto a merge ou deploy**. A branch `chore/migracao-baseline-pwa` contém cópias **inalteradas** de cinco arquivos de texto do protótipo `madyeec/qual-a-boa-pime`: `index.html`, `guia.mjs`, `netlify.toml`, `_headers`, `robots.txt`. A branch principal não foi modificada por esta migração.

## Bloqueios identificados
1. **Imagens faltantes:** a página referencia `icone-preto.png`, `belas-artes-preto.png`, `belas-artes-branco.png` e demais imagens. Os arquivos binários **não foram migrados**; sem eles a página perde ícones/mídia. São sete arquivos PNG/JPG no repositório de origem e devem ser trazidos com direitos e integridade verificados.
2. **Função fora do caminho configurado:** `netlify.toml` define `functions = "netlify/functions"`, mas o único `guia.mjs` encontrado na árvore de origem estava na raiz. A equipe deve resolver e testar o path de build, sem pressupor backend funcional.
3. **Catálogo fictício duplicado:** `index.html` contém dez eventos ilustrativos e `guia.mjs` os repete. Devem ser substituídos por fonte única, versionada e auditável em ambiente privado antes de validação funcional.
4. **Conversa:** a interface contém conversa simulada e uma função opcional com serviço externo; não há evidência de integração real nem de que a API está operacional. Não configurar credenciais sem política de acesso e custo.
5. **Formulários:** o protótipo usa Netlify Forms para coleta voluntária. É preciso confirmar consentimento, retenção e compatibilidade do novo domínio antes de ativação.
6. **Controle de indexação:** `robots.txt` contém `Disallow: /`; manter até decisão de exposição pública.
7. **Reuso de eventos:** nenhum dos 204 registros está liberado para publicação pelo G5. Não copiar ZIP/JSON/CSV da base de homologação para o frontend público.

## Ordem recomendada para engenharia
A. Identificar owner do deployment e a baseline visual aprovada (capturas/mockups).
B. Migrar assets binários e verificar hash/render sem deploy.
C. Resolver entrada das funções e ajustar o frontend para uma **API interna única de sessões**, com filtros rígidos `APTO_PARA_PILOTO`, São Paulo/3550308 e sessão futura.
D. Alimentar base isolada com o conjunto de 161 aptos da fotografia, lembrando que a contagem diminui conforme o relógio; manter 43 apenas na auditoria.
E. Aplicar taxonomia mapeada, preço/disponibilidade cautelosos e recomendações limitadas a três IDs.
F. Rodar testes técnicos; executar UAT da spec; apresentar evidências de acessibilidade, proteção de dados, consumo e rollback.
G. Revisar direitos de reuso e obter aprovação humana antes do merge/deploy.

**Gate:** esta migração é somente staging. Não declarar funcionalidade, testes ou autorização de publicação concluídos.