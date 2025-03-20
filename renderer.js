// Rendering and drawing functions
import { levels } from './levels.js';
import { shopState } from './shop.js';

// Add a counter for level transition countdown
let levelTransitionCountdown = 3;
let lastCountdownTime = 0;

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

// Draw status information
export function drawStatus(ctx) {
    const gameState = window.gameState;
    
    // Draw status banner background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 800, 40);
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 27);
    
    // Draw level
    ctx.fillText(`Level: ${gameState.currentLevel}`, 150, 27);
    
    // Draw total coins
    ctx.fillStyle = '#f1c40f'; // Brighter gold color
    ctx.fillText(`Coins: ${gameState.totalCoins}`, 250, 27);
    
    // Draw snacks remaining
    ctx.fillStyle = 'white';
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    ctx.fillText(`Snacks: ${remainingSnacks}/${gameState.snacks.length}`, 380, 27);
    
    // Draw shop hint - only when shop is not open, no game over, no level complete
    if (!shopState.isOpen && !gameState.gameOver && !gameState.levelComplete) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#3498db';
        ctx.fillText('Press "S" for Shop', 790, 27);
    }
}

// Draw game instructions or messages
export function drawGameMessages(ctx, canvas) {
    const gameState = window.gameState;
    
    // Don't draw messages if shop is open
    if (shopState.isOpen) return;
    
    if (gameState.gameOver) {
        // Draw larger game over message in center
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(250, 250, 300, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 400, 300);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, 400, 330);
        ctx.fillText('Press R to restart', 400, 360);
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
        
        // Draw larger level complete message in center
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(250, 250, 300, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', 400, 300);
        
        ctx.font = '20px Arial';
        if (gameState.currentLevel < levels.length) {
            ctx.fillText(`Next level in ${levelTransitionCountdown}...`, 400, 330);
        } else {
            ctx.fillText(`All levels completed!`, 400, 330);
        }
    }
}

// Reset countdown (called when starting a new level)
export function resetLevelCountdown() {
    levelTransitionCountdown = 3;
    lastCountdownTime = 0;
}