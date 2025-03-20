// Level definitions and loading

// Get random snack color (utility function)
function getRandomSnackColor() {
    const colors = ['#2ecc71', '#f1c40f', '#9b59b6', '#3498db', '#1abc9c', '#f39c12'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Level definitions
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
        ]
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
        ]
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
    
    // Create snacks at pre-defined locations if available
    if (level.snackLocations && level.snackLocations.length >= level.snacks) {
        // Use pre-defined locations
        for (let i = 0; i < level.snacks; i++) {
            const location = level.snackLocations[i];
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
        for (let i = 0; i < level.snacks; i++) {
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
    
    // Create bombs (avoiding platforms and snacks)
    for (let i = 0; i < level.bombs; i++) {
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
    
    console.log(`Loaded Level ${levelNum} with ${gameState.snacks.length} snacks, ${gameState.bombs.length} bombs, and ${gameState.platforms.length} platforms`);
}