import {
  guideSteps,
  downloadPackages,
  relayLinks,
  referenceLinks,
  localOptimizationSkills,
} from './content.js';
const $ = (selector) => document.querySelector(selector);
let activeStepIndex = 0;

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


export function buildStepHtml(step, index) {
  return `
    <article class="step" id="${step.id}">
      <div class="step-index">${String(index + 1).padStart(2, '0')}</div>
      <div>
        <h3>${step.title}</h3>
        <p>${step.action}</p>
        <ul>${step.checklist.map((item) => `<li>${item}</li>`).join('')}</ul>
        ${renderStepExample(step.example)}
        ${renderStepScreenshots(step.screenshots)}
        ${index === 0 ? renderDownloads() : ''}
        ${index === 1 ? renderRelayLinks() : ''}
        ${renderStepReferences(index)}
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
        ? `<article class="relay-card reference-panel"><div><span>官方 API 方案</span><h3>${item.title}</h3></div><p>${item.note}</p><div class="download-actions"><a class="primary link-button" href="${item.url}" target="_blank" rel="noreferrer">打开 DeepSeek 探秘</a></div></article>`
        : item.cta
        ? `<a class="primary link-button" href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>`
        : `<a href="${item.url}" target="_blank" rel="noreferrer"><span>↗</span>${item.title}</a>`).join('')}
    </div>
  `;
}

function renderSteps() {
  const steps = $('#steps');
  if (!steps) return;
  const current = guideSteps[activeStepIndex];
  const next = guideSteps[activeStepIndex + 1];
  steps.innerHTML = `
    <div class="tutorial-shell">
      <div class="tutorial-heading">
        <div>
          <p class="eyebrow">GUIDED SETUP · 逐级进入</p>
          <h2>跟着当前这一步完成，再进入下一步。</h2>
        </div>
        <span class="tutorial-count">${String(activeStepIndex + 1).padStart(2, '0')} / ${guideSteps.length}</span>
      </div>
      <div class="tutorial-stepper" role="tablist" aria-label="教程步骤">
        ${guideSteps.map((step, index) => `
          <button class="tutorial-tab ${index === activeStepIndex ? 'is-active' : ''}" type="button" role="tab" aria-selected="${index === activeStepIndex}" data-step-index="${index}">
            <span>${String(index + 1).padStart(2, '0')}</span><strong>${step.title}</strong>
          </button>
        `).join('')}
      </div>
      <div class="tutorial-stage">${buildStepHtml(current, activeStepIndex)}</div>
      <div class="tutorial-controls">
        <button class="ghost tutorial-prev" type="button" data-step-prev ${activeStepIndex === 0 ? 'disabled' : ''}>上一步</button>
        ${next
          ? `<button class="primary tutorial-next" type="button" data-step-next>下一步：${next.title}</button>`
          : '<a class="primary link-button tutorial-next" href="#rescue">完成配置，去看视频 ↗</a>'}
      </div>
    </div>`;
}

