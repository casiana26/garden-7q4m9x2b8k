'use strict';

/* =========================================================
   PERSONALIZE HERE
   Replace the name, letter, photo paths and memories later.
   Recommended photo paths: images/photo-01.jpg ... photo-12.jpg
   ========================================================= */
const BIRTHDAY_NAME = 'Ina';

const LETTER_TEXT = `La mulți ani!

Am vrut să îți ofer ceva mai inedit și pe care să-l poți avea mereu la îndemână: un buchet de bujori construit din fotografiile și amintirile noastre. Îți mulțumesc pentru fiecare glumă, fiecare conversație și fiecare moment care a devenit special pentru că ai fost acolo.

Sper ca cei 17 ani să îți aducă multă bucurie, curaj, oameni frumoși și toate lucrurile pe care le meriți :). Să rămâi la fel de minunată și să nu uiți niciodată cât de importantă ești pentru mine. Ești puiul meu dar știi deja asta :))). La mulți ani! ❤️`;

const MEMORIES = [
  "Acesta a fost primul nostru hangout REAL de după RSF :)))",
  "Asta e EFECTIV PRIMA noastră poză împreună :)))",
  "Aici eram la ziua mea, după ce aproape am plâns de la felicitarea ta (momentul să mă răzbun hehe >:))",
  "Aici eram la ziua taa când ai făcut sweet 16 și lowk e una din pozele mele preferate cu tine :)",
  "Aici am împlinit fix UN AN de prietenie (la cât mai mulți heheh) :)",
  "Asta e o amintire soooo cuuute pt că am fost la Caferamica și mi-ai scris mesajul acela drăguț pe cană și eu lfl ție hihihi:)",
  "Ăsta a fost ultimul nostru hangout din 2025 când am fost la patinoar și am făcut tik tok-ul ăla :)  (era să mi rup gâtul but I'm alive)",
  "Ăsta a fost primul hangout din 2026 :)) (cu câteva minute înainte să începem amândouă să cântăm Rihanna at the same damn time)",
  "Moments before disaster efectiv. Ne-a prins potopul de-l vedeam pe Noe cum vine cu arca și puiul mic avea și pantaloni albi :'(",
  "Aici eram înainte de interviul pt INIMO și GOSHH dacă știam cât de kkt e INIMO fugeam împușcată",
  "Asta e cea mai recentă poză cu noi două și lowk a cam devenit preferata mea. Prea bună ideea să facem poze pe iarbă la Palas :)",
  "Poza asta era prea funny ca să nu o pun :). Eram la Jumbo aici, după ce ne-am udat în aspersoarele acelea din parc care udau gazonul btw"
];

/* Replace these with real files, for example:
   'images/photo-01.jpg', 'images/photo-02.jpg', ...
   Until then, elegant generated placeholders are displayed. */
const PHOTOS = [
  'images/photo-01.jpeg',
  'images/photo-02.jpeg',
  'images/photo-03.jpeg',
  'images/photo-04.jpeg',
  'images/photo-05.jpeg',
  'images/photo-06.jpeg',
  'images/photo-07.jpeg',
  'images/photo-08.jpeg',
  'images/photo-09.jpeg',
  'images/photo-10.jpeg',
  'images/photo-11.jpeg',
  'images/photo-12.jpeg'
];

/* =========================================================
   APP STATE
   ========================================================= */
