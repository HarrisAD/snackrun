// Shop system for purchasing upgrades

// Available upgrades
export const upgrades = {
    jumpHeight: {
        name: "Jump Power",
        description: "Increase how high you can jump",
        levels: [
            { cost: 0, value: 550, description: "Standard Jump" },
            { cost: 5, value: 650, description: "Enhanced Jump" },
            { cost: 15, value: 750, description: "Super Jump" },
            { cost: 30, value: 850, description: "Ultra Jump" },
            { cost: 50, value: 950, description: "Mega Jump" }
        ],
        getCurrentLevel: () => {
            const player = window.gameState.player;
            const currentValue = player.jumpPower;
            return upgrades.jumpHeight.levels.findIndex(level => level.value === currentValue);
        },
        canUpgrade: () => {
            const currentLevel = upgrades.jumpHeight.getCurrentLevel();
            return currentLevel < upgrades.jumpHeight.levels.length - 1;
        },
        getNextLevel: () => {
            const currentLevel = upgrades.jumpHeight.getCurrentLevel();
            if (currentLevel < upgrades.jumpHeight.levels.length - 1) {
                return upgrades.jumpHeight.levels[currentLevel + 1];
            }
            return null;
        },
        upgrade: () => {
            const player = window.gameState.player;
            const currentLevel = upgrades.jumpHeight.getCurrentLevel();
            
            if (currentLevel < upgrades.jumpHeight.levels.length - 1) {
                const nextLevel = upgrades.jumpHeight.levels[currentLevel + 1];
                
                if (window.gameState.totalCoins >= nextLevel.cost) {
                    window.gameState.totalCoins -= nextLevel.cost;
                    player.jumpPower = nextLevel.value;
                    return true;
                }
            }
            return false;
        }
    },
    
    moveSpeed: {
        name: "Movement Speed",
        description: "Increase how fast you can move",
        levels: [
            { cost: 0, value: 300, description: "Standard Speed" },
            { cost: 5, value: 350, description: "Quick Pace" },
            { cost: 15, value: 400, description: "Swift Run" },
            { cost: 30, value: 450, description: "Blazing Speed" },
            { cost: 50, value: 500, description: "Lightning Fast" }
        ],
        getCurrentLevel: () => {
            const player = window.gameState.player;
            const currentValue = player.moveSpeed;
            return upgrades.moveSpeed.levels.findIndex(level => level.value === currentValue);
        },
        canUpgrade: () => {
            const currentLevel = upgrades.moveSpeed.getCurrentLevel();
            return currentLevel < upgrades.moveSpeed.levels.length - 1;
        },
        getNextLevel: () => {
            const currentLevel = upgrades.moveSpeed.getCurrentLevel();
            if (currentLevel < upgrades.moveSpeed.levels.length - 1) {
                return upgrades.moveSpeed.levels[currentLevel + 1];
            }
            return null;
        },
        upgrade: () => {
            const player = window.gameState.player;
            const currentLevel = upgrades.moveSpeed.getCurrentLevel();
            
            if (currentLevel < upgrades.moveSpeed.levels.length - 1) {
                const nextLevel = upgrades.moveSpeed.levels[currentLevel + 1];
                
                if (window.gameState.totalCoins >= nextLevel.cost) {
                    window.gameState.totalCoins -= nextLevel.cost;
                    player.moveSpeed = nextLevel.value;
                    return true;
                }
            }
            return false;
        }
    }
};

// Shop state
export const shopState = {
    isOpen: false,
    selectedUpgrade: "jumpHeight",
    message: ""
};

// Open the shop
export function openShop() {
    shopState.isOpen = true;
    shopState.message = "Welcome to the Shop! Spend your coins on upgrades.";
}

// Close the shop
export function closeShop() {
    shopState.isOpen = false;
    shopState.message = "";
}

// Toggle shop open/closed
export function toggleShop() {
    if (shopState.isOpen) {
        closeShop();
    } else {
        openShop();
    }
}

// Select an upgrade
export function selectUpgrade(upgradeName) {
    if (upgrades[upgradeName]) {
        shopState.selectedUpgrade = upgradeName;
        shopState.message = upgrades[upgradeName].description;
    }
}

// Purchase the selected upgrade
export function purchaseUpgrade() {
    const upgrade = upgrades[shopState.selectedUpgrade];
    
    if (upgrade && upgrade.canUpgrade()) {
        const nextLevel = upgrade.getNextLevel();
        
        if (window.gameState.totalCoins >= nextLevel.cost) {
            if (upgrade.upgrade()) {
                shopState.message = `Upgraded ${upgrade.name} to ${nextLevel.description}!`;
                return true;
            }
        } else {
            shopState.message = `Not enough coins! You need ${nextLevel.cost} coins.`;
        }
    } else {
        shopState.message = "This upgrade is already at maximum level!";
    }
    
    return false;
}

