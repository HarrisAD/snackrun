// Controls and input handling
import { loadLevel } from './levels.js';
import { toggleShop, handleShopClick, shopState } from './shop.js';

// Handler for keydown events
export function handleKeyDown(e) {
    const gameState = window.gameState;
    console.log("Key pressed:", e.key);  // Debug log
    
    // Don't process keys if shop is open (except ESC key)
    if (shopState.isOpen && e.key !== 'Escape') {
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
        // Add 'r' key to reset level
        case 'r':
        case 'R':
            loadLevel(gameState.currentLevel);
            break;
        // Add 's' key to toggle shop
        case 's':
        case 'S':
            toggleShop();
            break;
        // Add ESC key to close shop
        case 'Escape':
            if (shopState.isOpen) {
                toggleShop();
            }
            break;
        // Add number keys to jump to specific levels (for testing)
        case '1':
        case '2':
        case '3':
            const levelNum = parseInt(e.key);
            if (levelNum > 0) {
                loadLevel(levelNum);
            }
            break;
    }
}

// Handler for keyup events
export function handleKeyUp(e) {
    const gameState = window.gameState;
    console.log("Key released:", e.key);  // Debug log
    
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
    
    // Handle shop clicks if shop is open
    if (shopState.isOpen) {
        handleShopClick(x, y, canvas);
    }
}