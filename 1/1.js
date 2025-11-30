// LABIRINTO: 0 = vuoto, 1 = muro, 2 = cuore, 3 = kevin
const maze = [
    [1,1,1,1,1,1,1,1,1],
    [1,0,2,0,1,0,2,0,1],
    [1,0,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,1],
    [1,2,0,1,1,1,0,2,1],
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,1],
    [1,0,2,0,1,0,2,0,1],
    [1,1,1,1,1,1,1,3,1]
];
// Pacman (Veronica) parte in alto a sinistra
let pacman = { x: 1, y: 1 };
let heartsLeft = 6;
let kevinVisible = false;
let movingDirection = null;
let movingInterval = null;

function renderGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (maze[y][x] === 1) cell.classList.add('wall');
            if (maze[y][x] === 2) {
                cell.innerHTML = `<span class="heart">❤️</span>`;
            }
            if (pacman.x === x && pacman.y === y) {
                cell.innerHTML = `<img src="vero.jpeg" class="pacman" alt="Veronica">`;
            }
            if (kevinVisible && maze[y][x] === 3) {
                cell.innerHTML = `<img src="kevin.jpeg" class="kevin" alt="Kevin">`;
            }
            container.appendChild(cell);
        }
    }
}

function canMove(dir) {
    let nx = pacman.x, ny = pacman.y;
    if (dir === 'up') ny--;
    if (dir === 'down') ny++;
    if (dir === 'left') nx--;
    if (dir === 'right') nx++;
    if (nx < 0 || nx > 8 || ny < 0 || ny > 8) return false;
    if (maze[ny][nx] === 1) return false;
    return true;
}

function moveStep(dir) {
    if (!canMove(dir)) return false;
    let nx = pacman.x, ny = pacman.y;
    if (dir === 'up') ny--;
    if (dir === 'down') ny++;
    if (dir === 'left') nx--;
    if (dir === 'right') nx++;
    pacman.x = nx; pacman.y = ny;
    // Raccolta cuore
    if (maze[ny][nx] === 2) {
        maze[ny][nx] = 0;
        heartsLeft--;
        if (heartsLeft === 0) kevinVisible = true;
    }
    // Arrivo da Kevin
    if (kevinVisible && maze[ny][nx] === 3) {
        stopMoving();
        showOverlay();
    }
    renderGame();
    return true;
}

function startMoving(dir) {
    stopMoving();
    movingDirection = dir;
    movingInterval = setInterval(() => {
        if (!moveStep(dir)) {
            stopMoving();
        }
    }, 120);
}

function stopMoving() {
    if (movingInterval) {
        clearInterval(movingInterval);
        movingInterval = null;
        movingDirection = null;
    }
}

// Tastiera
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') startMoving('up');
    if (e.key === 'ArrowDown') startMoving('down');
    if (e.key === 'ArrowLeft') startMoving('left');
    if (e.key === 'ArrowRight') startMoving('right');
});

// Touch swipe
let touchStartX = null, touchStartY = null;
const gameContainer = document.getElementById('game-container');
gameContainer.addEventListener('touchstart', function(e) {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
});
gameContainer.addEventListener('touchend', function(e) {
    if (touchStartX === null || touchStartY === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) startMoving('right');
        else if (dx < -20) startMoving('left');
    } else {
        if (dy > 20) startMoving('down');
        else if (dy < -20) startMoving('up');
    }
    touchStartX = null; touchStartY = null;
});

// Se usi bottoni freccia HTML
window.move = function(dir) {
    startMoving(dir);
};

// Overlay finale
function showOverlay() {
    document.getElementById('overlay').classList.remove('d-none');
}

// Inizializza
renderGame();