function setActiveStep(index, { scroll = false } = {}) {
  activeStepIndex = Math.max(0, Math.min(index, guideSteps.length - 1));
  renderSteps();
  if (scroll) $('#steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDownloads() {
  return `
    <div class="inline-downloads">
      ${downloadPackages.map((item) => `
    <article class="download-card download-card--${item.id} ${item.verified ? 'is-verified' : 'is-pending'}">
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

function renderToolkit() {
  if (document.querySelector('.toolkit')) return;
  const steps = $('#steps');
  if (!steps) return;
  const section = document.createElement('section');
  section.className = 'toolkit';
  section.id = 'toolkit';
  section.setAttribute('aria-labelledby', 'toolkit-title');
  section.innerHTML = `
    <div class="section-title">
      <p class="eyebrow">实用工具栏 · OPTIONAL TOOLS</p>
      <h2 id="toolkit-title">需要时再打开这些工具</h2>
      <p>工具不参与四步主流程，按需使用；下载前请确认来源、系统版本和隐私条款。</p>
    </div>
    <div class="toolkit-grid">
      <article class="tool-card tool-card--qilin">
        <span class="tool-badge">网络工具 · 第三方推荐</span>
        <h3>火麒麟梯子</h3>
        <p>支持同账号 Windows、Mac、Android 共享；页面当前标注约 19 元/月，价格与服务以官方页面为准。</p>
        <a class="tool-link" href="https://www.okyrin.top/#/register?code=iZO9SN00" target="_blank" rel="noreferrer">打开火麒麟入口 ↗</a>
      </article>
      <article class="tool-card tool-card--workbuddy">
        <span class="tool-badge">AI 工作台 · 官方</span>
        <h3>WorkBuddy</h3>
        <p>WorkBuddy 官方下载与产品入口，按页面提示选择适合你的版本。</p>
        <a class="tool-link" href="https://www.workbuddy.ai/" target="_blank" rel="noreferrer">打开官方下载 ↗</a>
      </article>
      <article class="tool-card tool-card--uninstall">
        <span class="tool-badge">维护工具 · Windows</span>
        <h3>Codex 卸载工具</h3>
        <p>需要清理旧版本、重新安装或排查残留时使用。下载后解压，再按工具说明操作。</p>
        <a class="tool-link" href="assets/codex-uninstall-tool.zip" download>下载卸载工具 ↗</a>
      </article>
      <article class="tool-card tool-card--gpt56">
        <span class="tool-badge">效率增强 · 合规 Skill</span>
        <h3>GPT‑5.6 模型破限 Skill</h3>
        <p>按任务类型选择 Sol、Terra、Luna 配置，侧重稳定性与效率；不改变平台规则。</p>
        <a class="tool-link" href="https://github.com/AlexAI-MCP/GPT5.6-SOLTELU-Model-Inverter" target="_blank" rel="noreferrer">打开 Skill 仓库 ↗</a>
      </article>
    </div>
    <aside class="tool-disclosure">
      <strong>公开声明</strong>
      <p>本站仅做 AI 科技知识分享、软件测评与工具推荐，不售卖软件，也不对任何第三方服务作担保。</p>
      <p>请大家自重，不要使用推荐链接从事违反社会公序良俗、危害社会稳定或违反治安管理的行为。</p>
      <p>再次叠甲：使用这些链接的个人行为，与主播及共同阅读文档的各位科技好友无关。</p>
      <p class="tool-mantra">请与我在此默念三遍：中国万岁！中国共产党万岁！为了社会共产主义事业奋斗终身！</p>
    </aside>`;
  steps.after(section);
}

function bindCommunityQr() {
  const image = document.querySelector('.community-card .community-qr');
  if (!image || image.closest('details')) return;
  const reveal = document.createElement('details');
  reveal.className = 'qr-reveal';
  const summary = document.createElement('summary');
  const label = document.createElement('span');
  label.textContent = '查看入群二维码';
  summary.append(label);
  const expanded = document.createElement('div');
  expanded.className = 'qr-expanded';
  const large = image.cloneNode();
  large.alt = '加入 Codex 部署交流群二维码';
  const note = document.createElement('small');
  note.textContent = '用 QQ 扫码加入交流群';
  expanded.append(large, note);
  reveal.append(summary, expanded);
  image.replaceWith(reveal);
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
  const targets = document.querySelectorAll('.step, .rescue, .case-studies');
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

function bindEvents() {
  bindLyrics();
  bindCommunityQr();
  $('#steps').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-step-index]');
    if (tab) {
      setActiveStep(Number(tab.dataset.stepIndex));
      return;
    }
    if (event.target.closest('[data-step-prev]')) {
      setActiveStep(activeStepIndex - 1);
      return;
    }
    if (event.target.closest('[data-step-next]')) {
      setActiveStep(activeStepIndex + 1, { scroll: true });
      return;
    }
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
  });

  document.addEventListener('click', (event) => {
    const start = event.target.closest('[data-start-tutorial]');
    if (!start) return;
    activeStepIndex = 0;
    renderSteps();
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
  let activePointerId = null;
  const hero = document.querySelector('.hero');
  const dragHandle = panel.querySelector('.lyric-head');
  (dragHandle || panel).addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.target.closest('button, input, a, .lyric-track')) return;
    event.preventDefault();
    const rect = panel.getBoundingClientRect();
    const heroRect = hero?.getBoundingClientRect();
    if (!heroRect || window.matchMedia?.('(max-width: 760px)').matches) return;
    dragging = true;
    activePointerId = event.pointerId;
    dragX = event.clientX - rect.left;
    dragY = event.clientY - rect.top;
    panel.style.position = 'absolute';
    panel.style.left = `${rect.left - heroRect.left}px`;
    panel.style.top = `${rect.top - heroRect.top}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.classList.add('is-dragging');
    (dragHandle || panel).setPointerCapture?.(event.pointerId);
  });
  document.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== activePointerId) return;
    const bounds = hero?.getBoundingClientRect();
    if (!bounds) return;
    const maxLeft = Math.max(12, bounds.width - panel.offsetWidth - 12);
    const maxTop = Math.max(92, bounds.height - panel.offsetHeight - 12);
    panel.style.left = `${Math.max(12, Math.min(maxLeft, event.clientX - bounds.left - dragX))}px`;
    panel.style.top = `${Math.max(92, Math.min(maxTop, event.clientY - bounds.top - dragY))}px`;
  });
  const stopDragging = (event) => {
    if (!dragging || (event.pointerId != null && event.pointerId !== activePointerId)) return;
    dragging = false;
    activePointerId = null;
    panel.classList.remove('is-dragging');
  };
  document.addEventListener('pointerup', stopDragging);
  document.addEventListener('pointercancel', stopDragging);
  const render = () => {
    track.style.setProperty('--lyric-shift', `${-active * 58 + offset}px`);
    track.querySelectorAll('p').forEach((node, index) => node.classList.toggle('is-active', index === active));
  };
  track.addEventListener('click', (event) => {
    const line = event.target.closest('[data-lyric-index]');
    if (!line) return;
    active = Number(line.dataset.lyricIndex);
    playing = false;
    $('#lyricToggle').textContent = '播放';
    render();
  });
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

if (typeof document !== 'undefined') {
  const creatorNote = document.createElement('p');
  creatorNote.className = 'creator-note';
  creatorNote.textContent = '当然了，你现在看到的这个网站也是 Codex 纯一体生成的，没写一行代码，我相信你也可以。';
  document.querySelector('.hero-copy')?.append(creatorNote);
  renderSteps();
  renderToolkit();
  renderLocalOptimizationSection();
  bindEvents();
  bindScrollReveal();
}

function renderLocalOptimizationSection() {
  if (document.querySelector('#local-boost')) return;
  const steps = $('#steps');
  if (!steps) return;
  const section = document.createElement('section');
  section.id = 'local-boost';
  section.className = 'local-optimization-section';
  section.setAttribute('aria-labelledby', 'local-boost-title');
  section.innerHTML = renderLocalOptimization();
  section.querySelector('.optimization-head h4')?.setAttribute('id', 'local-boost-title');
  steps.after(section);
}
