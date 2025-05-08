let mazeWidth;
let mazeHeight;
let cellSize = 10;
const minCellSize = 2;
const maxMazeSize = 100001;
let hekersettings = { phase: 0 }
let mazeLayout = [];
let playerPos = { x: 0, y: 0 };
let exitPos = { x: 0, y: 0 };
let generated = 0;
let totalgenerate = 0;
let rcell = { a: 0, b: 0, c: 0, d: 0 }
let timer = { on: 0, time: 0 }
let lastCellColor = 'white';

function toggleMenu() {
      var menu = document.getElementById("slidingMenu");
      menu.classList.toggle("show");
    }

function generateMaze(x, y) {
    try {
        const directions = [
            { dx: 0, dy: -1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 1, dy: 0 }
        ];

        directions.sort(() => Math.random() - 0.5);
        mazeLayout[x][y] = ' ';

        for (const { dx, dy } of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;

            if (nx >= 0 && nx < mazeHeight && ny >= 0 && ny < mazeWidth && mazeLayout[nx][ny] === '#') {
                mazeLayout[x + dx][y + dy] = ' ';
                generateMaze(nx, ny);
            }
        }
    } catch(e) {
        console.log(e)
    }
}

function generateMazeBeta(startX, startY) {
    const directions = [
        { dx: 0, dy: -1 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 0 }
    ];

    const stack = [];
    stack.push({ x: startX, y: startY });
    mazeLayout[startX][startY] = ' ';

    while (stack.length > 0) {
        const current = stack[stack.length - 1];

        // Shuffle directions for randomness
        const shuffled = directions.sort(() => Math.random() - 0.5);
        let carved = false;

        for (const { dx, dy } of shuffled) {
            const nx = current.x + dx * 2;
            const ny = current.y + dy * 2;

            if (
                nx >= 0 && nx < mazeHeight &&
                ny >= 0 && ny < mazeWidth &&
                mazeLayout[nx][ny] === '#'
            ) {
                mazeLayout[current.x + dx][current.y + dy] = ' ';
                mazeLayout[nx][ny] = ' ';
                stack.push({ x: nx, y: ny });
                carved = true;
                break;
            }
        }

        if (!carved) {
            stack.pop(); // backtrack
        }
    }
}

function drawMaze() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mazeWidth * cellSize;
    canvas.height = mazeHeight * cellSize;

    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            if (mazeLayout[row][col] === '#') {
                ctx.fillStyle = 'black';
            } else if (row === 0 && col === 0) {
                ctx.fillStyle = 'green';
                playerPos = { x: row, y: col };
            } else if (row === mazeHeight - 1 && col === mazeWidth - 1) {
                ctx.fillStyle = 'red';
                exitPos = { x: row, y: col };
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
    updatePlayer()
}

function updatePlayer(dx = 0, dy = 0, x = "NaN", y = "NaN") {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    // Restore the color of the cell the player just left
    ctx.fillStyle = lastCellColor;
    ctx.fillRect((playerPos.y - dy) * cellSize, (playerPos.x - dx) * cellSize, cellSize, cellSize);

    // Determine the new underlying color
    if (playerPos.x === 0 && playerPos.y === 0) {
        lastCellColor = 'green'; // Start
    } else if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
        lastCellColor = 'red'; // Exit
    } else if (mazeLayout[playerPos.x][playerPos.y] === '#') {
        lastCellColor = 'black'
    } else {
        lastCellColor = 'white';
    }

    // Draw the player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerPos.y * cellSize, playerPos.x * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if (hekersettings.phase === 1) {
        playerPos.x = newX;
        playerPos.y = newY;
        updatePlayer(dx, dy, newX, newY); // Update the player's position
        if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
            document.getElementById('message').innerText = "Congratulations! You've reached the exit!";
        } else {
            document.getElementById('message').innerText = '';
        }
    } else {
        if (mazeLayout[newX][newY] && mazeLayout[newX][newY] !== '#') {
            playerPos.x = newX;
            playerPos.y = newY;
            updatePlayer(dx, dy, newX, newY); // Update the player's position
            if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
                document.getElementById('message').innerText = "Congratulations! You've reached the exit!";
            } else {
                document.getElementById('message').innerText = '';
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w': movePlayer(-1, 0); break;
        case 's': movePlayer(1, 0); break;
        case 'a': movePlayer(0, -1); break;
        case 'd': movePlayer(0, 1); break;
    }
});

document.getElementById('zoom-in').addEventListener('click', () => {
    cellSize += 2;
    drawMaze();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    cellSize = Math.max(minCellSize, cellSize - 1);
    drawMaze();
});

document.getElementById('generateButton').addEventListener('click', () => {
    mazeWidth = parseInt(document.getElementById('mazeWidthInput').value);
    mazeHeight = parseInt(document.getElementById('mazeHeightInput').value);
    totalgenerate = Math.trunc(mazeWidth * mazeHeight / 4);

    if (isNaN(mazeWidth) || isNaN(mazeHeight) || mazeWidth % 2 === 0 || mazeHeight % 2 === 0 || mazeWidth > maxMazeSize || mazeHeight > maxMazeSize) {
        alert(`Please enter odd numbers less than or equal to ${maxMazeSize}.`);
        return;
    }

    mazeLayout = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill('#'));
    if (document.getElementById("BetterGenBeta").checked) {
        generateMazeBeta(0,0);
    } else {
        generateMaze(0,0)
    }
    drawMaze();
});