// ── State ─────────────────────────────────────────────────────────────────────
let drawn  = [];
let cursor = 0;   // 0 = top, 1 = bottom
let player = 0;   // 0 = left (P1), 1 = right (P2)
let phase  = 'idle'; // idle | flipping | picking | picked

// ── DOM refs ──────────────────────────────────────────────────────────────────
const anchor      = document.getElementById('card-anchor');
const slotTop     = document.getElementById('card-top');
const slotBot     = document.getElementById('card-bot');
const historyListP1 = document.getElementById('history-list-p1');
const historyListP2 = document.getElementById('history-list-p2');

// ── History (localStorage) ────────────────────────────────────────────────────
const panelP1 = document.getElementById('history-p1');
const panelP2 = document.getElementById('history-p2');

function loadHistory() {
  return {
    p1: JSON.parse(localStorage.getItem('history-p1') || '[]'),
    p2: JSON.parse(localStorage.getItem('history-p2') || '[]'),
  };
}

function saveHistory(p1, p2) {
  localStorage.setItem('history-p1', JSON.stringify(p1));
  localStorage.setItem('history-p2', JSON.stringify(p2));
}

function renderHistory() {
  const { p1, p2 } = loadHistory();
  renderList(historyListP1, p1);
  renderList(historyListP2, p2);
}

function showHistoryForPlayer(playerIndex) {
  // Show only the panel for this player, hide the other
  const { p1, p2 } = loadHistory();
  if (playerIndex === 0) {
    panelP1.classList.toggle('visible', p1.length > 0);
    panelP2.classList.remove('visible');
  } else {
    panelP2.classList.toggle('visible', p2.length > 0);
    panelP1.classList.remove('visible');
  }
}

function hideHistory() {
  panelP1.classList.remove('visible');
  panelP2.classList.remove('visible');
}

function clearHistory(playerIndex) {
  const { p1, p2 } = loadHistory();
  if (playerIndex === 0) saveHistory([], p2);
  else                   saveHistory(p1, []);
  renderHistory();
}

function renderList(el, items) {
  el.innerHTML = items.map(c => {
    const iconHtml = c.img
      ? `<img class="history-item-img" src="${c.img}" alt="">`
      : `<span class="history-item-icon">${c.icon}</span>`;
    return `
    <li class="history-item${c.once ? ' history-item-once' : ''}">
      ${iconHtml}
      <span class="history-item-text">${c.name}</span>
    </li>`;
  }).join('');
}

