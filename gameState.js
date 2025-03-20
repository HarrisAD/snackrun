// Game state management

export class GameState {
    constructor(canvas) {
        this.lastTimestamp = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.gravity = 980; // pixels per second squared
        this.gameOver = false;
        this.levelComplete = false;
        this.currentLevel = 1;
        this.player = {
            x: 400,
            y: 500,
            width: 40,
            height: 60,
            speedX: 0,
            speedY: 0,
            moveSpeed: 300, // pixels per second
            jumpPower: 550, // initial jump velocity
            color: '#e74c3c',
            isJumping: false,
            isOnGround: true,
            // Collision properties
            boundingBox: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        };
        this.keys = {
            left: false,
            right: false,
            up: false
        };
        this.snacks = [];
        this.bombs = [];
        this.platforms = [];
        this.score = 0;
        this.totalCoins = 0;
        
        // Store canvas dimensions for easy access
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }
    
    // Reset the game state for a new level
    reset() {
        this.snacks = [];
        this.bombs = [];
        this.platforms = [];
        this.gameOver = false;
        this.levelComplete = false;
        this.player.x = 400;
        this.player.y = 500;
        this.player.speedX = 0;
        this.player.speedY = 0;
        this.player.color = '#e74c3c';
    }
    
    // Award coins for level completion
    awardCoins(amount) {
        this.totalCoins += amount;
        console.log(`Awarded ${amount} coins. Total: ${this.totalCoins}`);
    }
}

// Get random snack color (utility function)
export function getRandomSnackColor() {
    const colors = ['#2ecc71', '#f1c40f', '#9b59b6', '#3498db', '#1abc9c', '#f39c12'];
    return colors[Math.floor(Math.random() * colors.length)];
}