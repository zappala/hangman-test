// Hangman game logic. The word list (WORDS) comes from words.js,
// which index.html loads before this file.

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const wordEl = document.getElementById("word");
const pipsEl = document.getElementById("pips");
const wrongTextEl = document.getElementById("wrong-text");
const remainingEl = document.getElementById("remaining");
const messageEl = document.getElementById("message");
const lettersEl = document.getElementById("letters");
const newGameBtn = document.getElementById("new-game");
const hintBtn = document.getElementById("hint-btn");
const hintLabelEl = document.getElementById("hint-label");
const hintPanelEl = document.getElementById("hint-panel");
const hintPosEl = document.getElementById("hint-pos");
const hintFirstEl = document.getElementById("hint-first");

let entry = null; // { word, pos, definition }
let word = "";
let guessed = new Set();
let wrongGuesses = 0;
let maxWrong = 0;
let gameOver = false;

function allowedWrongGuesses(length) {
  return Math.ceil(length * 1.5);
}

// ---------- Difficulty ----------

const LEVELS = ["easy", "medium", "hard"];
const LEVEL_KEY = "hangman.level";
const levelButtons = document.querySelectorAll(".segmented button");

// Remember the player's choice between visits. Storage can be blocked
// (private windows, file:// in some browsers), so failures are ignored.
function loadLevel() {
  try {
    const saved = localStorage.getItem(LEVEL_KEY);
    if (LEVELS.includes(saved)) return saved;
  } catch (e) {}
  return "easy";
}

function saveLevel(lv) {
  try {
    localStorage.setItem(LEVEL_KEY, lv);
  } catch (e) {}
}

let level = loadLevel();

function renderLevel() {
  for (const btn of levelButtons) {
    btn.setAttribute("aria-pressed", String(btn.dataset.level === level));
  }
}

// Choosing a difficulty starts a new game with a word from that level.
for (const btn of levelButtons) {
  btn.addEventListener("click", () => {
    level = btn.dataset.level;
    saveLevel(level);
    renderLevel();
    newGame();
  });
}

// Pick a random entry from the chosen difficulty, avoiding an immediate
// repeat of the last word.
function pickEntry() {
  const pool = WORDS.filter((e) => e.level === level);
  let next;
  do {
    next = pool[Math.floor(Math.random() * pool.length)];
  } while (pool.length > 1 && entry && next.word === entry.word);
  return next;
}

// Draws one slot per letter. When the round is lost, letters the player
// never found are shown in the "missed" style.
function renderWord(lost = false) {
  wordEl.innerHTML = "";
  const spoken = [];
  for (const ch of word) {
    const slot = document.createElement("span");
    slot.className = "slot";
    if (guessed.has(ch)) {
      slot.classList.add("shown");
      slot.textContent = ch.toUpperCase();
      spoken.push(ch.toUpperCase());
    } else if (lost) {
      slot.classList.add("missed");
      slot.textContent = ch.toUpperCase();
      spoken.push(ch.toUpperCase());
    } else {
      spoken.push("blank");
    }
    wordEl.appendChild(slot);
  }
  wordEl.setAttribute("aria-label", "Word: " + spoken.join(" "));
}

function renderStatus() {
  pipsEl.innerHTML = "";
  for (let i = 0; i < maxWrong; i++) {
    const pip = document.createElement("span");
    pip.className = i < wrongGuesses ? "pip used" : "pip";
    pipsEl.appendChild(pip);
  }
  wrongTextEl.textContent = `${wrongGuesses} of ${maxWrong} used`;
  remainingEl.textContent = maxWrong - wrongGuesses;
}

// ---------- Hints (free and unlimited) ----------

function setHintOpen(open) {
  hintPanelEl.hidden = !open;
  hintBtn.setAttribute("aria-expanded", String(open));
  hintLabelEl.textContent = open ? "Hide hint" : "Show hint";
}

function renderHint() {
  hintPosEl.textContent = entry.pos;
  hintFirstEl.textContent = word[0].toUpperCase();
}

hintBtn.addEventListener("click", () => {
  setHintOpen(hintPanelEl.hidden);
});

// ---------- Letters ----------

function buildLetterButtons() {
  lettersEl.innerHTML = "";
  for (const ch of ALPHABET) {
    const btn = document.createElement("button");
    btn.textContent = ch.toUpperCase();
    btn.setAttribute("aria-label", "Guess " + ch.toUpperCase());
    btn.addEventListener("click", () => guess(ch, btn));
    lettersEl.appendChild(btn);
  }
}

function disableAllLetters() {
  for (const btn of lettersEl.querySelectorAll("button")) {
    btn.disabled = true;
  }
}

function guess(ch, btn) {
  if (gameOver || guessed.has(ch)) return;

  guessed.add(ch);
  btn.disabled = true;

  if (word.includes(ch)) {
    btn.classList.add("correct");
    btn.setAttribute("aria-label", ch.toUpperCase() + ", in the word");
  } else {
    btn.classList.add("wrong");
    btn.setAttribute("aria-label", ch.toUpperCase() + ", not in the word");
    wrongGuesses++;
  }

  renderWord();
  renderStatus();
  checkEnd();
}

// ---------- End of round ----------

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Shows the win/lose box, always followed by the word's definition.
function showMessage(kind, title, detail) {
  messageEl.className = "message " + kind;
  messageEl.innerHTML = "";

  const def = makeEl("div", "definition");
  const head = makeEl("div", "definition-head");
  head.append(
    makeEl("span", "definition-word", word),
    makeEl("span", "pos-pill", entry.pos)
  );
  def.append(head, makeEl("p", "definition-text", entry.definition));

  messageEl.append(
    makeEl("span", "title", title),
    makeEl("span", "detail", detail),
    def
  );
  messageEl.hidden = false;
}

function checkEnd() {
  const won = [...word].every((ch) => guessed.has(ch));
  const lost = wrongGuesses >= maxWrong;

  if (won) {
    gameOver = true;
    const left = maxWrong - wrongGuesses;
    showMessage("win", "You got it!",
      `Solved with ${left} ${left === 1 ? "guess" : "guesses"} to spare.`);
    disableAllLetters();
  } else if (lost) {
    gameOver = true;
    renderWord(true);
    showMessage("lose", "Out of guesses",
      `The word was ${word.toUpperCase()}. Dashed letters are the ones you didn't find.`);
    disableAllLetters();
  }
}

function newGame() {
  entry = pickEntry();
  word = entry.word;
  guessed = new Set();
  wrongGuesses = 0;
  maxWrong = allowedWrongGuesses(word.length);
  gameOver = false;

  messageEl.hidden = true;
  messageEl.innerHTML = "";

  setHintOpen(false);
  renderHint();
  buildLetterButtons();
  renderWord();
  renderStatus();
}

newGameBtn.addEventListener("click", newGame);
renderLevel();
newGame();
