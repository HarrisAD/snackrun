// Main game file that loads and initializes everything
import { GameState } from './gamestate.JS';
import { setupControls } from './controls.js';
import { loadLevel } from './levels.js';
import { drawGrid, drawGameObjects, drawPlayer, drawStatus, drawGameMessages } from './renderer.js';
import { updatePlayer, updatePlayerBoundingBox, updateGameObjectsBoundingBoxes } from './physics.js';
import { checkCollisions, checkLevelCompletion } from './collision.js';

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
    
    // Set up keyboard controls
    setupControls(canvas);
    
    // Load first level
    loadLevel(1);
    
    // Show an initial instruction to click the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(250, 250, 300, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click the canvas to activate controls', 400, 290);
    ctx.fillText('Use arrow keys to move and jump', 400, 320);
    
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
        
        // Update player bounding box
        updatePlayerBoundingBox();
        
        // Update game objects bounding boxes
        updateGameObjectsBoundingBoxes();
        
        // Update and draw player
        updatePlayer(deltaTime, canvas);
        
        // Draw game objects
        drawGameObjects(ctx);
        drawPlayer(ctx);
        
        // Check for collisions
        checkCollisions();
        
        // Draw status information
        drawStatus(ctx);
        
        // Draw game messages
        drawGameMessages(ctx, canvas);
        
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