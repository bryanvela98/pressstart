document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvasPong');
    const ctx = canvas.getContext('2d');

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const paddleWidth = 10;
    const paddleHeight = 80;
    const paddleSpeed = 6;

    let paddle1Y = HEIGHT / 2 - paddleHeight / 2;
    let paddle2Y = HEIGHT / 2 - paddleHeight / 2;

    const ballSize = 10;
    let ballX = WIDTH / 2;
    let ballY = HEIGHT / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    let score = 0;

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Draw paddles
        ctx.fillStyle = '#000';
        ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
        ctx.fillRect(WIDTH - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

        // Draw ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.closePath();
    }

    function update() {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with top and bottom walls
        if (ballY + ballSize >= HEIGHT || ballY - ballSize <= 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collision with paddles
        if ((ballX - ballSize <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) ||
            (ballX + ballSize >= WIDTH - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight)) {
            ballSpeedX = -ballSpeedX;
            score++; // Increase score on paddle collision
            document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
        }

        // Ball out of bounds
        if (ballX - ballSize <= 0 || ballX + ballSize >= WIDTH) {
            // Reset ball position
            ballX = WIDTH / 2;
            ballY = HEIGHT / 2;
            score = 0; // Reset score on ball out of bounds
            document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
        }
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Keyboard input
    document.addEventListener('keydown', function(event) {
        if (event.key === 'w' && paddle1Y > 0) {
            paddle1Y -= paddleSpeed;
            event.preventDefault(); // Prevent default action (scrolling)
        } else if (event.key === 's' && paddle1Y < HEIGHT - paddleHeight) {
            paddle1Y += paddleSpeed;
            event.preventDefault(); // Prevent default action (scrolling)
        } else if (event.key === 'ArrowUp' && paddle2Y > 0) {
            paddle2Y -= paddleSpeed;
            event.preventDefault(); // Prevent default action (scrolling)
        } else if (event.key === 'ArrowDown' && paddle2Y < HEIGHT - paddleHeight) {
            paddle2Y += paddleSpeed;
            event.preventDefault(); // Prevent default action (scrolling)
        }

        // Prevent scrolling when reaching the bottom
        if ((event.key === 'ArrowDown' && window.innerHeight + window.scrollY >= document.body.offsetHeight) ||
            (event.key === 'ArrowUp' && window.scrollY <= 0)) {
            event.preventDefault();
        }
    });

    // Start game button
    document.getElementById('startButton').addEventListener('click', function() {
        gameLoop();
    });
});