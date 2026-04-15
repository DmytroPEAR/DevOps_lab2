// ==UserScript==
// @name         Taras
// @namespace    local
// @version      1.0
// @description  Auto video + doc
// @match        https://talent.shixizhi.huawei.com/*

//
// @downloadURL  https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @updateURL    https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js

// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = true;
  const END_OFFSET = 0.3;
  const VIDEO_DELAY = 1200;
  const DOC_DELAY = 1200;
  const NEXT_DELAY = 1600;
  const LOOP_MS = 1500;

  let enabled = true;
  let busy = false;
  let lastKey = null;

  function log(...args) {
    if (DEBUG) console.log('[Huawei Auto]', ...args);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createToggleButton() {
    if (document.getElementById('tm-auto-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'tm-auto-toggle';
    btn.textContent = 'AUTO: ON';

    Object.assign(btn.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 999999,
      padding: '10px 14px',
      background: 'green',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px'
    });

    btn.onclick = () => {
      enabled = !enabled;
      btn.textContent = enabled ? 'AUTO: ON' : 'AUTO: OFF';
      btn.style.background = enabled ? 'green' : 'red';
      log(enabled ? 'AUTO ON' : 'AUTO OFF');
    };

    document.body.appendChild(btn);
  }

  function clickParentNext() {
    try {
      const btn = window.parent.document.querySelector('div.next');
      if (!btn) {
        log('Parent Next button not found');
        return false;
      }
      log('Click parent Next');
      btn.click();
      return true;
    } catch (e) {
      log('Cannot access parent Next:', e);
      return false;
    }
  }

  function clickLocalNext() {
    const btn = document.querySelector('div.next');
    if (!btn) {
      log('Local Next button not found');
      return false;
    }
    log('Click local Next');
    btn.click();
    return true;
  }

  async function handleVideoPage() {
    const video = document.querySelector('video.vjs-tech, video[id*="_html5_api"], video');
    if (!video) return;

    const key =
      'video:' +
      (video.getAttribute('data-key') || video.currentSrc || video.src || video.id || 'unknown');

    if (key === lastKey) return;
    lastKey = key;

    log('Processing VIDEO lesson');

    const run = async () => {
      if (!enabled) return;
      await sleep(VIDEO_DELAY);

      try {
        video.play().catch(() => {});
        video.currentTime = Math.max(0, video.duration - END_OFFSET);
        video.dispatchEvent(new Event('timeupdate', { bubbles: true }));
        video.dispatchEvent(new Event('seeking', { bubbles: true }));
        video.dispatchEvent(new Event('seeked', { bubbles: true }));
        video.dispatchEvent(new Event('ended', { bubbles: true }));
        log(`Video skipped to end: ${video.currentTime}/${video.duration}`);
      } catch (e) {
        log('Video skip error:', e);
        return;
      }

      await sleep(NEXT_DELAY);
      clickLocalNext();
    };

    if (video.readyState >= 1 && video.duration > 0) {
      run();
    } else {
      video.addEventListener('loadedmetadata', run, { once: true });
    }
  }

  function getCurrentPage() {
    const el = document.querySelector('i.clickStyle');
    const n = Number((el?.textContent || '').trim());
    return Number.isFinite(n) ? n : null;
  }

  function getTotalPages() {
    const spans = [...document.querySelectorAll('span')];
    for (const s of spans) {
      const txt = (s.innerText || s.textContent || '').replace(/\s+/g, ' ').trim();
      const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) {
        const total = Number(m[2]);
        if (Number.isFinite(total)) return total;
      }
    }
    return null;
  }

  function getDocNextBtn() {
    return document.querySelector('img.footer-icon[src*="toRight."]');
  }

  function getDocLastBtn() {
    return document.querySelector('img.footer-icon[src*="toRight3."]');
  }
  function handleHuaweiPopup() {
  const modal = document.querySelector('.kltCourse-modal-content');

  if (!modal) return false;

  const cancelBtn = [...modal.querySelectorAll('button')]
    .find(btn => btn.innerText.trim().toLowerCase() === 'cancels');

  if (cancelBtn) {
    console.log('[Huawei Auto] Click CANCEL (80% popup)');
    cancelBtn.click();
    return true;
  }

  return false;
}

  async function handleDocPage() {
    const pagerExists = !!document.querySelector('#pageNumInput, i.clickStyle, img.footer-icon');
    if (!pagerExists) return;

    const current = getCurrentPage();
    const total = getTotalPages();
    const key = `doc:${location.href}|${current}|${total}`;

    if (key === lastKey) return;
    lastKey = key;

    log('Processing DOCUMENT lesson', { current, total });

    await sleep(DOC_DELAY);

    const lastBtn = getDocLastBtn();
    if (lastBtn) {
      log('Click doc LAST PAGE button');
      lastBtn.click();
    } else {
      const nextBtn = getDocNextBtn();
      if (nextBtn && current && total) {
        log('Fallback: clicking NEXT PAGE repeatedly');
        for (let i = current; i < total; i++) {
          if (!enabled) return;
          nextBtn.click();
          await sleep(250);
        }
      } else {
        log('No document page buttons found');
        return;
      }
    }

    await sleep(NEXT_DELAY);
    clickParentNext();
  }

  async function process() {
    if (!enabled || busy) return;
    busy = true;

    try {
      const path = location.pathname;

      if (path.includes('/application-learn')) {
        await handleVideoPage();
        return;
      }

      if (path.includes('/edm3client/static/index.html')) {
        await handleDocPage();
        return;
      }
    } finally {
      busy = false;
    }
  }

  function init() {
    log('Script started on:', location.href);
    createToggleButton();

    setInterval(() => {
      handleHuaweiPopup(); 
      process();
    }, LOOP_MS);

    const observer = new MutationObserver(() => {
      process();
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });

    process();
  }

  init();
})();
