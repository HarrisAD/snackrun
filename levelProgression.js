// Level Progression System for SnackRun
// Handles difficulty scaling, dynamic level generation, and transitions

import { startFade, addNotification } from './ui.js';
import { levels } from './levels.js';

// Game progression state
export const progressionState = {
    // Overall player progression
    totalScore: 0,
    highestLevelReached: 1,
    totalSnacksCollected: 0,
    totalCoinsEarned: 0,
    
    // Difficulty scaling factors
    difficultyMultiplier: 1.0, // Increases as player progresses
    bombSpawnRate: 1.0, // Rate at which bombs spawn
    
    // Level transition
    inTransition: false,
    transitionProgress: 0,
    
    // Dynamic level generation
    dynamicLevelMode: false, // Activates after pre-designed levels are completed
};

// Set the current level and save progress
export function setLevel(levelNumber) {
    // Update highest level reached for save data
    progressionState.highestLevelReached = Math.max(
        progressionState.highestLevelReached, 
        levelNumber
    );
    
    // Calculate difficulty based on level
    updateDifficulty(levelNumber);
    
    // Return the level to load
    return getLevelData(levelNumber);
}

// Get full level data, either predefined or dynamically generated
export function getLevelData(levelNumber) {
    const levelIndex = levelNumber - 1;
    
    // Use predefined levels if available
    if (levelIndex < levels.length) {
        // Add a .levelNumber property to the level data
        return {
            ...levels[levelIndex],
            levelNumber: levelNumber
        };
    }
    
    // For levels beyond predefined ones, generate dynamically
    progressionState.dynamicLevelMode = true;
    return generateDynamicLevel(levelNumber);
}

// Generate a dynamic level based on level number and difficulty
function generateDynamicLevel(levelNumber) {
    console.log(`Generating dynamic level ${levelNumber}`);
    
    // Base difficulty - increases with level number
    const difficulty = Math.min(10, Math.floor(levelNumber / 2));
    
    // Scale various elements based on difficulty
    const snackCount = 5 + Math.floor(difficulty * 1.5);
    const bombCount = 3 + Math.floor(difficulty * 1.8);
    
    // More platforms on higher levels (up to a point)
    const platformCount = Math.min(12, 4 + Math.floor(difficulty * 0.8));
    
    // Generate platforms with increasing complexity
    const platforms = generatePlatforms(platformCount, difficulty, levelNumber);
    
    // Dynamic snack locations - some on platforms, some in challenging positions
    const snackLocations = generateSnackLocations(
        snackCount, 
        platforms, 
        difficulty
    );
    
    // Generate dynamic bomb spawn points
    const bombSpawnPoints = generateBombSpawnPoints(
        bombCount,
        platforms,
        snackLocations,
        difficulty
    );
    
    // Special elements that appear at higher difficulties
    const specialElements = [];
    if (difficulty > 5) {
        // Add special elements like moving platforms, etc.
        // (to be implemented in a future phase)
    }
    
    return {
        levelNumber,
        snacks: snackCount,
        bombs: bombCount,
        bombSpawnRate: progressionState.bombSpawnRate,
        platforms,
        snackLocations,
        bombSpawnPoints,
        specialElements,
        // Level-specific messages or challenges
        levelMessage: getLevelMessage(levelNumber, difficulty),
        // Coins awarded for completion
        coinReward: 5 + Math.floor(difficulty * 0.5)
    };
}

