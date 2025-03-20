// Physics and movement calculations
import { isColliding } from './collision.js';

// Update player position and state
export function updatePlayer(deltaTime, canvas) {
    const gameState = window.gameState;
    const player = gameState.player;
    const keys = gameState.keys;
    
    // Don't update player if game over or level complete
    if (gameState.gameOver || gameState.levelComplete) {
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
    
    // Store old position for collision resolution
    const oldX = player.x;
    const oldY = player.y;
    
    // Update position based on speed
    player.x += player.speedX * deltaTime;
    player.y += player.speedY * deltaTime;
    
    // Update player bounding box
    updatePlayerBoundingBox();
    
    // Enforce canvas boundaries (left and right)
    if (player.x - player.width/2 < 0) {
        player.x = player.width/2;
        player.speedX = 0;
    } else if (player.x + player.width/2 > canvas.width) {
        player.x = canvas.width - player.width/2;
        player.speedX = 0;
    }
    
    // Check for platform collisions
    player.isOnGround = false; // Reset ground detection
    
    gameState.platforms.forEach(platform => {
        // Check if player is colliding with platform
        if (isColliding(player.boundingBox, {
            left: platform.x,
            right: platform.x + platform.width,
            top: platform.y,
            bottom: platform.y + platform.height
        })) {
            // Determine collision side
            const fromTop = oldY < platform.y && player.speedY > 0;
            const fromBottom = oldY > platform.y + platform.height && player.speedY < 0;
            const fromLeft = oldX < platform.x && player.speedX > 0;
            const fromRight = oldX > platform.x + platform.width && player.speedX < 0;
            
            // Resolve collision
            if (fromTop) {
                player.y = platform.y;
                player.speedY = 0;
                player.isOnGround = true;
                player.isJumping = false;
            } else if (fromBottom) {
                player.y = platform.y + platform.height + player.height;
                player.speedY = 0;
            } else if (fromLeft) {
                player.x = platform.x - player.width/2;
                player.speedX = 0;
            } else if (fromRight) {
                player.x = platform.x + platform.width + player.width/2;
                player.speedX = 0;
            }
            
            // Update bounding box after collision resolution
            updatePlayerBoundingBox();
        }
    });
    
    // Check if player is on the ground (bottom of canvas)
    if (player.y >= canvas.height) {
        player.y = canvas.height;
        player.speedY = 0;
        player.isOnGround = true;
        player.isJumping = false;
    }
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