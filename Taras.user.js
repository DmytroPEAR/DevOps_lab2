// ==UserScript==
// @name         Taras
// @namespace    local
// @version      2.2
// @description  Huawei course auto (Iframe Next Button Fix)
// @match        https://talent.shixizhi.huawei.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const LOOP = 2000;
    const READ = 5000;
    const END = 0.5;

    let busy = false;
    let last = '';
    let enabled = true;

    function createToggle() {
        if (document.getElementById('auto-toggle')) return;
        const btn = document.createElement('button');
        btn.id = 'auto-toggle';
        btn.innerText = 'AUTO: ON';
        Object.assign(btn.style, {
            position: 'fixed', top: '20px', right: '20px', zIndex: 999999,
            padding: '10px 14px', background: 'green', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
        });
        btn.onclick = () => {
            enabled = !enabled;
            btn.innerText = enabled ? 'AUTO: ON' : 'AUTO: OFF';
            btn.style.background = enabled ? 'green' : 'red';
        };
        document.body.appendChild(btn);
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // Функція пошуку кнопки Next всюди (і в основному вікні, і в фреймах)
    function findNextButton() {
        // 1. Шукаємо в основному документі
        let btn = document.querySelector('.next, .next-btn, [class*="next"]');
        if (btn && btn.innerText.includes('Next')) return btn;

        // 2. Шукаємо всередині всіх iframe
        const iframes = document.querySelectorAll('iframe');
        for (let f of iframes) {
            try {
                btn = f.contentWindow.document.querySelector('.next, .next-btn, [class*="next"]');
                if (btn && btn.innerText.includes('Next')) return btn;
            } catch (e) {}
        }
        return null;
    }

    function getVideoElement() {
        let v = document.querySelector('video');
        if (v) return v;
        const iframes = document.querySelectorAll('iframe');
        for (let f of iframes) {
            try {
                v = f.contentWindow.document.querySelector('video');
                if (v) return v;
            } catch (e) {}
        }
        return null;
    }

    function skipVideo() {
        const v = getVideoElement();
        if (!v) return false;
        try {
            if (v.duration && !isNaN(v.duration)) {
                v.currentTime = v.duration - END;
                v.play().catch(() => {});
                return true;
            }
        } catch (e) {}
        return false;
    }

    // 🔥 ВИПРАВЛЕНО: Обробка книг (Doc)
    async function handleDoc() {
        // Шукаємо кнопку "в кінець" (toRight3)
        // Вона може бути в iframe, тому шукаємо скрізь
        let lastBtn = document.querySelector('img[src*="toRight3"]');
        if (!lastBtn) {
            const iframes = document.querySelectorAll('iframe');
            for (let f of iframes) {
                try { lastBtn = f.contentWindow.document.querySelector('img[src*="toRight3"]'); } catch(e){}
                if (lastBtn) break;
            }
        }

        if (!lastBtn) return false;

        const key = 'doc' + location.href;
        if (last === key) return true;

        console.log('[AUTO] Mode: DOC. Clicking toRight3...');
        lastBtn.click();

        await sleep(5000); // Чекаємо на зарахування прогресу

        const nxt = findNextButton();
        if (nxt) {
            console.log('[AUTO] Found Next button in DOC, clicking...');
            nxt.click();
            last = key;
        }
        return true;
    }

    async function run() {
        if (!enabled) return;
        createToggle();
        if (busy) return;
        busy = true;

        try {
            // 1. Книги
            if (await handleDoc()) return;

            // 2. Відео
            const v = getVideoElement();
            if (v) {
                console.log('[AUTO] Mode: VIDEO');
                skipVideo();
                await sleep(3000);
                const nxt = findNextButton();
                if (nxt) { nxt.click(); last = 'v' + location.href; }
                return;
            }

            // 3. Текст / Simple
            const nxt = findNextButton();
            if (nxt) {
                const key = 's' + location.href;
                if (last !== key) {
                    console.log('[AUTO] Mode: SIMPLE');
                    await sleep(READ);
                    nxt.click();
                    last = key;
                }
            }

        } catch (err) {
            console.error('[AUTO] Error:', err);
        } finally {
            busy = false;
        }
    }

    console.log('[AUTO] Taras v2.2 active');
    setInterval(run, LOOP);
})();
