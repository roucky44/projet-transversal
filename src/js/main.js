  // Popup "Comment jouer ?"
  const howToPlayBtn = document.getElementById('how-to-play');
  const popup = document.getElementById('how-to-play-popup');
  const closePopup = document.getElementById('close-how-to-play');

  howToPlayBtn.addEventListener('click', function(e) {
    e.preventDefault();
    popup.style.display = 'flex';
  });

  closePopup.addEventListener('click', function() {
    popup.style.display = 'none';
  });

  // Fermer le popup en cliquant en dehors du contenu
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });


  
  // Sélectionne toutes les cartes
  const cards = document.querySelectorAll('.game-class .card');
  let flippedCards = [];
  let lockBoard = false;

  // Pour le vrai memory, il faudrait mélanger les cartes et leur donner des "valeurs" (ici, on prend l'index comme valeur)
  cards.forEach((card, idx) => {
    card.dataset.memory = idx % 5; // 2 cartes de chaque valeur (pour 10 cartes)
    card.addEventListener('click', function () {
      if (lockBoard) return;
      if (card.classList.contains('flipped')) return;

      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lockBoard = true;
        const [card1, card2] = flippedCards;
        if (card1.dataset.memory === card2.dataset.memory) {
          // Match trouvé, on laisse les cartes retournées
          flippedCards = [];
          lockBoard = false;
        } else {
          // Pas de match, on retourne les cartes après un délai
          setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
          }, 1000);
        }
      }
    });
  });

  // Optionnel : mélanger les cartes au chargement
  (function shuffle() {
    const gameClass = document.querySelector('.game-class');
    const cardsArr = Array.from(cards);
    cardsArr.sort(() => Math.random() - 0.5);
    cardsArr.forEach(card => gameClass.appendChild(card));
  })();