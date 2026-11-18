#!/usr/bin/env node
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createSign} from 'node:crypto';
import {buildPublicProjection,parseCsv,rowsToObjects} from './catalog-pipeline.mjs';

const args=process.argv.slice(2);
const getArg=(name)=>{const i=args.indexOf(name);return i<0?undefined:args[i+1]};
const csvPath=getArg('--csv');
const output=getArg('--out')||'p2/catalog-public.json';
const google=args.includes('--google');
if(Number(Boolean(csvPath))+Number(google)!==1){
  console.error('Uso: node scripts/export_public_catalog.mjs --csv CURADORIA.csv --out p2/catalog-public.json | --google --out ...');
  process.exit(2);
}
async function privateSheetRows(){
  const content=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId=process.env.QFAZER_CATALOG_SHEET_ID;
  if(!content||!sheetId)throw Error('Integração ainda não configurada. Necessários segredo GOOGLE_SERVICE_ACCOUNT_JSON e ID privado da planilha.');
  const credential=JSON.parse(content);
  if(credential.type!=='service_account'||!credential.private_key||!credential.client_email)throw Error('Credencial de serviço inválida');
  const now=Math.floor(Date.now()/1000);
  const base64=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned=base64({alg:'RS256',typ:'JWT'})+'.'+base64({iss:credential.client_email,scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const signature=createSign('RSA-SHA256').update(unsigned).sign(credential.private_key).toString('base64url');
  const assertion=unsigned+'.'+signature;
  const tokenResp=await fetch('https://oauth2.googleapis.com/token',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})
  });
  if(!tokenResp.ok)throw Error(`Não foi possível autenticar na API Google (${tokenResp.status})`);
  const token=(await tokenResp.json()).access_token;
  if(!token)throw Error('A API não retornou token de leitura');
  const range=encodeURIComponent('CURADORIA!A1:AZ2000'); // já admite colunas editoriais futuras sem publicar dados brutos
  const resp=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${range}?valueRenderOption=UNFORMATTED_VALUE`,{headers:{Authorization:`Bearer ${token}`}});
  if(!resp.ok)throw Error(`Não foi possível ler a aba CURADORIA (${resp.status}). Confirme o compartilhamento somente leitura com a conta de serviço.`);
  const json=await resp.json();
  return rowsToObjects(json.values);
}
try {
  const rows=google?await privateSheetRows():parseCsv(await readFile(csvPath,'utf8'));
  const out=buildPublicProjection(rows);
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(out,null,2)+'\n','utf8');
  console.log(`Exportação segura concluída: ${rows.length} linhas avaliadas; ${out.sessoes.length} sessões publicáveis. Dados internos não foram exportados.`);
} catch(e){console.error(e.message);process.exit(1)}
