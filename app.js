/**
 * Dandiya Partner Invite - Minimalist Animated Cat
 * Features:
 * - Expressive SVG animations: Left paw on eye, Right paw peeking with separated fingers
 * - Glitch-free 'No' button evasion (large minimum-distance jumps + debounce)
 * - Dynamic cursor-tracking pupil
 * - Personalization: Names revealed before & after YES click
 * - Simple heartfelt words: "Please?", "Wait...", "Sorry!", "Yay!"
 * - Zero Unicode Emojis
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initPersonalization();
  initCatAnimations();
  initInteractions();
});

/* ==========================================================================
   1. Personalization Logic
   ========================================================================== */
let recipientName = "";
let senderName = "";
let senderPhone = "";

function initPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  const from = params.get('from');
  const phone = params.get('phone');

  if (to && to.trim()) recipientName = to.trim();
  if (from && from.trim()) senderName = from.trim();
  if (phone && phone.trim()) senderPhone = phone.trim().replace(/[^0-9+]/g, '');

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
   2. Animated Cat Controller
   ========================================================================== */
let catState = 'peeking'; // 'peeking', 'happy', 'sad', 'crying', 'celebrate'
let isAnswered = false;
let dodgeCount = 0;
let isDodging = false;

const SIMPLE_WORDS = [
  "Wait...",
  "Please?",
  "Pretty please?",
  "Sorry!",
  "Don't...",
  "Think again?",
  "Please!"
];

function initCatAnimations() {
  const catStage = document.getElementById('cat-stage');
  const leftEar = document.getElementById('ear-left');
  const pupilRight = document.getElementById('pupil-right');

  // Set initial state
  applyCatState('peeking', 'Please?');

  // Organic blinking loop (every 3.5s)
  setInterval(() => {
    if (catState === 'peeking') {
      catStage.classList.add('blinking');
      setTimeout(() => catStage.classList.remove('blinking'), 130);
    }
  }, 3500);

  // Random playful ear twitch
  setInterval(() => {
    if (Math.random() > 0.4 && leftEar) {
      leftEar.classList.add('twitch');
      setTimeout(() => leftEar.classList.remove('twitch'), 400);
    }
  }, 4200);

  // Dynamic Eye Pupil Tracking & Paw Peeking
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;

    const catRect = catStage.getBoundingClientRect();
    const catCenterX = catRect.left + catRect.width / 2;
    const catCenterY = catRect.top + catRect.height / 2;

    const angle = Math.atan2(e.clientY - catCenterY, e.clientX - catCenterX);
    const dist = Math.min(Math.hypot(e.clientX - catCenterX, e.clientY - catCenterY) / 60, 5.5);

    const pupilX = Math.cos(angle) * dist;
    const pupilY = Math.sin(angle) * dist;

    // Move the visible right pupil to track the cursor
    if (pupilRight && (catState === 'peeking' || catState === 'sad')) {
      pupilRight.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }

    // When cursor moves, the right paw parts slightly wider to peek through!
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

  const catStage = document.getElementById('cat-stage');
  const normalEyes = document.getElementById('normal-eyes');
  const happyEyes = document.getElementById('happy-eyes');
  const sadEyes = document.getElementById('sad-eyes');
  const wordEl = document.getElementById('emotion-word');

  // Update stage classes
  catStage.classList.remove('cat-state-peeking', 'cat-state-happy', 'cat-state-sad', 'cat-state-crying', 'cat-state-celebrate');
  catStage.classList.add(`cat-state-${state}`);

  // Switch eye visuals
  if (state === 'happy' || state === 'celebrate') {
    normalEyes.classList.add('hidden');
    sadEyes.classList.add('hidden');
    happyEyes.classList.remove('hidden');
  } else if (state === 'sad' || state === 'crying') {
    normalEyes.classList.add('hidden');
    happyEyes.classList.add('hidden');
    sadEyes.classList.remove('hidden');
  } else {
    happyEyes.classList.add('hidden');
    sadEyes.classList.add('hidden');
    normalEyes.classList.remove('hidden');
  }

  // Animate simple word transition
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
   3. Glitch-Free 'No' Button Evasion
   ========================================================================== */
function initInteractions() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  // Hovering over YES button
  btnYes.addEventListener('mouseenter', () => {
    applyCatState('happy', 'Yes?');
  });

  btnYes.addEventListener('mouseleave', () => {
    if (!isAnswered) {
      applyCatState('peeking', 'Please?');
    }
  });

  // Approaching NO button (Smart Distance Jump with Debounce)
  document.addEventListener('mousemove', (e) => {
    if (isAnswered || isDodging) return;

    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 80) {
      evadeNoButton(e.clientX, e.clientY);
    }
  });

  btnNo.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    if (!isDodging) evadeNoButton(e.clientX, e.clientY);
  });

  // Mobile Touch Support
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!isDodging) evadeNoButton(touch.clientX, touch.clientY);
  });

  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isDodging) evadeNoButton();
  });

  function evadeNoButton(cursorX, cursorY) {
    if (isAnswered || isDodging) return;
    isDodging = true;

    dodgeCount++;
    const nextWord = SIMPLE_WORDS[(dodgeCount - 1) % SIMPLE_WORDS.length];
    applyCatState('sad', nextWord);

    const card = document.getElementById('invite-card');
    const cardRect = card.getBoundingClientRect();

    // Calculate a position guaranteed to be far from the cursor
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    // Pick between 4 wide opposing quadrants
    const angles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    const pickAngle = angles[Math.floor(Math.random() * angles.length)];

    const jumpDistanceX = 110 + Math.random() * 45;
    const jumpDistanceY = 55 + Math.random() * 30;

    let targetOffsetX = Math.cos(pickAngle) * jumpDistanceX;
    let targetOffsetY = Math.sin(pickAngle) * jumpDistanceY;

    // If mouse coordinates are known, ensure target jumps away from mouse
    if (cursorX !== undefined) {
      if (cursorX < cardCenterX) {
        targetOffsetX = Math.abs(targetOffsetX); // Jump to right side
      } else {
        targetOffsetX = -Math.abs(targetOffsetX); // Jump to left side
      }
    }

    btnNo.style.transform = `translate(${targetOffsetX}px, ${targetOffsetY}px)`;

    // YES button subtly scales larger with each attempt
    const yesScale = Math.min(1 + dodgeCount * 0.08, 1.45);
    btnYes.style.transform = `scale(${yesScale})`;

    // Debounce to prevent rapid hover loops
    setTimeout(() => {
      isDodging = false;
    }, 280);
  }

  // Clicking YES (The Big Moment)
  btnYes.addEventListener('click', () => {
    handleVictory();
  });

  // Exit Intent Detection (Top-Right Corner / Closing Window)
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

  // Hide question arena and show celebration view
  const arena = document.getElementById('button-arena');
  const celebration = document.getElementById('celebration-container');
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

  const toWhom = senderName ? senderName : "you";
  const cleanMessage = encodeURIComponent(`YES! I would love to be your Dandiya partner!`);

  let url = `https://api.whatsapp.com/send?text=${cleanMessage}`;
  if (senderPhone) {
    url = `https://api.whatsapp.com/send?phone=${senderPhone}&text=${cleanMessage}`;
  }
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
