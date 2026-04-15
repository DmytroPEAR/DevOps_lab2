// ==UserScript==
// @name         Taras
// @namespace    local
// @version      1.3
// @description  Auto video + mixed lessons + docs + quiz skip
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

  function getNextBtn() {
    return document.querySelector('.switch-btn .next, div.next');
  }

  function clickNext() {
    const nextBtn = getNextBtn();
    if (!nextBtn) {
      log('Next button not found');
      return false;
    }

    log('Click Next');
    nextBtn.click();
    return true;
  }

  function hasVideoBlock() {
    return !!document.querySelector('.courseware-wrapper.mult-video video, video');
  }

  function hasGraphicBlock() {
    return !!document.querySelector(
      '.courseware-wrapper.mult-graphic, .graphic-content, .content-style-html, #innerContent'
    );
  }

  function finishAllVideos() {
    const videos = [...document.querySelectorAll('.courseware-wrapper.mult-video video, video')];
    if (!videos.length) return true;

    let allDone = true;

    for (const v of videos) {
      try {
        v.play?.();

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

  function scrollLessonToBottom() {
    const inner = document.querySelector('#innerContent');
    if (inner) {
      const before = inner.scrollTop;
      inner.scrollTop = inner.scrollHeight;
      const after = inner.scrollTop;
      log('Scroll #innerContent:', before, '->', after);
      return after > before;
    }

    const graphicScrollable = document.querySelector('.graphic-content, .content-style-html');
    if (graphicScrollable) {
      const before = graphicScrollable.scrollTop || 0;
      graphicScrollable.scrollTop = graphicScrollable.scrollHeight;
      const after = graphicScrollable.scrollTop || 0;
      log('Scroll graphic block:', before, '->', after);
      return after > before;
    }

    window.scrollTo(0, document.documentElement.scrollHeight);
    log('Fallback scroll window');
    return true;
  }

  function isScrolledToBottom() {
    const inner = document.querySelector('#innerContent');
    if (inner) {
      const maxScroll = inner.scrollHeight - inner.clientHeight;
      const done = maxScroll <= 5 || inner.scrollTop >= maxScroll - 10;
      log('#innerContent bottom check:', {
        scrollTop: inner.scrollTop,
        maxScroll,
        done
      });
      return done;
    }

    const graphicScrollable = document.querySelector('.graphic-content, .content-style-html');
    if (graphicScrollable) {
      const maxScroll = graphicScrollable.scrollHeight - graphicScrollable.clientHeight;
      const done = maxScroll <= 5 || graphicScrollable.scrollTop >= maxScroll - 10;
      log('graphic block bottom check:', {
        scrollTop: graphicScrollable.scrollTop,
        maxScroll,
        done
      });
      return done;
    }

    return false;
  }

  function processMixedLesson() {
    const hasVideo = hasVideoBlock();
    const hasGraphic = hasGraphicBlock();

    if (!hasVideo && !hasGraphic) return false;

    if (hasVideo) {
      const videoDone = finishAllVideos();
      if (!videoDone) {
        log('Processing VIDEO part');
        return true;
      }
    }

    if (hasGraphic) {
      const atBottom = isScrolledToBottom();

      if (!atBottom) {
        log('Scrolling GRAPHIC/TEXT part');
        scrollLessonToBottom();
        return true;
      }
    }

    const mixedKey = 'mixed:' + location.href;
    if (lastKey === mixedKey) return true;
    lastKey = mixedKey;

    log('Mixed lesson complete -> Next');
    clickNext();
    return true;
  }

  function isQuizPage() {
    const text = document.body.innerText.toLowerCase();

    return (
      text.includes('quiz') &&
      (
        text.includes('start quiz') ||
        text.includes('passing score') ||
        text.includes('my score') ||
        text.includes('number of tests')
      )
    );
  }

  function processQuiz() {
    if (!isQuizPage()) return false;

    log('Quiz detected -> skipping');

    const key = 'quiz:' + location.href;
    if (lastKey === key) return true;
    lastKey = key;

    setTimeout(() => {
      clickNext();
    }, 1000);

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
      log('Click CANCEL (80% popup)');
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
        handleHuaweiPopup();

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
