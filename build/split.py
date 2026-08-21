# -*- coding: utf-8 -*-
"""Split the single-file guide into per-chapter pages + shared cached assets."""
import os, re, shutil
from bs4 import BeautifulSoup

ROOT = '/Users/zhenxiang/Documents/it-roadmap-2026/'
SRC  = ROOT + 'build/source.html'          # frozen copy of the original single page
OUT  = ROOT
ASSETS = ROOT + 'assets/'
os.makedirs(ASSETS, exist_ok=True)

src = open(SRC, encoding='utf-8').read()
soup = BeautifulSoup(src, 'html.parser')

# ---------------------------------------------------------------- extraction
head_styles = soup.head.find_all('style')
body = soup.body
# every <style> in the body, including ones nested inside a section. Nested ones
# were previously carried into the page markup, where they landed after the
# stylesheets and quietly outranked the design system (that is why .play kept
# its own radius and margin). They all belong in the shared sheet.
body_styles = body.find_all('style')
body_scripts = [s for s in body.find_all('script', recursive=False)]

topbar = body.find('div', class_='topbar')
hero   = body.find('div', class_='hero') or body.find('section', class_='hero')
footer = body.find('footer')
totop  = body.find(id='totop')
glow   = body.find(id='glow')

sections = {}
for s in body.find_all('section'):
    if s.get('id'):
        sections[s['id']] = s

# some sections are followed by a body-level sibling that belongs to them
# (the map modal, the atlas modal). Attach each to the section it serves.
extras = {}
cur = None
SKIP = {'script','style','footer'}
for el in body.find_all(recursive=False):
    if el.name == 'section' and el.get('id'):
        cur = el['id']; continue
    if el.name in SKIP: continue
    if el.get('id') in ('glow','totop'): continue          # these go on every page
    if el.name in ('div','button','dialog') and cur:
        extras.setdefault(cur, []).append(str(el))
print('section extras:', {k: len(v) for k, v in extras.items()})

print('head styles:', len(head_styles))
print('body styles:', len(body_styles))
print('body scripts:', len(body_scripts))
print('sections found:', len(sections), sorted(sections))
print('topbar:', bool(topbar), 'hero:', bool(hero), 'footer:', bool(footer), 'totop:', bool(totop), 'glow:', bool(glow))

# ---------------------------------------------------------- shared core.css
css_parts = []
for s in head_styles + body_styles:
    css_parts.append(s.decode_contents())
for st in body_styles:
    st.decompose()
core_css = '\n\n'.join(css_parts)
open(ASSETS + 'core.css', 'w', encoding='utf-8').write(core_css)
print('core.css bytes:', len(core_css))

# ---------------------------------------------------------- shared core.js
# the real script is the big one; the tiny ones (if any) come along in order
js_parts = [s.decode_contents() for s in body_scripts if s.decode_contents().strip()]
core_js = '\n\n'.join(js_parts)