const state = {
  step: 1,
  bloom: 0,
  bloomFinished: false,
  currentFlower: null,
  unlocked: new Set(),
  musicOn: false,
  draggingCan: false,
  watering: false,
  typewriterRunning: false,
  letterFinished: false,
  cakeTransitionStarted: false,
  candlesOut: new Set(),
  lastFocusedElement: null,
  waterTimer: null,
  toastTimer: null,
  finalMemoryTransitionStarted: false
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const els = {};

const BOUQUET_POSITIONS = [
  [50, 11, -4, 112], [32, 18, -13, 102], [68, 18, 12, 102],
  [19, 34, -18, 96], [42, 34, -7, 108], [59, 34, 7, 108], [81, 34, 18, 96],
  [27, 53, -14, 100], [50, 52, 2, 112], [73, 53, 14, 100],
  [38, 70, -7, 98], [63, 70, 9, 98]
];

const GARDEN_POSITIONS = [
  [50, 13, -4, 116], [31, 20, -12, 103], [69, 20, 12, 103],
  [17, 37, -17, 96], [40, 37, -6, 110], [60, 37, 7, 110], [83, 37, 17, 96],
  [27, 56, -12, 102], [50, 55, 1, 116], [73, 56, 13, 102],
  [38, 73, -7, 100], [63, 73, 8, 100]
];

const FILLER_POSITIONS = [
  [19, 12, -20, 58], [31, 10, -12, 52], [69, 10, 12, 52], [81, 12, 20, 58],
  [10, 24, -24, 52], [24, 24, -15, 64], [39, 21, -7, 50], [61, 21, 7, 50], [76, 24, 15, 64], [90, 24, 24, 52],
  [7, 39, -25, 48], [17, 42, -20, 60], [31, 39, -11, 54], [50, 38, 0, 48], [69, 39, 11, 54], [83, 42, 20, 60], [93, 39, 25, 48],
  [10, 56, -23, 48], [22, 57, -17, 58], [36, 55, -8, 50], [64, 55, 8, 50], [78, 57, 17, 58], [90, 56, 23, 48],
  [17, 71, -18, 46], [29, 72, -12, 54], [45, 70, -5, 45], [55, 70, 5, 45], [71, 72, 12, 54], [83, 71, 18, 46],
  [28, 84, -10, 42], [41, 82, -5, 46], [59, 82, 5, 46], [72, 84, 10, 42]
];

/* =========================================================
   INITIALIZATION
   ========================================================= */
document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheElements();
  buildBouquetFlowers();
  buildPhotoGarden();
  buildCakeCandles();
  bindEvents();
  resetInitialUI();
  showStep(1, false);
}

function cacheElements() {
  Object.assign(els, {
    steps: $$('.step'),
    toast: $('#toast'),
    bgm: $('#bgm'),
    enterBtn: $('#enterBtn'),
    bloomPct: $('#bloomPct'),
    progressBar: $('.progressBar'),
    progressFill: $('.progressFill'),
    bouquetWrap: $('#bouquetWrap'),
    bouquet: $('.bouquet'),
    peonies: $('#peonies'),
    dropletsLayer: $('#dropletsLayer'),
    spotlight: $('#spotlight'),
    wateringCan: $('#wateringCan'),
    skipBloomBtn: $('#skipBloomBtn'),
    bloomDoneOverlay: $('#bloomDoneOverlay'),
    continueToPhotosBtn: $('#continueToPhotosBtn'),
    photoGarden: $('#photoGarden'),
    unlockedCount: $('#unlockedCount'),
    allMemoriesMessage: $('#allMemoriesMessage'),
    openLetterBtn: $('#openLetterBtn'),
    letterPaper: $('#letterPaper'),
    typewriter: $('#typewriter'),
    unlockLastLine: $('#unlockLastLine'),
    restartExperienceBtn: $('#restartExperienceBtn'),
    confettiCanvas: $('#confettiCanvas'),
    nameFill: $('#nameFill'),
    overlayRoot: $('#overlayRoot'),
    overlayBackdrop: $('#overlayBackdrop'),
    overlayCard: $('#overlayCard'),
    overlayClose: $('#overlayClose'),
    overlayPhoto: $('#overlayPhoto'),
    overlayZoomHint: $('#overlayZoomHint'),
    revealMemoryBtn: $('#revealMemoryBtn'),
    overlayMemoryText: $('#overlayMemoryText'),
    candlesRow: $('#candlesRow'),
    candleCounter: $('#candleCounter'),
    cakeCompleteMessage: $('#cakeCompleteMessage'),
    candles: []
  });
}

function resetInitialUI() {
  els.nameFill.textContent = BIRTHDAY_NAME;
  updateBloom(0);
  updateUnlockedCount();
}

function bindEvents() {
  els.enterBtn.addEventListener('click', () => {
    // Change the screen immediately. Music loading must never block Start,
    // especially when song.mp3 has not been added yet or loads slowly on iPhone.
    showStep(2);
    requestAnimationFrame(placeWateringCanForCurrentScreen);
    void startBackgroundMusic();
  });

  els.skipBloomBtn?.addEventListener('click', completeBloom);
  els.continueToPhotosBtn.addEventListener('click', () => showStep(4));
  els.openLetterBtn.addEventListener('click', openLetter);
  els.restartExperienceBtn.addEventListener('click', restartExperience);

  els.overlayBackdrop.addEventListener('click', closeOverlay);
  els.overlayClose.addEventListener('click', closeOverlay);
  els.overlayPhoto.addEventListener('click', togglePhotoZoom);
  els.revealMemoryBtn.addEventListener('click', revealCurrentMemory);
  els.bgm.addEventListener('ended', () => {
    els.bgm.currentTime = 0;
    els.bgm.play().catch(() => {});
  });


  document.addEventListener('keydown', handleGlobalKeydown);

  setupWateringCan();

  window.addEventListener('resize', debounce(() => {
    if (state.step === 2 && !state.draggingCan) placeWateringCanForCurrentScreen();
  }, 120));
  window.addEventListener('orientationchange', () => {
    window.setTimeout(() => {
      if (state.step === 2) placeWateringCanForCurrentScreen();
    }, 250);
  });
}

