// Blocco controllo data: consente l'accesso solo dal 3 dicembre in poi
const today = new Date();


// Immagini memory (ognuna appare due volte)
const IMAGES = [
    "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg", "8.jpeg"
];
const PAIRS = IMAGES.concat(IMAGES); // 16 carte, 8 coppie
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

const puzzleArea = document.getElementById("puzzle-area");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupImage = document.getElementById("popup-image");
const popupMessage = document.getElementById("popup-message");
const nextBtn = document.getElementById("next-btn");
const homeBtn = document.getElementById("home-btn");

// Mescola le carte solo all'inizio
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Crea le carte del memory
function createCards() {
    cards = [];
    let images = PAIRS.slice();
    shuffle(images);
    images.forEach((img, idx) => {
        cards.push({
            img: img,
            id: idx,
            matched: false,
            flipped: false
        });
    });
}

// Mostra le carte
function renderCards() {
    puzzleArea.innerHTML = "";
    cards.forEach((card, idx) => {
        const cardEl = document.createElement("div");
        cardEl.className = "memory-card" + (card.flipped || card.matched ? " flipped" : "");
        cardEl.dataset.index = idx;
        cardEl.onclick = () => handleCardClick(idx);
        cardEl.ontouchstart = (e) => { e.preventDefault(); handleCardClick(idx); };
        // Fronte (immagine)
        const front = document.createElement("div");
        front.className = "card-front";
        const img = document.createElement("img");
        img.src = card.img;
        img.alt = "";
        front.appendChild(img);
        // Retro
        const back = document.createElement("div");
        back.className = "card-back";
        back.innerHTML = "<span>?</span>";
        cardEl.appendChild(front);
        cardEl.appendChild(back);
        puzzleArea.appendChild(cardEl);
    });
}

// Gestione click/touch sulle carte
function handleCardClick(idx) {
    if (lockBoard) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    card.flipped = true;
    renderCards();
    if (!firstCard) {
        firstCard = card;
    } else if (!secondCard && card !== firstCard) {
        secondCard = card;
        lockBoard = true;
        setTimeout(checkMatch, 700);
    }
}

// Controlla se le due carte sono uguali
function checkMatch() {
    if (firstCard.img === secondCard.img) {
        firstCard.matched = true;
        secondCard.matched = true;
        matches += 1;
        if (matches === IMAGES.length) {
            setTimeout(showPopup, 700);
            return;
        }
    } else {
        firstCard.flipped = false;
        secondCard.flipped = false;
        // NIENTE shuffle dopo errore!
    }
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    renderCards();
}

// Mostra il popup finale con Kevin narratore
function showPopup() {
    popup.classList.remove("d-none");
    popupTitle.textContent = "BRAVA AMORE!";
    popupMessage.innerHTML = `ORMAI TI STAI ABITUANDO AI TUOI GIOCHINI<br>
    TI DICO SOLO CHE IL TUO REGALO C'E LHO DA MOLTO PIÙ TEMPO DI QUELLO CHE PENSI...<br>
    BACI AL PROSSIMO GIOCO`;
    popupImage.innerHTML = `
        <div class="kevin-vignetta">
            <img src="kevin.jpeg" alt="Kevin narratore">
            <div class="kevin-bubble">
                <span>
                    "Si OK questo era facile!<br>
                    vediamo se con i prossimi giochi sarà così?"
                </span>
            </div>
        </div>
    `;
    nextBtn && nextBtn.classList.add("d-none");
    homeBtn.classList.remove("d-none");
}

// Nasconde il popup
function hidePopup() {
    popup.classList.add("d-none");
}

// Avvia il gioco
function startGame() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    createCards();
    renderCards();
    hidePopup();
}

homeBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
});

startGame();
