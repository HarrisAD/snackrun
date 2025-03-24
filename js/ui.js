// Enhanced UI Elements for SnackRun
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

// Add a score animation at a specific position
export function addScoreAnimation(x, y, amount) {
    uiState.scoreAnimations.push({
        x,
        y,
        amount,
        age: 0,
        maxAge: 1000, // milliseconds
        opacity: 1
    });
}

// Add a coin animation at a specific position
export function addCoinAnimation(x, y) {
    uiState.coinAnimations.push({
        x,
        y,
        targetX: 250, // Where the coin UI is positioned
        targetY: 27, 
        progress: 0,
        maxAge: 1000 // milliseconds
    });
}

// Update all UI animations
export function updateUIAnimations(deltaTime) {
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
        
        // Use ease-out curve for smooth animation
        const t = Math.min(1, anim.progress);
        const easeOut = 1 - Math.pow(1 - t, 3);
        
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

// Draw all UI animations
export function drawUIAnimations(ctx) {
    // Draw score popup animations
    uiState.scoreAnimations.forEach(anim => {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 0, ${anim.opacity})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${anim.opacity})`;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(`+${anim.amount}`, anim.x, anim.y);
        ctx.fillText(`+${anim.amount}`, anim.x, anim.y);
        ctx.restore();
    });
    
    // Draw coin animations
    uiState.coinAnimations.forEach(anim => {
        ctx.save();
        
        // Calculate current position with easing
        const t = Math.min(1, anim.progress);
        const easeOut = 1 - Math.pow(1 - t, 3);
        
        const currentX = anim.x + (anim.targetX - anim.x) * easeOut;
        const currentY = anim.y + (anim.targetY - anim.y) * easeOut;
        
        // Calculate scale (starts big, ends small)
        const scale = 1 - easeOut * 0.5;
        
        // Draw coin
        ctx.translate(currentX, currentY);
        ctx.scale(scale, scale);
        
        // Draw a simple coin circle with sparkle effect
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f';
        ctx.fill();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add shine effect based on animation progress
        const shineAngle = anim.progress * Math.PI * 4;
        ctx.beginPath();
        ctx.arc(0, 0, 5, shineAngle, shineAngle + Math.PI * 0.8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    });
    
    // Draw fade overlay if active
    if (uiState.fadeEffects.active) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${uiState.fadeEffects.alpha})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
    
    // Draw notifications
    uiState.notifications.forEach((notif, index) => {
        const y = 120 + index * 40;
        
        ctx.save();
        // Draw background
        ctx.fillStyle = `rgba(0, 0, 0, ${notif.opacity * 0.7})`;
        const textWidth = ctx.measureText(notif.text).width;
        ctx.fillRect(ctx.canvas.width/2 - textWidth/2 - 10, y - 20, textWidth + 20, 30);
        
        // Draw text
        ctx.fillStyle = `rgba(255, 255, 255, ${notif.opacity})`;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(notif.text, ctx.canvas.width/2, y);
        ctx.restore();
    });
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

// Start a screen fade effect
export function startFade(direction, duration = 1000, callback = null) {
    uiState.fadeEffects.active = true;
    uiState.fadeEffects.direction = direction;
    uiState.fadeEffects.duration = duration;
    uiState.fadeEffects.callback = callback;
    uiState.fadeEffects.startTime = Date.now();
    
    // Set initial alpha value
    if (direction === 'in') {
        uiState.fadeEffects.alpha = 0;
    } else {
        uiState.fadeEffects.alpha = 1;
    }
}

// Add a pulse effect to a UI element
export function addPulseEffect(id, speed = 5, duration = null) {
    uiState.pulseEffects[id] = {
        time: 0,
        speed,
        value: 0,
        duration
    };
}

// Get current pulse value for an element
export function getPulseValue(id) {
    if (uiState.pulseEffects[id]) {
        return uiState.pulseEffects[id].value;
    }
    return 0;
}

// Helper function to draw score indicator
function drawScoreIndicator(ctx, score, x, y) {
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    const scoreText = `Score: ${score}`;
    const scoreWidth = ctx.measureText(scoreText).width;
    ctx.fillRect(x - 10, y - 20, scoreWidth + 20, 30);
    
    // Icon
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 10);
    ctx.lineTo(x + 5, y - 15);
    ctx.lineTo(x + 5, y - 5);
    ctx.closePath();
    ctx.fill();
    
    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(scoreText, x + 10, y);
}

// Helper function to draw coin indicator
function drawCoinIndicator(ctx, coins, x, y) {
    // Background with pulse if coins can be spent
    const coinPulse = uiState.pulseEffects['shopHint'] ? getPulseValue('shopHint') : 0;
    const coinsText = `Coins: ${coins}`;
    const coinWidth = ctx.measureText(coinsText).width;
    
    // Background box - always dark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x - 10, y - 20, coinWidth + 20, 30);
    
    // Draw gold coin
    const coinX = x;
    const coinY = y - 10;
    const coinRadius = 8;
    
    // Draw coin base (gold circle)
    const goldGradient = ctx.createRadialGradient(
        coinX, coinY, 0,
        coinX, coinY, coinRadius
    );
    goldGradient.addColorStop(0, '#ffd700'); // Bright gold at center
    goldGradient.addColorStop(0.8, '#daa520'); // Medium gold
    goldGradient.addColorStop(1, '#b8860b'); // Dark gold at edge
    
    ctx.beginPath();
    ctx.arc(coinX, coinY, coinRadius, 0, Math.PI * 2);
    ctx.fillStyle = goldGradient;
    ctx.fill();
    
    // Add coin edge
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add coin shine (top left arc)
    ctx.beginPath();
    ctx.arc(coinX - coinRadius/3, coinY - coinRadius/3, coinRadius/2, 0, Math.PI * 0.7);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();
    
    // Add coin symbol ($)
    ctx.fillStyle = '#8b6914';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('$', coinX, coinY + 3);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(coinsText, x + 10, y);
    
    // If we have coins, add subtle pulse effect to text
    if (coins > 0 && coinPulse > 0) {
        ctx.fillStyle = `rgba(255, 215, 0, ${coinPulse * 0.3})`;
        ctx.fillText(coinsText, x + 10, y);
    }
}

// Helper function to draw snacks indicator
function drawSnacksIndicator(ctx, remaining, total, x, y) {
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    const snacksText = `Snacks: ${remaining}/${total}`;
    const snacksWidth = ctx.measureText(snacksText).width;
    ctx.fillRect(x - 10, y - 20, snacksWidth + 20, 30);
    
    // Snack icon
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(x, y - 10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(snacksText, x + 10, y);
    
    // Progress bar under the snacks indicator
    const progressWidth = 100;
    const progress = (total - remaining) / total;
    
    // Position progress bar at the bottom of the box
    const progressY = y + 5;
    
    // Draw background bar (same color as the box)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x - 10, progressY, progressWidth, 4);
    
    // Draw progress
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(x - 10, progressY, progressWidth * progress, 4);
}

// Draw enhanced status bar
export function drawEnhancedStatusBar(ctx, gameState, canvas) {
    // Draw background banner
    const gradientHeight = 50;
    const gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
    gradient.addColorStop(0, 'rgba(52, 73, 94, 1.0)');
    gradient.addColorStop(1, 'rgba(52, 73, 94, 0.7)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, gradientHeight);
    
    // Add decorative element
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(0, gradientHeight, canvas.width, 3);
    
    // Draw level indicator with progress
    const levelText = `LEVEL ${gameState.currentLevel}`;
    ctx.font = 'bold 16px Arial';
    const levelWidth = ctx.measureText(levelText).width;
    
    // Level background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    const levelBgWidth = levelWidth + 20;
    ctx.fillRect(10, 10, levelBgWidth, 30);
    
    // Level text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(levelText, 20, 30);
    
    // Score with icon
    drawScoreIndicator(ctx, gameState.score, 150, 30);
    
    // Coins with icon and animated background
    drawCoinIndicator(ctx, gameState.totalCoins, 250, 30);
    
    // Snacks remaining
    const remainingSnacks = gameState.snacks.filter(snack => !snack.collected).length;
    drawSnacksIndicator(ctx, remainingSnacks, gameState.snacks.length, 370, 30);
    
    // Shop hint - make it pulse when coins are available
    if (!gameState.gameOver && !gameState.levelComplete) {
        if (!uiState.pulseEffects['shopHint'] && gameState.totalCoins > 0) {
            addPulseEffect('shopHint', 3);
        }
        
        const shopHintPulse = getPulseValue('shopHint');
        const shopOpacity = 0.7 + shopHintPulse * 0.3;
        
        ctx.textAlign = 'right';
        ctx.fillStyle = `rgba(52, 152, 219, ${shopOpacity})`;
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Press "S" for Shop', canvas.width - 20, 30);
    }
}

// Draw an enhanced game over screen
export function drawGameOverScreen(ctx, score, canvas) {
    // Background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(canvas.width/2 - 200, canvas.height/2 - 150, 400, 300);
    
    // Border
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 5;
    ctx.strokeRect(canvas.width/2 - 200, canvas.height/2 - 150, 400, 300);
    
    // Heading with pulse effect
    addPulseEffect('gameOver', 3);
    const pulseValue = getPulseValue('gameOver');
    const redValue = Math.floor(200 + pulseValue * 55);
    
    ctx.fillStyle = `rgb(${redValue}, 30, 30)`;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 80);
    
    // Score display
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 - 20);
    
    // Draw stats (if available)
    const gameState = window.gameState;
    if (gameState) {
        ctx.font = '20px Arial';
        ctx.fillText(`Snacks Collected: ${gameState.snacks.filter(s => s.collected).length}`, canvas.width/2, canvas.height/2 + 20);
        ctx.fillText(`Coins Earned: ${gameState.totalCoins}`, canvas.width/2, canvas.height/2 + 50);
        ctx.fillText(`Level Reached: ${gameState.currentLevel}`, canvas.width/2, canvas.height/2 + 80);
    }
    
    // Instructions to continue
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + pulseValue * 0.5})`;
    ctx.font = '20px Arial';
    ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 130);
}

