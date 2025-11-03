// script.js
// Updated to use local assets for the two portfolio games and store images.
// Handles: smooth scroll, reveal-on-scroll, modal previews, countdown + celebration, cake interaction, and mini-games.

document.addEventListener('DOMContentLoaded', () => {
  // ---------- small utilities ----------
  const el = (selector, parent = document) => parent.querySelector(selector);
  const els = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  // Year in footer
  const yearEl = el('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }
    });
  });

  // Reveal on scroll (IntersectionObserver)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(elm => observer.observe(elm));

  // ---------- Modal preview ----------
  const modal = el('#modal');
  const modalContent = el('#modalContent');
  const modalClose = el('#modalClose');
  function openModal(contentHtml) {
    if (!modal) return;
    modalContent.innerHTML = '';
    modalContent.insertAdjacentHTML('beforeend', contentHtml);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // Portfolio preview handlers (open modal with angled preview)
  document.querySelectorAll('.game-card .preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.game-card');
      if (!card) return;
      const img = card.querySelector('.thumb');
      const title = img?.dataset?.title || 'Preview';
      const src = img?.src || '';
      openModal(`
        <div style="display:flex;flex-direction:column;gap:12px;">
          <h3 style="margin:0">${escapeHtml(title)}</h3>
          <div style="width:100%;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.6);">
            <img src="${src}" alt="${escapeHtml(title)}" style="width:100%;height:auto;display:block;object-fit:cover;transform:perspective(900px) rotateX(4deg) rotateY(-4deg) scale(1.02);" />
          </div>
          <div style="display:flex;gap:12px;">
            <a class="btn" href="${card.querySelector('a')?.href || '#'}" target="_blank" rel="noopener">Open on Roblox</a>
            <button id="closePreviewBtn" class="btn ghost">Close</button>
          </div>
        </div>
      `);
      const closeBtn = el('#closePreviewBtn', modal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    });
  });

  // Store preview handler
  const storePreviewBtn = el('#storePreviewBtn');
  if (storePreviewBtn) {
    storePreviewBtn.addEventListener('click', () => {
      const storeImg = el('.store-thumb');
      const src = storeImg?.src || '';
      const title = storeImg?.dataset?.title || 'Store Preview';
      openModal(`
        <div style="display:flex;flex-direction:column;gap:12px">
          <h3 style="margin:0">${escapeHtml(title)}</h3>
          <div style="width:100%;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
            <div style="flex:0 0 320px;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.6);">
              <img src="${src}" alt="${escapeHtml(title)}" style="width:100%;height:100%;display:block;object-fit:cover;transform:rotateX(6deg) rotateY(-6deg) scale(1.03);" />
            </div>
            <div style="flex:1">
              <p class="muted">Group store with clothing items, shirts, and accessories. Visit the store to see current drops and outfits.</p>
              <a class="btn" href="https://www.roblox.com/communities/440897980/XLAZ-CLOTHES#!/store" target="_blank" rel="noopener">Open Store</a>
            </div>
          </div>
        </div>
      `);
    });
  }

  // ---------- MEMORIES: open memory preview on click ----------
  document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const img = card.querySelector('.memory-thumb');
      const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Memory';
      const desc = card.dataset.desc || card.querySelector('.muted')?.textContent || '';
      const full = img?.dataset?.full || img?.src || '';
      openModal(`
        <div style="display:flex;flex-direction:column;gap:12px;">
          <h3 style="margin:0">${escapeHtml(title)}</h3>
          <div style="width:100%;border-radius:12px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.6);">
            <img src="${full}" alt="${escapeHtml(title)}" style="width:100%;height:auto;display:block;object-fit:cover;transform:perspective(1000px) rotateX(3deg) rotateY(-3deg) scale(1.03);" />
          </div>
          <p class="muted">${escapeHtml(desc)}</p>
          <div style="display:flex;gap:12px;">
            <button id="closeMemoryBtn" class="btn ghost">Close</button>
          </div>
        </div>
      `);
      const closeBtn = el('#closeMemoryBtn', modal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    });
  });

  // ---------- BIRTHDAY COUNTDOWN (months/days/hours/mins/secs) ----------
  const MONTHS_EL = el('#months'), DAYS_EL = el('#days'), HOURS_EL = el('#hours'), MINUTES_EL = el('#minutes'), SECONDS_EL = el('#seconds');

  function getNextBirthdayReference(from = new Date()) {
    const year = from.getFullYear();
    const thisYearBirthday = new Date(year, 11, 8, 0, 0, 0, 0); // Dec 8
    if (from <= thisYearBirthday) return thisYearBirthday;
    return new Date(year + 1, 11, 8, 0, 0, 0, 0);
  }
  function addMonthsSafe(date, months) {
    const d = new Date(date.getTime());
    const targetMonth = d.getMonth() + months;
    const year = d.getFullYear() + Math.floor(targetMonth / 12);
    const month = ((targetMonth % 12) + 12) % 12;
    const day = Math.min(d.getDate(), new Date(year, month + 1, 0).getDate());
    return new Date(year, month, day, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
  }
  function computeTimeLeft(nowDt, targetDt) {
    if (nowDt > targetDt) return null;
    let months = (targetDt.getFullYear() - nowDt.getFullYear()) * 12 + (targetDt.getMonth() - nowDt.getMonth());
    let intermediate = addMonthsSafe(nowDt, months);
    if (intermediate > targetDt) { months--; intermediate = addMonthsSafe(nowDt, months); }
    let diff = Math.max(0, targetDt - intermediate);
    const secondsTotal = Math.floor(diff / 1000);
    const days = Math.floor(secondsTotal / 86400);
    const hours = Math.floor((secondsTotal % 86400) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = Math.floor(secondsTotal % 60);
    return { months, days, hours, minutes, seconds };
  }

  let targetDate = getNextBirthdayReference();
  let countdownInterval = null;
  const confettiEngine = createConfettiEngine();
  const confettiCanvas = el('#confettiCanvas');

  function updateCountdown(nowOverride = null) {
    const n = nowOverride || new Date();
    const left = computeTimeLeft(n, targetDate);
    if (!left) {
      triggerCelebration();
      return;
    }
    if (MONTHS_EL) MONTHS_EL.textContent = left.months;
    if (DAYS_EL) DAYS_EL.textContent = left.days;
    if (HOURS_EL) HOURS_EL.textContent = String(left.hours).padStart(2, '0');
    if (MINUTES_EL) MINUTES_EL.textContent = String(left.minutes).padStart(2, '0');
    if (SECONDS_EL) SECONDS_EL.textContent = String(left.seconds).padStart(2, '0');

    if (left.months === 0 && left.days === 0 && left.hours === 0 && left.minutes === 0 && left.seconds === 0) triggerCelebration();
  }
  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // simulate controls
  const simulateNowBtn = el('#simulateNow');
  if (simulateNowBtn) simulateNowBtn.addEventListener('click', () => {
    targetDate = new Date();
    updateCountdown();
  });
  const simulate10sBtn = el('#simulate10s');
  if (simulate10sBtn) simulate10sBtn.addEventListener('click', () => {
    targetDate = new Date(Date.now() + 10_000);
    startCountdown();
  });

  startCountdown();

  // Trigger celebration
  function triggerCelebration() {
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    document.body.classList.add('birthday');
    const mainTitle = el('#mainTitle');
    if (mainTitle) mainTitle.textContent = "Happy Birthday xhlazz!";
    // Reveal mini-games section
    const mg = el('#mini-games');
    if (mg) { mg.classList.add('visible'); mg.setAttribute('aria-hidden', 'false'); }
    // confetti
    if (confettiCanvas) confettiCanvas.style.display = 'block';
    confettiEngine.start({ duration: 10000 });
    setTimeout(() => { if (confettiCanvas) confettiCanvas.style.display = 'none'; }, 10200);
  }

  // ---------- CAKE interaction ----------
  const cake = el('#cake');
  let candlesBlown = false;
  if (cake) {
    const candleEls = cake.querySelectorAll('.candle');
    function blowCandles() {
      if (candlesBlown) return;
      candlesBlown = true;
      candleEls.forEach(c => { c.style.transition = 'opacity .8s transform .8s'; c.style.opacity = '0'; c.style.transform = 'translateY(-8px) scale(.8)'; });
      confettiEngine.start({ duration: 2200 });
      openTempToast('Candles blown! 🎉');
      document.body.classList.add('birthday');
      const mainTitle = el('#mainTitle'); if (mainTitle) mainTitle.textContent = "Happy Birthday xhlazz!";
    }
    cake.addEventListener('click', blowCandles);
    cake.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') blowCandles(); });
  }

  function openTempToast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    Object.assign(t.style, { position:'fixed', bottom:'22px', left:'50%', transform:'translateX(-50%)', padding:'12px 16px', background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'8px', color:'#fff', zIndex:9999, boxShadow:'0 6px 18px rgba(0,0,0,0.6)' });
    document.body.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .5s'; t.style.opacity = '0'; }, 1800);
    setTimeout(() => t.remove(), 2400);
  }

  // ---------- MINI-GAMES ----------
  const openBalloonBtn = el('#openBalloon');
  if (openBalloonBtn) openBalloonBtn.addEventListener('click', () => openBalloonGame());

  function openBalloonGame() {
    openModal(`<div style="display:flex;flex-direction:column;gap:12px;">
      <h3>Balloon Pop</h3>
      <p class="muted">Click balloons to pop them. Pop as many as you can in 25 seconds.</p>
      <canvas id="balloonCanvas" style="width:100%;height:360px;border-radius:8px;background:linear-gradient(180deg,#050505,#0a0a0a)"></canvas>
      <div style="display:flex;gap:8px;align-items:center;">
        <div id="balloonScore" style="font-weight:700">Score: 0</div>
        <button id="balloonStart" class="btn">Start</button>
        <button id="balloonClose" class="btn ghost">Close</button>
      </div>
    </div>`);
    const canvas = el('#balloonCanvas', modal);
    const scoreEl = el('#balloonScore', modal);
    const startBtn = el('#balloonStart', modal);
    const closeBtn = el('#balloonClose', modal);
    let running = false, score = 0, actors = [], animId = null, duration = 25000;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    }
    function spawnBalloon() {
      const w = canvas.width, h = canvas.height;
      actors.push({
        x: Math.random() * w,
        y: h + Math.random() * 80,
        vy: - (1 + Math.random() * 2),
        r: 18 + Math.random() * 28,
        color: `hsl(${Math.floor(Math.random()*360)} 80% 70%)`,
        id: Math.random().toString(36).slice(2)
      });
    }
    function step() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if (Math.random() < 0.08) spawnBalloon();
      for (let i = actors.length-1; i>=0; i--) {
        const a = actors[i];
        a.y += a.vy * (1 + Math.random()*0.6);
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = a.color;
        ctx.ellipse(a.x, a.y, a.r, a.r*1.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.stroke();
        ctx.restore();
        if (a.y + a.r < -40) actors.splice(i,1);
      }
      animId = requestAnimationFrame(step);
    }
    function startGame() {
      if (running) return;
      running = true; score = 0; actors.length = 0;
      scoreEl.textContent = `Score: ${score}`;
      resize();
      animId = requestAnimationFrame(step);
      setTimeout(() => {
        running = false;
        if (animId) cancelAnimationFrame(animId);
        openTempToast(`Balloon Pop finished — score: ${score}`);
      }, duration);
    }
    function getCursorPos(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * devicePixelRatio;
      const y = (e.clientY - rect.top) * devicePixelRatio;
      return { x, y };
    }
    canvas.addEventListener('click', (ev) => {
      if (!running) return;
      const p = getCursorPos(ev);
      for (let i = actors.length -1; i>=0; i--) {
        const a = actors[i];
        const dx = p.x - a.x;
        const dy = p.y - a.y;
        if (Math.sqrt(dx*dx + dy*dy) < a.r*1.1) {
          actors.splice(i,1);
          score += 1;
          scoreEl.textContent = `Score: ${score}`;
          confettiEngine.start({ duration: 600 });
          break;
        }
      }
    });

    startBtn.addEventListener('click', startGame);
    closeBtn.addEventListener('click', closeModal);
    setTimeout(resize, 150);
    window.addEventListener('resize', resize);
  }

  // Candle Blow
  const openCandleBtn = el('#openCandle');
  if (openCandleBtn) openCandleBtn.addEventListener('click', () => {
    openModal(`<div style="display:flex;flex-direction:column;gap:12px;">
      <h3>Candle Blow</h3>
      <p class="muted">Try to blow out all candles. Click the 'Blow' button to attempt.</p>
      <div id="candleMock" style="display:flex;gap:12px;align-items:center;">
        <div style="font-size:48px">🎂</div>
        <div id="candleStatus" class="muted">Candles lit</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button id="blowBtn" class="btn">Blow</button>
        <button id="candleClose" class="btn ghost">Close</button>
      </div>
    </div>`);
    const blowBtn = el('#blowBtn', modal);
    const candleStatus = el('#candleStatus', modal);
    const candleClose = el('#candleClose', modal);
    let attempts = 0;
    blowBtn.addEventListener('click', () => {
      attempts++;
      const chance = Math.min(0.2 + attempts * 0.25, 0.95);
      if (Math.random() < chance) {
        candleStatus.textContent = 'Candles out! 🎉';
        confettiEngine.start({ duration: 1200 });
        setTimeout(() => { closeModal(); openTempToast('Nice! Candles out.'); }, 1000);
      } else {
        candleStatus.textContent = 'Not blown — try again!';
        confettiEngine.start({ duration: 300 });
      }
    });
    candleClose.addEventListener('click', closeModal);
  });

  // ---------- Confetti engine ----------
  function createConfettiEngine() {
    const canvas = el('#confettiCanvas');
    if (!canvas) return { start: () => {} };
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];
    let raf = null, running = false;
    window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });

    function random(min, max) { return Math.random() * (max - min) + min; }
    function resetParticle(p) {
      p.x = random(0, width);
      p.y = random(-50, -10);
      p.size = random(6, 14);
      p.color = `hsl(${Math.floor(random(0, 360))} 100% 70%)`;
      p.rotation = random(0, Math.PI * 2);
      p.vx = random(-1.5, 1.5);
      p.vy = random(1, 4);
      p.spin = random(-0.2, 0.2);
      p.drag = 0.995;
    }
    function createParticles(n) { for (let i=0;i<n;i++){ const p={}; resetParticle(p); particles.push(p); } }
    function step() {
      ctx.clearRect(0,0,width,height);
      for (let i=0;i<particles.length;i++){
        const p = particles[i];
        p.vx *= p.drag; p.vy += 0.05; p.x += p.vx; p.y += p.vy; p.rotation += p.spin;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6); ctx.restore();
        if (p.y > height + 50) { resetParticle(p); p.y = random(-20, -10); }
      }
      raf = requestAnimationFrame(step);
    }
    return {
      start(opts = {}) {
        if (running) return;
        running = true;
        const duration = typeof opts.duration === 'number' ? opts.duration : 4000;
        createParticles(120);
        canvas.style.display = 'block';
        step();
        setTimeout(() => {
          running = false;
          if (raf) cancelAnimationFrame(raf);
          particles.length = 0;
          ctx.clearRect(0,0,width,height);
          canvas.style.display = 'none';
        }, duration);
      }
    };
  }

  // modal close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  console.log('Site scripts initialized.');
});
