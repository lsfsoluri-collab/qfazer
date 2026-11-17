import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('p2/index.html','utf8');
const css=readFileSync('p2/app.css','utf8');
const app=readFileSync('p2/app.js','utf8');

test('navegação visual mobile e desktop preserva quatro destinos, sem Perfil',()=>{
  for(const type of ['nav-desktop','nav-mobile']){
    const block=html.match(new RegExp(`<nav class="${type}"[\\s\\S]*?<\\/nav>`));
    assert.ok(block,`Não existe ${type}`);
    const tabs=[...block[0].matchAll(/data-tab="([^"]+)"/g)].map(x=>x[1]);
    assert.deepEqual(tabs,['inicio','salvos','buscar','chat']);
  }
  assert.doesNotMatch(html,/data-tab="perfil"/i);
});

test('home tem busca, 6 categorias e destaques sem texto fictício',()=>{
  for(const anchor of ['id="home-heading"','id="home-form"','id="home-query"','id="home-featured"','id="home-list"'])assert.ok(html.includes(anchor),anchor);
  assert.equal((html.match(/data-category-shortcut=/g)||[]).length,6);
  assert.ok(app.includes('function featuredCard(item)'));
  assert.ok(app.includes('state.all.slice(0,3)'));
  assert.doesNotMatch(html,/Baile da Rua|Tem sim! Você pode reservar/i);
});

test('cards da referência são estruturados para dados reais, sem imagem atribuída incorretamente',()=>{
  assert.ok(app.includes('function visualBand(item)'));
  assert.ok(app.includes("node('h3','event-title',item.title)"));
  assert.ok(app.includes("priceLabel(item)"));
  assert.ok(app.includes("button('',`card-save"));
  assert.ok(app.includes("showDetail(item)"));
  assert.ok(app.includes('function toggleCompare(id)'));
});

test('design tokens e layout responsivo referenciam pranchas mobile/desktop',()=>{
  for(const color of ['#0b0b0b','#f7f5ee','#d7ff46'])assert.ok(css.includes(color),color);
  assert.ok(css.includes('@media(max-width:650px)'));
  assert.ok(css.includes('@media(max-width:1050px)'));
  for(const cls of ['.hero-search','.categories','.featured-grid','.event-card','.nav-mobile','.nav-desktop','.chat-window','.filter-topline'])assert.ok(css.includes(cls),cls);
});

test('Chat indisponível não simula recomendação nem venda interna',()=>{
  assert.ok(html.includes('IA em implantação'));
  assert.ok(html.includes('A recomendação conversacional ainda não está ativa'));
  assert.doesNotMatch(html,/reserva(r| direta) direto pelo app/i);
  assert.ok(html.includes('Ingressos e reservas somente nos canais oficiais'));
});
