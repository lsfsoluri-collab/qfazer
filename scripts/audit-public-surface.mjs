import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validatePublicCatalog} from '../p2/public-catalog.js';

export async function auditPublicSurface(root=resolve('p2')){
 async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=resolve(dir,entry.name);
  if(entry.isDirectory())await walk(path);
  else if(/\.env(?:\.|$)|homologacao.*\.json$|interno.*\.json$|curadoria.*\.json$/i.test(entry.name))throw Error('Arquivo interno no diretório público');
  else if(/\.json$/i.test(entry.name)){
   if(path!==resolve(root,'catalog-public.json'))throw Error('JSON não previsto na superfície pública');
   validatePublicCatalog(JSON.parse(await readFile(path,'utf8')));
  }
 }}
 await walk(root);
 validatePublicCatalog(JSON.parse(await readFile(resolve(root,'catalog-public.json'),'utf8')));
 return true;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){await auditPublicSurface();console.log('Superfície pública validada; catálogo aprovado, sem snapshots internos.');}
