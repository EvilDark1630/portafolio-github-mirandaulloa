const timeDisplay  = document.getElementById('time-display');
const modeTag      = document.getElementById('mode-tag');
const nextTag      = document.getElementById('next-tag');
const sessionCount = document.getElementById('session-count');
const btnToggle    = document.getElementById('btn-toggle');
const btnReset     = document.getElementById('btn-reset');
const btnSkip      = document.getElementById('btn-skip');
const ringProg     = document.getElementById('ring-prog');
const modePills    = document.querySelectorAll('.mode-pill');

const RING_FULL = 603;

let workMins  = 25;
let breakMins = 5;
let totalSecs = workMins * 60;
let remaining = totalSecs;
let isRunning = false;
let isBreak   = false;
let sessions  = 1;
let interval  = null;

function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateRing() {
  const ratio  = remaining / totalSecs;
  const offset = RING_FULL * (1 - ratio);
  ringProg.style.strokeDashoffset = offset;
}

function updateUI() {
  timeDisplay.textContent = fmt(remaining);
  updateRing();

  if (isBreak) {
    modeTag.textContent = 'DESCANSO';
    nextTag.textContent = `↑ enfoque en ${fmt(remaining)}`;
    ringProg.classList.add('break-mode');
    document.title = `☕ ${fmt(remaining)} — Descanso`;
  } else {
    modeTag.textContent = 'ENFOQUE';
    nextTag.textContent = `↓ descanso en ${fmt(remaining)}`;
    ringProg.classList.remove('break-mode');
    document.title = `🍅 ${fmt(remaining)} — Enfoque`;
  }
}

function tick() {
  if (remaining <= 0) {
    clearInterval(interval);
    isRunning = false;
    btnToggle.textContent = 'Iniciar';
    btnToggle.classList.remove('running');
    timeDisplay.classList.remove('ticking');
    switchMode();
    return;
  }
  remaining--;

  timeDisplay.style.color = remaining <= 10 ? 'var(--accent)' : '';

  updateUI();
}

function switchMode() {
  isBreak = !isBreak;
  if (!isBreak) sessions++;
  sessionCount.textContent = sessions;
  totalSecs = (isBreak ? breakMins : workMins) * 60;
  remaining = totalSecs;
  updateUI();
}

function startStop() {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    btnToggle.textContent = 'Reanudar';
    btnToggle.classList.remove('running');
    timeDisplay.classList.remove('ticking');
  } else {
    interval  = setInterval(tick, 1000);
    isRunning = true;
    btnToggle.textContent = 'Pausar';
    btnToggle.classList.add('running');
    timeDisplay.classList.add('ticking');
  }
}

function reset() {
  clearInterval(interval);
  isRunning = false;
  isBreak   = false;
  sessions  = 1;
  sessionCount.textContent = sessions;
  totalSecs = workMins * 60;
  remaining = totalSecs;
  btnToggle.textContent = 'Iniciar';
  btnToggle.classList.remove('running');
  timeDisplay.classList.remove('ticking');
  ringProg.classList.remove('break-mode');
  document.title = 'Pomoro — Temporizador Pomodoro';
  updateUI();
}

function skip() {
  clearInterval(interval);
  isRunning = false;
  btnToggle.textContent = 'Iniciar';
  btnToggle.classList.remove('running');
  timeDisplay.classList.remove('ticking');
  switchMode();
}

btnToggle.addEventListener('click', startStop);
btnReset.addEventListener('click', reset);
btnSkip.addEventListener('click', skip);

modePills.forEach(pill => {
  pill.addEventListener('click', () => {
    modePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    workMins  = parseInt(pill.dataset.work);
    breakMins = parseInt(pill.dataset.break);
    reset();
  });
});

updateUI();
