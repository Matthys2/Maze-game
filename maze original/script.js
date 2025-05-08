let mazeWidth;
let mazeHeight;
let cellSize = 50; // Initial cell size
const minCellSize = 10; // Set a reasonable minimum cell size

// Prompt for maze dimensions

mazeWidth = parseInt(prompt("Enter the width of the maze (reccomended under 224, odd numbers preferred):"), 10);
mazeHeight = parseInt(prompt("Enter the height of the maze (reccomended maximum 79, odd numbers preferred):"), 10);

// Initialize the maze layout
const mazeLayout = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill('#'));
let playerPos = { x: 0, y: 0 };
let exitPos = { x: mazeHeight - 1, y: mazeWidth - 1 };

// Maze generation using recursive backtracking
function generateMaze(x, y) {
    const directions = [
        { dx: 0, dy: -1 },  // left
        { dx: -1, dy: 0 },  // up
        { dx: 0, dy: 1 },   // right
        { dx: 1, dy: 0 }    // down
    ];

    directions.sort(() => Math.random() - 0.5);
    mazeLayout[x][y] = ' '; // Mark the current cell as open

    for (const { dx, dy } of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (nx >= 0 && nx < mazeHeight && ny >= 0 && ny < mazeWidth && mazeLayout[nx][ny] === '#') {
            mazeLayout[x + dx][y + dy] = ' '; // Open the wall between the current and new cell
            generateMaze(nx, ny); // Recursively generate from the new cell
        }
    }
}

// Initialize and draw the maze
function drawMaze() {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.style.gridTemplateColumns = `repeat(${mazeWidth}, ${cellSize}px)`;
    mazeContainer.innerHTML = '';

    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            if (mazeLayout[row][col] === '#') {
                cell.classList.add('wall');
            } else if (row === 0 && col === 0) {
                cell.classList.add('start');
                playerPos = { x: row, y: col };
            } else if (row === mazeHeight - 1 && col === mazeWidth - 1) {
                cell.classList.add('exit');
                exitPos = { x: row, y: col };
            }
            mazeContainer.appendChild(cell);
            console.log("Drawing maze")
        }
    }
    updatePlayer();
}

// Update player position
function updatePlayer() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('player'));
    const playerIndex = playerPos.x * mazeLayout[0].length + playerPos.y;
    cells[playerIndex].classList.add('player');
}

// Move the player
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (mazeLayout[newX] && mazeLayout[newX][newY] !== '#') {
        playerPos.x = newX;
        playerPos.y = newY;

        if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
            document.getElementById('message').innerText = "Congratulations! You've reached the exit!";
        } else {
            document.getElementById('message').innerText = '';
        }

        updatePlayer();
    }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w': movePlayer(-1, 0); break;
        case 's': movePlayer(1, 0); break;
        case 'a': movePlayer(0, -1); break;
        case 'd': movePlayer(0, 1); break;
    }
});

// Zoom functionality
document.getElementById('zoom-in').addEventListener('click', () => {
    cellSize += 10; // Increase the cell size
    drawMaze(); // Redraw the maze with the new cell size
});

document.getElementById('zoom-out').addEventListener('click', () => {
    cellSize -= 5; // Decrease the cell size (allow for smaller sizes)
    drawMaze(); // Redraw the maze with the new cell size
});

// Generate the maze, then draw it
generateMaze(0, 0);
drawMaze();
