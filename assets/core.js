
(function(){
"use strict";
var $  = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var bi = function(en,zh){return '<span class="en">'+en+'</span><span class="zh">'+zh+'</span>'};

/* ---------------- language ---------------- */
$$('.langsw button').forEach(function(b){
  b.addEventListener('click', function(){
    var L = b.dataset.lang;
    document.body.className = 'lang-' + L;
    document.documentElement.lang = (L === 'zh' ? 'zh-CN' : 'en');
    $$('.langsw button').forEach(function(x){x.classList.toggle('on', x === b)});
    updateProgress();
  });
});

/* ---------------- lens tabs ---------------- */
$$('.lens').forEach(function(lens){
  var btns  = $$('.lens-tabs button', lens);
  var panes = $$('.lens-pane', lens);
  btns.forEach(function(b,i){
    b.addEventListener('click', function(){
      btns.forEach(function(x){x.classList.remove('on')});
      panes.forEach(function(p){p.classList.remove('on')});
      b.classList.add('on');
      if (panes[i]) panes[i].classList.add('on');
    });
  });
});

/* ---------------- code tabs ---------------- */
$$('.codewrap').forEach(function(cw){
  var btns  = $$('.tabs button', cw);
  var panes = $$('.pane', cw);
  btns.forEach(function(b,i){
    b.addEventListener('click', function(){
      btns.forEach(function(x){x.classList.remove('on')});
      panes.forEach(function(p){p.classList.remove('on')});
      b.classList.add('on');
      if (panes[i]) panes[i].classList.add('on');
    });
  });
});

/* ---------------- quizzes ---------------- */
$$('.quiz').forEach(function(q){
  var opts = $$('.opt', q), fb = $('.fb', q);
  opts.forEach(function(o){
    o.addEventListener('click', function(){
      if (o.disabled) return;
      var right = o.dataset.c === '1';
      o.classList.add(right ? 'right' : 'wrong');
      if (!right) opts.forEach(function(x){ if (x.dataset.c === '1') x.classList.add('right') });
      opts.forEach(function(x){ x.disabled = true });
      fb.classList.add('show');
    });
  });
});

/* ---------------- progress ---------------- */
var boxes = $$('.chk input[type=checkbox]');
function updateProgress(){
  var done = boxes.filter(function(b){return b.checked}).length;
  var pct  = boxes.length ? (done / boxes.length) * 100 : 0;
  var _pb = $('#pbar'); if (_pb) _pb.style.width = pct + '%';
  var _rg = $('#ring'); if (_rg) _rg.setAttribute('stroke-dasharray', pct.toFixed(1) + ' 100');
  var _pt = $('#progtxt'); if (!_pt) return;
  var zh = document.body.classList.contains('lang-zh');
  var all = (done === boxes.length && boxes.length);
  _pt.textContent = zh
    ? (done + ' / ' + boxes.length + ' 项实操任务已完成' + (all ? ' —— 全部做完了，了不起。' : ''))
    : (done + ' of ' + boxes.length + ' lab tasks done' + (all ? ' — all of it. Well done.' : ''));
}
boxes.forEach(function(b){ b.addEventListener('change', updateProgress) });
updateProgress();

/* ---------------- animations + reveal ---------------- */
var stages = $$('.stage[data-anim]');
$$('.topic, .rw, .play, .quiz, .checks, .lens, .stage, .tlrow, .mini, .philo').forEach(function(el){ el.classList.add('reveal') });
if ('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); if (e.target.dataset.anim !== undefined) e.target.classList.add('run'); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  $$('.reveal').forEach(function(el){ io.observe(el) });
} else {
  $$('.reveal').forEach(function(el){ el.classList.add('in') });
  stages.forEach(function(s){ s.classList.add('run') });
}
$$('.replay').forEach(function(btn){
  btn.addEventListener('click', function(){
    var st = btn.closest('.stage');
    st.classList.remove('run'); void st.offsetWidth; st.classList.add('run');
  });
});

/* ---------------- nav + back to top + glow ---------------- */
var links = $$('.navlinks a');
var targets = links.map(function(l){
  var h = l.getAttribute('href') || '';
  if (h.charAt(0) !== '#') return null;           /* cross-page link, not an anchor */
  var el = $(h); return el ? {link:l, el:el} : null;
}).filter(Boolean);
var totop = $('#totop');
if (totop) totop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}) });
window.addEventListener('scroll', function(){
  var y = window.scrollY + 130, cur = null;
  if (targets.length){
    targets.forEach(function(t){ if (t.el.offsetTop <= y) cur = t });
    links.forEach(function(l){ l.classList.remove('on') });
    if (cur) cur.link.classList.add('on');
  }
  if (totop) totop.classList.toggle('on', window.scrollY > 900);
}, {passive:true});
var glow = $('#glow');
if (glow) window.addEventListener('pointermove', function(e){
  glow.style.setProperty('--mx', e.clientX + 'px');
  glow.style.setProperty('--my', e.clientY + 'px');
}, {passive:true});