/* =========================================================
   STEP NAVIGATION
   ========================================================= */
function showStep(stepNumber, animate = true) {
  state.step = stepNumber;
  els.steps.forEach(step => {
    const active = Number(step.dataset.step) === stepNumber;
    step.classList.toggle('active', active);
    step.setAttribute('aria-hidden', String(!active));
  });

  window.scrollTo({ top: 0, behavior: animate && !prefersReducedMotion() ? 'smooth' : 'auto' });

  if (stepNumber === 2) {
    requestAnimationFrame(placeWateringCanForCurrentScreen);
  }
  if (stepNumber === 8) {
    window.setTimeout(() => els.openLetterBtn.focus({ preventScroll: true }), 350);
  }

  if (stepNumber === 10) {
    window.setTimeout(() => els.candles[0]?.focus({ preventScroll: true }), 350);
  }
  if (stepNumber === 10) {
    burstConfetti(55);
  }
}


/* =========================================================
   FLOWER CREATION
   ========================================================= */
function buildBouquetFlowers() {
  const fragment = document.createDocumentFragment();

  BOUQUET_POSITIONS.forEach(([x, y, rotation, size], index) => {
    const flower = document.createElement('div');
    flower.className = 'peony';
    flower.dataset.index = String(index);
    flower.style.left = `${x}%`;
    flower.style.top = `${y}%`;
    flower.style.setProperty('--rot', `${rotation}deg`);
    flower.style.setProperty('--size', `${size}px`);
    flower.style.setProperty('--delay', `${(index * 0.07).toFixed(2)}s`);
    flower.style.zIndex = String(2 + Math.round(y / 10));
    flower.innerHTML = '<span class="flowerCore" aria-hidden="true"></span>';
    fragment.appendChild(flower);
  });

  FILLER_POSITIONS.forEach(([x, y, rotation, size], index) => {
    const filler = document.createElement('span');
    filler.className = 'fillerFlower';
    filler.style.left = `${x}%`;
    filler.style.top = `${y}%`;
    filler.style.setProperty('--rot', `${rotation}deg`);
    filler.style.setProperty('--size', `${size}px`);
    filler.style.setProperty('--delay', `${(index * 0.05).toFixed(2)}s`);
    filler.style.zIndex = String(1 + Math.round(y / 12));
    fragment.appendChild(filler);
  });

  els.peonies.appendChild(fragment);
}

function buildPhotoGarden() {
  const fragment = document.createDocumentFragment();

  GARDEN_POSITIONS.forEach(([x, y, rotation, size], index) => {
    const flower = document.createElement('button');
    flower.type = 'button';
    flower.className = 'photoPeony bloomed';
    flower.dataset.index = String(index);
    flower.setAttribute('aria-label', `Deschide floarea cu fotografia ${index + 1}`);
    flower.style.left = `${x}%`;
    flower.style.top = `${y}%`;
    flower.style.setProperty('--rot', `${rotation}deg`);
    flower.style.setProperty('--size', `${size}px`);
    flower.style.setProperty('--delay', `${(index * 0.06).toFixed(2)}s`);
    flower.innerHTML = `
      <span class="flowerCore" aria-hidden="true"></span>
      <span class="unlockMark" aria-hidden="true">✓</span>
    `;
    flower.addEventListener('click', () => openFlower(index, flower));
    fragment.appendChild(flower);
  });

  FILLER_POSITIONS.forEach(([x, y, rotation, size], index) => {
    const filler = document.createElement('span');
    filler.className = 'gardenFillerFlower';
    filler.style.left = `${x}%`;
    filler.style.top = `${y}%`;
    filler.style.setProperty('--rot', `${rotation}deg`);
    filler.style.setProperty('--size', `${Math.round(size * 0.94)}px`);
    filler.style.setProperty('--delay', `${(index * 0.05).toFixed(2)}s`);
    filler.style.zIndex = String(1 + Math.round(y / 12));
    fragment.appendChild(filler);
  });

  els.photoGarden.appendChild(fragment);
}

