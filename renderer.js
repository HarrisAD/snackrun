// Add to the top part of renderer.js to prevent double transitions
import { progressionState } from './levelProgression.js';

// When drawing game messages in renderer.js, modify the levelComplete section:
export function drawGameMessages(ctx, canvas) {
    const gameState = window.gameState;
    
    // Don't draw messages if shop is open or tutorial is showing
    if (shopState.isOpen || uiState.showTutorial) return;
    
    if (gameState.gameOver) {
        // Draw enhanced game over screen
        drawGameOverScreen(ctx, gameState.score, canvas);
    } else if (gameState.levelComplete) {
        // Handle countdown timer - but only if not in level transition
        // This prevents renderer from creating its own fade transitions
        if (!progressionState.inTransition) {
            const currentTime = Date.now();
            
            // Initialize the countdown when level first completes
            if (lastCountdownTime === 0) {
                lastCountdownTime = currentTime;
                levelTransitionCountdown = 3;
            }
            
            // Update the countdown every second
            if (currentTime - lastCountdownTime >= 1000) {
                levelTransitionCountdown--;
                lastCountdownTime = currentTime;
                
                // Ensure countdown never goes below 1
                if (levelTransitionCountdown < 1) {
                    levelTransitionCountdown = 1; // Keep it at 1 until the level actually changes
                }
            }
        }
        
        // Draw enhanced level complete screen
        drawLevelCompleteScreen(ctx, gameState.currentLevel, gameState.score, levelTransitionCountdown, canvas);
    }
    
    // Draw UI animations (score popups, coin animations, etc.)
    drawUIAnimations(ctx);
    
    // Draw tutorial overlay if active
    drawTutorialOverlay(ctx, canvas);
}