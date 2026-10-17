/**
 * Dandiya Partner Invite - Minimalist Animated Cat
 * Features:
 * - Cat hanging from above the box looking down
 * - Cat grabs the 'No' button and runs away across the box
 * - Lifelike Kindchenschema facial expressions & pupil tracking
 * - Flowing translucent tear cascades (No static sweat drops)
 * - Decodes encrypted invite links (?c=...)
 * - Zero Unicode emojis
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initPersonalization();
  initCatAnimations();
  initInteractions();
});

/* ==========================================================================
   1. Encrypted URL Personalization Logic
   ========================================================================== */
let recipientName = "";
let senderName = "";

function initPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const encryptedCode = params.get('c');
  const plainTo = params.get('to');
  const plainFrom = params.get('from');

  if (encryptedCode) {
    try {
      let base64 = encryptedCode.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const jsonStr = decodeURIComponent(escape(atob(base64)));
      const data = JSON.parse(jsonStr);
      if (data.t) recipientName = data.t.trim();
      if (data.f) senderName = data.f.trim();
    } catch (e) {
      console.warn("Could not decrypt invite token", e);
    }
  } else {
    if (plainTo) recipientName = plainTo.trim();
    if (plainFrom) senderName = plainFrom.trim();
  }

  const partnerDisplay = document.getElementById('partner-name-display');
  if (partnerDisplay) {
    if (recipientName) {
      partnerDisplay.textContent = `, ${recipientName}`;
    } else {
      partnerDisplay.textContent = "";
    }
  }
}

/* ==========================================================================
   2. Hanging Cat Controller
   ========================================================================== */
let catState = 'peeking'; // 'peeking', 'happy', 'sad', 'crying', 'celebrate'
let isAnswered = false;
let dodgeCount = 0;
let isDodging = false;
let hasStolenNo = false;

const SIMPLE_WORDS = [
  "Wait...",
  "Please?",
  "Pretty please?",
  "Don't...",
  "Think again?",
  "Please!"
];

const THIEF_LINES = [
  "Mine! You can't click No!",
  "Nope! I ran away with it!",
  "Dandiya rules: No 'No' allowed!",
  "Look at my cute face!",
  "Say YES instead!"
];

function initCatAnimations() {
  const catWrapper = document.getElementById('hanging-cat-wrapper');
  const catStage = document.getElementById('cat-svg');
  const leftEar = document.getElementById('ear-left');
  const pupilRight = document.getElementById('pupil-right');

  // Set initial state
  applyCatState('peeking', 'Please?');

  // Blinking loop (every 3.6s)
  setInterval(() => {
    if (catState === 'peeking') {
      catStage.classList.add('blinking');
      setTimeout(() => catStage.classList.remove('blinking'), 130);
    }
  }, 3600);

  // Random ear twitch
  setInterval(() => {
    if (Math.random() > 0.4 && leftEar) {
      leftEar.classList.add('twitch');
      setTimeout(() => leftEar.classList.remove('twitch'), 400);
    }
  }, 4400);

  // Dynamic Eye Pupil Tracking
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;

    const catRect = catWrapper.getBoundingClientRect();
    const catCenterX = catRect.left + catRect.width / 2;
    const catCenterY = catRect.top + catRect.height / 2;

    const angle = Math.atan2(e.clientY - catCenterY, e.clientX - catCenterX);
    const dist = Math.min(Math.hypot(e.clientX - catCenterX, e.clientY - catCenterY) / 55, 5.5);

    const pupilX = Math.cos(angle) * dist;
    const pupilY = Math.sin(angle) * dist;

    if (pupilRight && (catState === 'peeking' || catState === 'sad')) {
      pupilRight.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }

    // Right paw gently shifts over the ledge to peek down
    if (catState === 'peeking') {
      catStage.classList.add('peek-open');
      clearTimeout(window._peekTimer);
      window._peekTimer = setTimeout(() => {
        if (catState === 'peeking') {
          catStage.classList.remove('peek-open');
        }
      }, 650);
    }
  });
}