# ---------------------------------------------- multi-page patches to core.js
def patch_js(js):
    n = 0
    # 1. progress widgets live only on the index chapter
    a = """  $('#pbar').style.width = pct + '%';
  $('#ring').setAttribute('stroke-dasharray', pct.toFixed(1) + ' 100');
  var zh = document.body.classList.contains('lang-zh');
  var all = (done === boxes.length && boxes.length);
  $('#progtxt').textContent = zh"""
    b = """  var _pb = $('#pbar'); if (_pb) _pb.style.width = pct + '%';
  var _rg = $('#ring'); if (_rg) _rg.setAttribute('stroke-dasharray', pct.toFixed(1) + ' 100');
  var _pt = $('#progtxt'); if (!_pt) return;
  var zh = document.body.classList.contains('lang-zh');
  var all = (done === boxes.length && boxes.length);
  _pt.textContent = zh"""
    if a in js: js = js.replace(a, b); n += 1

    # 2. the nav is cross-page now — only scrollspy real in-page anchors
    a = """var targets = links.map(function(l){ var el = $(l.getAttribute('href')); return el ? {link:l, el:el} : null }).filter(Boolean);
var totop = $('#totop');
totop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}) });"""
    b = """var targets = links.map(function(l){
  var h = l.getAttribute('href') || '';
  if (h.charAt(0) !== '#') return null;           /* cross-page link, not an anchor */
  var el = $(h); return el ? {link:l, el:el} : null;
}).filter(Boolean);
var totop = $('#totop');
if (totop) totop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}) });"""
    if a in js: js = js.replace(a, b); n += 1

    a = """  var y = window.scrollY + 130, cur = null;
  targets.forEach(function(t){ if (t.el.offsetTop <= y) cur = t });
  links.forEach(function(l){ l.classList.remove('on') });
  if (cur) cur.link.classList.add('on');
  totop.classList.toggle('on', window.scrollY > 900);"""
    b = """  var y = window.scrollY + 130, cur = null;
  if (targets.length){
    targets.forEach(function(t){ if (t.el.offsetTop <= y) cur = t });
    links.forEach(function(l){ l.classList.remove('on') });
    if (cur) cur.link.classList.add('on');
  }
  if (totop) totop.classList.toggle('on', window.scrollY > 900);"""
    if a in js: js = js.replace(a, b); n += 1

    # 3. cursor glow is body-level; keep it optional
    a = """var glow = $('#glow');
window.addEventListener('pointermove', function(e){
  glow.style.setProperty('--mx', e.clientX + 'px');
  glow.style.setProperty('--my', e.clientY + 'px');
}, {passive:true});"""
    b = """var glow = $('#glow');
if (glow) window.addEventListener('pointermove', function(e){
  glow.style.setProperty('--mx', e.clientX + 'px');
  glow.style.setProperty('--my', e.clientY + 'px');
}, {passive:true});"""
    if a in js: js = js.replace(a, b); n += 1
    print('core.js patches applied:', n, 'of 4')

    # 5. isolate each top-level widget: one missing element must not kill the page
    lines = js.split('\n')
    # line 0 is the outer IIFE wrapper and the final })(); closes it — skip both
    first_open = min(i for i, L in enumerate(lines) if L.startswith('(function(){'))
    last_close = max(i for i, L in enumerate(lines) if L.startswith('})();'))
    out, start, wrapped = [], None, 0
    for i, L in enumerate(lines):
        if i == first_open or i == last_close:   # the outer wrapper itself
            out.append(L); continue
        if L.startswith('(function(){') and start is None:
            start = len(out); out.append(L)
        elif L.startswith('})();') and start is not None:
            out.append(L)
            label = ''
            for k in range(max(0, start-3), start):
                m2 = re.search(r'/\* =+ ([^=]+?) =+ \*/', out[k])
                if m2: label = m2.group(1).strip()
            body = out[start:]
            del out[start:]
            out.append('try{')
            out.extend(body)
            out.append('}catch(_e){console.warn("[widget skipped] %s:", _e && _e.message)}' % (label or ('block@'+str(i))))
            wrapped += 1
            start = None
        else:
            out.append(L)
    js = '\n'.join(out)
    print('widgets isolated:', wrapped)
    return js


core_js = patch_js(core_js)

open(ASSETS + 'core.js', 'w', encoding='utf-8').write(core_js)
print('core.js bytes:', len(core_js))

# ------------------------------------------------------------- chapter plan
CH = [
 dict(slug='index',    en='Start',            zh='开始',        secs=['start','howto','months'], vibe='minimalist', hero=True,
      tEn='Start here', tZh='从这里开始'),
 dict(slug='map',      en='The map',          zh='地图',        secs=['map','flow'],             vibe='futuristic',
      tEn='The whole map', tZh='整张地图'),
 dict(slug='words',    en='Words',            zh='词汇',        secs=['words','stack'],          vibe='chill',
      tEn='The words', tZh='那些词'),
 dict(slug='terminal', en='Terminal',         zh='终端',        secs=['cli'],                    vibe='pixel',
      tEn='The terminal', tZh='终端'),
 dict(slug='m1',       en='1 · IT Basics',    zh='1 · IT 基础', secs=['m1'],                     vibe='modern',
      tEn='IT Basics', tZh='IT 基础'),
 dict(slug='m2',       en='2 · Tools',        zh='2 · 工具',    secs=['m2'],                     vibe='gamify',
      tEn='Developer Tools', tZh='开发工具'),
 dict(slug='m3',       en='3 · AI',           zh='3 · AI',      secs=['m3'],                     vibe='ai',
      tEn='AI Fundamentals', tZh='AI 基础'),
 dict(slug='m4',       en='4 · Data',         zh='4 · 数据',    secs=['m4'],                     vibe='natural',
      tEn='Data Engineering', tZh='数据工程'),
 dict(slug='m5',       en='5 · CS & Cloud',   zh='5 · 计算机与云', secs=['m5'],                  vibe='futuristic',
      tEn='CS & Cloud', tZh='计算机原理与云'),
 dict(slug='systems',  en='Big systems',      zh='大系统',      secs=['scale'],                  vibe='gamify',
      tEn='How the big ones work', tZh='大家伙怎么运转'),
 dict(slug='zero',     en='0 and 1',          zh='0 与 1',      secs=['zero'],                   vibe='pixel',
      tEn='It all starts from 0 and 1', tZh='一切从 0 和 1 开始'),
 dict(slug='finish',   en='Finish',           zh='完成',        secs=['finish','made'],          vibe='chill',
      tEn='Month 12 and after', tZh='第 12 个月之后'),
]
for c in CH:
    c['file'] = ('index.html' if c['slug']=='index' else c['slug']+'.html')


