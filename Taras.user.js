// ==UserScript==
// @name         Auto Lessons
// @namespace    local
// @version      1.0
// @description  0202
// @match        https://talent.shixizhi.huawei.com/*
// @match        https://e.huawei.com/en/talent/*
// @downloadURL  https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @updateURL    https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TICK_MS = 1500;
  const PANEL_ID = 'diag-safe-panel';
  const STYLE_ID = 'diag-safe-style';

  const state = {
    stopped: false,
    minimized: false,
    autoScroll: false,
    autoScrollTimer: null,
    lastSummary: '',
    cycle: 0,
    lastActionKey: '',
    busy: false
  };

  function log(...args) {
    console.log('[AUTO]', ...args);
  }
  function findPhotoSignals() {
  const hits = [];

  for (const { doc, source } of getAllDocs()) {
    const root = getMainContentRoot(doc);
    if (!root) continue;

    const imgs = queryAllMerged([
      '.content-style-html img',
      '.graphic-content img',
      '#innerContent img',
      '.learn-content-main img',
      'img'
    ], root).filter(el => {
      if (!isVisible(el)) return false;

      const src = (el.getAttribute('src') || '').trim();
      if (!src) return false;

      // прибираємо службові дрібні іконки/лого
      const w = el.naturalWidth || el.width || 0;
      const h = el.naturalHeight || el.height || 0;

      if (w > 120 || h > 120) return true;
      if (/mceclip|curriculum|obs\.cn-north-4/i.test(src)) return true;

      return false;
    });

    if (imgs.length) {
      hits.push({
        source,
        count: imgs.length,
        first: imgs[0]
      });
    }
  }

  return hits;
}
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function safeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect?.();
    const style = window.getComputedStyle?.(el);
    if (!rect || !style) return true;
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity || '1') > 0 &&
      (rect.width > 0 || rect.height > 0)
    );
  }

  function tryGetDocFromFrame(frame) {
    try {
      return frame.contentWindow?.document || null;
    } catch {
      return null;
    }
  }

  function getAllDocs() {
    const docs = [{ doc: document, source: 'top' }];
    const frames = [...document.querySelectorAll('iframe')];

    for (let i = 0; i < frames.length; i++) {
      const fdoc = tryGetDocFromFrame(frames[i]);
      if (fdoc) docs.push({ doc: fdoc, source: `iframe[${i}]` });
    }
    return docs;
  }

  function queryFirst(selectors, root = document) {
    for (const selector of selectors) {
      try {
        const el = root.querySelector(selector);
        if (el) return el;
      } catch {}
    }
    return null;
  }

  function queryAllMerged(selectors, root = document) {
    const result = [];
    for (const selector of selectors) {
      try {
        result.push(...root.querySelectorAll(selector));
      } catch {}
    }
    return result;
  }

  function getMainContentRoot(doc = document) {
    return queryFirst([
      '.learn-content-main',
      '.main-outer',
      '.moocClassId.learn-content-main',
      '.moocClassId',
      '.content-style-html',
      '#innerContent',
      '.graphic-content',
      '.ant-layout-content'
    ], doc) || doc.body;
  }

  function findVideo() {
    for (const { doc, source } of getAllDocs()) {
      const video = doc.querySelector('video');
      if (video) return { el: video, source };
    }
    return null;
  }

  function findDocPager() {
    for (const { doc, source } of getAllDocs()) {
      const el = queryFirst([
        'img[src*="toRight3"]',
        '.footer-icon[src*="toRight3"]'
      ], doc);
      if (el) return { el, source };
    }
    return null;
  }

  function isInsideDiagPanel(el) {
    return !!el?.closest?.(`#${PANEL_ID}`);
  }
    function findProgress80Popup() {
  for (const { doc, source } of getAllDocs()) {
    const modal = doc.querySelector('.kltCourse-modal-root, .kltCourse-modal-confirm, .kltCourse-modal-wrap');
    if (!modal || !isVisible(modal)) continue;

    const text = safeText(modal.innerText || modal.textContent || '');
    const looksLike80Popup =
      /learning progress has reached 80%/i.test(text) ||
      /come and evaluate it/i.test(text);

    if (!looksLike80Popup) continue;

    const confirmBtn = [...doc.querySelectorAll('button, .ant-btn, [role="button"]')].find(el => {
      if (!isVisible(el)) return false;
      if (isInsideDiagPanel(el)) return false;

      const t = safeText(el.innerText || el.textContent || '');
      return /^(confirm|ok|yes)$/i.test(t) || /\bconfirm\b/i.test(t);
    });

    return {
      el: modal,
      source,
      text,
      confirmBtn: confirmBtn || null
    };
  }

  return null;
}

