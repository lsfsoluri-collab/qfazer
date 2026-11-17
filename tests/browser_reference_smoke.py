"""Smoke QA real localhost for Qfazer reference UI (not a public deployment)."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright
import json, os

import base64
ROOT=Path(__file__).resolve().parents[1]/'p2'
CATALOG=os.environ.get('QFAZER_INTERNAL_CATALOG')
if not CATALOG or not Path(CATALOG).exists(): raise SystemExit('Configure QFAZER_INTERNAL_CATALOG com arquivo privado de homologação; o JSON não deve ser publicado.')
html=(ROOT/'index.html').read_text();css=(ROOT/'app.css').read_text();catalog=(ROOT/'catalog.js').read_bytes();app=(ROOT/'app.js').read_text();logo=(ROOT/'assets/logo-qfazer.svg').read_bytes();icon=(ROOT/'assets/app-512.svg').read_bytes();
app=app.replace("from './catalog.js'", "from 'data:text/javascript;base64,"+base64.b64encode(catalog).decode()+"'")
app=app.replace("new URLSearchParams(location.search).get('homologacao')==='1'", "true")
html=html.replace('<link rel="stylesheet" href="./app.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="./app.js"></script>','<script type="module">'+app+'</script>')
html=html.replace('./assets/logo-qfazer.svg','data:image/svg+xml;base64,'+base64.b64encode(logo).decode())
html=html.replace('./assets/app-512.svg','data:image/svg+xml;base64,'+base64.b64encode(icon).decode())
html=html.replace('<link rel="preconnect" href="https://fonts.googleapis.com">','').replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>','')
html=html.replace('<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">','')
checks=[]
def record(device,name,condition,detail=''):
    checks.append({'device':device,'test':name,'pass':bool(condition),'detail':str(detail)})
    print(f"{'PASS' if condition else 'FAIL'} {device} {name} {detail}")
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for device, width, height in [('mobile-390',390,844),('tablet-768',768,1024),('desktop-1360',1360,900),('small-320',320,712)]:
    context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,locale='pt-BR')
    page=context.new_page();errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(450)
    record(device,'HTML/JS local injetado',page.locator('#page-inicio').count()==1)
    record(device,'Sem erro de JavaScript',len(errors)==0,'; '.join(errors[:2]))
    record(device,'Quatro abas',page.locator('.nav-mobile button[data-tab]').count()==4 and page.locator('.nav-desktop button[data-tab]').count()==4)
    record(device,'Sem Perfil',page.locator('button[data-tab="perfil"]').count()==0)
    record(device,'Identidade lime',page.locator('html').evaluate('(el)=>getComputedStyle(el).getPropertyValue("--lime").trim()')=='#d7ff46')
    record(device,'Hero com busca',page.locator('#home-form').is_visible())
    record(device,'Categorias 6',page.locator('.categories button').count()==6)
    record(device,'Sem overflow horizontal',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{page.evaluate("document.documentElement.scrollWidth")} vs {width}')
    page.locator('#import-catalog').set_input_files(CATALOG)
    page.wait_for_timeout(400)
    record(device,'Carregamento catálogo real','161 sessões reais elegíveis' in page.locator('#review-status').inner_text(),page.locator('#review-status').inner_text())
    record(device,'3 destaques reais',page.locator('#home-featured .featured-card').count()==3)
    page.locator('#home-featured .featured-card button').first.click()
    record(device,'Ficha de evento',page.locator('#event-modal').evaluate('(e)=>e.open') is True)
    page.locator('#event-modal .close-modal').click()
    page.locator('#home-query').fill('MASP');page.locator('#home-find').click()
    record(device,'Busca do hero navega e filtra',page.locator('#page-buscar').is_visible() and page.locator('#search-list .event-card').count()==17, str(page.locator('#search-list .event-card').count()))
    page.locator('#search-q').fill('');page.locator('#search-form button[type="submit"]').first.click()
    card=page.locator('#search-list .event-card').first
    card.locator('.card-save').click()
    page.locator('.nav-mobile button[data-tab="salvos"]' if width<=650 else '.nav-desktop button[data-tab="salvos"]').click()
    record(device,'Salvos funciona',page.locator('#saved-list .event-card').count()==1)
    page.locator('.nav-mobile button[data-tab="buscar"]' if width<=650 else '.nav-desktop button[data-tab="buscar"]').click()
    page.locator('#search-list .event-card').first.locator('.compare-button').click()
    record(device,'Comparação funciona',page.locator('#compare-tray').is_visible())
    page.locator('.nav-mobile button[data-tab="chat"]' if width<=650 else '.nav-desktop button[data-tab="chat"]').click()
    record(device,'Chat honesto',page.locator('#chat-heading').is_visible() and page.get_by_text('A recomendação conversacional ainda não está ativa.').is_visible())
    page.locator('.nav-mobile button[data-tab="inicio"]' if width<=650 else '.nav-desktop button[data-tab="inicio"]').click()
    page.locator('#home-query').fill('')
    page.screenshot(path=str(ROOT.parent/f'qfazer_p2_ref_{device}.png'),full_page=True)
    record(device,'Sem overflow com eventos',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
    context.close()
  browser.close()

summary={'passed':sum(x['pass'] for x in checks),'failed':sum(not x['pass'] for x in checks),'checks':checks}
(ROOT.parent/'browser_reference_result.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
print('SUMMARY',summary['passed'],summary['failed'])