def chapter_index_html():
    cards = []
    for i, c in enumerate(CH):
        if c['slug'] == 'index': continue
        cards.append(
          f'<a class="chx" href="{c["file"]}" data-vibe-chip="{c["vibe"]}">'
          f'<span class="chx-n">{i:02d}</span>'
          f'<span class="chx-t"><span class="en">{c["tEn"]}</span><span class="zh">{c["tZh"]}</span></span>'
          f'<span class="chx-v">{c["vibe"]}</span></a>')
    return (
      '<section id="chapters" data-scene="strata">\n<div class="wrap">\n'
      '<div class="sechead"><h2><span class="en">The twelve chapters</span>'
      '<span class="zh">十二个章节</span></h2></div>\n'
      '<p style="color:var(--muted);max-width:66ch"><span class="en">One chapter per page — each with its own '
      'look, its own background and its own sound. Read them in order, or jump.</span>'
      '<span class="zh">一章一页 —— 每一章有自己的样子、自己的背景和自己的声音。可以按顺序读，也可以直接跳。</span></p>\n'
      '<div class="chxgrid">' + '\n'.join(cards) + '</div>\n</div>\n</section>')


# --------------------------------------------------------------- reactions
REACTIONS = [('up','\U0001F44D','Helpful','有用'),
             ('fire','\U0001F525','Love this','太赞了'),
             ('mind','\U0001F92F','Mind blown','震撼'),
             ('lost','\U0001F914','Lost me','没看懂')]

def reactbar(key):
    btns = ''.join(
        f'<button type="button" class="rx" data-emoji="{e}" '
        f'title="{en} / {zh}" aria-label="{en}">'
        f'<span class="rx-g">{g}</span><span class="rx-c">0</span></button>'
        for e, g, en, zh in REACTIONS)
    return (f'<div class="reactbar" data-react-key="{key}">'
            f'<span class="rx-l"><span class="en">Was this bit any good?</span>'
            f'<span class="zh">这一段怎么样？</span></span>'
            f'<span class="rx-btns">{btns}</span></div>')

def add_reactions(section_html, chapter, counter):
    """Attach a reaction bar to every lesson block in this section."""
    frag = BeautifulSoup(section_html, 'html.parser')
    topics = frag.find_all('div', class_='topic')
    if topics:
        for t in topics:
            t.append(BeautifulSoup(reactbar(f'{chapter}/{counter[0]}'), 'html.parser'))
            counter[0] += 1
    else:
        host = frag.find('div', class_='wrap') or frag
        host.append(BeautifulSoup(reactbar(f'{chapter}/{counter[0]}'), 'html.parser'))
        counter[0] += 1
    return str(frag)

# ------------------------------------------------------------------ nav html
def nav_html(current):
    out = []
    for c in CH:
        on = ' class="on"' if c['slug']==current else ''
        out.append(f'<a href="{c["file"]}"{on}><span class="en">{c["en"]}</span><span class="zh">{c["zh"]}</span></a>')
    return '\n      '.join(out)

