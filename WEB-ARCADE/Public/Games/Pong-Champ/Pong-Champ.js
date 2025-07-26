const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
        
// Game variables
let gameRunning = false;
let gameStarted = false;
let gamePaused = false;
let playerScore = 0;
let aiScore = 0;
const winningScore = 25; // Set to 25 for longer gameplay
let ballPaused = false;
        
// Audio setup
let backgroundMusic = null;
        
// Initialize audio 
function initAudio() {
    backgroundMusic = new Audio();
    backgroundMusic.src = '../../Music/Pong-Champ.mp3'; // Hehe
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5; // Adjust volume as needed
}
        
// Paddle properties
const paddleWidth = 15;
const paddleHeight = 80;
const paddleSpeed = 6;
        
// Player paddle (left)
const playerPaddle = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};
        
// AI paddle (right)
const aiPaddle = {
    x: canvas.width - 35,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};
        
// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 5,
    dy: 3,
    speed: 5
};
        
// Input handling
const keys = {};
        
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // ESC key to toggle pause
    if (e.key === 'Escape' && gameStarted && gameRunning) {
        togglePause();    
    }
});
        
document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});
        
// Start game function
function startGame() {
    gameRunning = true;
    gameStarted = true;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block';
            
    // Start background music
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Toggle pause function
function togglePause() {
    if (!gameStarted) return;

    if (gamePaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

// Pause game function
function pauseGame() {
    gamePaused = true;
    gameRunning = false;
    document.getElementById('pauseMenu').style.display = 'block';
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';

    //Pause background music
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

// Resume game function
function resumeGame() {
    gamePaused = false;
    gameRunning = true;
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';

    // Resume background music
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Restart game function
function restartGameFromPause() {
    gamePaused = false;
    gameRunning = true;
    playerScore = 0;
    aiScore = 0;
    resetBall();
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
    updateScore();

    // Restart background music
    if (backgroundMusic) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Quit game function
function quitGame() {
    gameRunning = false;
    gameStarted = false;
    gamePaused = false;
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    //Navigate back to the main menu
    window.location.href = '../../index.html';
}

// Back button function
function goBack() {
    // Stop the game and music if running
    gameRunning = false;
    gameStarted = false;
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    // Navigate back to the main menu
    window.location.href = '../../index.html';
}
        
// Update game objects
function update() {
    if (!gameRunning) return;
            
    // Player paddle movement
    if ((keys['w'] || keys['arrowup']) && playerPaddle.y > 0) {
        playerPaddle.y -= paddleSpeed;
    }
    if ((keys['s'] || keys['arrowdown']) && playerPaddle.y < canvas.height - paddleHeight) {
        playerPaddle.y += paddleSpeed;
    }
            
    // AI paddle movement (follows ball with some lag for difficulty)
    const aiCenter = aiPaddle.y + paddleHeight / 2;
    const ballCenter = ball.y;
    const aiSpeed = 3; // Slower speed for easier gameplay
            
    // Only move AI when ball is coming towards it and add more reaction delay
    if (ball.dx > 0) { // Ball moving towards AI
        if (ballCenter < aiCenter - 25) { // Larger dead zone
            aiPaddle.y -= aiSpeed;
        } else if (ballCenter > aiCenter + 25) {
            aiPaddle.y += aiSpeed;
        }
    }
            
    // Keep AI paddle in bounds
    aiPaddle.y = Math.max(0, Math.min(aiPaddle.y, canvas.height - paddleHeight));
            
    // Ball movement
    if (!ballPaused) {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
            
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy = -ball.dy;
        // Add slight random variation to prevent repetitive gameplay
        ball.dy += (Math.random() - 0.5) * 0.5;
    }
            
    // Ball collision with paddles
    // Player paddle collision
    if (ball.x - ball.radius <= playerPaddle.x + playerPaddle.width &&
        ball.y >= playerPaddle.y &&
        ball.y <= playerPaddle.y + playerPaddle.height &&
        ball.dx < 0) {
                
            ball.dx = -ball.dx;
            // Add spin based on where ball hits paddle
            const hitPos = (ball.y - playerPaddle.y) / paddleHeight;
            ball.dy = (hitPos - 0.5) * 8;
                
            // Increase speed slightly
            ball.dx *= 1.05;
            ball.dy *= 1.05;
    }
            
    // AI paddle collision
    if (ball.x + ball.radius >= aiPaddle.x &&
        ball.y >= aiPaddle.y &&
        ball.y <= aiPaddle.y + aiPaddle.height &&
        ball.dx > 0) {
                
            ball.dx = -ball.dx;
            // Add spin based on where ball hits paddle
            const hitPos = (ball.y - aiPaddle.y) / paddleHeight;
            ball.dy = (hitPos - 0.5) * 8;
                
            // Increase speed slightly
            ball.dx *= 1.05;
            ball.dy *= 1.05;
    }
            
    // Ball out of bounds (scoring)
    if (ball.x < 0) {
        aiScore++;
        pauseAndResetBall();
        if (aiScore >= winningScore) {
            endGame('AI WINS!');
        }
    } else if (ball.x > canvas.width) {
        playerScore++;
        pauseAndResetBall();
        if (playerScore >= winningScore) {
            endGame('YOU WIN!');
        }
    }
            
    // Limit ball speed
    const maxSpeed = 8;
    if (Math.abs(ball.dx) > maxSpeed) {
        ball.dx = ball.dx > 0 ? maxSpeed : -maxSpeed;
    }
    if (Math.abs(ball.dy) > maxSpeed) {
        ball.dy = ball.dy > 0 ? maxSpeed : -maxSpeed;
    }
}
        
// Reset ball to center with pause
function pauseAndResetBall() {
    ballPaused = true;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 4;
            
    // Resume ball movement after 1 second
    setTimeout(() => {
        ballPaused = false;
    }, 1000);
}
        
// Reset ball to center (for game restart)
function resetBall() {
    ballPaused = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 4;
}
        
// End game
function endGame(winner) {
    gameRunning = false;
    gameStarted = false;
            
    // Stop background music
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
            
    document.getElementById('gameOverText').textContent = winner;
    document.getElementById('finalScore').textContent = `Final Score - Player: ${playerScore}, AI: ${aiScore}`;
    document.getElementById('gameOver').style.display = 'block';
}
        
// Restart game
function restartGame() {
    gameRunning = true;
    gameStarted = true;
    playerScore = 0;
    aiScore = 0;
    resetBall();
    document.getElementById('gameOver').style.display = 'none';
    updateScore();
            
    // Restart background music
    if (backgroundMusic) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}
        
// Update score display
function updateScore() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
}
        
// Render game objects
function render() {
    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
            
    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
            
    // Draw player paddle (green)
    ctx.fillStyle = '#00FF00';
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 10;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
            
    // Draw AI paddle (red)
    ctx.fillStyle = '#FF0066';
    ctx.shadowColor = '#FF0066';
    ctx.shadowBlur = 10;
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
            
    // Draw ball (cyan)
    ctx.fillStyle = '#00FFFF';
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
            
    // Reset shadow
    ctx.shadowBlur = 0;
}
        
// Game loop
function gameLoop() {
    update();
    render();
    updateScore();
    requestAnimationFrame(gameLoop);
}
        
// Start the game
initAudio();
gameLoop();