/**
 * Dandiya Partner Invite - Interactive Script
 * Features:
 * - 100% Nano Banana Kitten Assets (Peeking, Happy, Sad, Crying, Celebrating)
 * - Runaway Evasive 'No' Button with Witty Dialogues
 * - Exit-Intent Window Close Trigger (Crying Kitten)
 * - Web Audio API Synthesized Festive Beats & Celebration Audio
 * - Canvas Confetti & Starry Particles
 * - URL Personalization (?to=...&from=...) & Instant Shareable Link Creator
 * - Zero Unicode Emoji Policy (Pure Inline SVGs and Custom Visuals)
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleEngine();
  initPersonalization();
  initKittenInteractions();
  initExitIntent();
  initAudioEngine();
  initCreatorModal();
});

/* ==========================================================================
   1. State & Assets Manifest
   ========================================================================== */
const ASSETS = {
  peeking: 'assets/kitten-peeking.jpg',
  happy: 'assets/kitten-happy.jpg',
  sad: 'assets/kitten-sad.jpg',
  crying: 'assets/kitten-crying.jpg',
  celebrate: 'assets/kitten-celebrate.jpg'
};

const NO_DODGE_MESSAGES = [
  "No, I won't let you touch the No!",
  "Dandiya rules don't permit this!",
  "My paws are too fast for you!",
  "Look at my eyes... rethink this!",
  "Error 404: 'No' does not exist!",
  "Nice try, but you're coming with me!",
  "The Garba beats demand a YES!",
  "You almost had it... just kidding!"
];

let dodgeCount = 0;
let isAnswered = false;
let exitModalTriggered = false;

/* ==========================================================================
   2. URL Personalization
   ========================================================================== */
let senderName = "A Special Someone";
let recipientName = "You";
let senderPhone = "";

function initPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  const from = params.get('from');
  const phone = params.get('phone');

  if (to && to.trim()) recipientName = to.trim();
  if (from && from.trim()) senderName = from.trim();
  if (phone && phone.trim()) senderPhone = phone.trim().replace(/[^0-9+]/g, '');

  const recipientEl = document.getElementById('invite-recipient-text');
  const senderEl = document.getElementById('invite-sender-text');
  const partnerNamesEl = document.getElementById('final-partner-names');
  const duoNamesEl = document.getElementById('pass-duo-names');

  if (recipientEl) {
    recipientEl.textContent = `Hey ${recipientName},`;
  }
  if (senderEl) {
    senderEl.textContent = `${senderName} wants to know: Will you dance with me under the festive lights?`;
  }
  if (partnerNamesEl) {
    partnerNamesEl.textContent = `${recipientName} & ${senderName}`;
  }
  if (duoNamesEl) {
    duoNamesEl.textContent = `${recipientName} & ${senderName}`;
  }
}

/* ==========================================================================
   3. Kitten Character & Evasive 'No' Interactions
   ========================================================================== */
function initKittenInteractions() {
  const avatar = document.getElementById('kitten-avatar');
  const speechText = document.getElementById('speech-text');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const dodgeCountEl = document.getElementById('dodge-count');
  const arena = document.getElementById('action-arena');

  function setKittenState(state, message) {
    if (isAnswered && state !== 'celebrate') return;
    if (avatar && ASSETS[state]) {
      avatar.src = ASSETS[state];
    }
    if (speechText && message) {
      speechText.textContent = message;
    }
  }

  // Hovering over YES button
  btnYes.addEventListener('mouseenter', () => {
    setKittenState('happy', "Aww! Best decision ever! My paws are ready to twirl!");
  });

  btnYes.addEventListener('mouseleave', () => {
    if (!isAnswered) {
      setKittenState('peeking', "Psst... I'm peeking through my paws to see what you click!");
    }
  });

  // Approaching or Hovering over NO button
  btnNo.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    dodgeNoButton();
  });

  // Mouse proximity tracker for Desktop evasion
  document.addEventListener('mousemove', (e) => {
    if (isAnswered) return;
    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 85) {
      dodgeNoButton();
    }
  });

  // Mobile Touch Evasion
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeNoButton();
  });

  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    dodgeNoButton();
  });

  function dodgeNoButton() {
    if (isAnswered) return;

    dodgeCount++;
    if (dodgeCountEl) dodgeCountEl.textContent = dodgeCount;

    // Switch to Sad Kitten while dodging
    const randomMsg = NO_DODGE_MESSAGES[Math.floor(Math.random() * NO_DODGE_MESSAGES.length)];
    setKittenState('sad', randomMsg);

    // Reposition the No button randomly inside the arena or card
    const card = document.getElementById('invite-card');
    const cardRect = card.getBoundingClientRect();

    const maxOffsetX = (cardRect.width / 2) - 70;
    const maxOffsetY = 80;

    const randomX = (Math.random() * 2 - 1) * maxOffsetX;
    const randomY = (Math.random() * 2 - 1) * maxOffsetY;

    btnNo.style.position = 'relative';
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Make the YES button grow slightly with each dodge attempt
    const scale = Math.min(1 + dodgeCount * 0.06, 1.45);
    btnYes.style.transform = `scale(${scale})`;
  }

  // Clicking YES (The Celebration Finale)
  btnYes.addEventListener('click', () => {
    triggerYesCelebration();
  });
}

