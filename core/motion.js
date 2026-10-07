/* core/motion.js — one small motion engine, injected into every exported
   portfolio AND into the builder's live preview.

   Vanilla, dependency-free, and every effect bails out immediately when the
   visitor has `prefers-reduced-motion` set. Nothing here is required for the
   page to be readable — if JS never runs, the content is still fully visible. */

export const MOTION_CSS = `
/* ---------- reveal on scroll ---------- */
[data-reveal]{opacity:0;transform:translate3d(0,18px,0);transition:opacity .72s cubic-bezier(.22,1,.36,1),transform .72s cubic-bezier(.22,1,.36,1)}
[data-reveal].is-in{opacity:1;transform:none}

/* ---------- masked line reveal for big headings ---------- */
.reveal-line{display:block;overflow:hidden}
.reveal-line>span{display:block;transform:translate3d(0,112%,0);transition:transform .95s cubic-bezier(.16,1,.3,1)}
.reveal-line.is-in>span{transform:none}

/* ---------- 3D pointer tilt ---------- */
[data-tilt]{transform-style:preserve-3d;transition:transform .5s cubic-bezier(.22,1,.36,1);will-change:transform}
[data-tilt].is-tilting{transition:transform .08s linear}
[data-depth]{transform:translateZ(var(--z,34px));transform-style:preserve-3d}

/* ---------- cursor spotlight on cards ---------- */
[data-spotlight]::after{
  content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:radial-gradient(340px circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.09),transparent 62%);
  opacity:0;transition:opacity .35s ease;z-index:2
}
[data-spotlight]:hover::after{opacity:1}

/* ---------- Ken Burns breathing on hero images ---------- */
@keyframes kb{0%{transform:scale(1) translate3d(0,0,0)}100%{transform:scale(1.09) translate3d(-1.2%,-1.6%,0)}}
[data-kenburns] img{animation:kb 22s ease-in-out infinite alternate}

/* ---------- parallax layers ---------- */
[data-parallax]{will-change:transform;transition:transform .12s linear}

/* ---------- animated counters ---------- */
[data-count]{font-variant-numeric:tabular-nums}

/* ---------- film grain ---------- */
@keyframes grain-shift{
  0%{transform:translate3d(0,0,0)}20%{transform:translate3d(-3%,2%,0)}40%{transform:translate3d(2%,-3%,0)}
  60%{transform:translate3d(-2%,-2%,0)}80%{transform:translate3d(3%,1%,0)}100%{transform:translate3d(0,0,0)}
}
.grain::before{
  content:"";position:fixed;inset:-60px;z-index:9998;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:grain-shift 6s steps(6) infinite
}

/* ---------- skill bars fill when they arrive ---------- */
.bar-fill{transition:width 1.15s cubic-bezier(.22,1,.36,1)}

/* ---------- marquee ---------- */
@keyframes marquee{to{transform:translate3d(-50%,0,0)}}
.marquee-track{animation:marquee 32s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}

/* ---------- Soft_Tech PortfoGen credit on generated portfolios ---------- */
.pg-credit-wrap{padding:26px 22px 40px;text-align:center}
.pg-credit{
  display:inline-flex;align-items:center;gap:7px;font-size:13px;line-height:1.5;
  color:inherit;opacity:.62;text-decoration:none;border-top:1px solid currentColor;
  padding-top:14px;transition:opacity .25s ease
}
.pg-credit:hover{opacity:1}
.pg-credit b{font-weight:700}

@media(prefers-reduced-motion:reduce){
  [data-reveal],[data-reveal].is-in{opacity:1!important;transform:none!important;transition:none!important}
  .reveal-line>span,.reveal-line.is-in>span{transform:none!important;transition:none!important}
  [data-tilt],[data-parallax]{transform:none!important;transition:none!important}
  [data-kenburns] img{animation:none!important}
  .grain::before{animation:none!important}
  .marquee-track{animation:none!important}
  [data-spotlight]::after{display:none}
}
`;

/** Everything the page needs at runtime. Self-contained — runs inside srcdoc iframes.
    Exposed as window.__motion so a router can re-run it after re-rendering. */