/* ================= PLAYGROUND 1 · live sandbox ================= */
try{
(function(){
  var code = $('#sb-code'), out = $('#sb-out');
  if (!code) return;
  var presets = [
"<h1>Sample QC Dashboard</h1>\n<p id=\"count\">0 samples passed</p>\n<button id=\"btn\">Run check</button>",
"<style>\n  body { font-family: sans-serif; padding: 16px; }\n  h1   { color: #0d9488; font-size: 20px; }\n  #btn { padding: 9px 16px; border-radius: 8px;\n         border: 0; background: #0d9488; color: #fff;\n         cursor: pointer; }\n</style>\n\n<h1>Sample QC Dashboard</h1>\n<p id=\"count\">0 samples passed</p>\n<button id=\"btn\">Run check</button>",
"<style>\n  body { font-family: sans-serif; padding: 16px; }\n  h1   { color: #0d9488; font-size: 20px; }\n  #btn { padding: 9px 16px; border-radius: 8px; border: 0;\n         background: #0d9488; color: #fff; cursor: pointer; }\n</style>\n\n<h1>Sample QC Dashboard</h1>\n<p id=\"count\">0 samples passed</p>\n<button id=\"btn\">Run check</button>\n\n<script>\n  let passed = 0;\n  document.getElementById('btn').onclick = () => {\n    passed++;\n    document.getElementById('count').textContent =\n      passed + ' samples passed';\n  };\n<\/script>",
"<style>\n  body  { font-family: sans-serif; padding: 16px; }\n  .row  { display:flex; gap:10px; padding:7px 0;\n          border-bottom:1px solid #eee; }\n  .ok   { color:#059669; font-weight:700; }\n  .bad  { color:#dc2626; font-weight:700; }\n<\/style>\n\n<h3>Samples<\/h3>\n<div id=\"list\"><\/div>\n\n<script>\n  // Data in, HTML out. This is what a frontend really does.\n  const samples = [\n    { id:'S-001', purity:0.98 },\n    { id:'S-002', purity:0.91 },\n    { id:'S-003', purity:0.99 },\n  ];\n\n  document.getElementById('list').innerHTML = samples.map(s =>\n    `<div class=\"row\">\n       <b>${s.id}<\/b>\n       <span>${s.purity}<\/span>\n       <span class=\"${s.purity >= 0.95 ? 'ok' : 'bad'}\">\n         ${s.purity >= 0.95 ? 'PASS' : 'FAIL'}\n       <\/span>\n     <\/div>`).join('');\n<\/script>"
  ];
  var t;
  function render(){ clearTimeout(t); t = setTimeout(function(){ out.srcdoc = code.value }, 250); }
  code.addEventListener('input', render);
  $$('[data-preset]').forEach(function(b){
    b.addEventListener('click', function(){
      $$('[data-preset]').forEach(function(x){x.classList.remove('active')});
      b.classList.add('active');
      code.value = presets[+b.dataset.preset];
      render();
    });
  });
  code.value = presets[0]; out.srcdoc = presets[0];
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 1 · live sandbox:", _e && _e.message)}

/* ================= PLAYGROUND 2 · SQL builder ================= */
try{
(function(){
  var txt = $('#sql-text'); if (!txt) return;
  var res = $('#sql-result'), note = $('#sql-note');
  var st = {join:'inner', where:false, group:false, order:false, limit:false};
  var patients = [
    {id:'P-01', name:'Aisha Rahman', city:'Ipoh'},
    {id:'P-02', name:'Wei Ling',     city:'Penang'},
    {id:'P-03', name:'Kumar S.',     city:'Ipoh'}
  ];
  var tests = [
    {pid:'P-01', t:'Glucose', v:5.4},
    {pid:'P-02', t:'Glucose', v:6.9},
    {pid:'P-01', t:'HbA1c',   v:5.1}
  ];
  function run(){
    var rows = [];
    patients.forEach(function(p){
      var m = tests.filter(function(t){return t.pid === p.id});
      if (m.length) m.forEach(function(t){ rows.push({name:p.name, city:p.city, test:t.t, value:t.v}) });
      else if (st.join === 'left') rows.push({name:p.name, city:p.city, test:null, value:null});
    });
    if (st.where) rows = rows.filter(function(r){return r.city === 'Ipoh'});
    var cols, out;
    if (st.group){
      var g = {};
      rows.forEach(function(r){ (g[r.city] = g[r.city] || []).push(r) });
      out = Object.keys(g).map(function(c){
        var vals = g[c].filter(function(r){return r.value !== null});
        var avg = vals.length ? (vals.reduce(function(a,r){return a + r.value}, 0) / vals.length) : null;
        return {city:c, n_tests:vals.length, avg_value: avg === null ? null : Math.round(avg*100)/100};
      });
      cols = ['city','n_tests','avg_value'];
      if (st.order) out.sort(function(a,b){return (b.avg_value||0) - (a.avg_value||0)});
    } else {
      out = rows; cols = ['name','city','test','value'];
      if (st.order) out = out.slice().sort(function(a,b){return (b.value||0) - (a.value||0)});
    }
    if (st.limit) out = out.slice(0,2);

    /* SQL text */
    var K = function(s){return '<span class="kw">'+s+'</span>'};
    var C = function(s){return '<span class="cm">'+s+'</span>'};
    var s = '';
    s += K('SELECT') + (st.group ? ' p.city, COUNT(*) AS n_tests, ROUND(AVG(t.value),2) AS avg_value'
                                 : ' p.name, p.city, t.test_name, t.value') + '\n';
    s += K('FROM') + ' patients ' + K('AS') + ' p\n';
    s += K(st.join === 'left' ? 'LEFT JOIN' : 'JOIN') + ' tests ' + K('AS') + ' t ' + K('ON') + ' t.patient_id = p.patient_id\n';
    if (st.where) s += K('WHERE') + " p.city = <span class=\"st\">'Ipoh'</span>\n";
    if (st.group) s += K('GROUP BY') + ' p.city\n';
    if (st.order) s += K('ORDER BY') + (st.group ? ' avg_value ' : ' t.value ') + K('DESC') + '\n';
    if (st.limit) s += K('LIMIT') + ' <span class="nu">2</span>\n';
    txt.innerHTML = s.trim() + ';';

    /* result table */
    var h = '<table class="tbl"><tr>' + cols.map(function(c){return '<th>'+c+'</th>'}).join('') + '</tr>';
    if (!out.length) h += '<tr><td colspan="'+cols.length+'" style="color:var(--muted)">' + bi('0 rows','0 行') + '</td></tr>';
    out.forEach(function(r){
      h += '<tr>' + cols.map(function(c){
        var v = r[c];
        return '<td>' + (v === null || v === undefined
          ? '<span style="color:var(--no)">NULL</span>' : v) + '</td>';
      }).join('') + '</tr>';
    });
    h += '</table>';
    res.innerHTML = h;

    /* note */
    var n = '';
    if (st.join === 'left') n = bi("LEFT JOIN keeps Kumar S. even though he has no tests — his test columns come back NULL. An INNER JOIN would silently delete him. That silent deletion is one of the most common causes of “why are rows missing?”",
      "LEFT JOIN 保留了没有任何检测记录的 Kumar S.——他的检测列返回 NULL。INNER JOIN 会悄悄把他删掉。这种无声的删除，是「为什么少了行？」最常见的原因之一。");
    else if (st.group && st.where) n = bi("Notice the execution order: WHERE runs before GROUP BY, so you are averaging only the rows that survived the filter.",
      "注意执行顺序：WHERE 在 GROUP BY 之前跑，所以你求的是「通过筛选之后剩下的行」的平均值。");
    else if (st.group) n = bi("GROUP BY collapses many rows into one per city. The individual test rows still exist in the table — they are just not what you asked for.",
      "GROUP BY 把很多行压成每个城市一行。原始的检测行仍然存在于表里，只是不是你这次要的东西。");
    else if (st.limit) n = bi("LIMIT runs last — after sorting. Without ORDER BY, “the first 2 rows” is whatever the database felt like returning, and it can change between runs.",
      "LIMIT 最后执行——在排序之后。没有 ORDER BY 的话，「前 2 行」是数据库随手返回的，两次运行结果可能不同。");
    else n = bi("Aisha appears twice because she has two tests. Her name is still stored only once, in the patients table.",
      "Aisha 出现了两次，因为她有两条检测记录。但她的名字在 patients 表里仍然只存了一份。");
    note.innerHTML = n;
  }
  $$('[data-sql]').forEach(function(b){
    b.addEventListener('click', function(){
      var k = b.dataset.sql;
      if (k === 'join'){
        st.join = b.dataset.val;
        $$('[data-sql=join]').forEach(function(x){x.classList.toggle('active', x === b)});
      } else {
        st[k] = !st[k];
        b.classList.toggle('active', st[k]);
      }
      run();
    });
  });
  run();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 2 · SQL builder:", _e && _e.message)}

/* ================= PLAYGROUND 3 · HTTP simulator ================= */
try{
(function(){
  var reqEl = $('#http-req'); if (!reqEl) return;
  var resEl = $('#http-res'), note = $('#http-note');
  var st = {method:'GET', path:'/api/samples/S-001', auth:'valid'};
  var broken = false, flooded = false;
  function paint(){
    var K = function(s){return '<span class="fn">'+s+'</span>'};
    var r = '';
    r += '<span class="kw">' + st.method + '</span> ' + st.path + ' HTTP/1.1\n';
    r += K('Host') + ': lab.example.com\n';
    if (st.auth === 'valid')    r += K('Authorization') + ': <span class="st">Bearer rw_a1b2c3</span>\n';
    if (st.auth === 'readonly') r += K('Authorization') + ': <span class="st">Bearer ro_x9y8z7</span>\n';
    if (st.auth === 'none')     r += '<span class="cm">(no Authorization header)</span>\n';
    if (st.method === 'POST')   r += K('Content-Type') + ': application/json\n\n{ "purity": 0.97, "volume_ml": 2.1 }';
    reqEl.innerHTML = r;

    var code, body, n;
    if (broken){
      code = 503; body = '{ "error": "service unavailable" }';
      n = bi("A 5xx is <b>their</b> problem, not yours. Your request was fine. The correct response in code is: do not parse the body as data, retry with exponential backoff, and alert if it keeps failing.",
             "5xx 是<b>对方</b>的问题，不是你的。你的请求没错。代码里正确的做法是：不要把响应体当数据解析，用指数退避重试，持续失败就告警。");
    } else if (flooded){
      code = 429; body = '{ "error": "rate limit exceeded", "retry_after": 30 }';
      n = bi("429 means you are hammering them. Honour <code class=\"inl\">retry_after</code> and back off. A retry loop with no backoff is how a pipeline silently turns itself into a denial-of-service attack.",
             "429 表示你敲得太猛了。遵守 <code class=\"inl\">retry_after</code> 并退避。没有退避的重试循环，就是一条管道悄悄把自己变成拒绝服务攻击的方式。");
    } else if (st.path.indexOf('..') > -1){
      code = 400; body = '{ "error": "malformed path" }';
      n = bi("400 = your request was wrong, before anything else was even checked. Path traversal like <code class=\"inl\">../</code> is also a classic attack shape, which is why a good server rejects it outright.",
             "400 = 你的请求本身就不对，在检查其他任何东西之前就被挡了。<code class=\"inl\">../</code> 这种路径穿越也是经典攻击形态，所以好的服务器会直接拒绝。");
    } else if (st.auth === 'none'){
      code = 401; body = '{ "error": "authentication required" }';
      n = bi("401 = we don't know who you are. Different from 403, which means we know exactly who you are and you still may not.",
             "401 = 我们不知道你是谁。这和 403 不同——403 是我们很清楚你是谁，但你仍然不可以。");
    } else if (st.auth === 'readonly' && st.method !== 'GET'){
      code = 403; body = '{ "error": "token lacks write scope" }';
      n = bi("403 with a read-only token is <b>least privilege working correctly</b>. This is exactly what you want for a pipeline that only needs to read — the blast radius of a mistake is bounded by the permission you granted.",
             "只读令牌拿到 403，说明<b>最小权限正在正常发挥作用</b>。这正是你希望一条只需读取的管道具备的状态——一次失误的影响范围，被你授予的权限限死了。");
    } else if (st.path.indexOf('S-999') > -1){
      code = 404; body = '{ "error": "sample not found", "id": "S-999" }';
      n = bi("404 = the address is valid but nothing lives there. Note it is <b>not</b> an error in your code — your pipeline must decide whether a missing sample is normal or an alert.",
             "404 = 地址合法，但那里没有东西。注意这<b>不是</b>你代码的错误——你的管道需要判断「样本缺失」是正常情况还是应该告警。");
    } else if (st.method === 'POST'){
      code = 201; body = '{ "id": "S-004", "purity": 0.97, "volume_ml": 2.1,\n  "status": "PASS", "created_at": "2026-08-18T09:14:02Z" }';
      n = bi("201 Created, not 200. The distinction matters: 201 tells the caller a new resource now exists at a new address. Sending the same POST twice creates <b>two</b> samples — which is exactly the idempotency problem you meet again in Milestone 4.",
             "是 201 Created，不是 200。这个区别有意义：201 告诉调用方，一个新资源现在存在于一个新地址。同一个 POST 发两次会创建<b>两份</b>样本——这正是你在阶段四会再次遇到的幂等性问题。");
    } else if (st.method === 'DELETE'){
      code = 204; body = '(no content)';
      n = bi("204 = done, and there is deliberately nothing to return. If your code tries to <code class=\"inl\">.json()</code> this response, it will crash on an empty body. A very common first bug.",
             "204 = 完成了，而且有意不返回任何内容。如果你的代码对这个响应调用 <code class=\"inl\">.json()</code>，会因为响应体为空而崩溃。这是非常常见的第一个 bug。");
    } else {
      code = 200; body = '{ "id": "S-001", "purity": 0.98, "volume_ml": 2.4,\n  "status": "PASS", "lab_site": "IPOH" }';
      n = bi("200 OK. Now the important habit: your code should check <code class=\"inl\">status_code == 200</code> <i>before</i> parsing the body. Most pipelines that write zeros into a report skipped exactly this line.",
             "200 OK。现在说那个重要习惯：你的代码应该在解析响应体<i>之前</i>先检查 <code class=\"inl\">status_code == 200</code>。大多数往报表里写 0 的管道，跳过的就是这一行。");
    }
    var cls = code < 300 ? '#86efac' : (code < 500 ? '#fbbf24' : '#fca5a5');
    resEl.innerHTML = '<span style="color:' + cls + '; font-weight:700">HTTP/1.1 ' + code + '</span>\n'
      + '<span class="fn">Content-Type</span>: application/json\n\n' + body;
    note.innerHTML = n;
    broken = false; flooded = false;
  }
  $$('[data-http]').forEach(function(b){
    b.addEventListener('click', function(){
      var k = b.dataset.http;
      st[k] = b.dataset.val;
      $$('[data-http='+k+']').forEach(function(x){x.classList.toggle('active', x === b)});
      paint();
    });
  });
  $('#http-send').addEventListener('click', paint);
  $('#http-flood').addEventListener('click', function(){ flooded = true; paint() });
  $('#http-break').addEventListener('click', function(){ broken  = true; paint() });
  paint();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 3 · HTTP simulator:", _e && _e.message)}

/* ================= PLAYGROUND 4 · Git simulator ================= */
try{
(function(){
  var svg = $('#git-svg'); if (!svg) return;
  var logEl = $('#git-log');
  var S, msgs = ['tidy up imports','add purity filter','fix date parsing','update README','handle null volumes','bump threshold to 0.95'];
  function reset(){
    S = {nodes:[], x:70, cur:'main', hasFeature:false, branchPoint:null, log:[], n:0, fresh:null};
    add('main', null, 'initial commit');
    S.log = [];
    say(bi('# an empty repository with one commit','# 一个只有一次提交的空仓库'), false);
    draw();
  }
  function head(br){
    for (var i = S.nodes.length - 1; i >= 0; i--) if (S.nodes[i].br === br) return S.nodes[i];
    return null;
  }
  function add(br, extraParent, msg){
    var p = head(br) || S.branchPoint;
    var node = {id:'c' + (++S.n), br:br, x:S.x, y: br === 'main' ? 140 : 55, parents:[], msg:msg};
    if (p) node.parents.push(p);
    if (extraParent) node.parents.push(extraParent);
    S.x += 92; S.nodes.push(node); S.fresh = node.id;
    return node;
  }
  function say(html, warn){ S.log.push({html:html, warn:warn}); }
  function draw(){
    var s = '';
    /* edges */
    S.nodes.forEach(function(n){
      n.parents.forEach(function(p){
        var col = (n.br === 'feature' || p.br === 'feature') ? '#0d9488' : '#64748b';
        if (p.y === n.y) s += '<line x1="'+p.x+'" y1="'+p.y+'" x2="'+n.x+'" y2="'+n.y+'" stroke="'+col+'" stroke-width="3"/>';
        else {
          var mx = (p.x + n.x) / 2;
          s += '<path d="M'+p.x+' '+p.y+' C'+mx+' '+p.y+' '+mx+' '+n.y+' '+n.x+' '+n.y+'" stroke="'+col+'" stroke-width="3" fill="none"/>';
        }
      });
    });
    /* branch labels */
    s += '<text x="14" y="145" style="font:700 11px sans-serif" fill="var(--muted-2)">main</text>';
    if (S.hasFeature) s += '<text x="14" y="60" style="font:700 11px sans-serif" fill="#5eead4">feature</text>';
    /* nodes */
    S.nodes.forEach(function(n){
      var merge = n.parents.length > 1;
      var col = n.br === 'feature' ? '#0d9488' : '#94a3b8';
      s += '<circle class="gnode'+(n.id === S.fresh ? ' fresh' : '')+'" cx="'+n.x+'" cy="'+n.y+'" r="'+(merge?13:10)+'" '
         + 'fill="'+(merge ? '#0d9488' : '#0f172a')+'" stroke="'+col+'" stroke-width="3"/>';
    });
    svg.innerHTML = s;
    svg.setAttribute('viewBox', '0 0 ' + Math.max(760, S.x + 40) + ' 190');
    logEl.innerHTML = S.log.map(function(l){return '<div class="'+(l.warn?'warnl':'')+'">'+l.html+'</div>'}).join('');
    logEl.scrollTop = logEl.scrollHeight;
  }
  $('#git-commit').addEventListener('click', function(){
    var m = msgs[S.n % msgs.length];
    add(S.cur, null, m);
    say('<b>$ git commit -m "'+m+'"</b>');
    say('  [' + S.cur + ' ' + Math.random().toString(16).slice(2,9) + '] ' + m);
    draw();
  });
  $('#git-branch').addEventListener('click', function(){
    if (S.hasFeature){
      say('<b>$ git checkout -b feature</b>');
      say('  fatal: a branch named \'feature\' already exists', true);
    } else {
      S.hasFeature = true; S.branchPoint = head('main'); S.cur = 'feature';
      say('<b>$ git checkout -b feature</b>');
      say('  Switched to a new branch \'feature\'');
      say('  ' + bi('# nothing was copied — a branch is just a pointer. This is free.','# 什么都没被复制 —— 分支只是一个指针。这一步是零成本的。'));
    }
    draw();
  });
  $('#git-switch').addEventListener('click', function(){
    S.cur = 'main';
    say('<b>$ git checkout main</b>');
    say('  Switched to branch \'main\'');
    draw();
  });
  $('#git-merge').addEventListener('click', function(){
    say('<b>$ git merge feature</b>');
    if (!S.hasFeature){ say('  merge: feature - not something we can merge', true); draw(); return; }
    if (S.cur !== 'main'){ say('  ' + bi('you are on feature — check out main first','你现在在 feature 分支上，先切回 main'), true); draw(); return; }
    var f = head('feature');
    if (!f){ say('  ' + bi('Already up to date — the branch has no commits of its own yet.','Already up to date —— 这条分支上还没有自己的提交。')); draw(); return; }
    var mainAfter = S.nodes.filter(function(n){ return n.br === 'main' && n.x > S.branchPoint.x });
    add('main', f, 'merge feature');
    if (mainAfter.length){
      say('  Auto-merging pipeline.py');
      say('  CONFLICT (content): both branches changed the same lines', true);
      say('  ' + bi('# Both sides moved. Git cannot choose for you — it marks the file and asks. This is normal, weekly, and not a disaster.','# 两边都动了。Git 无法替你选择——它会在文件里做标记并询问你。这很正常，每周都会遇到，不是灾难。'), true);
      say('  ' + bi('# after you resolve it: git add . && git commit','# 解决之后：git add . && git commit'));
    } else {
      say('  Fast-forward / merge made by the \'ort\' strategy');
      say('  ' + bi('# clean merge — nothing on main had moved since you branched.','# 干净合并 —— 从你开分支到现在，main 上没有任何变化。'));
    }
    S.hasFeature = false; S.cur = 'main';
    draw();
  });
  $('#git-reset').addEventListener('click', reset);
  reset();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 4 · Git simulator:", _e && _e.message)}

/* ================= PLAYGROUND 5 · Prompt lab ================= */
try{
(function(){
  var wrap = $('#prompt-ingr'); if (!wrap) return;
  var meter = $('#p-meter'), scoreEl = $('#p-score'), verdict = $('#p-verdict');
  var pEl = $('#p-prompt'), aEl = $('#p-answer');
  var C = function(s){return '<span class="cm">'+s+'</span>'};
  function render(){
    var on = {}, score = 0;
    $$('input', wrap).forEach(function(i){ if (i.checked){ on[i.dataset.k] = true; score += +i.dataset.w } });
    meter.style.width = score + '%';
    meter.style.backgroundColor = score < 25 ? '#dc2626' : (score < 55 ? '#d97706' : (score < 85 ? '#65a30d' : '#059669'));
    scoreEl.textContent = score + ' / 100';

    var p = '';
    if (on.role) p += 'You are a senior data engineer reviewing a clinical\nsample database. Flag anything that could silently\nproduce wrong counts.\n\n';
    p += 'Find duplicate samples.\n';
    if (on.ctx) p += '\nSchema (PostgreSQL 15):\n  samples(sample_id TEXT, patient_id TEXT,\n          collected_at TIMESTAMPTZ, purity NUMERIC,\n          volume_ml NUMERIC, lab_site TEXT)\nExample row:\n  (\'S-001\',\'P-01\',\'2026-03-14 09:12+08\',0.98,2.4,\'IPOH\')\n';
    if (on.rule) p += '\nA duplicate = same patient_id AND same collected_at\nDATE (not timestamp) AND same lab_site.\nExclude rows where lab_site IS NULL.\n';
    if (on.ex) p += '\nExample:\n  in  -> P-01 / 2026-03-14 09:12 / IPOH\n         P-01 / 2026-03-14 16:40 / IPOH\n  out -> one group, n=2\n';
    if (on.think) p += '\nBefore writing the query, walk through your logic\nstep by step. Then give the final SQL.\n';
    if (on.fmt) p += '\nReturn ONLY valid PostgreSQL in one code block.\nNo prose. Then, separately, list any assumptions.\n';
    pEl.innerHTML = p.replace(/&/g,'&amp;').replace(/</g,'&lt;');

    var a = '';
    if (score < 25){
      a  = C('# A generic answer against tables that do not exist.\n# 针对并不存在的表给出的通用答案。') + '\n\n';
      a += 'SELECT name, COUNT(*)\nFROM your_table\nGROUP BY name\nHAVING COUNT(*) > 1;\n\n';
      a += C('# You now spend 20 minutes translating this to your\n# real schema, and you still do not know what it\n# counted as a duplicate.\n# 接下来你花 20 分钟把它翻译到真实表结构上，\n# 而且仍然不知道它把什么算成了重复。');
    } else if (score < 55){
      a  = C('# Closer — it uses your real columns now.\n# 好一些了 —— 它开始用你真实的列名。') + '\n\n';
      a += 'SELECT patient_id, collected_at, COUNT(*) AS n\nFROM samples\nGROUP BY patient_id, collected_at\nHAVING COUNT(*) > 1;\n\n';
      a += C('# But it grouped on the full TIMESTAMP, so two samples\n# at 09:12 and 16:40 on the same day are NOT matched.\n# Silently wrong. This is the dangerous middle ground.\n# 但它按完整时间戳分组，所以同一天 09:12 和 16:40 的\n# 两份样本不会被匹配上。无声的错误。这是最危险的中间地带。');
    } else if (score < 85){
      a  = C('# Correct logic, correct grain.\n# 逻辑正确，粒度正确。') + '\n\n';
      a += 'SELECT patient_id,\n       collected_at::date AS collected_day,\n       lab_site,\n       COUNT(*) AS n\nFROM samples\nWHERE lab_site IS NOT NULL\nGROUP BY 1, 2, 3\nHAVING COUNT(*) > 1\nORDER BY collected_day DESC;\n\n';
      a += C('# Still wrapped in explanation, so a pipeline cannot\n# consume it without a human in the middle.\n# 但外面仍包着解释文字，管道没法直接使用，\n# 中间必须有个人。');
    } else {
      a  = C('# Reasoning (as requested), then clean parseable SQL.\n# 先按要求给出推理，再给可直接解析的 SQL。') + '\n\n';
      a += C('Step 1: grain is one row per sample.\nStep 2: dedupe key = patient_id + DATE + lab_site.\nStep 3: NULL lab_site excluded per spec.\nStep 4: order by recency for triage.') + '\n\n';
      a += 'SELECT patient_id,\n       collected_at::date AS collected_day,\n       lab_site,\n       COUNT(*)                    AS n,\n       ARRAY_AGG(sample_id ORDER BY collected_at) AS sample_ids\nFROM samples\nWHERE lab_site IS NOT NULL\nGROUP BY 1, 2, 3\nHAVING COUNT(*) > 1\nORDER BY collected_day DESC;\n\n';
      a += C('Assumptions:\n - "same day" uses the database timezone, not UTC.\n - sample_id itself is assumed unique.\n\n# Now it runs unattended, and it told you what it assumed.\n# 现在它可以无人值守运行，而且主动说明了它做了哪些假设。');
    }
    aEl.innerHTML = a;

    var v;
    if (score < 25) v = bi('Starved briefing. The model has to invent your schema, your definition and your output format — and it will invent all three plausibly.',
                           '简报太饿。模型必须自己编出你的表结构、你的定义和你的输出格式——而且这三样它都会编得很像那么回事。');
    else if (score < 55) v = bi('Dangerous middle. The answer now looks right, which is worse than looking wrong. This is where undetected bugs come from.',
                                '危险的中间地带。答案现在<i>看起来</i>对了，这比看起来不对更糟。没被发现的 bug 就是从这里来的。');
    else if (score < 85) v = bi('Good briefing. Correct logic. Still needs a human to extract the SQL before anything can be automated.',
                                '不错的简报，逻辑正确。但仍然需要一个人先把 SQL 抠出来，才能自动化。');
    else v = bi('Production-grade briefing. Reproducible, machine-consumable, and it declares its own assumptions — which is what makes it reviewable.',
                '生产级简报。可复现、机器可直接使用，而且它主动声明了自己的假设——这才是它可被评审的原因。');
    verdict.innerHTML = v;
  }
  $$('input', wrap).forEach(function(i){ i.addEventListener('change', render) });
  render();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 5 · Prompt lab:", _e && _e.message)}

/* ================= PLAYGROUND 6 · data cleaner ================= */
try{
(function(){
  var tbl = $('#clean-tbl'); if (!tbl) return;
  var note = $('#clean-note');
  var RAW = [
    {id:'S-001', site:'IPOH',    date:'2026-03-14', purity:0.98, vol:2.4},
    {id:'S-002', site:'Ipoh',    date:'14/03/2026', purity:0.91, vol:3.0},
    {id:'S-003', site:'ipoh ',   date:'2026-03-15', purity:0.99, vol:0.4},
    {id:'S-004', site:'PENANG',  date:'Mar 15 2026',purity:0.96, vol:1.8},
    {id:'',      site:'PENANG',  date:'2026-03-15', purity:0.97, vol:2.2},
    {id:'S-006', site:' penang', date:'2026-03-16', purity:0.99, vol:2.0},
    {id:'S-006', site:'PENANG',  date:'2026-03-16', purity:0.99, vol:2.0},
    {id:'S-008', site:'IPOH',    date:'2026-03-16', purity:1.42, vol:2.1}
  ];
  var ops = {trim:false, dates:false, nulls:false, dupes:false, range:false};
  var NOTES = {
    trim: bi('Three spellings of two sites became two. Every <code class="inl">GROUP BY lab_site</code> you ran before this was splitting Ipoh into three and under-reporting it by about a third.',
             '两个厂区的三种写法合并成了两个。在此之前你跑的每一次 <code class="inl">GROUP BY lab_site</code> 都把怡保拆成了三份，少报了约三分之一。'),
    dates: bi('Three date formats became one. Before this, <code class="inl">"14/03/2026"</code> was just text — sorting it put it before <code class="inl">"2026-03-14"</code>, and any date filter silently skipped those rows.',
              '三种日期格式统一成一种。在此之前 <code class="inl">"14/03/2026"</code> 只是一串文本——排序时它会排在 <code class="inl">"2026-03-14"</code> 前面，而任何日期筛选都会悄悄漏掉这些行。'),
    nulls: bi('A row with no sample_id cannot be traced back to anything physical. Dropping it is a <b>scientific decision</b> — so write it down in the code and in the docs, because it changes your denominator.',
              '没有 sample_id 的行无法追溯到任何实物。丢掉它是一个<b>科学决定</b>——所以要在代码和文档里写下来，因为它改变了你的分母。'),
    dupes: bi('S-006 appeared twice because two upstream systems both reported it. Without this step every total that includes it is inflated — and nothing would ever have told you.',
              'S-006 出现了两次，因为上游两个系统都上报了它。没有这一步，所有包含它的合计都会虚高——而且不会有任何东西提醒你。'),
    range: bi('Purity of 1.42 is physically impossible — a percentage that got entered where a fraction was expected. A range check catches the class of error that <i>looks</i> like data.',
              '纯度 1.42 在物理上不可能——有人把百分数填进了本该填小数的地方。范围校验抓的就是那类<i>看起来像数据</i>的错误。')
  };
  function view(){
    var rows = RAW.map(function(r){return Object.assign({}, r, {bad:{}, fixed:{}, gone:false}) });
    rows.forEach(function(r){
      if (ops.trim){ r.site = r.site.trim().toUpperCase(); r.fixed.site = true; } else r.bad.site = true;
      if (ops.dates){
        if (r.date === '14/03/2026') r.date = '2026-03-14';
        if (r.date === 'Mar 15 2026') r.date = '2026-03-15';
        r.fixed.date = true;
      } else if (r.date.indexOf('/') > -1 || r.date.indexOf(' ') > -1) r.bad.date = true;
      if (!r.id){ if (ops.nulls) r.gone = true; else r.bad.id = true; }
      if (r.purity > 1){ if (ops.range) r.gone = true; else r.bad.purity = true; }
    });
    if (ops.dupes){
      var seen = {};
      rows.forEach(function(r){
        if (r.gone || !r.id) return;
        if (seen[r.id]) r.gone = true; else seen[r.id] = true;
      });
    } else {
      var cnt = {};
      rows.forEach(function(r){ if (r.id) cnt[r.id] = (cnt[r.id]||0)+1 });
      rows.forEach(function(r){ if (r.id && cnt[r.id] > 1) r.bad.id = true });
    }
    return rows;
  }
  function render(){
    var rows = view();
    var h = '<tr><th>sample_id</th><th>lab_site</th><th>collected_at</th><th>purity</th><th>volume_ml</th></tr>';
    rows.forEach(function(r){
      var td = function(k, v){
        var c = r.bad[k] ? ' class="bad"' : (r.fixed[k] ? ' class="fixed"' : '');
        return '<td'+c+'>' + (v === '' ? '<span style="opacity:.6">NULL</span>' : v) + '</td>';
      };
      h += '<tr'+(r.gone ? ' class="gone"' : '')+'>' + td('id', r.id) + td('site','"'+r.site+'"') + td('date', r.date)
         + td('purity', r.purity) + '<td>' + r.vol + '</td></tr>';
    });
    tbl.innerHTML = h;
    var live = rows.filter(function(r){return !r.gone});
    var sites = {}; live.forEach(function(r){ sites[r.site] = 1 });
    var issues = live.reduce(function(a,r){ return a + Object.keys(r.bad).length }, 0);
    var pass = live.filter(function(r){ return r.purity >= 0.95 && r.purity <= 1 && r.vol >= 1.0 }).length;
    $('#c-rows').textContent   = live.length;
    $('#c-sites').textContent  = Object.keys(sites).length;
    $('#c-issues').textContent = issues;
    $('#c-pass').textContent   = live.length ? Math.round(pass / live.length * 100) + '%' : '—';
    $('#c-issues').style.color = issues ? '#dc2626' : '#059669';
  }
  $$('[data-clean]').forEach(function(b){
    b.addEventListener('click', function(){
      var k = b.dataset.clean;
      if (k === 'reset'){
        Object.keys(ops).forEach(function(o){ops[o] = false});
        $$('[data-clean]').forEach(function(x){x.classList.remove('active')});
        note.innerHTML = bi('Raw data, exactly as it arrived. Everything highlighted in red is a real problem that will not throw an error.',
                            '原始数据，就是它到达时的样子。所有标红的地方都是真实的问题，而且它们都不会报错。');
        render(); return;
      }
      ops[k] = !ops[k];
      b.classList.toggle('active', ops[k]);
      note.innerHTML = ops[k] ? NOTES[k]
        : bi('Undone — watch the numbers change back.','已撤销 —— 注意下面的数字变回去了。');
      render();
    });
  });
  note.innerHTML = bi('Raw data, exactly as it arrived. Everything highlighted in red is a real problem that will not throw an error.',
                      '原始数据，就是它到达时的样子。所有标红的地方都是真实的问题，而且它们都不会报错。');
  render();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 6 · data cleaner:", _e && _e.message)}

/* ================= PLAYGROUND 7 · latency lab ================= */
try{
(function(){
  var host = $('#lat-rows'); if (!host) return;
  var DATA = [
    {en:'CPU L1 cache',       zh:'CPU 一级缓存',   ns:1,         real:'1 ns',   hEn:'1 second',    hZh:'1 秒'},
    {en:'RAM',                zh:'内存 RAM',       ns:100,       real:'100 ns', hEn:'1.7 minutes', hZh:'1.7 分钟'},
    {en:'SSD read',           zh:'SSD 读取',       ns:150000,    real:'150 µs', hEn:'1.7 days',    hZh:'1.7 天'},
    {en:'Network, same DC',   zh:'同数据中心网络', ns:500000,    real:'0.5 ms', hEn:'5.8 days',    hZh:'5.8 天'},
    {en:'Spinning disk seek', zh:'机械硬盘寻道',   ns:10000000,  real:'10 ms',  hEn:'4 months',    hZh:'4 个月'},
    {en:'Intercontinental',   zh:'跨洲网络往返',   ns:150000000, real:'150 ms', hEn:'4.7 years',   hZh:'4.7 年'}
  ];
  var maxLog = Math.log10(DATA[DATA.length-1].ns);
  host.innerHTML = DATA.map(function(d,i){
    return '<div class="latrow"><span>' + bi(d.en, d.zh) + '</span>'
      + '<div class="lattrack"><i class="latfill" id="lf'+i+'"></i></div>'
      + '<b id="lt'+i+'">' + d.real + '</b></div>'
      + '<div class="latrow" style="margin-top:-6px"><span></span>'
      + '<small style="color:var(--muted); font-size:12px" id="lh'+i+'">'
      + bi('if 1 ns were 1 second → <b>'+d.hEn+'</b>', '若 1 纳秒 = 1 秒 → <b>'+d.hZh+'</b>')
      + '</small><span></span></div>';
  }).join('');
  var running = false;
  function race(){
    if (running) return;
    running = true;
    var btn = $('#lat-go');
    btn.disabled = true;
    var zh = document.body.classList.contains('lang-zh');
    var TOTAL = 9000;                      /* slowest row takes 9 s */
    var start = performance.now();
    var st = DATA.map(function(d,i){
      var frac = Math.log10(d.ns) / maxLog;             /* 0 .. 1 */
      return {
        dur:  Math.max(450, frac * TOTAL),
        wid:  6 + frac * 94,
        el:   $('#lf'+i),
        lab:  $('#lt'+i),
        done: false,
        d:    d
      };
    });
    st.forEach(function(r){ r.el.style.transition='none'; r.el.style.width='0%'; r.lab.style.color=''; r.lab.textContent = zh ? '等待中…' : 'waiting…'; });
    function frame(now){
      var t = now - start, alive = false;
      st.forEach(function(r){
        if (r.done) return;
        var k = Math.min(1, t / r.dur);
        r.el.style.width = (r.wid * k).toFixed(2) + '%';
        if (k >= 1){
          r.done = true;
          r.lab.textContent = r.d.real;
          r.lab.style.color = '#059669';
        } else {
          alive = true;
          r.lab.textContent = (zh ? '传输中 ' : 'travelling ') + Math.round(k*100) + '%';
        }
      });
      if (alive) requestAnimationFrame(frame);
      else { running = false; btn.disabled = false; }
    }
    requestAnimationFrame(frame);
  }
  $('#lat-go').addEventListener('click', race);
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 7 · latency lab:", _e && _e.message)}

/* ================= PLAYGROUND 8 · autoscaling ================= */
try{
(function(){
  var slider = $('#as-traffic'); if (!slider) return;
  var auto = true, CAP = 100, FIXED = 3;
  function render(){
    var rps = +slider.value;
    var n = auto ? Math.max(1, Math.min(12, Math.ceil(rps / (CAP * 0.7)))) : FIXED;
    var load = rps / (n * CAP);
    var lat = Math.round(42 * (1 + Math.max(0, load - 0.75) * 14));
    var cost = Math.round(n * 0.098 * 730);
    $('#as-servers').innerHTML = Array.apply(null, {length:n}).map(function(_,i){
      return '<div class="srv' + (load > 1 ? ' hot' : '') + '" style="animation-delay:' + (i*0.03) + 's">' + (i+1) + '</div>';
    }).join('');
    $('#as-rps').textContent  = rps;
    $('#as-n').textContent    = n;
    $('#as-lat').textContent  = (load > 1.35 ? '⚠ ' : '') + lat + ' ms';
    $('#as-cost').textContent = '$' + cost.toLocaleString();
    $('#as-lat').style.color  = load > 1 ? '#dc2626' : (load > 0.85 ? '#d97706' : '');
    var note = $('#as-note');
    if (!auto && load > 1) note.innerHTML = '<span style="color:var(--no)">' + bi(
      '<b>Overloaded.</b> Fixed capacity cannot absorb the spike — requests queue and response time climbs. This is exactly what a server room felt like on launch day: you had bought for the average, and the peak arrived anyway.',
      '<b>过载了。</b>固定容量吸收不了尖峰——请求开始排队，响应时间飙升。这正是自建机房在发布日的感觉：你按平均值采购，而峰值照样来了。') + '</span>';
    else if (!auto) note.innerHTML = bi(
      '<b>Fixed capacity, running below its ceiling.</b> Note the cost stays flat even when traffic is tiny — you are paying for the peak all night, every night. That was the old normal.',
      '<b>固定容量，还没到上限。</b>注意即使流量很小，成本也一动不动——你整夜、每夜都在按峰值付钱。这曾经就是常态。');
    else if (rps > 700) note.innerHTML = bi(
      '<b>Autoscaling handled it.</b> Response time stayed flat because capacity followed demand. The cost rose with it — which is the honest trade: you pay for what you use, when you use it.',
      '<b>自动伸缩顶住了。</b>响应时间保持平稳，因为容量跟着需求走。成本也跟着涨——这就是诚实的交易：用多少、什么时候用，就付多少。');
    else note.innerHTML = bi(
      'Drag the slider up. Then press <b>Autoscaling: ON</b> to turn it off and drag again — compare what happens to response time and to the bill.',
      '把滑块往右拖。然后点 <b>自动伸缩：开</b> 把它关掉再拖一次——对比响应时间和账单各自发生了什么。');
  }
  slider.addEventListener('input', render);
  $('#as-toggle').addEventListener('click', function(){
    auto = !auto;
    this.classList.toggle('active', auto);
    this.innerHTML = auto
      ? bi('Autoscaling: ON', '自动伸缩：开')
      : bi('Autoscaling: OFF (fixed 3 servers)', '自动伸缩：关（固定 3 台）');
    render();
  });
  $('#as-spike').addEventListener('click', function(){
    var start = +slider.value, target = 900, t0 = null;
    function step(ts){
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 1400);
      slider.value = Math.round(start + (target - start) * (1 - Math.pow(1-k, 3)));
      render();
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
  render();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 8 · autoscaling:", _e && _e.message)}

/* ================= PLAYGROUND 9 · body / page layers ================= */
try{
(function(){
  var fig = $('#fig'); if (!fig) return;
  var note = $('#fig-note'), count = 0;
  var swCss = $('#sw-css'), swJs = $('#sw-js');
  function update(){
    var css = fig.classList.contains('css-on'), js = fig.classList.contains('js-on');
    var n;
    if (!css && !js) n = bi('<b>Skeleton only.</b> Everything is here — every heading, every row, every button. It is readable, it is usable, a screen reader can navigate it perfectly. It is just naked. This is what a page is <i>actually</i> made of.',
                            '<b>只有骨架。</b>该有的全在——每个标题、每一行、每个按钮。它可读、可用，屏幕阅读器也能完美导航。它只是没穿衣服。这才是一个页面<i>真正</i>由什么构成。');
    else if (css && !js) n = bi('<b>Clothes on.</b> Nothing about the content changed — not one word, not one row. Only the appearance. And the button still does nothing when you press it, because appearance is not behaviour.',
                                '<b>穿上衣服了。</b>内容一个字都没变——没多一个词、没多一行，变的只有外观。而且按钮按下去仍然没反应，因为"好看"不等于"会动"。');
    else if (!css && js) n = bi('<b>Nerves without clothes.</b> Press the button — it works. Ugly and fully functional. This is the state a lot of internal tools live in forever, and honestly that is often the right call.',
                                '<b>有神经，没衣服。</b>按一下按钮——它真的有反应。难看，但功能完整。很多内部工具就永远停在这个状态，而且说实话，这往往是对的选择。');
    else n = bi('<b>All three.</b> A body that stands, looks like something, and reacts. Every website you have ever used is exactly these three layers — and you can pull them apart on any of them with <kbd>F12</kbd>.',
                '<b>三层齐全。</b>一具站得住、看得过去、还会反应的身体。你用过的每一个网站都正是这三层——而且你可以在任何一个网站上按 <kbd>F12</kbd> 把它们拆开看。');
    note.innerHTML = n;
  }
  swCss.addEventListener('click', function(){ fig.classList.toggle('css-on'); swCss.classList.toggle('on'); update(); });
  swJs.addEventListener('click',  function(){ fig.classList.toggle('js-on');  swJs.classList.toggle('on');  update(); });
  $('#mock-btn').addEventListener('click', function(){
    if (!fig.classList.contains('js-on')) return;
    count++;
    $('#mock-count').textContent = document.body.classList.contains('lang-zh')
      ? ('已运行 ' + count + ' 次') : (count + ' checks run');
  });
  update();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 9 · body / page layers:", _e && _e.message)}

/* ================= PLAYGROUND 10 · bits ================= */
try{
(function(){
  var host = $('#bits'); if (!host) return;
  var bits = [0,0,0,0,0,0,0,0];
  host.innerHTML = bits.map(function(_,i){
    return '<div class="bit"><button class="sw2" data-i="'+i+'">0</button><small>'+Math.pow(2,7-i)+'</small></div>';
  }).join('');
  function paint(){
    var bin = bits.join('');
    var dec = parseInt(bin, 2);
    $('#b-bin').textContent = bin;
    $('#b-dec').textContent = dec;
    $('#b-hex').textContent = '0x' + dec.toString(16).toUpperCase().padStart(2,'0');
    var ch;
    if (dec === 32) ch = document.body.classList.contains('lang-zh') ? '空格' : 'space';
    else if (dec > 32 && dec < 127) ch = String.fromCharCode(dec);
    else ch = '—';
    $('#b-chr').textContent = ch;
    $$('.sw2', host).forEach(function(b,i){ b.textContent = bits[i]; b.classList.toggle('on', !!bits[i]); });
  }
  host.addEventListener('click', function(e){
    var b = e.target.closest('.sw2'); if (!b) return;
    var i = +b.dataset.i; bits[i] = bits[i] ? 0 : 1; paint();
  });
  $$('[data-bit]').forEach(function(b){
    b.addEventListener('click', function(){
      var v = +b.dataset.bit;
      v.toString(2).padStart(8,'0').split('').forEach(function(c,i){ bits[i] = +c });
      paint();
    });
  });
  var ti = $('#b-text'), to = $('#b-textout');
  function textOut(){
    var v = ti.value || '';
    if (!v){ to.textContent = ''; return; }
    var lines = v.split('').map(function(c){
      var n = c.charCodeAt(0);
      return '  "' + (c === ' ' ? '␣' : c) + '"   ' + n.toString(2).padStart(8,'0') + '   ' + String(n).padStart(3,' ')
        + '   0x' + n.toString(16).toUpperCase().padStart(2,'0');
    });
    var head = document.body.classList.contains('lang-zh')
      ? '  字符   二进制(开关)   十进制   十六进制\n'
      : '  char  binary(switches)  dec   hex\n';
    to.textContent = head + lines.join('\n')
      + (document.body.classList.contains('lang-zh')
         ? '\n\n  这 ' + v.length + ' 个字符 = ' + (v.length*8) + ' 个开关的开与关。\n  你在网上发出的每一条消息，本质上就是这个。'
         : '\n\n  ' + v.length + ' characters = ' + (v.length*8) + ' switches, on or off.\n  Every message you have ever sent is literally this.');
  }
  ti.addEventListener('input', textOut);
  $$('.langsw button').forEach(function(b){ b.addEventListener('click', function(){ setTimeout(function(){paint(); textOut();}, 10) }) });
  bits = [0,1,0,0,0,0,0,1]; paint(); textOut();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 10 · bits:", _e && _e.message)}

/* ================= the tower ================= */
try{
(function(){
  var host = $('#tower'); if (!host) return;
  var det = $('#towerdetail');
  var F = [
    {lv:'12', en:'AI models', zh:'AI 模型', sEn:'patterns learned from text', sZh:'从文本中学到的模式',
     bEn:'built from: maths on huge arrays', bZh:'建于：对巨大数组做数学运算',
     tEn:'A model is billions of numbers, multiplied together very fast.',
     tZh:'一个模型就是几十亿个数字，被极快地相乘。',
     dEn:'<p>There is no reasoning organ in there. There is a very large grid of numbers, and an operation that multiplies your input through it to produce the most likely next chunk of text.</p><p>The reason it needs a data centre is that the grid is enormous and the multiplication happens billions of times per answer. <b>All of that is still, at the bottom, switches flipping.</b></p>',
     dZh:'<p>里面没有一个"推理器官"。有的是一张极其巨大的数字网格，以及一个把你的输入乘过去、算出最可能的下一段文字的运算。</p><p>它需要数据中心，是因为这张网格极大，而每给出一个答案，这种乘法要发生几十亿次。<b>而这一切，到最底下仍然是开关在翻转。</b></p>'},
    {lv:'11', en:'The cloud', zh:'云', sEn:"someone else's computers, rented", sZh:'别人的电脑，按需租用',
     bEn:'built from: networks + servers', bZh:'建于：网络 + 服务器',
     tEn:'There is no cloud. There is a building full of the floor below.',
     tZh:'没有"云"。只有一栋装满下面那一层的楼。',
     dEn:'<p>The single most demystifying sentence in this entire guide: <b>the cloud is just someone else\'s computer, in a room with very good air conditioning.</b></p><p>What you are actually renting is the ability to stop caring about the floors below — power, cooling, failed drives, spare capacity. You pay to have those problems be somebody else\'s.</p>',
     dZh:'<p>整份指南里最能祛魅的一句话：<b>云就是别人的电脑，放在一间空调开得极好的房间里。</b></p><p>你真正租的，是"不再关心下面那几层"的权利——供电、散热、坏掉的硬盘、备用容量。你付钱，是为了让这些问题变成别人的问题。</p>'},
    {lv:'10', en:'The network', zh:'网络', sEn:'machines talking to machines', sZh:'机器与机器对话',
     bEn:'built from: agreed protocols', bZh:'建于：约定好的协议',
     tEn:'HTTP, DNS, TCP/IP — rules for who speaks when.',
     tZh:'HTTP、DNS、TCP/IP —— 关于"谁什么时候说话"的规则。',
     dEn:'<p>Two machines that have never met can exchange data reliably only because both agreed, in advance, to the same rulebook. TCP guarantees the pieces arrive in order. DNS turns a name into an address. HTTP defines what a request and an answer look like.</p><p><b>None of this is a physical fact — every bit of it is a written agreement</b> that everyone chose to honour. That is why a status code means the same thing in Kuala Lumpur and in Oslo.</p>',
     dZh:'<p>两台素未谋面的机器之所以能可靠地交换数据，只是因为双方事先同意了同一本规则手册。TCP 保证碎片按顺序到达，DNS 把名字翻译成地址，HTTP 规定请求和回答长什么样。</p><p><b>这里没有一样是物理事实——每一条都是写下来的约定</b>，而所有人选择遵守它。这就是为什么同一个状态码在吉隆坡和在奥斯陆意思完全一样。</p>'},
    {lv:'09', en:'Apps & websites', zh:'应用与网站', sEn:'what people actually see', sZh:'人们真正看到的东西',
     bEn:'built from: languages + OS', bZh:'建于：语言 + 操作系统',
     tEn:'The only floor most people ever know exists.',
     tZh:'绝大多数人唯一知道存在的一层。',
     dEn:'<p>Skeleton, clothes, nervous system. This is the floor you live on as a user, and the floor almost everyone assumes is the whole building.</p><p>It is also the floor where <b>you can press F12 and see the layer underneath</b> — which is a rare gift. Most towers in life don\'t let you open the floor.</p>',
     dZh:'<p>骨架、衣服、神经系统。作为用户，你住在这一层，而几乎所有人都以为这一层就是整栋楼。</p><p>它也是唯一一层<b>你按 F12 就能看见下面那层</b>的地方——这其实是很稀有的馈赠。人生中大多数塔，都不允许你掀开地板。</p>'},
    {lv:'08', en:'Operating system', zh:'操作系统', sEn:'shares one machine among many programs', sZh:'让很多程序共用一台机器',
     bEn:'built from: programs + hardware rules', bZh:'建于：程序 + 硬件规则',
     tEn:'Windows, macOS, Linux, Android — the referee.',
     tZh:'Windows、macOS、Linux、Android —— 裁判。',
     dEn:'<p>Without an OS, one program owns the whole computer and one crash kills everything. The OS is the referee that gives each program a slice of CPU, its own protected memory, and a polite way to ask for the disk.</p><p>It is also the floor that invented <i>files</i> and <i>folders</i> — a metaphor borrowed from an office cabinet, because there is no such thing as a folder on a disk. There are only numbered blocks and an agreement about which ones belong together.</p>',
     dZh:'<p>没有操作系统，一个程序就独占整台电脑，而一次崩溃会毁掉一切。操作系统是那个裁判：给每个程序分一片 CPU、一块受保护的内存，以及一种礼貌地请求磁盘的方式。</p><p>它也是发明了<i>文件</i>和<i>文件夹</i>的那一层——这个比喻借自办公室的档案柜，因为磁盘上根本不存在"文件夹"这种东西。只有编号的数据块，和一份关于"哪些块属于一起"的约定。</p>'},
    {lv:'07', en:'Programming languages', zh:'编程语言', sEn:'human words for machine instructions', sZh:'给机器指令起的人话名字',
     bEn:'built from: instructions', bZh:'建于：指令',
     tEn:'Python, C, JavaScript — so humans stop writing numbers.',
     tZh:'Python、C、JavaScript —— 让人类不必再写数字。',
     dEn:'<p>Writing raw instruction numbers is possible and unbearable. So people invented languages: you write <code class="inl" style="background:#1e293b;color:var(--ink)">if purity &gt;= 0.95</code> and a translator turns it into the numbers.</p><p><b>This is the exact floor where the C-versus-Python difference lives</b> (Milestone 5). C translates the whole thing once, up front. Python translates each line every time it reaches it. Same tower, different translation strategy — and a 50× speed difference falls out of that one choice.</p>',
     dZh:'<p>直接写指令编号是可行的，也是难以忍受的。于是人们发明了语言：你写 <code class="inl" style="background:#1e293b;color:var(--ink)">if purity &gt;= 0.95</code>，翻译器把它变成那些数字。</p><p><b>C 和 Python 的差别，正好就住在这一层</b>（阶段五）。C 提前把整份东西翻译一次；Python 每次走到某一行才翻译那一行。同一座塔，不同的翻译策略——50 倍的速度差距，就从这一个选择里掉出来。</p>'},
    {lv:'06', en:'Instructions', zh:'指令', sEn:'ADD · MOVE · COMPARE · JUMP', sZh:'加法 · 搬运 · 比较 · 跳转',
     bEn:'built from: numbers', bZh:'建于：数字',
     tEn:'Certain numbers are agreed to mean "do this".',
     tZh:'某些数字被约定为"做这件事"。',
     dEn:'<p>Another agreement, exactly like 65 meaning "A". The chip designers declared that a particular number means <i>add these two things</i>, another means <i>if they are equal, jump elsewhere</i>.</p><p>Add, compare, move, jump. <b>That is essentially the whole instruction set that everything above is built from.</b> Every program you will ever write is a very long, very fast arrangement of those four ideas.</p>',
     dZh:'<p>又是一份约定，和"65 代表 A"完全一样。芯片设计者宣布：某个特定的数字表示<i>把这两个东西相加</i>，另一个表示<i>如果它们相等，就跳到别处去</i>。</p><p>加、比较、搬运、跳转。<b>上面所有东西，基本上就建立在这么一小套指令上。</b>你这辈子写的每一个程序，都是这四个想法的一段极长、极快的排列。</p>'},
    {lv:'05', en:'Letters & pixels', zh:'字母与像素', sEn:'65 means "A" — because we said so', sZh:'65 代表 "A" —— 因为我们这么规定',
     bEn:'built from: numbers + a standard', bZh:'建于：数字 + 一份标准',
     tEn:'ASCII, Unicode, RGB — pure convention.',
     tZh:'ASCII、Unicode、RGB —— 纯粹的约定。',
     dEn:'<p>A number becomes a letter only because a committee wrote it down. A different agreement (RGB) says three numbers are a colour. A grid of those is an image.</p><p><b>This is why text sometimes turns into 中文 gibberish:</b> two systems used different agreements about which number means which letter. The bytes were fine. The convention was mismatched. That is the whole story behind every encoding bug you will ever hit.</p>',
     dZh:'<p>一个数字之所以能变成字母，只因为某个委员会把它写了下来。另一份约定（RGB）说三个数字是一种颜色，这样的一张网格就是一幅图像。</p><p><b>这就是为什么文字有时会变成乱码：</b>两个系统用了不同的约定来规定"哪个数字代表哪个字母"。字节本身没错，是约定对不上。你将来遇到的每一个编码 bug，故事都是这一个。</p>'},
    {lv:'04', en:'Numbers', zh:'数字', sEn:'8 switches = 0 to 255', sZh:'8 个开关 = 0 到 255',
     bEn:'built from: bytes', bZh:'建于：字节',
     tEn:'Counting, in base 2 instead of base 10.',
     tZh:'计数，只是用二进制而不是十进制。',
     dEn:'<p>You count in tens because you have ten fingers. A machine counts in twos because it has one finger that is either up or down.</p><p>Nothing deeper than that is going on. <b>Hexadecimal exists purely because writing <code class="inl" style="background:#1e293b;color:var(--ink)">11111111</code> is tedious and <code class="inl" style="background:#1e293b;color:var(--ink)">0xFF</code> is not.</b> It is shorthand for humans, invented for the comfort of humans.</p>',
     dZh:'<p>你用十进制计数，因为你有十根手指。机器用二进制计数，因为它只有一根手指，而且非抬即放。</p><p>没有比这更深奥的事情在发生。<b>十六进制存在的唯一理由是：写 <code class="inl" style="background:#1e293b;color:var(--ink)">11111111</code> 很烦，而 <code class="inl" style="background:#1e293b;color:var(--ink)">0xFF</code> 不烦。</b>它是给人看的速记，为人类的舒适而发明。</p>'},
    {lv:'03', en:'A byte', zh:'字节', sEn:'eight switches, grouped', sZh:'八个开关，打成一组',
     bEn:'built from: bits', bZh:'建于：比特',
     tEn:'8 bits = 256 possible combinations.',
     tZh:'8 比特 = 256 种可能组合。',
     dEn:'<p>One switch gives you 2 options. Two switches give 4. Eight give 256 — enough for every letter, digit and punctuation mark in English, which is exactly why 8 was chosen.</p><p>Every file size you have ever seen — KB, MB, GB — is just a count of these little groups of eight. <b>A 5 MB photo is forty million switches.</b></p>',
     dZh:'<p>一个开关给你 2 种可能，两个给 4 种，八个给 256 种——刚好够放下英文的所有字母、数字和标点，而这正是当年选 8 的原因。</p><p>你见过的每一个文件大小——KB、MB、GB——都只是在数这些八个一组的小组有多少。<b>一张 5 MB 的照片，就是四千万个开关。</b></p>'},
    {lv:'02', en:'A bit', zh:'比特', sEn:'0 or 1 — the only word the machine knows', sZh:'0 或 1 —— 机器唯一认识的词',
     bEn:'built from: one switch', bZh:'建于：一个开关',
     tEn:'The smallest possible piece of information.',
     tZh:'信息可能存在的最小单位。',
     dEn:'<p>A bit is a single answer to a single yes-or-no question. That is the smallest amount of information that can exist — you cannot have half an answer.</p><p><b>Everything above this floor is bits arranged cleverly.</b> Your photos, your bank balance, this sentence, the model that helped write it. All of it, arrangements of yes and no.</p>',
     dZh:'<p>一个比特，就是对一个是非问题的一次回答。那是信息能存在的最小量——你没法拥有半个答案。</p><p><b>这一层之上的一切，都只是被巧妙排列的比特。</b>你的照片、你的银行余额、这句话、以及帮忙写下它的那个模型。全都是"是"与"否"的排列。</p>'},
    {lv:'01', en:'A switch', zh:'一个开关', sEn:'a transistor: off, or on', sZh:'一个晶体管：关，或开',
     bEn:'built from: physics', bZh:'建于：物理',
     tEn:'The bottom. There is nothing below this.',
     tZh:'最底层。它下面什么都没有了。',
     dEn:'<p>A transistor is a switch with no moving parts: a small voltage decides whether current flows. Off, or on. That is the entire vocabulary of the machine.</p><p>A modern phone chip contains <b>somewhere around twenty billion of them</b>, switching billions of times a second. Every floor above — the OS, the browser, the database, the AI — is a story told with nothing but these.</p><p>When somebody tells you computing is magic, this is the honest reply: <b>it is arithmetic, done by rocks we taught to hold a charge, arranged in layers by people who each had to invent new words.</b></p>',
     dZh:'<p>晶体管是一个没有活动部件的开关：一个小电压决定电流通不通。关，或者开。这就是机器的全部词汇。</p><p>一颗现代手机芯片里大约有<b>两百亿个</b>这样的开关，每秒切换几十亿次。上面每一层——操作系统、浏览器、数据库、AI——都是只用这些东西讲出来的故事。</p><p>当有人跟你说计算是魔法时，诚实的回答是：<b>它是算术，由一堆我们教会了存住电荷的石头完成，再由一群不得不各自发明新词的人，一层层堆起来。</b></p>'}
  ];
  host.innerHTML = F.map(function(f,i){
    return '<button class="floor" data-i="'+i+'">'
      + '<span class="lv">'+f.lv+'</span>'
      + '<span class="nm">' + bi(f.en, f.zh) + '<small>' + bi(f.sEn, f.sZh) + '</small></span>'
      + '<span class="built">' + bi(f.bEn, f.bZh) + '</span></button>';
  }).join('');
  function show(i){
    var f = F[i];
    $$('.floor', host).forEach(function(b,j){ b.classList.toggle('on', i === j) });
    det.innerHTML = '<h4>' + bi(f.lv + ' · ' + f.en + ' — ' + f.tEn, f.lv + ' · ' + f.zh + ' —— ' + f.tZh) + '</h4>'
      + bi(f.dEn, f.dZh);
  }
  host.addEventListener('click', function(e){
    var b = e.target.closest('.floor'); if (!b) return;
    show(+b.dataset.i);
  });
  show(F.length - 1);
})();
}catch(_e){console.warn("[widget skipped] the tower:", _e && _e.message)}

/* ================= PLAYGROUND 11 · terminal ================= */
try{
(function(){
  var out = $('#t-out'); if (!out) return;
  var inp = $('#t-in'), ps = $('#t-ps'), gbody = $('#g-body'), gpath = $('#g-path');
  var zh = function(){ return document.body.classList.contains('lang-zh') };

  var SAMPLES = 'sample_id,lab_site,collected_at,purity,volume_ml,result\n'
    + 'S-001,IPOH,2026-03-14,0.98,2.4,PASS\n'
    + 'S-002,IPOH,2026-03-14,0.91,3.0,FAIL\n'
    + 'S-003,IPOH,2026-03-15,0.99,0.4,FAIL\n'
    + 'S-004,PENANG,2026-03-15,0.96,1.8,PASS\n'
    + 'S-005,PENANG,2026-03-15,0.97,2.2,PASS\n'
    + 'S-006,PENANG,2026-03-16,0.99,2.0,PASS\n'
    + 'S-007,IPOH,2026-03-16,0.88,2.6,FAIL\n'
    + 'S-008,IPOH,2026-03-16,0.95,2.1,PASS\n';
  var PIPE = '#!/usr/bin/env python3\n'
    + '"""Nightly QC pipeline. Runs at 02:00 via cron."""\n'
    + 'import pandas as pd\n\n'
    + 'df = pd.read_csv("samples.csv", parse_dates=["collected_at"])\n'
    + 'df["lab_site"] = df["lab_site"].str.strip().str.upper()\n'
    + 'df = df.drop_duplicates(subset=["sample_id"])\n\n'
    + 'assert 1 < len(df) < 100000, "row count out of range"\n'
    + 'assert df["sample_id"].notna().all(), "missing sample_id"\n\n'
    + 'print(df.groupby("lab_site")["result"].value_counts())\n';
  var NOTES = '# Handover notes\n\n'
    + '- Pipeline runs nightly at 02:00 (cron).\n'
    + '- Purity threshold changed 0.90 -> 0.95 in March.\n'
    + '- If the job fails: check logs/nightly.log first, then df -h.\n'
    + '- Raw files land in data/ and are NEVER edited by hand.\n';
  var LOG = '2026-03-17 02:00:01 INFO  starting nightly run\n'
    + '2026-03-17 02:00:01 INFO  extracting from lab-api...\n'
    + '2026-03-17 02:00:12 INFO  pulled 8 rows\n'
    + '2026-03-17 02:00:12 INFO  validating...\n'
    + '2026-03-17 02:00:13 INFO  8 rows passed validation\n'
    + '2026-03-17 02:00:14 INFO  loading into warehouse\n'
    + '2026-03-17 02:00:41 ERROR failed to write: no space left on device\n'
    + '2026-03-17 02:00:41 ERROR run aborted after 40s\n';

  var FS = {name:'~', dir:true, kids:{
    'samples.csv': {size:412, txt:SAMPLES},
    'pipeline.py': {size:531, txt:PIPE},
    'notes.md'   : {size:268, txt:NOTES},
    'data': {dir:true, kids:{
      'raw_2026-03-14.csv': {size:1204, txt:'sample_id,value\nS-001,0.98\nS-002,0.91\n'},
      'raw_2026-03-15.csv': {size:1310, txt:'sample_id,value\nS-003,0.99\nS-004,0.96\n'}
    }},
    'logs': {dir:true, kids:{ 'nightly.log': {size:498, txt:LOG} }}
  }};
  var cwd = [];
  function node(){ var n = FS; cwd.forEach(function(p){ n = n.kids[p] }); return n; }
  function pathStr(){ return '~' + (cwd.length ? '/' + cwd.join('/') : ''); }
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function print(html){ out.innerHTML += html + '\n'; out.scrollTop = out.scrollHeight; }

  function renderGui(){
    var n = node();
    gpath.textContent = '/home/diao' + (cwd.length ? '/' + cwd.join('/') : '');
    var keys = Object.keys(n.kids || {});
    gbody.innerHTML = (cwd.length ? '<div class="gfile"><span class="ic2 dir"></span><span>..</span></div>' : '')
      + keys.map(function(k){
          var f = n.kids[k];
          return '<div class="gfile"><span class="ic2' + (f.dir ? ' dir' : '') + '"></span><span>' + esc(k) + '</span>'
            + '<small>' + (f.dir ? (zh() ? '文件夹' : 'folder') : (f.size + ' B')) + '</small></div>';
        }).join('');
    ps.textContent = 'diao@lab-server:' + pathStr() + '$';
  }

  /* ---- individual commands: (args, stdin) -> {o: text, e: error} ---- */
  function ls(args){
    var n = node(), keys = Object.keys(n.kids || {});
    var long = args.some(function(a){ return a.indexOf('l') > -1 && a[0] === '-' });
    var all  = args.some(function(a){ return a.indexOf('a') > -1 && a[0] === '-' });
    if (all) keys = ['.', '..'].concat(keys);
    if (!long) return {o: keys.join('  ')};
    return {o: keys.map(function(k){
      var f = (n.kids || {})[k];
      if (!f) return 'drwxr-xr-x  2 diao diao    4096 Mar 17 09:02 ' + k;
      return (f.dir ? 'drwxr-xr-x' : '-rw-r--r--') + '  2 diao diao ' + String(f.dir ? 4096 : f.size).padStart(7,' ')
        + ' Mar 17 09:02 ' + k;
    }).join('\n')};
  }
  function readFile(name){
    var f = (node().kids || {})[name];
    if (!f) return {e: name + ': No such file or directory'};
    if (f.dir) return {e: name + ': Is a directory'};
    return {o: f.txt};
  }
  var CMDS = {
    help: function(){
      return {o: zh()
        ? '可以试试这些命令：\n\n'
          + '  pwd              我在哪个文件夹\n'
          + '  ls / ls -l       列出文件（-l 显示大小和日期）\n'
          + '  cd data / cd ..  进入 / 返回上一层\n'
          + '  cat 文件         打印整个文件\n'
          + '  head -n 3 文件   只看前 3 行\n'
          + '  wc -l 文件       数有多少行\n'
          + '  grep FAIL 文件   找出含 FAIL 的行\n'
          + '  sort / uniq -c   排序 / 统计每个值出现几次\n'
          + '  df -h  free -h   磁盘 / 内存还剩多少\n'
          + '  ps aux           什么程序在跑\n'
          + '  python3 pipeline.py   运行脚本\n'
          + '  history  clear   历史记录 / 清屏\n\n'
          + '  用管道把它们串起来：  grep FAIL samples.csv | wc -l\n'
        : 'Try any of these:\n\n'
          + '  pwd              which folder am I in\n'
          + '  ls / ls -l       list files (-l shows size and date)\n'
          + '  cd data / cd ..  go in / go back up\n'
          + '  cat FILE         print the whole file\n'
          + '  head -n 3 FILE   just the first 3 lines\n'
          + '  wc -l FILE       count the lines\n'
          + '  grep FAIL FILE   show lines containing FAIL\n'
          + '  sort / uniq -c   sort / count each distinct value\n'
          + '  df -h  free -h   disk / memory remaining\n'
          + '  ps aux           what is running\n'
          + '  python3 pipeline.py   run the script\n'
          + '  history  clear   command history / clear screen\n\n'
          + '  Join them with a pipe:  grep FAIL samples.csv | wc -l\n'};
    },
    pwd: function(){ return {o: '/home/diao' + (cwd.length ? '/' + cwd.join('/') : '')}; },
    ls: ls, dir: ls,
    cd: function(a){
      var t = a[0];
      if (!t || t === '~') { cwd = []; return {o:''}; }
      if (t === '..') { cwd.pop(); return {o:''}; }
      if (t === '.') return {o:''};
      var f = (node().kids || {})[t.replace(/\/$/,'')];
      if (!f) return {e: 'cd: ' + t + ': No such file or directory'};
      if (!f.dir) return {e: 'cd: ' + t + ': Not a directory'};
      cwd.push(t.replace(/\/$/,'')); return {o:''};
    },
    cat: function(a, stdin){
      if (!a.length) return {o: stdin || ''};
      return readFile(a[0]);
    },
    head: function(a, stdin){
      var n = 10, i = a.indexOf('-n'); if (i > -1){ n = +a[i+1]; a = a.slice(0,i).concat(a.slice(i+2)); }
      var r = a.length ? readFile(a[0]) : {o: stdin || ''};
      if (r.e) return r;
      return {o: r.o.replace(/\n$/,'').split('\n').slice(0,n).join('\n')};
    },
    tail: function(a, stdin){
      var n = 10, i = a.indexOf('-n'); if (i > -1){ n = +a[i+1]; a = a.slice(0,i).concat(a.slice(i+2)); }
      var r = a.length ? readFile(a[0]) : {o: stdin || ''};
      if (r.e) return r;
      var L = r.o.replace(/\n$/,'').split('\n');
      return {o: L.slice(Math.max(0, L.length - n)).join('\n')};
    },
    wc: function(a, stdin){
      var lines = a.indexOf('-l') > -1; a = a.filter(function(x){ return x[0] !== '-' });
      var r = a.length ? readFile(a[0]) : {o: stdin || ''};
      if (r.e) return r;
      var txt = r.o.replace(/\n$/,''), n = txt ? txt.split('\n').length : 0;
      return {o: lines ? String(n) : ('  ' + n + '  ' + txt.split(/\s+/).filter(Boolean).length + '  ' + r.o.length)};
    },
    grep: function(a, stdin){
      var ci = a.indexOf('-i') > -1, only = a.indexOf('-c') > -1;
      a = a.filter(function(x){ return x[0] !== '-' });
      var pat = a[0]; if (!pat) return {e:'usage: grep PATTERN [FILE]'};
      var r = a.length > 1 ? readFile(a[1]) : {o: stdin || ''};
      if (r.e) return r;
      var m = r.o.split('\n').filter(function(l){
        return ci ? l.toLowerCase().indexOf(pat.toLowerCase()) > -1 : l.indexOf(pat) > -1;
      }).filter(function(l){ return l !== '' });
      return {o: only ? String(m.length) : m.join('\n')};
    },
    sort: function(a, stdin){
      var r = a.filter(function(x){return x[0]!=='-'}).length ? readFile(a[0]) : {o: stdin || ''};
      if (r.e) return r;
      return {o: r.o.replace(/\n$/,'').split('\n').sort().join('\n')};
    },
    uniq: function(a, stdin){
      var c = a.indexOf('-c') > -1;
      var L = (stdin || '').replace(/\n$/,'').split('\n');
      var res = [], last = null, n = 0;
      L.forEach(function(l){
        if (l === last) n++;
        else { if (last !== null) res.push(c ? ('   ' + n + ' ' + last) : last); last = l; n = 1; }
      });
      if (last !== null) res.push(c ? ('   ' + n + ' ' + last) : last);
      return {o: res.join('\n')};
    },
    cut: function(a, stdin){
      var d = ',', fi = a.indexOf('-f'), f = fi > -1 ? +a[fi+1] : 1;
      var di = a.indexOf('-d'); if (di > -1) d = a[di+1].replace(/['"]/g,'');
      var r = (stdin != null && stdin !== '') ? {o:stdin} : readFile(a[a.length-1]);
      if (r.e) return r;
      return {o: r.o.replace(/\n$/,'').split('\n').map(function(l){ return (l.split(d)[f-1] || '') }).join('\n')};
    },
    whoami: function(){ return {o:'diao'}; },
    date:   function(){ return {o:'Tue Mar 17 09:04:12 +08 2026'}; },
    uname:  function(){ return {o:'Linux lab-server 6.8.0-45-generic x86_64 GNU/Linux'}; },
    df: function(){
      return {o:'Filesystem      Size  Used Avail Use% Mounted on\n'
        + '/dev/root       194G  194G     0 100% /\n'
        + '/dev/sdb1       500G  212G  288G  43% /data\n'
        + 'tmpfs            16G  1.2G   15G   8% /dev/shm'};
    },
    free: function(){
      return {o:'               total        used        free      shared\n'
        + 'Mem:            31Gi       9.4Gi        18Gi       412Mi\n'
        + 'Swap:          8.0Gi          0B       8.0Gi'};
    },
    ps: function(){
      return {o:'USER   PID  %CPU %MEM COMMAND\n'
        + 'root     1   0.0  0.1 /sbin/init\n'
        + 'postgres 812 2.1  6.4 postgres: main writer\n'
        + 'diao    2941 0.0  0.2 -bash\n'
        + 'diao    3388 97.4 21.7 python3 pipeline.py\n'
        + 'diao    3402 0.0  0.0 ps aux'};
    },
    top: function(){
      return {o:'top - 09:04:31 up 41 days,  2:12,  1 user,  load average: 3.11, 2.84, 2.40\n'
        + 'Tasks: 214 total,   2 running, 212 sleeping\n'
        + '%Cpu(s): 78.2 us,  4.1 sy, 17.7 id\n'
        + 'MiB Mem : 31890 total,  18240 free,   9612 used\n\n'
        + '  PID USER   %CPU %MEM COMMAND\n'
        + ' 3388 diao   97.4 21.7 python3 pipeline.py\n'
        + '  812 postgr  2.1  6.4 postgres'};
    },
    echo: function(a){ return {o: a.join(' ').replace(/^["']|["']$/g,'')}; },
    mkdir: function(a){
      if (!a[0]) return {e:'mkdir: missing operand'};
      node().kids[a[0]] = {dir:true, kids:{}};
      return {o:''};
    },
    touch: function(a){
      if (!a[0]) return {e:'touch: missing file operand'};
      if (!node().kids[a[0]]) node().kids[a[0]] = {size:0, txt:''};
      return {o:''};
    },
    python3: function(a){
      if (a[0] !== 'pipeline.py') return {e: 'python3: can\'t open file \'' + (a[0]||'') + '\': No such file or directory'};
      if (cwd.length) return {e: 'python3: can\'t open file \'pipeline.py\': No such file or directory'};
      return {o:'lab_site  result\nIPOH      PASS     2\n          FAIL     3\nPENANG    PASS     3\nName: count, dtype: int64'};
    },
    python: function(a){ return CMDS.python3(a); },
    rm: function(){
      return {e: zh()
        ? 'rm: 这个演示里故意禁用了删除。\n\n真实的 shell 会毫不犹豫地照做 —— 没有确认，没有回收站，没有撤销。\n这正是「按回车前先读一遍」这条规矩存在的原因。'
        : 'rm: deletion is deliberately disabled in this demo.\n\nA real shell would just do it — no confirmation, no recycle bin, no undo.\nThat is exactly why the "read it before you press Enter" rule exists.'};
    },
    sudo: function(a){
      return {e: zh()
        ? 'sudo: 这个演示里没有管理员权限。\n\nsudo 的意思是「以超级用户身份执行这条命令」。它会解除所有保护。\n真实环境里：先弄懂那条命令，再加 sudo。'
        : 'sudo: no administrator rights in this demo.\n\nsudo means "run this as the superuser". It removes every guard rail.\nIn real life: understand the command first, then add sudo.'};
    },
    history: function(){ return {o: hist.map(function(h,i){ return String(i+1).padStart(4,' ') + '  ' + h }).join('\n')}; },
    man: function(a){ return {o: (zh()?'man: 这个演示里没有手册页。试试 ':'man: no manual pages in this demo. Try ') + 'help'}; },
    clear: function(){ out.innerHTML = ''; return {o:'', silent:true}; }
  };

  function runOne(cmdline, stdin){
    var parts = cmdline.trim().match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    if (!parts.length) return {o:''};
    var name = parts[0], args = parts.slice(1);
    var fn = CMDS[name];
    if (!fn) return {e: name + ': command not found' + (zh() ? '  —— 输入 help 看可用命令' : '  — type help to see what works here')};
    return fn(args, stdin) || {o:''};
  }
  function run(line){
    var segs = line.split('|');
    var stdin = '', res = {o:''};
    for (var i = 0; i < segs.length; i++){
      res = runOne(segs[i], stdin);
      if (res.e) return res;
      stdin = res.o;
    }
    return res;
  }

  var hist = [], hi = -1;
  function submit(line){
    print('<span class="ps">' + esc(ps.textContent) + '</span> <span class="cmd">' + esc(line) + '</span>');
    if (!line.trim()) return;
    hist.push(line); hi = hist.length;
    var r = run(line);
    if (r.e) print('<span class="err">' + esc(r.e) + '</span>');
    else if (r.o) print(esc(r.o));
    renderGui();
  }
  inp.addEventListener('keydown', function(e){
    if (e.key === 'Enter'){ var v = inp.value; inp.value = ''; submit(v); }
    else if (e.key === 'ArrowUp'){ if (hi > 0){ hi--; inp.value = hist[hi]; } e.preventDefault(); }
    else if (e.key === 'ArrowDown'){ if (hi < hist.length - 1){ hi++; inp.value = hist[hi]; } else { hi = hist.length; inp.value = ''; } e.preventDefault(); }
  });
  $$('[data-cmd]').forEach(function(b){
    b.addEventListener('click', function(){ inp.value = ''; submit(b.dataset.cmd); inp.focus(); });
  });
  out.addEventListener('click', function(){ inp.focus() });
  function boot(){
    out.innerHTML = '';
    print('<span class="dim">' + esc(zh()
      ? 'Ubuntu 24.04.2 LTS  ·  最后登录：周二 3月17日 08:58\n这是一台没有屏幕的服务器。你只能通过打字够到它。\n输入 help 看看能做什么。'
      : 'Ubuntu 24.04.2 LTS  ·  Last login: Tue Mar 17 08:58\nThis is a server with no screen. Typing is the only way in.\nType help to see what you can do.') + '</span>');
    renderGui();
  }
  $$('.langsw button').forEach(function(b){ b.addEventListener('click', function(){ setTimeout(boot, 10) }) });
  boot();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 11 · terminal:", _e && _e.message)}

/* ================= the hosting ladder ================= */
try{
(function(){
  var host = $('#ladder'); if (!host) return;
  var det = $('#rungdetail');
  var R = [
    {n:'01', en:'Your laptop', zh:'你的笔记本', sEn:'localhost:5000 — only you can see it', sZh:'localhost:5000 —— 只有你看得见',
     wEn:'every project, day 1', wZh:'每个项目的第一天',
     dEn:'<p>When you run <b>python app.py</b> and open <b>localhost:5000</b>, you are the server. The app exists only while that terminal window is open, and only your machine can reach it.</p><p><b>Why this is not enough:</b> close the lid and it is gone. Nobody else can use it. It is a rehearsal, not a performance — and that is completely fine for weeks.</p>',
     dZh:'<p>当你运行 <b>python app.py</b> 然后打开 <b>localhost:5000</b>，你就是那台服务器。应用只在那个终端窗口开着的时候存在，而且只有你的机器能访问它。</p><p><b>为什么这不够：</b>合上盖子它就没了，别人也用不了。这是彩排，不是演出——而且在好几周里，这完全没问题。</p>'},
    {n:'02', en:'One rented server', zh:'一台租来的服务器', sEn:'a VPS: ~$10/month, you install everything', sZh:'一台 VPS：约每月 10 美元，什么都自己装',
     wEn:'most small companies', wZh:'大多数小公司',
     dEn:'<p>You rent one Linux machine in a data centre. You <b>ssh</b> in, install Python and Postgres yourself, copy your code across, and start it. It stays on. It has an address on the internet. Real users can now use your thing.</p><p><b>What you now own:</b> security updates, backups, disk space, restarting it when it dies. <b>What it costs:</b> almost nothing in money, real time in attention.</p><p>An enormous number of working businesses live here permanently, and there is nothing wrong with that.</p>',
     dZh:'<p>你在数据中心租一台 Linux 机器。你 <b>ssh</b> 进去，自己装 Python 和 Postgres，把代码拷进去，启动它。它一直开着，有一个互联网地址。真实用户现在可以用你的东西了。</p><p><b>你现在要负责的：</b>安全更新、备份、磁盘空间、挂掉时重启。<b>代价：</b>钱几乎不花，但要花掉真实的注意力。</p><p>大量正常运转的生意永久地住在这一级，而且这一点问题都没有。</p>'},
    {n:'03', en:'A managed platform', zh:'托管平台', sEn:'you push code, they run it', sZh:'你推代码，他们负责跑',
     wEn:'startups, internal tools', wZh:'创业公司、内部工具',
     dEn:'<p>Render, Railway, Vercel, Fly, App Runner. You connect your GitHub repo. You push a commit; ninety seconds later the new version is live. You never touch a server.</p><p><b>What you gave up:</b> control, and a little money. <b>What you got back:</b> you stopped being a part-time system administrator, which for a small team is usually the correct trade.</p>',
     dZh:'<p>Render、Railway、Vercel、Fly、App Runner。你把 GitHub 仓库连上去，推一次提交，九十秒后新版本就上线了。你从头到尾没碰过服务器。</p><p><b>你放弃的：</b>控制权，和一点钱。<b>你换回的：</b>不再兼职当系统管理员——对小团队来说，这通常是正确的交易。</p>'},
    {n:'04', en:'Containers (Docker)', zh:'容器（Docker）', sEn:'a sealed box that runs the same everywhere', sZh:'一个到哪都表现一致的密封盒子',
     wEn:'almost everyone, eventually', wZh:'几乎所有人最终都会走到这',
     dEn:'<p>A container packs your code <i>and</i> the exact Python version, the exact libraries, the exact system settings into one sealed image. That image behaves identically on your laptop, on a test server and in production.</p><p><b>The problem it kills:</b> "it works on my machine." Which was, for about thirty years, the single most expensive sentence in software.</p><p><b>What it is not:</b> a whole computer. It shares the machine\'s operating system, which is why it starts in under a second while a virtual machine takes a minute.</p>',
     dZh:'<p>容器把你的代码<i>连同</i>确切的 Python 版本、确切的依赖库、确切的系统配置，打包成一个密封镜像。这个镜像在你的笔记本、测试服务器和生产环境上表现完全一致。</p><p><b>它消灭的问题：</b>"在我机器上是好的"。这句话在大约三十年里，是软件行业最贵的一句话。</p><p><b>它不是什么：</b>它不是一整台电脑。它共用宿主机的操作系统，所以它一秒内就能启动，而虚拟机要一分钟。</p>'},
    {n:'05', en:'Orchestration (Kubernetes)', zh:'容器编排（Kubernetes）', sEn:'many containers, healing themselves', sZh:'很多容器，而且会自我修复',
     wEn:'large companies', wZh:'大公司',
     dEn:'<p>Once you have hundreds of containers across dozens of machines, somebody has to decide which container runs where, restart the ones that die, add more when traffic rises, and route requests to whichever ones are healthy. Kubernetes is that somebody.</p><p><b>You describe the destination, not the route:</b> "I want 6 copies of this, each with 2 GB of memory, always reachable." It continuously makes reality match that description.</p><p><b>The honest warning:</b> it is genuinely complex, and adopting it for three services is a well-known and expensive mistake. Do not go looking for it. It will find you.</p>',
     dZh:'<p>当你有几百个容器分布在几十台机器上时，总得有人决定哪个容器跑在哪、把挂掉的重启、流量上来时加更多、并把请求路由到健康的那些。Kubernetes 就是那个"有人"。</p><p><b>你描述的是目的地，不是路线：</b>"我要这个东西的 6 个副本，每个 2 GB 内存，随时可访问。"它会持续地让现实符合这段描述。</p><p><b>诚实的警告：</b>它真的很复杂，为三个服务就上它是一个众所周知且昂贵的错误。别去找它，它会来找你。</p>'},
    {n:'06', en:'Serverless', zh:'无服务器（Serverless）', sEn:'no server to think about at all', zhS:'', sZh:'完全不用想服务器这件事',
     wEn:'event-driven jobs, spiky work', wZh:'事件驱动任务、尖峰型负载',
     dEn:'<p>AWS Lambda, Azure Functions. You upload a single function. It runs when something triggers it — a file lands, a message arrives, an hour passes — and you are billed per millisecond of execution. Between runs, you pay nothing at all.</p><p><b>There is still a server.</b> Of course there is. You just never see it, name it, or patch it. The name means "not your problem," not "absent."</p><p><b>Where it shines for data work:</b> a job that runs 40 times a day for 3 seconds. Renting a whole machine for that is absurd; this costs cents.</p>',
     dZh:'<p>AWS Lambda、Azure Functions。你上传一个函数。有事件触发时它就跑——文件落地、消息到达、整点到了——然后按执行的毫秒数计费。两次运行之间，你一分钱都不付。</p><p><b>服务器当然还在。</b>只是你永远不会看见它、给它起名字、或者给它打补丁。这个词的意思是"不归你管"，不是"不存在"。</p><p><b>它在数据工作里最闪光的地方：</b>一个每天跑 40 次、每次 3 秒的任务。为它租一整台机器很荒唐，而这样只要几分钱。</p>'}
  ];
  host.innerHTML = R.map(function(r,i){
    return '<button class="rung" data-i="'+i+'"><span class="n2">'+r.n+'</span>'
      + '<span class="nm">' + bi(r.en, r.zh) + '<small>' + bi(r.sEn, r.sZh) + '</small></span>'
      + '<span class="who">' + bi(r.wEn, r.wZh) + '</span></button>';
  }).join('');
  function show(i){
    var r = R[i];
    $$('.rung', host).forEach(function(b,j){ b.classList.toggle('on', i === j) });
    det.innerHTML = '<h4>' + bi(r.n + ' · ' + r.en, r.n + ' · ' + r.zh) + '</h4>' + bi(r.dEn, r.dZh);
  }
  host.addEventListener('click', function(e){ var b = e.target.closest('.rung'); if (b) show(+b.dataset.i) });
  show(1);
})();
}catch(_e){console.warn("[widget skipped] the hosting ladder:", _e && _e.message)}

/* ================= architecture showcase ================= */
try{
(function(){
  var tabs = $('#showtabs'); if (!tabs) return;
  var box = $('#showbox');
  var B = function(x,y,w,h,fill,stroke){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="'+(fill||'var(--tint-paper)')+'" stroke="'+(stroke||'var(--line)')+'" stroke-width="1.5"/>' };
  var T = function(x,y,t,cls,anchor){ return '<text x="'+x+'" y="'+y+'" class="'+(cls||'sv-lbl')+'" text-anchor="'+(anchor||'middle')+'">'+t+'</text>' };
  var L = function(x1,y1,x2,y2,dash){ return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="var(--line)" stroke-width="2"'+(dash?' stroke-dasharray="4 4"':'')+'/>' };

  var MZ = {web:['#4f46e5','Browser / web page','浏览器 / 网页'],app:['#4f46e5','Mobile app','手机 App'],net:['#0369a1','The network — HTTP, DNS, TLS','网络 —— HTTP、DNS、TLS'],lb:['#0d9488','Load balancer','负载均衡'],api:['#0d9488','Backend API','后端 API'],cache:['#0d9488','Cache','缓存'],db:['#9333ea','Live (production) database','生产数据库'],ing:['#d97706','Ingestion / event stream','数据接入 / 事件流'],etl:['#d97706','Pipelines (ETL / ELT)','数据管道（ETL / ELT）'],wh:['#d97706','Warehouse — modelled tables','数据仓库 —— 建模好的表'],bi:['#e11d48','Dashboards, reports, ML models','看板、报表、机器学习模型'],linux:['#64748b','Linux / the operating system','Linux / 操作系统'],cont:['#64748b','Containers (Docker)','容器（Docker）'],cloud:['#64748b','Cloud (AWS, Azure, GCP)','云（AWS、Azure、GCP）'],netw:['#64748b','Networking','网络'],sec:['#64748b','Security','安全'],git:['#64748b','Git and CI/CD','Git 与持续交付']};
  var S = [
  {
    key:'grab', zones:['app','net','lb','api','cache','db','ing','etl','wh','bi','cloud','sec'], en:'Grab', zh:'Grab', tEn:'the superapp', tZh:'超级 App', color:'#00b14f',
    hEn:'Grab', hZh:'Grab', subEn:'Southeast Asia · rides, food, payments in one app', subZh:'东南亚 · 打车、外卖、支付合一',
    stats:[['54M', 'monthly transacting users (Q2 2026)', '月活交易用户（2026 Q2）'],
           ['8', 'countries, 900+ cities', '个国家，900+ 城市'],
           ['&lt;1s', 'to match a rider to a driver', '完成乘客与司机匹配'],
           ['24/7', 'never stops, ever', '永不停机']],
    svg: (function(){
      var s = '';
      s += B(20,90,120,60) + T(80,116,'<tspan class="en">Rider app</tspan><tspan class="zh">乘客 App</tspan>','sv-ttl') + T(80,136,'<tspan class="en">phone</tspan><tspan class="zh">手机</tspan>','sv-sm');
      s += B(20,10,120,60) + T(80,36,'<tspan class="en">Driver app</tspan><tspan class="zh">司机 App</tspan>','sv-ttl') + T(80,56,'<tspan class="en">GPS every few sec</tspan><tspan class="zh">每几秒上报 GPS</tspan>','sv-sm');
      s += L(140,120,210,120) + L(140,40,210,90);
      s += B(210,80,130,80,'var(--tint-ok)','#00b14f') + T(275,110,'<tspan class="en">API gateway</tspan><tspan class="zh">API 网关</tspan>','sv-ttl') + T(275,130,'<tspan class="en">auth · routing</tspan><tspan class="zh">鉴权 · 路由</tspan>','sv-sm') + T(275,146,'<tspan class="en">rate limits</tspan><tspan class="zh">限流</tspan>','sv-sm');
      s += L(340,120,400,120);
      s += B(400,80,150,80,'var(--tint-ok)','#00b14f') + T(475,108,'<tspan class="en">Allocation engine</tspan><tspan class="zh">派单引擎</tspan>','sv-ttl') + T(475,128,'<tspan class="en">who is nearest?</tspan><tspan class="zh">谁最近？</tspan>','sv-sm') + T(475,144,'<tspan class="en">must answer in ms</tspan><tspan class="zh">必须毫秒级作答</tspan>','sv-sm');
      s += B(400,10,150,55) + T(475,32,'<tspan class="en">Live driver map</tspan><tspan class="zh">实时司机地图</tspan>','sv-ttl') + T(475,52,'<tspan class="en">in memory, geo-indexed</tspan><tspan class="zh">内存中，地理索引</tspan>','sv-sm');
      s += L(475,65,475,80);
      s += B(400,180,150,55,'var(--tint-warn)','#d97706') + T(475,202,'<tspan class="en">Event stream (Kafka)</tspan><tspan class="zh">事件流（Kafka）</tspan>','sv-ttl') + T(475,222,'<tspan class="en">every tap, every ping</tspan><tspan class="zh">每一次点击与定位</tspan>','sv-sm');
      s += L(475,160,475,180,true);
      s += L(550,207,610,207,true);
      s += B(610,180,170,55) + T(695,202,'<tspan class="en">Data lake + ML</tspan><tspan class="zh">数据湖 + 机器学习</tspan>','sv-ttl') + T(695,222,'<tspan class="en">pricing · ETA · fraud</tspan><tspan class="zh">定价 · 预计到达 · 风控</tspan>','sv-sm');
      s += L(550,120,610,120);
      s += B(610,90,170,60) + T(695,116,'<tspan class="en">Payments &amp; wallet</tspan><tspan class="zh">支付与钱包</tspan>','sv-ttl') + T(695,136,'<tspan class="en">must never lose a cent</tspan><tspan class="zh">一分钱都不能丢</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>Treat the whole city as a live, in-memory map — and never ask the database.</b></p><p>Every driver reports their position every few seconds. If a rider request triggered a database query over millions of rows, matching would take seconds and feel broken. Instead the current position of every driver is held <b>in memory</b>, in a geospatial index that can answer "who is within 2 km of this point?" in well under a millisecond.</p><p>The database is still there — but it is for what <i>happened</i>, not for what <i>is happening</i>. That split, between live state and recorded history, is the shape of almost every real-time system you will ever meet.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>把整座城市当成一张活的、在内存里的地图 —— 永远不去问数据库。</b></p><p>每个司机每隔几秒上报一次位置。如果一次叫车请求要去数据库里查上百万行，匹配就得花好几秒，用起来像坏了。于是所有司机的当前位置被保存<b>在内存里</b>，用地理索引组织，能在远低于一毫秒的时间里回答"谁在这个点 2 公里以内"。</p><p>数据库仍然在——但它负责的是<i>已经发生的事</i>，不是<i>正在发生的事</i>。"活状态"和"历史记录"的这种分离，是你将来遇到的几乎所有实时系统的共同形状。</p>',
    jobEn:'<b>What a data engineer does here:</b> owns the event stream and everything downstream of it. Every tap, ride, cancellation and payment becomes an event; you make sure they arrive exactly once, land in the warehouse in a modelled shape, and can be trusted by the teams pricing rides and detecting fraud. When someone asks "why did surge pricing trigger in Ipoh at 6pm," the answer comes out of the tables you built.',
    jobZh:'<b>数据工程师在这里做什么：</b>负责事件流以及它下游的一切。每一次点击、行程、取消、支付都变成一个事件；你要保证它们不重不漏地到达、以建模好的形状落进数仓、并且能被做定价和风控的团队信任。当有人问"为什么怡保下午六点触发了动态加价"，答案就出自你建的那些表。'
  },
  {
    key:'netflix', zones:['web','app','net','lb','api','cache','db','ing','wh','bi','cloud','cont'], en:'Netflix', zh:'Netflix', tEn:'streaming at planet scale', tZh:'行星级流媒体', color:'#e50914',
    hEn:'Netflix', hZh:'Netflix', subEn:'Over 325 million paid memberships', subZh:'超过 3.25 亿付费会员',
    stats:[['325M+', 'paid memberships (Q4 2025)', '付费会员（2025 Q4）'],
           ['190+', 'countries', '个国家'],
           ['~2 sec', 'from press play to picture', '从按下播放到出画面'],
           ['0', 'video files served from Netflix itself', '视频文件由 Netflix 自己发出的数量']],
    svg: (function(){
      var s = '';
      s += B(20,95,120,60) + T(80,121,'<tspan class="en">Your TV</tspan><tspan class="zh">你的电视</tspan>','sv-ttl') + T(80,141,'<tspan class="en">or phone</tspan><tspan class="zh">或手机</tspan>','sv-sm');
      s += L(140,110,240,60) + L(140,140,240,190);
      s += B(240,20,200,80,'var(--tint-m5)','#e50914') + T(340,46,'<tspan class="en">Control plane (AWS)</tspan><tspan class="zh">控制层（AWS）</tspan>','sv-ttl') + T(340,66,'<tspan class="en">login · search · billing</tspan><tspan class="zh">登录 · 搜索 · 计费</tspan>','sv-sm') + T(340,84,'<tspan class="en">recommendations · UI</tspan><tspan class="zh">推荐 · 界面</tspan>','sv-sm');
      s += B(240,160,200,80,'var(--tint-ok)','#059669') + T(340,186,'<tspan class="en">Open Connect box</tspan><tspan class="zh">Open Connect 机柜</tspan>','sv-ttl') + T(340,206,'<tspan class="en">sitting INSIDE your ISP</tspan><tspan class="zh">就装在你的宽带运营商机房里</tspan>','sv-sm') + T(340,224,'<tspan class="en">the video bytes live here</tspan><tspan class="zh">视频数据就在这</tspan>','sv-sm');
      s += L(440,60,520,60) + L(440,200,520,200,true);
      s += B(520,25,130,70) + T(585,51,'<tspan class="en">Microservices</tspan><tspan class="zh">微服务</tspan>','sv-ttl') + T(585,71,'<tspan class="en">hundreds of them</tspan><tspan class="zh">数以百计</tspan>','sv-sm');
      s += B(520,165,130,70) + T(585,191,'<tspan class="en">Encoding farm</tspan><tspan class="zh">转码集群</tspan>','sv-ttl') + T(585,211,'<tspan class="en">1 film → many versions</tspan><tspan class="zh">1 部片 → 多个版本</tspan>','sv-sm');
      s += L(650,60,700,110) + L(650,200,700,150);
      s += B(700,95,90,70,'var(--tint-neutral)') + T(745,121,'<tspan class="en">Chaos</tspan><tspan class="zh">混沌</tspan>','sv-ttl') + T(745,141,'<tspan class="en">testing</tspan><tspan class="zh">测试</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>Don\'t send the video across the internet at all. Put the video inside the internet provider\'s building, before anyone asks for it.</b></p><p>Netflix builds its own storage appliances and gives them, free, to internet providers around the world. During quiet hours each box quietly fills with the shows that people in <i>that specific region</i> are likely to watch tomorrow.</p><p>So when you press play, the video does not travel from Netflix. It travels a few kilometres from your own ISP\'s rack. That is why it starts in two seconds and does not stutter at 9pm when an entire country sits down to watch.</p><p><b>The general principle:</b> the fastest request is the one that never has to travel. You will meet the same idea, much smaller, every time you add a cache.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>根本不要把视频送过互联网。在有人开口之前，就把视频放进宽带运营商的机房里。</b></p><p>Netflix 自己制造存储设备，免费送给全世界的宽带运营商。在闲时，每个机柜会悄悄装满<i>那个特定地区</i>的人明天很可能会看的内容。</p><p>所以当你按下播放，视频并不是从 Netflix 出发的，而是从你自己运营商机房里的机架出发，只走了几公里。这就是为什么它两秒就开播，而且晚上九点全国人一起看也不卡。</p><p><b>普遍的原理：</b>最快的请求，是那个根本不用出发的请求。你以后每加一层缓存，遇到的都是同一个想法的缩小版。</p>',
    jobEn:'<b>What a data engineer does here:</b> the recommendation you see is downstream of a pipeline. Every play, pause, abandon-after-90-seconds and re-watch becomes an event, and somebody has to turn billions of those into clean features a model can learn from — and prove the numbers are right. Netflix is, structurally, a data company that happens to also send you video.',
    jobZh:'<b>数据工程师在这里做什么：</b>你看到的推荐，是某条管道的下游产物。每一次播放、暂停、看了 90 秒就退出、重看，都变成一个事件，而必须有人把几十亿条这样的事件变成模型能学习的干净特征——并且证明数字是对的。从结构上看，Netflix 是一家顺便也给你送视频的数据公司。'
  },
  {
    key:'youtube', zones:['web','app','net','lb','api','cache','db','ing','etl','wh','cloud','linux'], en:'YouTube', zh:'YouTube', tEn:'anyone can upload anything', tZh:'任何人都能上传任何东西', color:'#ff0033',
    hEn:'YouTube', hZh:'YouTube', subEn:'The hardest version of the streaming problem', subZh:'流媒体问题里最难的那个版本',
    stats:[['2.5B+', 'logged-in users a month', '每月登录用户'],
           ['500+ hrs', 'uploaded every minute', '每分钟上传时长'],
           ['~10', 'versions made of every upload', '每个上传会生成的版本数'],
           ['1 → many', 'one file becomes dozens', '一个文件变成几十个']],
    svg: (function(){
      var s = '';
      s += B(20,95,110,60) + T(75,121,'<tspan class="en">Creator</tspan><tspan class="zh">创作者</tspan>','sv-ttl') + T(75,141,'<tspan class="en">uploads 4K</tspan><tspan class="zh">上传 4K</tspan>','sv-sm');
      s += L(130,125,190,125);
      s += B(190,95,130,60,'var(--tint-m5)','#ff0033') + T(255,121,'<tspan class="en">Ingest</tspan><tspan class="zh">接收</tspan>','sv-ttl') + T(255,141,'<tspan class="en">store raw, forever</tspan><tspan class="zh">原片永久保存</tspan>','sv-sm');
      s += L(320,125,380,60) + L(320,125,380,125) + L(320,125,380,190);
      s += B(380,35,150,50,'var(--tint-no)') + T(455,56,'<tspan class="en">Transcode → 144p</tspan><tspan class="zh">转码 → 144p</tspan>','sv-ttl') + T(455,74,'<tspan class="en">for a slow phone</tspan><tspan class="zh">给慢速手机</tspan>','sv-sm');
      s += B(380,100,150,50,'var(--tint-no)') + T(455,121,'<tspan class="en">Transcode → 720p</tspan><tspan class="zh">转码 → 720p</tspan>','sv-ttl') + T(455,139,'<tspan class="en">for most people</tspan><tspan class="zh">给大多数人</tspan>','sv-sm');
      s += B(380,165,150,50,'var(--tint-no)') + T(455,186,'<tspan class="en">Transcode → 4K</tspan><tspan class="zh">转码 → 4K</tspan>','sv-ttl') + T(455,204,'<tspan class="en">for the big TV</tspan><tspan class="zh">给大电视</tspan>','sv-sm');
      s += L(530,60,590,125) + L(530,125,590,125) + L(530,190,590,125);
      s += B(590,95,90,60,'var(--tint-ok)','#059669') + T(635,121,'<tspan class="en">CDN edge</tspan><tspan class="zh">CDN 边缘</tspan>','sv-ttl') + T(635,141,'<tspan class="en">near you</tspan><tspan class="zh">离你很近</tspan>','sv-sm');
      s += L(680,125,730,125);
      s += B(730,90,60,70) + T(760,116,'<tspan class="en">Player</tspan><tspan class="zh">播放器</tspan>','sv-ttl') + T(760,136,'<tspan class="en">picks</tspan><tspan class="zh">自选</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>Do the expensive work once, at upload, so that playback is almost free — then let the viewer\'s own player decide the quality, second by second.</b></p><p>Netflix knows every film in advance. YouTube does not: hundreds of hours arrive every minute, from any camera, in any format. So the moment a file lands it is fanned out into many versions — different resolutions and bitrates — and every version is chopped into small chunks of a few seconds.</p><p>Your player then requests chunks one at a time and <b>changes its mind constantly</b>. Train goes into a tunnel? It quietly asks for 240p chunks. Wi-Fi recovers? Back to 1080p. The video never stops, because quality is negotiated per chunk rather than per video.</p><p><b>The transferable lesson:</b> when something is read a billion times and written once, move all the cost to the write.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>把昂贵的活儿在上传时一次做完，让播放几乎免费 —— 然后把画质的决定权交给观众的播放器，一秒一秒地重新决定。</b></p><p>Netflix 事先就知道每一部片子，YouTube 不知道：每分钟有几百小时的内容涌进来，来自任何摄像机、任何格式。所以文件一落地就被扇出成很多个版本——不同分辨率和码率——每个版本再切成几秒一块的小片段。</p><p>你的播放器则一块一块地请求，并且<b>不停地改主意</b>。火车进隧道了？它悄悄改要 240p 的片段。Wi-Fi 恢复了？回到 1080p。视频不会中断，因为画质是按片段协商的，不是按整个视频协商的。</p><p><b>可迁移的经验：</b>当一样东西被读十亿次、只被写一次时，把全部成本挪到"写"那一边。</p>',
    jobEn:'<b>What a data engineer does here:</b> watch-time, retention curves, "did they finish it," copyright matching, and the tables that decide what gets recommended and what gets paid. The interesting bit is scale of a different kind: the same event arriving billions of times a day means every design choice you make about grain and idempotency has a cost measured in millions of dollars of storage.',
    jobZh:'<b>数据工程师在这里做什么：</b>观看时长、留存曲线、"有没有看完"、版权匹配，以及决定"推荐什么、给谁分成"的那些表。有意思的地方在于另一种量级：同一个事件每天到达几十亿次，意味着你在粒度和幂等性上做的每一个设计选择，代价都以数百万美元的存储成本计量。'
  },
  {
    key:'trading', zones:['app','net','lb','api','cache','db','ing','etl','wh','bi','sec','linux'], en:'Trading platform', zh:'交易平台', tEn:'where microseconds are money', tZh:'微秒即金钱', color:'#7c3aed',
    hEn:'An exchange / trading system', hZh:'交易所 / 交易系统', subEn:'The most extreme engineering in commercial software', subZh:'商业软件里最极致的工程',
    stats:[['µs', 'matching measured in microseconds', '撮合以微秒计'],
           ['1 µs', '= one millionth of a second', '= 百万分之一秒'],
           ['0', 'tolerance for a lost or reordered message', '丢失或乱序消息的容忍度'],
           ['100%', 'must be auditable, years later', '必须多年后仍可审计']],
    svg: (function(){
      var s = '';
      s += B(20,95,120,60,'var(--tint-m3)','#7c3aed') + T(80,121,'<tspan class="en">Trading firm</tspan><tspan class="zh">交易公司</tspan>','sv-ttl') + T(80,141,'<tspan class="en">in the SAME building</tspan><tspan class="zh">在同一栋楼里</tspan>','sv-sm');
      s += L(140,125,200,125);
      s += B(200,95,120,60) + T(260,121,'<tspan class="en">Gateway</tspan><tspan class="zh">接入网关</tspan>','sv-ttl') + T(260,141,'<tspan class="en">validate · stamp time</tspan><tspan class="zh">校验 · 打时间戳</tspan>','sv-sm');
      s += L(320,125,380,125);
      s += B(380,85,170,80,'var(--tint-m1)','#7c3aed') + T(465,111,'<tspan class="en">Matching engine</tspan><tspan class="zh">撮合引擎</tspan>','sv-ttl') + T(465,131,'<tspan class="en">the order book, in RAM</tspan><tspan class="zh">订单簿，全在内存</tspan>','sv-sm') + T(465,149,'<tspan class="en">single-threaded, on purpose</tspan><tspan class="zh">故意做成单线程</tspan>','sv-sm');
      s += L(550,105,610,50) + L(550,145,610,200);
      s += B(610,20,170,60) + T(695,46,'<tspan class="en">Market data feed</tspan><tspan class="zh">行情推送</tspan>','sv-ttl') + T(695,66,'<tspan class="en">broadcast to everyone at once</tspan><tspan class="zh">同时广播给所有人</tspan>','sv-sm');
      s += B(610,170,170,60,'var(--tint-warn)','#d97706') + T(695,196,'<tspan class="en">Immutable audit log</tspan><tspan class="zh">不可篡改的审计日志</tspan>','sv-ttl') + T(695,216,'<tspan class="en">every event, in order, forever</tspan><tspan class="zh">每个事件，按序，永久</tspan>','sv-sm');
      s += T(400,243,'<tspan class="en">no database in the hot path — a database would be 1000× too slow</tspan><tspan class="zh">关键路径上没有数据库 —— 数据库会慢一千倍</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>Give up almost every convenience, in exchange for time.</b></p><p>Everything else in this guide is a trade-off between speed and convenience. Trading systems simply pick speed, every time, at a cost that looks insane until you see the reason.</p><p>The order book lives <b>entirely in memory</b> — a database in the hot path would be a thousand times too slow. The matching engine is often <b>deliberately single-threaded</b>, because parallel code cannot guarantee that two orders are processed in exactly the order they arrived, and fairness is the product. Firms pay to place their servers <b>in the same building</b> as the exchange, because at these speeds a longer cable is a measurable disadvantage. Some of the work is done in hardware rather than software, because even the operating system is too slow to be allowed in the path.</p><p>And yet: <b>every single event is written to an immutable log</b>, in order, forever — because a regulator may ask, years later, exactly what happened in one microsecond.</p><p><b>Why this belongs in your roadmap:</b> it is Milestone 5 taken to the limit. Memory beats disk. Network distance is real time. The interpreter is too slow. Every principle you learned about the memory hierarchy is visible here in its purest form — these people just refused to accept any of the defaults.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>放弃几乎所有便利，只为换时间。</b></p><p>这份指南里的其他一切，都是速度和便利之间的权衡。而交易系统每一次都直接选速度，代价看起来疯狂，直到你明白原因。</p><p>订单簿<b>完全放在内存里</b>——关键路径上放数据库会慢一千倍。撮合引擎常常是<b>刻意单线程的</b>，因为并行代码无法保证两笔订单严格按到达顺序被处理，而"公平"就是这门生意的产品本身。交易公司花钱把自己的服务器放进<b>交易所同一栋楼</b>，因为在这种速度下，一根更长的网线就是可测量的劣势。有些处理直接做在硬件里而不是软件里，因为连操作系统都慢到不配出现在这条路径上。</p><p>但与此同时：<b>每一个事件都会被写进不可篡改的日志</b>，按顺序，永久保存——因为监管可能在很多年后来问，某一微秒里究竟发生了什么。</p><p><b>为什么它属于你的路线图：</b>它是阶段五被推到极限的样子。内存胜过磁盘；网络距离就是真实时间；解释器太慢。你学过的每一条关于存储层级的原理，都以最纯粹的形态出现在这里——只是这群人拒绝接受任何默认值。</p>',
    jobEn:'<b>What a data engineer does here:</b> everything <i>beside</i> the hot path — and it is enormous. Capturing the full event stream without slowing the engine, rebuilding the exact state of the market at any past microsecond, feeding risk models, and producing regulatory reports that must reconcile to the last event. The trading engine is written by a handful of specialists; the data platform around it employs many more.',
    jobZh:'<b>数据工程师在这里做什么：</b>关键路径<i>旁边</i>的一切——而这部分极其庞大。在不拖慢引擎的前提下捕获完整事件流、还原过去任意一微秒的市场精确状态、给风险模型供数、并产出必须与最后一个事件都对得上的监管报表。撮合引擎由少数几个专家写，而围绕它的数据平台养活的人多得多。'
  },
  {
    key:'taobao', en:'Taobao', zh:'淘宝', tEn:'the one-day spike', tZh:'一年一天的尖峰', color:'#ff5000',
    hEn:'Taobao / Tmall', hZh:'淘宝 / 天猫',
    subEn:'China · a marketplace whose entire architecture is decided by one day a year',
    subZh:'中国 · 一个由「一年中的某一天」决定了整套架构的市场',
    zones:['app','net','lb','api','cache','db','ing','etl','wh','bi','cloud'],
    stats:[['583k', 'peak orders created per second, 11.11', '双十一订单创建峰值（每秒）'],
           ['900M+', 'annual active consumers in China', '中国年度活跃消费者'],
           ['1', 'day that sizes the whole system', '决定整套系统规模的那一天'],
           ['0', 'oversold items allowed, ever', '允许超卖的商品件数']],
    svg: (function(){
      var s = '';
      s += B(20,10,125,58) + T(82,34,'<tspan class="en">The app</tspan><tspan class="zh">手机 App</tspan>','sv-ttl') + T(82,54,'<tspan class="en">browse · buy</tspan><tspan class="zh">逛 · 买</tspan>','sv-sm');
      s += B(20,92,125,58) + T(82,116,'<tspan class="en">Live selling</tspan><tspan class="zh">直播带货</tspan>','sv-ttl') + T(82,136,'<tspan class="en">video + a buy button</tspan><tspan class="zh">视频 + 一个购买按钮</tspan>','sv-sm');
      s += L(145,39,205,110) + L(145,121,205,121);
      s += B(205,92,135,58,'var(--tint-warn)','#ff5000') + T(272,116,'<tspan class="en">CDN + gateway</tspan><tspan class="zh">CDN + 网关</tspan>','sv-ttl') + T(272,136,'<tspan class="en">most traffic never gets past here</tspan><tspan class="zh">大部分流量到这里就被挡住了</tspan>','sv-sm');
      s += L(340,121,395,121);
      s += B(395,10,155,58,'var(--tint-no)','#ff5000') + T(472,34,'<tspan class="en">Stock counter</tspan><tspan class="zh">库存计数器</tspan>','sv-ttl') + T(472,54,'<tspan class="en">in memory · one per item</tspan><tspan class="zh">在内存里 · 每件商品一个</tspan>','sv-sm');
      s += B(395,92,155,58,'var(--tint-warn)','#ff5000') + T(472,116,'<tspan class="en">Order intake</tspan><tspan class="zh">下单入口</tspan>','sv-ttl') + T(472,136,'<tspan class="en">says yes in milliseconds</tspan><tspan class="zh">毫秒级答复「收到」</tspan>','sv-sm');
      s += L(472,68,472,92);
      s += B(395,182,155,56,'var(--tint-neutral)') + T(472,206,'<tspan class="en">Order queue</tspan><tspan class="zh">订单队列</tspan>','sv-ttl') + T(472,226,'<tspan class="en">the spike waits here</tspan><tspan class="zh">尖峰在这里排队</tspan>','sv-sm');
      s += L(472,150,472,182);
      s += L(550,121,605,121) + L(550,210,605,210,true);
      s += B(605,92,175,58) + T(692,116,'<tspan class="en">Settlement + payment</tspan><tspan class="zh">结算与支付</tspan>','sv-ttl') + T(692,136,'<tspan class="en">slow, careful, exactly once</tspan><tspan class="zh">慢、谨慎、只做一次</tspan>','sv-sm');
      s += B(605,182,175,56,'var(--tint-warn)','#d97706') + T(692,206,'<tspan class="en">Data platform</tspan><tspan class="zh">数据平台</tspan>','sv-ttl') + T(692,226,'<tspan class="en">recommendations · the 11.11 board</tspan><tspan class="zh">推荐 · 双十一大屏</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>Do not scale up for the spike. Accept it into a queue and settle it afterwards.</b></p><p>On 11 November the order rate goes up by orders of magnitude for a few minutes. Building payment, invoicing and warehouse systems that can all run at that rate would be absurdly expensive for a system that is idle the other 364 days.</p><p>So the only thing that must be fast is <b>saying yes</b>. Your tap appends one record to a log and returns. Everything slow behind it — charging the card, reserving stock in the warehouse, telling the seller — drains that queue at its own pace, seconds or minutes later.</p><p>The one thing that <i>cannot</i> wait is stock. If two people buy the last item, you have a real-world problem no refund fixes. So the count for each item lives <b>in memory as a single counter</b> that only one thing may touch at a time. It is the oldest trick in computing — a lock around a number — protecting the newest kind of business.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>不要为尖峰扩容。把它收进队列，之后再慢慢结算。</b></p><p>11 月 11 日那几分钟，下单速率会高出好几个数量级。如果支付、开票、仓储全都要能跑到那个速率，对一个其余 364 天都闲着的系统来说，成本荒唐得不可接受。</p><p>所以唯一必须快的事情是<b>说「好」</b>。你那一下点击只是往日志里追加一条记录然后返回。后面所有慢的事情——扣款、在仓库里锁库存、通知卖家——按自己的节奏把队列排空，可能是几秒后，也可能是几分钟后。</p><p>唯一<i>不能</i>等的是库存。如果两个人买走了同一件「最后一件」，你就制造了一个退款也解决不了的现实问题。于是每件商品的数量是<b>内存里的一个计数器</b>，同一时刻只允许一个东西碰它。这是计算机里最老的把戏——给一个数字加锁——用来保护最新的生意。</p>',
    jobEn:'<b>What a data engineer does here:</b> you own the log everything else drains from. Every view, add-to-cart, order, cancellation and refund is an event, and the same order appears in several of them minutes apart. Your job is to reassemble those into one truthful timeline per order — so that when the 11.11 dashboard says a number and finance says a different one, you can show exactly where the two definitions part company. The famous live counter on the wall is the easy part; making it agree with the ledger the next morning is the job.',
    jobZh:'<b>数据工程师在这里做什么：</b>你负责那条所有人都从中排空的日志。每一次浏览、加购、下单、取消、退款都是一个事件，而同一张订单会隔着几分钟出现在其中好几个里。你的工作是把它们重新拼回每张订单一条可信的时间线——这样当双十一大屏说一个数、财务说另一个数时，你能准确指出两个口径是从哪里开始分家的。墙上那个著名的实时计数器是简单的部分；让它第二天早上和账本对得上，才是工作本身。'
  },
  {
    key:'shopee', en:'Shopee', zh:'Shopee 虾皮', tEn:'one app, many countries', tZh:'一个 App，多个国家', color:'#ee4d2d',
    hEn:'Shopee', hZh:'Shopee 虾皮',
    subEn:'Southeast Asia, Taiwan and Brazil · a different currency, tax rule and address format in every single market',
    subZh:'东南亚、台湾与巴西 · 每一个市场的货币、税制和地址格式都不一样',
    zones:['web','app','net','lb','api','cache','db','ing','etl','wh','bi','cloud','sec'],
    stats:[['10+', 'markets running on one platform', '个市场共用一套平台'],
           ['3', 'sides: buyer, seller, courier', '三方：买家、卖家、快递'],
           ['9.9', 'the date the year is planned around', '整年都围着它排期的日子'],
           ['1', 'codebase behind all of it', '支撑这一切的一套代码']],
    svg: (function(){
      var s = '';
      s += B(20,10,125,58) + T(82,34,'<tspan class="en">Buyer app</tspan><tspan class="zh">买家 App</tspan>','sv-ttl') + T(82,54,'<tspan class="en">11 languages</tspan><tspan class="zh">11 种语言</tspan>','sv-sm');
      s += B(20,92,125,58) + T(82,116,'<tspan class="en">Seller centre</tspan><tspan class="zh">卖家中心</tspan>','sv-ttl') + T(82,136,'<tspan class="en">upload · price · stock</tspan><tspan class="zh">上架 · 定价 · 库存</tspan>','sv-sm');
      s += B(20,182,125,56) + T(82,206,'<tspan class="en">Courier app</tspan><tspan class="zh">快递员 App</tspan>','sv-ttl') + T(82,226,'<tspan class="en">scan · deliver</tspan><tspan class="zh">扫码 · 派送</tspan>','sv-sm');
      s += L(145,39,205,110) + L(145,121,205,121) + L(145,210,205,132);
      s += B(205,92,135,58,'var(--tint-warn)','#ee4d2d') + T(272,112,'<tspan class="en">Market router</tspan><tspan class="zh">市场路由</tspan>','sv-ttl') + T(272,131,'<tspan class="en">which country are you in?</tspan><tspan class="zh">你在哪个国家？</tspan>','sv-sm') + T(272,145,'<tspan class="en">picks the rules, not the code</tspan><tspan class="zh">选的是规则，不是代码</tspan>','sv-sm');
      s += L(340,121,395,121);
      s += B(395,10,155,58,'var(--tint-neutral)') + T(472,30,'<tspan class="en">Market config</tspan><tspan class="zh">市场配置</tspan>','sv-ttl') + T(472,48,'<tspan class="en">currency · tax · address · payment</tspan><tspan class="zh">货币 · 税 · 地址 · 支付</tspan>','sv-sm') + T(472,62,'<tspan class="en">rows in a table, not branches in code</tspan><tspan class="zh">是表里的行，不是代码里的分支</tspan>','sv-sm');
      s += B(395,92,155,58,'var(--tint-m5)','#ee4d2d') + T(472,116,'<tspan class="en">Catalogue + search</tspan><tspan class="zh">商品库 + 搜索</tspan>','sv-ttl') + T(472,136,'<tspan class="en">one engine, many rulebooks</tspan><tspan class="zh">一套引擎，多本规则手册</tspan>','sv-sm');
      s += L(472,68,472,92,true);
      s += B(395,182,155,56,'var(--tint-warn)','#ee4d2d') + T(472,206,'<tspan class="en">Flash-sale queue</tspan><tspan class="zh">大促排队</tspan>','sv-ttl') + T(472,226,'<tspan class="en">warmed up hours in advance</tspan><tspan class="zh">提前几小时预热</tspan>','sv-sm');
      s += L(472,150,472,182);
      s += L(550,121,605,121) + L(550,210,605,210,true);
      s += B(605,92,175,58) + T(692,116,'<tspan class="en">Wallet + logistics</tspan><tspan class="zh">钱包 + 物流</tspan>','sv-ttl') + T(692,136,'<tspan class="en">ShopeePay · SPX tracking</tspan><tspan class="zh">ShopeePay · SPX 轨迹</tspan>','sv-sm');
      s += B(605,182,175,56,'var(--tint-warn)','#d97706') + T(692,206,'<tspan class="en">Data platform</tspan><tspan class="zh">数据平台</tspan>','sv-ttl') + T(692,226,'<tspan class="en">every table has a market column</tspan><tspan class="zh">每张表都有一列「市场」</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>Everything that differs by country is data, not code.</b></p><p>The naive way to launch in a new market is to fork the app. Do that eight times and you have eight products, eight bug backlogs and eight teams who no longer agree on what an order is.</p><p>Instead the differences — currency, tax treatment, address format, which payment rails exist, what a phone number looks like, which promotions are legal — are pushed out of the code and into <b>configuration the platform reads at runtime</b>. The checkout logic does not know it is in Vietnam; it asks the market table what the rules are here and follows them.</p><p>Opening a country stops being an engineering project and becomes a data-entry problem with a launch date. That is why one codebase can serve markets that share almost nothing.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>凡是各国不一样的东西，都做成数据，而不是代码。</b></p><p>进入新市场最天真的做法是把 App fork 一份。这么干八次，你就有了八个产品、八份 bug 待办，以及八个已经无法就「什么算一张订单」达成一致的团队。</p><p>正确的做法是把这些差异——货币、税务处理、地址格式、有哪些支付通道、手机号长什么样、哪些促销是合法的——从代码里挪出来，变成<b>平台在运行时读取的配置</b>。结算逻辑并不知道自己在越南；它去问市场配置表「这里的规则是什么」，然后照做。</p><p>开一个国家于是不再是一个工程项目，而是一件带上线日期的数据录入工作。这就是为什么一套代码能服务几乎毫无共同点的市场。</p>',
    jobEn:'<b>What a data engineer does here:</b> the market column is in every table you will ever touch, and it is the one that ruins naive queries. "Total sales last month" is meaningless until you decide which currency, at which exchange rate, on which date, under which market\'s definition of a completed order. You own that reference data — currencies, rates, market rules, category mappings — and the modelled tables that make one number comparable across ten countries. Nobody thanks you for it until the day the board asks for a single regional figure.',
    jobZh:'<b>数据工程师在这里做什么：</b>「市场」这一列会出现在你碰到的每一张表里，而它正是让天真的查询翻车的那一列。「上个月总销售额」在你决定用哪种货币、哪一天的汇率、以及按哪个市场对「已完成订单」的定义来算之前，都是没有意义的。你负责那些参考数据——货币、汇率、市场规则、类目映射——以及那些让一个数字能在十个国家之间可比的建模表。没人会为此谢你，直到董事会要一个统一的区域数字的那一天。'
  },
  {
    key:'panda', en:'foodpanda', zh:'foodpanda', tEn:'three apps, one order', tZh:'三个 App，一张订单', color:'#d70f64',
    hEn:'foodpanda', hZh:'foodpanda',
    subEn:'Asia · a customer, a restaurant and a rider who must all agree on what is happening right now',
    subZh:'亚洲 · 一位顾客、一家餐厅、一位骑手，必须对「此刻正在发生什么」达成一致',
    zones:['app','net','lb','api','cache','db','ing','etl','wh','bi','cloud','netw'],
    stats:[['3', 'apps sharing one order', '个 App 共享同一张订单'],
           ['&lt;1s', 'to decide which rider gets it', '决定这单派给哪位骑手'],
           ['~30 min', 'promised, tap to door', '从下单到送到的承诺时间'],
           ['6+', 'states every order passes through', '每张订单要走过的状态数']],
    svg: (function(){
      var s = '';
      s += B(20,10,125,58) + T(82,34,'<tspan class="en">Customer app</tspan><tspan class="zh">顾客 App</tspan>','sv-ttl') + T(82,54,'<tspan class="en">orders, then watches</tspan><tspan class="zh">下单，然后盯着看</tspan>','sv-sm');
      s += B(20,92,125,58) + T(82,116,'<tspan class="en">Restaurant tablet</tspan><tspan class="zh">餐厅平板</tspan>','sv-ttl') + T(82,136,'<tspan class="en">accept · cook · ready</tspan><tspan class="zh">接单 · 出餐 · 备好</tspan>','sv-sm');
      s += B(20,182,125,56) + T(82,206,'<tspan class="en">Rider app</tspan><tspan class="zh">骑手 App</tspan>','sv-ttl') + T(82,226,'<tspan class="en">GPS · in and out of lifts</tspan><tspan class="zh">GPS · 进出电梯</tspan>','sv-sm');
      s += L(145,39,205,110) + L(145,121,205,121) + L(145,210,205,132);
      s += B(205,92,135,58,'var(--tint-m5)','#d70f64') + T(272,116,'<tspan class="en">Gateway</tspan><tspan class="zh">网关</tspan>','sv-ttl') + T(272,136,'<tspan class="en">three clients, one door</tspan><tspan class="zh">三个客户端，一扇门</tspan>','sv-sm');
      s += L(340,121,395,121);
      s += B(395,10,155,58,'var(--tint-neutral)') + T(472,30,'<tspan class="en">Live rider map</tspan><tspan class="zh">实时骑手地图</tspan>','sv-ttl') + T(472,48,'<tspan class="en">in memory, geo-indexed</tspan><tspan class="zh">在内存里，地理索引</tspan>','sv-sm') + T(472,62,'<tspan class="en">who is free, and near?</tspan><tspan class="zh">谁有空，而且够近？</tspan>','sv-sm');
      s += B(395,92,155,58,'var(--tint-no)','#d70f64') + T(472,112,'<tspan class="en">Order state machine</tspan><tspan class="zh">订单状态机</tspan>','sv-ttl') + T(472,131,'<tspan class="en">the single source of truth</tspan><tspan class="zh">唯一的事实来源</tspan>','sv-sm') + T(472,145,'<tspan class="en">placed → accepted → … → delivered</tspan><tspan class="zh">已下单 → 已接单 → … → 已送达</tspan>','sv-sm');
      s += L(472,68,472,92,true);
      s += B(395,182,155,56,'var(--tint-warn)') + T(472,206,'<tspan class="en">ETA model</tspan><tspan class="zh">送达时间模型</tspan>','sv-ttl') + T(472,226,'<tspan class="en">kitchen queue + traffic + weather</tspan><tspan class="zh">出餐排队 + 路况 + 天气</tspan>','sv-sm');
      s += L(472,150,472,182,true);
      s += L(550,121,605,121) + L(550,210,605,210,true);
      s += B(605,92,175,58) + T(692,116,'<tspan class="en">Event stream</tspan><tspan class="zh">事件流</tspan>','sv-ttl') + T(692,136,'<tspan class="en">every state change, timestamped</tspan><tspan class="zh">每一次状态变化，带时间戳</tspan>','sv-sm');
      s += B(605,182,175,56,'var(--tint-warn)','#d97706') + T(692,206,'<tspan class="en">Data platform</tspan><tspan class="zh">数据平台</tspan>','sv-ttl') + T(692,226,'<tspan class="en">why was this one 20 minutes late?</tspan><tspan class="zh">这一单为什么晚了 20 分钟？</tspan>','sv-sm');
      return s;
    })(),
    ideaEn:'<span class="il">The one clever idea</span><p><b>The hard part is not the app. It is that one order is a long-lived agreement between three people who are not in the same room.</b></p><p>A ride ends in twenty minutes and involves two parties. A food order involves three, and any of them can drop out of contact at any moment: the rider goes into a lift, the restaurant tablet is on café wi-fi, the customer is on a train.</p><p>So the order\'s state does not live on any phone. It lives <b>on the server as a state machine</b> — placed, accepted, cooking, ready, picked up, delivered — and the apps are never allowed to <i>set</i> it. They can only <i>request</i> a transition, and are told what actually happened. Two riders tapping "picked up" at the same second is not a bug to be prevented at the screen; it is a race the server resolves, once, and reports back.</p><p>Every messy real-time product you will ever work on is this same shape: one authoritative state, many hopeful clients.</p>',
    ideaZh:'<span class="il">那个聪明的想法</span><p><b>难的不是 App。难的是：一张订单，是三个不在同一个房间里的人之间、一段持续很久的约定。</b></p><p>一趟车程二十分钟就结束，只牵涉两方。一张外卖订单牵涉三方，而且任何一方都可能随时失联：骑手进了电梯，餐厅的平板连着咖啡店的 wi-fi，顾客在地铁上。</p><p>所以订单的状态不住在任何一部手机里。它住在<b>服务器上，作为一台状态机</b>——已下单、已接单、制作中、已备好、已取餐、已送达——而 App 永远不被允许去<i>设置</i>它。它们只能<i>请求</i>一次状态转移，然后被告知实际发生了什么。两个骑手在同一秒点了「已取餐」，这不是一个要在界面上拦住的 bug；这是一场竞争，由服务器裁决一次，然后通知回去。</p><p>你将来会遇到的每一个乱糟糟的实时产品，都是同一个形状：一份权威状态，一群满怀希望的客户端。</p>',
    jobEn:'<b>What a data engineer does here:</b> the state machine is your raw material. Every transition is an event with a timestamp, and almost every question the business asks is really a question about the gaps between them. Late deliveries, kitchen bottlenecks, rider utilisation, which restaurants quietly accept orders they cannot cook — none of that is a column anywhere. You reconstruct it by lining up timelines and measuring the silences. The dashboard says "23 minutes average"; you are the person who can say which of the six steps ate the extra eight.',
    jobZh:'<b>数据工程师在这里做什么：</b>状态机就是你的原材料。每一次状态转移都是一个带时间戳的事件，而业务提出的几乎每一个问题，本质上都是在问这些事件之间的空隙。送达超时、后厨瓶颈、骑手利用率、哪些餐厅悄悄接了自己做不出来的单——这些在任何地方都不是现成的一列。你要把时间线一条条对齐，去量那些沉默的间隔，才能把它们还原出来。看板说「平均 23 分钟」；而你是那个能说出「多出来的 8 分钟被六步里的哪一步吃掉了」的人。'
  }
];

  tabs.innerHTML = S.map(function(x,i){
    return '<button class="showtab' + (i===0?' on':'') + '" data-i="'+i+'"><b>' + bi(x.en, x.zh) + '</b>'
      + '<small>' + bi(x.tEn, x.tZh) + '</small></button>';
  }).join('');
  function show(i){
    var x = S[i];
    $$('.showtab', tabs).forEach(function(b,j){ b.classList.toggle('on', i===j) });
    box.style.setProperty('--c', x.color);
    box.innerHTML =
      '<div class="showhead"><div class="tag2">' + bi(x.tEn, x.tZh) + '</div>'
        + '<h3>' + bi(x.hEn, x.hZh) + '</h3>'
        + '<p style="color:var(--muted); margin:2px 0 0">' + bi(x.subEn, x.subZh) + '</p></div>'
      + '<div class="statrow">' + x.stats.map(function(st){
          return '<div class="stat"><b>' + st[0] + '</b><span>' + bi(st[1], st[2]) + '</span></div>';
        }).join('') + '</div>'
      + '<div class="showbody">'
        + '<div class="archsvg"><svg viewBox="0 0 800 250">' + x.svg + '</svg></div>'
        + (x.zones ? '<div class="zonerow"><span class="zl">' + bi('Regions of the map this leans on', '这套系统用到地图上的哪些区域') + '</span>' + x.zones.map(function(k){ var z = MZ[k]; return z ? '<span class="zchip" style="--zc:' + z[0] + '">' + bi(z[1], z[2]) + '</span>' : '' }).join('') + '</div>' : '')
      + '<div class="idea">' + bi(x.ideaEn, x.ideaZh) + '</div>'
        + '<div class="yourjob">' + bi(x.jobEn, x.jobZh) + '</div>'
      + '</div>';
  }
  tabs.addEventListener('click', function(e){ var b = e.target.closest('.showtab'); if (b) show(+b.dataset.i) });
  show(0);
})();
}catch(_e){console.warn("[widget skipped] architecture showcase:", _e && _e.message)}

/* ================= the map · clickable nodes + roles ================= */
try{
(function(){
  var svg = $('#mapsvg'); if (!svg) return;
  var rolesEl = $('#roles'), det = $('#roledetail');
  var mdl = $('#mapmodal'), card = $('.mdl-card', mdl);
  var IC = function(id, cls){ return '<svg viewBox="0 0 24 24" class="'+(cls||'')+'"><use href="#'+id+'"/></svg>' };

  var N = {
  web:{i:'ic-browser',c:'#4f46e5',tEn:'Frontend',tZh:'前端',hEn:'Browser / web page',hZh:'浏览器 / 网页',
    wEn:'The page itself: the skeleton (HTML), the clothes (CSS) and the nervous system (JavaScript). It is downloaded to the visitor’s own machine and assembled there.',
    wZh:'页面本身：骨架（HTML）、衣服（CSS）、神经系统（JavaScript）。它被下载到访客自己的机器上，然后在那里被组装出来。',
    oEn:'Frontend engineers. Data engineers only need to read it, never write it.',
    oZh:'前端工程师。数据工程师只需要看得懂，不需要写。',
    bEn:'Because it runs on the user’s computer, the user can change it. Anything that actually matters — prices, permissions, thresholds — must be decided on the server, never here.',
    bZh:'因为它跑在用户的电脑上，用户就能改它。任何真正重要的东西——价格、权限、阈值——必须在服务端决定，绝不能放在这里。',
    eEn:'Press F12 on any website right now. Everything you see in the Elements tab is this box, on your own machine.',
    eZh:'现在对任意网站按 F12。你在 Elements 标签里看到的一切，就是这个方块，就在你自己的机器上。'},
  app:{i:'ic-phone',c:'#4f46e5',tEn:'Frontend',tZh:'前端',hEn:'Mobile app',hZh:'手机 App',
    wEn:'The same job as the web page, on a different screen. It talks to exactly the same backend through exactly the same API.',
    wZh:'和网页做同样的事，只是换了一块屏。它通过完全相同的 API 和完全相同的后端对话。',
    oEn:'Mobile engineers — but the API contract is shared with backend and, indirectly, with you.',
    oZh:'移动端工程师 —— 但 API 的约定是和后端共享的，也间接和你有关。',
    bEn:'Old app versions never disappear. Someone is always running a two-year-old build, so an API can rarely just change shape.',
    bZh:'旧版本 App 永远不会消失。总有人在用两年前的版本，所以 API 极少能说改就改。',
    eEn:'This is why APIs get versioned (/v1/, /v2/) instead of edited in place.',
    eZh:'这就是为什么 API 会做版本（/v1/、/v2/），而不是直接原地修改。'},
  net:{i:'ic-globe',c:'#0369a1',tEn:'Network',tZh:'网络',hEn:'The network — HTTP, DNS, TLS',hZh:'网络 —— HTTP、DNS、TLS',
    wEn:'The road between the two sides. DNS turns a name into an address, TLS seals the envelope, HTTP defines what a request and an answer look like.',
    wZh:'两边之间的那条路。DNS 把名字翻译成地址，TLS 把信封封好，HTTP 规定请求和回答长什么样。',
    oEn:'Nobody and everybody. Network engineers own the plumbing; every other role has to understand the status codes.',
    oZh:'没有人，也所有人。网络工程师负责管道；其他每个角色都得看懂状态码。',
    bEn:'Distance is time. A request that crosses a continent costs ~150 ms no matter how fast your code is — which is why the same call inside a loop is so devastating.',
    bZh:'距离就是时间。一次跨洲请求大约要 150 毫秒，不管你的代码多快——这就是为什么把同样的调用放进循环里如此致命。',
    eEn:'"It’s a DNS issue" is a real and extremely common diagnosis. So is "the firewall is blocking that port."',
    eZh:'"这是 DNS 问题"是一个真实且极常见的诊断。"防火墙挡了那个端口"也是。'},
  lb:{i:'ic-split',c:'#0d9488',tEn:'Server side',tZh:'服务端',hEn:'Load balancer',hZh:'负载均衡',
    wEn:'<b>You can skip this one for now.</b> It is a doorman standing in front of several identical servers, sending each new request to whichever one is least busy — and skipping any that stopped answering.',
    wZh:'<b>这个现在可以先跳过。</b>它是站在几台一模一样的服务器前面的门童，把每个新请求交给最闲的那一台，并跳过任何已经不应答的。',
    oEn:'DevOps / platform engineers. Nothing here is yours in year one — it is drawn faded on the map for exactly that reason.',
    oZh:'运维 / 平台工程师。第一年这里没有你的事 —— 地图上把它画得淡淡的，就是这个原因。',
    bEn:'It is what makes "add more servers" possible at all. Without it, one machine is your ceiling and your single point of failure.',
    bZh:'正是它让"加机器"这件事成为可能。没有它，一台机器就是你的上限，也是你的单点故障。',
    eEn:'This is the box that lets a deploy happen with nobody noticing: drain one server, update it, put it back, repeat.',
    eZh:'正是这个方块让发布可以做到无人察觉：把一台摘下来、更新、放回去，再来下一台。'},
  api:{i:'ic-server',c:'#0d9488',tEn:'Server side',tZh:'服务端',hEn:'Backend API',hZh:'后端 API',
    wEn:'The brain the user cannot reach. It decides who you are, what you are allowed to see, and what the rules are — then answers in a fixed, agreed shape.',
    wZh:'用户够不到的那个大脑。它决定你是谁、你能看什么、规则是什么——然后用固定的、约定好的形状回答你。',
    oEn:'Backend engineers. You will build small ones yourself (Flask/FastAPI) to serve internal data.',
    oZh:'后端工程师。你自己也会写一些小的（Flask/FastAPI）来提供内部数据。',
    bEn:'Business rules must live here and only here, or the web app, the mobile app and the nightly report will slowly start disagreeing with each other.',
    bZh:'业务规则必须只住在这里，否则网页、App 和每晚的报表会慢慢开始互相矛盾。',
    eEn:'The QC threshold changed from 0.90 to 0.95? One number, in one function, in this box. Everything downstream is instantly correct.',
    eZh:'QC 阈值从 0.90 改成 0.95？就是这个方块里某个函数中的一个数字。下游一切瞬间就对了。'},
  cache:{i:'ic-bolt',c:'#0d9488',tEn:'Server side',tZh:'服务端',hEn:'Cache',hZh:'缓存',
    wEn:'<b>You can skip this one for now.</b> It is a small, very fast memory of answers already worked out — ask the same question twice and the second one never reaches the database.',
    wZh:'<b>这个现在可以先跳过。</b>它是一小块极快的记忆，存着已经算出来的答案 —— 同一个问题问第二次，就不会再打到数据库。',
    oEn:'Backend engineers — but the idea is universal and you will use it constantly.',
    oZh:'后端工程师 —— 但这个想法是通用的，你会一直用到。',
    bEn:'Caches go stale. The two hardest problems in this field are famously naming things and knowing when to throw a cached answer away.',
    bZh:'缓存会过期。这行里最难的两个问题，众所周知是"给东西起名字"和"知道什么时候该扔掉缓存"。',
    eEn:'Netflix’s boxes inside your ISP are the same idea at country scale: keep the answer close to the person asking.',
    eZh:'Netflix 装在你运营商机房里的机柜，就是同一个想法的国家级版本：把答案放在提问的人旁边。'},
  db:{i:'ic-db',c:'#9333ea',tEn:'Server side',tZh:'服务端',hEn:'Live (production) database',hZh:'生产数据库',
    wEn:'Where the product’s current truth lives, in related tables. It is tuned to write one record very fast — a new order, a new sample, a status change.',
    wZh:'产品当前的真相所在，存在互相关联的表里。它为"极快地写入一条记录"而调优——一笔新订单、一份新样本、一次状态变更。',
    oEn:'Backend engineers own it. <b>You read from it — carefully.</b> This boundary is where most of your early friction will happen.',
    oZh:'后端工程师拥有它。<b>你从它这里读——小心地读。</b>你早期的大部分摩擦都会发生在这条边界上。',
    bEn:'Running an analyst’s exploratory query straight against this can lock the tables the business needs to take orders. That is the whole reason the data platform on the right exists.',
    bZh:'直接对它跑一条分析师的探索性查询，可能锁住业务用来下单的表。右边那个数据平台存在的全部理由，就是这个。',
    eEn:'Rule of thumb: never point a dashboard at this box. Point it at the warehouse.',
    eZh:'经验法则：永远不要让看板直连这个方块，让它连数据仓库。'},
  ing:{i:'ic-stream',c:'#d97706',tEn:'Data platform · yours',tZh:'数据平台 · 你的地盘',hEn:'Ingestion / event stream',hZh:'数据接入 / 事件流',
    wEn:'How data gets out of the product without hurting it. Either a scheduled copy, or a continuous stream of events — every tap, order, cancellation and payment published as it happens.',
    wZh:'数据在不伤害产品的前提下流出来的方式。要么是定时复制，要么是持续的事件流——每一次点击、下单、取消、支付，发生时就被发布出去。',
    oEn:'<b>You.</b> This is the first box on the map that is genuinely yours.',
    oZh:'<b>你。</b>这是地图上第一个真正属于你的方块。',
    bEn:'Events arriving twice, or out of order, or not at all. "Exactly once" is one of the genuinely hard problems in this field, and it is your problem.',
    bZh:'事件到达两次、乱序、或者根本没到。"恰好一次"是这行里真正困难的问题之一，而且是你的问题。',
    eEn:'Grab publishes every driver GPS ping here. Netflix publishes every play and pause. It is the raw material of everything downstream.',
    eZh:'Grab 把每一次司机 GPS 上报发到这里，Netflix 把每一次播放和暂停发到这里。它是下游一切的原材料。'},
  etl:{i:'ic-funnel',c:'#d97706',tEn:'Data platform · yours',tZh:'数据平台 · 你的地盘',hEn:'Pipelines (ETL / ELT)',hZh:'数据管道（ETL / ELT）',
    wEn:'The prep bench. Scheduled code that collects raw data, cleans it, standardises it, joins it, checks it, and loads the result somewhere trustworthy — the same way every single night.',
    wZh:'前处理台。定时运行的代码：采集原始数据、清洗、标准化、关联、校验，然后把结果加载到一个可信的地方——每一晚都用同样的方式。',
    oEn:'<b>You.</b> This is the centre of the job.',
    oZh:'<b>你。</b>这是这份工作的核心。',
    bEn:'It must survive being run twice (idempotent), fail loudly rather than load garbage, and log enough that you can answer "did last night work?" without guessing.',
    bZh:'它必须跑两遍也没事（幂等）、宁可大声失败也不写进垃圾数据、并且日志足够让你不用猜就能回答"昨晚跑成功了吗"。',
    eEn:'The night it fails and you re-run it, revenue doubles — unless you designed for the re-run first.',
    eZh:'它失败那晚你重跑一次，收入就翻倍了——除非你一开始就为重跑做了设计。'},
  wh:{i:'ic-warehouse',c:'#d97706',tEn:'Data platform · yours',tZh:'数据平台 · 你的地盘',hEn:'Warehouse — modelled tables',hZh:'数据仓库 —— 建模好的表',
    wEn:'The finished, labelled preparation. Unlike the live database it is built to <i>read</i> enormous amounts fast, and it keeps history — so last year’s report still reproduces.',
    wZh:'处理好、贴好标签的成品。和生产数据库不同，它为<i>快速读取</i>海量数据而生，而且保留历史——所以去年的报表今天还能复现。',
    oEn:'<b>You.</b> Analysts and ML engineers are your customers here.',
    oZh:'<b>你。</b>分析师和机器学习工程师是你在这里的客户。',
    bEn:'Modelling decides which questions are cheap and which are impossible. Get the grain wrong — what one row means — and every SUM in the company is quietly wrong.',
    bZh:'建模决定了哪些问题廉价、哪些不可能。粒度搞错——一行代表什么——公司里每一次 SUM 都会悄悄出错。',
    eEn:'"Pass rate by region, by quarter, for instruments overdue for calibration" is one join here, or a week of work if this box is badly designed.',
    eZh:'"按区域、按季度、只看超期未校准仪器的合格率"，在这里是一次连接；如果这个方块设计得差，就是一周的工作。'},
  bi:{i:'ic-chart',c:'#e11d48',tEn:'Decisions',tZh:'决策层',hEn:'Dashboards, reports, ML models',hZh:'看板、报表、机器学习模型',
    wEn:'Where the data finally meets a human decision — or feeds a model that makes the decision automatically.',
    wZh:'数据最终遇上人类决策的地方——或者喂给一个自动做决策的模型。',
    oEn:'Analysts, data scientists, ML engineers, and ultimately the business.',
    oZh:'分析师、数据科学家、机器学习工程师，以及最终的业务方。',
    bEn:'Everything wrong upstream becomes visible here, and only here — usually in a meeting, usually pointed at by someone senior.',
    bZh:'上游所有的错都会在这里、也只会在这里显形——通常是在会议上，通常由某位领导指出来。',
    eEn:'When the number on this screen is wrong, the first question is always: pipeline, or page? Knowing how to answer that in twenty seconds is a superpower.',
    eZh:'当这块屏幕上的数字不对时，第一个问题永远是：管道的问题，还是页面的问题？能在二十秒内回答，就是超能力。'},
  linux:{i:'ic-term',c:'#64748b',tEn:'Infrastructure',tZh:'基础设施',hEn:'Linux / the operating system',hZh:'Linux / 操作系统',
    wEn:'The referee that shares one machine between many programs. Free, open, and — crucially — perfectly happy with no screen, no mouse and no desktop.',
    wZh:'让很多程序共用一台机器的裁判。免费、开放，而且关键在于：没有屏幕、没有鼠标、没有桌面它也照样跑得很开心。',
    oEn:'DevOps / SRE own it. You need about twenty commands.',
    oZh:'运维 / SRE 拥有它。你需要会大约二十条命令。',
    bEn:'Almost every server on earth runs this. When you connect to one, there is nothing to click — a prompt appears and waits.',
    bZh:'地球上几乎每一台服务器跑的都是它。当你连上一台，没有任何东西可以点——一个提示符出现，然后等你。',
    eEn:'Four commands — tail, grep, df, du — will tell you why last night’s job died, in about ninety seconds.',
    eZh:'四条命令——tail、grep、df、du——大约九十秒就能告诉你昨晚的任务为什么挂了。'},
  cont:{i:'ic-cube',c:'#64748b',tEn:'Infrastructure',tZh:'基础设施',hEn:'Containers (Docker)',hZh:'容器（Docker）',
    wEn:'A sealed box holding your code plus the exact Python version, the exact libraries and the exact settings — so it behaves identically on your laptop and in production.',
    wZh:'一个密封的盒子，装着你的代码，外加确切的 Python 版本、确切的依赖库、确切的配置——所以它在你的笔记本和生产环境上表现完全一致。',
    oEn:'Shared. You will package your own pipelines this way.',
    oZh:'共同拥有。你会用这种方式打包自己的管道。',
    bEn:'It killed the single most expensive sentence in software history: "it works on my machine."',
    bZh:'它消灭了软件史上最贵的一句话："在我机器上是好的。"',
    eEn:'A container starts in under a second because it shares the host’s operating system — it is not a whole computer.',
    eZh:'容器一秒内就能启动，因为它共用宿主机的操作系统——它不是一整台电脑。'},
  cloud:{i:'ic-cloud',c:'#64748b',tEn:'Infrastructure',tZh:'基础设施',hEn:'Cloud (AWS, Azure, GCP)',hZh:'云（AWS、Azure、GCP）',
    wEn:'Renting computers, storage and networking by the minute instead of buying them. Need 64 machines for one hour? Have them in four minutes, then give them back.',
    wZh:'按分钟租用算力、存储和网络，而不是买下来。要 64 台机器跑一小时？四分钟内到位，用完还回去。',
    oEn:'DevOps own the account; every engineer spends the money.',
    oZh:'运维拥有账号；每个工程师都在花钱。',
    bEn:'The cost moved from a purchase you notice to a monthly bill you don’t. Set a billing alert on day one — before anything else.',
    bZh:'成本从"你会注意到的采购"变成了"你不会注意到的月账单"。第一天就设账单告警——在做别的任何事之前。',
    eEn:'There is no cloud. There is only someone else’s computer, in a room with very good air conditioning.',
    eZh:'世上没有云。只有别人的电脑，放在一间空调开得很好的房间里。'},
  netw:{i:'ic-net',c:'#64748b',tEn:'Infrastructure',tZh:'基础设施',hEn:'Networking',hZh:'网络',
    wEn:'IP addresses (which building), ports (which door), DNS (the phone book), and firewalls (the door policy).',
    wZh:'IP 地址（哪栋楼）、端口（哪扇门）、DNS（电话簿）、防火墙（门禁规则）。',
    oEn:'Network / platform engineers. You need enough to debug a failed connection.',
    oZh:'网络 / 平台工程师。你需要懂到能排查一次连接失败。',
    bEn:'When something "can’t connect" and your code is fine, it is almost always a firewall rule or a private subnet doing exactly what it was told.',
    bZh:'当有东西"连不上"而你的代码没问题时，几乎总是某条防火墙规则或某个私有子网在严格执行它被交代的事。',
    eEn:'Public vs private subnet is the difference between a database anyone can port-scan and one only your own machines can reach.',
    eZh:'公有子网和私有子网的差别，就是"谁都能扫端口的数据库"和"只有你自己机器够得到的数据库"的差别。'},
  sec:{i:'ic-lock',c:'#64748b',tEn:'Infrastructure',tZh:'基础设施',hEn:'Security',hZh:'安全',
    wEn:'Who is allowed to reach what: credentials, permissions, encryption in transit and at rest, and separating dev from production.',
    wZh:'谁被允许接触什么：凭据、权限、传输中与静态的加密，以及把开发环境和生产环境分开。',
    oEn:'Security engineers set the policy — but as a data engineer you are one of the highest-risk roles in the building.',
    oZh:'安全工程师制定策略——但作为数据工程师，你是整栋楼里风险最高的角色之一。',
    bEn:'You move sensitive data around for a living. Least privilege, never a secret in Git, and ask before copying anything personal anywhere new — including into an AI prompt.',
    bZh:'你的职业就是到处搬运敏感数据。最小权限、密钥绝不进 Git、把任何个人数据复制到新地方之前先问——包括粘进 AI 的提示词。',
    eEn:'A key pushed to a public repo should be considered compromised within minutes, even if you delete it in the next commit.',
    eZh:'一把推到公开仓库的密钥，应当视为几分钟内就已泄露，哪怕你下一次提交就删掉它。'},
  git:{i:'ic-git',c:'#64748b',tEn:'Infrastructure',tZh:'基础设施',hEn:'Git and CI/CD',hZh:'Git 与持续交付',
    wEn:'Git is the lab notebook — every change dated, attributed and reversible. CI/CD is what happens after: push a commit, tests run automatically, and if they pass it deploys itself.',
    wZh:'Git 是实验记录本——每次改动都有日期、有署名、可撤销。CI/CD 是之后发生的事：推一次提交，测试自动跑，通过了就自己上线。',
    oEn:'Everyone. This is the one non-negotiable habit across every role on this map.',
    oZh:'所有人。这是地图上每一个角色都没得商量的一个习惯。',
    bEn:'Without it: "when did this break?" and "why is this line here?" have no answers, and rolling back is a guess.',
    bZh:'没有它："这是什么时候坏的？""这行为什么在这？"都没有答案，回滚也只能靠猜。',
    eEn:'The commit is not just a record any more — it is the button that starts the machine.',
    eZh:'提交不再只是一条记录——它是启动整台机器的那个按钮。'}
  };

  function openModal(k){
    var n = N[k]; if (!n) return;
    card.style.setProperty('--k', n.c);
    $('#mdl-ic').innerHTML  = IC(n.i);
    $('#mdl-tag').innerHTML = bi(n.tEn, n.tZh);
    $('#mdl-title').innerHTML = bi(n.hEn, n.hZh);
    $('#mdl-body').innerHTML =
        '<div class="mdl-blk"><div class="bl">' + bi('What it is','它是什么') + '</div><p>' + bi(n.wEn, n.wZh) + '</p></div>'
      + '<div class="mdl-blk"><div class="bl">' + bi('Who owns it','谁负责') + '</div><p>' + bi(n.oEn, n.oZh) + '</p></div>'
      + '<div class="mdl-blk warn2"><div class="bl">' + bi('Why it matters / what breaks','为什么重要 / 会出什么事') + '</div><p>' + bi(n.bEn, n.bZh) + '</p></div>'
      + '<div class="mdl-blk eg"><div class="bl">' + bi('◈ In practice','◈ 实际情况') + '</div><p>' + bi(n.eEn, n.eZh) + '</p></div>';
    mdl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){ mdl.classList.remove('open'); document.body.style.overflow = ''; }
  $('.mdl-x', mdl).addEventListener('click', closeModal);
  $('.mdl-back', mdl).addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });
  svg.addEventListener('click', function(e){
    var g = e.target.closest('.node'); if (g) openModal(g.dataset.n);
  });
  svg.addEventListener('keydown', function(e){
    var g = e.target.closest('.node');
    if (g && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openModal(g.dataset.n); }
  });

  /* ---- roles ---- */
  var ROLES = [
    {ic:'ic-browser', c:'#4f46e5', en:'Frontend Engineer', zh:'前端工程师', z:['web','app','net'],
     oEn:'The browser and the phone app — everything the user can actually see and touch.',
     oZh:'浏览器和手机 App —— 用户真正看得见、点得到的一切。',
     jEn:'Judged on: does it look right, work on every screen size, and load fast.',
     jZh:'考核标准：好不好看、各种屏幕上能不能用、加载快不快。',
     mEn:'Meets you at: the API. They consume what your pipelines produce — so if your data is wrong, their page is wrong and they get the complaint first.',
     mZh:'和你的交集：API。他们消费你的管道产出的东西 —— 你的数据错了，他们的页面就错了，而且投诉先到他们那里。'},
    {ic:'ic-server', c:'#0d9488', en:'Backend Engineer', zh:'后端工程师', z:['lb','api','cache','db','net'],
     oEn:'The API, the business rules, authentication, and the live database the product writes to.',
     oZh:'API、业务规则、身份认证，以及产品实时写入的那个生产数据库。',
     jEn:'Judged on: correctness, response time, and not going down.',
     jZh:'考核标准：正确性、响应时间、以及别挂。',
     mEn:'Meets you at: the live database — theirs. You read from it, carefully, or from the events it emits. Most friction between the two roles is about who may slow production down.',
     mZh:'和你的交集：那个生产数据库 —— 它是他们的。你小心地从它、或它发出的事件里读数据。两个角色之间的大多数摩擦，本质是"谁有权拖慢生产"。'},
    {ic:'ic-funnel', c:'#d97706', en:'Data Engineer ← you', zh:'数据工程师 ← 你', z:['ing','etl','wh','db'],
     oEn:'Everything between "the product produced data" and "somebody can trust it": ingestion, pipelines, modelled tables.',
     oZh:'从"产品产生了数据"到"有人敢信它"之间的全部：数据接入、管道、建模好的表。',
     jEn:'Judged on: is the data fresh, correct, complete, and can it be re-run without breaking. Nobody notices you when it works — that is the job.',
     jZh:'考核标准：数据新不新、对不对、全不全、重跑会不会坏。做得好时没人注意到你 —— 这就是这份工作。',
     mEn:'You sit in the middle of the whole map: downstream of everyone who produces data, upstream of everyone who decides anything with it. That position is the entire reason the role exists.',
     mZh:'你坐在整张地图的正中间：在所有产生数据的人的下游，在所有据此做决策的人的上游。这个位置就是这个岗位存在的全部理由。'},
    {ic:'ic-chart', c:'#e11d48', en:'Analyst / Data Scientist', zh:'分析师 / 数据科学家', z:['bi','wh'],
     oEn:'The questions and the answers: dashboards, experiments, forecasts, "why did revenue drop in Ipoh?"',
     oZh:'问题和答案：看板、实验、预测、"为什么怡保的收入掉了？"',
     jEn:'Judged on: insight that changes a decision — and on being right.',
     jZh:'考核标准：能改变某个决策的洞察 —— 以及是不是对的。',
     mEn:'Meets you at: the warehouse. They are your customers. Model your tables well and they answer their own questions; model them badly and you become a query service.',
     mZh:'和你的交集：数据仓库。他们是你的客户。表建模得好，他们自己就能回答问题；建模得差，你就变成了一台查询机器。'},
    {ic:'ic-brain', c:'#9333ea', en:'ML Engineer', zh:'机器学习工程师', z:['bi','wh','etl','api'],
     oEn:'Models: trained on historical data, then serving predictions back into the live product.',
     oZh:'模型：用历史数据训练，再把预测送回线上产品。',
     jEn:'Judged on: does the model move a real metric in production, not on paper.',
     jZh:'考核标准：模型有没有在生产环境改善一个真实指标 —— 不是纸面上。',
     mEn:'Meets you at both ends: clean historical features from your warehouse to train, and a fast path back into the backend to serve. Much of "ML work" is honestly data engineering with a model on the end.',
     mZh:'两头都和你有交集：训练要你数仓里干净的历史特征，上线要一条回到后端的快路。老实说，"机器学习工作"很大一部分就是末端接了个模型的数据工程。'},
    {ic:'ic-wrench', c:'#64748b', en:'DevOps / SRE / Platform', zh:'运维 / SRE / 平台', z:['linux','cont','cloud','netw','git','lb'],
     oEn:'The ground everything stands on: Linux, containers, cloud, networking, deployments, monitoring, keeping it alive at 3am.',
     oZh:'所有东西站立的地面：Linux、容器、云、网络、发布、监控，以及凌晨三点让它活着。',
     jEn:'Judged on: uptime, deploy speed, and cost.',
     jZh:'考核标准：可用性、发布速度、成本。',
     mEn:'Meets you everywhere underneath. Your pipeline runs on their machines, in their containers, on their schedule, spending their budget. Learn their language and they unblock you in minutes rather than days.',
     mZh:'在底下的每一处都和你有交集。你的管道跑在他们的机器上、容器里、调度上，花的是他们的预算。学会他们的语言，他们几分钟就能帮你解封。'},
    {ic:'ic-lock', c:'#dc2626', en:'Security', zh:'安全工程师', z:['sec','netw','db','cloud'],
     oEn:'Who may reach what — credentials, permissions, encryption, and what happens when someone gets in.',
     oZh:'谁能接触什么 —— 凭据、权限、加密，以及有人闯进来之后会怎样。',
     jEn:'Judged on: incidents that did not happen — a difficult thing to be thanked for.',
     jZh:'考核标准：那些没有发生的事故 —— 很难因此被感谢。',
     mEn:'Meets you at your credentials and your copies. Moving sensitive data around is your profession, which makes you one of the highest-risk roles in the building.',
     mZh:'和你的交集是你的凭据和你的副本。搬运敏感数据是你的职业，这让你成为整栋楼里风险最高的角色之一。'}
  ];
  var nodesEls = $$('.node', svg);
  rolesEl.innerHTML = ROLES.map(function(r,i){
    return '<button class="role" data-i="'+i+'" style="--k:'+r.c+'">' + IC(r.ic) + bi(r.en, r.zh) + '</button>';
  }).join('');
  function clear(){
    nodesEls.forEach(function(z){ z.classList.remove('dim','hot') });
    $$('.role', rolesEl).forEach(function(b){ b.classList.remove('on') });
    det.innerHTML = '<div class="rl" style="color:var(--muted)">' + bi('Nobody selected','未选择角色') + '</div>'
      + bi('<p>Click a role above to light up the part of the map they are responsible for — or click any box on the map itself to find out what it is.</p><p>Notice how much the regions overlap. <b>These are territories, not walls.</b> Almost everyone works in two of them, and the people who can move between regions are the ones who get called when something is genuinely broken.</p>',
           '<p>点上面任意一个角色，地图上归他们负责的区域就会亮起来 —— 或者直接点地图上任意一个方块，看看它到底是什么。</p><p>注意这些区域重叠得有多厉害。<b>它们是地带，不是墙。</b>几乎每个人都在其中两块里干活，而那些能在区域之间移动的人，才是真正出事时被叫去的人。</p>');
  }
  function show(i){
    var r = ROLES[i];
    nodesEls.forEach(function(z){
      var inIt = r.z.indexOf(z.dataset.n) > -1;
      z.classList.toggle('dim', !inIt);
      z.classList.toggle('hot', inIt);
    });
    $$('.role', rolesEl).forEach(function(b,j){ b.classList.toggle('on', i === j) });
    det.innerHTML = '<div class="rl" style="color:' + r.c + '">' + bi('Region on the map','在地图上的区域') + '</div>'
      + '<h4>' + IC(r.ic) + bi(r.en, r.zh) + '</h4>'
      + '<p><span class="owns">' + bi('Owns:','负责：') + '</span> ' + bi(r.oEn, r.oZh) + '</p>'
      + '<p>' + bi(r.jEn, r.jZh) + '</p>'
      + '<p>' + bi(r.mEn, r.mZh) + '</p>';
  }
  rolesEl.addEventListener('click', function(e){
    var b = e.target.closest('.role'); if (!b) return;
    if (b.classList.contains('on')) clear(); else show(+b.dataset.i);
  });
  $('#map-trace').addEventListener('click', function(){
    svg.classList.remove('pathrun'); void svg.offsetWidth; svg.classList.add('pathrun');
  });
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) svg.classList.add('pathrun') }) }, {threshold:.2}).observe(svg);
  } else svg.classList.add('pathrun');
  clear();
})();
}catch(_e){console.warn("[widget skipped] the map · clickable nodes + roles:", _e && _e.message)}

/* ================= PLAYGROUND 12 · the full journey ================= */
try{
(function(){
  var stepsEl = $('#fsteps'); if (!stepsEl) return;
  var L = $('#fp-left'), R = $('#fp-right'), LT = $('#fp-l-title'), RT = $('#fp-r-title'),
      TABS = $('#fp-tabs'), NOTE = $('#fp-note'), CNT = $('#f-count');
  var IC = function(id){ return '<svg viewBox="0 0 24 24"><use href="#'+id+'"/></svg>' };
  var zh = function(){ return document.body.classList.contains('lang-zh') };
  var esc = function(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;') };

  var SITES = ['IPOH', 'ipoh ', ' Ipoh', 'PENANG', 'penang ', 'PENANG'];
  var rows = [], step = 0, tab = 0, pending = null;

  var S = [
    {ic:'ic-browser', c:'#4f46e5', en:'The page',        zh:'页面',     sEn:'your computer',  sZh:'你的电脑'},
    {ic:'ic-globe',   c:'#0369a1', en:'The request',     zh:'请求',     sEn:'the network',    sZh:'网络'},
    {ic:'ic-server',  c:'#0d9488', en:'The backend',     zh:'后端',     sEn:'their computer', sZh:'他们的电脑'},
    {ic:'ic-db',      c:'#9333ea', en:'The database',    zh:'数据库',   sEn:'stored',         sZh:'已存储'},
    {ic:'ic-funnel',  c:'#d97706', en:'The data platform', zh:'数据平台', sEn:'cleaned',      sZh:'已清洗'}
  ];
  stepsEl.innerHTML = S.map(function(s,i){
    return '<button class="step" data-s="'+i+'" style="--sc:'+s.c+'">' + IC(s.ic)
      + '<b>' + bi(s.en, s.zh) + '</b><small>' + bi(s.sEn, s.sZh) + '</small></button>';
  }).join('');

  function tabsFor(i){
    if (i === 0) return [['HTML','HTML'],['JavaScript','JavaScript'],['Swift (iOS)','Swift（iOS）']];
    if (i === 1) return [['Request','请求'],['Response','响应']];
    if (i === 2) return [['Python','Python'],['What it decided','它做了哪些判断']];
    if (i === 3) return [['SQL','SQL'],['The stored row','存进去的那一行']];
    return [['pandas','pandas'],['Before → after','清洗前 → 清洗后']];
  }
  function tbl(list, mode){
    if (!list.length) return '<div class="emptyhint">' + bi('No rows yet — go back to step 1 and save a name.','还没有数据 —— 回到第 1 步存一个名字。') + '</div>';
    var h = '<table class="dbt"><tr><th>id</th><th>name</th><th>lab_site</th><th>collected_at</th></tr>';
    list.forEach(function(r,i){
      var siteCls = mode === 'clean' ? 'fixed2' : (r.site !== r.site.trim().toUpperCase() ? 'messy' : '');
      var site = mode === 'clean' ? r.site.trim().toUpperCase() : '"' + r.site + '"';
      h += '<tr class="' + (i === list.length-1 && mode !== 'clean' ? 'fresh' : '') + '">'
        + '<td>' + r.id + '</td><td>' + esc(r.name) + '</td>'
        + '<td class="' + siteCls + '">' + esc(site) + '</td><td>' + r.ts + '</td></tr>';
    });
    return h + '</table>';
  }
  function render(){
    var s = S[step], last = rows[rows.length-1] || {id:'S-001', name:'Aisha', site:'IPOH', ts:'2026-03-17'};
    $$('.step', stepsEl).forEach(function(b,i){
      b.classList.toggle('now', i === step);
      b.classList.toggle('done', i < step);
    });
    NOTE.style.setProperty('--sc', s.c);
    var t = tabsFor(step);
    TABS.innerHTML = t.map(function(x,i){ return '<button data-t="'+i+'"' + (i===tab?' class="on"':'') + '>' + bi(x[0],x[1]) + '</button>' }).join('');
    CNT.innerHTML = bi(rows.length + ' record(s) saved so far', '已保存 ' + rows.length + ' 条记录');

    if (step === 0){
      LT.innerHTML = bi('What the person sees','人看到的');
      RT.innerHTML = bi('What it is really made of','它其实是由什么构成的');
      L.innerHTML = '<div class="fbrowser"><div class="fbtop"><i style="background:#ef4444"></i><i style="background:#f59e0b"></i><i style="background:#22c55e"></i>'
        + '<span class="fburl">https://lab.example.com/samples/new</span></div>'
        + '<div class="fbbody"><h5>' + bi('New sample','新建样本') + '</h5>'
        + '<p>' + bi('Enter the name of the person collecting it.','填写采样人的姓名。') + '</p>'
        + '<label>' + bi('Collected by','采样人') + '</label>'
        + '<input id="f-name" value="' + (rows.length ? '' : 'Aisha') + '" placeholder="' + (zh() ? '输入一个名字…' : 'type a name…') + '">'
        + '<button class="fbtn" id="f-save">' + bi('Save sample','保存样本') + '</button></div></div>';
      var code = [
        '<span class="cm">&lt;!-- HTML · the skeleton / 骨架 --&gt;</span>\n'
        + '&lt;<span class="kw">h1</span>&gt;New sample&lt;/<span class="kw">h1</span>&gt;\n'
        + '&lt;<span class="kw">label</span>&gt;Collected by&lt;/<span class="kw">label</span>&gt;\n'
        + '&lt;<span class="kw">input</span> <span class="fn">id</span>=<span class="st">"name"</span>&gt;\n'
        + '&lt;<span class="kw">button</span> <span class="fn">id</span>=<span class="st">"save"</span>&gt;Save sample&lt;/<span class="kw">button</span>&gt;\n\n'
        + '<span class="cm"># This text was downloaded to YOUR computer.\n# Your browser drew the boxes. Nothing was\n# a picture — it was all instructions.\n#\n# 这段文字被下载到了你的电脑上，是你的浏览器\n# 把这些框画出来的。没有一张图片，全是指令。</span>',

        '<span class="cm">// JavaScript · the nervous system / 神经系统</span>\n'
        + 'document.<span class="fn">getElementById</span>(<span class="st">"save"</span>).onclick = <span class="kw">async</span> () =&gt; {\n'
        + '  <span class="kw">const</span> name = document.<span class="fn">getElementById</span>(<span class="st">"name"</span>).value;\n\n'
        + '  <span class="cm">// send it to a computer we do not control</span>\n'
        + '  <span class="kw">await</span> <span class="fn">fetch</span>(<span class="st">"/api/samples"</span>, {\n'
        + '    method: <span class="st">"POST"</span>,\n'
        + '    headers: { <span class="st">"Content-Type"</span>: <span class="st">"application/json"</span> },\n'
        + '    body: <span class="fn">JSON.stringify</span>({ collected_by: name })\n'
        + '  });\n'
        + '};\n\n'
        + '<span class="cm"># That fetch() line is the entire border between\n# your computer and everything else.\n# 那行 fetch() 就是你的电脑和其他一切之间的全部边界。</span>',

        '<span class="cm">// Swift · the SAME screen, on an iPhone\n// Swift · 同一个界面，只是在 iPhone 上</span>\n'
        + '<span class="kw">struct</span> <span class="fn">NewSampleView</span>: View {\n'
        + '  <span class="fn">@State</span> <span class="kw">private var</span> name = <span class="st">""</span>\n\n'
        + '  <span class="kw">var</span> body: some View {\n'
        + '    VStack {\n'
        + '      Text(<span class="st">"New sample"</span>)\n'
        + '      TextField(<span class="st">"Collected by"</span>, text: $name)\n'
        + '      Button(<span class="st">"Save sample"</span>) { save() }\n'
        + '    }\n'
        + '  }\n'
        + '}\n\n'
        + '<span class="cm"># Different language, different words, identical job:\n# collect input, then POST it to the SAME backend.\n# 语言不同、写法不同，做的事完全一样：\n# 收集输入，然后 POST 给同一个后端。</span>'
      ];
      R.innerHTML = '<pre>' + code[Math.min(tab, 2)] + '</pre>';
      NOTE.innerHTML = bi('<b>Everything on this step runs on the visitor’s own machine.</b> Which is exactly why nothing important can be decided here — they can open DevTools and change any of it. Press <b>Save sample</b> to cross the border.',
                          '<b>这一步的一切都跑在访客自己的机器上。</b>这正是任何重要的事都不能在这里决定的原因 —— 他们可以打开开发者工具改掉任何东西。点<b>保存样本</b>越过那条边界。');
      var btn = $('#f-save');
      if (btn) btn.addEventListener('click', function(){
        var v = ($('#f-name').value || '').trim();
        if (!v) { $('#f-name').focus(); return; }
        pending = {id:'S-' + String(rows.length + 1).padStart(3,'0'), name:v,
                   site: SITES[rows.length % SITES.length], ts:'2026-03-17'};
        step = 1; tab = 0; render();
      });
    }

    else if (step === 1){
      var p = pending || last;
      LT.innerHTML = bi('What is happening','正在发生的事');
      RT.innerHTML = bi('The actual text that travelled','真正被传输的文字');
      L.innerHTML = '<div class="envwrap"><div class="envline"></div>'
        + '<div class="envnode">' + IC('ic-browser') + bi('your device','你的设备') + '</div>'
        + '<div class="env">✉</div>'
        + '<div class="envnode">' + IC('ic-server') + bi('their server','他们的服务器') + '</div></div>'
        + '<p style="font-size:14px;color:var(--muted)">' + bi(
          'Your browser looked up <code class="inl">lab.example.com</code> in DNS to get an address, opened an encrypted connection (TLS), and sent a small block of text. Exactly the same thing happens when you load Google, your bank, or this page.',
          '你的浏览器先通过 DNS 查出 <code class="inl">lab.example.com</code> 的地址，建立加密连接（TLS），然后发出一小段文字。你打开谷歌、银行网站、或者这个页面时，发生的是完全一样的事。') + '</p>';
      var req = '<span class="kw">POST</span> /api/samples HTTP/1.1\n'
        + '<span class="fn">Host</span>: lab.example.com\n'
        + '<span class="fn">Content-Type</span>: application/json\n'
        + '<span class="fn">Authorization</span>: <span class="st">Bearer rw_a1b2c3</span>\n\n'
        + '{ "collected_by": <span class="st">"' + esc(p.name) + '"</span> }\n\n'
        + '<span class="cm"># That is the whole request. It is just TEXT.\n# You could type it by hand.\n#\n# 这就是整个请求，它就是一段文字。\n# 你完全可以手打出来。</span>';
      var res = '<span style="color:#86efac;font-weight:700">HTTP/1.1 201 Created</span>\n'
        + '<span class="fn">Content-Type</span>: application/json\n\n'
        + '{ "id": <span class="st">"' + p.id + '"</span>,\n'
        + '  "collected_by": <span class="st">"' + esc(p.name) + '"</span>,\n'
        + '  "lab_site": <span class="st">"' + esc(p.site) + '"</span>,\n'
        + '  "created_at": <span class="st">"2026-03-17T09:14:02Z"</span> }\n\n'
        + '<span class="cm"># 201, not 200 — something NEW now exists.\n# Send this twice and you get TWO samples.\n#\n# 是 201 不是 200 —— 有一个新东西诞生了。\n# 发两次就会得到两份样本。</span>';
      R.innerHTML = '<pre>' + (tab === 0 ? req : res) + '</pre>';
      NOTE.innerHTML = bi('<b>This is the only part that physically travels.</b> Not a page, not a picture — a few hundred characters of text. Everything you have ever done online is this, repeated very fast.',
                          '<b>只有这一部分是真正在物理上传输的。</b>不是页面，不是图片 —— 只是几百个字符的文本。你在网上做过的一切，都是这个东西的高速重复。');
    }

    else if (step === 2){
      var p2 = pending || last;
      LT.innerHTML = bi('On a machine you will never see','在一台你永远不会见到的机器上');
      RT.innerHTML = bi('The code that ran','实际运行的代码');
      L.innerHTML = '<div style="text-align:center;padding:12px 0">'
        + '<div style="width:64px;height:64px;border-radius:18px;background:color-mix(in srgb, var(--ok) 7%, var(--paper));color:var(--m2);display:grid;place-items:center;margin:0 auto 12px">'
        + '<svg viewBox="0 0 24 24" style="width:32px;height:32px"><use href="#ic-server"/></svg></div>'
        + '<b style="font-size:15px">' + bi('Backend API','后端 API') + '</b></div>'
        + '<div style="font-size:14px">'
        + '<div style="padding:8px 12px;border-radius:8px;background:color-mix(in srgb, var(--ok) 8%, var(--paper));margin-bottom:6px">✓ ' + bi('Is this caller allowed? <b>Yes</b> — valid token','这个调用方有权限吗？<b>有</b> —— 令牌有效') + '</div>'
        + '<div style="padding:8px 12px;border-radius:8px;background:color-mix(in srgb, var(--ok) 8%, var(--paper));margin-bottom:6px">✓ ' + bi('Is the name empty? <b>No</b>','名字是空的吗？<b>不是</b>') + '</div>'
        + '<div style="padding:8px 12px;border-radius:8px;background:color-mix(in srgb, var(--ok) 8%, var(--paper));margin-bottom:6px">✓ ' + bi('Which site are they at? <b>' + esc(p2.site) + '</b> (from their profile)','他们在哪个厂区？<b>' + esc(p2.site) + '</b>（来自他们的账号资料）') + '</div>'
        + '<div style="padding:8px 12px;border-radius:8px;background:color-mix(in srgb, var(--ok) 8%, var(--paper))">✓ ' + bi('Give it an id: <b>' + p2.id + '</b>','分配一个编号：<b>' + p2.id + '</b>') + '</div></div>';
      var py = '<span class="fn">@app.route</span>(<span class="st">"/api/samples"</span>, methods=[<span class="st">"POST"</span>])\n'
        + '<span class="kw">def</span> <span class="fn">create_sample</span>():\n'
        + '    user = <span class="fn">authenticate</span>(request.headers[<span class="st">"Authorization"</span>])\n'
        + '    <span class="kw">if not</span> user:\n'
        + '        <span class="kw">return</span> <span class="st">""</span>, <span class="nu">401</span>          <span class="cm"># who are you?</span>\n\n'
        + '    name = request.<span class="fn">json</span>.<span class="fn">get</span>(<span class="st">"collected_by"</span>, <span class="st">""</span>).<span class="fn">strip</span>()\n'
        + '    <span class="kw">if not</span> name:\n'
        + '        <span class="kw">return</span> {<span class="st">"error"</span>: <span class="st">"name required"</span>}, <span class="nu">400</span>\n\n'
        + '    <span class="cm"># the site comes from the USER, not the form —\n    # never trust what the browser sends you\n    # 厂区取自用户资料，而不是表单 —— 永远不要相信浏览器发来的东西</span>\n'
        + '    sample = <span class="fn">db_insert</span>(\n'
        + '        collected_by=name,\n'
        + '        lab_site=user.site,\n'
        + '    )\n'
        + '    <span class="kw">return</span> sample, <span class="nu">201</span>';
      var dec = '<span class="cm"># Why this code lives HERE and not in the browser\n# 为什么这段代码住在这里，而不是在浏览器里</span>\n\n'
        + '1. <span class="fn">authenticate()</span>\n'
        + '   <span class="cm">If this ran in the browser, anyone could\n   skip it. Identity must be checked somewhere\n   the user cannot edit.\n   如果它跑在浏览器里，谁都能跳过它。身份必须在\n   用户改不到的地方校验。</span>\n\n'
        + '2. <span class="fn">user.site</span>  <span class="cm">not  form.site</span>\n'
        + '   <span class="cm">The form could claim any site. The server\n   uses what it already knows about the user.\n   表单可以声称任何厂区，服务器用的是它自己\n   已经知道的用户信息。</span>\n\n'
        + '3. <span class="fn">db_insert()</span>\n'
        + '   <span class="cm">The database is not reachable from the\n   internet. Only this code can touch it.\n   数据库无法从互联网访问，只有这段代码碰得到它。</span>';
      R.innerHTML = '<pre>' + (tab === 0 ? py : dec) + '</pre>';
      NOTE.innerHTML = bi('<b>This is what "the server" actually means:</b> a computer, somewhere else, running this function, that the visitor has no way to reach or modify. That is the entire reason the rules live here.',
                          '<b>这就是"服务器"真正的意思：</b>另一个地方的一台电脑，运行着这个函数，而访客既够不到它、也改不了它。规则住在这里的全部理由就是这个。');
    }

    else if (step === 3){
      if (pending){ rows.push(pending); pending = null; CNT.innerHTML = bi(rows.length + ' record(s) saved so far','已保存 ' + rows.length + ' 条记录'); }
      var p3 = rows[rows.length-1] || last;
      LT.innerHTML = bi('The live database, right now','此刻的生产数据库');
      RT.innerHTML = bi('What the backend actually sent it','后端实际发给它的东西');
      L.innerHTML = tbl(rows, 'raw')
        + '<p style="font-size:13px;color:var(--muted);margin:12px 0 0">' + bi(
          'This table is what is true <b>right now</b>. It is tuned to write one row very fast — not to answer "what was our pass rate last quarter?"',
          '这张表存的是<b>此刻</b>的真相。它为"极快地写入一行"而调优 —— 不是为了回答"我们上季度合格率多少"。') + '</p>';
      var sql = '<span class="kw">INSERT INTO</span> samples\n'
        + '  (sample_id, collected_by, lab_site, collected_at)\n'
        + '<span class="kw">VALUES</span>\n'
        + '  (<span class="st">\'' + p3.id + '\'</span>, <span class="st">\'' + esc(p3.name) + '\'</span>, <span class="st">\'' + esc(p3.site) + '\'</span>, <span class="st">\'2026-03-17\'</span>);\n\n'
        + '<span class="cm"># Notice lab_site: it arrived exactly as the\n# source system had it — spaces, capitals and all.\n# The database stores what it is given. It does\n# not tidy anything up. Nobody is checking.\n#\n# 注意 lab_site：它是源系统里什么样就存成什么样 ——\n# 空格、大小写，原样照收。数据库只负责存，不会\n# 帮你整理，也没有人在检查。</span>';
      var row = '{\n  <span class="fn">"sample_id"</span>:    <span class="st">"' + p3.id + '"</span>,\n'
        + '  <span class="fn">"collected_by"</span>: <span class="st">"' + esc(p3.name) + '"</span>,\n'
        + '  <span class="fn">"lab_site"</span>:     <span class="st">"' + esc(p3.site) + '"</span>,'
        + (p3.site !== p3.site.trim().toUpperCase() ? '   <span class="cm">← already messy!  ← 已经脏了！</span>' : '') + '\n'
        + '  <span class="fn">"collected_at"</span>: <span class="st">"2026-03-17"</span>\n}\n\n'
        + '<span class="cm"># Save a few more names and watch the lab_site\n# column drift apart. Nothing will warn you.\n# 再多存几个名字，看着 lab_site 这一列慢慢分叉。\n# 不会有任何东西提醒你。</span>';
      R.innerHTML = '<pre>' + (tab === 0 ? sql : row) + '</pre>';
      NOTE.innerHTML = bi('<b>Save a few more names.</b> The site column is arriving in three different spellings, because different upstream systems capitalise differently. No error, no warning — the data is simply, quietly wrong. <b>That is the problem the next step exists to solve.</b>',
                          '<b>再多存几个名字。</b>厂区那一列正在以三种不同写法进来，因为不同的上游系统大小写规则不一样。没有报错、没有警告 —— 数据就是这样安静地错了。<b>下一步存在的意义，就是解决这个问题。</b>');
    }

    else {
      LT.innerHTML = bi('Nightly pipeline · before → after','每晚的管道 · 清洗前 → 清洗后');
      RT.innerHTML = bi('The cleaning code','清洗代码');
      var sitesRaw = {}, sitesClean = {};
      rows.forEach(function(r){ sitesRaw[r.site] = 1; sitesClean[r.site.trim().toUpperCase()] = 1; });
      var nRaw = Object.keys(sitesRaw).length, nClean = Object.keys(sitesClean).length;
      L.innerHTML = (rows.length
        ? '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--no);margin-bottom:6px">'
            + bi('Raw — as the product stored it','原始 —— 产品存进去的样子') + '</div>' + tbl(rows,'raw')
          + '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ok);margin:16px 0 6px">'
            + bi('Cleaned — what analysts get','清洗后 —— 分析师拿到的') + '</div>' + tbl(rows,'clean')
          + '<div class="dstat" style="margin-top:14px"><div><b style="color:var(--no)">' + nRaw + '</b><span>'
            + bi('distinct sites before','清洗前不同厂区数') + '</span></div><div><b style="color:var(--ok)">' + nClean + '</b><span>'
            + bi('distinct sites after','清洗后不同厂区数') + '</span></div></div>'
        : '<div class="emptyhint">' + bi('Save a few names first — then come back and see what has to be fixed.','先存几个名字 —— 再回来看看有什么需要修的。') + '</div>');
      var pd = '<span class="kw">import</span> pandas <span class="kw">as</span> pd\n\n'
        + '<span class="cm"># 1. read a COPY. never query the live database\n#    from a pipeline.\n#    读的是副本。管道绝不直接查生产库。</span>\n'
        + 'df = pd.<span class="fn">read_sql</span>(<span class="st">"SELECT * FROM samples_replica"</span>, conn)\n\n'
        + '<span class="cm"># 2. the one line that fixes the whole mess\n#    修好整个烂摊子的那一行</span>\n'
        + 'df[<span class="st">"lab_site"</span>] = df[<span class="st">"lab_site"</span>].<span class="fn">str</span>.<span class="fn">strip</span>().<span class="fn">str</span>.<span class="fn">upper</span>()\n\n'
        + '<span class="cm"># 3. prove it before loading anything\n#    加载之前先证明它是对的</span>\n'
        + '<span class="kw">assert</span> df[<span class="st">"sample_id"</span>].<span class="fn">is_unique</span>\n'
        + '<span class="kw">assert</span> df[<span class="st">"collected_by"</span>].<span class="fn">notna</span>().<span class="fn">all</span>()\n\n'
        + '<span class="cm"># 4. replace, do not append — so re-running is safe\n#    替换而不是追加 —— 这样重跑才安全</span>\n'
        + 'df.<span class="fn">to_sql</span>(<span class="st">"fact_samples"</span>, wh, if_exists=<span class="st">"replace"</span>)';
      var ba = '<span class="cm"># Before / 清洗前</span>\n'
        + Object.keys(sitesRaw).map(function(k){ return '  <span class="st">"' + esc(k) + '"</span>' }).join('\n')
        + '\n\n<span class="cm"># After / 清洗后</span>\n'
        + Object.keys(sitesClean).map(function(k){ return '  <span class="st">"' + esc(k) + '"</span>' }).join('\n')
        + '\n\n<span class="cm"># ' + nRaw + ' "different sites" became ' + nClean + '.\n'
        + '# Before this step, every GROUP BY lab_site was\n'
        + '# splitting one site into several and under-\n'
        + '# reporting it. Nobody would have noticed.\n#\n'
        + '# ' + nRaw + ' 个"不同厂区"变成了 ' + nClean + ' 个。在这一步之前，\n'
        + '# 每一次 GROUP BY lab_site 都把一个厂区拆成好几个、\n'
        + '# 少报了数据。而不会有任何人发现。</span>';
      R.innerHTML = '<pre>' + (tab === 0 ? pd : ba) + '</pre>';
      NOTE.innerHTML = bi('<b>This is your job, in one screen.</b> Nobody upstream did anything wrong — the product stored exactly what it was given. Making it trustworthy is a separate discipline, and it happens here, downstream, on a schedule, by you.',
                          '<b>这一屏就是你的工作。</b>上游没有人做错任何事 —— 产品只是原样存下了收到的东西。让它变得可信是另一门功课，而它发生在这里：下游、定时、由你来做。');
    }
  }
  stepsEl.addEventListener('click', function(e){
    var b = e.target.closest('.step'); if (!b) return;
    step = +b.dataset.s; tab = 0; render();
  });
  TABS.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    tab = +b.dataset.t; render();
  });
  $('#f-next').addEventListener('click', function(){ if (step < 4){ step++; tab = 0; render(); } });
  $('#f-prev').addEventListener('click', function(){ if (step > 0){ step--; tab = 0; render(); } });
  $('#f-reset').addEventListener('click', function(){ rows = []; pending = null; step = 0; tab = 0; render(); });
  $$('.langsw button').forEach(function(b){ b.addEventListener('click', function(){ setTimeout(render, 10) }) });
  render();
})();
}catch(_e){console.warn("[widget skipped] PLAYGROUND 12 · the full journey:", _e && _e.message)}

/* ================= the tech stack atlas ================= */
try{
(function(){
  var grid = $('#catgrid'); if (!grid) return;
  var mdl = $('#techmodal'), card = $('.mdl-card', mdl);
  var IC = function(id){ return '<svg viewBox="0 0 24 24"><use href="#'+id+'"/></svg>' };
  function I(ab,n,c,l,wEn,wZh,nEn,nZh){ return {ab:ab,n:n,c:c,l:l,wEn:wEn,wZh:wZh,nEn:nEn,nZh:nZh} }

  var CATS = [
  {ic:'ic-browser', ck:'#4f46e5', en:'Web frontend', zh:'网页前端', wEn:'Your device', wZh:'你的设备', wc:'#4f46e5', items:[
    I('&lt;/&gt;','HTML','#e34f26','must','The skeleton — what exists on the page and how the parts connect.','骨架 —— 页面上有什么、各部分怎么连接。','Two evenings. You must be able to read a page and know what a div is.','两个晚上。你必须能读懂一个页面、知道 div 是什么。'),
    I('#','CSS','#264de4','must','The clothes — colour, spacing, layout. Change it and nothing about the content changes.','衣服 —— 颜色、间距、布局。改它，内容一点都不会变。','Recognise it. Do not sink a month into layout — that is a specialist skill.','认得就行。别在布局上砸一个月，那是专门的手艺。'),
    I('JS','JavaScript','#f7df1e','must','The nervous system — the only language a browser runs. Click something, it reacts.','神经系统 —— 浏览器唯一会跑的语言。你一点，它就有反应。','Ten lines’ worth. Enough to read a page’s behaviour and use DevTools properly.','会十行就够。够你读懂页面行为、用好开发者工具。'),
    I('R','React','#61dafb','good','A way to build a page out of reusable pieces instead of one giant file — like lab kits instead of loose glassware.','把页面拆成可复用的小块来搭，而不是一个巨大的文件 —— 就像用成套试剂盒而不是散装玻璃器皿。','Learn to READ it, not write it. Enough to understand what the frontend asks your API for.','学会读，不用学会写。够你理解前端向你的 API 要什么。'),
    I('V','Vue','#42b883','later','A rival to React that does the same job with gentler syntax.','React 的竞争者，做同样的事，语法更温和。','Only if your company already uses it.','只有当你们公司已经在用时才学。'),
    I('A','Angular','#dd0031','later','An older, heavier, more opinionated rival to React. Common in large enterprises.','比 React 更老、更重、更强规矩的竞争者，大企业里常见。','Only if you inherit one.','只有接手了现成的才学。'),
    I('N','Next.js','#000000','later','React plus the server side bolted on, so pages can be built before they reach the browser.','React 外加服务端，页面在到达浏览器之前就先生成好。','Not your region. Recognise the name.','不是你的区域，认得这个名字就行。'),
    I('TW','Tailwind','#38bdf8','later','A shorthand for writing CSS directly in the HTML instead of a separate file.','一种把 CSS 直接写在 HTML 里的速记法，不用单独的样式文件。','Purely a styling preference. Skip.','纯粹是样式偏好，跳过。')
  ]},
  {ic:'ic-phone', ck:'#6366f1', en:'Mobile', zh:'移动端', wEn:'Your device', wZh:'你的设备', wc:'#4f46e5', items:[
    I('SW','Swift','#f05138','later','Apple’s language for iPhone apps. Different words, identical job to the web page — collect input, call the same API.','苹果做 iPhone App 的语言。写法不同，做的事和网页完全一样 —— 收集输入、调同一个 API。','Never, unless you change career. Just know it talks to the same backend you do.','除非转行，否则永远不用。知道它和你连的是同一个后端就够了。'),
    I('KT','Kotlin','#7f52ff','later','The same thing for Android phones.','安卓手机上的同一件事。','Same answer. Recognise the name.','同上，认得名字就行。'),
    I('RN','React Native','#61dafb','later','Write once in JavaScript, run on both iPhone and Android. A cost-saving trade-off.','用 JavaScript 写一次，iPhone 和安卓都能跑。一种省成本的折中。','Recognise it.','认得就行。'),
    I('FL','Flutter','#02569b','later','Google’s version of that same idea, using a language called Dart.','谷歌版的同一个想法，用一种叫 Dart 的语言。','Recognise it.','认得就行。')
  ]},
  {ic:'ic-server', ck:'#0d9488', en:'Backend', zh:'后端', wEn:'The server side', wZh:'服务端', wc:'#0d9488', items:[
    I('PY','Python','#3776ab','must','Your primary instrument. The closest language to plain English, and the default language of all data work.','你最主要的仪器。最接近大白话的语言，也是所有数据工作的默认语言。','This is the one. Variables, lists, dicts, loops, functions, files, errors, imports. Stop there.','就是它。变量、列表、字典、循环、函数、读文件、错误处理、导入库。学到这停。'),
    I('FL','Flask','#000000','must','Pre-built plumbing that turns a Python function into a working web API in about nine lines.','现成的管路，九行左右就能把一个 Python 函数变成能跑的 Web API。','Learn it properly. You will build internal APIs with it in your first year.','认真学。第一年你就会用它写内部 API。'),
    I('FA','FastAPI','#009688','good','A modern Flask with automatic documentation and type checking built in.','现代版 Flask，自带自动文档和类型检查。','Either this or Flask. Pick whichever your team uses.','和 Flask 二选一，看团队用哪个。'),
    I('DJ','Django','#092e20','later','A much bigger framework that brings a database layer, an admin panel and user accounts with it.','大得多的框架，自带数据库层、后台管理界面和用户系统。','Overkill for data APIs. Recognise it.','对数据类 API 来说过重。认得就行。'),
    I('ND','Node.js','#339933','good','JavaScript running on the server instead of in the browser — so one team can use one language on both sides.','让 JavaScript 跑在服务器上而不是浏览器里 —— 这样一个团队两边都用同一种语言。','Recognise it. You will meet it in other people’s services.','认得就行。你会在别人的服务里遇到它。'),
    I('EX','Express','#000000','later','Node’s equivalent of Flask — the minimal way to build an API in JavaScript.','Node 世界里的 Flask —— 用 JavaScript 写 API 的最简方式。','Recognise it.','认得就行。'),
    I('JV','Java','#f89820','later','The language of very large, very old, very reliable enterprise systems. Banks run on it.','超大型、很老、很可靠的企业系统用的语言。银行跑在它上面。','Only if your company is one of those.','只有你们公司属于那一类时才学。'),
    I('GO','Go','#00add8','later','A newer language built for fast, simple network services. Docker and Kubernetes are written in it.','较新的语言，为快速、简单的网络服务而生。Docker 和 Kubernetes 就是用它写的。','Recognise it.','认得就行。'),
    I('API','REST API','#0d9488','must','Not a tool — an agreement. The standard shape of request and answer between any two systems.','它不是工具，是一份约定：任意两个系统之间请求和回答的标准形状。','Non-negotiable. GET/POST, status codes, JSON. Milestone 1.','没得商量。GET/POST、状态码、JSON。阶段一。'),
    I('gR','gRPC','#4285f4','later','A faster, stricter alternative to REST used between services inside a company.','比 REST 更快更严格的替代方案，用于公司内部服务之间。','Recognise it. You will hear the name in architecture meetings.','认得就行，架构会上会听到。')
  ]},
  {ic:'ic-db', ck:'#9333ea', en:'Databases', zh:'数据库', wEn:'The server side', wZh:'服务端', wc:'#9333ea', items:[
    I('SQL','SQL','#9333ea','must','The language for asking a database questions. Not a product — a skill that transfers to every database on this list.','向数据库提问的语言。它不是某个产品，而是一项能迁移到这个列表上所有数据库的技能。','<b>If you learn one thing exceptionally well this year, make it this.</b> It is the single most valuable skill in the job.','<b>如果这一年只能把一件事学到出类拔萃，就选它。</b>这是这份工作里最值钱的一项技能。'),
    I('PG','PostgreSQL','#336791','must','The default serious open-source database. Reliable, free, and does far more than people expect.','默认的、正经的开源数据库。可靠、免费，能做的事远超大多数人的预期。','Learn on this one. What you learn transfers almost everywhere.','就用它来学。学到的东西几乎能迁移到任何地方。'),
    I('MY','MySQL','#00758f','good','The other very common open-source database. Slightly different dialect, same ideas.','另一个非常常见的开源数据库。方言略有不同，思路一样。','If you know Postgres you can read MySQL the same day.','会 Postgres 的话，当天就能读懂 MySQL。'),
    I('LT','SQLite','#003b57','must','A whole database inside a single file. No server, no setup, no password.','整个数据库就是一个文件。不用服务器、不用配置、不用密码。','<b>Start here.</b> It is the fastest possible way to practise SQL tonight.','<b>从这里开始。</b>这是今晚就能练 SQL 的最快方式。'),
    I('MG','MongoDB','#47a248','good','Stores flexible documents instead of rigid tables. Good when the shape of the data keeps changing.','存的是灵活的文档，不是固定的表。数据结构经常变时很好用。','Know what it is and when it is the wrong choice — which is more often than people think.','知道它是什么、以及什么时候不该用它 —— 那种情况比大多数人以为的多。'),
    I('RD','Redis','#dc382d','good','An extremely fast in-memory store, usually used as a cache or a queue rather than a permanent home.','极快的内存存储，通常当缓存或队列用，而不是永久的家。','Recognise it. You will see it in every architecture diagram.','认得就行。你会在每一张架构图上看到它。'),
    I('CS','Cassandra','#1287b1','later','A database spread across many machines, built for enormous write volumes.','分布在很多台机器上的数据库，为超大写入量而生。','Later, and only at real scale.','以后再说，而且只有真到那个量级才需要。')
  ]},
  {ic:'ic-funnel', ck:'#d97706', en:'Data platform — your region', zh:'数据平台 —— 你的地盘', wEn:'The data platform', wZh:'数据平台', wc:'#d97706', items:[
    I('pd','pandas','#150458','must','SQL that lives in memory — tables you can filter, group, join and clean inside Python.','活在内存里的 SQL —— 在 Python 里就能筛选、分组、关联、清洗的表。','Daily. read_csv, filtering, groupby, merge, fillna, dates. That is 90% of it.','天天用。read_csv、筛选、groupby、merge、fillna、日期处理。这就覆盖 90%。'),
    I('np','NumPy','#4d77cf','must','The fast maths layer underneath pandas. It is compiled C wearing a Python coat — which is why vectorising is 100× faster.','pandas 底下那层快速数学库。它是披着 Python 外衣的编译版 C —— 这就是向量化快 100 倍的原因。','You will use it through pandas mostly. Understand why it is fast.','大部分时候你是通过 pandas 用它。理解它为什么快。'),
    I('PL','Polars','#0075ff','good','A much faster pandas, written in Rust, that handles files bigger than your memory.','快得多的 pandas，用 Rust 写的，能处理比内存还大的文件。','Learn the day pandas says MemoryError. Not before.','等 pandas 报 MemoryError 那天再学，不用提前。'),
    I('DD','DuckDB','#fff100','good','Runs SQL directly on files — no server, no setup. Often replaces a whole cluster on one laptop.','直接对文件跑 SQL —— 不用服务器、不用配置。常常一台笔记本就顶掉一整个集群。','Genuinely worth a weekend. It will save you from reaching for Spark.','真的值得花一个周末。它能让你不用动不动就上 Spark。'),
    I('AF','Airflow','#017cee','good','A scheduler: it runs your pipeline at 2am, retries it when it fails, and shows you which step broke.','调度器：凌晨两点跑你的管道、失败了自动重试、并告诉你是哪一步坏了。','Learn the concepts first — schedule, retry, dependency. The tool is replaceable.','先学概念——调度、重试、依赖。工具本身是可替换的。'),
    I('dbt','dbt','#ff694b','good','Lets you write your warehouse transformations as plain SQL files that live in Git and get tested.','让你把数仓里的转换逻辑写成普通 SQL 文件，存进 Git，还能测试。','Increasingly the industry default for the transform step.','正在成为"转换"这一步的行业默认选择。'),
    I('KF','Kafka','#231f20','good','A pipe that carries a continuous stream of events — every click, order and payment as it happens.','一根管子，承载持续的事件流 —— 每一次点击、下单、支付，发生时就流过去。','Understand the idea before the tool. Events, not batches.','先理解想法，再学工具。是事件，不是批次。'),
    I('SP','Spark','#e25a1c','later','Splits one enormous job across many machines. Powerful, heavy, and usually not needed.','把一个巨大的任务拆到很多台机器上跑。强大、笨重，而且通常用不着。','Only when a single machine genuinely cannot cope. Try DuckDB first.','只有当单机真的撑不住时才用。先试 DuckDB。'),
    I('SF','Snowflake','#29b5e8','good','A warehouse you rent rather than run — storage and compute billed separately, scales itself.','租来的数据仓库，不用自己运维 —— 存储和算力分开计费，自动伸缩。','Same family as BigQuery and Redshift. Learn the concept, the vendor changes.','和 BigQuery、Redshift 同一类。学概念，厂商会换。'),
    I('BQ','BigQuery','#4285f4','good','Google’s version of the same thing — SQL over enormous data with no servers to manage.','谷歌版的同一个东西 —— 对海量数据跑 SQL，不用管服务器。','Whichever your company already pays for.','公司已经在付钱的那个就学哪个。'),
    I('PQ','Parquet','#50abf1','good','A file format that stores data by column instead of by row — so reading one column doesn’t read all forty.','一种按列而不是按行存储的文件格式 —— 读一列时不用把四十列全读一遍。','Understand why columnar is faster for analysis. It explains modern warehouses.','理解列式为什么更适合分析。它解释了现代数仓的一切。'),
    I('GE','Great Expectations','#ff6310','good','Writes your data quality checks as testable rules — row counts, nulls, ranges — that fail loudly.','把数据质量检查写成可测试的规则——行数、空值、取值范围——不满足就大声失败。','The concept is essential. Plain asserts do the job at first.','这个概念很重要。一开始用普通 assert 就够。'),
    I('R','R / tidyverse','#276dc3','good','A language built by statisticians, excellent for exploration and publication-quality charts.','统计学家造的语言，做探索分析和出版级图表非常出色。','You may already know it from science. Keep it for stats; use Python for anything scheduled.','理科背景可能你已经会了。统计留给它，任何定时跑的东西用 Python。')
  ]},
  {ic:'ic-cloud', ck:'#0369a1', en:'Cloud', zh:'云平台', wEn:'Infrastructure', wZh:'基础设施', wc:'#64748b', items:[
    I('AWS','AWS','#ff9900','must','The biggest rental company for computers, storage and networking. Most of the internet runs on it.','最大的算力、存储和网络出租公司。互联网的大部分跑在它上面。','Free tier, launch one machine, shut it down. That is enough to stop being afraid of it.','用免费额度开一台机器再关掉。这就够你不再怕它了。'),
    I('AZ','Azure','#0089d6','good','Microsoft’s equivalent. Very common in companies that already run on Microsoft.','微软的同类产品。已经在用微软全家桶的公司里非常常见。','The concepts transfer completely. Only the product names change.','概念完全可迁移，变的只是产品名。'),
    I('GCP','Google Cloud','#4285f4','good','Google’s equivalent, strongest around data and analytics.','谷歌的同类产品，在数据和分析方面最强。','Same concepts again.','还是同一套概念。'),
    I('S3','S3 / Blob','#569a31','must','Somewhere to put unlimited files, very cheaply, reachable from anywhere with a key.','一个可以无限存文件的地方，非常便宜，拿着钥匙从任何地方都能访问。','You will use this constantly. Raw data lands here before anything else happens.','你会一直用到它。原始数据在任何事发生之前先落在这里。'),
    I('EC2','EC2 / VM','#ff9900','good','A rented computer. That is genuinely all it is.','一台租来的电脑。真的就只是这样。','Launch one once so the word stops being abstract.','亲手开一台，这个词就不再抽象了。'),
    I('λ','Lambda','#ff9900','good','Run one function when something triggers it, and pay per millisecond. No server to manage.','有事件触发时跑一个函数，按毫秒计费。没有服务器要管。','Perfect for a job that runs 40 times a day for 3 seconds.','特别适合每天跑 40 次、每次 3 秒的任务。'),
    I('IAM','IAM / permissions','#dd344c','must','Who is allowed to do what. Every access problem and every security incident lives here.','谁被允许做什么。所有访问问题和所有安全事故都住在这里。','Least privilege, from day one. Read-only unless you need to write.','从第一天起就最小权限。不需要写就只给只读。')
  ]},
  {ic:'ic-cube', ck:'#64748b', en:'Infrastructure &amp; DevOps', zh:'基础设施与运维', wEn:'Infrastructure', wZh:'基础设施', wc:'#64748b', items:[
    I('LX','Linux','#000000','must','The operating system nearly every server runs. Happy with no screen, no mouse, no desktop.','几乎每台服务器跑的操作系统。没有屏幕、没有鼠标、没有桌面它也照样跑。','About twenty commands. ls, cd, cat, grep, tail, df, ps, ssh. That is the whole ask.','大约二十条命令。ls、cd、cat、grep、tail、df、ps、ssh。全部要求就这些。'),
    I('SH','Bash / shell','#4eaa25','must','The language you type at a terminal. Small tools joined with a pipe, each doing one thing.','你在终端里敲的那门语言。用管道把只做一件事的小工具串起来。','The pipe is the whole idea: grep FAIL file.csv | wc -l','管道就是全部精髓：grep FAIL file.csv | wc -l'),
    I('GIT','Git','#f05032','must','A lab notebook for code — every change dated, attributed and reversible.','给代码用的实验记录本 —— 每次改动都有日期、有署名、可撤销。','Eight commands cover 95% of daily use. Non-negotiable for every role.','八条命令覆盖日常 95%。对每个角色都没得商量。'),
    I('GH','GitHub','#181717','must','Where the team’s notebooks live, plus a colleague reading yours before it counts.','全组记录本存放的地方，外加一位同事在它生效前先读一遍。','Push your practice projects here. It is your public evidence.','把练习项目推上去，这是你公开的证据。'),
    I('DK','Docker','#2496ed','good','A sealed box holding your code plus its exact environment, so it behaves the same everywhere.','一个密封盒子，装着你的代码和它确切的运行环境，到哪表现都一样。','Year two. It kills "it works on my machine" for good.','第二年。它彻底消灭"在我机器上是好的"。'),
    I('K8','Kubernetes','#326ce5','later','Decides which container runs on which machine, restarts the dead ones, adds more when busy.','决定哪个容器跑在哪台机器上、重启挂掉的、忙时自动加。','Genuinely complex. Do not go looking for it — it will find you.','是真的复杂。别去找它，它会来找你。'),
    I('NX','Nginx','#009639','good','The receptionist at the front door: takes every request and passes it to the right place.','守在大门口的前台：接下每个请求，转给该处理的地方。','Same family as Apache. Recognise what it does in a diagram.','和 Apache 同一类。在架构图上认得它做什么就行。'),
    I('TF','Terraform','#7b42bc','later','Describes your cloud setup as code, so the whole thing can be rebuilt from a file.','把你的云配置写成代码，整套环境能从一个文件重建出来。','Later. Useful once you own real infrastructure.','以后再说。等你真的要管基础设施时才有用。'),
    I('CI','GitHub Actions','#2088ff','good','Runs your tests automatically when you push, and deploys when they pass.','你一推代码它就自动跑测试，通过了就自动发布。','The moment your pipeline matters, this is how you stop breaking it.','当你的管道开始重要起来，这就是你不再弄坏它的方式。'),
    I('JK','Jenkins','#d24939','later','The older, self-hosted version of the same idea. Still everywhere in large companies.','同一个想法的老牌自建版本。在大公司里依然到处都是。','Only if you inherit one.','只有接手了现成的才学。')
  ]},
  {ic:'ic-brain', ck:'#9333ea', en:'AI tools', zh:'AI 工具', wEn:'Everywhere', wZh:'贯穿全图', wc:'#9333ea', items:[
    I('AI','Claude / GPT / Gemini','#9333ea','must','Text engines that predict the most likely next words. Often right; never able to know when they are wrong.','预测最可能的下一段文字的文本引擎。经常是对的，但永远不知道自己什么时候错了。','Use daily, verify always. Rankings change every few months — do not memorise them.','天天用，永远验。排名每几个月就变，别去背。'),
    I('DS','DeepSeek','#4d6bfe','good','A strong open-weight model — you can run it on your own hardware, so sensitive data never leaves.','一个强大的开放权重模型 —— 可以跑在自己的硬件上，敏感数据不出门。','Knowing this option exists is what saves a project legal says no to.','知道有这个选项，能救一个被法务否掉的项目。'),
    I('CU','Cursor','#000000','must','A code editor with a model inside that can read your whole project — so it answers about YOUR files.','内置模型的代码编辑器，能读你的整个项目 —— 所以它回答的是关于<b>你的</b>文件的问题。','Use it to explain unfamiliar code line by line. Read every suggestion before accepting.','用它逐行讲解陌生代码。接受任何建议之前先读一遍。'),
    I('PE','Prompting','#9333ea','must','Not magic — technical writing. Context, a definition of the fuzzy word, the output format, one example.','不是魔法，是技术写作。背景、把模糊的词定义清楚、输出格式、一个示例。','The highest-leverage skill on this page. Most bad answers are starved briefings.','这一页上杠杆最高的技能。大多数糟糕的答案，是简报太饿。'),
    I('MCP','MCP','#d97706','good','One standard socket that lets an AI reach real systems — with permissions you control.','一个标准插口，让 AI 能接触真实系统 —— 权限由你控制。','Read-only first. An agent with write access and a confident wrong plan loses data fast.','先只读。一个有写权限又带着自信错误计划的 Agent，丢数据很快。')
  ]}];

  grid.innerHTML = CATS.map(function(c,ci){
    return '<div class="cat" style="--ck:'+c.ck+'"><div class="cathead">' + IC(c.ic)
      + '<b>' + bi(c.en, c.zh) + '</b><span class="where">' + bi(c.wEn, c.wZh) + '</span></div>'
      + '<div class="chips">' + c.items.map(function(t,ti){
          return '<button class="chip2" data-c="'+ci+'" data-t="'+ti+'" style="--tc:'+t.c+'">'
            + '<span class="lg">' + t.ab + '</span>' + t.n + '<span class="lvl ' + t.l + '"></span></button>';
        }).join('') + '</div></div>';
  }).join('');

  var LVL = {must:['Must learn this year','今年必学'], good:['Good to recognise','认得就行'], later:['Later — or never','以后再说 —— 或者永远不用']};
  function open2(ci, ti){
    var c = CATS[ci], t = c.items[ti];
    card.style.setProperty('--k', t.c === '#000000' ? '#334155' : t.c);
    $('#tm-ic').innerHTML  = '<span style="font:800 15px var(--mono)">' + t.ab + '</span>';
    $('#tm-cat').innerHTML = bi(c.en, c.zh);
    $('#tm-title').textContent = t.n;
    $('#tm-body').innerHTML =
        '<div class="mdl-where"><i style="background:' + c.wc + '"></i>'
          + bi('On the map: <b>' + c.wEn + '</b>', '在地图上：<b>' + c.wZh + '</b>') + '</div>'
      + '<span class="pill ' + t.l + '">' + bi(LVL[t.l][0], LVL[t.l][1]) + '</span>'
      + '<div class="mdl-blk"><div class="bl">' + bi('What it is','它是什么') + '</div><p>' + bi(t.wEn, t.wZh) + '</p></div>'
      + '<div class="mdl-blk eg"><div class="bl">' + bi('◈ How much do you need?','◈ 你需要学到什么程度？') + '</div><p>' + bi(t.nEn, t.nZh) + '</p></div>';
    mdl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close2(){ mdl.classList.remove('open'); document.body.style.overflow = ''; }
  $('.mdl-x', mdl).addEventListener('click', close2);
  $('.mdl-back', mdl).addEventListener('click', close2);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close2(); });
  grid.addEventListener('click', function(e){
    var b = e.target.closest('.chip2'); if (b) open2(+b.dataset.c, +b.dataset.t);
  });
})();
}catch(_e){console.warn("[widget skipped] the tech stack atlas:", _e && _e.message)}


/* ================= THEN → NOW · a shift you scrub ================= */
try{
(function(){
  var blocks = $$('.evo');
  if (!blocks.length) return;
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var X0 = 8, X1 = 592, SPAN = X1 - X0;
  function mk(n, a){ var e = document.createElementNS(NS, n); for (var q in a) e.setAttribute(q, a[q]); return e }

  blocks.forEach(function(evo){
    var then = evo.querySelector('.evo-col.then'), now = evo.querySelector('.evo-col.now');
    if (!then || !now) return;

    /* each <ul> is one language of the same list — index them separately so the
       reveal stays in step when the reader flips EN / 中文 */
    var nowL  = $$('ul', now ).map(function(u){ return $$('li', u) });
    var thenL = $$('ul', then).map(function(u){ return $$('li', u) });
    var N = 0; nowL.forEach(function(l){ if (l.length > N) N = l.length });
    if (!N) return;

    var stage = document.createElement('div');
    stage.className = 'evo-stage';
    while (evo.firstChild) stage.appendChild(evo.firstChild);

    var rail = document.createElement('div');
    rail.className = 'evo-rail';
    rail.innerHTML = '<div class="evo-lbl l-then">' + bi('Then', '以前') + '</div>'
                   + '<div class="evo-slot"></div>'
                   + '<div class="evo-lbl l-now">' + bi('Now', '现在') + '</div>'
                   + '<button type="button" class="replay evo-replay">↻ ' + bi('Replay', '重播') + '</button>';
    var slot = $('.evo-slot', rail);

    var svg = mk('svg', {'class':'evo-track', viewBox:'0 0 600 22', 'aria-hidden':'true'});
    svg.appendChild(mk('line', {'class':'evo-base', x1:X0, y1:11, x2:X1, y2:11}));
    var fill = mk('line', {'class':'evo-fill', x1:X0, y1:11, x2:X0, y2:11});
    svg.appendChild(fill);
    var ticks = [];
    for (var k = 0; k < N; k++){
      var tk = mk('circle', {'class':'evo-tick', cx:(X0 + SPAN*(k+1)/(N+1)).toFixed(1), cy:11, r:3.2});
      svg.appendChild(tk); ticks.push(tk);
    }
    var ping = mk('circle', {'class':'evo-ping', cx:X0, cy:11, r:6});
    var head = mk('circle', {'class':'evo-head', cx:X0, cy:11, r:6});
    svg.appendChild(ping); svg.appendChild(head);
    slot.appendChild(svg);

    var scrub = document.createElement('input');
    scrub.type = 'range'; scrub.min = '0'; scrub.max = '1000'; scrub.step = '1'; scrub.value = '0';
    scrub.className = 'evo-scrub';
    scrub.setAttribute('aria-label', 'Drag from then to now');
    slot.appendChild(scrub);

    evo.appendChild(rail);
    evo.appendChild(stage);

    var raf = null;
    function render(t, sync){
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      evo.style.setProperty('--t', t.toFixed(3));
      if (t < .002) evo.setAttribute('data-t', '0'); else evo.removeAttribute('data-t');
      var x = X0 + SPAN * t;
      fill.setAttribute('x2', x.toFixed(1));
      head.setAttribute('cx', x.toFixed(1));
      ping.setAttribute('cx', x.toFixed(1));
      for (var k = 0; k < N; k++){
        var on = t >= (k + 1) / (N + 1);
        ticks[k].classList.toggle('lit', on);
        nowL.forEach(function(l){ if (l[k]) l[k].classList.toggle('lit', on) });
        thenL.forEach(function(l){ if (l[k]) l[k].classList.toggle('dim', on) });
      }
      if (sync) scrub.value = Math.round(t * 1000);
    }
    function stop(){ if (raf){ cancelAnimationFrame(raf); raf = null } }
    function sweep(){
      stop();
      if (reduce){ render(1, true); return }
      render(0, true);
      var t0 = null;
      raf = requestAnimationFrame(function step(ts){
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 2000);
        render(p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3)/2, true);
        raf = p < 1 ? requestAnimationFrame(step) : null;
      });
    }

    scrub.addEventListener('input', function(){ evo._done = 1; stop(); render(scrub.value/1000, false) });
    scrub.addEventListener('focus', function(){ slot.classList.add('focus') });
    scrub.addEventListener('blur',  function(){ slot.classList.remove('focus') });
    $('.evo-replay', rail).addEventListener('click', function(){ stop(); render(0, true); setTimeout(sweep, 220) });

    evo._set  = render;
    evo._play = function(){ if (evo._done) return; evo._done = 1; sweep() };
    evo.classList.add('live');
    render(0, true);
  });

  /* the block usually sits in a lens pane that is display:none until its tab is
     picked, so an observer alone is not enough — wake on tab clicks too */
  function wake(){
    blocks.forEach(function(evo){
      if (!evo._play || evo._done || !evo.offsetWidth) return;
      var r = evo.getBoundingClientRect();
      if (r.top < innerHeight - 40 && r.bottom > 0) evo._play();
    });
  }
  if ('IntersectionObserver' in window){
    var eio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting && e.target._play) e.target._play() });
    }, {threshold:.25});
    blocks.forEach(function(b){ eio.observe(b) });
    document.addEventListener('click', function(e){
      if (e.target.closest && e.target.closest('.lens-tabs')) setTimeout(wake, 80);
    });
  } else {
    blocks.forEach(function(evo){ if (evo._set){ evo._done = 1; evo._set(1, true) } });
  }
})();
}catch(_e){console.warn("[widget skipped] THEN → NOW · a shift you scrub:", _e && _e.message)}


/* ---------------- top bar lifts off the page once you scroll ---------------- */
try{
(function(){
  var bar = $('.topbar'); if (!bar) return;
  var on = false, tick = false;
  function upd(){
    tick = false;
    var s = window.scrollY > 8;
    if (s !== on){ on = s; bar.classList.toggle('stuck', s) }
  }
  window.addEventListener('scroll', function(){
    if (!tick){ tick = true; requestAnimationFrame(upd) }
  }, {passive:true});
  upd();
})();
}catch(_e){console.warn("[widget skipped] block@2256:", _e && _e.message)}


/* ================= THEME + BACKGROUND FX ================= */
try{
(function(){
  var root = document.documentElement;
  var KEY = 'labnotebook-theme';           /* 'auto' | 'light' | 'dark' */
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;

  function stored(){
    try { return localStorage.getItem(KEY) || 'auto' } catch(e){ return 'auto' }
  }
  function apply(mode){
    if (mode === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    try { localStorage.setItem(KEY, mode) } catch(e){}
    $$('.themesw button').forEach(function(b){ b.classList.toggle('on', b.dataset.mode === mode) });
    if (window.__repaintAccents) window.__repaintAccents();
  }
  function isDark(){
    var m = stored();
    return m === 'dark' || (m === 'auto' && mq && mq.matches);
  }

  /* ---- the switch: auto / light / dark, dropped in beside the language pills ---- */
  var langsw = $('.langsw');
  if (langsw){
    var ICON = {
      auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none"/></svg>',
      light:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>',
      dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"/></svg>'
    };
    var sw = document.createElement('div');
    sw.className = 'themesw';
    sw.innerHTML = ['auto','light','dark'].map(function(m){
      var t = {auto:'Follow system 跟随系统', light:'Light 浅色', dark:'Dark 深色'}[m];
      return '<button type="button" data-mode="'+m+'" title="'+t+'" aria-label="'+t+'">'+ICON[m]+'</button>';
    }).join('');
    langsw.parentNode.insertBefore(sw, langsw.nextSibling);
    sw.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (b) apply(b.dataset.mode);
    });
  }
  apply(stored());
  if (mq && mq.addEventListener) mq.addEventListener('change', function(){ if (stored()==='auto') apply('auto') });

  /* ---- the five fixed layers ---- */
  var fx = document.createElement('div');
  fx.id = 'bgfx';
  fx.setAttribute('aria-hidden','true');
  fx.innerHTML = '<div class="fx-a1"></div><div class="fx-a2"></div><div class="fx-a3"></div>'
               + '<div class="fx-beam"></div><div class="fx-stars"></div>'
               + '<div class="fx-spot"></div><div class="fx-grain"></div>';
  document.body.appendChild(fx);

  var reduce = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  /* ---- the light follows the pointer ---- */
  if (!reduce){
    var px = 50, py = 30, queued = false;
    window.addEventListener('pointermove', function(e){
      px = (e.clientX / innerWidth) * 100;
      py = (e.clientY / innerHeight) * 100;
      if (!queued){
        queued = true;
        requestAnimationFrame(function(){
          queued = false;
          fx.style.setProperty('--mx', px.toFixed(1) + '%');
          fx.style.setProperty('--my', py.toFixed(1) + '%');
        });
      }
    }, {passive:true});
  }

  /* ---- the section you are reading drives both the hue and its own scene ---- */
  var zones = $$('section[data-scene]');
  if (zones.length){
    var PAIRS = [['--m2','--m3'], ['--m1','--m4'], ['--m5','--m1'],
                 ['--m2','--m5'], ['--m3','--m4'], ['--m4','--m1']];
    var cur = -1, pending = false;
    function pick(){
      pending = false;
      var mid = innerHeight * 0.42, best = -1, bestD = Infinity;
      zones.forEach(function(s, i){
        var r = s.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (r.top <= mid && r.bottom >= mid) d = 0;   /* the one under the line wins */
        if (d < bestD){ bestD = d; best = i }
      });
      if (best === cur) return;
      if (cur >= 0 && zones[cur]) zones[cur].classList.remove('sc-live');
      cur = best;
      if (best < 0) return;
      var sec = zones[best];
      sec.classList.add('sc-live');                   /* only this scene animates */
      var own = getComputedStyle(sec).getPropertyValue('--c').trim();
      var p = PAIRS[best % PAIRS.length];
      fx.style.setProperty('--aur1', own || 'var(--m1)');
      fx.style.setProperty('--aur2', 'var(' + p[0] + ')');
      fx.style.setProperty('--aur3', 'var(' + p[1] + ')');
    }
    /* the moving background does its job in the first viewport or two; past
       that the reader's attention is on content, and continuous compositing
       across a 56,000px scroll is real, avoidable GPU cost. Fade to a still
       frame once well past the hero, wake it back up near the top. */
    var bgAwake = true;
    function bgWake(){
      var awake = scrollY < innerHeight * 2.2;
      if (awake === bgAwake) return;
      bgAwake = awake;
      fx.classList.toggle('paused', !awake);
    }
    window.addEventListener('scroll', function(){
      if (!pending){ pending = true; requestAnimationFrame(pick) }
      bgWake();
    }, {passive:true});
    window.addEventListener('resize', function(){
      if (!pending){ pending = true; requestAnimationFrame(pick) }
    }, {passive:true});
    pick();
  }
})();
}catch(_e){console.warn("[widget skipped] THEME + BACKGROUND FX:", _e && _e.message)}

/* ---------- brand squares: authentic colours, readable label ---------- */
try{
(function(){
  function ink(el){
    var m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
    if (!m) return;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    var f = function(v){ v/=255; return v<=.03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4) };
    var L = .2126*f(p[0]) + .7152*f(p[1]) + .0722*f(p[2]);
    /* contrast against white vs against near-black, pick the winner */
    el.style.color = (1.05/(L+.05)) >= ((L+.05)/.05) ? '#fff' : '#000';
  }
  function run(){ $$('.chip2 .lg, .lg').forEach(function(el){ el.style.color=''; ink(el) }) }
  window.__inkChips = run;
  run();
  /* the atlas builds its chips lazily, so re-run when the grid changes */
  var grid = $('.chips') || $('#stack');
  if (grid && window.MutationObserver){
    new MutationObserver(function(){ run() }).observe(grid, {childList:true, subtree:true});
  }
})();
}catch(_e){console.warn("[widget skipped] block@2399:", _e && _e.message)}

/* ---------- accents baked into JS data need the dark ramp too ---------- */
try{
(function(){
  var SWAP = {
    '#4f46e5':'#818cf8', '#6366f1':'#a5b4fc', '#0d9488':'#2dd4bf', '#9333ea':'#c084fc',
    '#d97706':'#fbbf24', '#e11d48':'#fb7185', '#059669':'#34d399', '#dc2626':'#f87171',
    '#0f766e':'#5eead4', '#0369a1':'#7dd3fc', '#4338ca':'#a5b4fc', '#be123c':'#fda4af',
    '#b45309':'#fcd34d', '#047857':'#6ee7b7', '#334155':'#94a3b8'
  };
  var RE = new RegExp(Object.keys(SWAP).join('|'), 'gi');
  function dark(){
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paint(){
    var on = dark();
    $$('[style]').forEach(function(el){
      var orig = el.getAttribute('data-lightstyle');
      if (orig === null){
        var s = el.getAttribute('style') || '';
        if (!RE.test(s)) return;
        RE.lastIndex = 0;
        orig = s;
        el.setAttribute('data-lightstyle', orig);
      }
      el.setAttribute('style', on ? orig.replace(RE, function(m){ return SWAP[m.toLowerCase()] || m }) : orig);
    });
    if (window.__inkChips) window.__inkChips();   /* labels follow the swapped fills */
  }
  window.__repaintAccents = paint;
  paint();
  /* childList only: paint() writes style attributes itself, and the scrub rail
     rewrites --t every frame — observing attributes would loop and thrash */
  var queued = false;
  new MutationObserver(function(){
    if (queued) return;
    queued = true;
    requestAnimationFrame(function(){ queued = false; paint() });
  }).observe(document.body, {childList:true, subtree:true});
  if (window.matchMedia){
    var mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', paint);
  }
})();
}catch(_e){console.warn("[widget skipped] block@2445:", _e && _e.message)}

/* ================= DISCUSSION / COMMENTS ================= */
try{
(function(){
  var widgets = $$('.disc');
  if (!widgets.length) return;
  var API = 'https://comments.thedzx.site/api';
  var NAME_KEY = 'labnotebook-commenter-name';

  function esc(s){
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function initials(name){
    var w = (name || '?').trim().split(/\s+/).filter(Boolean);
    return ((w[0]||'?')[0] + (w[1] ? w[1][0] : '')).toUpperCase();
  }
  function fmtTime(iso){
    var d = new Date(iso), now = new Date();
    var diff = (now - d) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    if (diff < 86400*7) return Math.floor(diff/86400) + 'd ago';
    return d.toLocaleDateString(undefined, {month:'short', day:'numeric', year: d.getFullYear()!==now.getFullYear() ? 'numeric' : undefined});
  }

  function build(root){
    var section = root.dataset.section;
    var list = $('[data-role="list"]', root);
    var countEl = $('[data-role="count"]', root);
    var rootForm = $('[data-role="form"]', root);
    var savedName = '';
    try { savedName = localStorage.getItem(NAME_KEY) || '' } catch(e){}
    if (savedName) $('[data-role="name"]', rootForm).value = savedName;

    function renderList(items){
      list.innerHTML = '';
      if (!items.length){
        var e = document.createElement('p');
        e.className = 'disc-empty';
        e.innerHTML = bi('No comments yet — be the first.', '还没有评论 — 第一个说点什么吧。');
        list.appendChild(e);
        countEl.textContent = '0';
        return;
      }
      countEl.textContent = String(items.length);
      var byParent = {};
      items.forEach(function(c){
        var k = c.parent_id || 'root';
        (byParent[k] = byParent[k] || []).push(c);
      });
      (byParent.root || []).forEach(function(c){ renderOne(c, false, byParent) });
    }

    function renderOne(c, isReply, byParent){
      var row = document.createElement('div');
      row.className = 'disc-c' + (isReply ? ' reply' : '');
      row.innerHTML =
        '<div class="disc-av">' + esc(initials(c.name)) + '</div>' +
        '<div><div class="disc-row"><span class="disc-name">' + esc(c.name) + '</span>' +
        '<span class="disc-time">' + esc(fmtTime(c.created_at)) + '</span></div>' +
        '<p class="disc-text"></p>' +
        (isReply ? '' : '<button type="button" class="disc-reply-btn" data-role="reply">' + bi('Reply','回复') + '</button>') +
        '<div data-role="replyslot"></div></div>';
      $('.disc-text', row).textContent = c.text;   /* textContent only — never innerHTML on user text */
      list.appendChild(row);

      if (!isReply){
        var btn = $('[data-role="reply"]', row);
        var slot = $('[data-role="replyslot"]', row);
        btn.addEventListener('click', function(){
          if (slot.firstChild){ slot.innerHTML=''; return }
          slot.appendChild(makeForm(c.id));
        });
      }
      (byParent[c.id] || []).forEach(function(r){ renderOne(r, true, byParent) });
    }

    function makeForm(parentId){
      var f = rootForm.cloneNode(true);
      f.classList.add('reply');
      f.dataset.parent = parentId;
      wireForm(f);
      var nm = $('[data-role="name"]', f);
      if (savedName) nm.value = savedName;
      return f;
    }

    function load(){
      countEl.textContent = '\u00b7\u00b7\u00b7';
      fetch(API + '/comments?section=' + encodeURIComponent(section))
        .then(function(r){ if (!r.ok) throw new Error('load failed'); return r.json() })
        .then(renderList)
        .catch(function(){
          list.innerHTML = '<p class="disc-empty">' + bi('Comments are taking a nap — try again shortly.', '评论区暂时打盹 — 稍后再试。') + '</p>';
          countEl.textContent = '—';
        });
    }

    function wireForm(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var nameEl = $('[data-role="name"]', f), textEl = $('[data-role="text"]', f);
        var hpEl = $('[data-role="hp"]', f), msgEl = $('[data-role="msg"]', f);
        var btn = $('button[type="submit"]', f);
        var name = nameEl.value.trim(), text = textEl.value.trim();
        msgEl.className = 'disc-msg'; msgEl.textContent = '';
        if (!name || !text){
          msgEl.className = 'disc-msg err';
          msgEl.textContent = 'Say who you are, and say something.';
          return;
        }
        btn.disabled = true;
        fetch(API + '/comments', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            section: section, name: name, text: text, website: hpEl.value,
            parent_id: f.dataset.parent ? +f.dataset.parent : null
          })
        }).then(function(r){
          if (!r.ok) return r.json().then(function(j){ throw new Error(j.detail || 'failed') });
          return r.json();
        }).then(function(){
          try { localStorage.setItem(NAME_KEY, name) } catch(e){}
          textEl.value = '';
          if (f !== rootForm) f.remove();
          load();
        }).catch(function(err){
          msgEl.className = 'disc-msg err';
          msgEl.textContent = String(err.message || err).slice(0, 140);
        }).finally(function(){ btn.disabled = false });
      });
    }

    wireForm(rootForm);
    load();
  }

  /* build lazily: only once a discussion block is actually scrolled near */
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting){ io.unobserve(e.target); build(e.target) }
      });
    }, {rootMargin: '200px 0px'});
    widgets.forEach(function(w){ io.observe(w) });
  } else {
    widgets.forEach(build);
  }
})();
}catch(_e){console.warn("[widget skipped] DISCUSSION / COMMENTS:", _e && _e.message)}

})();
