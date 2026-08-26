# -*- coding: utf-8 -*-
"""Rebuild the guide as an iOS-style learning app.

Same content, different shape. A chapter screen shows a title, a short intro,
the thing you can play with, and a list of lessons. The long-form material —
which was 4,000 words on one scroll — moves into sheets that open on tap.
"""
import os, re, copy
from bs4 import BeautifulSoup

ROOT   = '/Users/zhenxiang/Documents/it-roadmap-2026/'
SRC    = ROOT + 'build/source.html'
ASSETS = ROOT + 'assets/'

soup = BeautifulSoup(open(SRC, encoding='utf-8').read(), 'html.parser')
body = soup.body

# ---- shared assets (unchanged pipeline: all CSS/JS out to cached files) ----
styles = body.find_all('style') + soup.head.find_all('style')
core_css = '\n\n'.join(s.decode_contents() for s in styles)
for s in body.find_all('style'):
    s.decompose()
open(ASSETS + 'core.css', 'w', encoding='utf-8').write(core_css)

scripts = [s for s in body.find_all('script', recursive=False) if s.decode_contents().strip()]
core_js = '\n\n'.join(s.decode_contents() for s in scripts)

def patch_js(js):
    """Same multi-page guards as before, plus per-widget isolation."""
    fixes = [
    ("""  $('#pbar').style.width = pct + '%';
  $('#ring').setAttribute('stroke-dasharray', pct.toFixed(1) + ' 100');
  var zh = document.body.classList.contains('lang-zh');
  var all = (done === boxes.length && boxes.length);
  $('#progtxt').textContent = zh""",
     """  var _pb = $('#pbar'); if (_pb) _pb.style.width = pct + '%';
  var _rg = $('#ring'); if (_rg) _rg.setAttribute('stroke-dasharray', pct.toFixed(1) + ' 100');
  var _pt = $('#progtxt'); if (!_pt) return;
  var zh = document.body.classList.contains('lang-zh');
  var all = (done === boxes.length && boxes.length);
  _pt.textContent = zh"""),
    ("""var targets = links.map(function(l){ var el = $(l.getAttribute('href')); return el ? {link:l, el:el} : null }).filter(Boolean);
var totop = $('#totop');
totop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}) });""",
     """var targets = links.map(function(l){
  var h = l.getAttribute('href') || '';
  if (h.charAt(0) !== '#') return null;
  var el = $(h); return el ? {link:l, el:el} : null;
}).filter(Boolean);
var totop = $('#totop');
if (totop) totop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}) });"""),
    ("""  var y = window.scrollY + 130, cur = null;
  targets.forEach(function(t){ if (t.el.offsetTop <= y) cur = t });
  links.forEach(function(l){ l.classList.remove('on') });
  if (cur) cur.link.classList.add('on');
  totop.classList.toggle('on', window.scrollY > 900);""",
     """  var y = window.scrollY + 130, cur = null;
  if (targets.length){
    targets.forEach(function(t){ if (t.el.offsetTop <= y) cur = t });
    links.forEach(function(l){ l.classList.remove('on') });
    if (cur) cur.link.classList.add('on');
  }
  if (totop) totop.classList.toggle('on', window.scrollY > 900);"""),
    ("""var glow = $('#glow');
window.addEventListener('pointermove', function(e){
  glow.style.setProperty('--mx', e.clientX + 'px');
  glow.style.setProperty('--my', e.clientY + 'px');
}, {passive:true});""",
     """var glow = $('#glow');
if (glow) window.addEventListener('pointermove', function(e){
  glow.style.setProperty('--mx', e.clientX + 'px');
  glow.style.setProperty('--my', e.clientY + 'px');
}, {passive:true});"""),
    ]
    n = 0
    for a, b in fixes:
        if a in js: js = js.replace(a, b); n += 1
    lines = js.split('\n')
    first_open = min(i for i, L in enumerate(lines) if L.startswith('(function(){'))
    last_close = max(i for i, L in enumerate(lines) if L.startswith('})();'))
    out, start, wrapped = [], None, 0
    for i, L in enumerate(lines):
        if i == first_open or i == last_close:
            out.append(L); continue
        if L.startswith('(function(){') and start is None:
            start = len(out); out.append(L)
        elif L.startswith('})();') and start is not None:
            out.append(L)
            label = ''
            for k in range(max(0, start-3), start):
                m2 = re.search(r'/\* =+ ([^=]+?) =+ \*/', out[k])
                if m2: label = m2.group(1).strip()
            seg = out[start:]; del out[start:]
            out.append('try{'); out.extend(seg)
            out.append('}catch(_e){console.warn("[widget skipped] %s:", _e && _e.message)}' % (label or 'block'))
            wrapped += 1; start = None
        else:
            out.append(L)
    print('  core.js: %d guards, %d widgets isolated' % (n, wrapped))
    return '\n'.join(out)

