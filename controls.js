// Controls and input handling
import { loadLevel, levels } from './levels.js';

// Handler for keydown events
function handleKeyDown(e) {
    const gameState = window.gameState;
    console.log("Key pressed:", e.key);  // Debug log
    
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
        // Add number keys to jump to specific levels (for testing)
        case '1':
        case '2':
        case '3':
            const levelNum = parseInt(e.key);
            if (levelNum > 0 && levelNum <= levels.length) {
                loadLevel(levelNum);
            }
            break;
    }
}

// Handler for keyup events
function handleKeyUp(e) {
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

// Set up all input controls
export function setupControls(canvas) {
    // Set up keyboard controls
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    console.log("Keyboard controls set up");
    
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