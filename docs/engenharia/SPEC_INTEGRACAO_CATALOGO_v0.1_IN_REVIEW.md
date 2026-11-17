# Qfazer — SPEC de integração do catálogo consolidado
**ID:** SPEC-CAT-INT-001 · **Versão:** 0.1 · **Estado:** IN_REVIEW (G5 Engineering Baseline) · **Data:** 17/11/2026
**Autoria:** coordenação de negócio / proposta para revisão independente de engenharia
**Aprovação:** Product Owner para negócio; engenharia responsável por viabilidade e evidências
**Escopo:** homologação interna; **não** autoriza publicação pública nem deploy.

## Fontes e regras precedentes
- Baseline funcional aprovada REV7 (12/11/2026): sessão é unidade de busca/comparação, até três recomendações, preços/estoque desconhecidos nunca são inventados, IA trabalha com candidatos/IDs verificados pelo servidor; salvos por ID devem reconsultar catálogo atualizado; notificações têm requisitos próprios ainda pendentes de engenharia.
- Decisão da PO em 17/11: registros `PENDENTE_VERIFICACAO` são excluídos até confirmação; `NAO_UTILIZAR` excluídos. Ver `docs/catalogo/REGRA_ELEGIBILIDADE_G5_v0.1.md`.
- Fotografia consolidada G5: 204 registros auditados (161 aptos internos, 33 pendentes, 10 rejeitados), dois lotes de origem identificáveis. A fotografia de 161 só vale para filtro de status; a quantidade futura depende do relógio.
- Contrato de sessão: campos do piloto preservados; extensão da expansão em schema candidato 1.1.0. Adaptação e normalização não podem alterar fatos.

## REQ / BR / SPEC
| REQ | Regra de negócio (BR) | Especificação |
|---|---|---|
| REQ-CAT-01 | BR-CAT-01: exclusivamente sessões aptas participam de buscas internas | SPEC-CAT-01: filtro obrigatório antes de busca, conversa e ranqueamento |
| REQ-CAT-02 | BR-CAT-02: seleção depende da sessão futura e cidade confirmada | SPEC-CAT-02: `inicio_local` válido e > agora no fuso SP; `codigo_ibge=3550308` |
| REQ-CAT-03 | BR-CAT-03: preço e estoque não são presumidos | SPEC-CAT-03: não afirmar gratuidade sem `GRATUITO` explícito; preço final exige taxas conhecidas; disponibilidade exige consulta recente |
| REQ-CAT-04 | BR-CAT-04: no máximo três recomendações reais | SPEC-CAT-04: candidatos filtrados antes de qualquer uso da IA; todas as respostas trazem `session_id` e fonte; zero candidatos = zero indicações |
| REQ-CAT-05 | BR-CAT-05: importação auditável e reversível | SPEC-CAT-05: lotes `piloto-v1.0.0` e `expansao-v0.1`; upsert por `session_id` com controle da versão de origem, contagens e rollback idempotentes |
| REQ-CAT-06 | BR-CAT-06: exclusões não apagam evidência | SPEC-CAT-06: pendentes/rejeitados ficam apenas na auditoria restrita, com motivo; cancelamento suprime recomendação |
| REQ-CAT-07 | BR-CAT-07: salvos não podem congelar dados obsoletos | SPEC-CAT-07: salvos são IDs; reconsultar sessão para mudança de data, preço, cancelamento e elegibilidade |
| REQ-CAT-08 | BR-CAT-08: liberação pública independente da homologação | SPEC-CAT-08: negar publicação se `reuso_publico=PENDENTE_REVISAO`; gate de release exige autorização/avaliação de reuso e aceite específico |

## Contrato de integração
- Atributos obrigatórios: `session_id`, `event_id`, `titulo`, `categoria`, `data_local`, `inicio_local`, `fuso`, `local`, `municipio`, `codigo_ibge`, `url_oficial`, `fonte_id`, `verificado_em`, `status`, `reuso_publico`, `evidencias`. A evidência deve ser armazenada de modo restrito, e não enviada integralmente à interface/IA.
- Preservar data original local e offset; início de festa às 23h pertence ao dia de início ainda que termine no dia seguinte.
- `tipo_preco=NAO_INFORMADO` não vira zero; `preco_online_observado_desde_centavos` é preço observado 'a partir de', não total garantido; não calcular teto rigoroso com taxas desconhecidas.
- `url_acesso` pode apontar para evento, sessão, ficha ou central, e CTA precisa refletir escopo. Não prometer compra direta quando a ficha é apenas informativa.
- Taxonomia: mapear categorias técnicas para chips do mockup aprovado via tabela versionada; nunca excluir categorias novas por ausência de chip: elas podem ficar em Todos, a depender de decisão de produto.
- `imagem_url=null`: não usar automaticamente fotos de terceiros.
- Sessão apta não é sinônimo de estoque confirmado, gratuidade, direitos de publicação ou entrada garantida.