open(ASSETS + 'core.js', 'w', encoding='utf-8').write(patch_js(core_js))

# --------------------------------------------------------------- chapters --
CH = [
 dict(slug='index',    tEn='Start here',            tZh='从这里开始', sEn='', sZh='',  secs=['start','howto','months'], vibe='minimalist'),
 dict(slug='map',      tEn='The whole map',         tZh='整张地图', sEn='The entire landscape, one picture', sZh='整个版图，一张图看完',    secs=['map','flow'],             vibe='futuristic'),
 dict(slug='words',    tEn='The words',             tZh='那些词', sEn='Every term, in plain language', sZh='所有术语，大白话解释',      secs=['words','stack'],          vibe='chill'),
 dict(slug='terminal', tEn='The terminal',          tZh='终端', sEn='Typing to a computer, not clicking', sZh='用打字操作电脑，而不是点击',        secs=['cli'],                    vibe='pixel'),
 dict(slug='m1',       tEn='IT Basics',             tZh='IT 基础', sEn='Months 1–3 · The vocabulary phase', sZh='第 1–3 个月 · 打好词汇基础',     secs=['m1'],                     vibe='modern'),
 dict(slug='m2',       tEn='Developer Tools',       tZh='开发工具', sEn='Months 4–5 · Stop rebuilding the bench', sZh='第 4–5 个月 · 别再重造轮子',    secs=['m2'],                     vibe='gamify'),
 dict(slug='m3',       tEn='AI Fundamentals',       tZh='AI 基础', sEn="Months 6–7 · Judge AI, don't just accept", sZh='第 6–7 个月 · 学会判断 AI 的输出',     secs=['m3'],                     vibe='ai'),
 dict(slug='m4',       tEn='Data Engineering',      tZh='数据工程', sEn='Months 8–10 · The actual job', sZh='第 8–10 个月 · 真正的工作内容',    secs=['m4'],                     vibe='natural'),
 dict(slug='m5',       tEn='CS & Cloud',            tZh='计算机与云', sEn='Months 11–12 · Under the abstraction', sZh='第 11–12 个月 · 看穿抽象层',  secs=['m5'],                     vibe='futuristic'),
 dict(slug='systems',  tEn='How the big ones work', tZh='大家伙怎么运转', sEn='Where an app lives once it is live', sZh='应用上线后到底跑在哪里', secs=['scale'],               vibe='gamify'),
 dict(slug='zero',     tEn='It starts at 0 and 1',  tZh='从 0 和 1 开始', sEn='Why all of it is just 0 and 1', sZh='为什么一切都只是 0 和 1', secs=['zero'],                vibe='pixel'),
 dict(slug='finish',   tEn='Month 12 and after',    tZh='第 12 个月之后', sEn="How this site was built, and what's next", sZh='这个网站怎么做的，接下来做什么', secs=['finish','made'],       vibe='chill'),
]
for c in CH:
    c['file'] = 'index.html' if c['slug'] == 'index' else c['slug'] + '.html'

