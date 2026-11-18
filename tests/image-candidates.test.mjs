import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getOgImage,safeHttpsUrl,findCandidate} from '../scripts/image-candidates.mjs';
test('página oficial com OG image encontra candidato, sem declarar licença',()=>{
 assert.equal(getOgImage('<meta content="https://exemplo.org/arte.jpg" property="og:image">','https://exemplo.org/evento'),'https://exemplo.org/arte.jpg');
});
test('preserva URL relativa no mesmo site',()=>{
 assert.equal(getOgImage('<meta property="og:image" content="/fotos/evento.jpg">','https://exemplo.org/evento'),'https://exemplo.org/fotos/evento.jpg');
});
test('não aceita http, hosts locais ou IP diretamente',()=>{
 for(const url of ['http://exemplo.org/a','https://localhost/','https://127.0.0.1/','https://test.internal/a'])assert.equal(safeHttpsUrl(url),null);
});
test('rejeita domínio sem autorização explícita antes de qualquer rede',async()=>{
 const a=await findCandidate('https://exemplo.org/evento',{allowHosts:['outro.org'],fetcher:()=>{throw Error('não deve fazer rede')}});
 assert.match(a.reason,/Host não autorizado/);
});
test('redirecionamento para outro domínio é bloqueado',async()=>{
 const a=await findCandidate('https://exemplo.org/evento',{allowHosts:['exemplo.org'],fetcher:async()=>({
  url:'https://outro.org/evento',ok:true,headers:new Headers({'content-type':'text/html'}),text:async()=>'<meta property="og:image" content="https://outro.org/f.jpg">'
 })});
 assert.match(a.reason,/Redirecionamento/);
});