function applyCatState(state, word) {
  if (isAnswered && state !== 'celebrate') return;
  catState = state;

  const catStage = document.getElementById('cat-svg');
  const normalEyes = document.getElementById('normal-eyes');
  const happyEyes = document.getElementById('happy-eyes');
  const sadEyes = document.getElementById('sad-eyes');
  const mouthNormal = document.getElementById('mouth-normal');
  const mouthSad = document.getElementById('mouth-sad');
  const mouthHappy = document.getElementById('mouth-happy');
  const wordEl = document.getElementById('emotion-word');

  // Update stage classes
  catStage.classList.remove('cat-state-peeking', 'cat-state-happy', 'cat-state-sad', 'cat-state-crying', 'cat-state-celebrate');
  catStage.classList.add(`cat-state-${state}`);

  // Switch eye & mouth visuals
  if (state === 'happy' || state === 'celebrate') {
    normalEyes.classList.add('hidden');
    sadEyes.classList.add('hidden');
    happyEyes.classList.remove('hidden');

    mouthNormal.classList.add('hidden');
    mouthSad.classList.add('hidden');
    mouthHappy.classList.remove('hidden');
  } else if (state === 'sad' || state === 'crying') {
    normalEyes.classList.add('hidden');
    happyEyes.classList.add('hidden');
    sadEyes.classList.remove('hidden');

    mouthNormal.classList.add('hidden');
    mouthHappy.classList.add('hidden');
    mouthSad.classList.remove('hidden');
  } else {
    happyEyes.classList.add('hidden');
    sadEyes.classList.add('hidden');
    normalEyes.classList.remove('hidden');

    mouthHappy.classList.add('hidden');
    mouthSad.classList.add('hidden');
    mouthNormal.classList.remove('hidden');
  }

  // Update simple word
  if (wordEl && word) {
    wordEl.style.opacity = '0';
    wordEl.style.transform = 'translateY(4px)';
    setTimeout(() => {
      wordEl.textContent = word;
      wordEl.style.opacity = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 120);
  }
}

/* ==========================================================================
   3. Cat Grabs the 'No' Button and Runs Away!
   ========================================================================== */
function initInteractions() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const catThief = document.getElementById('cat-thief');
  const thiefSpeech = catThief.querySelector('.thief-speech');
  const card = document.getElementById('invite-card');

  // Hovering over YES button
  btnYes.addEventListener('mouseenter', () => {
    applyCatState('happy', 'Yes?');
  });

  btnYes.addEventListener('mouseleave', () => {
    if (!isAnswered) {
      applyCatState('peeking', 'Please?');
    }
  });

  // Approaching NO button -> Trigger Cat Snatch & Run Away!
  document.addEventListener('mousemove', (e) => {
    if (isAnswered || isDodging) return;

    if (!hasStolenNo) {
      const rect = btnNo.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      if (dist < 85) {
        snatchNoButton(e.clientX, e.clientY);
      }
    } else {
      // The cat is already holding No: if cursor approaches the cat thief, it scurries away!
      const thiefRect = catThief.getBoundingClientRect();
      const thiefCenterX = thiefRect.left + thiefRect.width / 2;
      const thiefCenterY = thiefRect.top + thiefRect.height / 2;
      const dist = Math.hypot(e.clientX - thiefCenterX, e.clientY - thiefCenterY);

      if (dist < 90) {
        scurryCatThief(e.clientX, e.clientY);
      }
    }
  });

  btnNo.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    if (!isDodging) snatchNoButton(e.clientX, e.clientY);
  });

  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!isDodging) snatchNoButton(touch.clientX, touch.clientY);
  });

  // Dynamic Peripheral Perches for the Cat Thief (Zero chance of overlapping YES)
  function getThiefPerches() {
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const thiefW = 120;
    const thiefH = 85;

    return [
      { left: 16, top: 16 },                                       // Top-left corner
      { left: Math.max(16, w - thiefW - 16), top: 16 },            // Top-right corner
      { left: 14, top: Math.max(20, h - thiefH - 18) },            // Bottom-left corner
      { left: Math.max(16, w - thiefW - 14), top: Math.max(20, h - thiefH - 18) }, // Bottom-right corner
      { left: -12, top: Math.max(18, Math.floor(h * 0.42) - 25) }, // Left edge perimeter
      { left: Math.max(16, w - thiefW + 12), top: Math.max(18, Math.floor(h * 0.42) - 25) } // Right edge perimeter
    ];
  }

  let currentPerchIndex = -1;
  let currentX = 0;

  function snatchNoButton(cursorX, cursorY) {
    if (isAnswered || isDodging) return;
    isDodging = true;
    hasStolenNo = true;
    dodgeCount++;

    // Hide original No button
    btnNo.style.opacity = '0';
    btnNo.style.pointerEvents = 'none';

    // Update cat reaction & word
    const nextWord = SIMPLE_WORDS[(dodgeCount - 1) % SIMPLE_WORDS.length];
    applyCatState('sad', nextWord);

    // Initial position of cat thief directly over where No was
    const cardRect = card.getBoundingClientRect();
    const noRect = btnNo.getBoundingClientRect();
    const initialX = Math.round(noRect.left - cardRect.left - 20);
    const initialY = Math.round(noRect.top - cardRect.top - 20);

    currentX = initialX;
    catThief.style.left = `${initialX}px`;
    catThief.style.top = `${initialY}px`;
    catThief.classList.remove('hidden');

    // Run away after a tiny instant snatch!
    setTimeout(() => {
      isDodging = false;
      scurryCatThief(cursorX, cursorY);
    }, 120);

    // YES button scales larger
    const yesScale = Math.min(1 + dodgeCount * 0.08, 1.45);
    btnYes.style.transform = `scale(${yesScale})`;
  }

  function scurryCatThief(cursorX, cursorY) {
    if (isAnswered || isDodging) return;
    isDodging = true;
    dodgeCount++;

    const nextWord = SIMPLE_WORDS[(dodgeCount - 1) % SIMPLE_WORDS.length];
    applyCatState('sad', nextWord);

    if (thiefSpeech) {
      thiefSpeech.textContent = THIEF_LINES[(dodgeCount - 1) % THIEF_LINES.length];
    }

    const cardRect = card.getBoundingClientRect();
    const perches = getThiefPerches();
    const candidates = perches.map((p, i) => ({ ...p, i })).filter(p => p.i !== currentPerchIndex);

    // Pick perch furthest from cursor
    let bestPerch = candidates[0];
    if (cursorX !== undefined && cursorY !== undefined) {
      let maxDist = -1;
      for (const p of candidates) {
        const estX = cardRect.left + p.left + 60;
        const estY = cardRect.top + p.top + 45;
        const d = Math.hypot(cursorX - estX, cursorY - estY);
        if (d > maxDist) {
          maxDist = d;
          bestPerch = p;
        }
      }
    } else {
      bestPerch = candidates[Math.floor(Math.random() * candidates.length)];
    }

    currentPerchIndex = bestPerch.i;

    // Turn sprite to face running direction
    const thiefSvg = catThief.querySelector('.thief-svg');
    if (thiefSvg) {
      if (bestPerch.left < currentX) {
        thiefSvg.style.transform = 'scaleX(-1)';
      } else {
        thiefSvg.style.transform = 'scaleX(1)';
      }
    }
    currentX = bestPerch.left;

    // Scurry to the new spot!
    catThief.style.left = `${bestPerch.left}px`;
    catThief.style.top = `${bestPerch.top}px`;

    // Scale up YES button
    const yesScale = Math.min(1 + dodgeCount * 0.08, 1.45);
    btnYes.style.transform = `scale(${yesScale})`;

    setTimeout(() => {
      isDodging = false;
    }, 320);
  }

  // If user tries to click the cat thief holding No
  catThief.addEventListener('click', (e) => {
    e.preventDefault();
    scurryCatThief(e.clientX, e.clientY);
  });

  catThief.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    scurryCatThief(touch.clientX, touch.clientY);
  });

  // Clicking YES (Victory!)
  btnYes.addEventListener('click', () => {
    handleVictory();
  });

  // Exit Intent Detection (Top-Right Window Corner)
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;

    const isTopRight = e.clientX > (window.innerWidth - 85) && e.clientY < 65;
    if (isTopRight && catState !== 'crying') {
      applyCatState('crying', "Wait... please don't go!");
    } else if (!isTopRight && catState === 'crying') {
      applyCatState('peeking', 'Please?');
    }
  });

  document.addEventListener('mouseleave', (e) => {
    if (isAnswered) return;
    if (e.clientY <= 5) {
      applyCatState('crying', "Wait... please don't go!");
    }
  });
}

