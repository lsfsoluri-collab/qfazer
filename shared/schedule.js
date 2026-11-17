// Lembretes com tentativa em até 5 minutos após (início da sessão - 24h).
// Core determinístico: não consome banco ou serviço quando não há lembrete vencendo.
export const MINUTE = 60_000;
export const DAY = 86_400_000;
export const MAX_ATTEMPT_DELAY = 5 * MINUTE;
export function reminderAt(utcStart){const start=Date.parse(utcStart);return Number.isFinite(start)?start-DAY:null;}
export function dueWithinWindow(start,now,{maxDelay=MAX_ATTEMPT_DELAY}={}){
 const when=reminderAt(start);const current=now instanceof Date?now.getTime():Number(now);
 return when!==null&&Number.isFinite(current)&&current>=when&&current<=when+maxDelay;
}
// Publicar projeção mínima somente com sessões liberadas. Status de reuso controlado no importador.
export function scheduledCandidates(publicSessions,now){return publicSessions.filter(s=>dueWithinWindow(s.inicio_utc,now));}
export function shouldWakeDatabase(publicSessions,now,hasUrgentChange=false){
 return hasUrgentChange||scheduledCandidates(publicSessions,now).length>0;
}
// Chave idempotente: nova sessão/reprogramação gera outra versão, mas o mesmo job não reenvia.
export function jobKey({deviceId,sessionId,type='REMINDER_24H',revision='1',at}){
 if(!deviceId||!sessionId||!at)throw Error('Missing stable job identifiers');
 return `${type}:${encodeURIComponent(deviceId)}:${encodeURIComponent(sessionId)}:${encodeURIComponent(revision)}:${encodeURIComponent(at)}`;
}
