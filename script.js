const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Game Variables
        const racketWidth = 15;
        const racketHeight = 80;
        const shuttleWidth = 10;
        const shuttleHeight = 10;
        const playerImage = new Image();
        playerImage.src = 'https://via.placeholder.com/50?text=Girl';

        let playerX = 30;
        let playerY = canvas.height / 2 - racketHeight / 2;
        let computerX = canvas.width - 50;
        let computerY = canvas.height / 2 - racketHeight / 2;
        let shuttleX = canvas.width / 2;
        let shuttleY = canvas.height / 2;
        let shuttleSpeedX = 4;
        let shuttleSpeedY = 3;
        let playerScore = 0;
        let computerScore = 0;
        const winningScore = 5;
        let isGameOver = false;

        // Draw everything
        function draw() {
            // Clear canvas
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw net
            ctx.fillStyle = '#fff';
            for (let i = 0; i < canvas.height; i += 20) {
                ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
            }

            // Draw player racket
            ctx.drawImage(playerImage, playerX, playerY, racketWidth, racketHeight);

            // Draw computer racket
            ctx.fillStyle = '#000';
            ctx.fillRect(computerX, computerY, racketWidth, racketHeight);

            // Draw shuttle
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(shuttleX, shuttleY, shuttleWidth, shuttleHeight);

            if (isGameOver) {
                ctx.font = '30px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 20);
            }
        }

        // Update positions
        function update() {
            if (isGameOver) return;

            shuttleX += shuttleSpeedX;
            shuttleY += shuttleSpeedY;

            // Ball collision with top and bottom walls
            if (shuttleY <= 0 || shuttleY + shuttleHeight >= canvas.height) {
                shuttleSpeedY = -shuttleSpeedY;
            }

            // Ball collision with player racket
            if (
                shuttleX <= playerX + racketWidth &&
                shuttleY + shuttleHeight > playerY &&
                shuttleY < playerY + racketHeight
            ) {
                shuttleSpeedX = -shuttleSpeedX;
            }

            // Ball collision with computer racket
            if (
                shuttleX + shuttleWidth >= computerX &&
                shuttleY + shuttleHeight > computerY &&
                shuttleY < computerY + racketHeight
            ) {
                shuttleSpeedX = -shuttleSpeedX;
            }

            // Ball out of bounds
            if (shuttleX <= 0) {
                computerScore++;
                resetShuttle();
            } else if (shuttleX + shuttleWidth >= canvas.width) {
                playerScore++;
                resetShuttle();
            }

            // Computer AI
            const computerCenter = computerY + racketHeight / 2;
            if (computerCenter < shuttleY - 20) {
                computerY += 3;
            } else if (computerCenter > shuttleY + 20) {
                computerY -= 3;
            }

            // Check for game over
            if (playerScore === winningScore || computerScore === winningScore) {
                isGameOver = true;
            }
        }

        // Reset shuttle position
        function resetShuttle() {
            shuttleX = canvas.width / 2;
            shuttleY = canvas.height / 2;
            shuttleSpeedX = -shuttleSpeedX;
            shuttleSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

            document.getElementById('playerScore').textContent = playerScore;
            document.getElementById('computerScore').textContent = computerScore;
        }

        // Player movement
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && playerY > 0) {
                playerY -= 10;
            } else if (e.key === 'ArrowDown' && playerY < canvas.height - racketHeight) {
                playerY += 10;
            } else if (e.key === 'r' || e.key === 'R') {
                if (isGameOver) {
                    playerScore = 0;
                    computerScore = 0;
                    isGameOver = false;
                    resetShuttle();
                }
            }
        });

        // Game loop
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        gameLoop();