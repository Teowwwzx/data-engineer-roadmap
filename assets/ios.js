/* ============================================================================
   iOS interaction layer: sheets, the collapsing title, the step rail, and the
   overflow menu that keeps the rarely-used controls off the bar.
   ========================================================================= */
(function(){
"use strict";
var $  = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var body = document.body;
var CHAP = body.getAttribute('data-chapter') || 'index';

/* --------------------------------------------------- title + progress line */
(function(){
  var nav = $('.ios-nav'), title = $('.ios-title'), bar = $('.ios-progress > i');
  if (!nav) return;
  var ticking = false;
  function onScroll(){
    ticking = false;
    if (title){
      var gone = title.getBoundingClientRect().bottom < 44;
      nav.classList.toggle('scrolled', gone);
    }
    if (bar){
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (scrollY / h) * 100) : 0) + '%';
    }
  }
  addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(onScroll) }
  }, {passive:true});
  onScroll();
})();

/* ---------------------------------------------------------- the step rail */
(function(){
  var rail = $('.ios-steps'); if (!rail) return;
  var items = $$('li', rail);
  var targets = items.map(function(li){ return $('#' + li.dataset.step) }).filter(Boolean);
  if (!targets.length) return;
  var pending = false;
  function sync(){
    pending = false;
    var line = innerHeight * 0.35, cur = 0;
    targets.forEach(function(t, i){
      if (t.getBoundingClientRect().top <= line) cur = i;
    });
    items.forEach(function(li, i){
      li.classList.toggle('here', i === cur);
      li.classList.toggle('done', i < cur);
    });
    var into = items[cur];
    if (into && rail.scrollWidth > rail.clientWidth){
      var r = into.getBoundingClientRect(), rr = rail.getBoundingClientRect();
      if (r.left < rr.left + 8 || r.right > rr.right - 8)
        rail.scrollTo({left: into.offsetLeft - 16, behavior:'smooth'});
    }
  }
  addEventListener('scroll', function(){
    if (!pending){ pending = true; requestAnimationFrame(sync) }
  }, {passive:true});
  rail.addEventListener('click', function(e){
    var li = e.target.closest('li'); if (!li) return;
    var t = $('#' + li.dataset.step);
    if (t) t.scrollIntoView({behavior:'smooth', block:'start'});
  });
  sync();
})();

/* -------------------------------------------------------------- the sheets */
(function(){
  var openSheet = null, lastFocus = null, scrollLock = 0;
  function open(id){
    var sh = document.getElementById(id); if (!sh) return;
    lastFocus = document.activeElement;
    scrollLock = scrollY;
    body.style.position = 'fixed';
    body.style.top = (-scrollLock) + 'px';
    body.style.width = '100%';
    sh.classList.add('on');
    sh.setAttribute('aria-hidden','false');
    openSheet = sh;
    /* core.js reveals content with an IntersectionObserver, which never fires
       for a sheet that was hidden at load — so the body would open blank.
       Reveal it here, and start any animation stages. */
    $$('.reveal', sh).forEach(function(el){ el.classList.add('in') });
    $$('.stage', sh).forEach(function(el){ el.classList.add('run') });
    var b = $('.ios-sheet-body', sh); if (b) b.scrollTop = 0;
    var done = $('.ios-sheet-done', sh); if (done) done.focus();
    /* mark the lesson as visited */
    var row = $('[data-sheet="' + id + '"]');
    if (row){
      row.classList.add('done');
      try {
        var seen = JSON.parse(localStorage.getItem('labnotebook-seen') || '{}');
        (seen[CHAP] = seen[CHAP] || {})[id] = 1;
        localStorage.setItem('labnotebook-seen', JSON.stringify(seen));
      } catch(e){}
      countProgress();
    }
  }
  function close(){
    if (!openSheet) return;
    openSheet.classList.remove('on');
    openSheet.setAttribute('aria-hidden','true');
    openSheet = null;
    body.style.position = ''; body.style.top = ''; body.style.width = '';
    scrollTo(0, scrollLock);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function(e){
    var opener = e.target.closest('[data-sheet]');
    if (opener){ e.preventDefault(); open(opener.dataset.sheet); return }
    if (e.target.closest('.ios-sheet-done') || e.target.closest('.ios-sheet-back')) close();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && openSheet) close();
  });
  /* drag the grabber down to dismiss, like the real thing */
  $$('.ios-sheet').forEach(function(sh){
    var card = $('.ios-sheet-card', sh), grab = $('.ios-grabber', sh);
    if (!card || !grab) return;
    var y0 = null;
    function start(e){ y0 = (e.touches ? e.touches[0].clientY : e.clientY); card.style.transition = 'none' }
    function move(e){
      if (y0 === null) return;
      var dy = (e.touches ? e.touches[0].clientY : e.clientY) - y0;
      if (dy > 0) card.style.transform = 'translateY(' + dy + 'px)';
    }
    function end(e){
      if (y0 === null) return;
      var dy = ((e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - y0);
      card.style.transition = ''; card.style.transform = '';
      y0 = null;
      if (dy > 110) close();
    }
    grab.addEventListener('touchstart', start, {passive:true});
    grab.addEventListener('touchmove', move, {passive:true});
    grab.addEventListener('touchend', end);
    grab.addEventListener('mousedown', function(e){ start(e);
      var mm = function(ev){ move(ev) }, mu = function(ev){ end(ev);
        removeEventListener('mousemove', mm); removeEventListener('mouseup', mu) };
      addEventListener('mousemove', mm); addEventListener('mouseup', mu);
    });
  });

  /* restore which lessons have been opened before */
  function restore(){
    var seen = {};
    try { seen = (JSON.parse(localStorage.getItem('labnotebook-seen') || '{}')[CHAP]) || {} } catch(e){}
    $$('[data-sheet]').forEach(function(r){ if (seen[r.dataset.sheet]) r.classList.add('done') });
    countProgress();
  }
  function countProgress(){
    var rows = $$('.ios-row[data-sheet]');
    if (!rows.length) return;
    var done = rows.filter(function(r){ return r.classList.contains('done') }).length;
    var el = $('[data-role="lesson-count"]');
    if (el) el.textContent = done + '/' + rows.length;
  }
  restore();
})();

