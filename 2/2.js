const today = new Date();
if (!(today.getMonth() === 11 && today.getDate() >= 2)) { // Dicembre (0-based) e giorno >= 2
    window.location.href = "../index.html";
}

const lanes = [80, 140, 200]; // Inizio di ogni corsia (larghezza corsia: 60px)
const laneWidth = 60;
const kevinWidth = 48;
const obstacleWidth = 40;
const gameHeight = 420;
const kevinImg = "kevin.jpeg";
const veronicaImg = "vero.jpeg";
const obstaclesImgs = ["macchina.png", "piccione.png", "rami.png"];
const cartelli = [
    { percent: 0, text: "VERCELLI" },
    { percent: 50, text: "DESANA" },
    { percent: 100, text: "COSTANZANA" }
];

let kevinLane = 1;
let kevinY = gameHeight - 88;
let obstacles = [];
let progress = 0;
let running = true;
let gameInterval = null;
let obstacleInterval = null;
let popup = document.getElementById("popup");
let approachingVeronica = false;
let arrived = false;
let obstacleDelay = 1350; // Tempo tra gli ostacoli (ms)
let lastObstacleTime = Date.now();
let score = 0;

// Durata totale in millisecondi (40 secondi)
const TOTAL_TIME = 40000;
const PROGRESS_STEP = 100 / (TOTAL_TIME / 60);

function startGame() {
    kevinLane = 1;
    kevinY = gameHeight - 88;
    obstacles = [];
    progress = 0;
    running = true;
    approachingVeronica = false;
    arrived = false;
    score = 0;
    document.getElementById("progress-bar").style.width = "0%";
    document.getElementById("game-area").innerHTML = "";
    hidePopup();
    renderBackground();
    renderKevin();
    renderCartello(0);
    gameInterval = setInterval(gameLoop, 60);
    obstacleInterval = setInterval(spawnObstacle, obstacleDelay);
}

function renderBackground() {
    const area = document.getElementById("game-area");
    area.innerHTML = `
        <div class="risaia left"></div>
        <div class="risaia right"></div>
        <div class="road"></div>
        <div class="corsia c1"></div>
        <div class="corsia c2"></div>
        <div class="corsia c3"></div>
        <div class="gardrail top"></div>
        <div class="gardrail bottom"></div>
        <div class="score">Score: ${score}</div>
    `;
    if (approachingVeronica || arrived) {
        let veronica = document.createElement("img");
        veronica.src = veronicaImg;
        veronica.className = "veronica";
        // Centra Veronica nella corsia centrale
        veronica.style.left = (lanes[1] + (laneWidth - kevinWidth) / 2) + "px";
        veronica.style.top = "10px";
        veronica.style.width = kevinWidth + "px";
        veronica.style.height = kevinWidth + "px";
        veronica.style.position = "absolute";
        veronica.style.zIndex = "30";
        area.appendChild(veronica);
    }
}

function renderKevin() {
    const area = document.getElementById("game-area");
    let kevin = document.createElement("img");
    kevin.src = kevinImg;
    kevin.className = "kevin";
    // Centra Kevin nella corsia
    kevin.style.left = (lanes[kevinLane] + (laneWidth - kevinWidth) / 2) + "px";
    kevin.style.bottom = (gameHeight - kevinY - 8) + "px";
    kevin.style.width = kevinWidth + "px";
    kevin.style.height = kevinWidth + "px";
    kevin.style.transition = "left 0.15s, bottom 0.15s";
    area.appendChild(kevin);
}

function spawnObstacle() {
    if (!running || approachingVeronica) return;
    if (Date.now() - lastObstacleTime < obstacleDelay) return;
    lastObstacleTime = Date.now();
    const lane = Math.floor(Math.random() * 3);
    const type = Math.floor(Math.random() * obstaclesImgs.length);
    obstacles.push({
        lane: lane,
        y: -obstacleWidth,
        img: obstaclesImgs[type],
        id: Math.random().toString(36).substr(2, 9)
    });
}

