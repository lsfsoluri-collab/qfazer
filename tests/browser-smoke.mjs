// Browser smoke: navegação real em Chromium. Todos os eventos são fixtures de QA
// gerados em memória e nunca publicados no catálogo do Qfazer.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';

const ROOT=resolve('p2');
const now=Date.now();
const f=(date)=>Object.fromEntries(new Intl.DateTimeFormat('en-CA',{
  timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'
}).formatToParts(date).map(part=>[part.type,part.value]));
function eventAt(i){
  const starts=new Date(now+(30*24+i/24)*3600*1000);
  const v=f(starts);
  const cat=i<20?'MÚSICA':i<35?'ESPORTES_E_MOVIMENTO':'CINEMA';
  return {
    session_id:'smoke-'+String(i).padStart(3,'0'),
    titulo:'Sessão de verificação automatizada '+i,
    categoria:cat,
    categorias_busca:i<4?'Música; Esporte':'',
    tags_busca:i<4?'Samba; Ao ar livre':'',
    descricao_editorial:'Dado de QA. Não corresponde a um evento real e nunca será publicado.',
    inicio_utc:starts.toISOString(),
    data_local:v.year+'-'+v.month+'-'+v.day,
    hora_local:'19:00',
    local:'Espaço de QA',bairro:'Centro',codigo_ibge:'3550308',
    url_oficial:'https://example.org/qa/'+i,
    status:'APTO_PARA_PILOTO',reuso_publico:'LIBERADO',
    tipo_preco:'GRATUITO',preco_min_centavos:0,
    imagem_url:i<2?'https://images.example.org/qfazer-qa.png':'',
    licenca_imagem:i===0?'LIBERADA':'PENDENTE_REVISAO'
  };
}
const fixture={meta:{scope:'SOMENTE_TESTE_NAO_PUBLICAR',total:45},sessoes:Array.from({length:45},(_,i)=>eventAt(i))};
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname==='/catalog-public.json'){
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify(fixture));return;
    }
    const file=resolve(ROOT,'.'+(pathname==='/'?'/index.html':pathname));
    if(file!==ROOT&&!file.startsWith(ROOT+sep)){res.writeHead(403);res.end();return;}
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});
    res.end(bytes);
  }catch{res.writeHead(404);res.end('Not found');}
});
const listen=()=>new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const close=()=>new Promise(ok=>server.close(ok));
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO9xkXEAAAAASUVORK5CYII=','base64');
let browser;
const failures=[];
async function check(label,run){
 try{await run();console.log('PASS '+label);}
 catch(error){failures.push({label,message:error.message});console.error('FAIL '+label+': '+error.stack);}
}
try{
 await listen();
 const url='http://127.0.0.1:'+server.address().port+'/';
 await mkdir('screenshots',{recursive:true});
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const make=async(width,height)=>{
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://images.example.org/**',r=>r.fulfill({status:200,contentType:'image/png',body:png}));
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.route('https://fonts.gstatic.com/**',r=>r.abort());
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#home-featured')?.querySelector('.featured-card')!==null,{timeout:12000});
  return {ctx,page,errors};
 };
 const desktop=await make(1360,900);
 await check('desktop 1360 sem overflow',async()=>{
  const ok=await desktop.page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
  assert.ok(ok,'scroll horizontal indevido');
 });
 await check('desktop 45 sessões reais do fixture classificadas e 18 cards iniciais',async()=>{
  await desktop.page.locator('.nav-desktop [data-tab="buscar"]').click();
  await desktop.page.waitForFunction(()=>document.querySelector('#search-count')?.textContent?.includes('45'));
  const count=await desktop.page.locator('#search-list .event-card').count();
  assert.equal(count,18);
 });
 await desktop.page.screenshot({path:'screenshots/desktop-busca-1360.png',fullPage:true});
 await check('rolagem progressiva sem duplicação',async()=>{
  await desktop.page.locator('#search-sentinel').scrollIntoViewIfNeeded();
  await desktop.page.waitForFunction(()=>document.querySelectorAll('#search-list .event-card').length>18);
  const count=await desktop.page.locator('#search-list .event-card').count();
  assert.ok(count<=45,'mais cards do que sessões');
  const labels=await desktop.page.locator('#search-list .event-title').allTextContents();
  assert.equal(new Set(labels).size,labels.length,'duplicou card');
 });
 await check('busca por tag Samba e categoria Esporte encontra mesmo evento',async()=>{
  await desktop.page.locator('#search-q').fill('samba');
  await desktop.page.locator('#search-form .search-go').click();
  await desktop.page.locator('#filter-category').selectOption('esporte');
  await desktop.page.locator('#search-form button[type=submit]').last().click();
  const count=await desktop.page.locator('#search-list .event-card').count();
  assert.equal(count,4);
  const catOptions=await desktop.page.locator('#filter-category option').allTextContents();
  assert.ok(catOptions.every(x=>!x.includes('_')),'código bruto da planilha na UI');
 });
 await check('nenhum erro JS no desktop',async()=>assert.deepEqual(desktop.errors,[]));
 const mobile=await make(390,844);
 await check('mobile 390 sem overflow e quatro abas',async()=>{
  assert.ok(await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const tabs=await mobile.page.locator('.nav-mobile [data-tab]').allTextContents();
  assert.deepEqual(tabs.map(v=>v.trim()),['Início','Salvos','Buscar','Chat']);
 });
 await mobile.page.screenshot({path:'screenshots/mobile-inicio-390.png',fullPage:true});
 await check('ficha de evento em tela cheia com informações e retorno',async()=>{
  await mobile.page.locator('.nav-mobile [data-tab="buscar"]').click();
  const first=mobile.page.locator('#search-list .event-card').first();
  await first.locator('.detail-link').click();
  const modal=mobile.page.locator('#event-modal');
  await modal.waitFor({state:'visible'});
  const box=await modal.boundingBox();
  assert.ok(box&&Math.abs(box.width-390)<3,'ficha não preenche largura');
  assert.ok(box&&Math.abs(box.height-844)<5,'ficha não preenche altura');
  await mobile.page.screenshot({path:'screenshots/mobile-ficha-390.png',fullPage:false});
  await mobile.page.locator('#event-modal .close-modal').click();
  assert.equal(await modal.isVisible(),false);
  assert.equal(await mobile.page.locator('[data-page="buscar"]').isVisible(),true);
 });
 await check('imagem licenciada sim e não licenciada não',async()=>{
  const a=mobile.page.locator('#search-list .event-card').nth(0);
  const b=mobile.page.locator('#search-list .event-card').nth(1);
  assert.equal(await a.locator('.event-cover').count(),1);
  assert.equal(await b.locator('.event-cover').count(),0);
 });
 await check('salvos sobrevivem à navegação',async()=>{
  const first=mobile.page.locator('#search-list .event-card').first();
  await first.locator('.card-save').click();
  await mobile.page.locator('.nav-mobile [data-tab="salvos"]').click();
  assert.equal(await mobile.page.locator('#saved-list .event-card').count(),1);
 });
 await check('nenhum erro JS no mobile',async()=>assert.deepEqual(mobile.errors,[]));
 await mobile.ctx.close();await desktop.ctx.close();
}finally{if(browser)await browser.close();await close();}
console.log('RESULTADO: '+(10-failures.length)+'/10 smoke checks PASS');
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1;}
