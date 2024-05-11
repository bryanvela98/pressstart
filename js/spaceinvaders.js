document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvasSpace');
    const ctx = canvas.getContext('2d');

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const playerWidth = 50;
    const playerHeight = 20;
    const playerSpeed = 8;
    let playerX = (canvasWidth - playerWidth) / 2;
    let playerY = canvasHeight - 30;

    const enemyRowCount = 5;
    const enemyColumnCount = Math.floor(canvasWidth / 50); // Adjusted based on canvas width
    const enemyWidth = 30;
    const enemyHeight = 20;
    const enemyPadding = 10;
    const enemyOffsetTop = 30;
    const enemyOffsetLeft = (canvasWidth - (enemyWidth + enemyPadding) * enemyColumnCount) / 2; // Centered enemies
    let enemies = [];
    for (let c = 0; c < enemyColumnCount; c++) {
        enemies[c] = [];
        for (let r = 0; r < enemyRowCount; r++) {
            enemies[c][r] = { x: 0, y: 0, alive: true };
        }
    }
    let enemyDirection = 1; // 1 for right, -1 for left
    let enemyMoveInterval = 200; // Time interval for enemy movement

    const bulletRadius = 5;
    const bulletSpeed = 8;
    let bullets = [];

    let score = 0;
    let gameInterval = null;

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
    }

    function drawEnemies() {
        for (let c = 0; c < enemyColumnCount; c++) {
            for (let r = 0; r < enemyRowCount; r++) {
                if (enemies[c][r].alive) {
                    const enemyX = c * (enemyWidth + enemyPadding) + enemyOffsetLeft;
                    const enemyY = r * (enemyHeight + enemyPadding) + enemyOffsetTop;
                    enemies[c][r].x = enemyX;
                    enemies[c][r].y = enemyY;
                    ctx.fillStyle = 'red';
                    ctx.fillRect(enemyX, enemyY, enemyWidth, enemyHeight);
                }
            }
        }
    }

    function drawBullets() {
        ctx.fillStyle = 'black';
        bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawPlayer();
        drawEnemies();
        drawBullets();
    }

    function moveBullets() {
        bullets.forEach(bullet => {
            bullet.y -= bulletSpeed;
        });
        bullets = bullets.filter(bullet => bullet.y > 0);
    }

    function moveEnemies() {
        const enemySpeed = 5;
        const moveX = enemySpeed * enemyDirection;

        // Check if enemies reach the canvas edges
        const firstEnemyX = enemies[0][0].x;
        const lastEnemyX = enemies[enemyColumnCount - 1][0].x + enemyWidth;
        const firstEnemyY = enemies[0][0].y;
        const lastEnemyY = enemies[0][enemyRowCount - 1].y + enemyHeight;

        if (firstEnemyX <= 0 || lastEnemyX >= canvasWidth) {
            // Move enemies down
            for (let c = 0; c < enemyColumnCount; c++) {
                for (let r = 0; r < enemyRowCount; r++) {
                    enemies[c][r].y += enemyHeight + enemyPadding;
                }
            }
            // Change direction
            enemyDirection *= -1;
        } else if (lastEnemyY >= canvasHeight) {
            // If enemies reach the bottom, end the game
            clearInterval(gameInterval);
            clearInterval(enemyMoveInterval);
            alert('Game Over! Your score: ' + score);
            resetGame();
        }

        // Move enemies horizontally
        for (let c = 0; c < enemyColumnCount; c++) {
            for (let r = 0; r < enemyRowCount; r++) {
                enemies[c][r].x += moveX;
            }
        }
    }


    function generateEnemies() {
        for (let c = 0; c < enemyColumnCount; c++) {
            for (let r = 0; r < enemyRowCount; r++) {
                enemies[c][r] = { x: c * (enemyWidth + enemyPadding) + enemyOffsetLeft, y: r * (enemyHeight + enemyPadding) + enemyOffsetTop, alive: true };
            }
        }
    }

    function movePlayer(direction) {
        if (direction === 'left' && playerX > 0) {
            playerX -= playerSpeed;
        } else if (direction === 'right' && playerX < canvasWidth - playerWidth) {
            playerX += playerSpeed;
        }
    }

    function fireBullet() {
        bullets.push({ x: playerX + playerWidth / 2, y: playerY });
    }

    function detectBulletEnemyCollision() {
        for (let c = 0; c < enemyColumnCount; c++) {
            for (let r = 0; r < enemyRowCount; r++) {
                const enemy = enemies[c][r];
                bullets.forEach(bullet => {
                    if (enemy.alive && bullet.x > enemy.x && bullet.x < enemy.x + enemyWidth &&
                        bullet.y > enemy.y && bullet.y < enemy.y + enemyHeight) {
                        enemy.alive = false;
                        score++;
                        document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
                        bullets = bullets.filter(b => b !== bullet);
                    }
                });
            }
        }
    }

    function checkGameOver() {
        for (let c = 0; c < enemyColumnCount; c++) {
            for (let r = 0; r < enemyRowCount; r++) {
                if (enemies[c][r].alive && enemies[c][r].y + enemyHeight >= playerY) {
                    clearInterval(gameInterval);
                    clearInterval(enemyMoveInterval);
                    alert('Game Over! Your score: ' + score);
                    resetGame();
                    return;
                }
            }
        }
    }

    function resetGame() {
        playerX = (canvasWidth - playerWidth) / 2;
        playerY = canvasHeight - 30;
        score = 0;
        document.getElementById('scoreDisplay').textContent = 'Score: 0';
        bullets = [];
        generateEnemies(); // Regenerate enemies on reset
    }

    function startGame() {
        resetGame();
        gameInterval = setInterval(() => {
            moveBullets();
            detectBulletEnemyCollision();
            checkGameOver();
            draw();
        }, 1000 / 60);

        enemyMoveInterval = setInterval(() => {
            moveEnemies();
        }, 200);
    }

    document.getElementById('startButton').addEventListener('click', startGame);

    document.addEventListener('keydown', function (event) {
        const key = event.key;
        if (key === 'ArrowLeft') {
            movePlayer('left');
            event.preventDefault();
        } else if (key === 'ArrowRight') {
            movePlayer('right');
            event.preventDefault();
        } else if (key === ' ') { // Space key
            fireBullet();
            event.preventDefault();
        }
    });
});
