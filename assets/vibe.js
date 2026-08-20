/* ============================================================================
   VIBE ENGINE — per-chapter background scene + generative music.
   No libraries, no audio files, no network. Canvas 2D + Web Audio only.
   Everything is capped, paused when hidden, and off under reduced-motion.
   ========================================================================= */
(function(){
"use strict";
var $  = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var body = document.body;
/* core.js keeps its own bi() inside its IIFE, so vibe.js needs its own */
var bi = function(en,zh){return '<span class="en">'+en+'</span><span class="zh">'+zh+'</span>'};
var VIBE = body.getAttribute('data-vibe') || 'modern';
var CHAP = body.getAttribute('data-chapter') || 'index';
var reduce = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)').matches : false;

/* ---------------------------------------------- language across pages ---- */
var LANG_KEY = 'labnotebook-lang';
(function(){
  var saved = 'en';
  try { saved = localStorage.getItem(LANG_KEY) || 'en' } catch(e){}
  if (saved === 'zh') body.className = body.className.replace(/lang-\w+/, 'lang-zh');
  $$('.langsw button').forEach(function(b){
    b.classList.toggle('on', b.dataset.lang === saved);
    b.addEventListener('click', function(){
      try { localStorage.setItem(LANG_KEY, b.dataset.lang) } catch(e){}
    });
  });
})();

/* ------------------------------------------------------- chapter rail ---- */
var CHAPTERS = ['index','map','words','terminal','m1','m2','m3','m4','m5','systems','zero','finish'];
(function(){
  var bar = $('.topbar'); if (!bar) return;
  var here = CHAPTERS.indexOf(CHAP);
  var rail = document.createElement('div');
  rail.className = 'chaprail';
  rail.innerHTML = CHAPTERS.map(function(_, i){
    return '<i class="' + (i < here ? 'done' : i === here ? 'here' : '') + '"></i>';
  }).join('');
  var pbar = $('.pbar', bar);
  (pbar ? pbar.parentNode : bar).insertBefore(rail, pbar || null);
})();


/* ------------------------------------------------------- chapter drawer --- */
var CHAPTER_META = [
  ['index','Start here','从这里开始','minimalist'], ['map','The whole map','整张地图','futuristic'],
  ['words','The words','那些词','chill'],          ['terminal','The terminal','终端','pixel'],
  ['m1','IT Basics','IT 基础','modern'],           ['m2','Developer Tools','开发工具','gamify'],
  ['m3','AI Fundamentals','AI 基础','ai'],          ['m4','Data Engineering','数据工程','natural'],
  ['m5','CS & Cloud','计算机原理与云','futuristic'], ['systems','How the big ones work','大家伙怎么运转','gamify'],
  ['zero','It all starts from 0 and 1','一切从 0 和 1 开始','pixel'],
  ['finish','Month 12 and after','第 12 个月之后','chill']
];
(function(){
  var btn = $('.menubtn'); if (!btn) return;
  var here = CHAPTERS.indexOf(CHAP);
  var drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.setAttribute('role','dialog');
  drawer.setAttribute('aria-label','Chapters');
  drawer.innerHTML =
    '<div class="drawer-panel">' +
      '<div class="drawer-head">' +
        '<b>' + bi('Chapters','章节') + '</b>' +
        '<button type="button" class="drawer-x" aria-label="Close">&times;</button>' +
      '</div>' +
      '<nav class="drawer-list">' +
      CHAPTER_META.map(function(c, i){
        var file = (c[0] === 'index' ? 'index.html' : c[0] + '.html');
        var state = i < here ? ' done' : (i === here ? ' here' : '');
        return '<a class="drawer-i' + state + '" href="' + file + '" data-vibe-chip="' + c[3] + '">' +
               '<span class="drawer-n">' + (i === 0 ? '·' : (i < 10 ? '0' + i : i)) + '</span>' +
               '<span class="drawer-t">' + bi(c[1], c[2]) + '</span>' +
               '<span class="drawer-v">' + c[3] + '</span></a>';
      }).join('') +
      '</nav>' +
    '</div><div class="drawer-back"></div>';
  document.body.appendChild(drawer);

  var lastFocus = null;
  function open(){
    lastFocus = document.activeElement;
    drawer.classList.add('on');
    btn.setAttribute('aria-expanded','true');
    document.documentElement.style.overflow = 'hidden';
    var first = drawer.querySelector('.drawer-i');
    if (first) first.focus();
  }
  function close(){
    drawer.classList.remove('on');
    btn.setAttribute('aria-expanded','false');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  btn.addEventListener('click', function(){
    drawer.classList.contains('on') ? close() : open();
  });
  $('.drawer-x', drawer).addEventListener('click', close);
  $('.drawer-back', drawer).addEventListener('click', close);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && drawer.classList.contains('on')) close();
  });
})();

