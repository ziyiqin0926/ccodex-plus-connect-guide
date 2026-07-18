import {
  guideSteps,
  faqs,
  localHelper,
  downloadPackages,
  relayLinks,
  referenceLinks,
  localOptimizationSkills,
} from './content.js';
import { findFaqs, checkLocalHelper } from './diagnostics.js';

const progressKey = 'codex-plus-guide-progress';
const progress = new Set(
  typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem(progressKey) || '[]'),
);

const $ = (selector) => document.querySelector(selector);

const lyricLines = [
  '关于全文我有话要说，AI 是工具，AI 是工具，AI 是工具。',
  '认知不会随着专业技能的提升而提升。',
  '变现的路径有很多，希望大家不要为了变现而去变现，而是用它创造出真正的价值。',
  '金钱只是对你的聪明和勤奋路上一点附庸的奖赏。',
  '这套文档在外面可能是199、399，甚至799，在这里是免费的。',
  'AI 不属于任何一个人，而是属于这个社会。',
  '这个文档可能晦涩难懂，但至少能解决 Codex 80% 的问题。',
  '一时间的失败、代码报错，问题不大，主播随时都在。',
  '希望你们从中学到东西，并在未来用它创造更大的价值。',
  '有建议、有需求，直接用批注写在旁边，不要删除，也不要干扰其他用户。',
  '如果文档里的视频帮助到你，请给原博主点关注、收藏。',
];

function saveProgress() {
  localStorage.setItem(progressKey, JSON.stringify([...progress]));
  renderProgress();
}

function renderProgress() {
  const done = progress.size;
  $('#progressText').textContent = `${done}/4 已完成`;
  $('#progressBar').style.width = `${(done / guideSteps.length) * 100}%`;
}

export function buildStepHtml(step, index, completed = new Set()) {
  return `
    <article class="step ${completed.has(step.id) ? 'is-done' : ''}" id="${step.id}">
      <div class="step-index">${String(index + 1).padStart(2, '0')}</div>
      <div>
        <h3>${step.title}</h3>
        <p>${step.action}</p>
        <ul>${step.checklist.map((item) => `<li>${item}</li>`).join('')}</ul>
        ${renderStepExample(step.example)}
        ${renderStepScreenshots(step.screenshots)}
        ${index === 0 ? renderDownloads() : ''}
        ${index === 1 ? renderRelayLinks() : ''}
        ${index === 3 ? renderLocalOptimization() : ''}
        ${renderStepReferences(index)}
        <div class="step-actions">
          <button class="primary" data-done="${step.id}">标记完成</button>
          <button class="ghost" data-help="${step.helpKey}">我卡在这里</button>
        </div>
      </div>
    </article>
  `;
}

