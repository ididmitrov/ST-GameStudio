const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20; // Размер клетки
let snake = [{ x: 200, y: 200 }]; // Начальная позиция змейки
let direction = "RIGHT"; // Направление движения
let food = spawnFood(); // Начальная позиция еды

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Функция для случайного появления еды
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}

function update() {
    let head = { ...snake[0] }; // Копируем голову змеи

    // Изменяем позицию головы
    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    // Проверяем, съела ли змейка еду
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood(); // Создаём новую еду
    } else {
        snake.pop(); // Удаляем хвост, если еда не съедена
    }

    // Проверка на столкновение со стенами
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        alert("Game Over!"); // Показываем сообщение
        document.location.reload(); // Перезапускаем игру
    }

    // Проверка на столкновение с самой собой
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            alert("Game Over!");
            document.location.reload();
        }
    }

    snake.unshift(head); // Добавляем новую голову в массив
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем еду
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Рисуем змейку
    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 150); // Скорость змейки
}

gameLoop(); // Запускаем игру
