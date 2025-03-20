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

    // Game State
    const gameState = {
        lastTimestamp: 0,
        fps: 0,
        frameCount: 0,
        lastFpsUpdate: 0,
        gravity: 980, // pixels per second squared
        player: {
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
            isOnGround: true
        },
        keys: {
            left: false,
            right: false,
            up: false
        }
    };

    // Draw background grid
    function drawGrid() {
        const gridSize = 50;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Draw the player
    function drawPlayer() {
        const player = gameState.player;
        
        // Draw the player body (rectangle)
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - player.width/2, player.y - player.height, player.width, player.height);
        
        // Draw outline
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x - player.width/2, player.y - player.height, player.width, player.height);
        
        // Draw eyes (to indicate direction)
        const eyeSize = 6;
        ctx.fillStyle = 'white';
        ctx.fillRect(player.x - player.width/4 - eyeSize/2, player.y - player.height * 0.7 - eyeSize/2, eyeSize, eyeSize);
        ctx.fillRect(player.x + player.width/4 - eyeSize/2, player.y - player.height * 0.7 - eyeSize/2, eyeSize, eyeSize);
        
        // Draw mouth
        ctx.beginPath();
        ctx.moveTo(player.x - player.width/4, player.y - player.height * 0.4);
        ctx.lineTo(player.x + player.width/4, player.y - player.height * 0.4);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw jumping indicator (if jumping)
        if (gameState.player.isJumping) {
            ctx.beginPath();
            ctx.moveTo(player.x, player.y);
            ctx.lineTo(player.x, player.y + 10);
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Update player position and state
    function updatePlayer(deltaTime) {
        const player = gameState.player;
        const keys = gameState.keys;
        
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
        
        // Update position based on speed
        player.x += player.speedX * deltaTime;
        player.y += player.speedY * deltaTime;
        
        // Enforce canvas boundaries (left and right)
        if (player.x - player.width/2 < 0) {
            player.x = player.width/2;
            player.speedX = 0;
        } else if (player.x + player.width/2 > canvas.width) {
            player.x = canvas.width - player.width/2;
            player.speedX = 0;
        }
        
        // Check if player is on the ground (bottom of canvas)
        if (player.y >= canvas.height) {
            player.y = canvas.height;
            player.speedY = 0;
            player.isOnGround = true;
            player.isJumping = false;
        } else {
            player.isOnGround = false;
        }
    }

    // Draw status information
    function drawStatus() {
        const player = gameState.player;
        const statusY = 30;
        const lineHeight = 20;
        
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillText(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 10, statusY);
        ctx.fillText(`Speed: (${Math.round(player.speedX)}, ${Math.round(player.speedY)})`, 10, statusY + lineHeight);
        ctx.fillText(`Jumping: ${player.isJumping}`, 10, statusY + lineHeight * 2);
        ctx.fillText(`On Ground: ${player.isOnGround}`, 10, statusY + lineHeight * 3);
        ctx.fillText(`Controls: Arrow Keys to move, Up Arrow to jump`, 10, statusY + lineHeight * 4);
    }

    // Set up keyboard event listeners
    function setupControls() {
        window.addEventListener('keydown', function(e) {
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
            }
        });
        
        window.addEventListener('keyup', function(e) {
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
        });
        
        console.log("Keyboard controls set up");
    }

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
        drawGrid();
        
        // Update and draw player
        updatePlayer(deltaTime);
        drawPlayer();
        
        // Draw status information
        drawStatus();
        
        // Draw border around canvas
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Update status
        loopStatus.textContent = "Running";
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }

    // Set up keyboard controls
    setupControls();
    
    // Start the game loop
    console.log("Starting game loop...");
    requestAnimationFrame(gameLoop);
};