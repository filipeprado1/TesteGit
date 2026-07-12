/* ============================================================
   LASERMARK — Interações & Animações
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Ano no rodapé ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar: sombra ao rolar ---- */
  var nav = document.getElementById('nav');
  var onScrollNav = function () {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScrollNav();

  /* ---- Barra de progresso de scroll ---- */
  var progress = document.getElementById('scrollProgress');
  var onScrollProgress = function () {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100) + '%';
  };
  onScrollProgress();

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScrollNav();
        onScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
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
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contadores animados ---- */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
  }

  /* ---- Cursor glow ---- */
  var glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    var gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) { gx = e.clientX; gy = e.clientY; }, { passive: true });
    (function loop() {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Card spotlight (segue o mouse) ---- */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---- Tilt 3D sutil ---- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateX(' + (-py * 5) + 'deg) rotateY(' + (px * 5) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---- Formulário (demo, sem backend) ---- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'Por favor, preencha os campos obrigatórios.';
        note.style.color = 'var(--accent-2)';
        return;
      }
      var nome = (document.getElementById('nome').value || '').split(' ')[0];
      note.style.color = 'var(--accent)';
      note.textContent = 'Obrigado' + (nome ? ', ' + nome : '') + '! Recebemos sua mensagem e retornaremos em breve.';
      form.reset();
    });
  }

  /* ============================================================
     Hero canvas — feixes/partículas de laser
     ============================================================ */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var w, h, dpr, particles = [], rays = [];

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    var initParticles = function () {
      var count = Math.min(Math.floor(w / 14), 90);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.5 + 0.15
        });
      }
    };

    // Feixes verticais de laser que cruzam a tela periodicamente
    var spawnRay = function () {
      rays.push({
        x: Math.random() * w,
        y: -20,
        len: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 5,
        hue: Math.random() > 0.5 ? '0,229,255' : '255,90,31',
        a: 1
      });
    };
    var rayTimer = 0;

    var draw = function () {
      ctx.clearRect(0, 0, w, h);

      // partículas + conexões
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,' + p.a + ')';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = dx * dx + dy * dy;
          if (dist < 12000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(0,229,255,' + (0.10 * (1 - dist / 12000)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // feixes de laser
      rayTimer++;
      if (rayTimer > 55) { spawnRay(); rayTimer = 0; }
      for (var k = rays.length - 1; k >= 0; k--) {
        var r = rays[k];
        r.y += r.speed;
        var grad = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.len);
        grad.addColorStop(0, 'rgba(' + r.hue + ',0)');
        grad.addColorStop(0.5, 'rgba(' + r.hue + ',' + (0.5 * r.a) + ')');
        grad.addColorStop(1, 'rgba(' + r.hue + ',0)');
        ctx.beginPath();
        ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + r.len);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.4;
        ctx.stroke();
        // ponto de impacto
        ctx.beginPath();
        ctx.arc(r.x, r.y + r.len, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r.hue + ',' + r.a + ')';
        ctx.fill();
        if (r.y > h + 40) rays.splice(k, 1);
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();
  }
})();
