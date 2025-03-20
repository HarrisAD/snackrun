// Physics and movement calculations
import { isGamePaused } from './controls.js';

// Update player position and state
export function updatePlayer(deltaTime, canvas) {
    const gameState = window.gameState;
    const player = gameState.player;
    const keys = gameState.keys;
    
    // Don't update player if game over or level complete or paused
    if (gameState.gameOver || gameState.levelComplete || isGamePaused()) {
        return;
    }
    
    // Apply horizontal movement based on key presses
    if (keys.left) {
        player.speedX = -player.moveSpeed;
    } else if (keys.right) {
        player.speedX = player.moveSpeed;
    } else {
        // Gradual slow down when no keys are pressed
        player.speedX *= 0.8;
        if (Math.abs(player.speedX) < 0.1) {
            player.speedX = 0;
        }
    }
    
    // Apply gravity
    player.speedY += gameState.gravity * deltaTime;
    
    // Apply jump if on ground and up key is pressed
    if (keys.up && player.isOnGround && !player.isJumping) {
        player.speedY = -player.jumpPower;
        player.isJumping = true;
        player.isOnGround = false;
    }
    
    // Reset ground detection
    player.isOnGround = false;
    
    // Move in X direction
    const newX = player.x + player.speedX * deltaTime;
    
    // Check horizontal platform collisions
    let canMoveX = true;
    const playerHalfWidth = player.width / 2;
    const playerHeight = player.height;
    
    gameState.platforms.forEach(platform => {
        // Check if player is within vertical bounds of platform
        if (player.y - playerHeight < platform.y + platform.height && 
            player.y > platform.y) {
            
            // Check right collision
            if (player.speedX > 0 && 
                newX + playerHalfWidth > platform.x && 
                newX - playerHalfWidth < platform.x && 
                player.x + playerHalfWidth <= platform.x) {
                
                player.x = platform.x - playerHalfWidth;
                player.speedX = 0;
                canMoveX = false;
            }
            
            // Check left collision
            if (player.speedX < 0 && 
                newX - playerHalfWidth < platform.x + platform.width && 
                newX + playerHalfWidth > platform.x + platform.width && 
                player.x - playerHalfWidth >= platform.x + platform.width) {
                
                player.x = platform.x + platform.width + playerHalfWidth;
                player.speedX = 0;
                canMoveX = false;
            }
        }
    });
    
    // Apply X movement if no collisions
    if (canMoveX) {
        player.x = newX;
    }
    
    // Move in Y direction
    const newY = player.y + player.speedY * deltaTime;
    
    // Check vertical platform collisions
    let canMoveY = true;
    
    gameState.platforms.forEach(platform => {
        // Check if player is within horizontal bounds of platform
        if (player.x + playerHalfWidth > platform.x && 
            player.x - playerHalfWidth < platform.x + platform.width) {
            
            // Check landing on top of platform
            if (player.speedY > 0 && 
                newY > platform.y && 
                newY - playerHeight < platform.y && 
                player.y - playerHeight <= platform.y) {
                
                player.y = platform.y;
                player.speedY = 0;
                player.isOnGround = true;
                player.isJumping = false;
                canMoveY = false;
            }
            
            // Check hitting bottom of platform
            if (player.speedY < 0 && 
                newY - playerHeight < platform.y + platform.height && 
                newY > platform.y + platform.height && 
                player.y >= platform.y + platform.height) {
                
                player.y = platform.y + platform.height + playerHeight;
                player.speedY = 0;
                canMoveY = false;
            }
        }
    });
    
    // Apply Y movement if no collisions
    if (canMoveY) {
        player.y = newY;
    }
    
    // Check bottom of screen collision
    if (player.y > canvas.height) {
        player.y = canvas.height;
        player.speedY = 0;
        player.isOnGround = true;
        player.isJumping = false;
    }
    
    // Check left and right screen boundaries
    if (player.x - playerHalfWidth < 0) {
        player.x = playerHalfWidth;
        player.speedX = 0;
    } else if (player.x + playerHalfWidth > canvas.width) {
        player.x = canvas.width - playerHalfWidth;
        player.speedX = 0;
    }
    
    // Update player bounding box for other collision checks
    updatePlayerBoundingBox();
}

// Update player's bounding box
export function updatePlayerBoundingBox() {
    const player = window.gameState.player;
    player.boundingBox = {
        left: player.x - player.width/2,
        right: player.x + player.width/2,
        top: player.y - player.height,
        bottom: player.y
    };
}

// Update game objects bounding boxes
export function updateGameObjectsBoundingBoxes() {
    const gameState = window.gameState;
    
    // Update snack bounding boxes
    gameState.snacks.forEach(snack => {
        snack.boundingBox = {
            left: snack.x - snack.radius,
            right: snack.x + snack.radius,
            top: snack.y - snack.radius,
            bottom: snack.y + snack.radius
        };
    });
    
    // Update bomb bounding boxes
    gameState.bombs.forEach(bomb => {
        bomb.boundingBox = {
            left: bomb.x - bomb.radius,
            right: bomb.x + bomb.radius,
            top: bomb.y - bomb.radius,
            bottom: bomb.y + bomb.radius
        };
    });
}