function buildCakeCandles() {
  els.candlesRow.innerHTML = '';
  for (let index = 1; index <= 17; index += 1) {
    const candle = document.createElement('button');
    candle.type = 'button';
    candle.className = 'candle';
    candle.dataset.candle = String(index);
    candle.setAttribute('aria-label', `Stinge lumânarea ${index}`);
    candle.setAttribute('aria-pressed', 'false');
    candle.innerHTML = '<span class="flame"></span><span class="wax"></span><span class="candleBase"></span>';
    candle.addEventListener('click', () => blowOutCandle(candle));
    els.candlesRow.appendChild(candle);
  }
  els.candles = $$('.candle', els.candlesRow);
}

/* =========================================================
   WATERING CAN — POINTER EVENTS WORK FOR MOUSE + TOUCH + PEN
   ========================================================= */
function setupWateringCan() {
  let pointerId = null;
  let offsetX = 0;
  let offsetY = 0;

  els.wateringCan.addEventListener('pointerdown', event => {
    if (state.bloomFinished) return;
    event.preventDefault();
    pointerId = event.pointerId;
    state.draggingCan = true;
    els.wateringCan.classList.add('dragging');
    els.wateringCan.setPointerCapture(pointerId);

    const rect = els.wateringCan.getBoundingClientRect();
    offsetX = event.clientX - (rect.left + rect.width / 2);
    offsetY = event.clientY - (rect.top + rect.height / 2);
    moveWateringCan(event.clientX, event.clientY, offsetX, offsetY);
  });

  els.wateringCan.addEventListener('pointermove', event => {
    if (!state.draggingCan || event.pointerId !== pointerId) return;
    event.preventDefault();
    moveWateringCan(event.clientX, event.clientY, offsetX, offsetY);
  });

  const endDrag = event => {
    if (!state.draggingCan || (pointerId !== null && event.pointerId !== pointerId)) return;
    state.draggingCan = false;
    pointerId = null;
    els.wateringCan.classList.remove('dragging');
    stopWatering();
    els.wateringCan.style.setProperty('--can-rotate', '0deg');
  };

  els.wateringCan.addEventListener('pointerup', endDrag);
  els.wateringCan.addEventListener('pointercancel', endDrag);
  els.wateringCan.addEventListener('lostpointercapture', () => {
    state.draggingCan = false;
    pointerId = null;
    els.wateringCan.classList.remove('dragging');
    stopWatering();
    els.wateringCan.style.setProperty('--can-rotate', '0deg');
  });
}

function moveWateringCan(clientX, clientY, offsetX, offsetY) {
  const parent = els.wateringCan.offsetParent;
  const parentRect = parent.getBoundingClientRect();
  const canRect = els.wateringCan.getBoundingClientRect();

  /* left/top represent the can's centre because CSS translates it by -50%. */
  let left = clientX - parentRect.left - offsetX;
  let top = clientY - parentRect.top - offsetY;

  const halfWidth = canRect.width / 2;
  const halfHeight = canRect.height / 2;
  const margin = 8;
  left = clamp(left, halfWidth * 0.45, parentRect.width - halfWidth * 0.45);
  top = clamp(top, halfHeight * 0.45, parentRect.height - halfHeight * 0.45 - margin);

  els.wateringCan.style.left = `${left}px`;
  els.wateringCan.style.top = `${top}px`;

  updateSpotlight(clientX, clientY);
  evaluateWateringPosition();
}

function evaluateWateringPosition() {
  const canRect = els.wateringCan.getBoundingClientRect();
  const flowerRect = els.peonies.getBoundingClientRect();

  /* The spout is on the right side of the can. This generous target is
     intentionally touch-friendly, especially on narrow iPhone screens. */
  const spoutX = canRect.right + Math.min(34, canRect.width * 0.18);
  const spoutY = canRect.top + canRect.height * 0.34;

  const horizontalPadding = Math.max(30, flowerRect.width * 0.08);
  const verticalPadding = Math.max(50, flowerRect.height * 0.22);
  const overBouquet =
    spoutX >= flowerRect.left - horizontalPadding &&
    spoutX <= flowerRect.right + horizontalPadding &&
    spoutY >= flowerRect.top - verticalPadding &&
    spoutY <= flowerRect.bottom * 0.92;

  if (overBouquet && state.draggingCan && !state.bloomFinished) {
    els.wateringCan.style.setProperty('--can-rotate', '18deg');
    startWatering(spoutX, spoutY);
  } else {
    els.wateringCan.style.setProperty('--can-rotate', '0deg');
    stopWatering();
  }
}

function startWatering(spoutX, spoutY) {
  state.watering = true;
  if (state.waterTimer) return;

  createDroplet(spoutX, spoutY);
  updateBloom(state.bloom + 1.6);

  state.waterTimer = window.setInterval(() => {
    if (!state.watering || state.bloomFinished) {
      stopWatering();
      return;
    }
    const rect = els.wateringCan.getBoundingClientRect();
    createDroplet(rect.right + Math.min(34, rect.width * 0.18), rect.top + rect.height * 0.34);
    updateBloom(state.bloom + 1.6);
  }, 150);
}

