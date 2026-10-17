/**
 * Dandiya Partner Invite - Minimalist Animated Cat
 * Built following Emil Kowalski's animation philosophy (animate skill):
 * - Expressive SVG animations with hardware-accelerated transforms
 * - Dynamic pupil eye-tracking following the cursor
 * - Moving paws with peek-a-boo gap mechanics
 * - Evasive 'No' button with smooth physics
 * - Exit-intent top-right detection
 * - Simple heartfelt words: "Please?", "Wait...", "Sorry!", "Yay!"
 * - Zero Unicode Emojis
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initCatAnimations();
  initInteractions();
});

/* ==========================================================================
   1. Animated Cat Controller
   ========================================================================== */
let catState = 'peeking'; // 'peeking', 'happy', 'sad', 'crying', 'celebrate'
let isAnswered = false;
let dodgeCount = 0;

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
  const normalEyes = document.getElementById('normal-eyes');
  const happyEyes = document.getElementById('happy-eyes');
  const sadEyes = document.getElementById('sad-eyes');
  const leftEar = document.getElementById('ear-left');
  const pupilLeft = document.getElementById('pupil-left');
  const pupilRight = document.getElementById('pupil-right');
  const wordEl = document.getElementById('emotion-word');

  // Set initial state
  applyCatState('peeking', 'Please?');

  // Blinking loop (every 3.6s)
  setInterval(() => {
    if (catState === 'normal' || catState === 'peeking') {
      catStage.classList.add('blinking');
      setTimeout(() => {
        catStage.classList.remove('blinking');
      }, 140);
    }
  }, 3600);

  // Random ear twitch
  setInterval(() => {
    if (Math.random() > 0.4 && leftEar) {
      leftEar.classList.add('twitch');
      setTimeout(() => leftEar.classList.remove('twitch'), 400);
    }
  }, 4500);

  // Eye pupil tracking mouse cursor
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;

    const catRect = catStage.getBoundingClientRect();
    const catCenterX = catRect.left + catRect.width / 2;
    const catCenterY = catRect.top + catRect.height / 2;

    const angle = Math.atan2(e.clientY - catCenterY, e.clientX - catCenterX);
    const dist = Math.min(Math.hypot(e.clientX - catCenterX, e.clientY - catCenterY) / 60, 5.5);

    const pupilX = Math.cos(angle) * dist;
    const pupilY = Math.sin(angle) * dist;

    if (pupilLeft && pupilRight && (catState === 'peeking' || catState === 'sad')) {
      pupilLeft.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      pupilRight.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }

    // Dynamic paw peek: when cursor moves, paws separate slightly to peek through!
    if (catState === 'peeking') {
      catStage.classList.add('peek-open');
      clearTimeout(window._peekTimer);
      window._peekTimer = setTimeout(() => {
        if (catState === 'peeking') {
          catStage.classList.remove('peek-open');
        }
      }, 700);
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

  // Remove existing state classes
  catStage.classList.remove('cat-state-peeking', 'cat-state-happy', 'cat-state-sad', 'cat-state-crying', 'cat-state-celebrate');
  catStage.classList.add(`cat-state-${state}`);

  // Switch eye graphics
  if (state === 'happy' || state === 'celebrate') {
    normalEyes.classList.add('hidden');
    sadEyes.classList.add('hidden');
    happyEyes.classList.remove('hidden');
  } else if (state === 'sad' || state === 'crying') {
    normalEyes.classList.add('hidden');
    happyEyes.classList.add('hidden');
    sadEyes.classList.remove('hidden');
  } else {
    // Normal / Peeking
    happyEyes.classList.add('hidden');
    sadEyes.classList.add('hidden');
    normalEyes.classList.remove('hidden');
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
   2. Interactive Buttons & Evasive Logic
   ========================================================================== */
function initInteractions() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const arena = document.getElementById('button-arena');

  // Hovering over YES
  btnYes.addEventListener('mouseenter', () => {
    applyCatState('happy', 'Yes?');
  });

  btnYes.addEventListener('mouseleave', () => {
    if (!isAnswered) {
      applyCatState('peeking', 'Please?');
    }
  });

  // Approaching NO button (Evasive Physics)
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;

    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 85) {
      evadeNoButton();
    }
  });

  btnNo.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    evadeNoButton();
  });

  // Mobile Touch Support
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    evadeNoButton();
  });

  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    evadeNoButton();
  });

  function evadeNoButton() {
    if (isAnswered) return;

    dodgeCount++;
    const nextWord = SIMPLE_WORDS[(dodgeCount - 1) % SIMPLE_WORDS.length];
    applyCatState('sad', nextWord);

    // Calculate safe evasion coordinates inside card
    const card = document.getElementById('invite-card');
    const cardRect = card.getBoundingClientRect();

    const maxDeltaX = (cardRect.width / 2) - 60;
    const maxDeltaY = 65;

    const offsetX = (Math.random() * 2 - 1) * maxDeltaX;
    const offsetY = (Math.random() * 2 - 1) * maxDeltaY;

    btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // YES button subtly grows larger
    const yesScale = Math.min(1 + dodgeCount * 0.07, 1.4);
    btnYes.style.transform = `scale(${yesScale})`;
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

  // Hide button arena
  const arena = document.getElementById('button-arena');
  const celebration = document.getElementById('celebration-container');
  if (arena) arena.style.display = 'none';
  if (celebration) celebration.style.display = 'block';

  // Launch celebratory floating embers
  triggerConfetti();

  // Setup simple WhatsApp reply
  setupReplyLink();
}

function setupReplyLink() {
  const link = document.getElementById('whatsapp-link');
  if (!link) return;

  const params = new URLSearchParams(window.location.search);
  const phone = params.get('phone') || '';

  const cleanMessage = encodeURIComponent("YES! Can't wait to be your Dandiya partner!");
  let url = `https://api.whatsapp.com/send?text=${cleanMessage}`;
  if (phone) {
    url = `https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9+]/g, '')}&text=${cleanMessage}`;
  }
  link.href = url;
}

/* ==========================================================================
   3. Ambient Starry Canvas & Celebration Embers
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

  // Soft ambient fairy lights
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
