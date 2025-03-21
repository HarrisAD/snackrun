// Rendering and drawing functions
import { levels } from './levels.js';
import { shopState } from './shop.js';
import { 
    drawEnhancedStatusBar, 
    drawLivesIndicator, 
    drawUIAnimations, 
    updateUIAnimations,
    drawGameOverScreen,
    drawLevelCompleteScreen,
    drawTutorialOverlay,
    addScoreAnimation,
    addCoinAnimation,
    addNotification,
    startFade,
    loseLife,
    resetLives,
    uiState
} from './ui.js';

// Add a counter for level transition countdown
let levelTransitionCountdown = 3;
let lastCountdownTime = 0;

// Track time elapsed in current level
let levelStartTime = 0;
let levelElapsedTime = 0;

// Draw background grid
export function drawGrid(ctx, canvas) {
    const gridSize = 50;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw game objects
export function drawGameObjects(ctx) {
    const gameState = window.gameState;
    
    // Draw platforms
    gameState.platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw platform edges
        ctx.strokeStyle = '#6c3483';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw platform texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = platform.x + 10; i < platform.x + platform.width; i += 20) {
            ctx.fillRect(i, platform.y + 5, 10, 2);
        }
    });
    
    // Draw snacks
    gameState.snacks.forEach(snack => {
        if (!snack.collected) {
            // Draw snack circle
            ctx.beginPath();
            ctx.arc(snack.x, snack.y, snack.radius, 0, Math.PI * 2);
            ctx.fillStyle = snack.color;
            ctx.fill();
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw snack details (to make it look more like food)
            ctx.beginPath();
            ctx.arc(snack.x, snack.y, snack.radius * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw bounding box for debugging if needed
            if (false) { // Set to true to see collision boxes
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    snack.boundingBox.left,
                    snack.boundingBox.top,
                    snack.boundingBox.right - snack.boundingBox.left,
                    snack.boundingBox.bottom - snack.boundingBox.top
                );
            }
        }
    });
    
    // Draw bombs
    gameState.bombs.forEach(bomb => {
        if (bomb.active) {
            // Draw bomb circle
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
            ctx.fillStyle = bomb.color;
            ctx.fill();
            
            // Draw bomb fuse
            ctx.beginPath();
            ctx.moveTo(bomb.x, bomb.y - bomb.radius);
            ctx.lineTo(bomb.x, bomb.y - bomb.radius - 10);
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw bomb highlight
            ctx.beginPath();
            ctx.arc(bomb.x + bomb.radius/3, bomb.y - bomb.radius/3, bomb.radius/5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            
            // Draw bounding box for debugging if needed
            if (false) { // Set to true to see collision boxes
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    bomb.boundingBox.left,
                    bomb.boundingBox.top,
                    bomb.boundingBox.right - bomb.boundingBox.left,
                    bomb.boundingBox.bottom - bomb.boundingBox.top
                );
            }
        }
    });
}

// Draw the player
export function drawPlayer(ctx) {
    const player = window.gameState.player;
    
    // Draw the player body (rectangle)
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width/2, player.y - player.height, player.width, player.height);
    
    // Draw outline
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x - player.width/2, player.y - player.height, player.width, player.height);
    
    // Draw eyes (to indicate direction)
    const eyeSize = 6;
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x - player.width/4 - eyeSize/2, player.y - player.height * 0.7 - eyeSize/2, eyeSize, eyeSize);
    ctx.fillRect(player.x + player.width/4 - eyeSize/2, player.y - player.height * 0.7 - eyeSize/2, eyeSize, eyeSize);
    
    // Draw mouth
    ctx.beginPath();
    ctx.moveTo(player.x - player.width/4, player.y - player.height * 0.4);
    ctx.lineTo(player.x + player.width/4, player.y - player.height * 0.4);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw jumping indicator (if jumping)
    if (player.isJumping) {
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x, player.y + 10);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Draw bounding box for debugging if needed
    if (false) { // Set to true to see collision boxes
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            player.boundingBox.left,
            player.boundingBox.top,
            player.boundingBox.right - player.boundingBox.left,
            player.boundingBox.bottom - player.boundingBox.top
        );
    }
}

// Draw status information (REPLACED with enhanced status bar)
export function drawStatus(ctx) {
    const gameState = window.gameState;
    const canvas = ctx.canvas;
    
    // Draw enhanced status bar
    drawEnhancedStatusBar(ctx, gameState, canvas);
    
    // Draw lives indicator
    drawLivesIndicator(ctx);
}

// Draw game instructions or messages
export function drawGameMessages(ctx, canvas) {
    const gameState = window.gameState;
    
    // Don't draw messages if shop is open or tutorial is showing
    if (shopState.isOpen || uiState.showTutorial) return;
    
    if (gameState.gameOver) {
        // Draw enhanced game over screen
        drawGameOverScreen(ctx, gameState.score, canvas);
    } else if (gameState.levelComplete) {
        // Handle countdown timer
        const currentTime = Date.now();
        
        // Initialize the countdown when level first completes
        if (lastCountdownTime === 0) {
            lastCountdownTime = currentTime;
            levelTransitionCountdown = 3;
        }
        
        // Update the countdown every second
        if (currentTime - lastCountdownTime >= 1000) {
            levelTransitionCountdown--;
            lastCountdownTime = currentTime;
            
            // Ensure countdown never goes below 1
            if (levelTransitionCountdown < 1) {
                levelTransitionCountdown = 1; // Keep it at 1 until the level actually changes
            }
        }
        
        // Draw enhanced level complete screen
        drawLevelCompleteScreen(ctx, gameState.currentLevel, gameState.score, levelTransitionCountdown, canvas);
    }
    
    // Draw UI animations (score popups, coin animations, etc.)
    drawUIAnimations(ctx);
    
    // Draw tutorial overlay if active
    drawTutorialOverlay(ctx, canvas);
}

// Reset countdown (called when starting a new level)
export function resetLevelCountdown() {
    levelTransitionCountdown = 3;
    lastCountdownTime = 0;
    levelStartTime = Date.now();
    levelElapsedTime = 0;
    
    // Reset lives at the start of the game (level 1)
    if (window.gameState.currentLevel === 1) {
        resetLives();
    }
    
    // Add notification
    addNotification(`Level ${window.gameState.currentLevel} Started!`);
}

// Update UI animations and effects
export function updateUI(deltaTime) {
    updateUIAnimations(deltaTime);
    
    // Update level elapsed time
    if (levelStartTime > 0 && !window.gameState.gameOver && !window.gameState.levelComplete) {
        levelElapsedTime = (Date.now() - levelStartTime) / 1000; // in seconds
    }
}

// Called when a snack is collected
export function onSnackCollected(snack) {
    // Add score animation at snack position
    addScoreAnimation(snack.x, snack.y, 10);
}

// Called when coins are earned
export function onCoinsEarned(amount, x, y) {
    // Add coin animation
    for (let i = 0; i < amount; i++) {
        // Stagger the coin animations slightly
        setTimeout(() => {
            addCoinAnimation(x, y);
        }, i * 100);
    }
    
    // Add notification
    addNotification(`+${amount} coins earned!`);
}

// Called when player hits a bomb
export function onBombHit() {
    // Check if player still has lives left
    if (loseLife()) {
        // Player still has lives, restart level
        startFade('out', 500, () => {
            // Reset level but don't reset lives
            window.gameState.reset();
            
            // Fade back in
            startFade('in', 500);
        });
    } else {
        // Game over
        window.gameState.gameOver = true;
    }
}