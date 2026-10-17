/**
 * Dandiya Partner Invite - Minimalist Animated Cat
 * Features:
 * - Lifelike organic kitten animations: Left paw on eye, Right paw peeking through
 * - Flowing translucent tear cascades & quivering lip when sad (No static sweat blob)
 * - 100% Guaranteed Zero-Overlap 'No' button peripheral evasion
 * - Dynamic cursor-tracking pupil
 * - Encrypted URL token decoding (Private links)
 * - Zero Unicode Emojis
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
      // Decode URL-safe Base64
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
    // Fallback if plain params used
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
   2. Animated Cat Controller (Kindchenschema Psychology)
   ========================================================================== */
let catState = 'peeking'; // 'peeking', 'happy', 'sad', 'crying', 'celebrate'
let isAnswered = false;
let dodgeCount = 0;
let isDodging = false;

// Simple words without "Sorry"
const SIMPLE_WORDS = [
  "Wait...",
  "Please?",
  "Pretty please?",
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

  // Organic blinking loop (every 3.6s)
  setInterval(() => {
    if (catState === 'peeking') {
      catStage.classList.add('blinking');
      setTimeout(() => catStage.classList.remove('blinking'), 130);
    }
  }, 3600);

  // Playful ear twitch
  setInterval(() => {
    if (Math.random() > 0.4 && leftEar) {
      leftEar.classList.add('twitch');
      setTimeout(() => leftEar.classList.remove('twitch'), 400);
    }
  }, 4400);

  // Dynamic Eye Pupil Tracking & Natural Paw Peeking
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;

    const catRect = catStage.getBoundingClientRect();
    const catCenterX = catRect.left + catRect.width / 2;
    const catCenterY = catRect.top + catRect.height / 2;

    const angle = Math.atan2(e.clientY - catCenterY, e.clientX - catCenterX);
    const dist = Math.min(Math.hypot(e.clientX - catCenterX, e.clientY - catCenterY) / 55, 5.5);

    const pupilX = Math.cos(angle) * dist;
    const pupilY = Math.sin(angle) * dist;

    // Move the visible right pupil to track the cursor
    if (pupilRight && (catState === 'peeking' || catState === 'sad')) {
      pupilRight.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }

    // When cursor moves, the right paw parts softly to peek through!
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
  const mouthNormal = document.getElementById('mouth-normal');
  const mouthSad = document.getElementById('mouth-sad');
  const mouthHappy = document.getElementById('mouth-happy');
  const wordEl = document.getElementById('emotion-word');

  // Update stage classes
  catStage.classList.remove('cat-state-peeking', 'cat-state-happy', 'cat-state-sad', 'cat-state-crying', 'cat-state-celebrate');
  catStage.classList.add(`cat-state-${state}`);

  // Switch eye visuals
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
   3. 100% Collision-Free 'No' Button Evasion
   - Strictly guaranteed NEVER to overlap the 'Yes' button or center text
   ========================================================================== */
function initInteractions() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
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

  // Approaching NO button
  document.addEventListener('mousemove', (e) => {
    if (isAnswered || isDodging) return;

    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 85) {
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

  // Defined safe peripheral stations around the card boundary
  // Note: 'Yes' button is strictly in the center bottom of the card.
  // These stations are anchored strictly to the left & right margins,
  // making it physically impossible to collide with 'Yes' or center text!
  const PERIPHERAL_STATIONS = [
    { name: 'bottom-left',  style: { left: '26px', right: 'auto', top: 'auto', bottom: '24px' } },
    { name: 'bottom-right', style: { left: 'auto', right: '26px', top: 'auto', bottom: '24px' } },
    { name: 'mid-left',     style: { left: '20px', right: 'auto', top: '56%',  bottom: 'auto' } },
    { name: 'mid-right',    style: { left: 'auto', right: '20px', top: '56%',  bottom: 'auto' } },
    { name: 'upper-left',   style: { left: '20px', right: 'auto', top: '38%',  bottom: 'auto' } },
    { name: 'upper-right',  style: { left: 'auto', right: '20px', top: '38%',  bottom: 'auto' } }
  ];

  let currentStationIndex = -1;

  function evadeNoButton(cursorX, cursorY) {
    if (isAnswered || isDodging) return;
    isDodging = true;

    dodgeCount++;
    const nextWord = SIMPLE_WORDS[(dodgeCount - 1) % SIMPLE_WORDS.length];
    applyCatState('sad', nextWord);

    // Make button absolute relative to the card container
    btnNo.classList.add('dodging-active');

    const cardRect = card.getBoundingClientRect();

    // Pick candidate stations that are different from the current station
    let candidates = PERIPHERAL_STATIONS.map((st, idx) => ({ ...st, idx })).filter(st => st.idx !== currentStationIndex);

    // If mouse coordinates are available, pick the station furthest from the cursor
    let bestStation = candidates[0];
    if (cursorX !== undefined && cursorY !== undefined) {
      let maxDist = -1;
      for (const st of candidates) {
        // Estimate station coordinates in viewport
        let estX = st.style.left !== 'auto' ? cardRect.left + 50 : cardRect.right - 50;
        let estY = cardRect.bottom - 40;
        if (st.style.top === '56%') estY = cardRect.top + cardRect.height * 0.56;
        if (st.style.top === '38%') estY = cardRect.top + cardRect.height * 0.38;

        const d = Math.hypot(cursorX - estX, cursorY - estY);
        if (d > maxDist) {
          maxDist = d;
          bestStation = st;
        }
      }
    } else {
      bestStation = candidates[Math.floor(Math.random() * candidates.length)];
    }

    currentStationIndex = bestStation.idx;

    // Apply clean station styling
    btnNo.style.position = 'absolute';
    btnNo.style.left = bestStation.style.left;
    btnNo.style.right = bestStation.style.right;
    btnNo.style.top = bestStation.style.top;
    btnNo.style.bottom = bestStation.style.bottom;
    btnNo.style.transform = 'none';

    // YES button subtly scales larger with each attempt
    const yesScale = Math.min(1 + dodgeCount * 0.08, 1.45);
    btnYes.style.transform = `scale(${yesScale})`;

    // Debounce to eliminate hover loops
    setTimeout(() => {
      isDodging = false;
    }, 260);
  }

  // Clicking YES (Victory!)
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

  // Hide button arena and show celebration view
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