export const MOTION_JS = `window.__motion = function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- auto-tag reveal targets so templates need no extra markup ---- */
  var SELECTORS = ['section','article','.proj','.card','.case','.work','.quote','.qcard','.qc','.entry',
                   '.tl-item','.tl-i','.xp','.stat','.svc','.svc-item','.svc-i','.q','.row','.work-item',
                   '.hero-card','.c-id','.c-about','.c-skills','.c-tl','.c-edu','.c-contact','.big-quote','.contact','.cta'];
  var seen = [];
  SELECTORS.forEach(function(s){
    Array.prototype.forEach.call(document.querySelectorAll(s), function(el){
      if (seen.indexOf(el) !== -1) return;
      seen.push(el);
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal','');
    });
  });

  if (reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal],.reveal-line'), function(el){
      el.classList.add('is-in');
    });
    return;
  }

  /* ---- staggered scroll reveal ---- */
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        var peers = e.target.parentElement
          ? [].slice.call(e.target.parentElement.children).filter(function(c){ return c.hasAttribute && c.hasAttribute('data-reveal'); })
          : [e.target];
        var i = Math.max(0, peers.indexOf(e.target));
        e.target.style.transitionDelay = (Math.min(i, 8) * 55) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* ---- masked line reveals for big headings ---- */
  var io2 = null;
  if ('IntersectionObserver' in window) {
    io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (e.target.getAttribute('data-line-i') * 90) + 'ms';
        e.target.classList.add('is-in');
        io2.unobserve(e.target);
      });
    }, { threshold: 0.3 });
  }
  document.querySelectorAll('.reveal-line').forEach(function(el, i){
    el.setAttribute('data-line-i', i % 4);
    if (io2) io2.observe(el); else el.classList.add('is-in');
  });

  /* ---- animated counters ---- */
  function countUp(el){
    var text = (el.textContent || '').trim();
    var m = text.match(/^-?([0-9][0-9,.]*)(.*)$/);
    if (!m) return;
    var raw = m[1].replace(/,/g, '');
    var target = parseFloat(raw);
    if (!isFinite(target)) return;
    var suffix = m[2] || '';
    var decimals = (raw.split('.')[1] || '').length;
    var t0 = performance.now(), dur = 1100;
    (function frame(now){
      var k = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      var val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
      if (k < 1) requestAnimationFrame(frame);
    })(t0);
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { countUp(e.target); io3.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function(el){ io3.observe(el); });
  } else counters.forEach(countUp);

  /* ---- skill bars fill on arrival ---- */
  function fillBars(root){
    (root || document).querySelectorAll('.bar-fill, .bar > i, .track > i, .tr > i').forEach(function(b){
      var w = b.style.width;
      b.style.width = '0%';
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ b.style.width = w; }); });
    });
  }
  if ('IntersectionObserver' in window) {
    var io4 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { fillBars(e.target); io4.unobserve(e.target); } });
    }, { threshold: 0.25 });
    document.querySelectorAll('.skills,.bars,.c-skills,.skill-list,aside').forEach(function(el){ io4.observe(el); });
  }

  /* ---- 3D pointer tilt + spotlight (guarded so re-running never double-binds) ---- */
  document.querySelectorAll('[data-tilt]').forEach(function(el){
    if (el.__tiltBound) return;
    el.__tiltBound = true;
    var max = parseFloat(el.getAttribute('data-tilt-max') || el.dataset.tiltMax || '9');
    var scaling = 1;
    function move(ev){
      var r = el.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width;
      var py = (ev.clientY - r.top) / r.height;
      var rx = (0.5 - py) * max * 2;
      var ry = (px - 0.5) * max * 2;
      el.classList.add('is-tilting');
      el.style.transform = 'perspective(1100px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(' + scaling + ',' + scaling + ',1)';
      el.style.setProperty('--mx', (px * 100) + '%');
      el.style.setProperty('--my', (py * 100) + '%');
    }
    function reset(){
      el.classList.remove('is-tilting');
      el.style.transform = '';
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    }
    el.addEventListener('pointerenter', function(){ scaling = 1.015; });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', function(){ scaling = 1; reset(); });
  });

  document.querySelectorAll('[data-spotlight]').forEach(function(el){
    if (el.__spotBound) return;
    el.__spotBound = true;
    el.addEventListener('pointermove', function(ev){
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---- parallax ---- */
  var layers = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (layers.length) {
    var ticking = false;
    function paint(){
      ticking = false;
      var vh = window.innerHeight || 1;
      layers.forEach(function(el){
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax') || '0.1');
        var off = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (off * speed * -110).toFixed(2) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function(){
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

  /* ---- grain ---- */
  if (!document.querySelector('.grain')) document.documentElement.classList.add('grain');

  /* ---- magnetic buttons ---- */
  document.querySelectorAll('[data-magnet]').forEach(function(el){
    if (el.__magnetBound) return;
    el.__magnetBound = true;
    var strength = parseFloat(el.getAttribute('data-magnet') || '0.28');
    el.addEventListener('pointermove', function(ev){
      var r = el.getBoundingClientRect();
      var x = (ev.clientX - r.left - r.width / 2) * strength;
      var y = (ev.clientY - r.top - r.height / 2) * strength;
      el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    });
    el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
  });
};
window.__motion();`;
