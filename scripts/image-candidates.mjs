// Qfazer — auditoria assistida de links de divulgação. NÃO publica nem licencia fotos.
// Busca apenas metadados Open Graph de páginas oficiais em hosts explicitamente autorizados.
import {readFile,writeFile} from 'node:fs/promises';
import {parseCsv} from './catalog-pipeline.mjs';
const MAX_HTML=1_000_000;
export function safeHttpsUrl(input){
 try{
  const u=new URL(String(input??''));
  if(u.protocol!=='https:'||u.username||u.password||!u.hostname)return null;
  const h=u.hostname.toLowerCase();
  if(h==='localhost'||h.endsWith('.local')||h.endsWith('.internal')||h.endsWith('.localhost'))return null;
  if(/^\d+\.\d+\.\d+\.\d+$/.test(h)||h.startsWith('['))return null;
  return u;
 }catch{return null;}
}
export function getOgImage(html,baseUrl){
 const source=safeHttpsUrl(baseUrl);if(!source)return null;
 for(const tag of String(html).match(/<meta\b[^>]*>/gi)||[]){
  const attrs=Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)]
    .map(x=>[x[1].toLowerCase(),x[3].replaceAll('&amp;','&')]));
  const property=(attrs.property||attrs.name||'').toLowerCase();
  if(!['og:image','og:image:url','twitter:image'].includes(property))continue;
  if(!attrs.content)continue;
  const possible=safeHttpsUrl(new URL(attrs.content,source).href);
  if(possible)return possible.href;
 }
 return null;
}
export async function findCandidate(url,{allowHosts,fetcher=fetch}={}){
 const original=safeHttpsUrl(url);
 if(!original)return {candidate:'',reason:'URL oficial inválida'};
 const allowed=new Set(allowHosts||[]);
 if(!allowed.has(original.hostname))return {candidate:'',reason:'Host não autorizado pelo operador'};
 const res=await fetcher(original.href,{headers:{Accept:'text/html'},redirect:'manual',signal:AbortSignal.timeout(8000)});
 const finalUrl=safeHttpsUrl(res.url||original.href);
 if(!finalUrl||!allowed.has(finalUrl.hostname))return {candidate:'',reason:'Redirecionamento fora dos hosts autorizados'};
 if(!res.ok||!(res.headers.get('content-type')||'').includes('text/html'))return {candidate:'',reason:'Página não é HTML público válido'};
 const size=Number(res.headers.get('content-length')||0);
 if(size>MAX_HTML)return {candidate:'',reason:'Página maior que o limite permitido'};
 const html=(await res.text()).slice(0,MAX_HTML);
 const candidate=getOgImage(html,finalUrl.href);
 return candidate?{candidate,reason:'PENDENTE_DIREITOS'}:{candidate:'',reason:'Sem metadados Open Graph de imagem'};
}
export const encodeCsv=(v)=>'"'+String(v??'').replaceAll('"','""')+'"';
if(process.argv[1]?.endsWith('/image-candidates.mjs')){
 const args=process.argv.slice(2);
 const get=(n)=>{const i=args.indexOf(n);return i<0?undefined:args[i+1];};
 const inPath=get('--csv'),outPath=get('--out'),hostArg=get('--hosts');
 const limit=Math.min(30,Math.max(1,Number(get('--limit')||15)));
 if(!inPath||!outPath||!hostArg){console.error('Uso: node scripts/image-candidates.mjs --csv base-privada.csv --hosts ccbb.com.br,theatromunicipal.org.br --limit 15 --out auditoria-imagens.local.csv');process.exit(2);}
 const hosts=hostArg.split(',').map(v=>v.trim()).filter(Boolean);
 try{
  const rows=parseCsv(await readFile(inPath,'utf8'));
  const picked=rows.filter(r=>r.status==='APTO_PARA_PILOTO'&&safeHttpsUrl(r.url_oficial)).slice(0,limit);
  const report=[['session_id','titulo','url_oficial','url_candidata','status_direitos','observacao'].map(encodeCsv).join(',')];
  for(const row of picked){
   let data;
   try{data=await findCandidate(row.url_oficial,{allowHosts:hosts});}
   catch(e){data={candidate:'',reason:'Erro de acesso — verificação manual necessária'};}
   report.push([row.session_id,row.titulo,row.url_oficial,data.candidate,'PENDENTE_REVISAO',data.reason].map(encodeCsv).join(','));
  }
  await writeFile(outPath,report.join('\n')+'\n','utf8');
  console.log('Auditoria gerada para '+picked.length+' eventos. Nenhuma licença inferida, imagem baixada ou publicada.');
 }catch(e){console.error(e.message);process.exit(1);}
}
