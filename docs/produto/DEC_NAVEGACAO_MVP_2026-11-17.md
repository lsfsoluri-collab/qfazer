# Qfazer — DEC-UX-02 | Navegação principal do MVP

**Data:** 17/11/2026 · **Status:** APPROVED BY PO · **Escopo:** MVP da feira de 05/12/2026

## Decisão aprovada
A barra de navegação principal terá **exatamente quatro abas**, rotuladas:
1. **Início**
2. **Salvos**
3. **Buscar**
4. **Chat**

**Perfil não integra a barra principal da versão da feira.** Caso a interface exija entrada de perfil, sua existência e localização deverão ser objeto de decisão separada. Não criar autenticação, cadastro, perfil pessoal ou novas funcionalidades por inferência.

## Rastreabilidade e impacto
- Regra anteriormente aprovada em G4 (DEC-UX-01): quatro destinos funcionais **Explorar, Buscar, Conversar, Salvos**.
- Decisão atual explicita rótulos e ordem para a nova identidade: **Início → Salvos → Buscar → Chat**.
- Correspondências funcionais: `Início` = Explorar; `Chat` = Conversar; `Salvos` e `Buscar` preservam funções.
- O mockup mais recente ilustra cinco itens, incluindo Perfil. **A decisão expressa da Product Owner prevalece para o MVP da feira**.
- Corrigir mockups/cópias/código para quatro abas, sem reduzir a navegação a ícones sem rótulos acessíveis.
- Ficha do evento, filtros e comparação são superfícies contextuais, não novas abas principais.

## REQ → BR → SPEC → UAT
- **REQ-UX-NAV-01:** facilitar acesso consistente aos quatro destinos.
- **BR-UX-NAV-01:** a barra principal exibe somente Início, Salvos, Buscar e Chat, nessa ordem.
- **SPEC-UX-NAV-01:** componente responsivo com 4 destinos, foco visível, label acessível, estado ativo identificável sem depender só de cor; sem Perfil no menu.
- **UAT-UX-NAV-01:** em tela mobile, confirmar exatamente quatro itens, rótulos, ordem, funcionamento e estado ativo.
- **UAT-UX-NAV-02:** confirmar que Perfil não aparece no menu principal nem introduz rota nova sem autorização.
- **UAT-UX-NAV-03:** navegar para ficha, filtros e comparação sem criar uma quinta aba.
- **UAT-UX-NAV-04:** teclado e leitor de tela identificam cada destino e o estado selecionado.

**Status dos testes:** NOT_RUN. Aprovação da PO refere-se à decisão de negócio, não à implementação, merge, QA ou deploy.