// Generate platforms for a dynamic level
function generatePlatforms(count, difficulty, levelNumber) {
    const platforms = [];
    const canvasWidth = 800;
    const canvasHeight = 600;
    
    // Seed random generation based on level number for consistency
    const levelSeed = levelNumber * 1337;
    
    // Create a pseudo-random generator that's consistent for this level
    const random = (min, max) => {
        const x = Math.sin(levelSeed + platforms.length) * 10000;
        const r = x - Math.floor(x);
        return min + Math.floor(r * (max - min + 1));
    };
    
    // Distribute platforms based on difficulty
    const minPlatformWidth = Math.max(50, 150 - difficulty * 10);
    const maxPlatformWidth = Math.min(250, 300 - difficulty * 15);
    
    // Create platforms in different patterns based on difficulty
    if (difficulty <= 3) {
        // Easier levels: stair-like pattern with wider platforms
        for (let i = 0; i < count; i++) {
            const xPosition = (i * canvasWidth / count) + random(-30, 30);
            const yPosition = canvasHeight - 100 - (i * 70) + random(-10, 10);
            const width = random(minPlatformWidth, maxPlatformWidth);
            
            platforms.push({
                x: Math.max(0, Math.min(canvasWidth - width, xPosition)),
                y: Math.max(100, Math.min(canvasHeight - 20, yPosition)),
                width,
                height: 20,
                color: getPlatformColor(difficulty)
            });
        }
    } else if (difficulty <= 6) {
        // Medium difficulty: more random placement but still somewhat structured
        for (let i = 0; i < count; i++) {
            const section = Math.floor(i / 2);
            const xPosition = (section * canvasWidth / (count/2)) + random(-50, 50);
            const yPosition = canvasHeight - 100 - random(0, 350);
            const width = random(minPlatformWidth, maxPlatformWidth);
            
            platforms.push({
                x: Math.max(0, Math.min(canvasWidth - width, xPosition)),
                y: Math.max(100, Math.min(canvasHeight - 20, yPosition)),
                width,
                height: 20,
                color: getPlatformColor(difficulty)
            });
        }
    } else {
        // Harder levels: very randomized with smaller platforms
        for (let i = 0; i < count; i++) {
            const xPosition = random(50, canvasWidth - 100);
            const yPosition = 100 + random(0, canvasHeight - 200);
            const width = random(minPlatformWidth, maxPlatformWidth);
            
            platforms.push({
                x: Math.max(0, Math.min(canvasWidth - width, xPosition)),
                y: Math.max(100, Math.min(canvasHeight - 20, yPosition)),
                width,
                height: 20,
                color: getPlatformColor(difficulty)
            });
        }
    }
    
    return platforms;
}

// Get platform color based on difficulty
function getPlatformColor(difficulty) {
    // Basic platforms are purple
    if (difficulty <= 3) {
        return '#8e44ad'; // Purple
    } 
    // Medium difficulty platforms are orange
    else if (difficulty <= 6) {
        return '#d35400'; // Orange
    } 
    // Hard difficulty platforms are red
    else if (difficulty <= 8) {
        return '#c0392b'; // Red
    } 
    // Extreme difficulty platforms are dark red/black
    else {
        return '#7f0000'; // Dark red
    }
}

// Generate snack locations for a dynamic level
function generateSnackLocations(count, platforms, difficulty) {
    const snackLocations = [];
    const canvasWidth = 800;
    const canvasHeight = 600;
    
    // Seed random generation
    const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    
    // Put more snacks on platforms at lower difficulties, more floating at higher difficulties
    const platformSnackRatio = Math.max(0.2, 0.8 - (difficulty * 0.07));
    const platformSnackCount = Math.floor(count * platformSnackRatio);
    const floatingSnackCount = count - platformSnackCount;
    
    // Place snacks on platforms
    if (platforms.length > 0) {
        for (let i = 0; i < platformSnackCount; i++) {
            // Pick a random platform
            const platformIndex = random(0, platforms.length - 1);
            const platform = platforms[platformIndex];
            
            // Place snack above the platform
            const x = platform.x + random(30, platform.width - 30);
            const y = platform.y - 25; // Above the platform
            
            snackLocations.push({ x, y });
        }
    }
    
    // Place floating snacks in the air
    for (let i = 0; i < floatingSnackCount; i++) {
        // More challenging positions as difficulty increases
        const x = random(50, canvasWidth - 50);
        const y = random(50, canvasHeight - 150);
        
        // Check if too close to other snacks
        const tooClose = snackLocations.some(loc => {
            const distance = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
            return distance < 70; // Minimum distance between snacks
        });
        
        if (!tooClose) {
            snackLocations.push({ x, y });
        } else {
            // Try again if too close
            i--;
        }
    }
    
    return snackLocations;
}

