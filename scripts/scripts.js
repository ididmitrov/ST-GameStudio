const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const boxSize = 20;
let snake;
let direction;
let food;
let gameRunning = false;
let gameInterval;

// Начальная настройка игры
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    food = spawnFood();
    gameRunning = false;
    clearInterval(gameInterval);
    draw();
}

// Запуск игры
function startGame() {
    if (!gameRunning) {
        resetGame();
        gameRunning = true;
        gameInterval = setInterval(gameLoop, 150);
    }
}

// Управление направлением
function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Создание случайного положения еды
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}

// Основной игровой процесс
function update() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    // Если змейка съела еду
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }

    // Проверка столкновений (стены или сама себя)
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => head.x === segment.x && head.y === segment.y)
    ) {
        alert("Game Over!");
        resetGame();
        return;
    }

    snake.unshift(head);
}

// Отрисовка игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем еду
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Рисуем змейку
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
}

// Игровой цикл
function gameLoop() {
    if (gameRunning) {
        update();
        draw();
    }
}

// Слушатели событий
document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);

// Инициализация игры
resetGame();
