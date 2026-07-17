import test from 'node:test';
import assert from 'node:assert/strict';
import { findFaqs, checkLocalHelper } from '../src/diagnostics.js';

test('按关键词返回对应步骤 FAQ', () => {
  const results = findFaqs('连接失败', [
    { step: 'connect', keywords: ['连接失败'], title: '连接失败' },
  ]);
  assert.equal(results[0].step, 'connect');
});

test('空搜索返回推荐 FAQ', () => {
  const results = findFaqs('', [
    { step: 'download', keywords: ['下载'], title: '下载失败' },
    { step: 'install', keywords: ['安装'], title: '安装失败' },
  ]);
  assert.equal(results.length, 2);
});

test('本机检查只在函数被调用时请求 localhost', async () => {
  const calls = [];
  const fetcher = async (url) => {
    calls.push(url);
    return { ok: true, json: async () => ({ ok: true }) };
  };

  assert.equal(calls.length, 0);
  const result = await checkLocalHelper(fetcher, AbortSignal.abort());
  assert.equal(result.ok, true);
  assert.equal(calls[0], 'http://127.0.0.1:7331/health');
});
