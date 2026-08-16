import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { guideSteps, faqs, downloadPackages, relayLinks, referenceLinks, docHighlights, trainingVideos, communityGroup } from '../src/content.js';

test('四步教程均有标题、动作和卡住入口', () => {
  assert.equal(guideSteps.length, 4);
  for (const step of guideSteps) {
    assert.ok(step.id);
    assert.ok(step.title);
    assert.ok(step.action);
    assert.ok(step.helpKey);
  }
});

test('每个教程步骤至少有一个 FAQ', () => {
  for (const step of guideSteps) {
    assert.ok(faqs.some((faq) => faq.step === step.id));
  }
});

test('公开版不伪造真实安装链接', () => {
  for (const step of guideSteps) {
    assert.equal(step.verified, false);
    assert.match(step.downloadUrl, /^#/);
  }
});

test('第一步下载区包含用户提供的 Codex 和 Codex++ 链接', () => {
  assert.deepEqual(downloadPackages.map((item) => item.id), ['codex-installer', 'codex-plus-plus']);
  assert.equal(downloadPackages[0].releaseUrl, 'https://apps.microsoft.com/detail/9PLM9XGG6VKS?hl=neutral&gl=CN&ocid=pdpshare');
  assert.equal(downloadPackages[1].releaseUrl, 'https://github.com/BigPizzaV3/CodexPlusPlus/releases');
  for (const item of downloadPackages) {
    assert.ok(item.title);
    assert.match(item.releaseUrl, /^https:\/\//);
  }
});

test('第一步保留下载入口，不再显示完成标记', async () => {
  const { buildStepHtml } = await import('../src/main.js');
  const html = buildStepHtml(guideSteps[0], 0, new Set());
  assert.match(html, /inline-downloads/);
  assert.doesNotMatch(html, /data-done|标记完成|我卡在这里/);
});

test('第二步包含中转站注册与令牌入口', async () => {
  const { buildStepHtml } = await import('../src/main.js');
  const html = buildStepHtml(guideSteps[1], 1, new Set());
  assert.equal(relayLinks[0].url, 'https://ergouzi.life/sign-up?aff=nkEx');
  assert.match(html, /relay-links/);
  assert.doesNotMatch(html, /data-done/);
});

test('文档要点已进入四步内容和配置示例', async () => {
  const { buildStepHtml } = await import('../src/main.js');
  assert.equal(docHighlights.length, 3);
  assert.ok(guideSteps.every((step) => step.example && step.example.title));
  assert.ok(guideSteps[2].title.includes('供应商'));
  assert.ok(guideSteps[2].example.code.includes('HTTP 200'));
  assert.ok(guideSteps[2].checklist.some((item) => item.includes('诊断供应商')));
  assert.deepEqual(guideSteps[2].screenshots.map((item) => item.src), [
    'assets/provider-config.png',
    'assets/provider-test.png',
  ]);
  assert.ok(buildStepHtml(guideSteps[2], 2, new Set()).includes('config-snippet'));
  assert.ok(buildStepHtml(guideSteps[2], 2, new Set()).includes('step-screenshots'));
  assert.ok(referenceLinks.some((item) => item.url.includes('rg-adguard')));
});

test('截图区替换为教学视频和交流群二维码', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.deepEqual(trainingVideos.map((item) => item.url), [
    'https://v.douyin.com/FyDjdMS0p8c/',
    'https://v.douyin.com/sPl8uhD826I/',
  ]);
  assert.match(communityGroup.qrImage, /assets\/community-qr\.jpg$/);
  assert.match(html, /training-video/);
  assert.match(html, /community-qr/);
  assert.match(html, /community-card--hub/);
  assert.doesNotMatch(html, /feedback-card/);
  assert.doesNotMatch(html, /id="shot"/);
  assert.doesNotMatch(html, /提示词武器库/);
  assert.doesNotMatch(html, /免费发布/);
  assert.doesNotMatch(html, /发布到 GitHub Pages/);
  assert.doesNotMatch(html, /faq-search|常见问题答疑|class="helper"|一键检查助手/);
});

test('导航按教程与辅助内容分类，教程采用逐级进入', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /class="nav-links"/);
  for (const target of ['#top', '#steps', '#rescue', '#community', '#toolkit', '#case-studies', '#github']) {
    assert.match(html, new RegExp(`href="${target}"`));
  }
  assert.match(html, /data-start-tutorial/);
});

test('工具栏提供卸载工具下载且移除中转站实测卡片', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.equal(fs.existsSync(new URL('../assets/codex-uninstall-tool.zip', import.meta.url)), true);
  assert.match(source, /codex-uninstall-tool\.zip/);
  assert.doesNotMatch(source, /tool-card--dabowan|实时中转站靠谱度实测/);
  assert.doesNotMatch(html, /dabowan\.com/);
});

test('首页小球采用全首屏漂浮物理，不会持续沉到底部', async () => {
  const { ballPhysics } = await import('../src/main.js');
  assert.ok(ballPhysics.gravity < 0.02);
  assert.ok(ballPhysics.floorBounce >= 0.92);
  assert.ok(ballPhysics.initialVelocity >= 1.5);
});
