// Draw lives/health indicator
export function drawLivesIndicator(ctx) {
    const startX = 500;
    const startY = 30;
    const heartSpacing = 25;
    
    // Draw proper heart icons
    for (let i = 0; i < 3; i++) {
        // Draw heart
        drawSimpleHeart(
            ctx, 
            startX + i * heartSpacing, 
            startY - 15, 
            20, 
            i < uiState.healthPoints ? "#e74c3c" : "#dddddd"
        );
    }
}

// Add a notification to be displayed temporarily
export function addNotification(text, duration = 3000) {
    uiState.notifications.push({
        text,
        age: 0,
        duration,
        opacity: 0
    });
}

// Reset health points
export function resetLives() {
    uiState.healthPoints = 3;
}

// Show tutorial overlay with game instructions
export function drawTutorialOverlay(ctx, canvas) {
    if (!uiState.showTutorial) return;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HOW TO PLAY', canvas.width/2, 80);
    
    // Control instructions
    ctx.font = 'bold 20px Arial';
    ctx.fillText('CONTROLS', canvas.width/2, 140);
    
    ctx.font = '16px Arial';
    ctx.fillText('← → : Move left/right', canvas.width/2, 180);
    ctx.fillText('↑ : Jump', canvas.width/2, 210);
    ctx.fillText('S : Open shop', canvas.width/2, 240);
    ctx.fillText('R : Restart level', canvas.width/2, 270);
    ctx.fillText('P : Pause game', canvas.width/2, 300);
    
    // Objective
    ctx.font = 'bold 20px Arial';
    ctx.fillText('OBJECTIVE', canvas.width/2, 350);
    
    ctx.font = '16px Arial';
    ctx.fillText('• Collect all snacks to complete each level', canvas.width/2, 380);
    ctx.fillText('• Avoid bombs - they will cost you a life', canvas.width/2, 410);
    ctx.fillText('• Collect coins to purchase upgrades in the shop', canvas.width/2, 440);
    ctx.fillText('• Complete all levels to win the game', canvas.width/2, 470);
    
    // Close instruction
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Click anywhere or press any key to continue', canvas.width/2, 530);
}

// Toggle tutorial visibility
export function toggleTutorial() {
    uiState.showTutorial = !uiState.showTutorial;
}

// Called when player loses a life
export function loseLife() {
    if (uiState.healthPoints > 0) {
        uiState.healthPoints--;
        addNotification(`Life lost! ${uiState.healthPoints} remaining.`);
        return true; // Still have lives left
    }
    return false; // No lives left, game over
}// Enhanced UI Elements for SnackRun
// Handles animations, lives system, and improved game screens

// UI State management
export const uiState = {
    scoreAnimations: [],   // Array to track score popup animations
    coinAnimations: [],    // Array to track coin collection animations
    fadeEffects: {         // Tracks fade in/out effects
        active: false,
        alpha: 0,
        direction: 'in',   // 'in' or 'out'
        callback: null,    // Function to call when fade completes
        duration: 1000,    // Duration in ms
        startTime: 0       // When the fade started
    },
    notifications: [],     // System for displaying temporary notifications
    healthPoints: 3,       // Player has 3 lives/health by default
    showTutorial: false,   // Whether to show tutorial overlay
    pulseEffects: {}       // Track UI elements that should pulse
};

// Update all UI animations - essential function called from game loop
export function updateUI(deltaTime) {
    // Update score animations
    for (let i = uiState.scoreAnimations.length - 1; i >= 0; i--) {
        const anim = uiState.scoreAnimations[i];
        anim.age += deltaTime * 1000;
        anim.y -= 50 * deltaTime; // Float upward
        anim.opacity = 1 - (anim.age / anim.maxAge);
        
        // Remove old animations
        if (anim.age >= anim.maxAge) {
            uiState.scoreAnimations.splice(i, 1);
        }
    }
    
    // Update coin animations
    for (let i = uiState.coinAnimations.length - 1; i >= 0; i--) {
        const anim = uiState.coinAnimations[i];
        anim.progress += deltaTime * 2; // Speed factor
        
        // Remove completed animations
        if (anim.progress >= 1) {
            uiState.coinAnimations.splice(i, 1);
        }
    }
    
    // Update fade effects
    if (uiState.fadeEffects.active) {
        const now = Date.now();
        const elapsed = now - uiState.fadeEffects.startTime;
        const progress = Math.min(1, elapsed / uiState.fadeEffects.duration);
        
        if (uiState.fadeEffects.direction === 'in') {
            uiState.fadeEffects.alpha = progress;
        } else {
            uiState.fadeEffects.alpha = 1 - progress;
        }
        
        // Check if fade is complete
        if (progress >= 1) {
            if (uiState.fadeEffects.callback) {
                uiState.fadeEffects.callback();
            }
            
            uiState.fadeEffects.active = false;
        }
    }
    
    // Update notifications
    for (let i = uiState.notifications.length - 1; i >= 0; i--) {
        const notif = uiState.notifications[i];
        notif.age += deltaTime * 1000;
        
        // Calculate opacity with fade in/out
        const fadeInDuration = 300;
        const fadeOutStart = notif.duration - 500;
        
        if (notif.age < fadeInDuration) {
            // Fade in
            notif.opacity = notif.age / fadeInDuration;
        } else if (notif.age > fadeOutStart) {
            // Fade out
            notif.opacity = 1 - ((notif.age - fadeOutStart) / (notif.duration - fadeOutStart));
        } else {
            // Full opacity in the middle
            notif.opacity = 1;
        }
        
        // Remove expired notifications
        if (notif.age >= notif.duration) {
            uiState.notifications.splice(i, 1);
        }
    }
    
    // Update pulse effects
    Object.keys(uiState.pulseEffects).forEach(key => {
        const effect = uiState.pulseEffects[key];
        effect.time += deltaTime;
        
        // Calculate pulse value (0 to 1) using sine wave
        effect.value = 0.5 + 0.5 * Math.sin(effect.time * effect.speed);
        
        // Remove expired pulse effects
        if (effect.duration && effect.time >= effect.duration) {
            delete uiState.pulseEffects[key];
        }
    });
}

// Draw a simple heart shape
function drawSimpleHeart(ctx, x, y, size, color) {
    ctx.save();
    
    // Heart shape drawing
    ctx.beginPath();
    
    // Starting point
    ctx.moveTo(x, y + size * 0.3);
    
    // Left bump
    ctx.bezierCurveTo(
        x, y, 
        x - size * 0.5, y, 
        x - size * 0.5, y + size * 0.3
    );
    
    // Left curve
    ctx.bezierCurveTo(
        x - size * 0.5, y + size * 0.6, 
        x, y + size * 0.8, 
        x, y + size
    );
    
    // Right curve
    ctx.bezierCurveTo(
        x, y + size * 0.8, 
        x + size * 0.5, y + size * 0.6, 
        x + size * 0.5, y + size * 0.3
    );
    
    // Right bump
    ctx.bezierCurveTo(
        x + size * 0.5, y, 
        x, y, 
        x, y + size * 0.3
    );
    
    // Fill heart
    ctx.fillStyle = color;
    ctx.fill();
    
    // Heart outline
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
}