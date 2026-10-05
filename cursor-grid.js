/* CursorGrid - hero background.
   Vanilla canvas port of the React Bits <CursorGrid /> component (JS + CSS variant).
   Same lattice, falloff curves, hold/fade timing and click pulses; no framework.

   Behaviour specific to this site:
   - Colour follows the theme: white strokes in dark mode, black in light mode.
   - Pointer driven only. Skipped on touch (no hover) and when the user asks for
     reduced motion, so it never costs battery or fights the tap behaviour of the
     phone layout.

   Tune any option from the page with window.heroGrid = { ... } before this file
   runs. Defaults mirror the component's documented usage example. */
(function () {
  'use strict';

  var DEFAULTS = {
    cellSize: 70,
    radius: 140,
    falloff: 'smooth', // 'linear' | 'smooth' | 'sharp'
    holdTime: 400,
    fadeDuration: 800,
    lineWidth: 1.2,
    maxOpacity: 1,
    fillOpacity: 0,
    gridOpacity: 0, // >0 draws a faint always-on lattice
    cellRadius: 0,
    clickPulse: true,
    pulseSpeed: 600
  };

  var THEME_COLORS = { dark: '#ffffff', light: '#111111' };

  var FALLOFF = {
    linear: function (t) { return t; },
    smooth: function (t) { return t * t * (3 - 2 * t); },
    sharp: function (t) { return t * t * t; }
  };

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var num = parseInt(h.slice(0, 6), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function boot() {
    var host = document.getElementById('hero');
    var canvas = document.getElementById('hero-grid-canvas');
    if (!host || !canvas) return;

    var mq = window.matchMedia || function () { return { matches: false }; };
    // Pointer driven only. Phones and tablets have no hover to follow, and a
    // touch drag would light cells as the page scrolls past.
    if (mq('(hover: none)').matches || mq('(pointer: coarse)').matches) return;
    if (mq('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    var root = document.documentElement;
    var opts = {};
    var key;
    for (key in DEFAULTS) opts[key] = DEFAULTS[key];
    if (window.heroGrid) for (key in window.heroGrid) opts[key] = window.heroGrid[key];
    opts.color = THEME_COLORS[root.classList.contains('dark') ? 'dark' : 'light'];

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cols = 0, rows = 0, offX = 0, offY = 0;
    var alphas = new Float32Array(0);
    var touched = new Float64Array(0);
    var w = 0, h = 0;
    var pulses = [];
    var raf = 0, running = false, lastFrame = 0;

    function rebuild() {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / opts.cellSize) + 1;
      rows = Math.ceil(h / opts.cellSize) + 1;
      // Centre the lattice so edge cells crop evenly on both sides.
      offX = (w - cols * opts.cellSize) / 2;
      offY = (h - rows * opts.cellSize) / 2;
      alphas = new Float32Array(cols * rows);
      touched = new Float64Array(cols * rows);
    }

    function cellCenter(i) {
      var cx = offX + (i % cols) * opts.cellSize + opts.cellSize / 2;
      var cy = offY + Math.floor(i / cols) * opts.cellSize + opts.cellSize / 2;
      return [cx, cy];
    }

    // Light every cell whose centre falls inside the radius, with the falloff
    // curve mapping distance to brightness.
    function energize(x, y) {
      var r = Math.max(opts.radius, 1);
      var ease = FALLOFF[opts.falloff] || FALLOFF.linear;
      var now = performance.now();
      var minCol = Math.max(0, Math.floor((x - r - offX) / opts.cellSize));
      var maxCol = Math.min(cols - 1, Math.floor((x + r - offX) / opts.cellSize));
      var minRow = Math.max(0, Math.floor((y - r - offY) / opts.cellSize));
      var maxRow = Math.min(rows - 1, Math.floor((y + r - offY) / opts.cellSize));
      for (var rw = minRow; rw <= maxRow; rw++) {
        for (var cl = minCol; cl <= maxCol; cl++) {
          var i = rw * cols + cl;
          var c = cellCenter(i);
          var dist = Math.hypot(c[0] - x, c[1] - y);
          if (dist > r) continue;
          var level = ease(1 - dist / r) * opts.maxOpacity;
          if (level > alphas[i]) alphas[i] = level;
          if (level > 0) touched[i] = now;
        }
      }
    }

    function draw(now) {
      var dt = Math.min(now - lastFrame, 50);
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);
      var rgb = hexToRgb(opts.color);

      if (opts.gridOpacity > 0) {
        ctx.strokeStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + opts.gridOpacity + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var gc = 0; gc <= cols; gc++) {
          var gx = Math.round(offX + gc * opts.cellSize) + 0.5;
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
        }
        for (var gr = 0; gr <= rows; gr++) {
          var gy = Math.round(offY + gr * opts.cellSize) + 0.5;
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
        }
        ctx.stroke();
      }

      // Expanding click pulses hand their energy to cells as they pass.
      for (var pi = pulses.length - 1; pi >= 0; pi--) {
        var pulse = pulses[pi];
        var ringR = ((now - pulse.t0) / 1000) * opts.pulseSpeed;
        if (ringR > Math.hypot(w, h)) {
          pulses.splice(pi, 1);
          continue;
        }
        var band = opts.cellSize;
        var pMinCol = Math.max(0, Math.floor((pulse.x - ringR - band - offX) / opts.cellSize));
        var pMaxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - offX) / opts.cellSize));
        var pMinRow = Math.max(0, Math.floor((pulse.y - ringR - band - offY) / opts.cellSize));
        var pMaxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - offY) / opts.cellSize));
        for (var pr = pMinRow; pr <= pMaxRow; pr++) {
          for (var pc = pMinCol; pc <= pMaxCol; pc++) {
            var pi2 = pr * cols + pc;
            var cc = cellCenter(pi2);
            var pd = Math.hypot(cc[0] - pulse.x, cc[1] - pulse.y);
            if (Math.abs(pd - ringR) < band / 2 && opts.maxOpacity > alphas[pi2]) {
              alphas[pi2] = opts.maxOpacity;
              touched[pi2] = now;
            }
          }
        }
      }

      var anyVisible = pulses.length > 0;
      var fadeStep = dt / Math.max(opts.fadeDuration, 16);
      var half = opts.cellSize / 2;

      for (var i = 0; i < alphas.length; i++) {
        var a = alphas[i];
        if (a <= 0) continue;
        if (now - touched[i] > opts.holdTime) {
          a = Math.max(0, a - fadeStep);
          alphas[i] = a;
          if (a <= 0) continue;
        }
        anyVisible = true;

        var c2 = cellCenter(i);
        var grad = ctx.createRadialGradient(c2[0], c2[1], half * 0.1, c2[0], c2[1], opts.cellSize);
        grad.addColorStop(0, 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + a + ')');
        grad.addColorStop(1, 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0)');

        var x = c2[0] - half + 0.5;
        var y = c2[1] - half + 0.5;
        var s = opts.cellSize - 1;

        ctx.beginPath();
        if (opts.cellRadius > 0) {
          if (ctx.roundRect) ctx.roundRect(x, y, s, s, opts.cellRadius);
          else ctx.rect(x, y, s, s);
        } else {
          ctx.rect(x, y, s, s);
        }
        if (opts.fillOpacity > 0) {
          ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + (a * opts.fillOpacity) + ')';
          ctx.fill();
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = opts.lineWidth;
        ctx.stroke();
      }

      if (anyVisible) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
        if (opts.gridOpacity <= 0) ctx.clearRect(0, 0, w, h);
      }
    }

    function wake() {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(draw);
    }

    function toLocal(e) {
      var rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }

    // Listeners sit on the hero section, not the canvas, so the effect responds
    // while the pointer is over the copy and never intercepts a button click.
    function onPointerMove(e) {
      var pt = toLocal(e);
      energize(pt[0], pt[1]);
      wake();
    }

    function onPointerDown(e) {
      if (!opts.clickPulse) return;
      var pt = toLocal(e);
      pulses.push({ x: pt[0], y: pt[1], t0: performance.now() });
      wake();
    }

    var ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () { rebuild(); wake(); });
      ro.observe(host);
    } else {
      window.addEventListener('resize', function () { rebuild(); wake(); });
    }

    // Re-tint when the theme toggle flips the class on <html>.
    var mo = null;
    if (window.MutationObserver) {
      mo = new MutationObserver(function () {
        opts.color = THEME_COLORS[root.classList.contains('dark') ? 'dark' : 'light'];
        wake();
      });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    }

    rebuild();
    wake();

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerdown', onPointerDown);

    window.addEventListener('pagehide', function () {
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (mo) mo.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerdown', onPointerDown);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
