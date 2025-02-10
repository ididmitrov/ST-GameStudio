const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const pointEl = document.getElementById("points");

const boxSize = 20;
let snake;
let direction;
let food;
let gameRunning = false;
let gameInterval;
let points = 0;

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
        points += 10;
        // console.log(points);
        pointEl.innerHTML = points;
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
        points = 0;
        pointEl.innerHTML = 0;
        return;
    }

    snake.unshift(head);
}

// Отрисовка игры
let foodAlpha = 1; // Начальная прозрачность (1 - полностью видно)
let fadeDirection = -0.01; // Скорость затухания (уменьшение на 0.05 за каждый кадр)

// Функция анимации мигания еды
function animateFood() {
    foodAlpha += fadeDirection;

    // Если еда полностью исчезла, меняем направление (fade in)
    if (foodAlpha <= 0.3) {
        foodAlpha = 0.3; // Оставляем 0, чтобы не было отрицательных значений
        fadeDirection = 0.01; // Начинаем увеличивать прозрачность
    }
    // Если еда полностью видима, меняем направление (fade out)
    if (foodAlpha >= 1) {
        foodAlpha = 1; // Оставляем 1, чтобы не было больше 1
        fadeDirection = -0.01; // Начинаем уменьшать прозрачность
    }
    
    // Принудительно обновляем кадр
    requestAnimationFrame(animateFood); // Вызываем анимацию снова
}

// Функция отрисовки с плавным миганием еды
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем еду с изменяемой прозрачностью
    ctx.fillStyle = `rgba(255, 0, 0, ${foodAlpha})`; // Красный с прозрачностью
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
    // Длина змейки
    let totalSegments = snake.length;

    // Если змейка состоит только из головы, рисуем её зеленой
    if (totalSegments === 1) {
        ctx.fillStyle = "lime";
        ctx.fillRect(snake[0].x, snake[0].y, boxSize, boxSize);
        return;
    }

    // Рисуем змейку с плавным градиентом
    snake.forEach((segment, index) => {
        let progress = index / (totalSegments - 1); // От 0 (хвост) до 1 (голова)
        
        // Интерполяция цвета от белого к лаймовому
        let blue = Math.floor(progress * 255); // От 255 (белый) к 0 (лайм)
        let green = 255; // Всегда 255 (зелёный)
        let red = Math.floor(progress * 255); // От 255 (белый) к 0 (лайм)
        //console.log(red, blue);
        
        // Гарантируем, что голова всегда лаймовая
        if (index === 0) {
            ctx.fillStyle = "lime";
        } else {
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        }

        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
}

animateFood();

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
