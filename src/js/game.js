const images = [
  "/assets/img/game/cards/dove.png",
  "/assets/img/game/cards/hold-hands.png",
  "/assets/img/game/cards/heart.png",
  "/assets/img/game/cards/globe.png",
  "/assets/img/game/cards/unlock.png",
  "/assets/img/game/cards/rainbow.png",
  "/assets/img/game/cards/hammer.png",
  "/assets/img/game/cards/tree.png",
  "/assets/img/game/cards/chain.png",
  "/assets/img/game/cards/group.png",
];

// Duplicate and shuffle
let cardsData = [...images, ...images]
  .map((img, i) => ({ img, id: i }))
  .sort(() => Math.random() - 0.5);

const gameClass = document.querySelector(".game-class");
gameClass.innerHTML = "";

cardsData.forEach((card, idx) => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardDiv.dataset.img = card.img;

  cardDiv.innerHTML = `
    <div class="content">
      <div class="back">
        <div class="back-content">
          <img src="/assets/icons/footer/simplified_logo.svg" alt="memory" style="width:40px; height:40px; object-fit:contain;">
        </div>
      </div>
      <div class="front">
        <img src="${card.img}" alt="memory" style="width:80px; height:80px; object-fit:contain;">
      </div>
    </div>
  `;
  gameClass.appendChild(cardDiv);
});

// Memory game logic
let flipped = [];
let lock = false;

// --- Ajout compteur de coups et timer ---
let flipCount = 0;
let startTime = null;
let endTime = null;

// Affichage (ajoute ces éléments dans ton HTML si tu veux les voir)
const statsDiv = document.createElement("div");
statsDiv.className = "game-stats";
statsDiv.style = "text-align:center;margin-bottom:2rem;font-size:1.2rem;";
statsDiv.innerHTML = `<span id="flip-count">Coups : 0</span> | <span id="timer">Temps : 0s</span>`;
gameClass.parentNode.insertBefore(statsDiv, gameClass);

function updateStats() {
  document.getElementById("flip-count").textContent = `Coups : ${flipCount}`;
  if (startTime) {
    const now = endTime ? endTime : Date.now();
    const seconds = Math.floor((now - startTime) / 1000);
    document.getElementById("timer").textContent = `Temps : ${seconds}s`;
  }
}

let timerInterval = null;
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateStats, 1000);
  }
}
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// --- Memory game logic ---
gameClass.addEventListener("click", function (e) {
  const card = e.target.closest(".card");
  if (
    !card ||
    card.classList.contains("flipped") ||
    card.classList.contains("found") ||
    lock
  )
    return;

  // Premier flip : démarre le timer
  if (flipCount === 0) {
    startTime = Date.now();
    endTime = null;
    startTimer();
  }

  card.classList.add("flipped");
  flipped.push(card);
  flipCount++;
  updateStats();

  if (flipped.length === 2) {
    lock = true;
    const [c1, c2] = flipped;
    if (c1.dataset.img === c2.dataset.img) {
      c1.classList.add("found");
      c2.classList.add("found");
      flipped = [];
      lock = false;

      // Fin du jeu ? (toutes les cartes trouvées)
      if (
        document.querySelectorAll(".card.found").length === cardsData.length
      ) {
        endTime = Date.now();
        updateStats();
        stopTimer();

        const totalSeconds = Math.floor((endTime - startTime) / 1000);
        if (totalSeconds < 60) {
          document.getElementById("popup-drink").style.display = "flex";
        } else {
          document.getElementById("popup-goodie").style.display = "flex";
        }
      }
    } else {
      c1.classList.add("wrong");
      c2.classList.add("wrong");
      setTimeout(() => {
        c1.classList.remove("flipped", "wrong");
        c2.classList.remove("flipped", "wrong");
        flipped = [];
        lock = false;
      }, 1000);
    }
  }
});

// Popup "Comment jouer ?"
const howToPlayBtn = document.getElementById("how-to-play");
const popup = document.getElementById("how-to-play-popup");
const closePopup = document.getElementById("close-how-to-play");

howToPlayBtn.addEventListener("click", function (e) {
  e.preventDefault();
  popup.style.display = "flex";
});

closePopup.addEventListener("click", function () {
  popup.style.display = "none";
});

// Fermer le popup en cliquant en dehors du contenu
popup.addEventListener("click", function (e) {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});