function triggerYesCelebration() {
  isAnswered = true;

  const avatar = document.getElementById('kitten-avatar');
  const speechText = document.getElementById('speech-text');
  const mainContent = document.getElementById('invite-main-content');
  const celebrationView = document.getElementById('celebration-view');

  // Set celebrating kitten
  if (avatar) avatar.src = ASSETS.celebrate;
  if (speechText) speechText.textContent = "YES! Best Dandiya partners ever! Let the Garba begin!";

  // Switch views
  if (mainContent) mainContent.style.display = 'none';
  if (celebrationView) celebrationView.style.display = 'block';

  // Trigger celebration audio & confetti
  playCelebrationSound();
  launchConfetti();

  // Configure WhatsApp reply button
  setupWhatsAppReply();

  // Configure Download Partner Pass button
  setupPassDownload();
}

/* ==========================================================================
   4. Exit-Intent (Top-Right / Window Closing Trigger)
   ========================================================================== */
function initExitIntent() {
  const exitModal = document.getElementById('exit-modal');
  const stayBtn = document.getElementById('btn-stay');

  document.addEventListener('mousemove', (e) => {
    if (isAnswered || exitModalTriggered) return;

    // Detect if cursor is approaching top-right corner (window close button area)
    const isTopRight = e.clientX > (window.innerWidth - 90) && e.clientY < 75;

    if (isTopRight) {
      showExitModal();
    }
  });

  // Detect mouse leaving viewport from top edge
  document.addEventListener('mouseleave', (e) => {
    if (isAnswered || exitModalTriggered) return;
    if (e.clientY <= 10) {
      showExitModal();
    }
  });

  function showExitModal() {
    exitModalTriggered = true;
    if (exitModal) exitModal.style.display = 'flex';
  }

  if (stayBtn) {
    stayBtn.addEventListener('click', () => {
      if (exitModal) exitModal.style.display = 'none';
      const btnYes = document.getElementById('btn-yes');
      if (btnYes) btnYes.focus();
    });
  }
}

/* ==========================================================================
   5. WhatsApp Acceptance Hook & Pass Download
   ========================================================================== */
function setupWhatsAppReply() {
  const btn = document.getElementById('whatsapp-reply-btn');
  if (!btn) return;

  const message = encodeURIComponent(
    `YES! I would love to be your Dandiya Partner for Navratri 2026! Grab the Dandiya sticks, I am bringing the festive energy!`
  );

  let url = `https://api.whatsapp.com/send?text=${message}`;
  if (senderPhone) {
    url = `https://api.whatsapp.com/send?phone=${senderPhone}&text=${message}`;
  }

  btn.href = url;
}

