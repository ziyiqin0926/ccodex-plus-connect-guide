# Static UI Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 删除历史视觉残留并以单一深色样式层收敛页面，同时保留当前教程与资源功能。

**Architecture:** `index.html` 只保留内容骨架；`src/main.js` 只保留教程、工具栏、二维码、寄语窗和轻量显现；`assets/styles.css` 重写为一套深色响应式规则。未引用的背景、音频和诊断模块一并删除。

**Tech Stack:** 原生 HTML、CSS、ES Modules、Node.js 内置测试。

---

### Task 1: 建立死代码防回归测试

**Files:**
- Modify: `tests/content.test.mjs`
- Delete: `tests/diagnostics.test.mjs`
- Delete: `src/diagnostics.js`

- [ ] **Step 1: 新增失败测试**

    test('静态版不保留废弃视觉引擎与主题代码', () => {
      const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
      const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
      const styles = fs.readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
      for (const term of ['heroCanvas', 'fluidCanvas', 'drawBallPit', 'drawHero', 'ballPhysics', 'data-theme="light"']) {
        assert.doesNotMatch(`${html}\n${source}\n${styles}`, new RegExp(term));
      }
    });

- [ ] **Step 2: 确认它失败**

    npm.cmd test

预期：因画布、物理或亮色主题残留失败。

- [ ] **Step 3: 删除过期诊断模块与专属测试**

    Remove-Item -LiteralPath src/diagnostics.js, tests/diagnostics.test.mjs

- [ ] **Step 4: 提交测试边界**

    git add tests/content.test.mjs src/diagnostics.js tests/diagnostics.test.mjs
    git commit -m "test: cover static UI cleanup"

### Task 2: 精简脚本职责

**Files:**
- Modify: `src/main.js:1-end`
- Test: `tests/content.test.mjs`

- [ ] **Step 1: 删除所有画布引擎**

删除 `ballPhysics`、`drawBallPit`、`drawHero` 及它们的 `pointermove`、`pointerdown`、`wheel`、`requestAnimationFrame` 逻辑。入口仅调用：

    renderSteps();
    renderToolkit();
    renderLocalOptimizationSection();
    bindEvents();
    bindScrollReveal();

- [ ] **Step 2: 保留安全的寄语窗拖动范围**

    const dragHandle = panel.querySelector('.lyric-head');
    dragHandle.addEventListener('pointerdown', startDragging);
    const maxLeft = Math.max(12, heroRect.width - panel.offsetWidth - 12);
    const maxTop = Math.max(92, heroRect.height - panel.offsetHeight - 12);

拖动仅允许从标题栏开始，按钮与滑块不会触发拖动；松开鼠标即固定位置。

- [ ] **Step 3: 运行验证并提交**

    node --check src/main.js
    npm.cmd test
    git add src/main.js tests/content.test.mjs
    git commit -m "refactor: remove retired visual engines"

### Task 3: 重建统一深色布局样式层

**Files:**
- Modify: `assets/styles.css:1-end`
- Modify: `index.html:7,131`
- Test: `tests/content.test.mjs`

- [ ] **Step 1: 使用稳定令牌和单一容器规则替换叠加样式**

    :root { --bg:#0d1320; --panel:#121c2c; --line:#263650; --text:#eff5ff; --muted:#aebbd0; --accent:#8c86ff; --page-width:1120px; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); }
    main > section, .local-optimization-section { width:min(var(--page-width), calc(100% - 40px)); margin-inline:auto; }

- [ ] **Step 2: 统一首屏、教程和模块节奏**

    .hero { min-height:680px; border-bottom:1px solid var(--line); }
    .hero-copy { width:min(650px, calc(100% - 40px)); padding:150px 0 72px; }
    .lyric-panel { position:absolute; top:150px; right:max(24px, calc((100vw - var(--page-width))/2)); width:min(360px, 32vw); }
    main > section { padding-block:72px; border-bottom:1px solid var(--line); }
    .step { display:grid; grid-template-columns:72px minmax(0,1fr); gap:24px; padding:32px 0; border-bottom:1px solid var(--line); }

下载、工具、视频、社群、案例才使用卡片；按钮只保留短促按压反馈，不设循环动效。

- [ ] **Step 3: 添加移动端单列规则**

    @media (max-width:760px) {
      .hero { min-height:auto; }
      .hero-copy { padding:120px 0 36px; }
      .lyric-panel { position:relative; inset:auto; width:auto; margin:0 20px 36px; }
      .tutorial-stepper, .rescue-grid, .toolkit-grid, .case-grid { grid-template-columns:1fr; }
      .step { grid-template-columns:1fr; gap:12px; }
    }

- [ ] **Step 4: 更新缓存版本，测试并提交**

    node --check src/main.js
    npm.cmd test
    git diff --check
    git add assets/styles.css index.html tests/content.test.mjs
    git commit -m "style: unify static dark layout"

缓存版本更新为 `?v=20260824-static-ui-v27`。

### Task 4: 删除未引用资源并发布验证

**Files:**
- Delete: `assets/fluid-background.js`
- Delete: `assets/fluid-background-LICENSE.txt`
- Delete: `assets/mixkit-owies-ukulele-1072.mp3`

- [ ] **Step 1: 确认资源未被引用**

    Get-ChildItem -Recurse -File -Exclude 'fluid-background.js','fluid-background-LICENSE.txt','mixkit-owies-ukulele-1072.mp3' | Select-String -Pattern 'fluid-background|mixkit-owies' -SimpleMatch

预期：无输出。

- [ ] **Step 2: 删除未引用资源**

    Remove-Item -LiteralPath assets/fluid-background.js, assets/fluid-background-LICENSE.txt, assets/mixkit-owies-ukulele-1072.mp3

- [ ] **Step 3: 完整验证、安全审查与推送**

    node --check src/main.js
    npm.cmd test
    git diff --check
    codex-security scan --path . --output D:\CodexHome\security-results --fail-on-severity high
    git add -A
    git commit -m "chore: remove retired static assets"
    git push origin main

预期：前三项通过。安全工具如仍因 Windows GBK 解码中断，记录其为未完成扫描，不宣称通过。

## 自检

- 教程、工具栏、寄语窗、视频、社群、案例、下载和 GitHub 均保留。
- 物理小球、流体、水波、烟花、音乐、亮色主题和无引用资源均被移除。
- 计划不存在待定实现或未定义函数。
