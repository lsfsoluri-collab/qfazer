# Qfazer — PIME 2026/2

Produto acadêmico de descoberta, comparação e recomendação conversacional de experiências presenciais em São Paulo. Feira: **05/12/2026**.

**Status:** G5 — preparação da homologação e expansão controlada do catálogo. **O código do PWA não foi migrado para este repositório.** Protótipo anterior: https://github.com/madyeec/qual-a-boa-pime ; demo anterior: https://qual-a-boa-pime.netlify.app/.

## Regras de operação
- Público de pesquisa: 18–29 anos; objetivo é uma experiência funcional, com sessões reais, filtros por data/bairro/categoria/orçamento, comparação de até três opções, conversa, salvos e notificações sujeitos a suas especificações.
- Identidade: Qfazer. Não assumir que nomes, categorias, imagens ou conceitos do protótipo antigo já foram aprovados no repositório novo.
- Dados: entidade Evento → Sessão → Oferta, com Fonte e Evidências; não substituir fatos confirmados por texto gerado.
- Não incorporar um registro ao site público só porque está `APTO_PARA_PILOTO`: isso indica somente teste interno. Exigir revisão de reuso e de atualização.
- Nenhuma extração automatizada, deploy, alterações em código de produção ou publicação sem gate e evidências.

## Documentos de trabalho
- [Plano de expansão](docs/catalogo/PLANO_EXPANSAO_v0.1.md)
- [Taxonomia candidata e reconciliação do mockup](docs/produto/TAXONOMIA_CATEGORIAS_v0.1.md)
- [Briefing para Work: pesquisa e curadoria](docs/pesquisa/BRIEFING_WORK_EXPANSAO_v0.1.md)

## Pacote de dados anterior
Foi informado um lote auditado em 16/11/2026 com 100 registros (92 para teste interno, 1 pendente, 7 rejeitados); sua exportação completa e restrições legais **não estão incorporadas neste repositório**. Antes de migrar, validar hashes, formatos e regras de acesso. Não fazer commit do ZIP bruto em repo público por padrão.

## Gates
- G5: especificação e viabilidade técnica, em análise.
- G6: integração + testes, não iniciados neste repositório.
- G7: UAT, pendente.
- G8: liberação para feira, depende de aceite da Product Owner.

Aprovação de negócio e autorização de publicação são decisões distintas.