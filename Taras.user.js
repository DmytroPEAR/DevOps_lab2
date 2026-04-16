// ==UserScript==
// @name          Taras Stop Only
// @namespace     local
// @version       2.34
// @description   
// @match         https://talent.shixizhi.huawei.com/*
// @match         https://e.huawei.com/en/talent/*
// @grant         none
// ==/UserScript==

(function () {
    'use strict';

    const LOOP = 2000;
    const READ = 5000;
    const END = 0.5;

    let busy = false;
    let last = '';
    let stopped = false; // Перемінна для повної зупинки

    function createStopButton() {
        if (window !== window.top) return;
        if (document.getElementById('auto-stop-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'auto-stop-btn';
        btn.innerText = 'STOP AUTO';

        Object.assign(btn.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 999999,
            padding: '10px 14px',
            background: 'red',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        });

        btn.onclick = () => {
            stopped = true;
            btn.innerText = 'AUTO STOPPED';
            btn.style.background = '#555';
            btn.style.cursor = 'default';
            console.log('[AUTO] Automation killed by user.');
        };

        document.body.appendChild(btn);
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function findNextButton() {
        let btn = document.querySelector('.next, .next-btn, [class*="next"]');
        if (btn && btn.innerText.includes('Next')) return btn;

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
            v.play().catch(() => {});
            v.currentTime = v.duration - 0.3;
            v.dispatchEvent(new Event('timeupdate', { bubbles: true }));
            v.dispatchEvent(new Event('ended', { bubbles: true }));
            return true;
        } catch (e) {
            return false;
        }
    }

    async function handleDoc() {
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

        lastBtn.click();
        await sleep(5000);
        const nxt = findNextButton();
        if (nxt) { nxt.click(); last = key; }
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

        if (!skipVideo()) return false;
        await sleep(4000);

        const scrollBlock = document.querySelector('#innerContent') || 
                            document.querySelector('.learn-content-main-overflow.overflow-outer') ||
                            document.querySelector('.graphic-content');
        if (scrollBlock) {
            scrollBlock.scrollTop = scrollBlock.scrollHeight;
            scrollBlock.dispatchEvent(new Event('scroll', { bubbles: true }));
        }
        await sleep(3000);

        const nxt = findNextButton();
        if (nxt) { nxt.click(); last = key; }
        return true;
    }

    async function run() {
        createStopButton();

        // Якщо натиснуто кнопку STOP — нічого не робимо
        if (stopped) return;

        if (busy) return;
        busy = true;

        try {
            if (await handleDoc()) return;
            if (await handleVideoWithText()) return;

            const v = getVideoElement();
            if (v) {
                if (skipVideo()) {
                    await sleep(4000);
                    const nxt = findNextButton();
                    if (nxt) {
                        nxt.click();
                        last = 'v' + location.href;
                    }
                }
                return;
            }

            const nxt = findNextButton();
            if (nxt) {
                const key = 's' + location.href;
                if (last !== key) {
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

    console.log('[AUTO] Taras v2.40 (Stop Button Only) active');
    setInterval(run, LOOP);
})();
