// Main game file with localStorage references removed
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
    
    // Set up event listeners for keyboard control
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    console.log("Keyboard controls set up");
    
    // Set up mouse controls
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
    
    // Show an initial instruction to click the canvas
    drawInitialInstructions(ctx, canvas);
    
    // Show tutorial on first load
    toggleTutorial();
    
    // Main animation loop
    function gameLoop(timestamp) {
        try {
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
            if (shopState.isOpen) {
                drawShop(ctx, canvas);
            }
            
            // Draw border around canvas
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            
            // Update status
            loopStatus.textContent = "Running";
        } catch (error) {
            console.error("Error in game loop:", error);
            loopStatus.textContent = "Error: " + error.message;
        }
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Draw initial instructions
    function drawInitialInstructions(ctx, canvas) {
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
    }
    
    // Start the game loop
    console.log("Starting game loop...");
    requestAnimationFrame(gameLoop);
};

// Function called when starting a new level
export function startNewLevel(levelNumber) {
    try {
        // Load the level
        loadLevel(levelNumber);
        
        // Reset level countdown
        resetLevelCountdown();
        
        // Show level start notification
        if (levelNumber > 1) {
            addNotification(`Starting Level ${levelNumber}!`, 3000);
        }
    } catch (error) {
        console.error("Error starting new level:", error);
    }
}