function handleVictory() {
  isAnswered = true;
  applyCatState('celebrate', 'Yay!');

  // Hide the cat thief and buttons
  const catThief = document.getElementById('cat-thief');
  const arena = document.getElementById('button-arena');
  const celebration = document.getElementById('celebration-container');

  if (catThief) catThief.classList.add('hidden');
  if (arena) arena.style.display = 'none';
  if (celebration) celebration.style.display = 'block';

  // Personalization in Celebration Screen
  const duoText = document.getElementById('celebration-duo-text');
  const senderSubtext = document.getElementById('celebration-sender-subtext');
  const replyBtnText = document.getElementById('reply-btn-text');

  if (recipientName && senderName) {
    if (duoText) duoText.textContent = `${recipientName} & ${senderName} are officially Dandiya partners!`;
    if (senderSubtext) senderSubtext.textContent = `Get your traditional outfit ready!`;
    if (replyBtnText) replyBtnText.textContent = `Text ${senderName} on WhatsApp`;
  } else if (senderName) {
    if (duoText) duoText.textContent = `You & ${senderName} are officially going together!`;
    if (replyBtnText) replyBtnText.textContent = `Text ${senderName} on WhatsApp`;
  } else if (recipientName) {
    if (duoText) duoText.textContent = `${recipientName}, can't wait to dance with you!`;
  }

  // Launch celebration embers
  triggerConfetti();

  // Setup WhatsApp reply link
  setupReplyLink();
}

