// Level definitions and loading
import { setLevel, startLevelTransition } from './levelProgression.js';
import { resetLevelCountdown } from './renderer.js';
import { resetLives } from './ui.js';
import { startNewLevel } from './game.js';

// Get random snack color (utility function)
function getRandomSnackColor() {
    const colors = ['#2ecc71', '#f1c40f', '#9b59b6', '#3498db', '#1abc9c', '#f39c12'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Level definitions - these are now the base designs
// Dynamic levels will be generated for levels beyond this list
export const levels = [
    // Level 1 - Easy introduction
    {
        snacks: 5,
        bombs: 2,
        platforms: [
            { x: 200, y: 450, width: 200, height: 20 },
            { x: 500, y: 350, width: 150, height: 20 },
            { x: 100, y: 250, width: 150, height: 20 }
        ],
        // Pre-defined snack locations to ensure they're reachable
        snackLocations: [
            { x: 300, y: 420 },  // On first platform
            { x: 550, y: 320 },  // On second platform
            { x: 150, y: 220 },  // On third platform
            { x: 400, y: 150 },  // In the air (jumpable from third platform)
            { x: 700, y: 500 }   // On the ground
        ],
        // Level-specific messages
        levelMessage: "Welcome to SnackRun! Collect all snacks to complete the level.",
        // Coin reward for completion
        coinReward: 5
    },
    // Level 2 - Stepping stones
    {
        snacks: 8,
        bombs: 4,
        platforms: [
            { x: 100, y: 500, width: 100, height: 20 },
            { x: 300, y: 450, width: 100, height: 20 },
            { x: 500, y: 400, width: 100, height: 20 },
            { x: 700, y: 350, width: 100, height: 20 },
            { x: 500, y: 250, width: 100, height: 20 },
            { x: 300, y: 200, width: 100, height: 20 }
        ],
        // Pre-defined snack locations
        snackLocations: [
            { x: 150, y: 470 },  // On first platform
            { x: 350, y: 420 },  // On second platform
            { x: 550, y: 370 },  // On third platform
            { x: 750, y: 320 },  // On fourth platform
            { x: 550, y: 220 },  // On fifth platform
            { x: 350, y: 170 },  // On sixth platform
            { x: 450, y: 100 },  // In the air (jumpable from sixth platform)
            { x: 250, y: 550 }   // On the ground
        ],
        levelMessage: "Try to jump between the stepping stones carefully!",
        coinReward: 6
    },
    // Level 3 - Complex layout
    {
        snacks: 12,
        bombs: 6,
        platforms: [
            { x: 150, y: 500, width: 100, height: 20 },
            { x: 400, y: 450, width: 250, height: 20 },
            { x: 200, y: 350, width: 100, height: 20 },
            { x: 600, y: 350, width: 100, height: 20 },
            { x: 350, y: 250, width: 150, height: 20 },
            { x: 50, y: 200, width: 100, height: 20 },
            { x: 650, y: 200, width: 100, height: 20 },
            { x: 400, y: 120, width: 100, height: 20 }
        ],
        // Pre-defined snack locations
        snackLocations: [
            { x: 200, y: 470 },  // On first platform
            { x: 450, y: 420 },  // On second platform
            { x: 600, y: 420 },  // On second platform (right side)
            { x: 250, y: 320 },  // On third platform
            { x: 650, y: 320 },  // On fourth platform
            { x: 400, y: 220 },  // On fifth platform
            { x: 100, y: 170 },  // On sixth platform
            { x: 700, y: 170 },  // On seventh platform
            { x: 450, y: 90 },   // On eighth platform
            { x: 300, y: 150 },  // In the air between platforms
            { x: 550, y: 150 },  // In the air between platforms
            { x: 350, y: 550 }   // On the ground
        ],
        levelMessage: "This level is getting trickier! Watch your step.",
        coinReward: 8
    },
    // Level 4 - Sparse layout with more bombs
    {
        snacks: 10,
        bombs: 10,
        platforms: [
            { x: 50, y: 500, width: 80, height: 20 },
            { x: 200, y: 450, width: 80, height: 20 },
            { x: 350, y: 400, width: 80, height: 20 },
            { x: 500, y: 350, width: 80, height: 20 },
            { x: 650, y: 300, width: 80, height: 20 },
            { x: 500, y: 200, width: 80, height: 20 },
            { x: 350, y: 150, width: 80, height: 20 },
            { x: 200, y: 100, width: 80, height: 20 }
        ],
        snackLocations: [
            { x: 90, y: 470 },
            { x: 240, y: 420 },
            { x: 390, y: 370 },
            { x: 540, y: 320 },
            { x: 690, y: 270 },
            { x: 540, y: 170 },
            { x: 390, y: 120 },
            { x: 240, y: 70 },
            { x: 400, y: 500 },
            { x: 600, y: 500 }
        ],
        bombSpawnPoints: [
            { x: 150, y: 520 },
            { x: 300, y: 520 },
            { x: 450, y: 520 },
            { x: 600, y: 520 },
            { x: 140, y: 420 },
            { x: 290, y: 370 },
            { x: 440, y: 320 },
            { x: 590, y: 270 },
            { x: 440, y: 170 },
            { x: 290, y: 120 }
        ],
        levelMessage: "More bombs now! Be extra careful where you step.",
        coinReward: 10
    },
    // Level 5 - Vertical challenge
    {
        snacks: 15,
        bombs: 12,
        platforms: [
            // Main vertical path
            { x: 100, y: 550, width: 200, height: 20 },
            { x: 350, y: 500, width: 100, height: 20 },
            { x: 500, y: 450, width: 100, height: 20 },
            { x: 350, y: 400, width: 100, height: 20 },
            { x: 200, y: 350, width: 100, height: 20 },
            { x: 350, y: 300, width: 100, height: 20 },
            { x: 500, y: 250, width: 100, height: 20 },
            { x: 350, y: 200, width: 100, height: 20 },
            { x: 200, y: 150, width: 100, height: 20 },
            { x: 350, y: 100, width: 300, height: 20 }
        ],
        // Snacks positioned along the vertical path
        snackLocations: [
            // Lower section
            { x: 150, y: 520 },
            { x: 250, y: 520 },
            { x: 400, y: 470 },
            { x: 550, y: 420 },
            { x: 400, y: 370 },
            // Middle section
            { x: 250, y: 320 },
            { x: 400, y: 270 },
            { x: 550, y: 220 },
            { x: 400, y: 170 },
            // Upper section
            { x: 250, y: 120 },
            { x: 350, y: 70 },
            { x: 450, y: 70 },
            { x: 550, y: 70 },
            // Extras
            { x: 600, y: 520 },
            { x: 700, y: 520 }
        ],
        bombSpawnPoints: [
            // Along the path 
            { x: 300, y: 520 },
            { x: 450, y: 470 },
            { x: 450, y: 420 },
            { x: 300, y: 370 },
            { x: 300, y: 320 },
            { x: 450, y: 270 },
            { x: 450, y: 220 },
            { x: 300, y: 170 },
            { x: 300, y: 120 },
            // Extra challenges
            { x: 650, y: 470 },
            { x: 100, y: 400 },
            { x: 700, y: 300 }
        ],
        levelMessage: "The climb gets steeper! Time your jumps perfectly.",
        coinReward: 12
    }
];

// Make levels available globally
window.gameLevels = levels;

// Load level
export function loadLevel(levelNumber) {
    const gameState = window.gameState;
    
    // Reset game state
    gameState.reset();
    gameState.currentLevel = levelNumber;
    
    // Get level data from progression system (either predefined or dynamic)
    const levelData = setLevel(levelNumber);
    
    // Reset lives at the start of the game (level 1)
    if (levelNumber === 1) {
        resetLives();
    }
    
    // Create platforms
    levelData.platforms.forEach(platform => {
        gameState.platforms.push({
            x: platform.x,
            y: platform.y,
            width: platform.width,
            height: platform.height,
            color: platform.color || '#8e44ad'
        });
    });
    
    // Create snacks at predefined locations if available
    if (levelData.snackLocations && levelData.snackLocations.length > 0) {
        // Use pre-defined locations
        for (let i = 0; i < levelData.snacks && i < levelData.snackLocations.length; i++) {
            const location = levelData.snackLocations[i];
            gameState.snacks.push({
                x: location.x,
                y: location.y,
                radius: 15,
                color: getRandomSnackColor(),
                collected: false,
                // Collision properties
                boundingBox: {
                    left: location.x - 15,
                    right: location.x + 15,
                    top: location.y - 15,
                    bottom: location.y + 15
                }
            });
        }
    } else {
        // Fallback to random placement (with platform checks)
        for (let i = 0; i < levelData.snacks; i++) {
            // Try to place snacks on platforms first
            if (i < gameState.platforms.length) {
                const platform = gameState.platforms[i % gameState.platforms.length];
                const snackX = platform.x + platform.width / 2;
                const snackY = platform.y - 20; // 20 pixels above the platform
                
                gameState.snacks.push({
                    x: snackX,
                    y: snackY,
                    radius: 15,
                    color: getRandomSnackColor(),
                    collected: false,
                    boundingBox: {
                        left: snackX - 15,
                        right: snackX + 15,
                        top: snackY - 15,
                        bottom: snackY + 15
                    }
                });
            } else {
                // If we run out of platforms, place some on the ground
                let validPosition = false;
                let snackX, snackY;
                
                while (!validPosition) {
                    snackX = Math.random() * (gameState.canvasWidth - 40) + 20;
                    snackY = gameState.canvasHeight - 30; // Near the ground
                    
                    // Make sure snacks aren't too close to each other
                    validPosition = !gameState.snacks.some(snack => {
                        const distance = Math.sqrt(
                            Math.pow(snackX - snack.x, 2) + 
                            Math.pow(snackY - snack.y, 2)
                        );
                        return distance < 60; // Keep snacks at least 60px apart
                    });
                }
                
                gameState.snacks.push({
                    x: snackX,
                    y: snackY,
                    radius: 15,
                    color: getRandomSnackColor(),
                    collected: false,
                    boundingBox: {
                        left: snackX - 15,
                        right: snackX + 15,
                        top: snackY - 15,
                        bottom: snackY + 15
                    }
                });
            }
        }
    }
    
    // Create bombs
    if (levelData.bombSpawnPoints && levelData.bombSpawnPoints.length > 0) {
        // Use predefined bomb locations
        for (let i = 0; i < levelData.bombs && i < levelData.bombSpawnPoints.length; i++) {
            const location = levelData.bombSpawnPoints[i];
            gameState.bombs.push({
                x: location.x,
                y: location.y,
                radius: 15,
                color: '#333333',
                active: true,
                boundingBox: {
                    left: location.x - 15,
                    right: location.x + 15,
                    top: location.y - 15,
                    bottom: location.y + 15
                }
            });
        }
    } else {
        // Use fallback bomb placement (avoiding platforms and snacks)
        for (let i = 0; i < levelData.bombs; i++) {
            let validPosition = false;
            let bombX, bombY;
            
            // Keep trying until we find a valid position
            while (!validPosition) {
                // Place bombs primarily on the ground
                bombX = Math.random() * (gameState.canvasWidth - 40) + 20;
                bombY = gameState.canvasHeight - 20; // Near the ground
                
                // Some bombs can be in the air but still reachable
                if (i % 3 === 0 && i > 0) {
                    bombY = Math.random() * (gameState.canvasHeight - 200) + 100;
                }
                
                // Check if position conflicts with any platform
                const platformCollision = gameState.platforms.some(platform => {
                    return bombX > platform.x - 20 && 
                        bombX < platform.x + platform.width + 20 &&
                        bombY > platform.y - 20 && 
                        bombY < platform.y + platform.height + 20;
                });
                
                // Check if position conflicts with any snack
                const snackCollision = gameState.snacks.some(snack => {
                    const distance = Math.sqrt(
                        Math.pow(bombX - snack.x, 2) + 
                        Math.pow(bombY - snack.y, 2)
                    );
                    return distance < 40; // Keep bombs away from snacks
                });
                
                validPosition = !platformCollision && !snackCollision;
            }
            
            gameState.bombs.push({
                x: bombX,
                y: bombY,
                radius: 15,
                color: '#333333',
                active: true,
                // Collision properties
                boundingBox: {
                    left: bombX - 15,
                    right: bombX + 15,
                    top: bombY - 15,
                    bottom: bombY + 15
                }
            });
        }
    }
    
    // Store the coin reward for this level
    gameState.levelCoinReward = levelData.coinReward || 5;
    
    console.log(`Loaded Level ${levelNumber} with ${gameState.snacks.length} snacks, ${gameState.bombs.length} bombs, and ${gameState.platforms.length} platforms`);
}

// Progress to the next level with transition
export function progressToNextLevel() {
    const gameState = window.gameState;
    
    // Prevent duplicate calls by checking if already in transition
    if (gameState.inTransition) {
        console.log("Already in transition, ignoring duplicate call");
        return;
    }
    
    console.log(`Level complete! Moving from level ${gameState.currentLevel} to level ${gameState.currentLevel + 1}`);
    gameState.inTransition = true;
    
    const currentLevel = gameState.currentLevel;
    const nextLevel = currentLevel + 1;
    
    // Call transition effect from progression system
    startLevelTransition(currentLevel, nextLevel, () => {
        // This function will be called during the transition
        console.log(`Starting new level: ${nextLevel}`);
        startNewLevel(nextLevel);
        
        // Clear the transition flag after a delay
        setTimeout(() => {
            gameState.inTransition = false;
            console.log("Transition flag cleared");
        }, 1000);
    });
}