/* --------------------------------------------- motion + sound controls --- */
var MOTION_KEY = 'labnotebook-motion', SOUND_KEY = 'labnotebook-sound';
var motionOn = true, soundOn = false;
try { motionOn = localStorage.getItem(MOTION_KEY) !== 'off' } catch(e){}
if (reduce) motionOn = false;

var ICON = {
  motion:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h3l2-6 4 12 3-8 2 2h4"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 8.5a5 5 0 0 1 0 7"/></svg>'
};
(function(){
  var host = $('.themesw') || $('.langsw'); if (!host) return;
  var bar = document.createElement('div');
  bar.className = 'vibebar';
  bar.innerHTML =
    '<button type="button" data-k="motion" title="Background motion / 背景动效">'+ICON.motion+'</button>' +
    '<button type="button" data-k="sound"  title="Ambient sound / 环境音">'+ICON.sound+'</button>';
  host.parentNode.insertBefore(bar, host.nextSibling);
  var mB = bar.querySelector('[data-k="motion"]'), sB = bar.querySelector('[data-k="sound"]');
  mB.classList.toggle('on', motionOn);
  mB.addEventListener('click', function(){
    motionOn = !motionOn;
    mB.classList.toggle('on', motionOn);
    try { localStorage.setItem(MOTION_KEY, motionOn ? 'on' : 'off') } catch(e){}
    if (motionOn) startScene(); else stopScene();
  });
  sB.addEventListener('click', function(){
    soundOn = !soundOn;
    sB.classList.toggle('on', soundOn);
    try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off') } catch(e){}
    if (soundOn) Audio_.start(); else Audio_.stop();
  });
})();

/* ============================== THE SCENES ============================== */
var cv, ctx, W = 0, H = 0, DPR = 1, raf = null, t0 = 0, scene = null;

function css(v, fallback){
  var s = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  return s || fallback;
}
function sizeCanvas(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR);
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (scene && scene.resize) scene.resize();
}
/* small 3D helper — rotate + perspective-project, no library needed */
function proj(p, ax, ay, cx, cy, s, dist){
  var cy_ = Math.cos(ay), sy = Math.sin(ay);
  var x = p[0]*cy_ - p[2]*sy, z = p[0]*sy + p[2]*cy_;
  var cx_ = Math.cos(ax), sx = Math.sin(ax);
  var y = p[1]*cx_ - z*sx; z = p[1]*sx + z*cx_;
  var f = dist / (dist + z);
  return [cx + x*f*s, cy + y*f*s, f];
}
var CUBE_V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
var CUBE_E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
var OCTA_V = [[0,-1.3,0],[1.3,0,0],[0,0,1.3],[-1.3,0,0],[0,0,-1.3],[0,1.3,0]];
var OCTA_E = [[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]];

function rnd(a,b){ return a + Math.random()*(b-a) }
function area(){ return (W*H)/(1280*800) }

