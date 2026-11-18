import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {buildInternalPreview} from '../scripts/build-internal-preview.mjs';
const output='screenshots';await fs.mkdir(output,{recursive:true});
const starts=new Date(Date.now()+30*86400000);const iso=starts.toISOString();const local=new Date(starts.getTime()-3*3600000).toISOString();
const rows=Array.from({length:240},(_,i)=>({session_id:'qa-curation-'+i,titulo:i===0?'Preço desconhecido de QA':i>=186&&i<189?'Conflito-exclusivo-qa '+i:'Sessão sintética de QA '+i,categoria:'MÚSICA',categorias_busca:i%4===0?'Música; Esporte':'Música',tags_busca:i%4===0?'Samba':'',data_local:local.slice(0,10),hora_local:local.slice(11,16),inicio_local:iso,local:'Espaço de QA',bairro:'Centro',municipio:'São Paulo',codigo_ibge:'3550308',url_oficial:'https://example.org/qa/'+i,status:i<186?'APTO_PARA_PILOTO':i<229?'PENDENTE_VERIFICACAO':'NAO_UTILIZAR',motivo_status:i>=186?'Data divergente em fonte de QA':'',reuso_publico:'PENDENTE_REVISAO',revisao_editorial:'PENDENTE_REVISAO',tipo_preco:i===0?'NAO_INFORMADO':'GRATUITO',preco_min_centavos:i===0?'':0}));
const {html}=await buildInternalPreview({sessoes:rows});
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
// Apenas fixtures sintéticas. Nenhum evento da planilha é enviado ao CI público.
const checks=[];async function check(name,run){try{await run();checks.push({name,status:'PASS'});console.log('PASS',name);}catch(e){checks.push({name,status:'FAIL',error:e.message});console.log('FAIL',name,e.message);}}
try{for(const width of [1360,390]){
 const ctx=await browser.newContext({viewport:{width,height:844}});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});
 await check(width+' inicia sem erro e com todos os 240 IDs',async()=>{await page.waitForFunction(()=>document.getElementById('review-status').textContent.includes('240'),{timeout:10000});assert.equal(await page.evaluate(()=>state.data.length),240);assert.equal(await page.evaluate(()=>new Set(state.data.map(x=>x.id)).size),240);assert.deepEqual(errors,[]);});
 await check(width+' mantém tela sem rolagem horizontal',async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)));
 await page.evaluate(()=>routeTo('buscar'));
 await check(width+' busca completa e progressiva',async()=>{assert.match(await page.locator('#results-count').innerText(),/^240 /);assert.equal(await page.locator('#search-cards .event-card').count(),12);});
 await check(width+' filtro pendentes mostra 43 e bloqueia comparação',async()=>{await page.locator('#filter-status').selectOption('PENDENTE_VERIFICACAO');assert.match(await page.locator('#results-count').innerText(),/^43 /);assert.equal(await page.locator('#search-cards [data-action=compare]:not(:disabled)').count(),0);await page.locator('#search-cards [data-action=detail]').first().click();assert.match(await page.locator('.curation-panel').innerText(),/Pendente de verificação/);assert.match(await page.locator('.curation-panel').innerText(),/Não participa/);await page.locator('#detail-close').click();});
 await check(width+' filtro rejeitados mostra 11',async()=>{await page.locator('#filter-status').selectOption('NAO_UTILIZAR');assert.match(await page.locator('#results-count').innerText(),/^11 /);});
 await check(width+' filtro aptos mostra 186 sem mudar autorização',async()=>{await page.locator('#filter-status').selectOption('APTO_PARA_PILOTO');assert.match(await page.locator('#results-count').innerText(),/^186 /);await page.locator('#filter-publication').selectOption('LIBERADO');assert.match(await page.locator('#results-count').innerText(),/^0 /);await page.locator('#filter-publication').selectOption('PENDENTE_REVISAO');assert.match(await page.locator('#results-count').innerText(),/^186 /);});
 await page.evaluate(()=>resetFilters());
 await check(width+' origem conflitada preservada visível com motivo',async()=>{await page.locator('#search-input').fill('Conflito-exclusivo-qa');assert.match(await page.locator('#results-count').innerText(),/^3 /);await page.locator('#search-cards [data-action=detail]').first().click();assert.match(await page.locator('.curation-panel').innerText(),/Data divergente/);await page.locator('#detail-close').click();});
 await page.evaluate(()=>resetFilters());
 await check(width+' preço desconhecido não passa em Grátis',async()=>{await page.locator('#search-input').fill('Preço desconhecido de QA');assert.match(await page.locator('#results-count').innerText(),/^1 /);await page.locator('#filter-budget').selectOption('free');assert.match(await page.locator('#results-count').innerText(),/^0 /);});
 await page.evaluate(()=>resetFilters());
 await check(width+' filtros cruzados de tag e categoria',async()=>{await page.locator('#filter-category').selectOption('esporte');await page.locator('#filter-tag').selectOption('samba');assert.match(await page.locator('#results-count').innerText(),/^60 /);});
 await page.evaluate(()=>resetFilters());
 await check(width+' todos os cards são alcançáveis sem IDs duplicados',async()=>{while(!await page.locator('#more-events').isHidden())await page.locator('#more-events').click();const ids=await page.locator('#search-cards .event-card').evaluateAll(a=>a.map(x=>x.dataset.id));assert.equal(ids.length,240);assert.equal(new Set(ids).size,240);});
 await check(width+' destaques e sugestões excluem bloqueados/iniciados',async()=>{const eligible=await page.evaluate(()=>state.data.filter(isEligible).map(x=>x.id));const featured=await page.locator('#home-cards .event-card').evaluateAll(a=>a.map(x=>x.dataset.id));assert.ok(featured.every(x=>eligible.includes(x)));await page.evaluate(()=>chatReply('quero algo gratuito'));const titles=await page.locator('#chat-messages .rec-btn').evaluateAll(a=>a.map(x=>x.textContent));assert.ok(titles.length<=3);assert.deepEqual(errors,[]);});
 await page.evaluate(()=>{resetFilters();$('filter-status').value='PENDENTE_VERIFICACAO';renderSearch();});
 await page.screenshot({path:output+'/'+width+'-pendentes.png',fullPage:false});
 await ctx.close();
 }}finally{await browser.close();await new Promise(r=>server.close(r));}
await fs.writeFile(output+'/browser_checks.json',JSON.stringify(checks,null,2));if(checks.some(x=>x.status==='FAIL'))process.exitCode=1;
