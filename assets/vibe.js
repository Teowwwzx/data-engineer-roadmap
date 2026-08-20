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

/* ============================ THE MUSIC ================================= */
/* generative, not a file: a slow pad + sparse plucked notes from a scale */
var MUSIC = {
  minimalist:{root:220, scale:[0,3,5,7,10],   wave:'sine',     step:2400, pad:.14, note:.17, cut:1400, dec:2.6},
  futuristic:{root:110, scale:[0,2,3,7,8,10], wave:'sawtooth', step:520,  pad:.11, note:.13, cut:900,  dec:.9},
  ai:        {root:174, scale:[0,2,4,6,7,11], wave:'triangle', step:900,  pad:.12, note:.14, cut:1800, dec:1.8},
  pixel:     {root:262, scale:[0,2,4,7,9],    wave:'square',   step:300,  pad:0,   note:.20, cut:2600, dec:.22},
  gamify:    {root:330, scale:[0,4,7,9,12],   wave:'triangle', step:420,  pad:.08, note:.17, cut:2400, dec:.5},
  chill:     {root:196, scale:[0,4,7,11,14],  wave:'sine',     step:1800, pad:.17, note:.15, cut:1100, dec:2.8},
  natural:   {root:147, scale:[0,2,5,7,9],    wave:'sine',     step:2100, pad:.15, note:.15, cut:800,  dec:3.2},
  modern:    {root:233, scale:[0,3,5,7,10],   wave:'triangle', step:1300, pad:.11, note:.13, cut:1500, dec:1.6}
};
var Audio_ = (function(){
  var actx = null, master = null, padOsc = [], timer = null, cfg = MUSIC[VIBE] || MUSIC.modern, delay = null;
  function ensure(){
    if (actx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    actx = new AC();
    master = actx.createGain(); master.gain.value = 0;
    /* safety limiter: notes overlap and the delay tail stacks, so cap the sum
       rather than trusting the arithmetic to stay under 1.0 */
    var comp = actx.createDynamicsCompressor();
    comp.threshold.value = -10; comp.knee.value = 6;
    comp.ratio.value = 12; comp.attack.value = .003; comp.release.value = .25;
    /* a touch of space, cheap: one delay line fed back gently */
    delay = actx.createDelay(1.2); delay.delayTime.value = .38;
    var fb = actx.createGain(); fb.gain.value = .28;
    var wet = actx.createGain(); wet.gain.value = .3;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    master.connect(comp); comp.connect(actx.destination);
    return true;
  }
  function note(freq, dur, gain, wave){
    var o = actx.createOscillator(), g = actx.createGain(), f = actx.createBiquadFilter();
    o.type = wave || cfg.wave; o.frequency.value = freq;
    f.type = 'lowpass'; f.frequency.value = cfg.cut;
    g.gain.setValueAtTime(0, actx.currentTime);
    g.gain.linearRampToValueAtTime(gain, actx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(f); f.connect(g); g.connect(master); g.connect(delay);
    o.start(); o.stop(actx.currentTime + dur + .05);
  }
  function tick(){
    if (!actx) return;
    if (Math.random() < 0.75){
      var s = cfg.scale[Math.floor(Math.random()*cfg.scale.length)];
      var oct = [0,0,12,-12][Math.floor(Math.random()*4)];
      note(cfg.root * Math.pow(2,(s+oct)/12), cfg.dec, cfg.note);
    }
    timer = setTimeout(tick, cfg.step * (0.75 + Math.random()*0.5));
  }
  return {
    start: function(){
      if (!ensure()) return;
      if (actx.state === 'suspended') actx.resume();
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.linearRampToValueAtTime(0.55, actx.currentTime + 1.2);
      if (cfg.pad > 0 && !padOsc.length){
        [0, 7].forEach(function(iv, i){
          var o = actx.createOscillator(), g = actx.createGain(), f = actx.createBiquadFilter();
          o.type = 'sine'; o.frequency.value = cfg.root * Math.pow(2, iv/12) / 2;
          o.detune.value = i ? 6 : -6;
          f.type = 'lowpass'; f.frequency.value = cfg.cut * .6;
          g.gain.value = cfg.pad;
          o.connect(f); f.connect(g); g.connect(master);
          o.start(); padOsc.push({o:o,g:g});
        });
      }
      if (!timer) tick();
    },
    stop: function(){
      if (!actx) return;
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.linearRampToValueAtTime(0, actx.currentTime + 0.6);
      clearTimeout(timer); timer = null;
      setTimeout(function(){
        padOsc.forEach(function(p){ try{ p.o.stop() }catch(e){} });
        padOsc = [];
      }, 700);
    }
  };
})();

/* sound never auto-starts: browsers block it and it would be rude anyway */
if (motionOn && !reduce) startScene();
})();
