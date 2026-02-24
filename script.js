/* ============================================================
   EDLIN PORTFOLIO — script.js
   ============================================================ */

/* ── 1. ANIMATED PARTICLE CANVAS BACKGROUND ──────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -9999, y: -9999 };

  const PARTICLE_COUNT = 80;
  const ACCENT = { r: 255, g: 77, b: 28 };
  const DARK   = { r: 26,  g: 26,  b: 26  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const useAccent = Math.random() < 0.25;
    const col = useAccent ? ACCENT : DARK;
    return {
      x: random(0, W),
      y: random(0, H),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      r: random(1.5, 4.5),
      alpha: random(0.06, 0.25),
      col,
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawConnections() {
    const THRESHOLD = 160;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < THRESHOLD) {
          const a = (1 - dist / THRESHOLD) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26,26,26,${a})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseRepel() {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const REPEL_RADIUS = 120;
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * 0.6;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    drawConnections();
    drawMouseRepel();

    particles.forEach(p => {
      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2.5) {
        p.vx = (p.vx / speed) * 2.5;
        p.vy = (p.vy / speed) * 2.5;
      }

      // Slight friction
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const { r, g, b } = p.col;
      ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  initParticles();
  animate();
})();

/* ── 2. CUSTOM CURSOR ────────────────────────────────────── */
(function () {
  const blob = document.getElementById('cursor-blob');
  let bx = -100, by = -100;
  let tx = -100, ty = -100;

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  // Lerp for smooth follow
  function lerp(a, b, n) { return a + (b - a) * n; }

  function loop() {
    bx = lerp(bx, tx, 0.18);
    by = lerp(by, ty, 0.18);
    blob.style.left = bx + 'px';
    blob.style.top  = by + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  // Hover state on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => blob.classList.add('hovered'));
    el.addEventListener('mouseleave', () => blob.classList.remove('hovered'));
  });
})();

/* ── 3. SCROLL REVEAL ────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
})();

/* ── 4. SKILL BAR ANIMATION ─────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.skill-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // slight delay so the card fade-in leads
        setTimeout(() => entry.target.classList.add('animated'), 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(c => observer.observe(c));
})();

/* ── 5. MOBILE MENU ──────────────────────────────────────── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── 6. NAVBAR SHADOW ON SCROLL ─────────────────────────── */
(function () {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 2px 24px rgba(26,26,26,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
})();

/* ── 7. HERO NAME LETTER SPLIT (stagger) ─────────────────── */
(function () {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  const text = name.textContent.trim();
  name.textContent = '';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(40px)';
    span.style.transition = `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.06}s,
                              transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.06}s`;
    span.textContent = char;
    name.appendChild(span);
  });

  // Trigger after a tiny delay to allow CSS to register
  requestAnimationFrame(() => {
    setTimeout(() => {
      name.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0)';
      });
    }, 80);
  });
})();