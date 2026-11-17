# Qfazer — Revisão G5 e protocolo de aceite da Sprint 1
**Data:** 17/11/2026 · **Versão:** 0.1 · **Status:** REVIEW_RECORDED / G5 NOT_APPROVED · **Autor:** coordenador Factory / revisor de especificação
**Escopo:** avaliação documental, sem verificação de ambiente de execução, gastos, deploy ou dispositivos físicos.

## Papéis definidos pela Product Owner
- **Luana (PO):** responsável por especificação e aprovação de negócio, custos, escopo, experiência e aceite UAT.
- **Agente de IA de desenvolvimento (executor técnico):** apresenta proposta final de arquitetura, implementa após gate, registra commits/versões, testes e riscos. Não pode aprovar a si próprio.
- **Assistente coordenador (revisor):** questiona arquitetura apresentada **pelo agente executor**, compara código, requisitos, segurança, custos e evidências, registra PASS/FAIL/BLOCKED e ressalvas. Não se autocertifica sobre versões do próprio documento.
- **Integrante da equipe:** colabora tecnicamente e mantém o legado na Netlify própria; papel de revisora *não presumido*.
- **Revisão independente G5:** precisa ser feita sobre **proposta técnica distinta**, assinada pelo executor (ou terceiro técnico distinto do autor). Como o parecer candidato existente foi preparado pelo coordenador, **a revisão deste próprio parecer não equivale a revisão independente**.

## GRILLME técnico — lacunas reais
| ID | Severidade | Achado e causa | Resolução esperada |
|---|---|---|---|
| REV-G5-01 | CRITICAL | A arquitetura e fornecedor finais ainda não foram escolhidos; duas alternativas com custos não medidos | ADR do agente técnico: escolha fundamentada, tradeoffs, limites e fallback |
| REV-G5-02 | HIGH | Teto R$ 50/mês definido, mas sem volume comprovado, plano real ou estimativa total confiável de IA, hospedagem, cron e banco | simular cenário feira e limites de cota, alertas, desligamento e valor estimado em reais com data e premissas |
| REV-G5-03 | HIGH | Push obrigatório e cron alvo de 5 min; a arquitetura candidata contém contratos genéricos ainda sem revisão do executor | ameaça de abuso, autenticação de dispositivo, consentimento, revogação, outbox idempotente, retries, timezone e recuperação |
| REV-G5-04 | HIGH | Backend legado no lugar errado e `publish="."` expõe raiz se migrado sem build | pasta pública dedicada, Functions isoladas e CI; verificar que uploads/MD/secret/datasets não sejam servidos |
| REV-G5-05 | HIGH | 204 entradas de catálogo sem comprovação de reuso público; exigência do release público | plano de projeção publicável com liberação por fonte e dados, não usar registros internos na Sprint 1 |
| REV-G5-06 | MEDIUM | Exigências de LGPD e propriedade da subscription não têm responsável ou prazo de retenção confirmados | plano de dados mínimos, transparência, eliminação, contato operacional e controles seguros para usuário sem login |
| REV-G5-07 | MEDIUM | Garet não inclui licença comprovada nos ZIPs recebidos; Montserrat possui OFL | obter licença Garet para web/redistribuição ou usar fallback temporário sem commitar binários restritos |
| REV-G5-08 | MEDIUM | Mockups com telas e funcionalidades não são prova de implantação; a Sprint 1 deve evitar simular IA, push, catálogo ou reserva | placeholder/empty states honestos, sem cards de eventos fictícios apresentados como reais |
| REV-G5-09 | MEDIUM | Protótipo antigo em conta pessoal colaborativa | preservar site/formulário/URL e isolar novo backend/hospedagem com admin da PO |
| REV-G5-10 | MEDIUM | SPEC Sprint 1 é uma matriz de rastreabilidade, não ainda SPEC completas em campos de pré-condição/erros/dados/permissões por história | agente complementa flows/alternativas/erros e UAT verificáveis sem expandir escopo |

## Independência da revisão
A Product Owner e este assistente são revisores em relação ao **agente de IA executor**, conforme escolha expressa da PO. **Não é possível alegar revisão independente da arquitetura já redigida por este mesmo assistente**. Solução operacional: o agente executor entrega sua **ADR G5 própria, versionada e assinada**, então este assistente revisa a ADR com critérios públicos e Luana valida riscos de negócio. Se a proposta técnica for redigida pelo mesmo agente revisor, marcar BLOCKED em vez de autocertificar.

## Critérios de fechamento G5
- [ ] ADR específica do executor, com arquitetura, contratos, dados, Push e custos até R$50/mês e comparação de alternativas.
- [ ] Donos/ambientes separados, credenciais e política de privacidade/segurança documentados.
- [ ] Riscos CRITICAL/HIGH com mitigação/dono/data/critério de aceite; sem mudanças comerciais inventadas.
- [ ] Plano executável da Sprint 1, com reversibilidade, UAT e exemplos de erro.
- [ ] Revisão independente do artefato do executor por este revisor, com achados e respostas.
- [ ] Aceite humano da PO para versão exata da baseline G5.

## Limites até o gate
- Permitido: issues, documentação e revisão, organização de arquivos preparatórios não publicados.
- **Não autorizado neste registro:** criar conta/hospedagem, contratar API/banco, alterar DNS, deploy, merge, movimentar feedbacks reais ou colocar catálogo interno no frontend.
- Sprint 1 começa somente após aceite G5; o plano aprovado contempla **nova identidade, quatro abas, PWA shell, estados honestos e responsividade**. IA, catálogo e push funcionais NÃO fazem parte do seu aceite.
- Todos os testes do código e dispositivos permanecem **NOT_RUN** até execução comprovada no G6/G7.

## Status e próximo ator
**G5 IN_REVIEW / NOT APPROVED.** Próxima entrega é a **ADR assinada pelo agente de desenvolvimento** com decisões de arquitetura e custos, para revisão deste assistente e aceite da PO. Nenhuma evidência de teste independente, conta ou deploy foi obtida aqui.