function stopWatering() {
  state.watering = false;
  if (state.waterTimer) {
    window.clearInterval(state.waterTimer);
    state.waterTimer = null;
  }
}

function createDroplet(clientX, clientY) {
  const layerRect = els.dropletsLayer.getBoundingClientRect();
  const count = window.innerWidth <= 600 ? 2 : 3;

  for (let i = 0; i < count; i += 1) {
    const drop = document.createElement('span');
    drop.className = 'waterDrop';
    drop.style.left = `${clientX - layerRect.left + random(-8, 10)}px`;
    drop.style.top = `${clientY - layerRect.top + random(-4, 7)}px`;
    drop.style.animationDuration = `${random(650, 930)}ms`;
    drop.style.transform = `scale(${random(70, 105) / 100})`;
    els.dropletsLayer.appendChild(drop);
    window.setTimeout(() => drop.remove(), 1050);
  }
}

function updateBloom(value) {
  state.bloom = clamp(value, 0, 100);
  const rounded = Math.round(state.bloom);
  els.bloomPct.textContent = `${rounded}%`;
  els.progressFill.style.width = `${state.bloom}%`;
  els.progressBar.setAttribute('aria-valuenow', String(rounded));

  const flowers = $$('.peony', els.peonies);
  const fillers = $$('.fillerFlower', els.peonies);
  const numberToBloom = Math.floor((state.bloom / 100) * flowers.length);
  flowers.forEach((flower, index) => {
    flower.classList.toggle('bloomed', index < numberToBloom);
    if (index >= numberToBloom) {
      const partial = clamp((state.bloom / 100 * flowers.length) - index, 0, 1);
      flower.style.setProperty('--bloom', String(0.42 + partial * 0.58));
      flower.style.filter = `saturate(${0.55 + partial * 0.5}) brightness(${0.72 + partial * 0.28})`;
    } else {
      flower.style.removeProperty('filter');
      flower.style.setProperty('--bloom', '1');
    }
  });

  const fillerBloomCount = Math.floor((state.bloom / 100) * fillers.length);
  fillers.forEach((flower, index) => flower.classList.toggle('bloomed', index < fillerBloomCount));

  if (state.bloom >= 100 && !state.bloomFinished) completeBloom();
}

function completeBloom() {
  if (state.bloomFinished) return;
  state.bloomFinished = true;
  stopWatering();
  updateBloom(100);
  $$('.peony, .fillerFlower', els.peonies).forEach((flower, index) => {
    window.setTimeout(() => flower.classList.add('bloomed'), index * 38);
  });
  els.bouquet.classList.add('is-bloomed');
  els.wateringCan.style.opacity = '0';
  els.wateringCan.style.pointerEvents = 'none';
  window.setTimeout(() => {
    els.bloomDoneOverlay.classList.remove('hidden');
    els.continueToPhotosBtn.focus({ preventScroll: true });
  }, prefersReducedMotion() ? 0 : 650);
}

function placeWateringCanForCurrentScreen() {
  const stage = els.wateringCan.offsetParent;
  if (!stage || !els.bouquet) return;

  const stageRect = stage.getBoundingClientRect();
  const bouquetRect = els.bouquet.getBoundingClientRect();
  const canRect = els.wateringCan.getBoundingClientRect();
  const isPhone = window.innerWidth <= 700;

  let left;
  let top;

  if (isPhone) {
    left =
      bouquetRect.left -
      stageRect.left +
      bouquetRect.width * 0.28;

    top =
      bouquetRect.top -
      stageRect.top +
      bouquetRect.height * 0.66;
  } else {
    left =
      bouquetRect.right -
      stageRect.left +
      canRect.width * 0.22;

    top =
      bouquetRect.top -
      stageRect.top +
      bouquetRect.height * 0.58;
  }

  const halfWidth = canRect.width / 2;
  const halfHeight = canRect.height / 2;

  left = clamp(
    left,
    halfWidth + 12,
    stageRect.width - halfWidth - 12
  );

  top = clamp(
    top,
    halfHeight + 12,
    stageRect.height - halfHeight - 12
  );

  els.wateringCan.style.left = `${left}px`;
  els.wateringCan.style.top = `${top}px`;
}

function updateSpotlight(clientX, clientY) {
  const rect = els.bouquetWrap.getBoundingClientRect();
  els.spotlight.style.left = `${clientX - rect.left}px`;
  els.spotlight.style.top = `${clientY - rect.top}px`;
}

