import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCuration} from '../p2/curation.js';
import {buildPublicProjection} from '../scripts/catalog-pipeline.mjs';
import {readPublicCatalog} from '../p2/public-catalog.js';

const now=new Date('2026-11-18T20:00:00Z');
const editorial='Roda de samba e DJs reunidos numa programação de música ao vivo no bar.';
const base={
 session_id:'qa-evento-2026-12-05-1800',event_id:'qa-evento',titulo:'Evento sintético de QA',
 categoria:'MÚSICA',data_local:'2026-12-05',hora_local:'18:00',
 inicio_local:'2026-12-05T18:00:00-03:00',local:'Espaço de QA',bairro:'Centro',
 municipio:'São Paulo',codigo_ibge:'3550308',tipo_preco:'NAO_INFORMADO',
 preco_min_centavos:'',preco_max_centavos:'',url_oficial:'https://example.org/programacao',
 url_acesso:'https://example.org/ingresso',fonte_id:'qa',verificado_em:'2026-11-18',
 status:'APTO_PARA_PILOTO',reuso_publico:'PENDENTE_REVISAO',
 revisao_editorial:'PENDENTE_REVISAO',responsavel_revisao:'qa',
 revisado_em:'2026-11-18',licenca_imagem:'NAO_VERIFICADA',
 descricao_editorial:'Evento sintético em programação cultural.',
 por_que_vale_a_pena:editorial
};
test('justificativa por evento permanece nas diferentes sessões sem duplicar IDs',()=>{
 const sessions=normalizeCuration([base,{...base,session_id:'qa-evento-2026-12-06-1800',inicio_local:'2026-12-06T18:00:00-03:00',data_local:'2026-12-06'}],{now});
 assert.equal(sessions.length,2);
 assert.equal(new Set(sessions.map(s=>s.id)).size,2);
 assert.ok(sessions.every(s=>s.why===editorial));
});
test('cópia editorial não transforma homologação em publicação autorizada',()=>{
 const out=buildPublicProjection([base],{now});
 assert.equal(out.sessoes.length,0);
});
test('após as três aprovações, texto segue do exportador à ficha do P2',()=>{
 const published={...base,reuso_publico:'LIBERADO',revisao_editorial:'APROVADO'};
 const payload=buildPublicProjection([published],{now});
 assert.equal(payload.sessoes[0].por_que_vale_a_pena,editorial);
 const [card]=readPublicCatalog(payload,{now});
 assert.equal(card.why,editorial);
});
test('sessão sem copy não ganha justificativa fictícia',()=>{
 const published={...base,por_que_vale_a_pena:'   ',reuso_publico:'LIBERADO',revisao_editorial:'APROVADO'};
 const payload=buildPublicProjection([published],{now});
 assert.equal(payload.sessoes[0].por_que_vale_a_pena,undefined);
 const [card]=readPublicCatalog(payload,{now});
 assert.equal(card.why,'');
});
