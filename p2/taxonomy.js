// Vocabulário editorial Qfazer v1 — textos de curadoria não viram opções brutas no app.
// Categorias são múltiplas; tags refinam o significado sem duplicar sessões.
export const CATEGORIES = Object.freeze([
  {id:'musica',label:'Música'},
  {id:'festas',label:'Festas'},
  {id:'arte',label:'Arte'},
  {id:'cinema',label:'Cinema'},
  {id:'gastronomia',label:'Gastronomia'},
  {id:'esporte',label:'Esporte'},
  {id:'teatro',label:'Teatro'},
  {id:'danca',label:'Dança'},
  {id:'literatura',label:'Literatura'},
  {id:'feiras',label:'Feiras'},
  {id:'oficinas',label:'Oficinas'},
  {id:'vida-noturna',label:'Vida noturna'},
  {id:'outros',label:'Outros'}
]);
const allowed = new Set(CATEGORIES.map(v=>v.id));
const alias = Object.freeze({
  'MUSICA':['musica'], 'SHOW':['musica'], 'SHOWS':['musica'],
  'ARTES VISUAIS':['arte'], 'ARTE':['arte'], 'ARTES':['arte'],
  'CINEMA':['cinema'], 'TEATRO':['teatro'],
  'OPERA':['musica','teatro'], 'LITERATURA':['literatura'],
  'DANCA':['danca'], 'GASTRONOMIA':['gastronomia'],
  'FEIRAS E CULTURA URBANA':['feiras'], 'FEIRA':['feiras'], 'FEIRAS':['feiras'],
  'FESTAS E VIDA NOTURNA':['festas','vida-noturna'], 'FESTA':['festas'], 'FESTAS':['festas'],
  'VIDA NOTURNA':['vida-noturna'], 'BARES COM PROGRAMACAO':['vida-noturna','gastronomia'],
  'ESPORTE':['esporte'], 'ESPORTES':['esporte'], 'ESPORTES E MOVIMENTO':['esporte'],
  'OFICINAS E EXPERIENCIAS':['oficinas'], 'OFICINAS':['oficinas'],
  'DANCA E PERFORMANCE':['danca']
});
const tagNames=Object.freeze({
  'samba':'Samba','pagode':'Pagode','rock':'Rock','jazz':'Jazz','mpb':'MPB','rap':'Rap',
  'hip-hop':'Hip-hop','eletronica':'Eletrônica','musica-ao-vivo':'Música ao vivo',
  'ao-ar-livre':'Ao ar livre','teatro-musical':'Teatro musical','opera':'Ópera',
  'exposicao':'Exposição','arte-urbana':'Arte urbana','cultura-urbana':'Cultura urbana',
  'festival':'Festival','oficina':'Oficina','feira':'Feira',
  'bar':'Bar','vida-noturna':'Vida noturna','gastronomia':'Gastronomia',
  'familia':'Família','infantil':'Infantil','gratuito':'Gratuito',
  'corrida':'Corrida','esporte':'Esporte','danca':'Dança','cinema':'Cinema',
  'literatura':'Literatura','multicultural':'Multicultural','lgbtqia':'LGBTQIA+'
});
export function key(value){
 return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .trim().toUpperCase().replace(/[_-]+/g,' ').replace(/[^A-Z0-9 ]+/g,' ').replace(/\s+/g,' ');
}
export function splitTerms(value){
 if(Array.isArray(value))return value.flatMap(splitTerms);
 return String(value??'').split(/[;,|]/).map(s=>s.trim()).filter(Boolean);
}
export function resolveCategories(row){
 const raw=splitTerms(row.categorias_busca??row.categories??[]);
 const terms=raw.length?raw:[row.categoria??row.category??''];
 const found = [];
 for(const term of terms){
   const normalized=key(term);
   const direct=CATEGORIES.find(x=>key(x.label)===normalized||key(x.id)===normalized);
   const ids=direct?[direct.id]:(alias[normalized]||[]);
   for(const id of ids)if(allowed.has(id)&&!found.includes(id))found.push(id);
 }
 return found.length?found:['outros'];
}
const originalTags={'FESTAS E VIDA NOTURNA':['vida-noturna'],'BARES COM PROGRAMACAO':['bar','vida-noturna'],'FEIRAS E CULTURA URBANA':['cultura-urbana'],'OPERA':['opera']};
export function resolveTags(row){
 const supplied=[...splitTerms(row.tags_busca),...splitTerms(row.tags),...splitTerms(row.subcategoria)];
 const derived=originalTags[key(row.categoria)]||[];
 const found=new Set();
 for(const value of [...supplied,...derived]){
  const slug=key(value).toLowerCase().replaceAll(' ','-');
  if(Object.hasOwn(tagNames,slug))found.add(slug);
 }
 return [...found];
}
export function categoryLabel(id){return CATEGORIES.find(x=>x.id===id)?.label||'Outros';}
export function tagLabel(id){return tagNames[id]||'';}
