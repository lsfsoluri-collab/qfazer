import {resolveCategories,resolveTags} from '../p2/taxonomy.js';
// Qfazer — exportador de projeção pública, sem dependências de terceiros.
// Importante: NUNCA publica o arquivo bruto da pesquisa; só campos permitidos e sessões aprovadas.

const HOUR_MS = 60 * 60 * 1000;

export const REQUIRED_COLUMNS = Object.freeze([
  'session_id','titulo','categoria','data_local','hora_local','inicio_local',
  'local','bairro','municipio','codigo_ibge','tipo_preco','preco_min_centavos',
  'url_oficial','url_acesso','fonte_id','verificado_em','status','reuso_publico',
  'revisao_editorial','responsavel_revisao','revisado_em','licenca_imagem'
]);

export function parseCsv(csvText) {
  const text=String(csvText).replace(/^\uFEFF/, '');
  const records=[];let record=[],field='',quoted=false;
  for(let i=0;i<text.length;i++) {
    const char=text[i];
    if(quoted) {
      if(char==='"'&&text[i+1]==='"') {field+='"';i++;}
      else if(char==='"') quoted=false;
      else field+=char;
    } else if(char==='"'&&field==='') quoted=true;
    else if(char===',') {record.push(field);field='';}
    else if(char==='\n'||char==='\r') {
      if(char==='\r'&&text[i+1]==='\n')i++;
      record.push(field);field='';
      if(record.some(c=>c!==''))records.push(record);
      record=[];
    } else field+=char;
  }
  if(quoted)throw Error('CSV contém aspas não fechadas');
  record.push(field);
  if(record.some(c=>c!==''))records.push(record);
  if(!records.length)throw Error('CSV vazio');
  const headers=records.shift().map(c=>c.trim());
  if(new Set(headers).size!==headers.length)throw Error('Cabeçalhos duplicados no CSV');
  return rowsToObjects([headers,...records]);
}

export function rowsToObjects(matrix) {
  if(!Array.isArray(matrix)||!matrix.length)throw Error('Aba CURADORIA não contém cabeçalho');
  const headers=matrix[0].map(x=>String(x??'').trim());
  const absent=REQUIRED_COLUMNS.filter(x=>!headers.includes(x));
  if(absent.length)throw Error('Colunas obrigatórias ausentes: '+absent.join(', '));
  return matrix.slice(1).filter(row=>row.some(v=>v!==''&&v!==null&&v!==undefined)).map(row=>
    Object.fromEntries(headers.map((h,i)=>[h,row[i]??''])));
}

export function isoDate(date) {
  const d=String(date??'').trim();
  let v;
  if(/^\d{4}-\d{2}-\d{2}$/.test(d))v=d;
  else if(/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {const [day,month,year]=d.split('/');v=`${year}-${month}-${day}`;}
  else return null;
  const t=new Date(v+'T12:00:00Z');
  return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===v?v:null;
}

function httpsUrl(value) {
  if(typeof value!=='string'||!value.trim())return false;
  try {const url=new URL(value);return url.protocol==='https:'&&!!url.hostname;}catch{return false;}
}

function saoPauloDate(date) {
  const obj=Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    year:'numeric',month:'2-digit',day:'2-digit',timeZone:'America/Sao_Paulo'
  }).formatToParts(date).map(p=>[p.type,p.value]));
  return `${obj.year}-${obj.month}-${obj.day}`;
}

function positiveCents(v) {
  if(v===''||v===undefined||v===null)return null;
  const raw=String(v).trim();
  if(!/^\d+$/.test(raw))return NaN;
  const n=Number(raw);return Number.isSafeInteger(n)?n:NaN;
}