// Generate bomb spawn points for a dynamic level
function generateBombSpawnPoints(count, platforms, snackLocations, difficulty) {
    const bombSpawnPoints = [];
    const canvasWidth = 800;
    const canvasHeight = 600;
    
    const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    
    // At higher difficulties, place bombs in more challenging positions
    for (let i = 0; i < count; i++) {
        let x, y;
        let validPosition = false;
        
        // Try to find a valid position away from snacks but in player path
        let attempts = 0;
        while (!validPosition && attempts < 20) {
            attempts++;
            
            if (difficulty <= 3) {
                // Low difficulty: bombs mostly on the ground
                x = random(50, canvasWidth - 50);
                y = random(canvasHeight - 50, canvasHeight - 20);
            } else if (difficulty <= 6) {
                // Medium difficulty: some bombs near platforms
                const nearPlatform = random(0, 1) > 0.5 && platforms.length > 0;
                
                if (nearPlatform) {
                    const platform = platforms[random(0, platforms.length - 1)];
                    x = platform.x + random(-30, platform.width + 30);
                    y = platform.y + random(30, 100);
                } else {
                    x = random(50, canvasWidth - 50);
                    y = random(canvasHeight - 100, canvasHeight - 20);
                }
            } else {
                // High difficulty: bombs in challenging positions
                x = random(50, canvasWidth - 50);
                y = random(100, canvasHeight - 50);
                
                // Sometimes place bombs near snacks
                if (random(0, 100) < 30 && snackLocations.length > 0) {
                    const snack = snackLocations[random(0, snackLocations.length - 1)];
                    x = snack.x + random(-100, 100);
                    y = snack.y + random(50, 100);
                }
            }
            
            // Ensure X is within canvas bounds
            x = Math.max(20, Math.min(canvasWidth - 20, x));
            
            // Check if too close to snacks
            const tooCloseToSnack = snackLocations.some(loc => {
                const distance = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
                return distance < 60; // Minimum distance from snacks
            });
            
            // Check if too close to other bombs
            const tooCloseToBomb = bombSpawnPoints.some(loc => {
                const distance = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
                return distance < 50; // Minimum distance between bombs
            });
            
            validPosition = !tooCloseToSnack && !tooCloseToBomb;
        }
        
        if (validPosition) {
            bombSpawnPoints.push({ x, y });
        }
    }
    
    return bombSpawnPoints;
}

// Get a special message for the level based on level number and difficulty
function getLevelMessage(levelNumber, difficulty) {
    // Level-specific hints or challenges
    const messages = [
        "Try to collect all snacks without falling!",
        "Watch out for the bombs!",
        "Jump carefully between platforms!",
        "You're doing great, keep going!",
        "This one's getting tricky...",
        "Don't forget to use your upgrades!",
        "Bombs are placed more dangerously now!",
        "You've made it far! Keep it up!",
        "The path gets narrower from here...",
        "This is a true test of skill!"
    ];
    
    // Pick a message based on difficulty
    const messageIndex = Math.min(difficulty, messages.length - 1);
    return messages[messageIndex];
}

// Update difficulty based on current level
function updateDifficulty(levelNumber) {
    // Base difficulty scaling - increases as levels progress
    progressionState.difficultyMultiplier = 1.0 + (levelNumber - 1) * 0.1;
    
    // Bomb spawn rate increases after level 3
    if (levelNumber > 3) {
        progressionState.bombSpawnRate = 1.0 + (levelNumber - 3) * 0.2;
    }
    
    console.log(`Level ${levelNumber} - Difficulty: ${progressionState.difficultyMultiplier.toFixed(1)}x, Bomb Rate: ${progressionState.bombSpawnRate.toFixed(1)}x`);
}

// Handle level transition effects
export function startLevelTransition(fromLevel, toLevel, callback) {
    progressionState.inTransition = true;
    progressionState.transitionProgress = 0;
    
    // Save level stats before transition
    saveLevelStats(fromLevel);
    
    // Show notification
    addNotification(`Level ${fromLevel} completed! Moving to Level ${toLevel}...`);
    
    // Fade out, then fade in with callback
    startFade('out', 500, () => {
        if (callback) callback();
        
        // After a brief pause, fade back in
        setTimeout(() => {
            startFade('in', 500, () => {
                progressionState.inTransition = false;
                
                // Show difficulty increase notification on significant changes
                if (toLevel > 3 && toLevel % 3 === 1) {
                    addNotification(`Difficulty increased! Be careful!`, 5000);
                }
            });
        }, 300);
    });
}

// Save statistics from completed level
function saveLevelStats(levelNumber) {
    const gameState = window.gameState;
    
    // Only save if the game state exists
    if (!gameState) return;
    
    progressionState.totalScore += gameState.score;
    progressionState.totalSnacksCollected += gameState.snacks.filter(s => s.collected).length;
    progressionState.totalCoinsEarned += gameState.totalCoins;
    
    // Could save to localStorage here for persistent progress
    // localStorage.setItem('snackRunProgress', JSON.stringify(progressionState));
}

