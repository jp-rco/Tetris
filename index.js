import userDeviceInfo from "./device-detection.js";

const d = document,
    $score = d.getElementById("score");

let score = 0;

// Identificar el dispositivo
d.addEventListener("DOMContentLoaded", e => {
    userDeviceInfo("user-device");
});

// Inicializar canvas
const
    $canvas = d.querySelector("canvas"),
    context = $canvas.getContext("2d"),
    boardWidth = 20,
    boardHeight = 30,
    sideBlock = 20;
$canvas.width = sideBlock * boardWidth;
$canvas.height = sideBlock * boardHeight;

context.scale(sideBlock, sideBlock);

// Crear el tablero
const createBoard = (width, height) => {
    return Array(height).fill(0).map(() => Array(width).fill(0));
};

const board = createBoard(boardWidth, boardHeight);

// Piezas aleatorias
const PIECES = [
    {
        name: "O-Tetrimino",
        shape:
            [
                [1, 1],
                [1, 1]
            ],
        color: "yellow",
        position: { x: 5, y: 5 }
    },
    {
        name: "T-Tetrimino",
        shape:
            [
                [0, 1, 0],
                [1, 1, 1]
            ],
        color: "pink",
        position: { x: 5, y: 5 }
    },
    {
        name: "l-Tetrimino",
        shape:
            [
                [1, 1, 1, 1]
            ],
        color: "blue",
        position: { x: 5, y: 5 }
    },
    {
        name: "J-Tetrimino",
        shape:
            [
                [1, 0, 0, 0],
                [1, 1, 1, 1]
            ],
        color: "purple",
        position: { x: 5, y: 5 }
    },
    {
        name: "L-Tetrimino",
        shape:
            [
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ],
        color: "orange",
        position: { x: 5, y: 5 }
    },
    {
        name: "S-Tetrimino",
        shape:
            [
                [0, 1, 1],
                [1, 1, 0]
            ],
        color: "green",
        position: { x: 5, y: 5 }
    },
    {
        name: "Z-Tetrimino",
        shape:
            [
                [1, 1, 0],
                [0, 1, 1]
            ],
        color: "red",
        position: { x: 5, y: 5 }
    }
];

// Definir la primera pieza
let piece = PIECES[Math.floor(Math.random() * PIECES.length)];

// AutoDrop (bucle de juego)
let dropCounter = 0,
    lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > 1000) {
        piece.position.y++;
        dropCounter = 0;

        if (checkCollision()) {
            piece.position.y--;
            solidifyPieces();
            removeRows();
        }
    }
    draw();
    $score.innerHTML = `${score}`;
    window.requestAnimationFrame(update);
}

// Iniciar juego
const $start = d.querySelector(".start");
$start.addEventListener("click", e => {
    console.log("Juego iniciado");
    update();
    $start.remove();

    const audio = new Audio('./assets/tetris.mp3');
    audio.volume = .5;
    audio.play();
    audio.loop = true;
});

// Dibujar el canvas
function draw() {
    // Tablero
    context.fillStyle = "#303030";
    context.fillRect(0, 0, $canvas.width, $canvas.height);

    // Solidificar filas
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = "#43b7e8";
                context.fillRect(x, y, 1, 1);
            }
        })
    });

    // DIBUJAR LA PIEZA
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = piece.color;
                context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
            }
        })
    });
}

// Verificar colisiones
function checkCollision() {
    return piece.shape.find((row, y) => {
        return row.find((value, x) => {
            return (
                value !== 0 &&
                board[y + piece.position.y]?.[x + piece.position.x] !== 0
            )
        })
    })
}

// Solidificar piezas
function solidifyPieces() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                board[y + piece.position.y][x + piece.position.x] = 1;
            }
        })
    });

    // Obtener pieza aleatoria
    piece = PIECES[Math.floor(Math.random() * PIECES.length)];

    // Reiniciar posición
    piece.position.x = Math.floor(boardWidth / 2);
    piece.position.y = 0;

    // ¿Fin del juego?
    if (checkCollision()) {
        alert("GAME OVER. ¡Intenta de nuevo!");
        board.forEach((row) => row.fill(0));
        score = 0;
    }
}

// Eliminar filas completas
function removeRows() {
    const rowsRemove = [];

    board.forEach((row, y) => {
        if (row.every(value => value === 1)) {
            rowsRemove.push(y);
        }
    })

    rowsRemove.forEach(y => {
        board.splice(y, 1);
        const newRow = Array(boardWidth).fill(0);
        board.unshift(newRow);
        score += 10;
    })
}

// Agregar el event listener a las teclas para el movimiento de las piezas
let gameStarted = false;

$start.addEventListener("click", () => {
    gameStarted = true;
});

d.addEventListener("keydown", e => {
    if (!gameStarted) return;

    if (e.key === "ArrowLeft") {
        piece.position.x--;
        if (checkCollision()) piece.position.x++;
    }
    if (e.key === "ArrowRight") {
        piece.position.x++;
        if (checkCollision()) piece.position.x--;
    }
    if (e.key === "ArrowDown") {
        piece.position.y++;
        if (checkCollision()) {
            piece.position.y--;
            solidifyPieces();
            removeRows();
        }
    }
    if (e.key === "ArrowUp") {
        const shapeRotated = [];

        for (let i = 0; i < piece.shape[0].length; i++) {
            const row = [];

            for (let j = piece.shape.length - 1; j >= 0; j--) {
                row.push(piece.shape[j][i])
            }

            shapeRotated.push(row);
        }
        const previousShape = piece.shape;
        piece.shape = shapeRotated;
        if (checkCollision()) piece.shape = previousShape;
    }
});

// Para dispositivos móviles
d.addEventListener("click", e => {
    if (!gameStarted) return;

    if (e.target.matches(".left")) {
        piece.position.x--;
        if (checkCollision()) piece.position.x++;
    }
    if (e.target.matches(".right")) {
        piece.position.x++;
        if (checkCollision()) piece.position.x--;
    }
    if (e.target.matches(".down")) {
        piece.position.y++;
        if (checkCollision()) {
            piece.position.y--;
            solidifyPieces();
            removeRows();
        }
    }
    if (e.target.matches(".up")) {
        const shapeRotated = [];

        for (let i = 0; i < piece.shape[0].length; i++) {
            const row = [];

            for (let j = piece.shape.length - 1; j >= 0; j--) {
                row.push(piece.shape[j][i])
            }

            shapeRotated.push(row);
        }
        const previousShape = piece.shape;
        piece.shape = shapeRotated;
        if (checkCollision()) piece.shape = previousShape;
    }
});
