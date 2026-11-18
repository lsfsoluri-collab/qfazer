import {normalizeSessions,validUrl} from './catalog.js';

const FIELDS=new Set('session_id titulo categoria categorias_busca tags_busca descricao_editorial data_local hora_local inicio_utc local bairro municipio codigo_ibge tipo_preco preco_min_centavos preco_max_centavos url_oficial url_acesso fonte_id verificado_em status reuso_publico revisao_editorial por_que_vale_a_pena imagem_url licenca_imagem credito_imagem url_fonte_imagem'.split(' '));
/** Shared boundary for generated files, CI and application. Never accepts raw curation. */
export function validatePublicCatalog(payload){
 if(!payload||Array.isArray(payload)||payload.meta?.scope!=='PUBLICO_APROVADO'||payload.meta?.schema_version!=='1.0'||!Array.isArray(payload.sessoes)||payload.meta.total!==payload.sessoes.length)throw Error('Contrato público inválido');
 if(Object.keys(payload).some(k=>!['meta','sessoes'].includes(k))||Object.keys(payload.meta).some(k=>!['schema_version','scope','total'].includes(k)))throw Error('Metadados fora da projeção pública');
 const ids=new Set();
 for(const row of payload.sessoes){
  if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!FIELDS.has(k)))throw Error('Campo fora da projeção pública');
  if(typeof row.session_id!=='string'||!row.session_id.trim()||ids.has(row.session_id))throw Error('Identidade pública ausente ou duplicada');
  ids.add(row.session_id);
  if(row.status!=='APTO_PARA_PILOTO'||row.reuso_publico!=='LIBERADO'||row.revisao_editorial!=='APROVADO')throw Error('Sessão sem as três aprovações');
  if(String(row.codigo_ibge)!=='3550308'||row.municipio!=='São Paulo'||!row.titulo||!row.local||!row.categoria||!validUrl(row.url_oficial)||!validUrl(row.url_acesso)||!row.fonte_id||!row.verificado_em||!Number.isFinite(Date.parse(row.inicio_utc)))throw Error('Sessão pública sem requisitos factuais');
  for(const key of ['preco_min_centavos','preco_max_centavos'])if(row[key]!==null&&(!Number.isSafeInteger(row[key])||row[key]<0))throw Error('Preço público inválido');
  if(row.tipo_preco==='GRATUITO'&&row.preco_min_centavos!==0)throw Error('Gratuidade não confirmada');
  if(row.preco_min_centavos!==null&&row.preco_max_centavos!==null&&row.preco_max_centavos<row.preco_min_centavos)throw Error('Faixa de preço inválida');
  if(row.imagem_url&&(row.licenca_imagem!=='LIBERADA'||!validUrl(row.imagem_url)||!validUrl(row.url_fonte_imagem)||!row.credito_imagem))throw Error('Imagem sem liberação e origem');
 }
 return payload;
}
export function readPublicCatalog(payload,options={}){return normalizeSessions(validatePublicCatalog(payload),{...options,internal:false});}