function renderObstacles() {
    const area = document.getElementById("game-area");
    obstacles.forEach(ob => {
        let el = document.createElement("img");
        el.src = ob.img;
        el.className = "obstacle";
        // Centra ostacolo nella corsia
        el.style.left = (lanes[ob.lane] + (laneWidth - obstacleWidth) / 2) + "px";
        el.style.top = ob.y + "px";
        el.style.width = obstacleWidth + "px";
        el.style.height = obstacleWidth + "px";
        el.style.transition = "top 0.15s";
        area.appendChild(el);
    });
}

function renderCartello(percent) {
    const area = document.getElementById("game-area");
    let cartello = null;
    if (percent >= 100) cartello = cartelli[2];
    else if (percent >= 50) cartello = cartelli[1];
    else cartello = cartelli[0];
    let el = document.createElement("div");
    el.className = "cartello";
    el.textContent = cartello.text;
    area.appendChild(el);
}

function gameLoop() {
    if (!running) return;
    progress += PROGRESS_STEP;
    if (progress > 100) progress = 100;
    document.getElementById("progress-bar").style.width = progress + "%";
    renderBackground();
    renderKevin();
    renderObstacles();
    renderCartello(progress);

    if (!approachingVeronica) {
        obstacles.forEach(ob => ob.y += 10);

        obstacles.forEach(ob => {
            if (
                ob.lane === kevinLane &&
                ob.y + obstacleWidth > kevinY &&
                ob.y < kevinY + kevinWidth
            ) {
                playSound('gameover');
                gameOver();
            }
        });

        obstacles.forEach(ob => {
            if (ob.y > gameHeight && !ob.passed) {
                score++;
                ob.passed = true;
                playSound('score');
            }
        });

        obstacles = obstacles.filter(ob => ob.y < gameHeight + obstacleWidth);
    }

    if (progress >= 98 && !approachingVeronica) {
        approachingVeronica = true;
        clearInterval(obstacleInterval);
    }

    if (approachingVeronica && !arrived) {
        if (kevinLane !== 1) {
            kevinLane = 1;
        }
        if (kevinY > 60) {
            kevinY -= 8;
        } else {
            arrived = true;
            setTimeout(winGame, 800);
        }
    }

    if (progress >= 100 && !arrived) {
        approachingVeronica = true;
    }
}

document.getElementById("left-btn").addEventListener("click", function() {
    if (!running || approachingVeronica) return;
    if (kevinLane > 0) {
        kevinLane--;
        playSound('move');
    }
});
document.getElementById("right-btn").addEventListener("click", function() {
    if (!running || approachingVeronica) return;
    if (kevinLane < 2) {
        kevinLane++;
        playSound('move');
    }
});

let touchStartX = null;
document.getElementById("game-area").addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
});
document.getElementById("game-area").addEventListener("touchend", function(e) {
    if (touchStartX === null || approachingVeronica) return;
    let dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 30 && kevinLane < 2) {
        kevinLane++;
        playSound('move');
    }
    if (dx < -30 && kevinLane > 0) {
        kevinLane--;
        playSound('move');
    }
    touchStartX = null;
});

function gameOver() {
    running = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    showPopup("GAME OVER", "Hai preso un ostacolo!<br>Score: " + score, true, false);
}

function winGame() {
    running = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    playSound('win');
    showPopup(
        "COMPLIMENTI!",
        "SEI RIUSCITA A FAR ARRIVARE KEVIN DALLA SUA AMATA FIDANZATA<br><br>Score: " + score + "<br>Livello completato!",
        false,
        true
    );
}

function showPopup(title, message, retry, home) {
    popup.classList.remove("d-none");
    document.getElementById("popup-title").innerHTML = title;
    document.getElementById("popup-message").innerHTML = message;
    document.getElementById("retry-btn").classList.toggle("d-none", !retry);
    document.getElementById("home-btn").classList.toggle("d-none", !home);
}
function hidePopup() {
    popup.classList.add("d-none");
}

// Effetti sonori (aggiungi i file .mp3 nella cartella 2 se vuoi)
function playSound(type) {
    // Esempio: move.mp3, score.mp3, gameover.mp3, win.mp3
    // let audio = new Audio(type + ".mp3");
    // audio.play();
}

document.getElementById("retry-btn").addEventListener("click", startGame);
document.getElementById("home-btn").addEventListener("click", function() {
    window.location.href = "../index.html";
});

startGame();