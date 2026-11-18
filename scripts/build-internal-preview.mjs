import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,sep} from 'node:path';
import {rowsToObjects} from './catalog-pipeline.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
/** Data stays local. A supplied approved HTML retains its markup, styles and branding. */
export async function buildInternalPreview(payload,{generatedAt=new Date().toISOString(),referenceHtml=null}={}){
 if(payload?.meta?.publicacao_autorizada===true)throw Error('Use uma origem de curadoria, sem autorização pública presumida.');
 let rows=Array.isArray(payload)?payload:payload?.sessoes||payload?.sessions;
 if(Array.isArray(rows?.[0]))rows=rowsToObjects(rows);
 if(!Array.isArray(rows)||!rows.length)throw Error('Curadoria vazia ou sem lista de sessões.');
 const ids=new Set();for(const row of rows){if(!row?.session_id||!row.titulo||ids.has(row.session_id))throw Error('Sessão sem identidade ou ID duplicado na curadoria.');ids.add(row.session_id);}
 const meta={schema_version:'1.1',scope:'HOMOLOGACAO_INTERNA_CURADORIA_COMPLETA',publicacao_autorizada:false,total:rows.length,gerado_em:generatedAt};
 const shell=await fs.readFile(resolve(ROOT,'p2/index.html'),'utf8');
 const css=await fs.readFile(resolve(ROOT,'p2/app.css'),'utf8');
 let html=referenceHtml||shell;
 html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 if(!referenceHtml)html=html.replace('<link rel="stylesheet" href="./app.css">',()=>'<style>'+css+'</style>');
 if(!html.includes('id="curation-filters"')){
  const fieldset=shell.match(/<fieldset id="curation-filters"[\s\S]*?<\/fieldset>/)?.[0];
  if(!fieldset||!html.includes('<div class="filter-controls">'))throw Error('Referência não corresponde ao contrato visual do P2.');
  html=html.replace('<div class="filter-controls">',()=>fieldset+'<div class="filter-controls">');
  const extra=css.slice(css.indexOf('/* Revisão interna:'));
  html=html.replace('</head>',()=>'<style>'+extra+'</style></head>');
 }
 for(const match of [...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+\.svg)"/g)]){
  const bytes=await fs.readFile(resolve(ROOT,'p2',match[1]));html=html.replaceAll(match[1],'data:image/svg+xml;base64,'+bytes.toString('base64'));
 }
 const modules=[];for(const file of ['taxonomy.js','catalog.js','curation.js'])modules.push((await fs.readFile(resolve(ROOT,'p2',file),'utf8')).replace(/^import .*;\s*$/gm,'').replace(/\bexport /g,''));
 const api='{normalizeSessions,priceLabel,sessionMatches,compareIds,validUrl,CATEGORIES,categoryLabel,tagLabel,normalizeCuration,curationMatches,STATUS_LABELS,BLOCKER_LABELS}';
 const library='<script>\n(()=>{\n'+modules.join('\n')+'\nwindow.QfazerInternal='+api+';\n})();\n</script>';
 let app=await fs.readFile(resolve(ROOT,'p2/app.js'),'utf8');
 app=app.replace(/^import \{([^}]+)\} from [^;]+;/gm,(_,names)=>'const {'+names+'}=window.QfazerInternal;');
 app=app.replace("homologation:new URLSearchParams(location.search).get('homologacao')==='1'",'homologation:true');
 app=app.replace("if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});",'');
 const json=JSON.stringify({meta,sessoes:rows}).replaceAll('<','\\u003c');
 const scripts='<script type="application/json" id="qfazer-preview-data" data-catalog>'+json+'</script>'+library+'<script>\n(()=>{\n'+app+'\n})();\n</script>';
 html=html.replace('</body>',()=>scripts+'</body>');
 return {html,meta};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),input=args[args.indexOf('--input')+1],output=args[args.indexOf('--output')+1];
 if(!args.includes('--input')||!args.includes('--output')||!input||!output)throw Error('Informe --input JSON e --output HTML fora do repositório.');
 const destination=resolve(output);if(destination===ROOT||destination.startsWith(ROOT+sep))throw Error('O snapshot privado deve ficar fora do repositório público.');
 const reference=args.includes('--reference')?await fs.readFile(resolve(args[args.indexOf('--reference')+1]),'utf8'):null;
 const result=await buildInternalPreview(JSON.parse(await fs.readFile(resolve(input),'utf8')),{referenceHtml:reference});
 await fs.mkdir(dirname(destination),{recursive:true});await fs.writeFile(destination,result.html);
 console.log(JSON.stringify({output:destination,total:result.meta.total,publicacao_autorizada:false,referencia_aprovada:Boolean(reference)}));
}