/* =========================================================
   PHOTO OVERLAY + MEMORIES
   ========================================================= */
function openFlower(index, flowerButton) {
  state.currentFlower = index;
  state.lastFocusedElement = flowerButton;

  els.overlayPhoto.src = PHOTOS[index];
  els.overlayPhoto.alt = `Fotografia ${index + 1}`;
  els.overlayPhoto.classList.remove('zoomed');
  els.overlayZoomHint.textContent = 'Atinge fotografia pentru zoom';
  els.overlayMemoryText.textContent = MEMORIES[index];
  els.overlayMemoryText.classList.add('hidden');
  els.overlayCard.classList.remove('memory-visible');
  els.revealMemoryBtn.classList.remove('hidden');
  els.revealMemoryBtn.disabled = false;

  if (state.unlocked.has(index)) {
    els.revealMemoryBtn.textContent = 'Descoperă amintirea ❤️';
  } else {
    els.revealMemoryBtn.innerHTML = 'Descoperă amintirea <span aria-hidden="true">❤️</span>';
  }

  els.overlayRoot.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => els.overlayClose.focus({ preventScroll: true }), 30);
}

function closeOverlay() {
  if (els.overlayRoot.classList.contains('hidden')) return;

  els.overlayRoot.classList.add('hidden');
  els.overlayPhoto.classList.remove('zoomed');
  document.body.style.overflow = '';

  if (state.unlocked.size === 12 && state.step === 4) {
    showCakeContinueButton();
  } else {
    state.lastFocusedElement?.focus?.({ preventScroll: true });
  }
}

function showCakeContinueButton() {
  if (!els.allMemoriesMessage) return;

  els.allMemoriesMessage.innerHTML = `
    <div class="cakeContinueCard">
      <p>Ai descoperit toate cele 12 amintiri ❤️</p>
      <button
        id="continueToCakeBtn"
        class="btn primary"
        type="button"
      >
        🎂 Continuă către tort
      </button>
    </div>
  `;

  els.allMemoriesMessage.classList.remove('hidden');

  const continueToCakeBtn = $('#continueToCakeBtn');

  continueToCakeBtn.addEventListener('click', () => {
    els.allMemoriesMessage.classList.add('hidden');
    showStep(10);
  });

  els.allMemoriesMessage.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'center'
  });

  window.setTimeout(() => {
    continueToCakeBtn.focus({ preventScroll: true });
  }, 400);
}

function togglePhotoZoom() {
  const zoomed = els.overlayPhoto.classList.toggle('zoomed');
  els.overlayZoomHint.textContent = zoomed ? 'Atinge din nou pentru a micșora' : 'Atinge fotografia pentru zoom';
}

function revealCurrentMemory() {
  const index = state.currentFlower;
  if (index === null || index === undefined) return;

  els.overlayMemoryText.classList.remove('hidden');
  els.overlayCard.classList.add('memory-visible');
  els.revealMemoryBtn.classList.add('hidden');

  if (!state.unlocked.has(index)) {
    state.unlocked.add(index);
    const flower = $(`.photoPeony[data-index="${index}"]`, els.photoGarden);
    flower?.classList.add('unlocked');
    flower?.setAttribute('aria-label', `Deschide floarea descoperită ${index + 1}`);
    updateUnlockedCount();
    smallPetalBurst(flower);
  }
}

function updateUnlockedCount() {
  const count = state.unlocked.size;
  els.unlockedCount.textContent = String(count);

 if (count === 12 && !state.finalMemoryTransitionStarted) {
  state.finalMemoryTransitionStarted = true;
  showToast('Ai descoperit toate cele 12 amintiri ❤️');
  burstConfetti(22, true);
  }
}

function pulseLockedFlowers() {
  $$('.photoPeony:not(.unlocked)', els.photoGarden).forEach((flower, index) => {
    flower.animate(
      [
        { transform: getComputedStyle(flower).transform, filter: 'brightness(1)' },
        { transform: `${getComputedStyle(flower).transform} scale(1.05)`, filter: 'brightness(1.22)' },
        { transform: getComputedStyle(flower).transform, filter: 'brightness(1)' }
      ],
      { duration: 520, delay: index * 35, easing: 'ease-out' }
    );
  });
}

function smallPetalBurst(target) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  for (let i = 0; i < 8; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'heartParticle';
    particle.textContent = i % 3 === 0 ? '✨' : '🌸';
    particle.style.left = `${rect.left + rect.width / 2 + random(-16, 16)}px`;
    particle.style.top = `${rect.top + rect.height / 2 + random(-8, 8)}px`;
    particle.style.animationDelay = `${i * 30}ms`;
    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1900);
  }
}

