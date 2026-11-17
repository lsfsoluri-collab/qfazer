// Netlify Function: IA real, mas recomendações APENAS do catálogo fictício do protótipo.
// Configure OPENAI_API_KEY como variável secreta no painel da Netlify.
const catalog = [
{id:"e1",name:"Som na Cidade",category:"música",price:0,region:"Centro",day:"sábado",time:"19h",duration:"2h"},
{id:"e2",name:"Arte sem Pressa",category:"arte",price:30,region:"Paulista",day:"sábado",time:"14h",duration:"1h30"},
{id:"e3",name:"Feira de Sabores",category:"gastronomia",price:45,region:"Pinheiros",day:"domingo",time:"12h",duration:"2h"},
{id:"e4",name:"Cinema de Rua",category:"cinema",price:0,region:"Centro",day:"sexta",time:"19h",duration:"2h"},
{id:"e5",name:"Jazz de Domingo",category:"música",price:55,region:"Vila Mariana",day:"domingo",time:"16h",duration:"2h"},
{id:"e6",name:"Ateliê Aberto",category:"arte",price:0,region:"Pinheiros",day:"domingo",time:"11h",duration:"1h"},
{id:"e7",name:"Cena no Bairro",category:"teatro",price:60,region:"Paulista",day:"sábado",time:"20h",duration:"1h40"},
{id:"e8",name:"Sabores do Centro",category:"gastronomia",price:25,region:"Centro",day:"sábado",time:"12h",duration:"2h"},
{id:"e9",name:"Música no Quintal",category:"música",price:35,region:"Pinheiros",day:"sexta",time:"20h",duration:"2h"},
{id:"e10",name:"Curta na Praça",category:"cinema",price:0,region:"Vila Mariana",day:"domingo",time:"18h",duration:"1h30"}
];
const schema = {type:"object",additionalProperties:false,properties:{reply:{type:"string"},recommendations:{type:"array",items:{type:"object",additionalProperties:false,properties:{id:{type:"string"},why:{type:"string"}},required:["id","why"]}}},required:["reply","recommendations"]};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
export default async function handler(request){
 if(request.method==="GET")return json({enabled:Boolean(process.env.OPENAI_API_KEY)});
 if(request.method!=="POST")return json({error:"Método não permitido"},405);
 const apiKey=process.env.OPENAI_API_KEY;
 if(!apiKey)return json({error:"IA ainda não configurada. Configure OPENAI_API_KEY na Netlify."},503);
 const raw=await request.text();
 if(raw.length>9000)return json({error:"Conversa extensa demais"},413);
 let data;try{data=JSON.parse(raw)}catch{return json({error:"Formato inválido"},400)}
 if(!Array.isArray(data.messages)||data.messages.length<1||data.messages.length>12)return json({error:"Conversa inválida"},400);
 const messages=[];
 for(const m of data.messages){
   if(!m||!(["user","assistant"].includes(m.role))||typeof m.content!=="string"||m.content.length>350)return json({error:"Mensagem inválida"},400);
   messages.push({role:m.role,content:m.content});
 }
 if(messages.at(-1).role!=="user")return json({error:"A última mensagem deve ser do usuário"},400);
 const profile=data.profile&&typeof data.profile==="object"?Object.fromEntries(Object.entries(data.profile).filter(([k,v])=>["interest","budget","region","day"].includes(k)&&["string","number"].includes(typeof v)).map(([k,v])=>[k,String(v).slice(0,40)])):{};
 const instructions=`Você é a assistente cultural do protótipo universitário “Qual a Boa?”, em São Paulo. Linguagem brasileira acolhedora, jovem, objetiva (sem exagerar emojis). Converse com naturalidade, faça no máximo UMA pergunta curta por vez quando faltarem informações essenciais (interesses, data/dia, região, orçamento). Não faça interrogatório.
VOCÊ NÃO CONSULTA A INTERNET E NÃO TEM EVENTOS REAIS. Use exclusivamente o catálogo FICTÍCIO fornecido. Nunca diga que há ingressos, reserva, disponibilidade ou datas reais; explique que as experiências são ilustrativas quando recomendar. Não invente local, preço ou horário. Se a pessoa pedir um lugar/evento real, explique a limitação do piloto.
Quando já houver contexto suficiente, recomende até três IDs do catálogo, apenas se atendem ao orçamento máximo explicitado e priorizando disponibilidade, interesse e bairro. Se nenhuma opção for compatível, seja transparente, peça para ajustar um critério e deixe recommendations vazio. Para cada recomendação explique de forma específica por que faz sentido; não invente preferências. Não assuma que o visitante é Isabella ou conhece a equipe.
Responda em JSON: reply uma mensagem conversacional breve, recommendations uma lista de objetos {id,why}. Quando fizer apenas uma pergunta, retorne recommendations vazia. Catálogo: ${JSON.stringify(catalog)}. Preferências do perfil: ${JSON.stringify(profile)}.`;
 try{
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",instructions,input:messages,text:{format:{type:"json_schema",name:"cultural_guide",strict:true,schema}},max_output_tokens:650,store:false})});
  const r=await response.json().catch(()=>({}));
  if(!response.ok){console.error("IA upstream",response.status,r.error?.code||r.error?.type||"");return json({error:response.status===429?"Limite de uso da IA atingido. Tente novamente depois.":"Não foi possível consultar a IA neste momento."},502)}
  const text=r.output_text||r.output?.flatMap(item=>item.content||[]).filter(c=>c.type==="output_text").map(c=>c.text).join("")||"";
  let answer;try{answer=JSON.parse(text)}catch{return json({error:"Resposta não estruturada da IA"},502)}
  let recommendations=Array.isArray(answer.recommendations)?answer.recommendations.filter(rec=>catalog.some(e=>e.id===rec.id)).slice(0,3):[];
  // Defense in depth: do not show prices above explicit numeric budgets when present in latest user message.
  const latest=messages.at(-1).content.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const match=latest.match(/(?:r\$\s*|ate\s*r?\$?\s*)(\d{1,4})/);
  if(match){const limit=Number(match[1]);recommendations=recommendations.filter(rec=>catalog.find(e=>e.id===rec.id)?.price<=limit)}
  return json({reply:String(answer.reply||"Me conte o que você procura para eu ajudar.").slice(0,900),recommendations:recommendations.map(x=>({id:x.id,why:String(x.why||"").slice(0,250)}))});
 }catch(e){console.error("Falha ao consultar IA",e?.message||"erro");return json({error:"A IA está temporariamente indisponível."},502)}
}
