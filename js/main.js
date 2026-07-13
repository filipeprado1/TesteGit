/* ============================================================
   LASER MARK — Interações & Animações
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar + barra de progresso ---- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  var onScroll = function () {
    if (window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    var h = document.documentElement;
    progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  };
  onScroll();
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contadores ---- */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1500, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
  }

  /* ---- Tilt 3D sutil ---- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateX(' + (-py * 4) + 'deg) rotateY(' + (px * 4) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---- Formulário (demo) ---- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'Por favor, preencha os campos obrigatórios.';
        note.style.color = 'var(--gold-2)';
        return;
      }
      var nome = (document.getElementById('nome').value || '').split(' ')[0];
      note.style.color = 'var(--green-2)';
      note.textContent = 'Obrigado' + (nome ? ', ' + nome : '') + '! Recebemos sua mensagem e retornaremos em breve.';
      form.reset();
    });
  }

  /* ---- Máscara dinâmica de telefone / celular ---- */
  var foneEl = document.getElementById('fone');
  if (foneEl) {
    foneEl.setAttribute('inputmode', 'tel');
    foneEl.setAttribute('autocomplete', 'tel');
    var maskFone = function (value) {
      var d = value.replace(/\D/g, '').slice(0, 11); // só dígitos, máx. 11 (DDD + 9)
      var n = d.length;
      if (n === 0) return '';
      if (n < 3) return '(' + d;                                              // (11
      if (n <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);            // (11) 2098
      if (n <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);   // fixo:    (11) 2098-2525
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);                // celular: (11) 98765-4321
    };
    foneEl.addEventListener('input', function () {
      var atEnd = this.selectionStart === this.value.length;
      this.value = maskFone(this.value);
      if (atEnd) { var end = this.value.length; this.setSelectionRange(end, end); }
    });
  }

  /* ============================================================
     Hero canvas — partículas + feixes de laser (verde/dourado)
     ============================================================ */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var w, h, dpr, particles = [], rays = [], rayTimer = 0;

    var initParticles = function () {
      var count = Math.min(Math.floor(w / 16), 80);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.4, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, a: Math.random() * 0.4 + 0.15 });
      }
    };
    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };
    var spawnRay = function () {
      rays.push({ x: Math.random() * w, y: -20, len: Math.random() * 80 + 60, speed: Math.random() * 6 + 5, hue: Math.random() > 0.45 ? '52,179,74' : '242,209,17', a: 1 });
    };
    var draw = function () {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52,179,74,' + p.a + ')'; ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j], dx = p.x - q.x, dy = p.y - q.y, dist = dx * dx + dy * dy;
          if (dist < 12000) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(52,179,74,' + (0.09 * (1 - dist / 12000)) + ')'; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      rayTimer++;
      if (rayTimer > 55) { spawnRay(); rayTimer = 0; }
      for (var k = rays.length - 1; k >= 0; k--) {
        var r = rays[k]; r.y += r.speed;
        var g = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.len);
        g.addColorStop(0, 'rgba(' + r.hue + ',0)');
        g.addColorStop(0.5, 'rgba(' + r.hue + ',' + (0.5 * r.a) + ')');
        g.addColorStop(1, 'rgba(' + r.hue + ',0)');
        ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + r.len);
        ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.beginPath(); ctx.arc(r.x, r.y + r.len, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r.hue + ',' + r.a + ')'; ctx.fill();
        if (r.y > h + 40) rays.splice(k, 1);
      }
      requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize, { passive: true });
    resize(); draw();
  }
})();