async function handleProgress80Popup() {
  const popup = findProgress80Popup();
  if (!popup) return false;

  const key = `popup80:${location.href}`;
  if (state.lastActionKey === key) return true;

  log('Handle POPUP 80%');

  await sleep(1200);

  if (popup.confirmBtn) {
    popup.confirmBtn.click();
    state.lastActionKey = key;
    return true;
  }

  return false;
}

  function findNextButton() {
    for (const { doc, source } of getAllDocs()) {
      const direct = queryFirst([
        'div.next',
        '.next',
        '.next-btn',
        '.switch-btn .next',
        '[class*="next"]'
      ], doc);

      if (direct && isVisible(direct) && !isInsideDiagPanel(direct)) {
        const text = safeText(direct.innerText || direct.textContent || '');
        if (text && (/^(next|continue|finish|submit)$/i.test(text) || /\bnext\b/i.test(text))) {
          return { el: direct, source, text };
        }
      }

      const clickable = queryAllMerged([
        'button',
        'a',
        'div',
        '[role="button"]',
        '.ant-btn'
      ], doc);

      for (const el of clickable) {
        if (isInsideDiagPanel(el)) continue;
        if (!isVisible(el)) continue;

        const text = safeText(el.innerText || el.textContent || '');
        if (!text) continue;

        if (/^(next|continue|finish|submit)$/i.test(text) || /\bnext\b/i.test(text)) {
          return { el, source, text };
        }
      }
    }

    return null;
  }

  function findQuizSignals() {
    const hits = [];

    for (const { doc, source } of getAllDocs()) {
      const root = getMainContentRoot(doc);
      if (!root) continue;

      const rootText = safeText(root.innerText || '').toLowerCase();

      const answerInputs = queryAllMerged([
        'input[type="radio"]',
        'input[type="checkbox"]',
        'textarea',
        'select',
        '.ant-radio-wrapper',
        '.ant-checkbox-wrapper',
        '.ant-radio-group',
        '.ant-checkbox-group',
        '.question-option',
        '.option-item',
        '.quiz-option',
        '.exam-option'
      ], root).filter(isVisible);

      const answerButtons = queryAllMerged([
        'button',
        '.ant-btn',
        '[role="button"]'
      ], root).filter(el => {
        if (!isVisible(el)) return false;
        if (isInsideDiagPanel(el)) return false;

        const t = safeText(el.innerText || el.textContent || '').toLowerCase();
        return (
          t === 'submit' ||
          t === 'check answer' ||
          t === 'start quiz' ||
          t === 'next question' ||
          t === 'finish quiz' ||
          t === 'retake quiz'
        );
      });

      const strongTextHit =
        /\b(single choice|multiple choice|true\/false|check answer|start quiz|passing score|total score|number of tests)\b/i.test(rootText);

      const questionBlocks = queryAllMerged([
        '.quiz-question',
        '.exam-question',
        '.question-item'
      ], root).filter(isVisible);

      const isQuiz =
        answerInputs.length > 0 ||
        answerButtons.length > 0 ||
        strongTextHit ||
        (questionBlocks.length > 0 && answerInputs.length > 0);

      if (isQuiz) hits.push(source);
    }

    return hits;
  }

  function getScrollableCandidates(doc) {
    const selectors = [
      '.learn-content-main',
      '.main-outer',
      '.graphic-content',
      '.content-style-html',
      '#innerContent',
      '.moocClassId',
      '.course-html-content',
      '.ant-layout-content',
      '.content',
      'main'
    ];

    const found = [];
    for (const sel of selectors) {
      try {
        found.push(...doc.querySelectorAll(sel));
      } catch {}
    }

    found.push(doc.scrollingElement || doc.documentElement || doc.body);
    return found.filter(Boolean);
  }

  function pickBestScrollable() {
    let best = null;

    for (const { doc, source } of getAllDocs()) {
      const root = getMainContentRoot(doc) || doc.body;
      if (!root) continue;

      const candidates = [root, ...getScrollableCandidates(doc)];
      const uniqueCandidates = [...new Set(candidates)].filter(Boolean);

      for (const el of uniqueCandidates) {
        if (!el) continue;
        if (isInsideDiagPanel(el)) continue;
        if (el === doc.body || el === doc.documentElement) continue;
        if (!isVisible(el)) continue;

        let scrollHeight = 0;
        let clientHeight = 0;
        let top = 0;
        let textLen = 0;

        try {
          scrollHeight = el.scrollHeight || 0;
          clientHeight = el.clientHeight || 0;
          top = el.scrollTop || 0;
          textLen = safeText(el.innerText || '').length;
        } catch {}

        const overflow = scrollHeight - clientHeight;
        if (overflow < 120) continue;
        if (textLen < 80) continue;

        let score = 0;
        score += overflow;
        score += Math.min(textLen, 3000) * 0.2;

        if (el === root) score += 800;

        const cls = (el.className || '').toString();
        if (/learn-content-main|main-outer|graphic-content|content-style-html|innerContent|moocClassId|course-html-content|ant-layout-content/i.test(cls)) {
          score += 500;
        }

        if (/menu|nav|sidebar|header|footer|dialog|modal/i.test(cls)) {
          score -= 1200;
        }

        if (!best || score > best.score) {
          best = {
            el,
            source,
            overflow,
            top,
            scrollHeight,
            clientHeight,
            textLen,
            score
          };
        }
      }
    }

    return best;
  }

  function classifyLesson() {
  const video = findVideo();
  const docPager = findDocPager();
  const nextBtn = findNextButton();
  const quizHits = findQuizSignals();
  const scrollable = pickBestScrollable();
  const photoHits = findPhotoSignals();

  let contentTextLen = 0;
  for (const { doc } of getAllDocs()) {
    const text = safeText(doc.body?.innerText || '');
    contentTextLen = Math.max(contentTextLen, text.length);
  }

  let type = 'unknown';

  if (video && scrollable) {
    type = 'video+scroll';
  } else if (video) {
    type = 'video-only';
  } else if (docPager) {
    type = 'document/book';
  } else if (quizHits.length) {
    type = 'quiz-like';
  } else if (!video && photoHits.length && nextBtn) {
    type = 'photo';
  } else if (!video && scrollable && scrollable.overflow > 400) {
    type = 'text/scroll';
  } else if (!video && contentTextLen > 300) {
    type = 'text/static';
  } else if (nextBtn && contentTextLen > 20) {
    type = 'simple';
  }

  return {
    type,
    video,
    docPager,
    nextBtn,
    quizHits,
    scrollable,
    photoHits,
    contentTextLen
  };
}
  async function handlePhotoLesson(c) {
  if (c.type !== 'photo') return false;

  const key = `photo:${location.href}`;
  if (state.lastActionKey === key) return true;

  log('Handle PHOTO');

  const sc = c.scrollable?.el;
  if (sc) {
    try {
      sc.scrollTop = sc.scrollHeight;
    } catch {}
    await sleep(7000);
  } else {
    await sleep(2000);
  }

  const nxt = c.nextBtn?.el || findNextButton()?.el;
  if (!nxt) return false;

  nxt.click();
  state.lastActionKey = key;
  return true;
}
  async function handleQuiz(c) {
  if (c.type !== 'quiz-like') return false;

  const key = `quiz:${location.href}`;
  if (state.lastActionKey === key) return true;

  log('Handle QUIZ');

  const nxt = c.nextBtn?.el || findNextButton()?.el;
  if (!nxt) return false;

  await sleep(1500);
  nxt.click();

  state.lastActionKey = key;
  return true;
}
  async function waitForVideoReady(video, maxWait = 12000) {
    const start = Date.now();

    while (Date.now() - start < maxWait) {
      try {
        if (
          video &&
          Number.isFinite(video.duration) &&
          video.duration > 1 &&
          video.readyState >= 1
        ) {
          return true;
        }
      } catch {}

      await sleep(500);
    }

    return false;
  }

  async function completeVideo(video) {
    const ready = await waitForVideoReady(video, 12000);
    if (!ready) {
      log('Video not ready, skip for now');
      return false;
    }

    try {
      video.muted = true;
      video.playbackRate = 16;
    } catch {}

    try {
      await video.play().catch(() => {});
    } catch {}

    try {
      video.currentTime = Math.max(0, video.duration - 0.5);
    } catch (e) {
      log('Seek failed:', e);
      return false;
    }

    try {
      video.dispatchEvent(new Event('timeupdate', { bubbles: true }));
      video.dispatchEvent(new Event('seeking', { bubbles: true }));
      video.dispatchEvent(new Event('seeked', { bubbles: true }));
      video.dispatchEvent(new Event('ended', { bubbles: true }));
    } catch {}

    await sleep(3500);
    return true;
  }

  async function handleVideoOnly(c) {
    const key = `video:${location.href}`;
    if (state.lastActionKey === key) return true;
    if (!c.video?.el || !c.nextBtn?.el) return false;

    log('Handle VIDEO ONLY');

    const ok = await completeVideo(c.video.el);
    if (!ok) return false;

    c.nextBtn.el.click();
    state.lastActionKey = key;
    return true;
  }

  async function handleVideoScroll(c) {
    const key = `video-scroll:${location.href}`;
    if (state.lastActionKey === key) return true;
    if (!c.video?.el || !c.nextBtn?.el) return false;

    log('Handle VIDEO + SCROLL');

    const ok = await completeVideo(c.video.el);
    if (!ok) return false;

    if (c.scrollable?.el) {
      try {
        c.scrollable.el.scrollTop = c.scrollable.el.scrollHeight;
      } catch {}
      await sleep(3000);
    }

    c.nextBtn.el.click();
    state.lastActionKey = key;
    return true;
  }

  async function autoRun() {
  if (state.stopped || state.busy) return;
  state.busy = true;

  try {
    const c = classifyLesson();
    log('TYPE =', c.type);
    // 🔥 POPUP 80% (ставимо ПЕРШИМ)
    if (await handleProgress80Popup()) return;

    if (c.type === 'video+scroll') {
      await handleVideoScroll(c);
      return;
    }

    if (c.type === 'video-only') {
      await handleVideoOnly(c);
      return;
    }

   if (c.type === 'quiz-like') {
  await handleQuiz(c);
  return;
}

   if (c.type === 'photo') {
  await handlePhotoLesson(c);
  return;
}
  } catch (err) {
    console.error('[AUTO] autoRun error:', err);
  } finally {
    state.busy = false;
  }
}

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed;
        top: 16px;
        right: 16px;
        width: 360px;
        z-index: 999999;
        background: rgba(18, 18, 20, 0.96);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.35);
        font: 12px/1.45 Arial, sans-serif;
        overflow: hidden;
      }
      #${PANEL_ID}.minimized .diag-body { display: none; }
      #${PANEL_ID} .diag-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 12px;
        background: rgba(255,255,255,0.06);
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      #${PANEL_ID} .diag-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      #${PANEL_ID} button {
        border: 0;
        border-radius: 8px;
        padding: 6px 8px;
        cursor: pointer;
        font-weight: 700;
      }
      #${PANEL_ID} .diag-body { padding: 10px 12px 12px; }
      #${PANEL_ID} .diag-grid {
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 6px 8px;
        margin-bottom: 10px;
      }
      #${PANEL_ID} .k { color: #b7c0d1; }
      #${PANEL_ID} .v { color: #fff; word-break: break-word; }
    `;
    document.documentElement.appendChild(style);
  }

  function ensurePanel() {
    injectStyles();

    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="diag-head">
        <div><strong>AUTO DIAG</strong></div>
        <div class="diag-actions">
          <button id="diag-stop-btn">STOP</button>
          <button id="diag-min-btn">_</button>
        </div>
      </div>
      <div class="diag-body">
        <div class="diag-grid" id="diag-grid"></div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('#diag-stop-btn')?.addEventListener('click', () => {
      state.stopped = true;
      log('Stopped manually');
    });

    panel.querySelector('#diag-min-btn')?.addEventListener('click', () => {
      state.minimized = !state.minimized;
      panel.classList.toggle('minimized', state.minimized);
    });

    return panel;
  }

  function render() {
    const c = classifyLesson();
    const panel = ensurePanel();
    const grid = panel.querySelector('#diag-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="k">Type</div><div class="v">${c.type}</div>
      <div class="k">Video</div><div class="v">${c.video ? 'yes' : 'no'}</div>
      <div class="k">Next</div><div class="v">${c.nextBtn ? 'yes' : 'no'}</div>
      <div class="k">Scrollable</div><div class="v">${c.scrollable ? 'yes' : 'no'}</div>
      <div class="k">Stopped</div><div class="v">${state.stopped ? 'yes' : 'no'}</div>
      <div class="k">URL</div><div class="v">${location.href}</div>
    `;
  }

  function tick() {
    state.cycle += 1;
    render();
    autoRun();
  }
    window.__AUTO_DIAG__ = {
    classifyLesson,
    getAllDocs,
    findVideo,
    findNextButton,
    findDocPager,
    pickBestScrollable
  };

  function init() {
  ensurePanel();
  render();
  log('Auto diagnostic ready');
  setInterval(tick, TICK_MS);
  tick();
}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
