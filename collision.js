// Collision detection and resolution
import { progressToNextLevel, loadLevel } from './levels.js';
import { shopState } from './shop.js';
import { uiState, addNotification } from './ui.js';
import { onSnackCollected, onCoinsEarned } from './renderer.js';

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
                
                // Show collection animation
                if (typeof onSnackCollected === 'function') {
                    onSnackCollected(snack);
                }
                
                console.log(`Snack collected! Score: ${gameState.score}`);
                checkLevelCompletion();
                return;
            }
            
            if (circleDistanceY <= (player.height/2)) { 
                snack.collected = true;
                gameState.score += 10;
                
                // Show collection animation
                if (typeof onSnackCollected === 'function') {
                    onSnackCollected(snack);
                }
                
                console.log(`Snack collected! Score: ${gameState.score}`);
                checkLevelCompletion();
                return;
            }
            
            const cornerDistance = Math.pow(circleDistanceX - player.width/2, 2) +
                                  Math.pow(circleDistanceY - player.height/2, 2);
            
            if (cornerDistance <= Math.pow(snack.radius, 2)) {
                snack.collected = true;
                gameState.score += 10;
                
                // Show collection animation
                if (typeof onSnackCollected === 'function') {
                    onSnackCollected(snack);
                }
                
                console.log(`Snack collected! Score: ${gameState.score}`);
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
                
                // Handle bomb hit - check if player has lives left
                handleBombHit(player, gameState);
                return;
            }
            
            const cornerDistance = Math.pow(circleDistanceX - player.width/2, 2) +
                                 Math.pow(circleDistanceY - player.height/2, 2);
            
            if (cornerDistance <= Math.pow(bomb.radius, 2)) {
                bomb.active = false;
                console.log("BOOM! Bomb hit!");
                
                // Handle bomb hit
                handleBombHit(player, gameState);
            }
        }
    });
}

// Handle bomb hit with proper life loss
function handleBombHit(player, gameState) {
    if (uiState.healthPoints > 1) {
        // Player still has more than one life, restart level
        uiState.healthPoints--;
        addNotification(`Life lost! ${uiState.healthPoints} remaining.`);
        
        // Reload the current level
        loadLevel(gameState.currentLevel);
    } else {
        // Last life - game over
        uiState.healthPoints = 0;
        gameState.gameOver = true;
        player.color = '#7f8c8d'; // Change player color to indicate death
    }
}

// Check if level is complete
function checkLevelCompletion() {
    const gameState = window.gameState;
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    
    if (remainingSnacks === 0 && !gameState.levelComplete) {
        gameState.levelComplete = true;
        
        // Award coins - now uses the level-specific reward amount
        const coinReward = gameState.levelCoinReward || 5;
        gameState.awardCoins(coinReward);
        
        // Show coin animation
        if (typeof onCoinsEarned === 'function') {
            const player = gameState.player;
            onCoinsEarned(coinReward, player.x, player.y - player.height);
        }
        
        console.log("Level Complete!");
        
        // Record the time when level was completed
        levelCompleteTime = Date.now();
        
        // Use new progression system for level transition
        setTimeout(() => {
            progressToNextLevel();
        }, 2000); // Wait 2 seconds before transitioning to next level
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