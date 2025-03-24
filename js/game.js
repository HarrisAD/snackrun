// Main game file that loads and initializes everything
import { GameState } from './gamestate.js';
import { loadLevel } from './levels.js';
import { 
    drawGrid, 
    drawGameObjects, 
    drawPlayer, 
    drawStatus, 
    drawGameMessages,
    updateUI,
    resetLevelCountdown
} from './renderer.js';
import { updatePlayer, updatePlayerBoundingBox, updateGameObjectsBoundingBoxes } from './physics.js';
import { checkCollisions } from './collision.js';
import { drawShop, shopState } from './shop.js';
import { toggleTutorial, uiState, addNotification } from './ui.js';
import { 
    progressionState, 
    loadProgress, 
    saveProgress, 
    shouldSpawnBomb, 
    getDynamicBombSpawnPosition 
} from './levelProgression.js';

// Game timer and dynamic bomb spawning
let gameTime = 0;
let lastBombSpawnTime = 0;

// Wait for page to load fully
window.onload = function() {
    console.log("Page loaded!");
    
    // Game Canvas Setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Debug Elements
    const fpsCounter = document.getElementById('fps');
    const loopStatus = document.getElementById('loopStatus');
    loopStatus.textContent = "JavaScript running!";

    // Initialize game state (This is now shared across modules)
    window.gameState = new GameState(canvas);
    
    // Try to load saved progress
    try {
        loadProgress();
    } catch (e) {
        console.error("Error loading progress:", e);
    }
    
    // Set up event listeners for keyboard control
    setupKeyboardControls();
    setupMouseControls(canvas);
    
    // Show tutorial on first load
    toggleTutorial();
  
    // Start the game when tutorial is closed
let gameStarted = false;

// Modify the gameLoop function to check if the game should start
function gameLoop(timestamp) {
    // Add this near the beginning of the gameLoop function:
    
    // Check if we should start the game after tutorial closes
    if (!gameStarted && !uiState.showTutorial) {
        console.log("Starting game after tutorial closed");
        gameStarted = true;
        startNewLevel(1);
    }
    
    // Rest of your gameLoop code...
}  
    // Show an initial instruction to click the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(250, 250, 300, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click the canvas to activate controls', 400, 290);
    ctx.fillText('Use arrow keys to move and jump', 400, 320);
    ctx.fillText('Press S to open shop', 400, 350);
    
    // Add version number
    ctx.font = '14px Arial';
    ctx.fillText('Phase 7: Level Progression', 400, 380);
    
    // Main animation loop
    function gameLoop(timestamp) {
        // First frame timestamp setup
        if (!gameState.lastTimestamp) {
            gameState.lastTimestamp = timestamp;
            requestAnimationFrame(gameLoop);
            return;
        }
        
        // Calculate time since last frame
        const deltaTime = (timestamp - gameState.lastTimestamp) / 1000; // convert to seconds
        gameState.lastTimestamp = timestamp;
        
        // Update FPS counter
        gameState.frameCount++;
        if (timestamp - gameState.lastFpsUpdate > 1000) { // update every second
            gameState.fps = Math.round(gameState.frameCount * 1000 / (timestamp - gameState.lastFpsUpdate));
            fpsCounter.textContent = gameState.fps;
            gameState.frameCount = 0;
            gameState.lastFpsUpdate = timestamp;
        }
        
        // Clear the canvas for redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawGrid(ctx, canvas);
        
        // Update UI animations (always update these)
        updateUI(deltaTime);
        
        // Only update game state if shop is not open, tutorial is not showing, and not in transition
        if (!shopState.isOpen && !uiState.showTutorial && !progressionState.inTransition) {
            // Update level timer
            if (!gameState.gameOver && !gameState.levelComplete) {
                gameTime += deltaTime;
            }
            
            // Update player bounding box
            updatePlayerBoundingBox();
            
            // Update game objects bounding boxes
            updateGameObjectsBoundingBoxes();
            
            // Update and draw player
            updatePlayer(deltaTime, canvas);
            
            // Check for collisions
            checkCollisions();
        }
        
        // Draw game objects
        drawGameObjects(ctx);
        drawPlayer(ctx);
        
        // Draw status information
        drawStatus(ctx);
        
        // Draw game messages
        drawGameMessages(ctx, canvas);
        
        // Draw shop if open
        drawShop(ctx, canvas);
        
        // Draw border around canvas
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Update status
        loopStatus.textContent = "Running";
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Start the game loop
    console.log("Starting game loop...");
    requestAnimationFrame(gameLoop);
};

// Handle dynamic bomb spawning in advanced levels
function handleDynamicBombSpawning(deltaTime) {
    const gameState = window.gameState;
    
    // Don't spawn bombs if game is over or level is complete
    if (gameState.gameOver || gameState.levelComplete) {
        return;
    }
    
    // Check if we should spawn a bomb
    if (shouldSpawnBomb(gameTime)) {
        // Limit spawn frequency
        const currentTime = Date.now();
        const timeSinceLastBomb = currentTime - lastBombSpawnTime;
        
        if (timeSinceLastBomb > 2000) { // Minimum 2 seconds between dynamic bombs
            try {
                // Get a good spawn position
                const spawnPosition = getDynamicBombSpawnPosition(
                    gameState.player,
                    gameState.platforms,
                    gameState.bombs
                );
                
                // Create the new bomb
                const newBomb = {
                    x: spawnPosition.x,
                    y: spawnPosition.y,
                    radius: 15,
                    color: '#333333',
                    active: true,
                    isDynamic: true, // Flag as dynamically spawned
                    // Collision properties
                    boundingBox: {
                        left: spawnPosition.x - 15,
                        right: spawnPosition.x + 15,
                        top: spawnPosition.y - 15,
                        bottom: spawnPosition.y + 15
                    }
                };
                
                // Add to game bombs
                gameState.bombs.push(newBomb);
                
                // Update last spawn time
                lastBombSpawnTime = currentTime;
                
                // Debug message
                console.log(`Dynamic bomb spawned at ${spawnPosition.x.toFixed(0)}, ${spawnPosition.y.toFixed(0)}`);
            } catch (error) {
                console.error("Error spawning dynamic bomb:", error);
            }
        }
    }
}

// Function called when starting a new level
export function startNewLevel(levelNumber) {
    try {
        // Reset game timer
        gameTime = 0;
        lastBombSpawnTime = 0;
        
        // Load the level
        loadLevel(levelNumber);
        
        // Reset level countdown
        resetLevelCountdown();
        
        // Show level start notification
        if (levelNumber > 1) {
            addNotification(`Starting Level ${levelNumber}!`, 3000);
        }
        
        // Save progress when starting a new level
        saveProgress();
    } catch (error) {
        console.error("Error starting new level:", error);
    }
}

// Define controls directly in this file to avoid circular dependencies
function setupKeyboardControls() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    console.log("Keyboard controls set up");
}

function setupMouseControls(canvas) {
    canvas.addEventListener('click', handleClick);
    console.log("Mouse controls set up");
    
    // Set up click handler for canvas focus
    canvas.addEventListener('click', function() {
        console.log('Canvas clicked - ensuring focus for keyboard input');
        // Add a visual indicator that the game is active
        canvas.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.7)';
        setTimeout(() => {
            canvas.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        }, 300);
        
        // Focus on canvas for keyboard events
        canvas.focus();
    });
}

// Import these functions after defining them to avoid circular references
import { handleKeyDown, handleKeyUp, handleClick } from './controls.js';