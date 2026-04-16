// ==/UserScript==
// @name          Taras
// @namespace     local
// @version       2.45
// @match         https://talent.shixizhi.huawei.com/*
// @match         https://e.huawei.com/en/talent/*
// @downloadURL  https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @updateURL    https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @grant         none
// ==/UserScript==

(function () {
    'use strict';

    const LOOP_TIME = 2500; // Трохи збільшив для стабільності
    let last = '';
    let busy = false;
    let stoppedGlobally = false;
    let mainInterval = null;

    // --- ДОПОМІЖНІ ФУНКЦІЇ (БЕЗПЕЧНІ) ---
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const safeText = (v) => (v || '').replace(/\s+/g, ' ').trim().toLowerCase();

    function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;
    }

    function tryGetDocFromFrame(frame) {
        try { return frame.contentWindow?.document || null; } catch { return null; }
    }

    function getAllDocs() {
        const docs = [{ doc: document, source: 'top' }];
        const frames = document.querySelectorAll('iframe');
        frames.forEach((f, i) => {
            const fdoc = tryGetDocFromFrame(f);
            if (fdoc) docs.push({ doc: fdoc, source: `iframe[${i}]` });
        });
        return docs;
    }

    function queryFirst(selectors, root = document) {
        for (const s of selectors) {
            try { const el = root.querySelector(s); if (el) return el; } catch {}
        }
        return null;
    }

    function queryAllMerged(selectors, root = document) {
        const result = [];
        selectors.forEach(s => {
            try { result.push(...root.querySelectorAll(s)); } catch {}
        });
        return result;
    }

    function getMainContentRoot(doc = document) {
        return queryFirst(['.learn-content-main', '.main-outer', '.moocClassId', '.graphic-content', '.ant-layout-content'], doc) || doc.body;
    }

    // --- ПОШУК ЕЛЕМЕНТІВ (РОЗУМНИЙ) ---
    function findVideo() {
        for (const { doc, source } of getAllDocs()) {
            const v = doc.querySelector('video');
            if (v) return { el: v, source };
        }
        return null;
    }

    function findDocPager() {
        for (const { doc, source } of getAllDocs()) {
            const el = queryFirst(['img[src*="toRight3"]', '.footer-icon[src*="toRight3"]'], doc);
            if (el) return { el, source };
        }
        return null;
    }

    function findNextButton() {
        for (const { doc, source } of getAllDocs()) {
            // Пріоритет кнопкам з класом next
            const direct = queryFirst(['div.next', '.next', '.next-btn', '.switch-btn .next', '[class*="next"]'], doc);
            if (direct && isVisible(direct)) {
                const text = safeText(direct.innerText || direct.textContent);
                if (text && (text.includes('next') || text.includes('continue') || text.includes('finish'))) return { el: direct, source, text };
            }
            // Пошук по всіх кнопках
            const allBtns = queryAllMerged(['button', '.ant-btn', '[role="button"]'], doc);
            for (const b of allBtns) {
                if (!isVisible(b)) continue;
                const t = safeText(b.innerText || b.textContent);
                if (t === 'next' || t === 'continue' || t === 'finish') return { el: b, source, text: t };
            }
        }
        return null;
    }

    function findQuizSignals() {
        let hits = 0;
        for (const { doc } of getAllDocs()) {
            const root = getMainContentRoot(doc);
            const text = safeText(root.innerText);
            if (/\b(single choice|multiple choice|true\/false|passing score)\b/.test(text)) hits++;
            if (doc.querySelector('input[type="radio"], .ant-radio-wrapper')) hits++;
        }
        return hits > 0;
    }

    function pickBestScrollable() {
        let best = null;
        for (const { doc, source } of getAllDocs()) {
            const candidates = queryAllMerged(['.learn-content-main', '.main-outer', '.graphic-content', '#innerContent', '.moocClassId'], doc);
            candidates.forEach(el => {
                if (!isVisible(el)) return;
                const overflow = el.scrollHeight - el.clientHeight;
                if (overflow > 150) {
                    const score = overflow + (safeText(el.innerText).length * 0.2);
                    if (!best || score > best.score) best = { el, score, source, overflow };
                }
            });
        }
        return best;
    }

    // --- КЛАСИФІКАЦІЯ ---
    function classifyLesson() {
        const video = findVideo();
        const docPager = findDocPager();
        const nextBtn = findNextButton();
        const isQuiz = findQuizSignals();
        const scrollable = pickBestScrollable();

        let type = 'simple';
        if (isQuiz) type = 'quiz-like';
        else if (video && scrollable) type = 'video+scroll';
        else if (video) type = 'video-only';
        else if (docPager) type = 'document/book';
        else if (scrollable) type = 'text/scroll';

        return { type, video, docPager, nextBtn, scrollable };
    }

    // --- КЕРУВАННЯ ТА ІНТЕРФЕЙС ---
    function createStopButton() {
        if (window !== window.top || document.getElementById('auto-stop-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'auto-stop-btn';
        btn.innerText = 'STOP AUTO';
        Object.assign(btn.style, {
            position: 'fixed', top: '20px', right: '20px', zIndex: 1000000,
            padding: '12px 16px', background: 'red', color: 'white', border: '2px solid white',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
        });
        btn.onclick = () => {
            stoppedGlobally = true;
            clearInterval(mainInterval);
            btn.innerText = '⚠️ STOPPED';
            btn.style.background = '#333';
        };
        document.body.appendChild(btn);
    }

    // --- ГОЛОВНИЙ ЦИКЛ ---
    async function run() {
        if (stoppedGlobally) return;
        createStopButton();
        if (busy) return;
        busy = true;

        try {
            const c = classifyLesson();
            const href = location.href;

            // Якщо ми вже це робили на цій сторінці - чекаємо
            if (last === href) { busy = false; return; }

            console.log('[AUTO] Lesson Type:', c.type);

            // 1. ОБРОБКА ВІДЕО
            if (c.video) {
                const v = c.video.el;
                if (v.duration && !v.ended) {
                    console.log('[AUTO] Fast-forwarding video...');
                    v.muted = true;
                    v.currentTime = v.duration - 0.5;
                    v.play().catch(() => {});
                    await sleep(3000);
                }
            }

            // 2. ОБРОБКА СКРОЛУ (ТЕКСТУ)
            if (c.scrollable) {
                console.log('[AUTO] Scrolling content...');
                c.scrollable.el.scrollTop = c.scrollable.el.scrollHeight;
                await sleep(2000);
            }

            // 3. ОБРОБКА ДОКУМЕНТІВ (КНИГИ)
            if (c.type === 'document/book' && c.docPager) {
                console.log('[AUTO] Clicking document pager...');
                c.docPager.el.click();
                await sleep(3000);
            }

            // 4. НАТИСКАННЯ NEXT
            if (c.nextBtn) {
                console.log('[AUTO] Clicking NEXT button:', c.nextBtn.text);
                await sleep(2000);
                c.nextBtn.el.click();
                last = href; // Мітимо сторінку як пройдену
            } else {
                if (c.type === 'quiz-like') console.log('[AUTO] Quiz detected. Please solve it manually!');
            }

        } catch (err) {
            console.error('[AUTO] Error:', err);
        } finally {
            busy = false;
        }
    }

    console.log('[AUTO] Taras v2.45 Hybrid Ready');
    mainInterval = setInterval(run, LOOP_TIME);
})();
