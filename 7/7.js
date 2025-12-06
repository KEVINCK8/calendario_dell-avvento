// --- CONFIGURAZIONE ---
const LEVELS = [
    {
        folder: "puzle1",
        prefix: "5",
        message: "BRAVISSIMA HAI SUPERATO IL LIVELLO 1<br>Passiamo ad uno più difficile visto che sei così brava, non sarà così facile",
        btn: "Livello 2"
    },
    {
        folder: "puzle2",
        prefix: "livello2",
        message: "WOW HAI VERAMENTE UNA DOTE,<br>se completi questo ti prometto che ci sarà un grandissimo indizio...",
        btn: "Livello 3"
    },
    {
        folder: "puzle3",
        prefix: "livello3",
        message: "UFFI!! anche oggi hai vinto tu che palline...<br>mi tocca darti l'indizio",
        btn: "Scopri l'indizio"
    }
];
const GRID_SIZE = 3; // 3x3

// --- ELEMENTI DOM ---
const puzzleBoard = document.getElementById("puzzle-board");
const winPopup = document.getElementById("win-popup");
const backHomeBtn = document.getElementById("back-home-btn");

// --- POPUP NARRATORE ---
function showNarratorPopup(html, btnText, btnCallback) {
    let popup = document.createElement("div");
    popup.className = "popup active";
    popup.innerHTML = `
        <div class="popup-content">
            <img src="narratore.jpg" alt="Narratore" class="popup-img" style="width:90px; height:90px; margin-bottom:16px;">
            <p>${html}</p>
            <button id="narrator-btn">${btnText}</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("narrator-btn").onclick = () => {
        popup.remove();
        btnCallback();
    };
}

// --- VARIABILI DI STATO ---
let currentLevel = 0;
let pieces = [];
let boardState = [];
let draggingIndex = null;

// --- INIZIALIZZAZIONE ---
window.addEventListener("DOMContentLoaded", () => {
    startGame();
    backHomeBtn.addEventListener("click", () => {
        winPopup.classList.remove("active");
        puzzleBoard.innerHTML = "";
        currentLevel = 0;
        startGame();
    });
});

// --- INIZIO GIOCO ---
function startGame() {
    showNarratorPopup(
        "Ciao Vero sono Pina, oggi abbiamo mescolato un po' le carte, giochiamo ai PUZLE!<br>Sei pronta? So che tu sei brava in questo quindi l'ho fatto un po' difficile...",
        "Iniziamo",
        () => startPuzzle(currentLevel)
    );
}

// --- PUZZLE ---
function startPuzzle(levelIdx) {
    pieces = [];
    boardState = [];
    const { folder, prefix } = LEVELS[levelIdx];
    // Carica i pezzi (coordinate y,x)
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            let src = `${folder}/${prefix} (${y}_${x}).jpg`;
            pieces.push({ y, x, src });
        }
    }
    // Mischia i pezzi per la board
    boardState = shuffleArray([...pieces]);
    renderBoard();
}

// --- RENDER BOARD ---
function renderBoard() {
    puzzleBoard.innerHTML = "";
    puzzleBoard.style.pointerEvents = "auto";
    boardState.forEach((piece, idx) => {
        const img = document.createElement("img");
        img.src = piece.src;
        img.className = "puzzle-piece";
        img.draggable = true;
        img.dataset.idx = idx;

        // Drag & Drop desktop
        img.addEventListener("dragstart", e => {
            draggingIndex = idx;
            img.classList.add("dragging");
        });
        img.addEventListener("dragend", e => {
            draggingIndex = null;
            img.classList.remove("dragging");
            puzzleBoard.querySelectorAll(".puzzle-piece").forEach(p => p.classList.remove("over"));
        });
        img.addEventListener("dragover", e => e.preventDefault());
        img.addEventListener("dragenter", e => {
            if (draggingIndex !== null && draggingIndex !== idx) img.classList.add("over");
        });
        img.addEventListener("dragleave", e => img.classList.remove("over"));
        img.addEventListener("drop", e => {
            e.preventDefault();
            if (draggingIndex !== null && draggingIndex !== idx) {
                swapPieces(draggingIndex, idx);
            }
        });

        // Touch mobile
        img.addEventListener("touchstart", e => {
            draggingIndex = idx;
            img.classList.add("dragging");
        }, { passive: false });
        img.addEventListener("touchend", e => {
            img.classList.remove("dragging");
            let touch = e.changedTouches[0];
            let target = document.elementFromPoint(touch.clientX, touch.clientY);
            if (target && target.classList.contains("puzzle-piece")) {
                let targetIdx = parseInt(target.dataset.idx);
                if (draggingIndex !== null && draggingIndex !== targetIdx) {
                    swapPieces(draggingIndex, targetIdx);
                }
            }
            draggingIndex = null;
            puzzleBoard.querySelectorAll(".puzzle-piece").forEach(p => p.classList.remove("over"));
        }, { passive: false });

        puzzleBoard.appendChild(img);
    });
    checkWin();
}

// --- SWAP ---
function swapPieces(idx1, idx2) {
    let temp = boardState[idx1];
    boardState[idx1] = boardState[idx2];
    boardState[idx2] = temp;
    renderBoard();
}

// --- VITTORIA ---
function checkWin() {
    let win = true;
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i].y !== pieces[i].y || boardState[i].x !== pieces[i].x) {
            win = false;
            break;
        }
    }
    if (win) {
        puzzleBoard.style.pointerEvents = "none";
        setTimeout(() => {
            showLevelWinPopup();
        }, 400);
    }
}

function showLevelWinPopup() {
    if (currentLevel < LEVELS.length - 1) {
        showNarratorPopup(
            LEVELS[currentLevel].message,
            LEVELS[currentLevel].btn,
            () => {
                currentLevel++;
                startPuzzle(currentLevel);
            }
        );
    } else {
        // Ultimo livello: indizio finale
        showNarratorPopup(
            `${LEVELS[currentLevel].message}<br><br><b>INDIZIO:</b> una volta hai quasi rischiato di vedere il regalo...<br>(nei prossimi giochi forse ti dirò dove e quando).`,
            "Torna alla home",
            () => {
                puzzleBoard.innerHTML = "";
                currentLevel = 0;
                startGame();
            }
        );
    }
}

// --- UTILS ---
function shuffleArray(array) {
    // Fisher-Yates
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}