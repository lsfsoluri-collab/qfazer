import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CATEGORIES,resolveCategories,resolveTags} from '../p2/taxonomy.js';
import {normalizeSessions,sessionMatches} from '../p2/catalog.js';
import {buildPublicProjection} from '../scripts/catalog-pipeline.mjs';
const now=new Date('2026-11-18T12:00:00Z');
const record=(overrides={})=>({
  session_id:'t-1',titulo:'Samba e corrida',categoria:'MÚSICA',categorias_busca:'Música; Esporte',
  tags_busca:'Samba; Ao ar livre',status:'APTO_PARA_PILOTO',reuso_publico:'LIBERADO',
  inicio_utc:'2027-01-20T22:00:00Z',data_local:'2027-01-20',
  hora_local:'19:00',codigo_ibge:'3550308',local:'Parque',bairro:'Centro',
  url_oficial:'https://example.org/evento',tipo_preco:'GRATUITO',preco_min_centavos:0,
  licenca_imagem:'NAO_VERIFICADA',imagem_url:'https://example.org/foto.jpg',...overrides
});
test('13 classificações brutas viram categorias canônicas sem rótulo técnico',()=>{
 const inputs=['ARTES_VISUAIS','MÚSICA','CINEMA','TEATRO','ÓPERA','LITERATURA','DANÇA','GASTRONOMIA','FEIRAS_E_CULTURA_URBANA','FESTAS_E_VIDA_NOTURNA','BARES_COM_PROGRAMACAO','ESPORTES_E_MOVIMENTO','OFICINAS_E_EXPERIENCIAS'];
 const idset=new Set(CATEGORIES.map(x=>x.id));
 for(const categoria of inputs){const ids=resolveCategories({categoria});assert.ok(ids.length);for(const id of ids)assert.ok(idset.has(id),`unknown ${id}`);assert.ok(!ids.includes('outros'),categoria);}
});
test('categorias explicitamente múltiplas pertencem a uma única sessão',()=>{
 const [x]=normalizeSessions([record()],{now});
 assert.deepEqual(x.categories,['musica','esporte']);
 assert.equal(sessionMatches(x,{category:'musica'}),true);
 assert.equal(sessionMatches(x,{category:'esporte'}),true);
 assert.equal(sessionMatches(x,{category:'cinema'}),false);
});
test('tags explicitadas ajudam a busca sem criar uma segunda sessão',()=>{
 const [x]=normalizeSessions([record()],{now});
 assert.equal(x.id,'t-1');assert.deepEqual(x.tags,['samba','ao-ar-livre']);
 assert.equal(sessionMatches(x,{query:'samba'}),true);
 assert.equal(sessionMatches(x,{query:'ao ar livre'}),true);
});
test('combinação técnica vira opções separadas, sem assumir outros gêneros',()=>{
 assert.deepEqual(resolveCategories({categoria:'FESTAS_E_VIDA_NOTURNA'}),['festas','vida-noturna']);
 assert.deepEqual(resolveTags({categoria:'FESTAS_E_VIDA_NOTURNA'}),['vida-noturna']);
 assert.deepEqual(resolveCategories({categoria:'FEIRAS_E_CULTURA_URBANA'}),['feiras']);
 assert.deepEqual(resolveTags({categoria:'FEIRAS_E_CULTURA_URBANA'}),['cultura-urbana']);
});
test('tags não verificadas ou inexistentes não são criadas pela descrição',()=>{
 const [x]=normalizeSessions([record({titulo:'Evento com rock, samba e futebol',categorias_busca:'Música',tags_busca:''})],{now});
 assert.deepEqual(x.tags,[]);
 assert.deepEqual(x.categories,['musica']);
});
test('foto aparece apenas quando imagem está liberada',()=>{
 assert.equal(normalizeSessions([record()],{now})[0].imageUrl,null);
 assert.equal(normalizeSessions([record({licenca_imagem:'LIBERADA'})],{now})[0].imageUrl,'https://example.org/foto.jpg');
});
test('pipeline carrega categorias e tags e não copia imagem sem licença',()=>{
 const row={...record(),inicio_local:'2027-01-20T19:00:00-03:00',municipio:'São Paulo',
  fonte_id:'oficial',verificado_em:'2026-11-18',revisao_editorial:'APROVADO',
  responsavel_revisao:'Equipe',revisado_em:'2026-11-18',preco_max_centavos:0,url_acesso:'https://example.org/evento'};
 const [x]=buildPublicProjection([row],{now}).sessoes;
 assert.deepEqual(x.categorias_busca,['musica','esporte']);
 assert.deepEqual(x.tags_busca,['samba','ao-ar-livre']);
 assert.equal(x.imagem_url,undefined);
});
test('categoria desconhecida é bloqueada no publicador',()=>{
 const row={...record({categoria:'CLASSIFICACAO_SOLTA',categorias_busca:''}),inicio_local:'2027-01-20T19:00:00-03:00',municipio:'São Paulo',
  fonte_id:'oficial',verificado_em:'2026-11-18',revisao_editorial:'APROVADO',
  responsavel_revisao:'Equipe',revisado_em:'2026-11-18',preco_max_centavos:0,url_acesso:'https://example.org/evento'};
 assert.throws(()=>buildPublicProjection([row],{now}),/categoria não mapeada/);
});
