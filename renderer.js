// Rendering functions for game objects and UI
import { progressionState } from './levelProgression.js';
import { shopState } from './shop.js';
import { uiState } from './ui.js';
import { isGamePaused } from './controls.js';

// Timer variables for level transition
let lastCountdownTime = 0;
let levelTransitionCountdown = 3;

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

// Draw game objects (snacks, bombs, platforms)
export function drawGameObjects(ctx) {
    const gameState = window.gameState;
    
    // Draw platforms
    gameState.platforms.forEach(platform => {
        // Draw platform
        ctx.fillStyle = platform.color || '#8e44ad';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw platform outline
        ctx.strokeStyle = '#663399';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
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
    
    // Debug: draw bounding box
    if (window.DEBUG_MODE) {
        const box = player.boundingBox;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    }
}

// Draw status information
export function drawStatus(ctx) {
    const gameState = window.gameState;
    
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    
    // Draw snacks remaining
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    ctx.fillText(`Snacks: ${remainingSnacks}/${gameState.snacks.length}`, 10, 60);
    
    // Draw bombs remaining
    const remainingBombs = gameState.bombs.filter(bomb => bomb.active).length;
    ctx.fillText(`Bombs: ${remainingBombs}`, 10, 90);
    
    // Draw level
    ctx.fillText(`Level: ${gameState.currentLevel}`, 10, 120);
    
    // Draw coins
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(`Coins: ${gameState.totalCoins}`, 10, 150);
    
    // Draw debug info
    const player = gameState.player;
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 580, 30);
    ctx.fillText(`On Ground: ${player.isOnGround}`, 580, 60);
    ctx.fillText(`Jumping: ${player.isJumping}`, 580, 90);
    
    // Draw pause indicator if game is paused
    if (isGamePaused()) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(350, 10, 100, 30);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', 400, 30);
    }
}

// Draw game instructions or game over message
export function drawGameMessages(ctx, canvas) {
    const gameState = window.gameState;
    
    // Don't draw messages if shop is open or tutorial is showing
    if (shopState.isOpen || uiState.showTutorial) return;
    
    // Draw instruction banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(200, 10, 400, 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    if (gameState.gameOver) {
        ctx.fillText('GAME OVER! Press R to restart', 400, 30);
        
        // Draw larger game over message in center
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(250, 250, 300, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('GAME OVER', 400, 300);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, 400, 330);
    } else if (gameState.levelComplete) {
        ctx.fillText('Level Complete! Next level loading...', 400, 30);
        
        // Handle countdown timer - but only if not in level transition
        if (!progressionState.inTransition) {
            const currentTime = Date.now();
            
            // Initialize the countdown when level first completes
            if (lastCountdownTime === 0) {
                lastCountdownTime = currentTime;
                levelTransitionCountdown = 3;
                console.log("Level transition countdown started");
            }
            
            // Update the countdown every second
            if (currentTime - lastCountdownTime >= 1000) {
                levelTransitionCountdown--;
                lastCountdownTime = currentTime;
                console.log(`Level transition countdown: ${levelTransitionCountdown}`);
                
                // Ensure countdown never goes below 1
                if (levelTransitionCountdown < 1) {
                    levelTransitionCountdown = 1; // Keep it at 1 until the level actually changes
                }
            }
            
            // Draw level complete message
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(250, 250, 300, 100);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('LEVEL COMPLETE!', 400, 290);
            
            ctx.font = '20px Arial';
            ctx.fillText(`Next level in ${levelTransitionCountdown}...`, 400, 330);
        }
    } else {
        ctx.fillText('Collect all snacks! Avoid bombs!', 400, 30);
    }
}

// Reset level transition countdown
export function resetLevelCountdown() {
    console.log("Resetting level countdown");
    lastCountdownTime = 0;
    levelTransitionCountdown = 3;
}

// Event handlers for collectible animations
export function onSnackCollected(snack) {
    // Add visual effects when snack is collected
    // This would be expanded in the full game
    console.log("Snack collected at", snack.x, snack.y);
}

export function onCoinsEarned(amount, x, y) {
    // Add visual effects when coins are earned
    // This would be expanded in the full game
    console.log(`${amount} coins earned at (${x}, ${y})`);
}