/* ------------------------------------------------------ the overflow menu --
   Theme, language, sound and motion are set once and then never touched, so
   they do not belong on the bar.                                            */
(function(){
  var btn = $('.ios-more'); if (!btn) return;
  var menu = document.createElement('div');
  menu.className = 'ios-menu';
  menu.setAttribute('role','menu');
  var LANG_KEY='labnotebook-lang', THEME_KEY='labnotebook-theme',
      SOUND_KEY='labnotebook-sound', MOTION_KEY='labnotebook-motion';
  function get(k,d){ try { return localStorage.getItem(k) || d } catch(e){ return d } }
  function set(k,v){ try { localStorage.setItem(k,v) } catch(e){} }
  function applyTheme(v, persist){
    if (persist) set(THEME_KEY, v);
    if (v === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', v);
    // keep the browser chrome in step with an explicit choice
    var dark = v === 'dark' || (v === 'auto' &&
      window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches);
    var mt = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!mt){ mt = document.createElement('meta'); mt.name = 'theme-color'; document.head.appendChild(mt); }
    mt.setAttribute('content', dark ? '#000000' : '#f2f2f7');
  }
  var IC = {
    lang:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
    theme:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 4v16" /></svg>',
    sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/></svg>',
    motion:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12h3l2-6 4 12 3-8 2 2h4"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'
  };
  function label(){
    var lang = get(LANG_KEY,'en') === 'zh' ? '中文' : 'English';
    var th = get(THEME_KEY,'auto');
    return {lang:lang, themeRaw: th, theme: th.charAt(0).toUpperCase()+th.slice(1),
            sound: get(SOUND_KEY,'off') === 'on' ? 'On' : 'Off',
            motion: get(MOTION_KEY,'on') === 'off' ? 'Off' : 'On'};
  }
  function render(){
    var L = label();
    menu.innerHTML =
      '<a class="ios-menu-row" href="index.html">'+IC.list+'All chapters</a>' +
      '<button class="ios-menu-row" data-act="lang">'+IC.lang+'Language<span class="v">'+L.lang+'</span></button>' +
      '<div class="ios-menu-seg-wrap">' +
        '<span class="ios-menu-seg-lab">'+IC.theme+'Appearance</span>' +
        '<div class="ios-seg" role="group" aria-label="Appearance">' +
          ['auto','light','dark'].map(function(v){
            return '<button type="button" class="ios-seg-b'+(L.themeRaw===v?' on':'')+
                   '" data-theme-set="'+v+'" aria-pressed="'+(L.themeRaw===v)+'">'+
                   v.charAt(0).toUpperCase()+v.slice(1)+'</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<button class="ios-menu-row" data-act="motion">'+IC.motion+'Motion<span class="v">'+L.motion+'</span></button>' +
      '<button class="ios-menu-row" data-act="sound">'+IC.sound+'Sound<span class="v">'+L.sound+'</span></button>';
  }
  render();
  document.body.appendChild(menu);
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    render();
    menu.classList.toggle('on');
    btn.setAttribute('aria-expanded', menu.classList.contains('on') ? 'true' : 'false');
  });
  document.addEventListener('click', function(e){
    if (menu.classList.contains('on') && !menu.contains(e.target)) menu.classList.remove('on');
  });
  menu.addEventListener('click', function(e){
    var seg = e.target.closest('[data-theme-set]');
    if (seg){
      e.stopPropagation();
      applyTheme(seg.getAttribute('data-theme-set'), true);
      render();
      return;
    }
    var row = e.target.closest('[data-act]'); if (!row) return;
    var act = row.dataset.act;
    if (act === 'lang'){
      var next = get(LANG_KEY,'en') === 'zh' ? 'en' : 'zh';
      set(LANG_KEY, next);
      body.className = body.className.replace(/lang-\w+/, 'lang-' + next);
      document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    }

    if (act === 'sound'){
      var s = get(SOUND_KEY,'off') === 'on' ? 'off' : 'on';
      set(SOUND_KEY, s);
      if (window.__labSound) window.__labSound(s === 'on');
    }
    if (act === 'motion'){
      var m = get(MOTION_KEY,'on') === 'off' ? 'on' : 'off';
      set(MOTION_KEY, m);
      if (window.__labMotion) window.__labMotion(m === 'on');
    }
    render();
  });
  /* apply the saved language on load */
  if (get(LANG_KEY,'en') === 'zh'){
    body.className = body.className.replace(/lang-\w+/, 'lang-zh');
    document.documentElement.lang = 'zh-CN';
  }
})();
})();