function renderLocalOptimization() {
  return `
    <div class="local-optimization">
      <div class="optimization-head"><span class="eyebrow">LOCAL BOOST / 本地部署优化</span><h4>把 Codex 调成更懂你的本地工作台</h4><p>按 01 → 04 依次启用；都是可选增强，不影响基础接入。</p></div>
      <div class="optimization-grid">${localOptimizationSkills.map((item, index) => `<article class="optimization-card"><div class="optimization-card-head"><span>${item.badge}</span><button class="copy-button" data-copy="${index}">${item.copyLabel || '一键复制'}</button></div><h4>${item.title}</h4><p>${item.text}</p>${item.links ? `<div class="skill-links">${item.links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">↗ ${link.title}</a>`).join('')}</div>` : ''}<small>${item.action}</small></article>`).join('')}</div>
      <div class="optimization-note"><strong>小白验收：</strong>重启 Codex 后，让它回答“我有哪些记忆、当前项目路径是什么、遇到错误该怎么排查”。能答对，就说明本地增强生效。</div>
    </div>`;
}

function renderStepExample(example) {
  if (!example) return '';
  return `
    <aside class="step-example">
      <div class="example-label">${example.title}</div>
      <p>${example.text}</p>
      ${example.code ? `<pre class="config-snippet"><code>${example.code}</code></pre>` : ''}
    </aside>
  `;
}

function renderStepScreenshots(screenshots = []) {
  if (!screenshots.length) return '';
  return `
    <div class="step-screenshots">
      ${screenshots.map((shot) => `
        <a class="step-shot" href="${shot.src}" target="_blank" rel="noreferrer">
          <img src="${shot.src}" alt="${shot.title}" loading="lazy">
          <span>${shot.title}</span>
          <p>${shot.note}</p>
        </a>
      `).join('')}
    </div>
  `;
}

function renderStepReferences(index) {
  const items = index === 0
    ? [referenceLinks[0]]
    : index === 1
      ? [referenceLinks[1]]
      : index === 2
        ? [referenceLinks[2]]
        : [];
  if (!items.length) return '';
  return `
    <div class="step-references">
      ${items.map((item) => item.panel
        ? `<article class="relay-card reference-panel"><div><span>官方 API 方案</span><h3>${item.title}</h3></div><p>${item.note}</p><div class="download-actions"><a class="primary link-button" href="${item.url}" target="_blank" rel="noreferrer">打开 DeepSeek API</a></div></article>`
        : item.cta
        ? `<a class="primary link-button" href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>`
        : `<a href="${item.url}" target="_blank" rel="noreferrer"><span>↗</span>${item.title}</a>`).join('')}
    </div>
  `;
}

function renderSteps() {
  $('#steps').innerHTML = guideSteps.map((step, index) => buildStepHtml(step, index, progress)).join('');
}

function renderDownloads() {
  return `
    <div class="inline-downloads">
      ${downloadPackages.map((item) => `
    <article class="download-card ${item.verified ? 'is-verified' : 'is-pending'}">
      <div>
        <span>${item.badge}</span>
        <h3>${item.title}</h3>
        <p>${item.platform}</p>
      </div>
      <p>${item.note}</p>
      <div class="download-actions">
        <a class="primary link-button" href="${item.releaseUrl}" target="_blank" rel="noreferrer">打开下载链接</a>
      </div>
    </article>
      `).join('')}
    </div>
  `;
}

function renderRelayLinks() {
  return `
    <div class="relay-links">
      ${relayLinks.map((item) => `
        <article class="relay-card">
          <div>
            <span>${item.platform}</span>
            <h3>${item.title}</h3>
          </div>
          <p>${item.note}</p>
          <div class="download-actions">
            <a class="primary link-button" href="${item.url}" target="_blank" rel="noreferrer">打开中转站</a>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function bindScrollReveal() {
  const targets = document.querySelectorAll('.step, .rescue, .helper');
  if (!('IntersectionObserver' in window)) return;
  targets.forEach((target) => target.classList.add('reveal-target'));
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-visible');
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  targets.forEach((target) => observer.observe(target));
}

function renderFaqs(results = faqs.slice(0, 3)) {
  $('#faqResults').innerHTML = results.length
    ? results.map((faq) => `
      <article class="faq">
        <span>${guideSteps.find((step) => step.id === faq.step)?.title || '诊断'}</span>
        <h3>${faq.title}</h3>
        <p>${faq.resolution}</p>
      </article>
    `).join('')
    : '<p class="muted">没匹配到。换成“下载失败 / 安装权限 / 连接失败 / 没日志”这类词试试。</p>';
}

function bindEvents() {
  bindLyrics();
  const music = $('#backgroundMusic');
  const musicToggle = $('#musicToggle');
  let musicStarted = false;
  if (music) music.volume = 0.6;
  const startMusic = () => {
    if (!music || musicStarted) return;
    musicStarted = true;
    music.muted = false;
    music.play().then(() => {
      musicToggle?.setAttribute('aria-pressed', 'true');
      if (musicToggle) musicToggle.querySelector('.music-play').textContent = 'Ⅱ';
    }).catch(() => { musicStarted = false; });
  };
  if (music) music.play().catch(() => {});
  document.addEventListener('pointerdown', startMusic, { once: true });
  musicToggle?.addEventListener('click', () => {
    if (!music) return;
    if (music.paused) {
      musicStarted = true;
      music.muted = false;
      music.play();
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.querySelector('.music-play').textContent = 'Ⅱ';
    } else {
      music.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.querySelector('.music-play').textContent = '▶';
    }
  });
  $('#steps').addEventListener('click', (event) => {
    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      const item = localOptimizationSkills[Number(copyButton.dataset.copy)];
      navigator.clipboard?.writeText(item.copyText).then(() => {
        const label = copyButton.textContent;
        copyButton.textContent = '已复制';
        setTimeout(() => { copyButton.textContent = label; }, 1200);
      });
      return;
    }
    const doneId = event.target.dataset.done;
    const helpKey = event.target.dataset.help;
    if (doneId) {
      progress.add(doneId);
      saveProgress();
      renderSteps();
    }
    if (helpKey) {
      $('#search').value = helpKey;
      renderFaqs(findFaqs(helpKey, faqs));
      $('#rescue').scrollIntoView({ behavior: 'smooth' });
    }
  });

  $('#search').addEventListener('input', (event) => {
    renderFaqs(findFaqs(event.target.value, faqs));
  });

  $('#helperBtn').addEventListener('click', async () => {
    const status = $('#helperStatus');
    status.textContent = '正在检查本机助手...';
    try {
      const data = await checkLocalHelper();
      status.textContent = data.ok ? '本机助手在线，可以继续做截图识别。' : '本机助手返回异常，继续查 FAQ。';
    } catch {
      status.innerHTML = `没检测到本机助手。继续查 FAQ，或等真实资料导入后下载检查助手：<a href="${localHelper.downloadUrl}">下载入口</a>`;
    }
  });
}

function bindLyrics() {
  const track = $('#lyricTrack');
  const panel = $('.lyric-panel');
  if (!track || !panel) return;
  track.innerHTML = lyricLines.map((line, index) => `<p data-lyric-index="${index}">${line}</p>`).join('');
  let active = 0;
  let offset = 0;
  let playing = true;
  let dragging = false;
  let dragX = 0;
  let dragY = 0;
  panel.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, input, a')) return;
    event.preventDefault();
    dragging = true;
    dragX = event.clientX - panel.offsetLeft;
    dragY = event.clientY - panel.offsetTop;
    panel.classList.add('is-dragging');
  });
  document.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    panel.style.left = `${Math.max(12, Math.min(rect.width - panel.offsetWidth - 12, event.clientX - rect.left - dragX))}px`;
    panel.style.top = `${Math.max(70, Math.min(rect.height - panel.offsetHeight - 12, event.clientY - rect.top - dragY))}px`;
    panel.style.right = 'auto';
  });
  document.addEventListener('pointerup', () => { dragging = false; panel.classList.remove('is-dragging'); });
  const render = () => {
    track.style.setProperty('--lyric-shift', `${-active * 58 + offset}px`);
    track.querySelectorAll('p').forEach((node, index) => node.classList.toggle('is-active', index === active));
  };
  const step = (delta) => { active = (active + delta + lyricLines.length) % lyricLines.length; render(); };
  const timer = setInterval(() => { if (playing) step(1); }, 3600);
  $('#lyricToggle')?.addEventListener('click', (event) => {
    playing = !playing;
    event.currentTarget.textContent = playing ? '暂停' : '播放';
  });
  $('#lyricPrev')?.addEventListener('click', () => step(-1));
  $('#lyricNext')?.addEventListener('click', () => step(1));
  $('#lyricPosition')?.addEventListener('input', (event) => { offset = Number(event.target.value); render(); });
  panel.addEventListener('mouseenter', () => { playing = false; $('#lyricToggle').textContent = '播放'; });
  panel.addEventListener('mouseleave', () => { playing = true; $('#lyricToggle').textContent = '暂停'; });
  render();
  window.addEventListener('beforeunload', () => clearInterval(timer), { once: true });
}

function drawBallPit() {
  const canvas = $('#heroCanvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: rect.width * .72, y: rect.height * .5, active: false };
  const colors = ['#818cf8', '#a78bfa', '#34d399', '#60a5fa'];
  const balls = Array.from({ length: 34 }, (_, index) => ({
    x: 40 + (index * 83) % Math.max(100, rect.width - 80),
    y: 30 + (index * 47) % Math.max(100, rect.height - 120),
    vx: (index % 2 ? 1 : -1) * .15,
    vy: 0,
    r: 5 + (index % 5) * 2,
    color: colors[index % colors.length],
  }));
  hero.addEventListener('pointermove', (event) => {
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.active = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  hero.addEventListener('wheel', (event) => {
    if (reducedMotion) return;
    const impulse = Math.max(-8, Math.min(12, event.deltaY * .018));
    balls.forEach((ball, index) => { ball.vy += impulse + (index % 3) * .08; });
  }, { passive: true });
  function frame() {
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);
    balls.forEach((ball) => {
      ball.vy += reducedMotion ? 0 : .035;
      ball.vx *= .998;
      ball.vy *= .998;
      if (pointer.active && !reducedMotion) {
        const dx = ball.x - pointer.x;
        const dy = ball.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const reach = 92 + ball.r;
        if (distance < reach) {
          const force = (1 - distance / reach) * .55;
          ball.vx += (dx / distance) * force;
          ball.vy += (dy / distance) * force;
        }
      }
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.x < ball.r || ball.x > w - ball.r) { ball.vx *= -.78; ball.x = Math.max(ball.r, Math.min(w - ball.r, ball.x)); }
      if (ball.y < ball.r || ball.y > h - ball.r) { ball.vy *= -.72; ball.y = Math.max(ball.r, Math.min(h - ball.r, ball.y)); }
    });
    for (let a = 0; a < balls.length; a += 1) {
      for (let b = a + 1; b < balls.length; b += 1) {
        const first = balls[a];
        const second = balls[b];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy) || 1;
        const minDistance = first.r + second.r;
        if (distance >= minDistance) continue;
        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = (minDistance - distance) * .5;
        first.x -= nx * overlap; first.y -= ny * overlap;
        second.x += nx * overlap; second.y += ny * overlap;
        const impulse = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
        if (impulse > 0) continue;
        first.vx += impulse * nx * .22; first.vy += impulse * ny * .22;
        second.vx -= impulse * nx * .22; second.vy -= impulse * ny * .22;
      }
    }
    balls.forEach((ball) => {
      const glow = ctx.createRadialGradient(ball.x - ball.r * .4, ball.y - ball.r * .5, 1, ball.x, ball.y, ball.r * 3.5);
      glow.addColorStop(0, `${ball.color}cc`);
      glow.addColorStop(1, `${ball.color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r * 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ball.color;
      ctx.globalAlpha = .7;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!reducedMotion) requestAnimationFrame(frame);
  }
  frame();
}

