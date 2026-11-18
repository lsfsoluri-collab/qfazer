import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {buildInternalPreview} from '../scripts/build-internal-preview.mjs';
const row={session_id:'qa-safe',titulo:'Sessão de QA </script><script>alert(1)</script>',categoria:'MÚSICA',data_local:'2026-12-05',status:'PENDENTE_VERIFICACAO'};
test('prévia completa embute lista sem executar campos e mantém escopo privado',async()=>{
 const {html,meta}=await buildInternalPreview({sessoes:[row]});assert.equal(meta.total,1);assert.equal(meta.publicacao_autorizada,false);const text=html.match(/id="qfazer-preview-data" data-catalog>(.*?)<\/script>/s)[1];assert.equal(JSON.parse(text).sessoes[0].titulo,row.titulo);assert.ok(!text.includes('</script>'));assert.match(html,/filter-status/);assert.match(html,/filter-publication/);
 const scripts=[...html.matchAll(/<script>(.*?)<\/script>/gs)];assert.equal(scripts.length,2);for(const [,js] of scripts)new vm.Script(js);
});
test('prévia não silencia duplicidade nem aceita flag pública indevida',async()=>{
 await assert.rejects(()=>buildInternalPreview({sessoes:[row,row]}),/duplicado/);await assert.rejects(()=>buildInternalPreview({meta:{publicacao_autorizada:true},sessoes:[row]}),/pública/);
});
