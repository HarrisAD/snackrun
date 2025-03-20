// Controls and input handling
import { loadLevel } from './levels.js';
import { toggleShop, handleShopClick, shopState } from './shop.js';
import { toggleTutorial, uiState, addNotification } from './ui.js';
import { resetLevelCountdown } from './renderer.js';

// Track if the game is paused
let gamePaused = false;

// Handler for keydown events
export function handleKeyDown(e) {
    const gameState = window.gameState;
    console.log("Key pressed:", e.key);  // Debug log
    
    // Handle tutorial closing with any key
    if (uiState.showTutorial) {
        toggleTutorial();
        // Only start the game after tutorial is closed if we're at level 1
        if (gameState.currentLevel === 1) {
            loadLevel(1);
            resetLevelCountdown();
        }
        return;
    }
    
    // Don't process keys if shop is open (except ESC key)
    if (shopState.isOpen && e.key !== 'Escape') {
        return;
    }
    
    // Don't process movement keys if game is paused
    if (gamePaused && !['p', 'P', 'Escape'].includes(e.key)) {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            gameState.keys.left = true;
            break;
        case 'ArrowRight':
            gameState.keys.right = true;
            break;
        case 'ArrowUp':
            gameState.keys.up = true;
            break;
        // Add 'r' key to reset level or game
        case 'r':
        case 'R':
            if (gameState.gameOver) {
                // Complete game reset
                completeGameReset();
                addNotification("Game Reset!");
            } else {
                // Just reset current level
                loadLevel(gameState.currentLevel);
                resetLevelCountdown();
                addNotification("Level restarted!");
            }
            break;
        // Add 's' key to toggle shop
        case 's':
        case 'S':
            toggleShop();
            break;
        // Add 'p' key to pause game
        case 'p':
        case 'P':
            togglePause();
            break;
        // Add 't' key to show tutorial
        case 't':
        case 'T':
            toggleTutorial();
            break;
        // Add ESC key to close shop or tutorial, or unpause
        case 'Escape':
            if (shopState.isOpen) {
                toggleShop();
            } else if (uiState.showTutorial) {
                toggleTutorial();
            } else if (gamePaused) {
                togglePause();
            }
            break;
        // Add number keys to jump to specific levels (for testing)
        case '1':
        case '2':
        case '3':
            const levelNum = parseInt(e.key);
            if (levelNum > 0) {
                loadLevel(levelNum);
                resetLevelCountdown();
                addNotification(`Jumped to Level ${levelNum}`);
            }
            break;
    }
}

// Handler for keyup events
export function handleKeyUp(e) {
    const gameState = window.gameState;
    console.log("Key released:", e.key);  // Debug log
    
    // Don't process keys if in tutorial
    if (uiState.showTutorial) {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            gameState.keys.left = false;
            break;
        case 'ArrowRight':
            gameState.keys.right = false;
            break;
        case 'ArrowUp':
            gameState.keys.up = false;
            break;
    }
}

// Handler for mouse clicks
export function handleClick(e) {
    // Get canvas coordinates
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log("Click at:", x, y);  // Debug log
    
    // Handle tutorial closing with click
    if (uiState.showTutorial) {
        toggleTutorial();
        // Only start the game after tutorial is closed if we're at level 1
        if (window.gameState.currentLevel === 1) {
            loadLevel(1);
            resetLevelCountdown();
        }
        return;
    }
    
    // Handle shop clicks if shop is open
    if (shopState.isOpen) {
        handleShopClick(x, y, canvas);
    }
    
    // If game is paused, unpause it
    if (gamePaused) {
        togglePause();
    }
}

// Toggle game pause state
export function togglePause() {
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        // Freeze all motion and player input
        const gameState = window.gameState;
        
        // Save current speeds
        gameState.savedState = {
            playerSpeedX: gameState.player.speedX,
            playerSpeedY: gameState.player.speedY
        };
        
        // Stop all movement
        gameState.player.speedX = 0;
        gameState.player.speedY = 0;
        
        addNotification("Game Paused", 1000000); // Very long duration
    } else {
        // Resume game
        const gameState = window.gameState;
        
        // Restore movement if saved state exists
        if (gameState.savedState) {
            gameState.player.speedX = gameState.savedState.playerSpeedX;
            gameState.player.speedY = gameState.savedState.playerSpeedY;
            gameState.savedState = null;
        }
        
        // Remove pause notification
        uiState.notifications = uiState.notifications.filter(n => n.text !== "Game Paused");
    }
}

// Check if game is paused
export function isGamePaused() {
    return gamePaused;
}

// Complete game reset - resets everything to initial state
export function completeGameReset() {
    const gameState = window.gameState;
    
    // Reset basic game properties
    gameState.gameOver = false;
    gameState.levelComplete = false;
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.totalCoins = 0;
    
    // Reset player position and properties to defaults
    gameState.player.x = 400;
    gameState.player.y = 500;
    gameState.player.speedX = 0;
    gameState.player.speedY = 0;
    gameState.player.color = '#e74c3c';
    gameState.player.moveSpeed = 300; // Reset to default without upgrades
    gameState.player.jumpPower = 550; // Reset to default without upgrades
    
    // Clear all game objects
    gameState.snacks = [];
    gameState.bombs = [];
    gameState.platforms = [];
    
    // Reset UI state
    uiState.healthPoints = 3; 
    uiState.scoreAnimations = [];
    uiState.coinAnimations = [];
    uiState.notifications = [];
    
    // Load the first level
    loadLevel(1);
    resetLevelCountdown();
}