/** Returns only safe public fields; never evidence, internal observations, review actor or research metadata. */
export function buildPublicProjection(rows,{now=new Date()}={}) {
  const seen=new Set(),errors=[],sessions=[];
  for(const [i,row] of rows.entries()) {
    const id=String(row.session_id??'').trim();
    if(!id){errors.push(`Linha ${i+2}: session_id vazio`);continue;}
    if(seen.has(id)){errors.push(`Linha ${i+2}: session_id duplicado (${id})`);continue;}
    seen.add(id);
    if(row.status!=='APTO_PARA_PILOTO'||row.reuso_publico!=='LIBERADO'||row.revisao_editorial!=='APROVADO')continue;
    const date=isoDate(row.data_local);
    const ts=Date.parse(String(row.inicio_local??''));
    if(!Number.isFinite(ts)){errors.push(`Linha ${i+2}: início inválido (${id})`);continue;}
    if(ts<=now.getTime())continue;
    if(!date||saoPauloDate(new Date(ts))!==date){errors.push(`Linha ${i+2}: data diferente do início em São Paulo (${id})`);continue;}
    if(row.codigo_ibge!==3550308&&String(row.codigo_ibge)!=='3550308'){errors.push(`Linha ${i+2}: município não é São Paulo (${id})`);continue;}
    if(String(row.municipio??'').trim().toLowerCase()!=='são paulo'){errors.push(`Linha ${i+2}: município não corresponde (${id})`);continue;}
    const required=['titulo','categoria','local','fonte_id','verificado_em','responsavel_revisao','revisado_em'];
    for(const key of required)if(!String(row[key]??'').trim())errors.push(`Linha ${i+2}: ${key} não preenchido (${id})`);
    if(!isoDate(row.verificado_em)||!isoDate(row.revisado_em))errors.push(`Linha ${i+2}: data de revisão ou verificação inválida (${id})`);
    if(!httpsUrl(row.url_oficial))errors.push(`Linha ${i+2}: URL oficial HTTPS inválida (${id})`);
    if(row.url_acesso&&!httpsUrl(row.url_acesso))errors.push(`Linha ${i+2}: URL de acesso HTTPS inválida (${id})`);
    const min=positiveCents(row.preco_min_centavos),max=positiveCents(row.preco_max_centavos);
    if(Number.isNaN(min)||Number.isNaN(max)||(min!==null&&max!==null&&min>max))errors.push(`Linha ${i+2}: faixa de preço inconsistente (${id})`);
    if(row.tipo_preco==='GRATUITO'&&min!==0)errors.push(`Linha ${i+2}: gratuidade sem preço zero (${id})`);
    if(row.imagem_url&&row.licenca_imagem==='LIBERADA'&&!httpsUrl(row.imagem_url))errors.push(`Linha ${i+2}: imagem sem URL HTTPS válida (${id})`);
    const categories=resolveCategories(row);
    const tags=resolveTags(row);
    if(categories.includes('outros'))errors.push(`Linha ${i+2}: categoria não mapeada para taxonomia pública (${id})`);
    if(errors.some(e=>e.includes(`(${id})`)))continue;
    const out={
      session_id:id,
      titulo:String(row.titulo),categoria:String(row.categoria),
      categorias_busca:categories,tags_busca:tags,
      descricao_editorial:String(row.descricao_editorial??''),
      data_local:date,hora_local:String(row.hora_local??''),
      inicio_utc:new Date(ts).toISOString(),
      local:String(row.local),bairro:String(row.bairro??''),municipio:'São Paulo',codigo_ibge:'3550308',
      tipo_preco:String(row.tipo_preco??'NAO_INFORMADO'),
      preco_min_centavos:min,preco_max_centavos:max,
      url_oficial:String(row.url_oficial),
      url_acesso:String(row.url_acesso||row.url_oficial),
      fonte_id:String(row.fonte_id),verificado_em:isoDate(row.verificado_em),
      status:'APTO_PARA_PILOTO',reuso_publico:'LIBERADO'
    };
    if(row.imagem_url&&row.licenca_imagem==='LIBERADA'){
      out.imagem_url=String(row.imagem_url);
      if(String(row.credito_imagem??'').trim())out.credito_imagem=String(row.credito_imagem).trim();
    }
    sessions.push(out);
  }
  if(errors.length)throw Error('Catálogo NÃO exportado. Corrigir:\n'+errors.slice(0,40).join('\n'));
  sessions.sort((a,b)=>a.inicio_utc.localeCompare(b.inicio_utc)||a.session_id.localeCompare(b.session_id));
  return {
    meta:{schema_version:'1.0',scope:'PUBLICO_APROVADO',total:sessions.length},
    sessoes:sessions
  };
}