function drawHero(canvasSelector = '#heroCanvas', hostSelector = '.hero') {
  const canvas = $(canvasSelector);
  const hero = document.querySelector(hostSelector);
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const ripples = [];
  const pointer = { x: rect.width * 0.72, y: rect.height * 0.5, active: false };
  const dots = [];
  const columns = Math.ceil(rect.width / 34);
  const rows = Math.ceil(rect.height / 34);
  for (let row = 0; row <= rows; row += 1) {
    for (let column = 0; column <= columns; column += 1) {
      dots.push({ x: column * 34, y: row * 34, phase: (column + row) * 0.38 });
    }
  }
  hero.addEventListener('pointermove', (event) => {
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.active = true;
    if (reducedMotion) frame();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  hero.addEventListener('pointerdown', (event) => {
    if (reducedMotion) return;
    const box = canvas.getBoundingClientRect();
    ripples.push({ x: event.clientX - box.left, y: event.clientY - box.top, age: 0, strength: 1 });
  });
  let tick = 0;
  function frame() {
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);
    dots.forEach((dot, index) => {
      const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
      const influence = pointer.active ? Math.max(0, 1 - distance / 260) : 0;
      const wave = Math.sin(tick * 0.035 + dot.phase) * 3;
      const x = dot.x + (pointer.active ? (dot.x - pointer.x) * influence * 0.08 : 0);
      const y = dot.y + wave - influence * 16;
      const radius = 1.2 + influence * 2.1;
      const palette = index % 3 === 0 ? '#818cf8' : index % 3 === 1 ? '#a78bfa' : '#34d399';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = palette;
      ctx.globalAlpha = 0.16 + influence * 0.42;
      ctx.fill();
    });

    {
      if (pointer.active) {
        for (let ring = 0; ring < 4; ring += 1) {
          const radius = 34 + ring * 28 + Math.sin(tick * 0.04 + ring) * 4;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = ring % 2 ? '#8ba3ff' : '#27f5c7';
          ctx.globalAlpha = 0.26 - ring * 0.035;
          ctx.lineWidth = ring === 0 ? 1.8 : 1;
          ctx.stroke();
        }
      }
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.age += 1;
        const radius = ripple.age * 5;
        const alpha = Math.max(0, 0.62 - ripple.age / 120);
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#a78bfa';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2;
        ctx.stroke();
        if (ripple.age > 120) ripples.splice(i, 1);
      }
    }

    ctx.globalAlpha = 1;
    tick += 1;
    if (!reducedMotion) requestAnimationFrame(frame);
  }
  frame();
}

if (typeof document !== 'undefined') {
  renderSteps();
  $('#steps')?.after($('#progressPanel'));
  renderFaqs();
  renderProgress();
  bindEvents();
  bindScrollReveal();
  drawBallPit();
}