def chapnav_html(i):
    prev = CH[i-1] if i>0 else None
    nxt  = CH[i+1] if i < len(CH)-1 else None
    parts = ['<nav class="chapnav">']
    if prev:
        parts.append(f'<a class="cn cn-prev" href="{prev["file"]}">'
                     f'<span class="cn-k"><span class="en">Previous</span><span class="zh">上一章</span></span>'
                     f'<span class="cn-t"><span class="en">{prev["tEn"]}</span><span class="zh">{prev["tZh"]}</span></span></a>')
    else:
        parts.append('<span class="cn cn-ghost"></span>')
    if nxt:
        parts.append(f'<a class="cn cn-next" href="{nxt["file"]}">'
                     f'<span class="cn-k"><span class="en">Next</span><span class="zh">下一章</span></span>'
                     f'<span class="cn-t"><span class="en">{nxt["tEn"]}</span><span class="zh">{nxt["tZh"]}</span></span></a>')
    else:
        parts.append('<span class="cn cn-ghost"></span>')
    parts.append('</nav>')
    return '\n    '.join(parts)

# rebuild topbar with cross-page nav, keeping brand + lang switch
topbar_html = str(topbar)
def build_topbar(current):
    t = BeautifulSoup(topbar_html, 'html.parser')
    navel = t.find('nav', class_='navlinks')
    navel.clear()
    navel.append(BeautifulSoup(nav_html(current), 'html.parser'))
    # the wordmark should go home, like every other site on earth
    brand = t.find('div', class_='brand')
    if brand is not None:
        a = t.new_tag('a', href='index.html')
        a['class'] = 'brand'
        a['aria-label'] = 'The Lab Notebook — home'
        for child in list(brand.contents):
            a.append(child.extract())
        brand.replace_with(a)
    # a real menu button for narrow screens; the drawer is built by vibe.js
    btn = BeautifulSoup(
        '<button type="button" class="menubtn" aria-label="Chapters" aria-expanded="false">'
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
        '<path d="M3 6h18M3 12h18M3 18h18"/></svg></button>', 'html.parser')
    wrap = t.find('div', class_='wrap')
    if wrap is not None:
        wrap.append(btn)
    return str(t)

footer_html = str(footer) if footer else ''
totop_html  = (str(totop) if totop else '') + '\n' + (str(glow) if glow else '')

# ------------------------------------------------------------- emit pages
SHELL = '''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="A 12-month foundations roadmap for a new Data Engineer. Bilingual, interactive, one chapter at a time.">
<link rel="stylesheet" href="assets/core.css">
<link rel="stylesheet" href="assets/themes.css">
<script>/* set theme + language before first paint, no flash */
(function(){{try{{
 var t=localStorage.getItem('labnotebook-theme');
 if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t);
 var l=localStorage.getItem('labnotebook-lang')||'en';
 document.documentElement.setAttribute('data-lang',l);
}}catch(e){{}}}})();</script>
</head>
<body class="lang-{lang}" data-vibe="{vibe}" data-chapter="{slug}">
{topbar}
{hero}
{sections}
    {chapnav}
{footer}
{totop}
<script src="assets/core.js"></script>
<script src="assets/vibe.js"></script>
</body>
</html>
'''

written = []
for i, c in enumerate(CH):
    rcount = [0]
    secs_html = '\n'.join(
        add_reactions(str(sections[s]), c['slug'], rcount)
        + ''.join('\n' + x for x in extras.get(s, []))
        for s in c['secs'] if s in sections)
    missing = [s for s in c['secs'] if s not in sections]
    if missing:
        print('  !! missing sections for', c['slug'], missing)
    if c['slug'] == 'index':
        secs_html += '\n' + chapter_index_html()
    page = SHELL.format(
        lang='en',
        title=(('The Lab Notebook · 实验记录本' if c['slug']=='index'
                else c['tEn'] + ' · The Lab Notebook')),
        vibe=c['vibe'], slug=c['slug'],
        topbar=build_topbar(c['slug']),
        hero=(str(hero) if c.get('hero') and hero else ''),
        sections=secs_html,
        chapnav=chapnav_html(i),
        footer=footer_html,
        totop=totop_html,
    )
    open(OUT + c['file'], 'w', encoding='utf-8').write(page)
    written.append((c['file'], len(page), c['vibe']))

print('\n=== pages written ===')
for f, n, v in written:
    print(f'  {f:<16} {n/1024:>8.1f} KB   vibe={v}')
print('total page bytes:', sum(n for _,n,_ in written))
