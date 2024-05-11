document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvasSnake');
    const ctx = canvas.getContext('2d');

    const cellSize = 20;
    const canvasSize = canvas.width;
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval = null;

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach(cell => {
            ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    }

    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        drawSnake();
        drawFood();
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * (canvasSize / cellSize));
        food.y = Math.floor(Math.random() * (canvasSize / cellSize));
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= canvasSize / cellSize || head.y < 0 || head.y >= canvasSize / cellSize) {
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        resetGame();
    }

    function resetGame() {
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        document.getElementById('scoreDisplay').textContent = 'Score: 0';
        generateFood();
    }

    function startGame() {
        resetGame();
        gameInterval = setInterval(() => {
            if (checkCollision()) {
                gameOver();
            } else {
                moveSnake();
                draw();
            }
        }, 100);
    }

    document.getElementById('startButton').addEventListener('click', startGame);

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        // Prevent default scrolling behavior for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            event.preventDefault();
        }
        switch (key) {
            case 'ArrowUp':
                if (dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case 'ArrowDown':
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    });
});