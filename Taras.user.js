// ==UserScript==
// @name          Taras Hard Stop
// @namespace     local
// @version       2.35
// @description   Huawei auto - Killing interval on stop
// @match         https://talent.shixizhi.huawei.com/*
// @match         https://e.huawei.com/en/talent/*
// @grant         none
// ==/UserScript==

(function () {
    'use strict';

    const LOOP_TIME = 2000;
    const READ = 5000;
    let last = '';
    let busy = false;
    let mainInterval = null; // Змінна для керування циклом

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
            padding: '12px 16px',
            background: 'red',
            color: '#fff',
            border: '2px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
        });

        btn.onclick = () => {
            // КЛЮЧОВА ДІЯ: Зупиняємо інтервал назавжди
            if (mainInterval) {
                clearInterval(mainInterval);
                mainInterval = null;
            }
            stoppedGlobally = true;
            btn.innerText = '⚠️ STOPPED';
            btn.style.background = '#333';
            btn.style.cursor = 'default';
            console.log('[AUTO] INTERVAL KILLED. Nothing will happen until refresh.');
        };

        document.body.appendChild(btn);
    }

    // Додатковий захист для функцій всередині
    let stoppedGlobally = false;

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
            try { v = f.contentWindow.document.querySelector('video'); if (v) return v; } catch (e) {}
        }
        return null;
    }

    async function run() {
        if (stoppedGlobally) return; // Подвійна перевірка
        createStopButton();

        if (busy) return;
        busy = true;

        try {
            // Логіка книг
            let lastBtn = document.querySelector('img[src*="toRight3"]');
            if (!lastBtn) {
                const iframes = document.querySelectorAll('iframe');
                for (let f of iframes) {
                    try { lastBtn = f.contentWindow.document.querySelector('img[src*="toRight3"]'); } catch(e){}
                    if (lastBtn) break;
                }
            }

            if (lastBtn && last !== 'doc' + location.href) {
                lastBtn.click();
                await sleep(5000);
                const nxt = findNextButton();
                if (nxt) { nxt.click(); last = 'doc' + location.href; }
                return;
            }

            // Логіка відео
            const v = getVideoElement();
            if (v && last !== 'v' + location.href) {
                if (v.duration) {
                    v.play().catch(() => {});
                    v.currentTime = v.duration - 0.5;
                    await sleep(4000);
                    const nxt = findNextButton();
                    if (nxt) { nxt.click(); last = 'v' + location.href; }
                }
                return;
            }

            // Логіка простого тексту
            const nxt = findNextButton();
            if (nxt && last !== 's' + location.href) {
                console.log('[AUTO] Waiting to click Next...');
                await sleep(READ);
                if (!stoppedGlobally) { // Перевірка перед самим кліком
                    nxt.click();
                    last = 's' + location.href;
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            busy = false;
        }
    }

    console.log('[AUTO] Taras v2.41 ready');
    // Запускаємо і зберігаємо ID інтервалу
    mainInterval = setInterval(run, LOOP_TIME);
})();
