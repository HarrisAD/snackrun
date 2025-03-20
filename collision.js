// Collision detection and resolution
import { loadLevel, levels } from './levels.js';

// Check if two bounding boxes are colliding
export function isColliding(box1, box2) {
    return box1.left < box2.right && 
           box1.right > box2.left && 
           box1.top < box2.bottom && 
           box1.bottom > box2.top;
}

// Check for collisions between player and game objects
export function checkCollisions() {
    const gameState = window.gameState;
    
    // Don't check collisions if game is over or level complete
    if (gameState.gameOver || gameState.levelComplete) {
        return;
    }
    
    const player = gameState.player;
    
    // Check collisions with snacks
    gameState.snacks.forEach(snack => {
        if (!snack.collected && isColliding(player.boundingBox, snack.boundingBox)) {
            snack.collected = true;
            gameState.score += 10;
            console.log(`Snack collected! Score: ${gameState.score}`);
            
            // Check if all snacks are collected
            checkLevelCompletion();
        }
    });
    
    // Check collisions with bombs
    gameState.bombs.forEach(bomb => {
        if (bomb.active && isColliding(player.boundingBox, bomb.boundingBox)) {
            bomb.active = false;
            console.log("BOOM! Bomb hit!");
            // Trigger game over
            gameState.gameOver = true;
            player.color = '#7f8c8d'; // Change player color to indicate death
        }
    });
}

// Check if level is complete
export function checkLevelCompletion() {
    const gameState = window.gameState;
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    
    if (remainingSnacks === 0) {
        gameState.levelComplete = true;
        gameState.awardCoins(5); // Award coins for level completion
        console.log("Level Complete!");
        
        // If there are more levels, schedule next level loading
        if (gameState.currentLevel < levels.length) {
            setTimeout(() => {
                loadLevel(gameState.currentLevel + 1);
            }, 3000); // Wait 3 seconds before loading next level
        } else {
            console.log("Game Complete! All levels finished.");
        }
    }
}