CHEV = ('<svg class="ios-chev" viewBox="0 0 9 15" fill="none" stroke="currentColor" '
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5 7 7.5 1.5 13.5"/></svg>')
BACK = ('<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.2" '
        'stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2.5 10 10 18"/></svg>')

def bi(en, zh):
    return '<span class="en">%s</span><span class="zh">%s</span>' % (en, zh)

def split_lang(el):
    """Pull the EN and ZH halves out of a bilingual heading."""
    if el is None: return ('', '')
    en = el.find('span', class_='en'); zh = el.find('span', class_='zh')
    et = en.get_text(' ', strip=True) if en else el.get_text(' ', strip=True)
    zt = zh.get_text(' ', strip=True) if zh else ''
    return (et, zt)

def strip_lead_num(s):
    return re.sub(r'^\s*\d+\s*', '', s or '').strip()

def title_parts(s):
    """'Frontend fundamentals — HTML, CSS, JavaScript' -> title, subtitle."""
    s = strip_lead_num(s)
    for dash in ('—', '–', ' - '):
        if dash in s:
            a, b = s.split(dash, 1)
            return a.strip(), b.strip()
    return s, ''

# ------------------------------------------------------- content buckets ---
def classify(node):
    """Which part of the learning arc does this block belong to?"""
    cls = set(node.get('class', []))
    if 'mshead' in cls or 'sechead' in cls: return 'head'
    if 'tldr' in cls:                       return 'intro'
    if 'analogy' in cls:                    return 'intro'
    if 'topic' in cls:                      return 'lesson'
    if cls & {'play', 'stage', 'figwrap'}:  return 'try'
    if cls & {'quiz', 'checks', 'chal'}:    return 'check'
    if cls & {'disc', 'reactbar'}:          return 'talk'
    if node.name in ('p', 'ul', 'ol', 'h3', 'h4', 'blockquote'): return 'prose'
    return 'prose'

def rows_from_tldr(tldr):
    """The 'whole milestone in four lines' block becomes a grouped list.

    The source keeps the two languages as parallel <ul class="en"> and
    <ul class="zh">, so pair them index-wise — concatenating produces one row
    per language instead of one row per idea."""
    ul_en = tldr.find('ul', class_='en')
    ul_zh = tldr.find('ul', class_='zh')
    if ul_en is not None:
        en_items = ul_en.find_all('li')
        zh_items = ul_zh.find_all('li') if ul_zh is not None else []
        pairs = [(e.decode_contents(),
                  zh_items[i].decode_contents() if i < len(zh_items) else '')
                 for i, e in enumerate(en_items)]
    else:
        items = tldr.find_all('li') or [x for x in tldr.find_all('p') if x.get_text(strip=True)]
        pairs = []
        for li in items:
            e = li.find('span', class_='en'); z = li.find('span', class_='zh')
            pairs.append((e.decode_contents() if e else li.decode_contents(),
                          z.decode_contents() if z else ''))
    out = []
    for i, (he, hz) in enumerate(pairs, 1):
        out.append(
          '<div class="ios-row" style="cursor:default">'
          '<span class="ios-row-ic">%d</span>'
          '<span class="ios-row-t"><span class="en">%s</span><span class="zh">%s</span></span>'
          '</div>' % (i, he, hz))
    return '\n'.join(out)

def sheet_for_topic(topic, sid, idx):
    """One lesson, as a sheet: the idea, then the detail, then the example."""
    t = copy.copy(topic)
    h3 = t.find(['h3', 'h4'])
    en, zh = split_lang(h3)
    ten, sen = title_parts(en)
    tzh, szh = title_parts(zh)
    if h3: h3.decompose()
    inner = t.decode_contents()
    return (
      '<div class="ios-sheet" id="%s" aria-hidden="true" role="dialog" aria-modal="true">'
      '<div class="ios-sheet-back"></div>'
      '<div class="ios-sheet-card">'
        '<div class="ios-grabber"></div>'
        '<div class="ios-sheet-nav">'
          '<span></span><b>%s</b>'
          '<button type="button" class="ios-sheet-done">Done</button>'
        '</div>'
        '<div class="ios-sheet-body">'
          '<div class="ios-hero"><p class="ios-eyebrow">Lesson %d</p>'
          '<h2 class="ios-title" style="font-size:26px">%s</h2>'
          '%s</div>'
          '%s'
        '</div>'
      '</div></div>'
    ) % (sid, bi(ten, tzh or ten), idx,
         bi(ten, tzh or ten),
         ('<p class="ios-sub">%s</p>' % bi(sen, szh or sen)) if sen else '',
         inner)

def lesson_row(sid, idx, en, zh):
    ten, sen = title_parts(en)
    tzh, szh = title_parts(zh)
    return (
      '<button type="button" class="ios-row" data-sheet="%s">'
      '<span class="ios-row-ic">%d</span>'
      '<span class="ios-row-t">%s%s</span>%s</button>'
    ) % (sid, idx, bi(ten, tzh or ten),
         ('<small>%s</small>' % bi(sen, szh or sen)) if sen else '', CHEV)

def prose_disclosure(chunks, n):
    """Loose prose becomes 'Read more' rows instead of a wall."""
    if not chunks: return ''
    head = chunks[0]
    label_en, label_zh = ('More detail', '更多细节')
    if head.name in ('h3', 'h4'):
        e, z = split_lang(head)
        if e: label_en, label_zh = e, (z or e)
        chunks = chunks[1:]
    if not chunks: return ''
    inner = '\n'.join(str(c) for c in chunks)
    return ('<details class="ios-disc"><summary>%s%s</summary>'
            '<div class="ios-disc-body">%s</div></details>'
            % (bi(label_en, label_zh), CHEV, inner))

SHELL = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f2f2f7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<title>{title}</title>
<link rel="stylesheet" href="assets/core.css">
<link rel="stylesheet" href="assets/ios.css">
<script>(function(){{try{{
 var t=localStorage.getItem('labnotebook-theme');
 if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t);
}}catch(e){{}}}})();</script>
</head>
<body class="ios lang-en" data-chapter="{slug}" data-vibe="{vibe}">
<a class="ios-skip" href="#ios-main">Skip to content</a>
<div class="ios-phone">
  <nav class="ios-nav">
    {back_html}
    <span class="ios-nav-title">{navtitle}</span>
    <button type="button" class="ios-more" aria-label="More" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
    </button>
  </nav>
  <div class="ios-progress"><i></i></div>

  <main id="ios-main" tabindex="-1">
  <header class="ios-hero">
    {eyebrow}
    <h1 class="ios-title">{h1}</h1>
    {sub}
  </header>
{steps}
{groups}
  <div class="ios-continue">
    {continue_btn}
  </div>
  </main>