// Draw the shop interface
export function drawShop(ctx, canvas) {
    if (!shopState.isOpen) return;
    
    const gameState = window.gameState;
    
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw shop panel
    const panelWidth = 600;
    const panelHeight = 400;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    
    // Draw shop background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    // Draw shop border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    // Draw shop title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('UPGRADE SHOP', canvas.width / 2, panelY + 40);
    
    // Draw coins
    ctx.fillStyle = '#f39c12';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Coins: ${gameState.totalCoins}`, canvas.width / 2, panelY + 80);
    
    // Draw message
    ctx.fillStyle = '#2c3e50';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(shopState.message, canvas.width / 2, panelY + 110);
    
    // Draw upgrade options
    const upgradeY = panelY + 150;
    const upgradeHeight = 100;
    
    // Draw Jump Power upgrade
    drawUpgradeOption(
        ctx, 
        panelX + 20, 
        upgradeY, 
        (panelWidth / 2) - 30, 
        upgradeHeight,
        upgrades.jumpHeight,
        shopState.selectedUpgrade === "jumpHeight"
    );
    
    // Draw Movement Speed upgrade
    drawUpgradeOption(
        ctx, 
        panelX + (panelWidth / 2) + 10, 
        upgradeY, 
        (panelWidth / 2) - 30, 
        upgradeHeight,
        upgrades.moveSpeed,
        shopState.selectedUpgrade === "moveSpeed"
    );
    
    // Draw Buy button
    const buyEnabled = upgrades[shopState.selectedUpgrade].canUpgrade() && 
                       gameState.totalCoins >= upgrades[shopState.selectedUpgrade].getNextLevel().cost;
    
    const buyButtonX = panelX + (panelWidth / 2) - 100;
    const buyButtonY = panelY + panelHeight - 70;
    const buyButtonWidth = 200;
    const buyButtonHeight = 50;
    
    ctx.fillStyle = buyEnabled ? '#27ae60' : '#95a5a6';
    ctx.fillRect(buyButtonX, buyButtonY, buyButtonWidth, buyButtonHeight);
    
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(buyButtonX, buyButtonY, buyButtonWidth, buyButtonHeight);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BUY UPGRADE', buyButtonX + buyButtonWidth / 2, buyButtonY + 33);
    
    // Draw close button
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(panelX + panelWidth - 20, panelY + 20, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('X', panelX + panelWidth - 20, panelY + 27);
}

// Helper function to draw an upgrade option
function drawUpgradeOption(ctx, x, y, width, height, upgrade, isSelected) {
    // Draw background
    ctx.fillStyle = isSelected ? '#d6eaf8' : '#ecf0f1';
    ctx.fillRect(x, y, width, height);
    
    // Draw border
    ctx.strokeStyle = isSelected ? '#3498db' : '#bdc3c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Draw title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(upgrade.name, x + width / 2, y + 25);
    
    // Get current level
    const currentLevel = upgrade.getCurrentLevel();
    const currentLevelInfo = upgrade.levels[currentLevel];
    
    // Draw current level
    ctx.font = '16px Arial';
    ctx.fillText(`Current: ${currentLevelInfo.description}`, x + width / 2, y + 50);
    
    // Draw next level if available
    if (upgrade.canUpgrade()) {
        const nextLevel = upgrade.getNextLevel();
        ctx.fillText(`Next: ${nextLevel.description}`, x + width / 2, y + 75);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText(`Cost: ${nextLevel.cost} coins`, x + width / 2, y + 95);
    } else {
        ctx.fillStyle = '#27ae60';
        ctx.fillText('MAXED OUT!', x + width / 2, y + 85);
    }
}

// Handle shop click events
export function handleShopClick(x, y) {
    if (!shopState.isOpen) return false;
    
    const canvas = document.getElementById('gameCanvas');
    const panelWidth = 600;
    const panelHeight = 400;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    
    // Check close button
    const closeButtonX = panelX + panelWidth - 20;
    const closeButtonY = panelY + 20;
    const closeButtonRadius = 15;
    
    const distToClose = Math.sqrt(Math.pow(x - closeButtonX, 2) + Math.pow(y - closeButtonY, 2));
    
    if (distToClose <= closeButtonRadius) {
        closeShop();
        return true;
    }
    
    // Check upgrade options
    const upgradeY = panelY + 150;
    const upgradeHeight = 100;
    
    // Check Jump Power upgrade
    const jumpX = panelX + 20;
    const jumpWidth = (panelWidth / 2) - 30;
    
    if (x >= jumpX && x <= jumpX + jumpWidth && y >= upgradeY && y <= upgradeY + upgradeHeight) {
        selectUpgrade("jumpHeight");
        return true;
    }
    
    // Check Movement Speed upgrade
    const speedX = panelX + (panelWidth / 2) + 10;
    const speedWidth = (panelWidth / 2) - 30;
    
    if (x >= speedX && x <= speedX + speedWidth && y >= upgradeY && y <= upgradeY + upgradeHeight) {
        selectUpgrade("moveSpeed");
        return true;
    }
    
    // Check Buy button
    const buyButtonX = panelX + (panelWidth / 2) - 100;
    const buyButtonY = panelY + panelHeight - 70;
    const buyButtonWidth = 200;
    const buyButtonHeight = 50;
    
    if (x >= buyButtonX && x <= buyButtonX + buyButtonWidth && 
        y >= buyButtonY && y <= buyButtonY + buyButtonHeight) {
        purchaseUpgrade();
        return true;
    }
    
    return false;
}