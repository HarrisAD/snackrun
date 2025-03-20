// Collision detection and resolution
import { loadLevel, levels } from './levels.js';
import { shopState } from './shop.js';
import { uiState, addNotification } from './ui.js';
import { resetLevelCountdown, onSnackCollected, onCoinsEarned } from './renderer.js';

// Track when the level completion was triggered
let levelCompleteTime = 0;

// Check if two bounding boxes are colliding
export function isColliding(box1, box2) {
    return box1.left < box2.right && 
           box1.right > box2.left && 
           box1.top < box2.bottom && 
           box1.bottom > box2.top;
}

// Check for collisions between player and game objects (snacks and bombs)
export function checkCollisions() {
    const gameState = window.gameState;
    
    // Don't check collisions if game is over or level complete
    if (gameState.gameOver || gameState.levelComplete || shopState.isOpen) {
        return;
    }
    
    const player = gameState.player;
    
    // Check collisions with snacks
    gameState.snacks.forEach(snack => {
        if (!snack.collected) {
            // Simple circle-rectangle collision for better accuracy
            const circleDistanceX = Math.abs(snack.x - player.x);
            const circleDistanceY = Math.abs(snack.y - (player.y - player.height/2));
            
            if (circleDistanceX > (player.width/2 + snack.radius)) { return; }
            if (circleDistanceY > (player.height/2 + snack.radius)) { return; }
            
            if (circleDistanceX <= (player.width/2)) { 
                snack.collected = true;
                gameState.score += 10;
                console.log(`Snack collected! Score: ${gameState.score}`);
                // Call UI effect for snack collection
                onSnackCollected(snack);
                checkLevelCompletion();
                return;
            }
            if (circleDistanceY <= (player.height/2)) { 
                snack.collected = true;
                gameState.score += 10;
                console.log(`Snack collected! Score: ${gameState.score}`);
                // Call UI effect for snack collection
                onSnackCollected(snack);
                checkLevelCompletion();
                return;
            }
            
            const cornerDistance = Math.pow(circleDistanceX - player.width/2, 2) +
                                  Math.pow(circleDistanceY - player.height/2, 2);
            
            if (cornerDistance <= Math.pow(snack.radius, 2)) {
                snack.collected = true;
                gameState.score += 10;
                console.log(`Snack collected! Score: ${gameState.score}`);
                // Call UI effect for snack collection
                onSnackCollected(snack);
                checkLevelCompletion();
            }
        }
    });
    
    // Check collisions with bombs
    gameState.bombs.forEach(bomb => {
        if (bomb.active) {
            // Simple circle-rectangle collision for better accuracy
            const circleDistanceX = Math.abs(bomb.x - player.x);
            const circleDistanceY = Math.abs(bomb.y - (player.y - player.height/2));
            
            if (circleDistanceX > (player.width/2 + bomb.radius)) { return; }
            if (circleDistanceY > (player.height/2 + bomb.radius)) { return; }
            
            if (circleDistanceX <= (player.width/2) || circleDistanceY <= (player.height/2)) {
                bomb.active = false;
                console.log("BOOM! Bomb hit!");
                // Instead of immediately calling onBombHit, handle directly here
                if (uiState.healthPoints > 1) {
                    // Player still has more than one life, restart level
                    uiState.healthPoints--;
                    addNotification(`Life lost! ${uiState.healthPoints} remaining.`);
                    
                    // Use loadLevel directly - don't use callbacks which might not properly import
                    loadLevel(gameState.currentLevel);
                } else {
                    // Last life - game over
                    uiState.healthPoints = 0;
                    gameState.gameOver = true;
                    player.color = '#7f8c8d'; // Change player color to indicate death
                }
                return;
            }
            
            const cornerDistance = Math.pow(circleDistanceX - player.width/2, 2) +
                                 Math.pow(circleDistanceY - player.height/2, 2);
            
            if (cornerDistance <= Math.pow(bomb.radius, 2)) {
                bomb.active = false;
                console.log("BOOM! Bomb hit!");
                // Instead of immediately calling onBombHit, handle directly here
                if (uiState.healthPoints > 1) {
                    // Player still has more than one life, restart level
                    uiState.healthPoints--;
                    addNotification(`Life lost! ${uiState.healthPoints} remaining.`);
                    
                    // Use loadLevel directly - don't use callbacks which might not properly import
                    loadLevel(gameState.currentLevel);
                } else {
                    // Last life - game over
                    uiState.healthPoints = 0;
                    gameState.gameOver = true;
                    player.color = '#7f8c8d'; // Change player color to indicate death
                }
            }
        }
    });
}

// Modified coin award function to trigger UI effects
function awardCoinsWithEffect(amount) {
    const gameState = window.gameState;
    const player = gameState.player;
    
    // Award coins
    gameState.awardCoins(amount);
    
    // Trigger coin collection animation and notification
    onCoinsEarned(amount, player.x, player.y - player.height);
}

// Check if level is complete
function checkLevelCompletion() {
    const gameState = window.gameState;
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    
    if (remainingSnacks === 0) {
        gameState.levelComplete = true;
        
        // Award coins with visual effect
        awardCoinsWithEffect(5);
        
        console.log("Level Complete!");
        
        // Record the time when level was completed
        levelCompleteTime = Date.now();
        
        // If there are more levels, schedule next level loading
        if (gameState.currentLevel < levels.length) {
            setTimeout(() => {
                loadLevel(gameState.currentLevel + 1);
                resetLevelCountdown(); // Reset the countdown for next time
            }, 3000); // Wait 3 seconds before loading next level
        } else {
            console.log("Game Complete! All levels finished.");
        }
    }
}

// Get the timestamp when level completion was triggered (for external use)
export function getLevelCompleteTime() {
    return levelCompleteTime;
}

// Reset level completion timer (for external use)
export function resetLevelCompleteTime() {
    levelCompleteTime = 0;
}