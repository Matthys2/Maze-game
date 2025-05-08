let mazeWidth;
let mazeHeight;
let cellSize = 10;
const minCellSize = 2;
const maxMazeSize = 100001;
let mazeLayout = [];
let playerPos = { x: 0, y: 0 };
let exitPos = { x: 0, y: 0 };
let generated = 0;
let totalgenerate = 0;
let settings = { phase: 0, ViewGenErr: 0 };
let rcell = { a: 0, b: 0, c: 0, d: 0 }
let timer = { on: 0, time: 0 }
let generrorcount = { now: 0, all: 0 }

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
        }
        catch(e) {
            console.log("The program is having a minor extitencial crisist")
            generrorcount.now += 1
            generrorcount.all += 1
            console.log("Errors this generation: " + generrorcount.now)
            console.log("Errors all generations: " + generrorcount.all)
            if (settings.ViewGenErr == 1) {
                console.log(e)
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
    console.log("Player moved to: " + x + ", " + y)

    // Clear the previous player position
    ctx.fillStyle = 'white'; // Or whatever your path color is
    ctx.fillRect((playerPos.y - dy) * cellSize, (playerPos.x - dx) * cellSize, cellSize, cellSize);

    // Draw the new player position
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerPos.y * cellSize, playerPos.x * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy, phase = 0) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if (phase === 1) {
        playerPos.x = newX;
        playerPos.y = newY;
        updatePlayer(dx, dy, newX, newY); // Update the player's position
        if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
            document.getElementById('message').innerText = "Congratulations! You've reached the exit!";
        } else {
            document.getElementById('message').innerText = '';
        }
    } else if (settings.phase === 1) {
        playerPos.x = newX;
        playerPos.y = newY;
        updatePlayer(dx, dy, newX, newY); // Update the player's position
        if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
            document.getElementById('message').innerText = "Congratulations! You've reached the exit!";
        } else {
            document.getElementById('message').innerText = '';
        }
    } else {
        if (mazeLayout[newX] && mazeLayout[newX][newY] !== '#') {
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
        case 'w': movePlayer(-1, 0, 0); break;
        case 's': movePlayer(1, 0, 0); break;
        case 'a': movePlayer(0, -1, 0); break;
        case 'd': movePlayer(0, 1, 0); break;
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
    console.log("generating maze")
    generation = 0
    generateMaze(0, 0);
    console.log("Generation is done with " + generrorcount.now + " errors")
    generrorcount.now = 0
    console.log("drawing maze")
    drawMaze();
    console.log("maze is complete")
});
const player = {
    setpos(x, y, phase = 0) {
        console.log("moving player to: " + x + ", " + y)
        dx = x - playerPos.x
        dy = y - playerPos.y
        movePlayer(dx, dy, phase)
    },
    finish() {
        console.log("moving player to finish")
        player.setpos(exitPos.x, exitPos.y)
    }
}
const cell = {
    set(x, y, set) {
        console.log("Setting the cell")
    }
}
const maze = {
    generate(x, y) {
        mazeLayout = Array.from({ length: x }, () => Array(y).fill('#'));
        console.log("generating maze")
        generation = 0
        generateMaze(0, 0);
        console.log("Generation is done with " + generrorcount.now + " errors")
        generrorcount.now = 0
        console.log("drawing maze")
        drawMaze();
        console.log("maze is complete")
    },
    setfinish(x, y) {
        exitPos = { x: x, y: y }
    }
}