/* =========================================================
   RIBBON + LETTER
   ========================================================= */

function openLetter() {
  if (state.typewriterRunning || state.letterFinished) return;
  state.typewriterRunning = true;
  els.openLetterBtn.disabled = true;
  els.openLetterBtn.classList.add('opening');
  els.openLetterBtn.setAttribute('aria-label', 'Scrisoarea aniversară se deschide');

  window.setTimeout(() => {
    els.openLetterBtn.classList.add('opened');
    els.letterPaper.classList.remove('hidden');
    els.typewriter.textContent = '';

    window.setTimeout(() => {
      typeText(LETTER_TEXT, els.typewriter, 24, () => {
        state.typewriterRunning = false;
        state.letterFinished = true;
        els.unlockLastLine.classList.remove('hidden');
        els.restartExperienceBtn.classList.remove('hidden');
        burstConfetti(18, true);
      });
    }, prefersReducedMotion() ? 0 : 700);
  }, prefersReducedMotion() ? 0 : 850);
}

function restartExperience() {
  stopWatering();
  closeOverlay();

  state.step = 1;
  state.bloom = 0;
  state.bloomFinished = false;
  state.currentFlower = null;
  state.unlocked.clear();
  state.draggingCan = false;
  state.watering = false;
  state.typewriterRunning = false;
  state.letterFinished = false;
  state.cakeTransitionStarted = false;
  state.candlesOut.clear();
  state.lastFocusedElement = null;
  state.finalMemoryTransitionStarted = false;

  window.clearTimeout(state.toastTimer);
  els.toast.classList.remove('show');
  els.toast.setAttribute('aria-hidden', 'true');
  els.confettiCanvas.innerHTML = '';

  els.bouquet.classList.remove('is-bloomed');
  els.bloomDoneOverlay.classList.add('hidden');
  els.wateringCan.style.opacity = '';
  els.wateringCan.style.pointerEvents = '';
  els.wateringCan.style.setProperty('--can-rotate', '0deg');
  updateBloom(0);

  $$('.photoPeony', els.photoGarden).forEach((flower, index) => {
    flower.classList.remove('unlocked');
    flower.setAttribute('aria-label', `Deschide floarea cu fotografia ${index + 1}`);
  });
  els.allMemoriesMessage?.classList.add('hidden');
  updateUnlockedCount();

  els.candles.forEach((candle, index) => {
    candle.classList.remove('out');
    candle.setAttribute('aria-pressed', 'false');
    candle.setAttribute('aria-label', `Stinge lumânarea ${index + 1}`);
  });
  els.candleCounter.textContent = 'Lumânări stinse: 0 / 17';
  els.cakeCompleteMessage.classList.add('hidden');

  els.openLetterBtn.disabled = false;
  els.openLetterBtn.classList.remove('opening', 'opened');
  els.openLetterBtn.setAttribute('aria-label', 'Deschide scrisoarea aniversară');
  els.letterPaper.classList.add('hidden');
  els.typewriter.textContent = '';
  els.unlockLastLine.classList.add('hidden');
  els.restartExperienceBtn.classList.add('hidden');

  try {
    els.bgm.pause();
    els.bgm.currentTime = 0;
  } catch (_) {}
  state.musicOn = false;

  document.body.classList.add('experienceRestarting');
  window.setTimeout(() => {
    showStep(1, false);
    document.body.classList.remove('experienceRestarting');
    els.enterBtn.focus({ preventScroll: true });
  }, prefersReducedMotion() ? 0 : 360);
}

function typeText(text, element, speed, done) {
  if (prefersReducedMotion()) {
    element.textContent = text;
    done?.();
    return;
  }

  let index = 0;
  const tick = () => {
    element.textContent += text[index] ?? '';
    index += 1;
    if (index < text.length) {
      const punctuationPause = /[.!?\n]/.test(text[index - 1]) ? 80 : 0;
      window.setTimeout(tick, speed + punctuationPause);
    } else {
      done?.();
    }
  };
  tick();
}

/* =========================================================
   CONFETTI + FINAL SCENE
   ========================================================= */
