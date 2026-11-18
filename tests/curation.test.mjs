import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCuration,curationMatches} from '../p2/curation.js';
import {normalizeSessions,sessionMatches} from '../p2/catalog.js';
const now=new Date('2026-11-18T17:00:00-03:00');
const base={session_id:'cur-1',titulo:'Sessão de QA',categoria:'MÚSICA',categorias_busca:'Música; Esporte',tags_busca:'Samba',data_local:'2026-12-05',hora_local:'20:00',inicio_local:'2026-12-05T20:00:00-03:00',local:'Espaço de QA',bairro:'Centro',municipio:'São Paulo',codigo_ibge:'3550308',url_oficial:'https://example.org/qa',status:'APTO_PARA_PILOTO',reuso_publico:'PENDENTE_REVISAO',revisao_editorial:'PENDENTE_REVISAO',tipo_preco:'NAO_INFORMADO',preco_min_centavos:''};
test('curadoria preserva aptos, pendentes, rejeitados e iniciados; IDs únicos',()=>{
 const rows=[base,{...base,session_id:'pend',status:'PENDENTE_VERIFICACAO',inicio_local:'',hora_local:'',motivo_status:'Horário conflitante'},{...base,session_id:'nao',status:'NAO_UTILIZAR'},{...base,session_id:'passado',inicio_local:'2026-11-18T08:00:00-03:00'},base];
 const out=normalizeCuration(rows,{now});assert.equal(out.length,4);assert.equal(out.filter(x=>x.eligible).length,1);assert.equal(out.find(x=>x.id==='pend').reason,'Horário conflitante');assert.ok(out.find(x=>x.id==='passado').blockers.includes('iniciado'));
});
test('filtros de status, bloqueio e publicação são independentes e combináveis',()=>{
 const [x]=normalizeCuration([{...base,status:'PENDENTE_VERIFICACAO',inicio_local:''}],{now});assert.equal(curationMatches(x,{status:'PENDENTE_VERIFICACAO',blocker:'data',publication:'PENDENTE_REVISAO'}),true);assert.equal(curationMatches(x,{status:'APTO_PARA_PILOTO'}),false);assert.equal(x.eligible,false);
});
test('categorias múltiplas e tag Samba não duplicam a sessão',()=>{
 const [x]=normalizeCuration([base],{now});for(const category of ['musica','esporte'])assert.equal(sessionMatches(x,{category,query:'samba'}),true);
});
test('preço vazio não vira zero e não entra em Grátis ou teto de orçamento',()=>{
 const [x]=normalizeCuration([base],{now});assert.equal(x.minCents,null);assert.equal(sessionMatches(x,{budget:'free'}),false);assert.equal(sessionMatches(x,{budget:'100'}),false);
});
test('fonte ausente ou URL executável não impede auditoria, mas bloqueia elegibilidade',()=>{
 const [x]=normalizeCuration([{...base,url_oficial:'javascript:alert(1)'}],{now});assert.equal(x.url,null);assert.ok(x.blockers.includes('fonte'));assert.equal(x.eligible,false);
});
test('liberação pública não é derivada de APTO',()=>{
 const [x]=normalizeCuration([base],{now});assert.equal(x.eligible,true);assert.equal(x.publication,'PENDENTE_REVISAO');assert.equal(normalizeSessions([{...base,inicio_utc:base.inicio_local}],{now}).length,0);
});
test('encerrado ou pausado não participa de comparação/recomendação mesmo se APTO',()=>{
 for(const disponibilidade of ['INSCRICOES_ENCERRADAS','INSCRICOES_PAUSADAS','ESGOTADO'])assert.equal(normalizeCuration([{...base,disponibilidade}],{now})[0].eligible,false);
});
test('imagem exige licença, URL, crédito e proveniência na auditoria',()=>{
 const r={...base,imagem_url:'https://example.org/photo.jpg',licenca_imagem:'LIBERADA'};assert.equal(normalizeCuration([r],{now})[0].imageUrl,null);assert.equal(normalizeCuration([{...r,credito_imagem:'Acervo de QA',url_fonte_imagem:'https://example.org/source'}],{now})[0].imageUrl,r.imagem_url);
});
