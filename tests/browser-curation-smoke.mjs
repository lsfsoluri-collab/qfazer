// Browser QA uses synthetic data only. The user's approved HTML is not uploaded to CI.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {buildInternalPreview} from '../scripts/build-internal-preview.mjs';
const starts=new Date(Date.now()+30*86400000),iso=starts.toISOString(),local=new Date(starts.getTime()-3*3600000).toISOString();
const rows=Array.from({length:240},(_,i)=>({session_id:'qa-curation-'+i,titulo:i===0?'Preço desconhecido de QA':i>=186&&i<189?'Conflito-exclusivo-qa '+i:'Sessão sintética de QA '+i,categoria:'MÚSICA',categorias_busca:i%4===0?'Música; Esporte':'Música',tags_busca:i%4===0?'Samba':'',data_local:local.slice(0,10),hora_local:i===186?'':local.slice(11,16),inicio_local:i===186?'':iso,local:'Espaço de QA',bairro:'Centro',municipio:'São Paulo',codigo_ibge:'3550308',url_oficial:i===200?'':'https://example.org/qa/'+i,status:i<186?'APTO_PARA_PILOTO':i<229?'PENDENTE_VERIFICACAO':'NAO_UTILIZAR',motivo_status:i>=186?'Data divergente em fonte de QA':'',reuso_publico:'PENDENTE_REVISAO',revisao_editorial:'PENDENTE_REVISAO',tipo_preco:i===0?'NAO_INFORMADO':'GRATUITO',preco_min_centavos:i===0?'':0}));
const {html}=await buildInternalPreview({sessoes:rows});
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const checks=[];await mkdir('screenshots',{recursive:true});
async function check(name,run){try{await run();checks.push({name,status:'PASS'});console.log('PASS',name);}catch(e){checks.push({name,status:'FAIL',error:e.message});console.log('FAIL',name,e.message);}}
try{for(const width of [1360,390]){
 const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});
 const nav=view=>page.locator(width<600?'.nav-mobile [data-tab="'+view+'"]':'.nav-desktop [data-tab="'+view+'"]').click();
 const reset=async()=>{if(width>=600){await page.locator('#search-form button[type=reset]').click();}else{await page.locator('#search-q').fill('');for(const id of ['filter-category','filter-neighborhood','filter-budget','filter-status','filter-blocker','filter-publication','filter-tag'])await page.locator('#'+id).selectOption('');await page.locator('#filter-date').fill('');}await page.waitForFunction(()=>document.getElementById('search-count').textContent.startsWith('240 '));};
 const count=async n=>assert.match(await page.locator('#search-count').innerText(),new RegExp('^'+n+' '));
 await check(width+' inicia 240 sessões, sem erro JS',async()=>{await page.waitForFunction(()=>document.getElementById('review-status').textContent.includes('240'));assert.deepEqual(errors,[]);});
 await check(width+' preserva navegação e não tem overflow',async()=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await page.locator(width<600?'.nav-mobile [data-tab]':'.nav-desktop [data-tab]').count(),4);});
 await nav('buscar');
 await check(width+' busca completa com paginação de 18',async()=>{await count(240);assert.equal(await page.locator('#search-list .event-card').count(),18);});
 await check(width+' pendentes: 43, sem comparação e com motivo',async()=>{await page.locator('#filter-status').selectOption('PENDENTE_VERIFICACAO');await count(43);assert.equal(await page.locator('#search-list .compare-button').count(),0);await page.locator('#search-list .detail-link').first().click();assert.match(await page.locator('.curation-note').innerText(),/Pendente de verificação/);assert.match(await page.locator('.curation-note').innerText(),/Não participa/);await page.locator('#event-modal .close-modal').click();});
 await check(width+' não utilizar: 11 visíveis para auditoria',async()=>{await page.locator('#filter-status').selectOption('NAO_UTILIZAR');await count(11);assert.equal(await page.locator('#search-list .compare-button').count(),0);});
 await check(width+' aptos: 186 e publicação continua independente',async()=>{await page.locator('#filter-status').selectOption('APTO_PARA_PILOTO');await count(186);await page.locator('#filter-publication').selectOption('LIBERADO');await count(0);await page.locator('#filter-publication').selectOption('PENDENTE_REVISAO');await count(186);});
 await reset();
 await check(width+' filtros cruzados categoria Esporte e tag Samba',async()=>{await page.locator('#filter-category').selectOption('esporte');await page.locator('#filter-tag').selectOption('samba');await count(60);});
 await reset();
 await check(width+' preço desconhecido não aparece como gratuito',async()=>{await page.locator('#search-q').fill('Preço desconhecido de QA');await page.waitForFunction(()=>document.getElementById('search-count').textContent.startsWith('1 '));await count(1);await page.locator('#filter-budget').selectOption('free');await count(0);});
 await reset();
 await check(width+' cards completos, 240 IDs sem duplicidade',async()=>{while(await page.locator('#search-list .event-card').count()<240)await page.locator('#search-more').evaluate(b=>b.click());const ids=await page.locator('#search-list .event-card').evaluateAll(a=>a.map(x=>x.dataset.sessionId));assert.equal(ids.length,240);assert.equal(new Set(ids).size,240);});
 await check(width+' destaques aptos e Chat sem recomendação fictícia',async()=>{const labels=await page.locator('#home-list .curation-badge').allTextContents();assert.ok(labels.every(x=>x==='Apto para teste interno'));await nav('chat');assert.equal(await page.locator('[data-page=chat] .event-card').count(),0);assert.deepEqual(errors,[]);});
 await nav('buscar');await reset();await page.locator('#filter-status').selectOption('PENDENTE_VERIFICACAO');await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'screenshots/'+width+'-curadoria-aprovada.png',fullPage:false});
 await context.close();
}}finally{await browser.close();await new Promise(r=>server.close(r));}
await writeFile('screenshots/curation-checks.json',JSON.stringify(checks,null,2));if(checks.some(x=>x.status==='FAIL'))process.exitCode=1;
