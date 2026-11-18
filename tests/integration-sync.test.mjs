import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildPublicProjection,rowsToObjects} from '../scripts/catalog-pipeline.mjs';
import {readPublicCatalog,validatePublicCatalog} from '../p2/public-catalog.js';
import {auditPublicSurface} from '../scripts/audit-public-surface.mjs';
const now=new Date('2026-11-18T22:00:00Z');
const row={session_id:'sync-qa',titulo:'Atividade sintética',categoria:'MÚSICA',data_local:'2026-12-05',hora_local:'18:00',inicio_local:'2026-12-05T18:00:00-03:00',local:'Local de QA',bairro:'Centro',municipio:'São Paulo',codigo_ibge:'3550308',tipo_preco:'NAO_INFORMADO',preco_min_centavos:'',preco_max_centavos:'',url_oficial:'https://example.org/evento',url_acesso:'https://example.org/ingresso',fonte_id:'qa',verificado_em:'2026-11-18',status:'APTO_PARA_PILOTO',reuso_publico:'LIBERADO',revisao_editorial:'APROVADO',responsavel_revisao:'REVISOR_INTERNO_NAO_EXPORTAR',revisado_em:'2026-11-18',licenca_imagem:'NAO_VERIFICADA',observacoes_equipe:'PRIVADO_NAO_EXPORTAR'};
test('matriz Sheets → projeção → contrato → aplicativo preserva ID e preço desconhecido',()=>{
 const columns=Object.keys(row),matrix=[columns,columns.map(k=>row[k])];
 const out=buildPublicProjection(rowsToObjects(matrix),{now});
 const [event]=readPublicCatalog(JSON.parse(JSON.stringify(out)),{now});
 assert.equal(event.id,row.session_id);assert.equal(event.minCents,null);
 assert.ok(!JSON.stringify(out).includes('NAO_EXPORTAR'));
});
test('retirada de aprovação remove sessão da próxima projeção',()=>{
 for(const change of [{status:'PENDENTE_VERIFICACAO'},{reuso_publico:'PENDENTE_REVISAO'},{revisao_editorial:'PENDENTE_REVISAO'}])assert.equal(readPublicCatalog(buildPublicProjection([{...row,...change}],{now}),{now}).length,0);
});
test('contrato rejeita snapshot interno e campos privados em arquivo aparentemente público',()=>{
 assert.throws(()=>readPublicCatalog({sessoes:[row]},{now}),/Contrato/);
 const out=buildPublicProjection([row],{now});out.sessoes[0].observacoes_equipe='privado';
 assert.throws(()=>readPublicCatalog(out,{now}),/Campo/);
});
test('contrato rejeita aprovação editorial ausente e IDs duplicados',()=>{
 const out=buildPublicProjection([row],{now});delete out.sessoes[0].revisao_editorial;
 assert.throws(()=>validatePublicCatalog(out),/aprovações/);
 const valid=buildPublicProjection([row],{now});valid.sessoes.push({...valid.sessoes[0]});valid.meta.total=2;
 assert.throws(()=>validatePublicCatalog(valid),/duplicada/);
});
test('auditoria permite catálogo público aprovado e bloqueia arquivo interno',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'qfazer-public-'));
 try{await writeFile(join(dir,'catalog-public.json'),JSON.stringify(buildPublicProjection([],{now})));assert.equal(await auditPublicSurface(dir),true);await writeFile(join(dir,'curadoria.json'),'{}');await assert.rejects(()=>auditPublicSurface(dir),/interno/);}finally{await rm(dir,{recursive:true,force:true});}
});
