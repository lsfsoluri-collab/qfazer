import {normalizeSessions, priceLabel, sessionMatches, compareIds, validUrl} from './catalog.js';
import {CATEGORIES, categoryLabel, tagLabel} from './taxonomy.js';
const byId = id => document.getElementById(id);
const state = {all:[], active:'inicio', saved:readSaved(), selected:[], searchVisible:18, searchFilterKey:'', homologation:new URLSearchParams(location.search).get('homologacao')==='1'};
const SEARCH_PAGE_SIZE = 18;
const tabs = new Set(['inicio','salvos','buscar','chat']);
const catLabels = Object.fromEntries(CATEGORIES.map(({id,label})=>[id,label]));
function readSaved() { try {const v=JSON.parse(localStorage.getItem('qfazer_saved_v1')||'[]');return Array.isArray(v)?v.filter(x=>typeof x==='string').slice(0,300):[];}catch{return [];} }
function storeSaved() { try {localStorage.setItem('qfazer_saved_v1',JSON.stringify(state.saved));}catch{announce('Não foi possível salvar neste dispositivo.');} }
function announce(msg) { let el=byId('app-announcement');if(!el){el=document.createElement('p');el.id='app-announcement';el.className='visually-hidden';el.setAttribute('role','status');document.body.append(el);}el.textContent=msg; }
function text(el,v){ el.textContent=String(v??'');return el; }
function node(tag,cls,content){const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)text(e,content);return e;}
function button(label,cls,handler){const b=node('button',cls,label);b.type='button';b.addEventListener('click',handler);return b;}
function uiIcon(name,cls=''){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');if(cls)svg.setAttribute('class',cls);svg.setAttribute('aria-hidden','true');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href',`#i-${name}`);svg.append(use);return svg;}
function mediaVariant(item){let h=0;for(const c of item.id)h=(h*31+c.charCodeAt(0))>>>0;return h%6;}
function visualBand(item){
 const band=node('div',`card-art variant-${mediaVariant(item)}`);
 band.setAttribute('aria-hidden','true');
 band.append(node('span','media-symbol',({musica:'♫',festas:'✦',arte:'✳',gastronomia:'◌',cinema:'◈',teatro:'❖',esporte:'↗',danca:'♫',feiras:'✳'}[item.category]||'✦')));
 if(item.imageUrl){
   const image=node('img','event-cover');
   image.src=item.imageUrl;
   image.loading='lazy';
   image.decoding='async';
   image.alt='';
   image.addEventListener('error',()=>image.remove(),{once:true});
   band.prepend(image);
 }
 band.append(node('span','media-note',categoryLabel(item.category)));
 return band;
}
function navTo(view){if(!tabs.has(view))view='inicio';state.active=view;for(const page of document.querySelectorAll('[data-page]'))page.hidden=page.dataset.page!==view;for(const btn of document.querySelectorAll('[data-tab]')){const active=btn.dataset.tab===view;btn.classList.toggle('is-active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');}history.replaceState(null,'',`#${view}`);document.title=`${view.charAt(0).toUpperCase()+view.slice(1)} — Qfazer`;if(view==='salvos')renderSaved();if(view==='buscar')renderSearch();scrollTo({top:0,behavior:'instant'});byId('main').focus({preventScroll:true});}
function emptyState(title,body){const box=node('div','empty-state');box.append(node('span','empty-star','✳'),node('h3','',title),node('p','',body));return box;}
function formatDay(event){const d=new Date(event.startsAt);return Number.isNaN(d.getTime())?'Data a confirmar':new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',weekday:'short',timeZone:'America/Sao_Paulo'}).format(d).replace('.','');}
function showDetail(item){
 const d=byId('event-modal'),c=byId('event-detail');
 c.replaceChildren();
 const hero=visualBand(item);hero.classList.add('detail-hero');
 const toolbar=node('div','detail-quick-actions');
 const saved=state.saved.includes(item.id);
 const save=button('',`detail-icon-action ${saved?'is-saved':''}`,()=>{
   toggleSave(item.id);showDetail(item);
 });
 save.setAttribute('aria-label',saved?'Remover dos salvos':'Salvar evento');
 save.append(uiIcon('heart'));
 const share=button('↗','detail-icon-action',async()=>{
   try{
     if(navigator.share){await navigator.share({title:item.title,url:item.url||location.href});}
     else if(navigator.clipboard&&validUrl(item.url)){await navigator.clipboard.writeText(item.url);announce('Link oficial copiado.');}
     else announce('Compartilhamento indisponível neste navegador.');
   }catch(error){if(error?.name!=='AbortError')announce('Não foi possível compartilhar.');}
 });
 share.setAttribute('aria-label','Compartilhar link oficial');
 toolbar.append(save,share);
 const title=node('h2','modal-title',item.title);title.id='detail-title';
 c.append(hero,toolbar,node('p','section-overline',categoryLabel(item.category)),title);
 if(item.description){
  c.append(node('h3','detail-subhead','Sobre esta experiência'),node('p','detail-summary',item.description));
 }else{
  c.append(node('p','detail-summary','Confira os detalhes oficiais da programação no site do organizador.'));
 }
 const facts=node('dl','event-facts');
 for(const [k,v] of [['Quando',`${formatDay(item)} • ${item.hour||'horário a confirmar'}`],['Onde',`${item.place} • ${item.neighborhood}`],['Preço',priceLabel(item)],['Verificação',item.verifiedAt||'não informada']]){
   facts.append(node('dt','',k),node('dd','',v));
 }
 c.append(facts);
 if(item.why){const box=node('section','detail-rationale');box.append(node('h3','', '✳ Por que vale a pena?'),node('p','',item.why));c.append(box);}
 const labels=[...new Set([...(item.categories||[item.category]).map(categoryLabel),...(item.tags||[]).map(tagLabel)])].filter(Boolean);
 if(labels.length){
   const tags=node('div','detail-tags');
   for(const label of labels.slice(0,10))tags.append(node('span','detail-tag',label));
   c.append(tags);
 }
 if(item.imageUrl&&item.imageCredit)c.append(node('p','image-credit',`Imagem: ${item.imageCredit}`));
 c.append(node('p','disclaimer','Preço e disponibilidade podem mudar. Confira a programação e as condições no canal oficial antes de sair.'));
 if(validUrl(item.url)){
   const a=node('a','button button-primary detail-official-link','Abrir página oficial ↗');
   a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';c.append(a);
 }
 if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');
}
function card(item,{allowCompare=false}={}){
 const article=node('article','event-card');const band=visualBand(item);article.append(band);
 const saved=state.saved.includes(item.id);
 const saveBtn=button('',`card-save ${saved?'is-saved':''}`,()=>toggleSave(item.id));saveBtn.setAttribute('aria-label',saved?`Remover ${item.title} dos salvos`:`Salvar ${item.title}`);saveBtn.append(uiIcon('heart'),node('span','visually-hidden',saved?'Remover salvo':'Salvar'));
 article.append(saveBtn);
 const main=node('div','card-body');main.append(node('h3','event-title',item.title));
 const meta=node('div','card-meta');const date=node('span','',`${formatDay(item)} · ${item.hour||'horário a confirmar'}`);date.prepend(uiIcon('calendar'));const where=node('span','',item.neighborhood);where.prepend(uiIcon('pin'));meta.append(date,where);
 main.append(meta,node('p','card-location',item.place));
 const footer=node('div','card-footer');footer.append(node('span','price',priceLabel(item)));
 const actions=node('div','card-actions');
 if(allowCompare){const selected=state.selected.includes(item.id);const compareBtn=button('',`compare-button ${selected?'chosen':''}`,()=>toggleCompare(item.id));compareBtn.setAttribute('aria-label',selected?`Remover ${item.title} da comparação`:`Comparar ${item.title}`);compareBtn.append(uiIcon(selected?'check':'sliders'),node('span','visually-hidden',selected?'Comparando':'Comparar'));actions.append(compareBtn);}
 const details=button('', 'detail-link',()=>showDetail(item));details.setAttribute('aria-label',`Ver detalhes de ${item.title}`);details.append(uiIcon('arrow'),node('span','visually-hidden','Detalhes'));actions.append(details);
 footer.append(actions);main.append(footer);article.append(main);
 // O card inteiro abre detalhes; botões de salvar/comparar mantêm ações independentes.
 article.classList.add('is-openable');
 article.tabIndex=0;
 article.setAttribute('role','group');
 article.setAttribute('aria-label',`Abrir detalhes do evento: ${item.title}`);
 article.addEventListener('click',event=>{
   if(event.target.closest('button,a,input,select'))return;
   showDetail(item);
 });
 article.addEventListener('keydown',event=>{
   if(event.target!==article||!['Enter',' '].includes(event.key))return;
   event.preventDefault();showDetail(item);
 });
 return article;
}
function featuredCard(item){const article=node('article','featured-card');article.append(visualBand(item));const content=node('div','featured-card-content');content.append(node('span','category-pill',catLabels[item.category]||item.category),node('h3','',item.title),node('p','',`${formatDay(item)} • ${item.neighborhood}`));article.append(content);const open=button(`Ver ${item.title}`,'',()=>showDetail(item));open.setAttribute('aria-label',`Ver evento: ${item.title}`);article.append(open);return article;}
function renderInto(id,items,msg){const dest=byId(id);dest.replaceChildren();if(!items.length){dest.append(emptyState(msg[0],msg[1]));return;}for(const item of items)dest.append(card(item,{allowCompare:id==='search-list'}));}
function renderHome(){const featured=byId('home-featured');featured.replaceChildren();if(!state.all.length){featured.append(emptyState('Seleções em preparação',state.homologation?'Carregue o arquivo de homologação com as sessões reais para avaliar a interface.':'Estamos verificando os eventos para publicação. Nenhum evento fictício será exibido.'));}else{for(const event of state.all.slice(0,3))featured.append(featuredCard(event));}
 renderInto('home-list',state.all.slice(3,9),state.homologation?['Nenhuma sessão carregada','Importe o catálogo real no painel de homologação.']:['Agenda em preparação','As próximas experiências serão exibidas assim que o catálogo for liberado.']);
}
function renderSaved(){const items=state.saved.map(id=>state.all.find(s=>s.id===id)).filter(Boolean);renderInto('saved-list',items,state.saved.length?['Sessões não disponíveis neste catálogo','Seus IDs salvos permanecem neste dispositivo. Carregue uma versão atualizada do catálogo para conferir as informações.']:['Seu próximo rolê começa aqui','Quando salvar uma sessão, ela aparecerá nesta página.']);}
function options(select,values){const current=select.value;for(const old of [...select.options].slice(1))old.remove();for(const v of values){const opt=node('option','',catLabels[v]||v);opt.value=v;select.add(opt);}if(values.includes(current))select.value=current;}
function syncFilters(){const present=new Set(state.all.flatMap(x=>x.categories||[x.category]));options(byId('filter-category'),CATEGORIES.filter(x=>present.has(x.id)).map(x=>x.id));options(byId('filter-neighborhood'),[...new Set(state.all.map(x=>x.neighborhood))].sort((a,b)=>a.localeCompare(b,'pt-BR')));}
function getFilters(){return {query:byId('search-q').value,category:byId('filter-category').value,neighborhood:byId('filter-neighborhood').value,date:byId('filter-date').value,budget:byId('filter-budget').value};}
function renderSearch(){
 const filters=getFilters(),key=JSON.stringify(filters);
 if(key!==state.searchFilterKey){state.searchVisible=SEARCH_PAGE_SIZE;state.searchFilterKey=key;}
 const matches=state.all.filter(x=>sessionMatches(x,filters));
 text(byId('search-count'),`${matches.length} ${matches.length===1?'sessão encontrada':'sessões encontradas'}`);
 const visible=matches.slice(0,state.searchVisible);
 renderInto('search-list',visible,['Nenhuma sessão encontrada',state.all.length?'Tente alterar os filtros ou consulte a fonte oficial.':'Ainda não há sessões autorizadas para exibição.']);
 text(byId('search-visible-count'),matches.length?`Exibindo ${visible.length} de ${matches.length} sessões`:'');
 byId('search-more').hidden=visible.length>=matches.length;
 renderCompare();
}
function renderCompare(){state.selected=compareIds(state.all,state.selected);const tray=byId('compare-tray'),target=byId('compare-content');tray.hidden=state.selected.length===0;target.replaceChildren();if(!state.selected.length)return;target.append(node('p','micro',`${state.selected.length} de 3 sessões selecionadas`));const list=node('div','compare-grid');for(const id of state.selected){const s=state.all.find(x=>x.id===id);if(!s)continue;const cell=node('div','compare-item');cell.append(node('strong','',s.title),node('p','',`${formatDay(s)} • ${s.hour||'horário a confirmar'}`),node('p','',`${s.place} • ${s.neighborhood}`),node('p','',priceLabel(s)));cell.append(button('Remover','text-button',()=>toggleCompare(id)));list.append(cell);}target.append(list);}
function toggleSave(id){if(state.saved.includes(id))state.saved=state.saved.filter(x=>x!==id);else state.saved=[...state.saved,id].slice(-300);storeSaved();renderHome();renderSearch();renderSaved();announce(state.saved.includes(id)?'Sessão salva neste dispositivo.':'Sessão removida dos salvos.');}
function toggleCompare(id){if(state.selected.includes(id))state.selected=state.selected.filter(x=>x!==id);else if(state.selected.length>=3){announce('Escolha até três sessões para comparar.');return;}else state.selected.push(id);renderSearch();}
function initializeCatalog(payload,internal){state.all=normalizeSessions(payload,{internal});state.selected=[];state.searchVisible=SEARCH_PAGE_SIZE;state.searchFilterKey='';syncFilters();renderHome();renderSaved();renderSearch();announce(`${state.all.length} sessões elegíveis carregadas.`);}
async function fetchPublic(){try{const response=await fetch('./catalog-public.json',{cache:'no-store'});if(!response.ok)return;const data=await response.json();initializeCatalog(data,false);}catch{/* conteúdo ausente não é erro crítico: sem dados fictícios */}}
function start(){for(const btn of document.querySelectorAll('[data-tab]'))btn.addEventListener('click',()=>navTo(btn.dataset.tab));document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();navTo('inicio');});byId('home-form').addEventListener('submit',e=>{e.preventDefault();byId('search-q').value=byId('home-query').value;navTo('buscar');});byId('home-show-all').addEventListener('click',()=>navTo('buscar'));byId('home-more').addEventListener('click',()=>navTo('buscar'));for(const b of document.querySelectorAll('[data-category-shortcut]'))b.addEventListener('click',()=>{navTo('buscar');byId('filter-category').value=b.dataset.categoryShortcut;renderSearch();});byId('chat-to-search').addEventListener('click',()=>navTo('buscar'));byId('search-form').addEventListener('submit',e=>{e.preventDefault();renderSearch();});for(const field of ['filter-category','filter-neighborhood','filter-date','filter-budget'])byId(field).addEventListener('change',renderSearch);
let filterTyping;
byId('search-q').addEventListener('input',()=>{clearTimeout(filterTyping);filterTyping=setTimeout(renderSearch,200);});byId('search-form').addEventListener('reset',()=>setTimeout(renderSearch,0));byId('compare-clear').addEventListener('click',()=>{state.selected=[];renderSearch();});byId('search-more').addEventListener('click',()=>{state.searchVisible+=SEARCH_PAGE_SIZE;renderSearch();});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(state.active==='buscar'&&entries.some(entry=>entry.isIntersecting)&&!byId('search-more').hidden)byId('search-more').click();},{rootMargin:'380px 0px'});observer.observe(byId('search-sentinel'));}
if(state.homologation){byId('review-panel').hidden=false;byId('import-catalog').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>12_000_000)throw Error('Arquivo muito grande para revisão local.');const payload=JSON.parse(await file.text());if(payload?.meta?.publicacao_autorizada===true)throw Error('Arquivo interno inesperadamente marcado como público.');initializeCatalog(payload,true);text(byId('review-status'),`${state.all.length} sessões reais elegíveis carregadas somente neste navegador`);}catch(error){text(byId('review-status'),`Não foi possível abrir o catálogo: ${error.message}`);}});}
const hash=location.hash.slice(1);navTo(tabs.has(hash)?hash:'inicio');if(!state.homologation)fetchPublic();if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});}
start();
