const canvas = document.getElementById('terrainCanvas');
const ctx = canvas.getContext('2d');

const gridWidth = 100;
const gridHeight = 50;
const cellSize = 10;
canvas.width = gridWidth * cellSize;
canvas.height = gridHeight * cellSize;

const player = {
    x: gridWidth * cellSize / 2,
    y: (gridHeight - 2) * cellSize,
    width: cellSize,
    height: cellSize * 2,
    speed: 2,
    vy: 0,
    gravity: 0.1,
    jumpPower: 5,
    grounded: false
};

let keys = {};
let terrain = [];

function generateTerrain() {
    for (let x = 0; x < gridWidth; x++) {
        const height = Math.floor(perlin.noise(x * 0.1, 0) * 10 + 25);
        terrain[x] = height;
    }
}

function drawTerrain() {
    for (let x = 0; x < gridWidth; x++) {
        const height = terrain[x];
        for (let y = 0; y < gridHeight; y++) {
            if (y >= gridHeight - height) {
                ctx.fillStyle = y === gridHeight - height ? '#228B22' : '#8B4513';
            } else {
                ctx.fillStyle = '#87CEEB';
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    player.vy += player.gravity;
    player.y += player.vy;

    if (keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.grounded) {
        player.vy = -player.jumpPower;
        player.grounded = false;
        keys['ArrowUp'] = false;  // Ensure jump is only triggered once per key press
    }

    if (player.y + player.height > canvas.height - terrain[Math.floor(player.x / cellSize)] * cellSize) {
        player.y = canvas.height - terrain[Math.floor(player.x / cellSize)] * cellSize - player.height;
        player.vy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function createButton(label, x, y, onPress, onRelease) {
    const button = document.createElement('button');
    button.innerHTML = label;
    button.style.position = 'absolute';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.addEventListener('mousedown', onPress);
    button.addEventListener('mouseup', onRelease);
    button.addEventListener('touchstart', onPress);
    button.addEventListener('touchend', onRelease);
    document.body.appendChild(button);
}

createButton('Left', 20, canvas.height + 20, () => keys['ArrowLeft'] = true, () => keys['ArrowLeft'] = false);
createButton('Right', 80, canvas.height + 20, () => keys['ArrowRight'] = true, () => keys['ArrowRight'] = false);
createButton('Jump', 140, canvas.height + 20, () => keys['ArrowUp'] = true, () => keys['ArrowUp'] = false);

generateTerrain();
gameLoop();
