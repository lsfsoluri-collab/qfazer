import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,sep} from 'node:path';
import {rowsToObjects} from './catalog-pipeline.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
/** Builds a private, standalone review file. Never writes the catalog to the repository. */
export async function buildInternalPreview(payload,{generatedAt=new Date().toISOString()}={}){
 if(payload?.meta?.publicacao_autorizada===true)throw Error('Use uma origem de curadoria, sem autorização pública presumida.');
 let rows=Array.isArray(payload)?payload:payload?.sessoes||payload?.sessions;
 if(Array.isArray(rows?.[0]))rows=rowsToObjects(rows);
 if(!Array.isArray(rows)||!rows.length)throw Error('Curadoria vazia ou sem lista de sessões.');
 const ids=new Set();for(const row of rows){if(!row?.session_id||!row.titulo||ids.has(row.session_id))throw Error('Sessão sem identidade ou ID duplicado na curadoria.');ids.add(row.session_id);}
 const meta={schema_version:'1.1',scope:'HOMOLOGACAO_INTERNA_CURADORIA_COMPLETA',publicacao_autorizada:false,total:rows.length,gerado_em:generatedAt};
 let html=await fs.readFile(resolve(ROOT,'scripts/templates/curadoria-interna.html'),'utf8');
 const code=[];for(const file of ['taxonomy.js','catalog.js','curation.js'])code.push((await fs.readFile(resolve(ROOT,'p2',file),'utf8')).replace(/^import .*;\s*$/gm,'').replace(/\bexport /g,''));
 const script='<script>\n(()=>{\n'+code.join('\n')+'\nwindow.QfazerReview={normalizeCuration,curationMatches,STATUS_LABELS,BLOCKER_LABELS,CATEGORIES,categoryLabel,tagLabel};\n})();\n</script>';
 const json=JSON.stringify({meta,sessoes:rows}).replaceAll('<','\\u003c');
 html=html.replace('<!-- QFAZER_DATA -->',()=>'<script type="application/json" id="qfazer-preview-data" data-catalog>'+json+'</script>').replace('<!-- QFAZER_LIBRARY -->',()=>script);
 html=html.replace('Os 240 registros estão incorporados nesta versão.',`Os ${rows.length} registros estão incorporados nesta versão.`).replace('catálogo central conferido em 18/11/2026',`snapshot local gerado em ${generatedAt.slice(0,10)}`);
 return {html,meta};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),input=args[args.indexOf('--input')+1],output=args[args.indexOf('--output')+1];
 if(!args.includes('--input')||!args.includes('--output')||!input||!output)throw Error('Informe --input JSON e --output HTML fora do repositório.');
 const destination=resolve(output);if(destination===ROOT||destination.startsWith(ROOT+sep))throw Error('O snapshot privado deve ficar fora do repositório público.');
 const result=await buildInternalPreview(JSON.parse(await fs.readFile(resolve(input),'utf8')));
 await fs.mkdir(dirname(destination),{recursive:true});await fs.writeFile(destination,result.html);
 console.log(JSON.stringify({output:destination,total:result.meta.total,publicacao_autorizada:false}));
}
