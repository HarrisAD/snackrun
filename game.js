// Main game file that loads and initializes everything
import { GameState } from './gamestate.JS';
import { levels, loadLevel } from './levels.js';
import { 
    drawGrid, 
    drawGameObjects, 
    drawPlayer, 
    drawStatus, 
    drawGameMessages,
    updateUI
} from './renderer.js';
import { updatePlayer, updatePlayerBoundingBox, updateGameObjectsBoundingBoxes } from './physics.js';
import { checkCollisions } from './collision.js';
import { drawShop, shopState } from './shop.js';
import { toggleTutorial, uiState } from './ui.js';

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
    setupKeyboardControls();
    setupMouseControls(canvas);
    
    // Show tutorial on first load
    toggleTutorial();
    
    // Load first level (will happen when tutorial is closed)
    // The actual level load is now triggered in the controls.js when the tutorial is closed
    
    // Show an initial instruction to click the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(250, 250, 300, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click the canvas to activate controls', 400, 290);
    ctx.fillText('Use arrow keys to move and jump', 400, 320);
    ctx.fillText('Press S to open shop', 400, 350);
    
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
        
        // Only update game state if shop is not open and tutorial is not showing
        if (!shopState.isOpen && !uiState.showTutorial) {
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