// Draw an enhanced level complete screen
export function drawLevelCompleteScreen(ctx, level, score, countdown, canvas) {
    // Background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(canvas.width/2 - 200, canvas.height/2 - 150, 400, 300);
    
    // Border
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 5;
    ctx.strokeRect(canvas.width/2 - 200, canvas.height/2 - 150, 400, 300);
    
    // Heading with pulse effect
    addPulseEffect('levelComplete', 2);
    const pulseValue = getPulseValue('levelComplete');
    const greenValue = Math.floor(46 + pulseValue * 150);
    
    ctx.fillStyle = `rgb(20, ${greenValue}, 60)`;
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', canvas.width/2, canvas.height/2 - 80);
    
    // Level and score display
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Level ${level} Completed`, canvas.width/2, canvas.height/2 - 30);
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
    
    // Coins earned
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`+5 Coins`, canvas.width/2, canvas.height/2 + 50);
    
    // Draw countdown with pulse effect for urgency
    if (countdown > 0) {
        const countdownPulse = 0.5 + pulseValue * 0.5;
        const size = 30 + countdownPulse * 10;
        
        ctx.fillStyle = 'white';
        ctx.font = `bold ${size}px Arial`;
        ctx.fillText(`Next level in ${countdown}...`, canvas.width/2, canvas.height/2 + 100);
    } else {
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Loading next level...', canvas.width/2, canvas.height/2 + 100);
    }
}

// Called when player loses a life
export function loseLife() {
    if (uiState.healthPoints > 0) {
        uiState.healthPoints--;
        addNotification(`Life lost! ${uiState.healthPoints} remaining.`);
        return true; // Still have lives left
    }
    return false; // No lives left, game over
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
    addPulseEffect('tutorial', 2);
    const pulse = getPulseValue('tutorial');
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + pulse * 0.5})`;
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Click anywhere or press any key to continue', canvas.width/2, 530);
}

// Toggle tutorial visibility
export function toggleTutorial() {
    uiState.showTutorial = !uiState.showTutorial;
}