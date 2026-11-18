import {normalizeSessions, validUrl} from './catalog.js';
import {resolveCategories,resolveTags} from './taxonomy.js';

export const STATUS_LABELS=Object.freeze({APTO_PARA_PILOTO:'Apto para teste interno',PENDENTE_VERIFICACAO:'Pendente de verificação',NAO_UTILIZAR:'Não utilizar'});
export const BLOCKER_LABELS=Object.freeze({dados:'Dados pendentes',rejeitado:'Não utilizar',data:'Data ou horário a confirmar',iniciado:'Sessão já iniciada',fonte:'Fonte oficial ausente',local:'Local a confirmar',preco:'Preço a confirmar',publicacao:'Publicação pendente',imagem:'Imagem sem licença'});
const text=v=>String(v??'').trim();
function cents(v){if(v===null||v===undefined||v==='')return null;const s=text(v);return /^\d+$/.test(s)&&Number.isSafeInteger(Number(s))?Number(s):null;}

/** Private, local review projection. Never use this projection as a public feed. */
export function normalizeCuration(payload,{now=new Date()}={}){
 const raw=Array.isArray(payload)?payload:payload?.sessoes||payload?.sessions||[];
 const seen=new Set();
 return raw.filter(r=>r&&text(r.session_id)&&text(r.titulo)&&!seen.has(text(r.session_id))&&seen.add(text(r.session_id))).map(r=>{
  const row={...r,session_id:text(r.session_id),inicio_utc:r.inicio_utc||r.inicio_local||'',preco_min_centavos:cents(r.preco_min_centavos)};
  const eligible=normalizeSessions([row],{internal:true,now}).length===1&&!/ENCERRAD|ESGOTAD|CANCELAD|PAUSAD/i.test(text(r.disponibilidade));
  const categories=resolveCategories(r),tags=resolveTags(r),starts=Date.parse(row.inicio_utc),blockers=[];
  if(r.status==='PENDENTE_VERIFICACAO')blockers.push('dados');
  if(r.status==='NAO_UTILIZAR')blockers.push('rejeitado');
  if(!Number.isFinite(starts))blockers.push('data');else if(starts<=now.getTime())blockers.push('iniciado');
  if(!validUrl(r.url_oficial))blockers.push('fonte');
  if(!text(r.local)||/a (definir|confirmar)|secreta?/i.test(text(r.local)))blockers.push('local');
  if(row.preco_min_centavos===null)blockers.push('preco');
  const publicApproved=r.status==='APTO_PARA_PILOTO'&&r.reuso_publico==='LIBERADO'&&r.revisao_editorial==='APROVADO';
  if(!publicApproved)blockers.push('publicacao');
  if(r.licenca_imagem!=='LIBERADA'||!validUrl(r.imagem_url)||!validUrl(r.url_fonte_imagem)||!text(r.credito_imagem))blockers.push('imagem');
  return {id:row.session_id,title:text(r.titulo),category:categories[0],categories,tags,description:text(r.descricao_editorial),why:text(r.por_que_vale_a_pena),date:text(r.data_local),startsAt:row.inicio_utc,hour:text(r.hora_local),neighborhood:text(r.bairro)||'Bairro a confirmar',place:text(r.local)||'Local a confirmar',priceType:text(r.tipo_preco),minCents:row.preco_min_centavos,url:validUrl(r.url_oficial)?r.url_oficial:null,accessUrl:validUrl(r.url_acesso)?r.url_acesso:null,verifiedAt:text(r.verificado_em),internal:true,status:STATUS_LABELS[r.status]?r.status:'PENDENTE_VERIFICACAO',statusLabel:STATUS_LABELS[r.status]||STATUS_LABELS.PENDENTE_VERIFICACAO,reason:text(r.motivo_status),restrictions:text(r.restricoes),availability:text(r.disponibilidade)||'NAO_VERIFICADA',publication:publicApproved?'LIBERADO':'PENDENTE_REVISAO',eligible,blockers,imageUrl:!blockers.includes('imagem')?r.imagem_url:null,imageCredit:text(r.credito_imagem)||null};
 }).sort((a,b)=>(a.date+' '+a.hour).localeCompare(b.date+' '+b.hour)||a.id.localeCompare(b.id));
}
export function curationMatches(item,{status='',blocker='',publication=''}={}){
 return (!status||item.status===status)&&(!blocker||item.blockers.includes(blocker))&&(!publication||item.publication===publication);
}
