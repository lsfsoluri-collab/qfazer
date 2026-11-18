import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPublicProjection,parseCsv,rowsToObjects} from '../scripts/catalog-pipeline.mjs';
const future='2027-01-20T19:00:00-03:00';
const now=new Date('2026-11-17T16:00:00Z');
const base=()=>({
  session_id:'evento-exemplo-2027-01-20-1900',titulo:'Atividade de teste',categoria:'TEATRO',
  data_local:'2027-01-20',hora_local:'19:00',inicio_local:future,local:'Espaço de teste',bairro:'Centro',
  municipio:'São Paulo',codigo_ibge:'3550308',tipo_preco:'GRATUITO',preco_min_centavos:0,
  preco_max_centavos:0,url_oficial:'https://example.org/evento',url_acesso:'https://example.org/evento',
  fonte_id:'fonte-teste',verificado_em:'2026-11-17',status:'APTO_PARA_PILOTO',reuso_publico:'LIBERADO',
  revisao_editorial:'APROVADO',responsavel_revisao:'PO teste',revisado_em:'2026-11-17',licenca_imagem:'NAO_VERIFICADA',
  descricao_editorial:'Descrição sintética apenas para testes',evidencias:'INTERNAL-EVIDENCE-DO-NOT-LEAK',
  observacoes_equipe:'INTERNAL-OBSERVATION-DO-NOT-LEAK'
});
test('204 pendentes nunca podem virar públicos por acidente',()=>{
  const row=base();row.reuso_publico='PENDENTE_REVISAO';
  assert.equal(buildPublicProjection([row],{now}).sessoes.length,0);
});
test('aprovação editorial também é obrigatória',()=>{
  const row=base();row.revisao_editorial='PENDENTE_REVISAO';
  assert.equal(buildPublicProjection([row],{now}).sessoes.length,0);
});
test('projeção contém somente atributos permitidos e link oficial',()=>{
  const out=buildPublicProjection([base()],{now});
  assert.equal(out.sessoes.length,1);
  assert.equal(out.sessoes[0].inicio_utc,'2027-01-20T22:00:00.000Z');
  assert.equal(out.sessoes[0].preco_min_centavos,0);
  const serialized=JSON.stringify(out);
  assert.ok(!serialized.includes('INTERNAL-'));
  assert.ok(!serialized.includes('responsavel_revisao'));
});
test('sessão encerrada fica fora do aplicativo',()=>{
  const row=base();row.inicio_local='2026-11-01T19:00:00-03:00';row.data_local='2026-11-01';
  assert.equal(buildPublicProjection([row],{now}).sessoes.length,0);
});
test('não aceita sessão duplicada',()=>assert.throws(()=>buildPublicProjection([base(),base()],{now}),/duplicado/));
test('não aceita preço declarado gratuito com valor maior que zero',()=>{
  const row=base();row.preco_min_centavos=1000;
  assert.throws(()=>buildPublicProjection([row],{now}),/gratuidade/);
});
test('bloqueia liberação de registro sem responsável identificado',()=>{
  const row=base();row.responsavel_revisao='';
  assert.throws(()=>buildPublicProjection([row],{now}),/responsavel_revisao/);
});
test('não exporta imagem não licenciada',()=>{
  const row=base();row.imagem_url='https://example.org/imagem.jpg';
  assert.equal(buildPublicProjection([row],{now}).sessoes[0].imagem_url,undefined);
});
test('CSV com campos entre aspas e vírgulas mantém dados',()=>{
  const x=Object.keys(base());const vals=x.map(k=>String(base()[k]));
  const encode=s=>'"'+s.replaceAll('"','""')+'"';
  const text=x.join(',')+'\n'+vals.map(encode).join(',');
  assert.equal(parseCsv(text)[0].titulo,'Atividade de teste');
});
test('erros em colunas obrigatórias são claros',()=>assert.throws(()=>rowsToObjects([['session_id'],['a']]),/Colunas obrigatórias/));
test('impede link HTTP em registro aprovado',()=>{
  const row=base();row.url_oficial='http://example.org';
  assert.throws(()=>buildPublicProjection([row],{now}),/HTTPS/);
});
test('aceita data brasileira nas datas editoriais',()=>{
  const row=base();row.verificado_em='17/11/2026';row.revisado_em='17/11/2026';row.data_local='20/01/2027';
  assert.equal(buildPublicProjection([row],{now}).sessoes[0].data_local,'2027-01-20');
});

test('imagem liberada exige autoria e link verificável da origem',()=>{
  const row={...base(),imagem_url:'https://example.org/arte.jpg',licenca_imagem:'LIBERADA'};
  assert.throws(()=>buildPublicProjection([row],{now}),/fonte da imagem|crédito/);
  row.url_fonte_imagem='https://example.org/press';row.credito_imagem='Fotógrafa informada na origem';
  const [item]=buildPublicProjection([row],{now}).sessoes;
  assert.equal(item.imagem_url,'https://example.org/arte.jpg');
  assert.equal(item.credito_imagem,'Fotógrafa informada na origem');
  assert.equal(item.url_fonte_imagem,'https://example.org/press');
});
