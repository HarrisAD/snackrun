// Rendering and drawing functions
import { levels } from './levels.js';

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
    
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    
    // Draw level
    ctx.fillText(`Level: ${gameState.currentLevel}`, 150, 30);
    
    // Draw total coins
    ctx.fillText(`Coins: ${gameState.totalCoins}`, 250, 30);
    
    // Draw snacks remaining
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    ctx.fillText(`Snacks: ${remainingSnacks}/${gameState.snacks.length}`, 10, 60);
    
    // Draw bombs remaining
    const remainingBombs = gameState.bombs.filter(bomb => bomb.active).length;
    ctx.fillText(`Bombs: ${remainingBombs}`, 10, 90);
    
    // Draw debug info
    const player = gameState.player;
    ctx.font = '16px Arial';
    ctx.fillText(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 580, 30);
    ctx.fillText(`On Ground: ${player.isOnGround}`, 580, 60);
    ctx.fillText(`Jumping: ${player.isJumping}`, 580, 90);
}

// Draw game instructions or messages
export function drawGameMessages(ctx, canvas) {
    const gameState = window.gameState;
    
    // Draw instruction banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(200, 10, 400, 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    if (gameState.gameOver) {
        ctx.fillText('GAME OVER! Press R to restart level', 400, 30);
        
        // Draw larger game over message in center
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(250, 250, 300, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('GAME OVER', 400, 300);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, 400, 330);
    } else if (gameState.levelComplete) {
        ctx.fillText('LEVEL COMPLETE!', 400, 30);
        
        // Draw larger level complete message in center
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(250, 250, 300, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('LEVEL COMPLETE!', 400, 300);
        
        ctx.font = '20px Arial';
        if (gameState.currentLevel < levels.length) {
            ctx.fillText(`Next level in 3 seconds...`, 400, 330);
        } else {
            ctx.fillText(`All levels completed!`, 400, 330);
        }
    } else {
        ctx.fillText(`Collect all snacks! Avoid bombs! Level ${gameState.currentLevel}`, 400, 30);
    }
}