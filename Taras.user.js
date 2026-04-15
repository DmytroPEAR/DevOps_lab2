// ==UserScript==
// @name         Taras
// @namespace    local
// @version      1.4
// @description  Huawei auto: video + mixed lessons + docs + quiz skip + popup cancel
// @match        https://talent.shixizhi.huawei.com/*
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

  function getNextBtn() {
    return document.querySelector('.switch-btn .next, div.next');
  }

  function clickNext() {
    const btn = getNextBtn();
    if (!btn) {
      log('Next button not found');
      return false;
    }

    log('Click Next');
    btn.click();
    return true;
  }

  function clickParentNext() {
    try {
      const btn = window.parent.document.querySelector('.switch-btn .next, div.next');
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

  function handleHuaweiPopup() {
    const modal = document.querySelector('.kltCourse-modal-content');
    if (!modal) return false;

    const cancelBtn = [...modal.querySelectorAll('button')]
      .find(btn => (btn.innerText || '').trim().toLowerCase() === 'cancels');

    if (cancelBtn) {
      log('Click CANCEL (80% popup)');
      cancelBtn.click();
      return true;
    }

    return false;
  }

  function isQuizPage() {
    const startBtn = [...document.querySelectorAll('button, div, span, a')]
      .find(el => (el.innerText || '').trim().toLowerCase() === 'start quiz');

    const pageTitle = [...document.querySelectorAll('h1, h2, h3, div, span')]
      .some(el => (el.innerText || '').trim().toLowerCase() === 'quiz');

    return !!(startBtn && pageTitle);
  }

  function processQuiz() {
    if (!isQuizPage()) return false;

    const key = 'quiz:' + location.href;
    if (lastKey === key) return true;
    lastKey = key;

    log('Quiz detected -> skipping');
    setTimeout(() => {
      clickNext();
    }, 1000);

    return true;
  }

  function getPureVideoElement() {
    return document.querySelector('.courseware-wrapper.mult-video video, video.vjs-tech, video[id*="_html5_api"], video');
  }

  function hasMixedLesson() {
    const hasVideo = !!document.querySelector('.courseware-wrapper.mult-video video');
    const hasGraphic = !!document.querySelector('.courseware-wrapper.mult-graphic');
    return hasVideo && hasGraphic;
  }

  function finishAllVideos() {
    const videos = [...document.querySelectorAll('.courseware-wrapper.mult-video video, video')];
    if (!videos.length) return true;

    let allDone = true;

    for (const v of videos) {
      try {
        v.play?.().catch?.(() => {});

        if (Number.isFinite(v.duration) && v.duration > 1) {
          if (v.currentTime < v.duration - 0.5) {
            v.currentTime = Math.max(0, v.duration - END_OFFSET);
            v.dispatchEvent(new Event('timeupdate', { bubbles: true }));
            v.dispatchEvent(new Event('seeking', { bubbles: true }));
            v.dispatchEvent(new Event('seeked', { bubbles: true }));
            v.dispatchEvent(new Event('ended', { bubbles: true }));
            allDone = false;
          }
        } else {
          allDone = false;
        }
      } catch (e) {
        allDone = false;
      }
    }

    return allDone;
  }

  function getMixedScrollContainer() {
    return (
      document.querySelector('#innerContent.learn-content-main-overflow') ||
      document.querySelector('.courseware-wrapper.mult-graphic .graphic-content') ||
      document.querySelector('.courseware-wrapper.mult-graphic .content-style-html')
    );
  }

  function scrollLessonToBottom() {
    const container = getMixedScrollContainer();
    if (!container) {
      log('No mixed scroll container found');
      return false;
    }

    const before = container.scrollTop || 0;
    container.scrollTop = container.scrollHeight;
    const after = container.scrollTop || 0;

    log('Scroll mixed lesson:', before, '->', after);
    return after > before || (container.scrollHeight - container.clientHeight <= 5);
  }

  function isScrolledToBottom() {
    const container = getMixedScrollContainer();
    if (!container) return false;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const done = maxScroll <= 5 || container.scrollTop >= maxScroll - 10;

    log('Mixed bottom check:', {
      scrollTop: container.scrollTop,
      maxScroll,
      done
    });

    return done;
  }

  function processMixedLesson() {
    if (!hasMixedLesson()) return false;

    const keyBase = 'mixed:' + location.href;

    const videoDone = finishAllVideos();
    if (!videoDone) {
      log('Processing mixed VIDEO part');
      return true;
    }

    const atBottom = isScrolledToBottom();
    if (!atBottom) {
      log('Processing mixed TEXT part');
      scrollLessonToBottom();
      return true;
    }

    if (lastKey === keyBase) return true;
    lastKey = keyBase;

    log('Mixed lesson complete -> Next');
    setTimeout(() => {
      clickNext();
    }, 800);

    return true;
  }

  async function handleVideoPage() {
    if (hasMixedLesson()) return;

    const video = getPureVideoElement();
    if (!video) return;

    const key =
      'video:' +
      (video.getAttribute('data-key') || video.currentSrc || video.src || video.id || 'unknown');

    if (lastKey === key) return;
    lastKey = key;

    log('Processing VIDEO lesson');

    const run = async () => {
      if (!enabled) return;
      await sleep(VIDEO_DELAY);

      try {
        video.play?.().catch?.(() => {});
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
      clickNext();
    };

    if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
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
    const text = document.body.innerText || '';
    const m = text.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return null;

    const total = Number(m[2]);
    return Number.isFinite(total) ? total : null;
  }

  function getDocNextBtn() {
    return document.querySelector('img.footer-icon[src*="toRight."]');
  }

  function getDocLastBtn() {
    return document.querySelector('img.footer-icon[src*="toRight3."]');
  }

  async function handleDocPage() {
    const pagerExists = !!document.querySelector('#pageNumInput, i.clickStyle, img.footer-icon');
    if (!pagerExists) return;

    const current = getCurrentPage();
    const total = getTotalPages();
    const key = `doc:${location.href}|${current}|${total}`;

    if (lastKey === key) return;
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

      handleHuaweiPopup();

      if (path.includes('/application-learn')) {
        if (processQuiz()) return;
        if (processMixedLesson()) return;
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