</div>
{sheets}
<script src="assets/core.js"></script>
<script src="assets/ios.js"></script>
</body>
</html>
'''

def build_chapter(ix, c):
    secs = [soup.find('section', id=s) for s in c['secs']]
    secs = [s for s in secs if s]
    if not secs:
        print('  !! no sections for', c['slug']); return None

    intro, tryb, lessons, check, talk, prose = [], [], [], [], [], []
    eyebrow_en = eyebrow_zh = ''
    lede_html = ''

    for sec in secs:
        host = sec.find('div', class_='ms') or sec.find('div', class_='wrap') or sec
        run = []
        skip_zh = set()
        for node in host.find_all(recursive=False):
            kind = classify(node)
            if kind == 'head':
                sub = node.find(class_='sub')
                if sub is not None and not eyebrow_en:
                    eyebrow_en, eyebrow_zh = split_lang(sub)
                continue
            if kind == 'prose':
                cl = node.get('class', [])
                # the first paragraph is the screen's summary; its ZH twin is the
                # next sibling, so take both and let the lang class pick one
                if node.name == 'p' and not lede_html and node.get_text(strip=True) and 'zh' not in cl:
                    nxt = node.find_next_sibling()
                    zh_html = ''
                    if nxt is not None and nxt.name == 'p' and 'zh' in nxt.get('class', []):
                        zh_html = '<span class="zh">%s</span>' % nxt.decode_contents()
                        skip_zh.add(id(nxt))
                    lede_html = '<span class="en">%s</span>%s' % (node.decode_contents(), zh_html)
                    continue
                if id(node) in skip_zh: continue
                run.append(node); continue
            # a classified block closes any prose run before it
            if run:
                prose.append(prose_disclosure(run, len(prose))); run = []
            if kind == 'intro':  intro.append(node)
            elif kind == 'try':  tryb.append(node)
            elif kind == 'lesson': lessons.append(node)
            elif kind == 'check': check.append(node)
            elif kind == 'talk':  talk.append(node)
        if run:
            prose.append(prose_disclosure(run, len(prose)))

    # Every chapter should open the same way: idea, then something to poke at,
    # then the lessons. In m2-m5 all the playgrounds live inside a lesson, so
    # nothing reached the Try step — promote the first one to chapter level.
    if not tryb:
        for t in lessons:
            found = t.find(class_='play') or t.find(class_='stage')
            if found is not None:
                tryb.append(found.extract())
                break

    # ---- assemble the groups in learning order --------------------------
    groups, steps = [], []
    def step(sid, en, zh):
        steps.append((sid, en, zh))

    g_intro = []
    for node in intro:
        cls = set(node.get('class', []))
        if 'tldr' in cls:
            g_intro.append('<div class="ios-list">%s</div>' % rows_from_tldr(node))
        elif 'analogy' in cls:
            lab = node.find(class_='lab')
            k_en, k_zh = split_lang(lab) if lab else ('The analogy', '类比')
            if lab: lab.decompose()
            g_intro.append('<div class="ios-callout" style="margin-top:12px">'
                           '<span class="k">%s</span>%s</div>' % (bi(k_en, k_zh or k_en), node.decode_contents()))
    if g_intro:
        step('s-intro', 'Start', '开始')
        groups.append('<section class="ios-group" id="s-intro">'
                      '<h2 class="ios-group-h">%s</h2>%s</section>'
                      % (bi('The short version', '一句话版本'), '\n'.join(g_intro)))

    if tryb:
        step('s-try', 'Try', '动手')
        groups.append('<section class="ios-group" id="s-try">'
                      '<h2 class="ios-group-h">%s</h2>'
                      '<p class="ios-group-note">%s</p>'
                      '%s</section>'
                      % (bi('Try it', '动手试试'),
                         bi('Poke at this before you read anything else.', '先动手玩，再读文字。'),
                         '\n'.join('<div class="ios-embed" style="margin-top:10px">%s</div>' % str(n) for n in tryb)))

    sheets = []
    if lessons:
        step('s-learn', 'Lessons', '课程')
        rows = []
        for i, t in enumerate(lessons, 1):
            sid = 'sh-%s-%d' % (c['slug'], i)
            h3 = t.find(['h3', 'h4'])
            en, zh = split_lang(h3)
            rows.append(lesson_row(sid, i, en, zh))
            sheets.append(sheet_for_topic(t, sid, i))
        groups.append('<section class="ios-group" id="s-learn">'
                      '<h2 class="ios-group-h">%s <span data-role="lesson-count"></span></h2>'
                      '<div class="ios-list">%s</div>'
                      '<p class="ios-group-note">%s</p></section>'
                      % (bi('Lessons', '课程'), '\n'.join(rows),
                         bi('Each opens on its own screen. Nothing to scroll past.',
                            '每一课单独一屏，不用一直往下滚。')))

    if prose:
        step('s-read', 'Detail', '细节')
        groups.append('<section class="ios-group" id="s-read">'
                      '<h2 class="ios-group-h">%s</h2>%s</section>'
                      % (bi('If you want the detail', '想看细节的话'), '\n'.join(prose)))

    if check:
        step('s-check', 'Check', '自测')
        groups.append('<section class="ios-group" id="s-check">'
                      '<h2 class="ios-group-h">%s</h2>%s</section>'
                      % (bi('Check yourself', '检查一下'),
                         '\n'.join('<div class="ios-embed" style="margin-top:10px">%s</div>' % str(n) for n in check)))

    if c['slug'] == 'index':
        rows = []
        for j, ch in enumerate(CH):
            if ch['slug'] == 'index': continue
            rows.append(
              '<a class="ios-row" href="%s">'
              '<span class="ios-row-ic">%02d</span>'
              '<span class="ios-row-t">%s<small>%s</small></span>%s</a>'
              % (ch['file'], j, bi(ch['tEn'], ch['tZh']),
                 bi(ch['sEn'], ch['sZh']), CHEV))
        groups.insert(0,
          '<section class="ios-group" id="s-chapters">'
          '<h2 class="ios-group-h">%s</h2><div class="ios-list">%s</div>'
          '<p class="ios-group-note">%s</p></section>'
          % (bi('Chapters', '章节'), '\n'.join(rows),
             bi('Twelve chapters. Read in order, or jump.', '十二章。按顺序读，或者直接跳。')))
        steps.insert(0, ('s-chapters', 'Chapters', '章节'))

    if talk:
        groups.append('<section class="ios-group" id="s-talk">%s</section>'
                      % '\n'.join(str(n) for n in talk))

    steps_html = ''
    if len(steps) > 1:
        steps_html = '  <ol class="ios-steps">%s</ol>' % ''.join(
            '<li data-step="%s"><span class="n">%d</span>%s</li>' % (sid, i, bi(en, zh))
            for i, (sid, en, zh) in enumerate(steps, 1))

    nxt = CH[ix+1] if ix < len(CH)-1 else None
    cont = ('<a class="ios-btn" href="%s">%s</a>' % (nxt['file'], bi('Next: ' + nxt['tEn'], '下一章：' + nxt['tZh']))
            if nxt else '<a class="ios-btn secondary" href="index.html">%s</a>' % bi('Back to the start', '回到开头'))

    back = CH[ix-1] if ix > 0 else None
    # the home screen is the root of the stack — nothing to go back to
    back_html = ('<a class="ios-back" href="%s">%s<span>%s</span></a>'
                 % (back['file'], BACK, back['tEn'])) if back else '<span></span>'
    return SHELL.format(
        title=(c['tEn'] + ' · The Lab Notebook') if c['slug'] != 'index' else 'The Lab Notebook · 实验记录本',
        slug=c['slug'], vibe=c['vibe'],
        back_html=back_html,
        navtitle=c['tEn'],
        eyebrow=('<p class="ios-eyebrow">%s</p>' % bi(eyebrow_en, eyebrow_zh or eyebrow_en)) if eyebrow_en else '',
        h1=bi(c['tEn'], c['tZh']),
        sub=('<p class="ios-sub">%s</p>' % lede_html) if lede_html else '',
        steps=steps_html,
        groups='\n'.join(groups),
        continue_btn=cont,
        sheets='\n'.join(sheets),
    )


def fix_heading_levels(html):
    """Keep the heading outline contiguous.

    The shell owns h1 (page title) and h2 (section headings); the imported
    lesson content brings its own h4/h5, so the outline jumped h2 -> h4 and
    h2 -> h5. Screen-reader users navigating by heading read those jumps as a
    missing level. Walk the document in order and clamp each heading to at
    most one deeper than the one before it, preserving relative nesting.
    """
    import re as _re
    heads = list(_re.finditer(r'<(/?)h([1-6])\b', html))
    if not heads:
        return html
    out, last_end, prev = [], 0, 0
    remap = {}          # original level -> emitted level, per open element
    stack = []
    for m in heads:
        closing, lvl = m.group(1) == '/', int(m.group(2))
        if closing:
            new = stack.pop() if stack else lvl
        else:
            new = min(lvl, prev + 1) if prev else lvl
            new = max(1, new)
            stack.append(new)
            prev = new
        out.append(html[last_end:m.start()])
        out.append('<%sh%d' % ('/' if closing else '', new))
        last_end = m.end()
    out.append(html[last_end:])
    return ''.join(out)

print('building iOS chapters...')
written = []
for ix, c in enumerate(CH):
    page = build_chapter(ix, c)
    if not page: continue
    page = fix_heading_levels(page)
    open(ROOT + c['file'], 'w', encoding='utf-8').write(page)
    written.append((c['file'], len(page), c['vibe']))

print('\n=== pages ===')
for f, n, v in written:
    print('  %-16s %7.1f KB  vibe=%s' % (f, n/1024, v))