// Load saved progress (if available)
export function loadProgress() {
    // Try to load from localStorage if available
    try {
        const savedProgress = localStorage.getItem('snackRunProgress');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            
            // Restore progress state
            progressionState.totalScore = parsed.totalScore || 0;
            progressionState.highestLevelReached = parsed.highestLevelReached || 1;
            progressionState.totalSnacksCollected = parsed.totalSnacksCollected || 0;
            progressionState.totalCoinsEarned = parsed.totalCoinsEarned || 0;
            
            console.log(`Loaded progress: Highest level ${progressionState.highestLevelReached}`);
            return true;
        }
    } catch (e) {
        console.error("Error loading progress:", e);
    }
    
    return false;
}

// Save current progress
export function saveProgress() {
    try {
        localStorage.setItem('snackRunProgress', JSON.stringify(progressionState));
        console.log("Progress saved successfully.");
        return true;
    } catch (e) {
        console.error("Error saving progress:", e);
        return false;
    }
}

// Handle bomb spawning based on difficulty and time
export function shouldSpawnBomb(gameTime) {
    // Don't spawn bombs during level transitions
    if (progressionState.inTransition) return false;
    
    // Only spawn bombs in dynamic level mode and after a certain point
    if (!progressionState.dynamicLevelMode) return false;
    
    // Base chance increases with difficulty
    const baseSpawnChance = 0.002 * progressionState.bombSpawnRate;
    
    // Scale with game time - more bombs spawn as level progresses
    const timeScaling = Math.min(1, gameTime / 30); // Max scaling after 30 seconds
    
    // Calculate final spawn chance for this frame
    const spawnChance = baseSpawnChance * timeScaling;
    
    // Random check
    return Math.random() < spawnChance;
}

// Get a spawn position for a new dynamic bomb
export function getDynamicBombSpawnPosition(player, platforms, existingBombs) {
    const canvasWidth = 800;
    const canvasHeight = 600;
    
    // Tendency to spawn bombs ahead of player's direction
    const playerDirection = player.speedX > 0 ? 1 : -1;
    
    // Spawn bombs in various positions based on player position
    const spawnOptions = [
        // In front of player's path
        {
            x: player.x + playerDirection * (200 + Math.random() * 200),
            y: player.y - Math.random() * 150,
            weight: 3 // Higher weight means more likely
        },
        // Above player
        {
            x: player.x + Math.random() * 100 - 50,
            y: player.y - (200 + Math.random() * 150),
            weight: 2
        },
        // On a random platform
        {
            x: null, // Will be set if a platform is chosen
            y: null,
            weight: platforms.length > 0 ? 4 : 0
        },
        // Random position on screen
        {
            x: Math.random() * (canvasWidth - 100) + 50,
            y: Math.random() * (canvasHeight / 2),
            weight: 1
        }
    ];
    
    // If we have platforms, set the platform option coordinates
    if (platforms.length > 0) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        spawnOptions[2].x = platform.x + Math.random() * platform.width;
        spawnOptions[2].y = platform.y - 30;
    }
    
    // Calculate total weight
    const totalWeight = spawnOptions.reduce((sum, option) => sum + option.weight, 0);
    
    // Pick a spawn option based on weights
    let randomValue = Math.random() * totalWeight;
    let chosenOption = spawnOptions[0];
    
    for (const option of spawnOptions) {
        randomValue -= option.weight;
        if (randomValue <= 0) {
            chosenOption = option;
            break;
        }
    }
    
    // Ensure coordinates are within bounds
    const x = Math.max(20, Math.min(canvasWidth - 20, chosenOption.x));
    const y = Math.max(20, Math.min(canvasHeight - 20, chosenOption.y));
    
    // Ensure not too close to existing bombs
    const tooClose = existingBombs.some(bomb => {
        if (!bomb.active) return false;
        const distance = Math.sqrt((bomb.x - x) ** 2 + (bomb.y - y) ** 2);
        return distance < 60;
    });
    
    if (tooClose) {
        // If too close, try a different position
        return getDynamicBombSpawnPosition(player, platforms, existingBombs);
    }
    
    return { x, y };
}