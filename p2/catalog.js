import {resolveCategories,resolveTags,categoryLabel,tagLabel} from './taxonomy.js';
// Adaptador de leitura: sessões reais aprovadas, sem alterar o JSON-fonte.
// Nenhuma sessão é publicada automaticamente a partir do lote interno.
export const CATALOG_STATUS = Object.freeze({
  INTERNAL: 'APTO_PARA_PILOTO',
  PUBLIC: 'LIBERADO'
});
export function validUrl(value) {
  if (typeof value !== 'string') return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}
export function normalizeSessions(payload, {internal = false, now = new Date()} = {}) {
  const raw = Array.isArray(payload) ? payload : Array.isArray(payload?.sessoes) ? payload.sessoes : [];
  const unique = new Set();
  const time = now.getTime();
  return raw.filter(session => {
    if (!session || typeof session.session_id !== 'string' || unique.has(session.session_id)) return false;
    if (session.status !== CATALOG_STATUS.INTERNAL) return false;
    if (!internal && session.reuso_publico !== CATALOG_STATUS.PUBLIC) return false;
    if (session.codigo_ibge !== '3550308' && session.codigo_ibge !== 3550308) return false;
    if (!session.titulo || !session.local || !session.categoria || !session.inicio_utc || !validUrl(session.url_oficial)) return false;
    const starts = Date.parse(session.inicio_utc);
    if (!Number.isFinite(starts) || starts <= time) return false;
    unique.add(session.session_id);
    return true;
  }).map(session => ({
    id: session.session_id, title: session.titulo, category: resolveCategories(session)[0],
    categories: resolveCategories(session), tags: resolveTags(session),
    imageUrl: (!internal || session.licenca_imagem === 'LIBERADA') && validUrl(session.imagem_url) ? session.imagem_url : null,
    imageCredit: session.credito_imagem || null,
    description: session.descricao_editorial || '', date: session.data_local,
    startsAt: session.inicio_utc, hour: session.hora_local,
    neighborhood: session.bairro || 'Bairro não informado', place: session.local,
    priceType: session.tipo_preco || '', minCents: Number.isFinite(session.preco_min_centavos) ? session.preco_min_centavos : null,
    url: session.url_oficial, accessUrl: validUrl(session.url_acesso) ? session.url_acesso : session.url_oficial,
    verifiedAt: session.verificado_em || null, internal
  })).sort((a,b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
export function priceLabel(item) {
  if (item.priceType === 'GRATUITO' && item.minCents === 0) return 'Grátis';
  if (item.minCents !== null && item.minCents >= 0) return `A partir de ${new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(item.minCents/100)}`;
  return 'Preço a confirmar';
}
export function sessionMatches(item, filter={}) {
  const q = (filter.query || '').trim().toLocaleLowerCase('pt-BR');
  const categories = Array.isArray(item.categories) ? item.categories : [item.category];
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const content = `${item.title} ${item.place} ${item.neighborhood} ${item.description} ${categories.map(categoryLabel).join(' ')} ${tags.map(tagLabel).join(' ')}`.toLocaleLowerCase('pt-BR');
  if (q && !content.includes(q)) return false;
  if (filter.category && !categories.includes(filter.category)) return false;
  if (filter.neighborhood && filter.neighborhood !== item.neighborhood) return false;
  if (filter.date && filter.date !== item.date) return false;
  if (filter.budget === 'free' && !(item.priceType === 'GRATUITO' && item.minCents === 0)) return false;
  if (filter.budget && filter.budget !== 'free') {
    const max = Number(filter.budget) * 100;
    if (!Number.isFinite(max) || item.minCents === null || item.minCents > max) return false;
  }
  return true;
}
export function compareIds(items, ids) {
  const allowed = new Set(items.map(x=>x.id));
  return [...new Set(ids)].filter(id=>allowed.has(id)).slice(0,3);
}