var SCENES = {
  /* ---- sparse drifting rules, almost nothing ---- */
  minimalist: function(){
    var lines = [];
    return {
      resize: function(){
        lines = [];
        var n = Math.round(7 * Math.min(area(),1.6));
        for (var i=0;i<n;i++) lines.push({y: rnd(0,H), w: rnd(60,240), x: rnd(0,W), v: rnd(2,9)});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        ctx.strokeStyle = css('--vibe-a','#9aa'); ctx.globalAlpha = .17; ctx.lineWidth = 1;
        lines.forEach(function(l){
          l.x += l.v * .12; if (l.x > W + l.w) l.x = -l.w;
          ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.x + l.w, l.y); ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- perspective grid + scan sweep + rotating wireframe ---- */
  futuristic: function(){
    var ang = 0;
    return {
      resize: function(){},
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#22d3ee'), b = css('--vibe-b','#a78bfa');
        var hz = H*0.62;
        ctx.strokeStyle = a; ctx.lineWidth = 1;
        /* receding floor */
        ctx.globalAlpha = .16;
        for (var i=1;i<=16;i++){
          var p = i/16, y = hz + Math.pow(p,2.1)*(H-hz)*1.5;
          if (y > H) break;
          ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
        }
        var off = (t*0.00004) % 1;
        for (var k=-14;k<=14;k++){
          var xs = W/2 + (k+off)*(W/13);
          ctx.beginPath(); ctx.moveTo(W/2 + (k+off)*22, hz); ctx.lineTo(xs, H); ctx.stroke();
        }
        /* scan sweep */
        var sy = (t*0.06) % (H+200) - 100;
        var g = ctx.createLinearGradient(0, sy-70, 0, sy+70);
        g.addColorStop(0,'transparent'); g.addColorStop(.5, a); g.addColorStop(1,'transparent');
        ctx.globalAlpha = .13; ctx.fillStyle = g; ctx.fillRect(0, sy-70, W, 140);
        /* the 3D object */
        ang += 0.0035;
        var s = Math.min(W,H)*0.13, cx = W*0.79, cy = H*0.3;
        ctx.globalAlpha = .5; ctx.strokeStyle = b; ctx.lineWidth = 1.3;
        ctx.beginPath();
        CUBE_E.forEach(function(e){
          var p1 = proj(CUBE_V[e[0]], ang*0.7, ang, cx, cy, s, 5);
          var p2 = proj(CUBE_V[e[1]], ang*0.7, ang, cx, cy, s, 5);
          ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]);
        });
        ctx.stroke(); ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- neural net: nodes, links, travelling pulses ---- */
  ai: function(){
    var N = [], links = [];
    return {
      resize: function(){
        N = []; links = [];
        var n = Math.round(34 * Math.min(area(),1.7));
        for (var i=0;i<n;i++) N.push({x:rnd(0,W), y:rnd(0,H), vx:rnd(-.16,.16), vy:rnd(-.16,.16), r:rnd(1.2,2.8), ph:rnd(0,6.3)});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#a855f7'), b = css('--vibe-b','#ec4899');
        N.forEach(function(p){
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = W+20; if (p.x > W+20) p.x = -20;
          if (p.y < -20) p.y = H+20; if (p.y > H+20) p.y = -20;
        });
        ctx.lineWidth = 1;
        for (var i=0;i<N.length;i++){
          for (var j=i+1;j<N.length;j++){
            var dx = N[i].x-N[j].x, dy = N[i].y-N[j].y, d2 = dx*dx+dy*dy;
            if (d2 < 26000){
              var al = (1 - d2/26000) * .30;
              ctx.globalAlpha = al; ctx.strokeStyle = a;
              ctx.beginPath(); ctx.moveTo(N[i].x,N[i].y); ctx.lineTo(N[j].x,N[j].y); ctx.stroke();
            }
          }
        }
        N.forEach(function(p){
          var pulse = .55 + .45*Math.sin(t*0.0015 + p.ph);
          ctx.globalAlpha = .5*pulse; ctx.fillStyle = b;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(1+pulse*.5),0,6.2832); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- chunky falling blocks on a coarse grid ---- */
  pixel: function(){
    var G = 14, cols = 0, drops = [];
    return {
      resize: function(){
        cols = Math.ceil(W/G); drops = [];
        var n = Math.round(cols*0.30);
        for (var i=0;i<n;i++) drops.push({c: Math.floor(rnd(0,cols)), y: rnd(-H,H), v: rnd(.5,2.2), len: Math.floor(rnd(2,7))});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#22c55e'), b = css('--vibe-b','#eab308');
        drops.forEach(function(d,i){
          d.y += d.v;
          if (d.y > H + d.len*G){ d.y = -d.len*G; d.c = Math.floor(rnd(0,cols)); d.v = rnd(.5,2.2) }
          for (var k=0;k<d.len;k++){
            ctx.globalAlpha = .30 * (1 - k/d.len);
            ctx.fillStyle = (i % 4 === 0) ? b : a;
            ctx.fillRect(d.c*G, Math.floor((d.y - k*G)/G)*G, G-2, G-2);
          }
        });
        ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- bobbing collectibles drifting upward ---- */
  gamify: function(){
    var P = [];
    function shape(g, x, y, r, kind){
      ctx.beginPath();
      if (kind === 0){ ctx.arc(x,y,r,0,6.2832) }
      else if (kind === 1){
        for (var i=0;i<5;i++){
          var an = -Math.PI/2 + i*2*Math.PI/5;
          var an2 = an + Math.PI/5;
          ctx[i?'lineTo':'moveTo'](x+Math.cos(an)*r, y+Math.sin(an)*r);
          ctx.lineTo(x+Math.cos(an2)*r*.45, y+Math.sin(an2)*r*.45);
        }
        ctx.closePath();
      } else { ctx.roundRect ? ctx.roundRect(x-r,y-r,r*2,r*2,r*.4) : ctx.rect(x-r,y-r,r*2,r*2) }
    }
    return {
      resize: function(){
        P = [];
        var n = Math.round(20 * Math.min(area(),1.6));
        for (var i=0;i<n;i++) P.push({x:rnd(0,W), y:rnd(0,H), r:rnd(6,17), v:rnd(.18,.55), ph:rnd(0,6.3), k:Math.floor(rnd(0,3))});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#f59e0b'), b = css('--vibe-b','#10b981');
        P.forEach(function(p,i){
          p.y -= p.v; if (p.y < -30){ p.y = H+30; p.x = rnd(0,W) }
          var wob = Math.sin(t*0.0018 + p.ph)*14;
          ctx.globalAlpha = .30; ctx.fillStyle = (i%3===0)?b:a;
          shape(ctx, p.x+wob, p.y, p.r, p.k); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- big soft bokeh, very slow ---- */
  chill: function(){
    var B = [];
    return {
      resize: function(){
        B = [];
        var n = Math.round(11 * Math.min(area(),1.5));
        for (var i=0;i<n;i++) B.push({x:rnd(0,W), y:rnd(0,H), r:rnd(60,210), vx:rnd(-.10,.10), vy:rnd(-.07,.07), ph:rnd(0,6.3)});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#f0a68a'), b = css('--vibe-b','#7fb3a3');
        B.forEach(function(p,i){
          p.x += p.vx; p.y += p.vy;
          if (p.x < -p.r) p.x = W+p.r; if (p.x > W+p.r) p.x = -p.r;
          if (p.y < -p.r) p.y = H+p.r; if (p.y > H+p.r) p.y = -p.r;
          var br = p.r * (1 + .10*Math.sin(t*0.0006 + p.ph));
          var g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,br);
          g.addColorStop(0, (i%2?b:a)); g.addColorStop(1,'transparent');
          ctx.globalAlpha = .16; ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x,p.y,br,0,6.2832); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- drifting leaves ---- */
  natural: function(){
    var L = [];
    return {
      resize: function(){
        L = [];
        var n = Math.round(17 * Math.min(area(),1.6));
        for (var i=0;i<n;i++) L.push({x:rnd(0,W), y:rnd(-H,H), r:rnd(6,15), v:rnd(.25,.75), sp:rnd(.4,1.5), ph:rnd(0,6.3), rot:rnd(0,6.3)});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#6f9c5a'), b = css('--vibe-b','#b08d57');
        L.forEach(function(p,i){
          p.y += p.v; p.rot += 0.006*p.sp;
          var sway = Math.sin(t*0.0012*p.sp + p.ph) * 34;
          if (p.y > H+30){ p.y = -30; p.x = rnd(0,W) }
          ctx.save();
          ctx.translate(p.x + sway, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = .26; ctx.fillStyle = (i%3===0)?b:a;
          ctx.beginPath();
          ctx.moveTo(0,-p.r);
          ctx.quadraticCurveTo(p.r*.9, 0, 0, p.r);
          ctx.quadraticCurveTo(-p.r*.9, 0, 0, -p.r);
          ctx.fill();
          ctx.restore();
        });
        ctx.globalAlpha = 1;
      }
    };
  },
  /* ---- restrained: floating parallax cards + one slow wireframe ---- */
  modern: function(){
    var C = [], ang = 0;
    return {
      resize: function(){
        C = [];
        var n = Math.round(9 * Math.min(area(),1.5));
        for (var i=0;i<n;i++) C.push({x:rnd(0,W), y:rnd(0,H), w:rnd(60,170), h:rnd(40,110), v:rnd(.06,.22), ph:rnd(0,6.3)});
      },
      draw: function(t){
        ctx.clearRect(0,0,W,H);
        var a = css('--vibe-a','#4f46e5'), b = css('--vibe-b','#0d9488');
        ctx.lineWidth = 1;
        C.forEach(function(p,i){
          p.y -= p.v; if (p.y < -p.h-20){ p.y = H+p.h; p.x = rnd(0,W) }
          var wob = Math.sin(t*0.0007 + p.ph)*10;
          ctx.globalAlpha = .13; ctx.strokeStyle = (i%2?b:a);
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(p.x+wob, p.y, p.w, p.h, 12);
          else ctx.rect(p.x+wob, p.y, p.w, p.h);
          ctx.stroke();
        });
        ang += 0.0022;
        var s = Math.min(W,H)*0.10, cx = W*0.84, cy = H*0.74;
        ctx.globalAlpha = .30; ctx.strokeStyle = a; ctx.lineWidth = 1.2;
        ctx.beginPath();
        OCTA_E.forEach(function(e){
          var p1 = proj(OCTA_V[e[0]], ang*0.6, ang, cx, cy, s, 5);
          var p2 = proj(OCTA_V[e[1]], ang*0.6, ang, cx, cy, s, 5);
          ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]);
        });
        ctx.stroke(); ctx.globalAlpha = 1;
      }
    };
  }
};

function startScene(){
  if (!motionOn || reduce) return;
  if (!cv){
    cv = document.createElement('canvas');
    cv.id = 'vibefx'; cv.setAttribute('aria-hidden','true');
    document.body.appendChild(cv);
    ctx = cv.getContext('2d');
    addEventListener('resize', debounce(sizeCanvas, 180), {passive:true});
  }
  cv.style.display = 'block';
  if (!scene){ scene = (SCENES[VIBE] || SCENES.modern)(); }
  sizeCanvas();
  if (raf) return;
  t0 = performance.now();
  (function loop(now){
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    scene.draw(now - t0);
  })(t0);
}
function stopScene(){
  if (raf){ cancelAnimationFrame(raf); raf = null }
  if (cv){ ctx && ctx.clearRect(0,0,W,H); cv.style.display = 'none' }
}
function debounce(fn, ms){ var id; return function(){ clearTimeout(id); id = setTimeout(fn, ms) } }
document.addEventListener('visibilitychange', function(){
  if (document.hidden) { if (raf){ cancelAnimationFrame(raf); raf = null } }
  else if (motionOn && !reduce && !raf) startScene();
});

/* ============================ THE MUSIC =================================
   Generated, not sampled. The first version picked random notes from a scale
   at random moments over a static drone — which is, almost exactly, how you
   score a horror film. This one has chords, a pulse, and notes that resolve.

   Per vibe: a root, a tempo, and a chord progression (semitones from root).
   Every voice draws only from the chord that is currently sounding, so it
   cannot land on a dissonance by accident. The lead walks to the nearest
   chord tone instead of leaping, which is what makes a line sound intentional.
   ===================================================================== */
var MUSIC = {
  /* I – iii – IV – I : calm, unhurried, always resolving home */
  minimalist:{root:220, bpm:52, hold:2, cut:1500,
    prog:[[0,4,7],[4,7,11],[5,9,12],[0,4,7]],
    lead:{wave:'sine',     gain:.20, dec:2.6, density:.30},
    pad :{wave:'sine',     gain:.055}, bass:{gain:.10}},

  /* i – VI – III – VII : the synthwave cadence. Moody, not menacing. */
  futuristic:{root:110, bpm:96, hold:1, cut:1250,
    prog:[[0,3,7],[8,12,15],[3,7,10],[10,14,17]],
    lead:{wave:'sawtooth', gain:.14, dec:.7, density:.55, arp:true},
    pad :{wave:'sawtooth', gain:.045}, bass:{gain:.13}},

  /* I – II – vi – IV : lydian colour from the II, but always resolved */
  ai:{root:174, bpm:72, hold:2, cut:1900,
    prog:[[0,4,7,11],[2,6,9],[9,12,16],[5,9,12]],
    lead:{wave:'triangle', gain:.15, dec:1.7, density:.42},
    pad :{wave:'triangle', gain:.055}, bass:{gain:.09}},

  /* I – V – vi – IV, arpeggiated in 16ths: actual chiptune, not bleeping */
  pixel:{root:262, bpm:126, hold:1, cut:2800,
    prog:[[0,4,7],[7,11,14],[9,12,16],[5,9,12]],
    lead:{wave:'square',   gain:.125, dec:.16, density:1, arp:true},
    pad :{wave:null,       gain:0},   bass:{gain:.14, wave:'square'}},

  /* I – IV – V – I : bright and obvious, like a menu screen */
  gamify:{root:330, bpm:112, hold:1, cut:2500,
    prog:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]],
    lead:{wave:'triangle', gain:.14, dec:.42, density:.62},
    pad :{wave:'triangle', gain:.035}, bass:{gain:.10}},

  /* Imaj7 – vi7 – IVmaj7 – V : the warm one */
  chill:{root:196, bpm:60, hold:2, cut:1250,
    prog:[[0,4,7,11],[9,12,16,19],[5,9,12,16],[7,11,14]],
    lead:{wave:'sine',     gain:.18, dec:2.4, density:.34},
    pad :{wave:'sine',     gain:.07}, bass:{gain:.10}},

  /* I – V – vi – IV, very slow: folk-open, nothing clever */
  natural:{root:147, bpm:54, hold:2, cut:1000,
    prog:[[0,4,7],[7,11,14],[9,12,16],[5,9,12]],
    lead:{wave:'sine',     gain:.19, dec:2.8, density:.28},
    pad :{wave:'sine',     gain:.065}, bass:{gain:.10}},

  /* i – VII – VI – VII : neutral, slightly serious, still consonant */
  modern:{root:233, bpm:76, hold:2, cut:1600,
    prog:[[0,3,7],[10,14,17],[8,12,15],[10,14,17]],
    lead:{wave:'triangle', gain:.16, dec:1.5, density:.40},
    pad :{wave:'triangle', gain:.05}, bass:{gain:.10}}
};

var Audio_ = (function(){
  var cfg = MUSIC[VIBE] || MUSIC.modern;
  var actx=null, master=null, delay=null, padGain=null;
  var timer=null, step=0, nextT=0, padVoices=[], lastPitch=null;

  function hz(semi){ return cfg.root * Math.pow(2, semi/12) }

  function ensure(){
    if (actx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    actx = new AC();
    master = actx.createGain(); master.gain.value = 0;
    var comp = actx.createDynamicsCompressor();
    comp.threshold.value=-10; comp.knee.value=6; comp.ratio.value=12;
    comp.attack.value=.003; comp.release.value=.25;
    delay = actx.createDelay(1.2); delay.delayTime.value = 60/cfg.bpm * 0.75;
    var fb = actx.createGain(); fb.gain.value=.26;
    var wet= actx.createGain(); wet.gain.value=.28;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    padGain = actx.createGain(); padGain.gain.value = 1; padGain.connect(master);
    master.connect(comp); comp.connect(actx.destination);
    return true;
  }

  /* one plucked/bowed voice with a real envelope, not a raw tone */
  function voice(freq, at, dur, gain, wave, toDelay){
    var o=actx.createOscillator(), g=actx.createGain(), f=actx.createBiquadFilter();
    o.type = wave || 'sine'; o.frequency.value = freq;
    f.type='lowpass'; f.frequency.setValueAtTime(cfg.cut, at);
    f.frequency.exponentialRampToValueAtTime(Math.max(240, cfg.cut*0.5), at+dur);
    var atk = Math.min(.06, dur*0.25);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at+atk);
    g.gain.exponentialRampToValueAtTime(0.0001, at+dur);
    o.connect(f); f.connect(g); g.connect(master);
    if (toDelay) g.connect(delay);
    o.start(at); o.stop(at+dur+.05);
  }

  /* the pad moves with the chord instead of droning on one note forever */
  function setPad(chord, at){
    padVoices.forEach(function(v){
      v.g.gain.cancelScheduledValues(at);
      v.g.gain.setValueAtTime(v.g.gain.value, at);
      v.g.gain.exponentialRampToValueAtTime(0.0001, at+1.6);
      try { v.o.stop(at+1.8) } catch(e){}
    });
    padVoices = [];
    if (!cfg.pad.wave || cfg.pad.gain <= 0) return;
    chord.forEach(function(semi, i){
      var o=actx.createOscillator(), g=actx.createGain(), f=actx.createBiquadFilter();
      o.type = cfg.pad.wave;
      o.frequency.value = hz(semi - 12);
      o.detune.value = (i%2 ? 5 : -5);
      f.type='lowpass'; f.frequency.value = cfg.cut*0.55;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(cfg.pad.gain, at+1.4);
      o.connect(f); f.connect(g); g.connect(padGain);
      o.start(at);
      padVoices.push({o:o, g:g});
    });
  }

  /* pick the chord tone closest to where the line already is */
  function nearestTone(chord){
    var opts=[];
    chord.forEach(function(semi){ [-12,0,12].forEach(function(oct){ opts.push(semi+oct) }) });
    if (lastPitch === null) return chord[0];
    var best=opts[0], bd=1e9;
    opts.forEach(function(p){
      var d = Math.abs(p-lastPitch) + Math.random()*3;   /* a little wander, no leaps */
      if (d < bd && !(p === lastPitch && Math.random() < .7)){ bd=d; best=p }
    });
    return best;
  }

  /* lookahead scheduler — setTimeout alone drifts and sounds sloppy */
  function tick(){
    if (!actx) return;
    var beat = 60/cfg.bpm, sixteenth = beat/4;
    var barsPerChord = cfg.hold, stepsPerBar = 16;
    while (nextT < actx.currentTime + 0.12){
      var bar = Math.floor(step/stepsPerBar);
      var chordIx = Math.floor(bar/barsPerChord) % cfg.prog.length;
      var chord = cfg.prog[chordIx];
      var inBar = step % stepsPerBar;

      if (inBar === 0 && bar % barsPerChord === 0){
        setPad(chord, nextT);
        if (cfg.bass.gain > 0)
          voice(hz(chord[0]-24), nextT, beat*2.2, cfg.bass.gain, cfg.bass.wave || 'sine', false);
      }
      if (cfg.lead.arp){
        /* steady 16ths cycling the chord — the chiptune/synthwave engine */
        var t = chord[(step) % chord.length] + (Math.floor(step/chord.length)%2 ? 12 : 0);
        if (inBar % (cfg.lead.density >= 1 ? 1 : 2) === 0)
          voice(hz(t), nextT, Math.max(sixteenth*0.9, cfg.lead.dec), cfg.lead.gain, cfg.lead.wave, true);
      } else if (inBar % 2 === 0 && Math.random() < cfg.lead.density){
        var p = nearestTone(chord); lastPitch = p;
        voice(hz(p), nextT, cfg.lead.dec, cfg.lead.gain, cfg.lead.wave, true);
      }
      nextT += sixteenth; step++;
    }
    timer = setTimeout(tick, 25);
  }

  return {
    start: function(){
      if (!ensure()) return;
      if (actx.state === 'suspended') actx.resume();
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.linearRampToValueAtTime(0.55, actx.currentTime + 1.2);
      if (!timer){ step=0; lastPitch=null; nextT = actx.currentTime + 0.1; tick() }
    },
    stop: function(){
      if (!actx) return;
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.linearRampToValueAtTime(0, actx.currentTime + 0.7);
      clearTimeout(timer); timer=null;
      setTimeout(function(){
        padVoices.forEach(function(v){ try{ v.o.stop() }catch(e){} });
        padVoices=[];
      }, 800);
    }
  };
})();

/* sound never auto-starts: browsers block it and it would be rude anyway */
if (motionOn && !reduce) startScene();

/* ============================ REACTIONS ================================= */
/* Optimistic: your tap lands instantly and is remembered locally, then syncs.
   If the API is unreachable the UI still works — it just does not add to the
   shared count until the next successful call. */
(function(){
  var bars = $$('.reactbar');
  if (!bars.length) return;
  var API = 'https://comments.thedzx.site/api';
  var MINE = 'labnotebook-reactions';
  var mine = {};
  try { mine = JSON.parse(localStorage.getItem(MINE) || '{}') } catch(e){ mine = {} }
  function saveMine(){ try { localStorage.setItem(MINE, JSON.stringify(mine)) } catch(e){} }

  var counts = {};                       /* server truth, per key */
  function paint(){
    bars.forEach(function(bar){
      var key = bar.dataset.reactKey;
      $$('.rx', bar).forEach(function(btn){
        var em = btn.dataset.emoji;
        var server = (counts[key] && counts[key][em]) || 0;
        var isMine = !!(mine[key] && mine[key][em]);
        /* if the server has not caught up yet, still show your own tap */
        var shown = server;
        if (isMine && server === 0) shown = 1;
        btn.classList.toggle('on', isMine);
        $('.rx-c', btn).textContent = shown;
      });
    });
  }

  function load(){
    fetch(API + '/reactions?chapter=' + encodeURIComponent(CHAP))
      .then(function(r){ if (!r.ok) throw 0; return r.json() })
      .then(function(j){ counts = j || {}; paint() })
      .catch(function(){ paint() });      /* offline: local state still renders */
  }

  bars.forEach(function(bar){
    bar.addEventListener('click', function(e){
      var btn = e.target.closest('.rx'); if (!btn) return;
      var key = bar.dataset.reactKey, em = btn.dataset.emoji;
      mine[key] = mine[key] || {};
      var had = !!mine[key][em];
      if (had) delete mine[key][em]; else mine[key][em] = 1;
      saveMine();
      /* move the local number straight away, do not wait on the network */
      counts[key] = counts[key] || {};
      counts[key][em] = Math.max(0, (counts[key][em] || 0) + (had ? -1 : 1));
      paint();
      if (!had){
        var g = $('.rx-g', btn);
        g.classList.remove('rx-pop'); void g.offsetWidth; g.classList.add('rx-pop');
      }
      fetch(API + '/reactions', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({key:key, emoji:em, delta: had ? -1 : 1})
      }).then(function(r){ return r.ok ? r.json() : null })
        .then(function(j){ if (j){ counts[j.key] = counts[j.key] || {}; counts[j.key][j.emoji] = j.count; paint(); } })
        .catch(function(){});
    });
  });

  paint();
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      if (es.some(function(e){ return e.isIntersecting })){ io.disconnect(); load(); }
    }, {rootMargin:'300px 0px'});
    bars.forEach(function(b){ io.observe(b) });
  } else load();
})();

})();