## Fluxo de homologação proposto
1. Engenharia confirma onde está o código do PWA e quais arquivos do novo repo representam a baseline. O novo repo contém hoje documentação; código não foi migrado neste fluxo.
2. Definir destino **privado** ou isolado, com acesso controlado e sem publicação ao usuário final.
3. Receber dois lotes originais em ambiente seguro, conferir assinaturas e contagens; não fazer commit de JSON/CSV bruto no repositório público.
4. Implementar transformador versionado e relatório de divergências; não eliminar nenhum dos 204 registros da trilha.
5. Importar e construir a seleção interna elegível. Aplicar filtro de tempo em cada consulta; salvamento em cache respeita validade e não confirma oferta.
6. Conectar busca, filtros, comparação e conversa ao mesmo conjunto de `session_id`.
7. Revisão técnica independente + testes automatizados → UAT; se falhar, restaurar snapshot piloto e registrar falha.
8. Somente após aceites e revisão de direitos submeter decisão de exposição pública.

## Cenários UAT — todos NOT_RUN
| ID | Pré-condição / quando | Esperado |
|---|---|---|
| UAT-CAT-01 | Buscar título de sessão pendente | Zero resultado e nenhuma recomendação da IA |
| UAT-CAT-02 | Buscar título rejeitado/cancelado | Zero resultado; cancelamento preservado na auditoria |
| UAT-CAT-03 | Filtrar evento que já começou | Não aparece como opção futura |
| UAT-CAT-04 | Buscar 'festa sábado à noite' com sessão atravessando 00h | Data exibida é do início; horário respeita fuso SP |
| UAT-CAT-05 | Buscar evento sem preço confirmado com teto máximo | Não afirmar que cabe no teto |
| UAT-CAT-06 | Pedir 'ingresso garantido' sem confirmação de estoque | Não afirmar disponibilidade garantida |
| UAT-CAT-07 | Solicitar cinco sugestões | No máximo três `session_id` válidos |
| UAT-CAT-08 | Reimportar lote idêntico | Sem duplicidade; mesma contagem por status |
| UAT-CAT-09 | Reverter expansão | Piloto restaurado sem apagar auditoria |
| UAT-CAT-10 | Abrir sessão salva que mudou de status | Estado atualizado, sem valor/estoque antigo como fato atual |
| UAT-CAT-11 | Tentar publicar linha com `reuso_publico=PENDENTE_REVISAO` | Publicação bloqueada |
| UAT-CAT-12 | Receber URL oficial não adequada à compra direta | CTA diz 'Consultar condições' ou equivalente, sem prometer ingresso |
| UAT-CAT-13 | Buscar categorias expandidas não mapeadas em chips | Não perder sessões em 'Todos'; aplicação das tags precisa ser validada |

Cada cenário exige captura de resultado, IDs retornados, versão, carimbo temporal, responsável e classificação PASS/FAIL/BLOCKED. A execução e seu resultado não são presumidos.

## Riscos / dependências
- **HIGH:** destino de homologação, acesso aos dados privados, autorização de publicação por fonte.
- **HIGH:** versão do código de referência ainda reside no repositório anterior e a engine conversacional do protótipo usa 10 eventos fictícios.
- **HIGH:** identidade anônima/segurança de Web Push já permanece dependência de engenharia, não deve ser simplificada pela integração do catálogo.
- **MEDIUM:** mapeamento de taxonomia e bairro; horários de festas noturnas; preços e taxas variáveis.
- **MEDIUM:** muitos eventos aptos têm estoque não verificado; separar 'evento existe' de 'ingresso disponível'.

## Checklist do gate G5
- [x] Decisão de exclusão de pendentes registrada
- [x] Snapshot QA de dois lotes documentado
- [x] SPEC proposta com rastreabilidade e UAT antes do build
- [ ] Responsável técnico e destino de homologação definidos
- [ ] Contrato + taxonomia revisados tecnicamente
- [ ] Procedimento de importação/reversão aprovado
- [ ] Riscos de reuso considerados no fluxo de dados
- [ ] Aprovação humana para implementação isolada

**Sem aprovação dos itens pendentes, não avançar para G6.**
