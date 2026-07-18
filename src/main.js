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

function drawHero() {
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
  const ripples = [];
  const pointer = { x: rect.width * 0.72, y: rect.height * 0.5, active: false };
  hero.addEventListener('pointermove', (event) => {
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.active = true;
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
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 44; i += 1) {
      const x = (i * 97 + tick * (0.35 + (i % 5) * 0.08)) % (w + 160) - 80;
      const y = 40 + ((i * 53) % Math.max(80, h - 80));
      ctx.strokeStyle = i % 3 === 0 ? '#27f5c7' : i % 3 === 1 ? '#ffce4a' : '#8ba3ff';
      ctx.globalAlpha = 0.18 + (i % 7) * 0.04;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(w - x * 0.2, h - y * 0.35);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }

    if (!reducedMotion) {
      if (pointer.active) {
        for (let ring = 0; ring < 4; ring += 1) {
          const radius = 26 + ring * 22 + Math.sin(tick * 0.04 + ring) * 3;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = ring % 2 ? '#8ba3ff' : '#27f5c7';
          ctx.globalAlpha = 0.16 - ring * 0.025;
          ctx.lineWidth = ring === 0 ? 1.8 : 1;
          ctx.stroke();
        }
      }
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.age += 1;
        const radius = ripple.age * 5;
        const alpha = Math.max(0, 0.42 - ripple.age / 120);
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
  renderFaqs();
  renderProgress();
  bindEvents();
  bindScrollReveal();
  drawHero();
}
