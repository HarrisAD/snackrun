// Level definitions and loading
import { getRandomSnackColor } from './gameState.js';

// Level definitions
export const levels = [
    // Level 1
    {
        snacks: 5,
        bombs: 2,
        platforms: [
            { x: 200, y: 450, width: 200, height: 20 },
            { x: 500, y: 350, width: 150, height: 20 }
        ]
    },
    // Level 2
    {
        snacks: 8,
        bombs: 4,
        platforms: [
            { x: 100, y: 500, width: 100, height: 20 },
            { x: 300, y: 450, width: 100, height: 20 },
            { x: 500, y: 400, width: 100, height: 20 },
            { x: 700, y: 350, width: 100, height: 20 }
        ]
    },
    // Level 3
    {
        snacks: 12,
        bombs: 6,
        platforms: [
            { x: 150, y: 500, width: 100, height: 20 },
            { x: 400, y: 400, width: 250, height: 20 },
            { x: 200, y: 300, width: 100, height: 20 },
            { x: 600, y: 300, width: 100, height: 20 },
            { x: 350, y: 200, width: 100, height: 20 }
        ]
    }
];

// Load level
export function loadLevel(levelNum) {
    // Make sure level number is valid
    const levelIndex = levelNum - 1;
    if (levelIndex < 0 || levelIndex >= levels.length) {
        console.error("Invalid level number:", levelNum);
        return;
    }
    
    const level = levels[levelIndex];
    const gameState = window.gameState;
    
    // Reset game state
    gameState.reset();
    gameState.currentLevel = levelNum;
    
    // Create platforms
    level.platforms.forEach(platform => {
        gameState.platforms.push({
            x: platform.x,
            y: platform.y,
            width: platform.width,
            height: platform.height,
            color: '#8e44ad'
        });
    });
    
    // Create snacks (avoiding platforms)
    for (let i = 0; i < level.snacks; i++) {
        let validPosition = false;
        let snackX, snackY;
        
        // Keep trying until we find a valid position
        while (!validPosition) {
            snackX = Math.random() * (gameState.canvasWidth - 40) + 20;
            snackY = Math.random() * (gameState.canvasHeight - 100) + 20;
            
            // Check if position conflicts with any platform
            validPosition = !gameState.platforms.some(platform => {
                return snackX > platform.x - 20 && 
                       snackX < platform.x + platform.width + 20 &&
                       snackY > platform.y - 20 && 
                       snackY < platform.y + platform.height + 20;
            });
        }
        
        gameState.snacks.push({
            x: snackX,
            y: snackY,
            radius: 15,
            color: getRandomSnackColor(),
            collected: false,
            // Collision properties
            boundingBox: {
                left: snackX - 15,
                right: snackX + 15,
                top: snackY - 15,
                bottom: snackY + 15
            }
        });
    }
    
    // Create bombs (avoiding platforms and snacks)
    for (let i = 0; i < level.bombs; i++) {
        let validPosition = false;
        let bombX, bombY;
        
        // Keep trying until we find a valid position
        while (!validPosition) {
            bombX = Math.random() * (gameState.canvasWidth - 40) + 20;
            bombY = Math.random() * (gameState.canvasHeight - 100) + 20;
            
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
    
    console.log(`Loaded Level ${levelNum} with ${gameState.snacks.length} snacks, ${gameState.bombs.length} bombs, and ${gameState.platforms.length} platforms`);
}