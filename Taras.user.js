// ==UserScript==
// @name         Taras
// @namespace    local
// @version      1.9
// @description  Huawei course auto FIXED
// @match        https://talent.shixizhi.huawei.com/*
// @downloadURL  https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @updateURL    https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/Taras.user.js
// @grant        none
// ==/UserScript==

(function () {
'use strict';

const LOOP = 1200;
const WAIT = 1500;
const READ = 3000;
const END = 0.3;

let busy = false;
let last = '';
let enabled = true;

function createToggle() {
  if (document.getElementById('auto-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'auto-toggle';
  btn.innerText = 'AUTO: ON';

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
    cursor: 'pointer'
  });

  btn.onclick = () => {
    enabled = !enabled;
    btn.innerText = enabled ? 'AUTO: ON' : 'AUTO: OFF';
    btn.style.background = enabled ? 'green' : 'red';
  };

  document.body.appendChild(btn);
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function clickNext(){
  const btn = document.querySelector('.switch-btn .next, div.next');
  if(btn){ btn.click(); return true; }
  return false;
}

function hasVideo(){ return !!document.querySelector('video'); }
function hasText(){ return !!document.querySelector('#innerContent, .graphic-content, .content-style-html'); }

function isQuiz(){
  const t = document.body.innerText.toLowerCase();
  return t.includes('start quiz') || t.includes('passing score');
}

function skipVideo(){
  const v = document.querySelector('video');
  if(!v) return false;

  try{
    v.play().catch(()=>{});
    if(v.duration){
      v.currentTime = v.duration - END;
    }
  }catch(e){}

  return true;
}

function scrollDown(){
  const el = document.querySelector('#innerContent');
  if(el){
    el.scrollTop = el.scrollHeight;
    return true;
  }
  window.scrollTo(0, document.body.scrollHeight);
  return true;
}

function isBottom(){
  const el = document.querySelector('#innerContent');
  if(el){
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  }
  return window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
}

// 🔥 FIX: SIMPLE / PHOTO TYPE
async function handleSimple(){
  // 🔥 ВАЖЛИВО: не ловити уроки з відео
if (document.querySelector('video')) return false;
  if(!hasText()) return false;

  const key = 'simple'+location.href;
  if(last === key) return true;

  last = key;

  console.log('[AUTO] SIMPLE wait 3s');

  await sleep(READ);
  clickNext();

  return true;
}

// 🔥 FIX: VIDEO ONLY
async function handleVideo(){
  if(!hasVideo() || hasText()) return false;

  const key = 'video'+location.href;
  if(last === key) return true;

  last = key;

  console.log('[AUTO] VIDEO');

  await sleep(WAIT);
  skipVideo();

  await sleep(WAIT);
  clickNext();

  return true;
}

// 🔥 FIX: VIDEO + TEXT (не скіпає одразу!)
async function handleMixed(){
  if(!hasVideo() || !hasText()) return false;

  const key = 'mixed'+location.href;
  if(last === key) return true;

  console.log('[AUTO] MIXED');

  // 1. відео
  if(skipVideo()){
    await sleep(WAIT);
  }

  // 2. скрол
  if(!isBottom()){
    scrollDown();
    return true;
  }

  // 3. пауза
  await sleep(READ);

  last = key;
  clickNext();
  return true;
}

// 🔥 FIX: TEXT ONLY (старі кейси)
async function handleText(){
  if(hasVideo()) return false;
  if(!hasText()) return false;

  if(!isBottom()){
    scrollDown();
    return true;
  }

  const key = 'text'+location.href;
  if(last === key) return true;

  last = key;

  await sleep(READ);
  clickNext();

  return true;
}

// 🔥 FIX: DOC (iframe книга)
async function handleDoc(){
  if(document.body.id !== 'course-html') return false;

  const lastBtn = document.querySelector('img.footer-icon[src*="toRight3"]');
  if(!lastBtn) return false;

  const key = 'doc'+location.href;
  if(last === key) return true;

  console.log('[AUTO] DOC → last page');

  lastBtn.click();

  await sleep(2000);

  try{
    const parentNext = window.parent.document.querySelector('.switch-btn .next');
    if(parentNext){
      parentNext.click();
    }
  }catch(e){}

  last = key;
  return true;
}

// 🔥 MAIN
async function run(){
  if (!enabled) return;
createToggle();
  if(busy) return;
  busy = true;

  try{

    if(await handleDoc()) return;

    if(isQuiz()){
      console.log('[AUTO] QUIZ skip');
      clickNext();
      return;
    }

    if(await handleVideo()) return;
    if(await handleMixed()) return;
    if(await handleSimple()) return;
    if(await handleText()) return;

  }finally{
    busy = false;
  }
}

setInterval(run, LOOP);
})();