function pushHistory(playerIndex, card) {
  const { p1, p2 } = loadHistory();
  const entry = { icon: card.icon, img: card.img || null, name: card.name, once: card.once || false };
  if (playerIndex === 0) p1.push(entry);
  else                   p2.push(entry);
  saveHistory(p1, p2);
  renderHistory();
  showHistoryForPlayer(playerIndex);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
setAnchorSide();
renderHistory();  // populate lists from cache but keep panels hidden

// ── Helpers ───────────────────────────────────────────────────────────────────
function setAnchorSide() {
  anchor.classList.toggle('side-left',  player === 0);
  anchor.classList.toggle('side-right', player === 1);
}

function buildSlotContent(slot, card) {
  const iconHtml = card.img
    ? `<img class="card-icon card-icon-img" src="${card.img}" alt="${card.name}">`
    : `<span class="card-icon">${card.icon}</span>`;
  slot.innerHTML = `
    <div class="card-flipper">
      <div class="card-face card-back">
        <div class="card-back-pattern">♦</div>
      </div>
      <div class="card-face card-front${card.once ? ' card-once' : ''}" style="--accent:${card.accent}">
        <span class="card-type">${card.type}</span>
        ${iconHtml}
        ${card.once ? '<span class="card-once-label">Uso unico</span>' : ''}
        <span class="card-name">${card.name}</span>
        <span class="card-desc">${card.desc}</span>
        <span class="card-power">${card.type}</span>
      </div>
    </div>
  `;
}

function getSlots() { return [slotTop, slotBot]; }

function applyHighlight() {
  const [top, bot] = getSlots();
  top.classList.toggle('highlighted', cursor === 0);
  bot.classList.toggle('highlighted', cursor === 1);
}

// ── Draw two cards ────────────────────────────────────────────────────────────
function drawCards() {
  if (phase !== 'idle') return;

  const pool    = CARD_DECK.filter(c => c.type === (player === 0 ? 'buff' : 'debuff'));
  const shuffled = shuffleDeck(pool);
  drawn  = [shuffled[0], shuffled[1]];
  cursor = 0;
  phase  = 'flipping';

  // Build both slots (face-down to start)
  buildSlotContent(slotTop, drawn[0]);
  buildSlotContent(slotBot, drawn[1]);

  // Show the history panel for this player as soon as cards appear
  showHistoryForPlayer(player);

  // Slide cards onto screen (face-down)
  requestAnimationFrame(() => {
    slotTop.classList.add('visible');
    setTimeout(() => slotBot.classList.add('visible'), 150);

    // Flip top card after it's slid in
    setTimeout(() => {
      slotTop.querySelector('.card-flipper').classList.add('flipped');
    }, 500);

    // Flip bottom card with a stagger
    setTimeout(() => {
      slotBot.querySelector('.card-flipper').classList.add('flipped');
    }, 900);

    // Enable picking after both flips settle
    setTimeout(() => {
      phase = 'picking';
      applyHighlight();
    }, 1600);
  });
}

// ── Move cursor ───────────────────────────────────────────────────────────────
function moveCursor(dir) {
  if (phase !== 'picking') return;
  cursor = dir === 'up' ? 0 : 1;
  applyHighlight();
}

// ── Confirm pick ──────────────────────────────────────────────────────────────
function confirmPick() {
  if (phase !== 'picking') return;
  phase = 'picked';

  const [top, bot] = getSlots();
  const chosenSlot  = cursor === 0 ? top : bot;
  const dismissSlot = cursor === 0 ? bot : top;

  top.classList.remove('highlighted');
  bot.classList.remove('highlighted');

  dismissSlot.classList.add('dismissed');

  pushHistory(player, drawn[cursor]);

  setTimeout(() => {
    chosenSlot.classList.add('is-chosen');

    // Move to fixed anchor: P1 → 1/4 from left, P2 → 3/4 from left
    const scale = 1.7;
    const flipper = chosenSlot.querySelector('.card-flipper');
    const rect    = chosenSlot.getBoundingClientRect();
    const cardCX  = rect.left + rect.width  / 2;
    const cardCY  = rect.top  + rect.height / 2;
    const targetX = player === 0
      ? window.innerWidth  * 0.25
      : window.innerWidth  * 0.75;
    const targetY = window.innerHeight * 0.5;

    const tx = (targetX - cardCX) / scale;
    const ty = (targetY - cardCY) / scale;

    flipper.style.transition = 'transform 0.55s cubic-bezier(.2,.8,.3,1.2)';
    flipper.style.transform  = `rotateY(0deg) scale(${scale}) translate(${tx}px, ${ty}px)`;
    chosenSlot.classList.add('chosen');
  }, 100);
}

// ── Clear and switch player ───────────────────────────────────────────────────
function clearAndSwitch() {
  if (phase !== 'picked') return;

  const [top, bot] = getSlots();

  // Reset chosen flipper transform before dismissing
  const chosenSlot  = cursor === 0 ? top : bot;
  const flipper = chosenSlot.querySelector('.card-flipper');
  if (flipper) {
    flipper.style.transition = 'transform 0.3s ease';
    flipper.style.transform  = 'rotateY(0deg) scale(0.85)';
  }

  top.classList.add('dismissed');
  bot.classList.add('dismissed');

  hideHistory();

  setTimeout(() => {
    slotTop.innerHTML = '';
    slotBot.innerHTML = '';
    slotTop.className = 'card-slot';
    slotBot.className = 'card-slot';
    // Strip once-use entries before switching player
    const { p1, p2 } = loadHistory();
    saveHistory(p1.filter(c => !c.once), p2.filter(c => !c.once));
    renderHistory();
    player = player === 0 ? 1 : 0;
    setAnchorSide();
    phase = 'idle';
  }, 380)
}

// ── Reset everything ──────────────────────────────────────────────────────────
function resetAll() {
  drawn  = [];
  cursor = 0;
  player = 0;
  phase  = 'idle';
  slotTop.innerHTML = '';
  slotBot.innerHTML = '';
  slotTop.className = 'card-slot';
  slotBot.className = 'card-slot';
  localStorage.removeItem('history-p1');
  localStorage.removeItem('history-p2');
  renderHistory();
  hideHistory();
  setAnchorSide();
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
function handleKey(e) {
  const k = e.key || e.code;
  switch (k) {
    case ' ':
    case 'Space':
      e.preventDefault();
      drawCards();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      moveCursor('up');
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      moveCursor('down');
      break;
    case 'Enter':
      e.preventDefault();
      if (phase === 'picking') confirmPick();
      else if (phase === 'picked') clearAndSwitch();
      break;
    case 'r':
    case 'R':
    case 'KeyR':
      resetAll();
      break;
    case 'c':
    case 'C':
    case 'KeyC':
      saveHistory([], []);
      renderHistory();
      break;
  }
}

// Key trap input — gives OBS Interact a real focusable element to send keys to
const keyTrap = document.getElementById('key-trap');

function refocus() { keyTrap.focus(); }
refocus();
document.addEventListener('click', refocus);
setInterval(refocus, 2000);

// Dedup guard — prevents the same event firing twice (keyTrap bubbles to document)
let lastEventTime = 0;
function handleKeyOnce(e) {
  if (e.timeStamp === lastEventTime) return;
  lastEventTime = e.timeStamp;
  handleKey(e);
}

keyTrap.addEventListener('keydown', handleKeyOnce);
document.addEventListener('keydown', handleKeyOnce);
