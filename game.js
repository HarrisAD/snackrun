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
        circle: {
            x: 400,
            y: 300,
            radius: 30,
            color: '#3498db',
            speedX: 200, // pixels per second
            speedY: 150  // pixels per second
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

    // Get a random color
    function getRandomColor() {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Update circle position
    function updateCircle(deltaTime) {
        const circle = gameState.circle;
        
        // Move the circle
        circle.x += circle.speedX * deltaTime;
        circle.y += circle.speedY * deltaTime;
        
        // Bounce off left and right walls
        if (circle.x - circle.radius < 0) {
            circle.x = circle.radius;
            circle.speedX = Math.abs(circle.speedX);
            circle.color = getRandomColor();
        } else if (circle.x + circle.radius > canvas.width) {
            circle.x = canvas.width - circle.radius;
            circle.speedX = -Math.abs(circle.speedX);
            circle.color = getRandomColor();
        }
        
        // Bounce off top and bottom walls
        if (circle.y - circle.radius < 0) {
            circle.y = circle.radius;
            circle.speedY = Math.abs(circle.speedY);
            circle.color = getRandomColor();
        } else if (circle.y + circle.radius > canvas.height) {
            circle.y = canvas.height - circle.radius;
            circle.speedY = -Math.abs(circle.speedY);
            circle.color = getRandomColor();
        }
    }

    // Draw the circle
    function drawCircle() {
        const circle = gameState.circle;
        
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
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
        
        // Update circle position
        updateCircle(deltaTime);
        
        // Draw circle
        drawCircle();
        
        // Draw border around canvas
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Update status
        loopStatus.textContent = "Running";
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    console.log("Starting game loop...");
    requestAnimationFrame(gameLoop);
};