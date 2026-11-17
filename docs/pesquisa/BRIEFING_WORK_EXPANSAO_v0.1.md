# Qfazer | Briefing de pesquisa em navegador — expansão do catálogo
Versão 0.1 · 17/11/2026 · pronta para executar em Work, mantendo G5 IN_REVIEW.

## Missão
Ampliar catálogo piloto de experiências culturais presenciais no município de São Paulo para a feira acadêmica de 05/12/2026. Priorizar cobertura e variedade adequadas ao público 18–29 anos, sem sacrificar verificação ou compliance.

## Base de entrada
Usar os 100 registros existentes e os documentos catalogo_qfazer_piloto.json, dicionario_de_dados.md, matriz_fontes_compliance.md, relatorio_validacao_g5.md como baseline somente quando esses arquivos estiverem efetivamente disponíveis no Work. Não alegar leitura caso não estejam. Repositório para documentação e futuro código: https://github.com/lsfsoluri-collab/qfazer . Nenhuma publicação sem aprovação.

## Escopo
Janela de busca: 18/11 a 31/12/2026; reforçar 04, 05 e 06/12. São Paulo **município**, não estado. Meta exploratória de 40–80 novas sessões, subordinada a permissões e qualidade. Incluir festas, baladas, DJs, bares com programação, shows, gastronomia, esportes, oficinas, cinema, teatro, arte, feiras culturais e categorias confirmadas no mockup.

## Prospecção, em camadas
1. Fontes oficiais e calendários: Mapa da Cultura, Agenda Viva SP, Prefeitura/Esportes, Sesc/centros culturais quando acessíveis.
2. Produtoras e espaços: agendas oficiais de clubes, casas de show, festas, festivais, bares com noites de programação, associações esportivas e organizadores.
3. Instagram público: posts e perfis oficiais de produtoras, coletivos, artistas, casas e eventos; usar para DESCOBERTA, anotando permalink e data de publicação. Confirmar em fonte oficial específica antes de aprovar.
4. Guias e agregadores: SP Secreto, Fever, Shotgun, DICE, Sympla e outros como pistas, respeitando termos de acesso. Não extrair em massa dados protegidos.
5. Gastronomia e esporte: eventos em locais participantes, calendário oficial de corridas e projetos esportivos, feiras e festivais.

## Fontes candidatas verificadas por pesquisa documental
- https://mapa.cultura.gov.br/eventos/#list
- https://agendavivasp.com.br/cultural-events
- https://www.cultura.sp.gov.br/sec_cultura/Eventos/Agenda_VivaSP
- https://prefeitura.sp.gov.br/w/servico/corridas-de-rua
- https://prefeitura.sp.gov.br/esportes/
- https://gastronomia.sampa.br/comida (descoberta; confirmar origem)
- https://n4u.app/events/sao-paulo (descoberta de produtores/Instagram; confirmar origem)
- https://shotgun.live/ (descoberta, não permissão implícita)
- https://feverup.com/ (descoberta, não permissão implícita)

Esta lista não autoriza coleta automatizada. Identificar novas casas, produtoras, perfis e domínios a partir de eventos reais, com links específicos e evidência.

## Critérios
- Evento presencial, real, futuro, no município de São Paulo.
- Sessão com data, hora e endereço confirmados (ou revisão pendente).
- Categorias e etiquetas correspondem ao público e proposta sem generalização estereotipada.
- Gratuidade e preço mediante prova; taxas separadas; ingressos não são presumidamente disponíveis.
- URL oficial ou canal autorizado, fonte, evidência, timestamp e notas de compliance.
- Sem copiar fotos, reels, legendas, textos extensos ou dados pessoais.

## Regras de pesquisa
- Verificar termos, políticas de privacidade, licenças, robots e restrições antes de automatizar ou armazenar/republicar.
- Não fazer scraping do Instagram, contornar login/CAPTCHA, acessar perfis privados, nem simular acesso privilegiado.
- Usar páginas públicas e navegação autorizada. Instagram é lead; preencher fatos só após confirmação.
- Deduplicar contra catálogo v1.0 e entre novas fontes sem fundir sessões distintas.
- Classificar cada registro: LEAD_PENDENTE, PENDENTE_VERIFICACAO, APTO_PARA_PILOTO_INTERNO, NAO_UTILIZAR. Publicação só após aprovação separada da PO e comprovação de reuso.
- Registros antigos, fora do município, sem dados suficientes ou cancelados são excluídos das recomendações mas preservados na auditoria.

## Entregas
1. `catalogo_qfazer_expansao_v0.1.json` e `.csv` com novas sessões e compatibilidade com dicionário anterior;
2. `leads_instagram_produtoras.csv` com perfil/permalink público e estado de verificação, sem dados pessoais;
3. `matriz_fontes_compliance_expansao.md` com evidências e decisão por fonte;
4. `relatorio_qualidade_expansao.md`: quantos leads, sessões, duplicatas, aptos, pendentes/rejeitados, categorias e bairros;
5. `recomendacao_integracao.md`: lote seguro para teste interno, questões pendentes e cenários UAT;
6. lista de fontes que autorizam ou exigem acordo, com links exatos.

## Gate final
Parar antes de qualquer importação no produto, publicação, criação de crawler recorrente, commit de base bruta ou deploy. Solicitar aprovação da Product Owner para publicar. Se faltar evidência, explicitar sem preencher lacunas.