function setupReplyLink() {
  const link = document.getElementById('whatsapp-link');
  if (!link) return;

  const cleanMessage = encodeURIComponent(`YES! I would love to be your Dandiya partner!`);
  const url = `https://api.whatsapp.com/send?text=${cleanMessage}`;
  link.href = url;
}

/* ==========================================================================
   4. Ambient Starry Canvas & Celebration Embers
   ========================================================================== */
let particles = [];
let celebrationEmbers = [];

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Ambient fairy lights
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      speedY: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient floating lights
    for (let p of particles) {
      p.y += p.speedY;
      if (p.y < 0) p.y = height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#f5c542';
      ctx.fill();
    }

    // Draw celebration embers if active
    for (let i = celebrationEmbers.length - 1; i >= 0; i--) {
      const c = celebrationEmbers[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.alpha -= 0.012;

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color.replace('ALPHA', Math.max(0, c.alpha));
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffd54f';
      ctx.fill();

      if (c.alpha <= 0) {
        celebrationEmbers.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

function triggerConfetti() {
  const colors = [
    'rgba(245, 197, 66, ALPHA)',
    'rgba(255, 143, 0, ALPHA)',
    'rgba(255, 64, 129, ALPHA)',
    'rgba(0, 180, 216, ALPHA)',
    'rgba(255, 255, 255, ALPHA)'
  ];

  for (let i = 0; i < 70; i++) {
    celebrationEmbers.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 20,
      r: Math.random() * 3 + 1.5,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 2,
      gravity: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1
    });
  }
}
