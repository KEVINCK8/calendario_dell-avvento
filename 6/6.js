// --- CONFIGURAZIONE ---
const GRID_ROWS = 10; // puoi aumentare/diminuire per cambiare difficoltà
const GRID_COLS = 10;
const CELL_SIZE = 0; // calcolato dinamicamente
const LABYRINTH = [
    // 0 = libero, 1 = muro
    // Puoi personalizzare il labirinto qui!
    [0,0,0,1,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,1,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,0,1,0,1],
    [0,0,0,0,0,1,0,0,0,0],
    [0,1,1,1,0,1,1,1,1,0],
    [0,0,0,1,0,0,0,0,1,0],
    [0,1,0,1,1,1,1,0,1,0],
    [0,1,0,1,1,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,0,0]
];

// --- IMMAGINI ---
const pipitaImg = new Image();
pipitaImg.src = "PIPITA.png";
const crocchetteImg = new Image();
crocchetteImg.src = "crocchette.jpg";

// --- VARIABILI DI STATO ---
let canvas, ctx;
let cellSize;
let pipita = { row: 0, col: 0, dir: "right" };
let crocchette = [];
let eaten = 0;
let totalCrocchette = 0;
let gameRunning = false;
let swipeStart = null;
let moveInterval = null;

// --- POPUP ---
const startPopup = document.getElementById("start-popup");
const startBtn = document.getElementById("start-btn");
const endPopup = document.getElementById("end-popup");
const showHintBtn = document.getElementById("show-hint-btn");
const hintPopup = document.getElementById("hint-popup");
const backHomeBtn = document.getElementById("back-home-btn");

// --- BARRA PERCENTUALE ---
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// --- INIZIALIZZAZIONE ---
window.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Popup iniziale
    startBtn.addEventListener("click", () => {
        startPopup.classList.remove("active");
        startGame();
    });

    showHintBtn.addEventListener("click", () => {
        endPopup.classList.remove("active");
        hintPopup.classList.add("active");
    });

    backHomeBtn.addEventListener("click", () => {
        hintPopup.classList.remove("active");
        // Puoi aggiungere qui la logica per tornare alla home
    });

    // Swipe touch
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Swipe mouse (per test su desktop)
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
});

// --- FUNZIONI DI GIOCO ---
function startGame() {
    // Reset stato
    pipita = { row: 0, col: 0, dir: "right" };
    crocchette = [];
    eaten = 0;
    gameRunning = true;
    // Popola crocchette in tutte le celle libere tranne pipita e muri
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            if (LABYRINTH[r][c] === 0 && !(r === 0 && c === 0)) {
                crocchette.push({ row: r, col: c });
            }
        }
    }
    totalCrocchette = crocchette.length;
    updateProgress();
    drawGame();
    // Movimento automatico
    clearInterval(moveInterval);
    moveInterval = setInterval(movePipita, 350);
}

function movePipita() {
    if (!gameRunning) return;
    let { row, col, dir } = pipita;
    let next = { row, col };
    if (dir === "up") next.row--;
    if (dir === "down") next.row++;
    if (dir === "left") next.col--;
    if (dir === "right") next.col++;
    // Controlla limiti e muri
    if (
        next.row < 0 || next.row >= GRID_ROWS ||
        next.col < 0 || next.col >= GRID_COLS ||
        LABYRINTH[next.row][next.col] === 1
    ) {
        // Se muro o bordo, non muovere
        drawGame();
        return;
    }
    pipita.row = next.row;
    pipita.col = next.col;
    // Mangia crocchetta se presente
    let idx = crocchette.findIndex(c => c.row === pipita.row && c.col === pipita.col);
    if (idx !== -1) {
        crocchette.splice(idx, 1);
        eaten++;
        updateProgress();
        if (crocchette.length === 0) {
            endGame();
        }
    }
    drawGame();
}

function endGame() {
    gameRunning = false;
    clearInterval(moveInterval);
    endPopup.classList.add("active");
}

function updateProgress() {
    let perc = Math.round((eaten / totalCrocchette) * 100);
    progressBar.style.width = perc + "%";
    progressText.textContent = perc + "%";
}

// --- DISEGNA ---
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Griglia
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            let x = c * cellSize;
            let y = r * cellSize;
            // Sfondo cella
            ctx.fillStyle = LABYRINTH[r][c] === 1 ? "#e6d7b6" : "#fffbe6";
            ctx.fillRect(x, y, cellSize, cellSize);
            // Bordo cella
            ctx.strokeStyle = "#f7c873";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
    // Crocchette
    crocchette.forEach(c => {
        let x = c.col * cellSize + cellSize * 0.15;
        let y = c.row * cellSize + cellSize * 0.15;
        ctx.drawImage(crocchetteImg, x, y, cellSize * 0.7, cellSize * 0.7);
    });
    // Pipita
    let px = pipita.col * cellSize + cellSize * 0.05;
    let py = pipita.row * cellSize + cellSize * 0.05;
    ctx.drawImage(pipitaImg, px, py, cellSize * 0.9, cellSize * 0.9);
}

// --- RESPONSIVE CANVAS ---
function resizeCanvas() {
    // Calcola dimensione cella in base a schermo
    let w = Math.min(window.innerWidth * 0.98, 500);
    let h = Math.min(window.innerHeight * 0.7, 500);
    let size = Math.min(w, h);
    cellSize = Math.floor(size / Math.max(GRID_ROWS, GRID_COLS));
    canvas.width = cellSize * GRID_COLS;
    canvas.height = cellSize * GRID_ROWS;
    drawGame();
}

// --- SWIPE TOUCH ---
function handleTouchStart(e) {
    if (!gameRunning) return;
    if (e.touches.length === 1) {
        swipeStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
}
function handleTouchEnd(e) {
    if (!gameRunning || !swipeStart) return;
    let touch = e.changedTouches[0];
    let dx = touch.clientX - swipeStart.x;
    let dy = touch.clientY - swipeStart.y;
    setDirectionFromSwipe(dx, dy);
    swipeStart = null;
}

// --- SWIPE MOUSE (desktop test) ---
function handleMouseDown(e) {
    if (!gameRunning) return;
    swipeStart = { x: e.clientX, y: e.clientY };
}
function handleMouseUp(e) {
    if (!gameRunning || !swipeStart) return;
    let dx = e.clientX - swipeStart.x;
    let dy = e.clientY - swipeStart.y;
    setDirectionFromSwipe(dx, dy);
    swipeStart = null;
}

// --- LOGICA DIREZIONE ---
function setDirectionFromSwipe(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
        // Orizzontale
        if (dx > 20) pipita.dir = "right";
        else if (dx < -20) pipita.dir = "left";
    } else {
        // Verticale
        if (dy > 20) pipita.dir = "down";
        else if (dy < -20) pipita.dir = "up";
    }
}

// --- BLOCCA SCROLL SU MOBILE DURANTE IL GIOCO ---
document.body.addEventListener('touchmove', function(e) {
    if (gameRunning) e.preventDefault();
}, { passive: false });