function setupPassDownload() {
  const btn = document.getElementById('download-certificate-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, '#090e21');
    grad.addColorStop(0.5, '#151e3f');
    grad.addColorStop(1, '#050711');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // Gold Double Border
    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = 4;
    ctx.strokeRect(15, 15, 770, 470);
    ctx.strokeStyle = 'rgba(245, 197, 66, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 22, 756, 456);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f5c542';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText('SHARAD UTSAV 2026 • DANDIYA RAAS', 400, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Georgia, serif';
    ctx.fillText('OFFICIAL DANDIYA PARTNER PASS', 400, 120);

    // Divider Line
    ctx.strokeStyle = 'rgba(245, 197, 66, 0.4)';
    ctx.beginPath();
    ctx.moveTo(100, 145);
    ctx.lineTo(700, 145);
    ctx.stroke();

    // Duo Names
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px sans-serif';
    ctx.fillText('CERTIFIED DANDIYA DUO', 400, 190);

    ctx.fillStyle = '#f5c542';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText(`${recipientName} & ${senderName}`, 400, 240);

    // Details Grid
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('STATUS', 120, 310);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('CONFIRMED PARTNERS', 120, 340);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('CELEBRATION VENUE', 460, 310);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Navratri Garba Arena', 460, 340);

    // Verification Code
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '13px monospace';
    ctx.fillText('PASS ID: DND-2026-VERIFIED-DUO', 400, 420);

    // Download Trigger
    const link = document.createElement('a');
    link.download = `Dandiya-Partners-${recipientName}-${senderName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

/* ==========================================================================
   6. Custom Invite Link Creator Modal
   ========================================================================== */
function initCreatorModal() {
  const openBtn = document.getElementById('open-creator-btn');
  const closeBtn = document.getElementById('close-creator-btn');
  const modal = document.getElementById('creator-modal');
  const form = document.getElementById('creator-form');
  const resultBox = document.getElementById('generated-link-box');
  const linkInput = document.getElementById('generated-link-input');
  const copyBtn = document.getElementById('copy-link-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'flex';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fromVal = document.getElementById('input-sender').value.trim();
      const toVal = document.getElementById('input-recipient').value.trim();
      const phoneVal = document.getElementById('input-phone').value.trim();

      const origin = window.location.origin;
      const pathname = window.location.pathname;

      const params = new URLSearchParams();
      if (fromVal) params.set('from', fromVal);
      if (toVal) params.set('to', toVal);
      if (phoneVal) params.set('phone', phoneVal);

      const generatedUrl = `${origin}${pathname}?${params.toString()}`;

      if (linkInput) linkInput.value = generatedUrl;
      if (resultBox) resultBox.style.display = 'block';
    });
  }

  if (copyBtn && linkInput) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(linkInput.value).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
    });
  }
}

/* ==========================================================================
   7. Synthesized Festive Dandiya Dhol & Victory Sounds (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let dholInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function initAudioEngine() {
  const btn = document.getElementById('audio-toggle-btn');
  const status = document.getElementById('audio-status-text');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const ctx = getAudioContext();
    if (!isAudioPlaying) {
      startDholLoop(ctx);
      isAudioPlaying = true;
      btn.classList.add('sound-playing');
      if (status) status.textContent = 'Dandiya Beats: ON';
    } else {
      stopDholLoop();
      isAudioPlaying = false;
      btn.classList.remove('sound-playing');
      if (status) status.textContent = 'Play Dandiya Beats';
    }
  });
}

function startDholLoop(ctx) {
  let step = 0;
  const tempo = 128;
  const intervalMs = (60 / tempo) * 1000 / 2;

  dholInterval = setInterval(() => {
    const time = ctx.currentTime;
    // Dhol bass on beats 0, 4
    if (step % 4 === 0) playBassThump(ctx, time);
    // Dandiya stick clack on beats 2, 6
    if (step % 2 === 1) playStickClack(ctx, time);
    // Resonant high slap on beat 3
    if (step % 4 === 3) playHighSlap(ctx, time);
    step = (step + 1) % 8;
  }, intervalMs);
}

function stopDholLoop() {
  if (dholInterval) clearInterval(dholInterval);
}

function playBassThump(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(105, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.18);
  gain.gain.setValueAtTime(0.45, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.22);
}

function playStickClack(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(920, time);
  osc.frequency.exponentialRampToValueAtTime(350, time + 0.04);
  gain.gain.setValueAtTime(0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.05);
}

function playHighSlap(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, time);
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.08);
  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.09);
}

function playCelebrationSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C chord arpeggio
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);
    gain.gain.setValueAtTime(0.3, now + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.4);
  });
}

/* ==========================================================================
   8. Starry Background & Confetti Canvas Engine
   ========================================================================== */
let confettiPieces = [];

function initParticleEngine() {
  const canvas = document.getElementById('festive-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const starCount = 45;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedY: -Math.random() * 0.3 - 0.1,
      opacity: Math.random() * 0.6 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render Ambient Golden Stars
    for (let s of stars) {
      s.y += s.speedY;
      if (s.y < 0) s.y = height;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${s.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#f5c542';
      ctx.fill();
    }

    // Render Confetti if triggered
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const c = confettiPieces[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rotation += c.rotSpeed;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      ctx.restore();

      if (c.y > height + 20) {
        confettiPieces.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

function launchConfetti() {
  const colors = ['#f5c542', '#ff7b00', '#e91e63', '#00b4d8', '#ffffff', '#ffd700'];
  const count = 120;
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 50,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      gravity: 0.35,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.2
    });
  }
}
