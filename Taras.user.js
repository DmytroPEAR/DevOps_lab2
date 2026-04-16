// ==UserScript==
// @name         Taras
// @namespace    local
// @version      2.32
// @description  
// @match        https://talent.shixizhi.huawei.com/*
// @match        https://e.huawei.com/en/talent/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const LOOP = 2000;
    const READ = 5000;
    const END = 0.5;

    let busy = false;
    let last = '';
    let enabled = localStorage.getItem('huawei_auto_enabled') !== '0';

    function createToggle() {
    if (window !== window.top) return;
    if (document.getElementById('auto-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'auto-toggle';

    function refreshButton() {
        enabled = localStorage.getItem('huawei_auto_enabled') !== '0';
        btn.innerText = enabled ? 'AUTO: ON' : 'AUTO: OFF';
        btn.style.background = enabled ? 'green' : 'red';
    }

    Object.assign(btn.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999999,
        padding: '10px 14px',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    });

    btn.onclick = () => {
        const current = localStorage.getItem('huawei_auto_enabled') !== '0';
        localStorage.setItem('huawei_auto_enabled', current ? '0' : '1');
        refreshButton();
    };

    refreshButton();
    document.body.appendChild(btn);

    window.addEventListener('storage', refreshButton);
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
        if (!v.duration || isNaN(v.duration)) return false;

        // 1. Запускаємо відео
        v.play().catch(() => {});

        // 2. Перемотуємо
        v.currentTime = v.duration - 0.3;

        // 3. Форсимо події (КЛЮЧ)
        v.dispatchEvent(new Event('timeupdate', { bubbles: true }));
        v.dispatchEvent(new Event('seeking', { bubbles: true }));
        v.dispatchEvent(new Event('seeked', { bubbles: true }));
        v.dispatchEvent(new Event('ended', { bubbles: true }));

        console.log('[AUTO] Video forced to end');

        return true;
    } catch (e) {
        console.error('[AUTO] skipVideo error:', e);
        return false;
    }
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
    async function handleVideoWithText() {
    const blocks = document.querySelectorAll('.courseware-wrapper');

    let hasVideo = false;
    let hasText = false;

    blocks.forEach(b => {
        if (b.className.includes('mult-video')) hasVideo = true;
        if (b.className.includes('mult-graphic')) hasText = true;
    });

    if (!hasVideo || !hasText) return false;

    const key = 'vt' + location.href;
    if (last === key) return true;

    console.log('[AUTO] Mode: VIDEO + TEXT');

    // 1. Спочатку відео
    const ok = skipVideo();
    if (!ok) return false;

    // Даємо часу системі зарахувати відео
    await sleep(4000);

    // 2. Скролимо текстовий блок
    const scrollBlock =
        document.querySelector('#innerContent') ||
        document.querySelector('.learn-content-main-overflow.overflow-outer') ||
        document.querySelector('.learn-content-main.main-outer') ||
        document.querySelector('.graphic-content');

    if (scrollBlock) {
        scrollBlock.scrollTop = scrollBlock.scrollHeight;
        scrollBlock.dispatchEvent(new Event('scroll', { bubbles: true }));
        console.log('[AUTO] Scrolled text block to bottom');
    } else {
        window.scrollTo(0, document.body.scrollHeight);
        window.dispatchEvent(new Event('scroll'));
        console.log('[AUTO] Fallback window scroll');
    }

    // Даємо часу системі зарахувати читання тексту
    await sleep(3000);

    // 3. Ще раз доскролюємо для надійності
    if (scrollBlock) {
        scrollBlock.scrollTop = scrollBlock.scrollHeight;
        scrollBlock.dispatchEvent(new Event('scroll', { bubbles: true }));
    }

    await sleep(2000);

    // 4. Тільки тепер Next
    const nxt = findNextButton();
    if (nxt) {
        console.log('[AUTO] Click Next after VIDEO + TEXT');
        nxt.click();
        last = key;
    }

    return true;
}
    
    async function run() {
    enabled = localStorage.getItem('huawei_auto_enabled') !== '0';
    if (!enabled) return;
    createToggle();
    if (busy) return;
    busy = true;

    try {
        // 1. Книги
        if (await handleDoc()) return;

        // 2. Відео + текст
        if (await handleVideoWithText()) return;

        // 3. Відео
        const v = getVideoElement();
        if (v) {
            console.log('[AUTO] Mode: VIDEO');

            const ok = skipVideo();
            if (!ok) return;

            // Чекаємо поки сайт зарахує прогрес
            await sleep(4000);

            const nxt = findNextButton();
            if (nxt) {
                console.log('[AUTO] Click Next after video');
                nxt.click();
                last = 'v' + location.href;
            }

            return;
        }

        // 4. Текст / Simple
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