function burstConfetti(amount = 100, gentle = false) {
  const symbols = ['❤', '♡', '✦'];
  const colors = ['#f4abc8', '#ffd4e5', '#d98ab1', '#f2cf91', '#fff6ed', '#c884a5'];
  const mobileMultiplier = window.innerWidth <= 600 ? 0.65 : 1;
  const count = Math.max(8, Math.round(amount * mobileMultiplier));

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('span');
    const kind = i % 7 === 0 ? 'heart' : i % 3 === 0 ? 'petal' : 'paper';
    piece.className = `confettiPiece ${kind === 'paper' ? '' : kind}`.trim();

    if (kind === 'heart') piece.textContent = symbols[i % symbols.length];
    piece.style.left = `${random(0, 100)}vw`;
    piece.style.setProperty('--piece-color', colors[i % colors.length]);
    piece.style.setProperty('--drift', `${random(-130, 130)}px`);
    piece.style.setProperty('--spin', `${random(300, 900)}deg`);
    piece.style.setProperty('--fall', `${gentle ? random(3500, 5600) : random(2400, 4300)}ms`);
    piece.style.animationDelay = `${random(0, gentle ? 800 : 350)}ms`;
    piece.style.opacity = String(random(65, 100) / 100);
    els.confettiCanvas.appendChild(piece);
    window.setTimeout(() => piece.remove(), gentle ? 6500 : 5200);
  }
}

function blowOutCandle(candle) {
  const number = candle.dataset.candle;
  if (state.candlesOut.has(number)) return;
  state.candlesOut.add(number);
  candle.classList.add('out');
  candle.setAttribute('aria-pressed', 'true');
  els.candleCounter.textContent = `Lumânări stinse: ${state.candlesOut.size} / 17`;

  if (state.candlesOut.size === 17 && !state.cakeTransitionStarted) {
    state.cakeTransitionStarted = true;
    els.cakeCompleteMessage.classList.remove('hidden');
    showToast('Ai stins toate cele 17 lumânări ✨');
    burstConfetti(70, true);
    window.setTimeout(() => showStep(8), prefersReducedMotion() ? 500 : 2600);
  }
}

/* =========================================================
   MUSIC
   ========================================================= */
async function startBackgroundMusic() {
  const source = els.bgm.querySelector('source')?.getAttribute('src');
  if (!source) return;
  try {
    els.bgm.loop = true;
    els.bgm.volume = 0.22;
    await els.bgm.play();
    state.musicOn = true;
  } catch (error) {
    state.musicOn = false;
    showToast('iPhone-ul poate cere încă o atingere pentru a porni muzica.');
    console.warn('Muzica nu a putut porni:', error);
  }
}

/* =========================================================
   ACCESSIBILITY + HELPERS
   ========================================================= */
function handleGlobalKeydown(event) {
  if (event.key === 'Escape' && !els.overlayRoot.classList.contains('hidden')) {
    closeOverlay();
    return;
  }

  if (event.key === 'Tab' && !els.overlayRoot.classList.contains('hidden')) {
    trapFocusInsideOverlay(event);
  }
}

function trapFocusInsideOverlay(event) {
  const focusable = $$('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', els.overlayCard)
    .filter(element => element.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('show');
  els.toast.setAttribute('aria-hidden', 'false');
  state.toastTimer = window.setTimeout(() => {
    els.toast.classList.remove('show');
    els.toast.setAttribute('aria-hidden', 'true');
  }, 2800);
}

function makePlaceholder(number) {
  const palettes = [
    ['#f9c8dc', '#9e5b87'], ['#ffd7e6', '#a96c9a'], ['#efb8d4', '#70456e'],
    ['#f6d6c9', '#ad6685'], ['#e9c4dd', '#835f91'], ['#ffd2d8', '#a84e78'],
    ['#eec6e6', '#75518e'], ['#f8c5cf', '#985978'], ['#f5d1e3', '#a15f95'],
    ['#ffd8cc', '#9f5877'], ['#e9c9e2', '#6f4b7f'], ['#f7c5dc', '#8e4c7a']
  ];
  const [start, end] = palettes[(number - 1) % palettes.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1000" viewBox="0 0 1200 1000">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${start}"/>
          <stop offset="1" stop-color="${end}"/>
        </linearGradient>
        <filter id="b"><feGaussianBlur stdDeviation="45"/></filter>
      </defs>
      <rect width="1200" height="1000" fill="url(#g)"/>
      <circle cx="220" cy="210" r="170" fill="#fff" opacity=".16" filter="url(#b)"/>
      <circle cx="980" cy="760" r="230" fill="#fff" opacity=".11" filter="url(#b)"/>
      <g fill="none" stroke="#fff" opacity=".72">
        <circle cx="600" cy="480" r="138" stroke-width="3"/>
        <circle cx="600" cy="480" r="112" stroke-width="1" opacity=".5"/>
      </g>
      <text x="600" y="455" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="48">Fotografia ta</text>
      <text x="600" y="525" text-anchor="middle" fill="#fff" opacity=".82" font-family="Arial,sans-serif" font-size="28">Amintirea ${number}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), delay);
  };
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
