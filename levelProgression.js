// Game progression state with localStorage references removed
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
    dynamicLevelMode: false // Activates after pre-designed levels are completed
};

// Set the current level
export function setLevel(levelNumber) {
    // Import the levels dynamically to avoid circular dependency
    const levels = window.gameLevels || [];
    
    console.log(`Setting up level ${levelNumber}, available levels: ${levels.length}`);
    
    // Update highest level reached for progression tracking
    if (levelNumber > progressionState.highestLevelReached) {
        progressionState.highestLevelReached = levelNumber;
    }
    
    // Get level data - either from predefined levels or generate dynamically
    if (levelNumber <= levels.length) {
        // Return pre-designed level
        console.log(`Using pre-designed level ${levelNumber}`);
        return levels[levelNumber - 1];
    } else {
        // Return a simple dynamically generated level
        console.log(`Generating dynamic level ${levelNumber}`);
        return {
            snacks: 5 + Math.floor(levelNumber * 1.5),
            bombs: 3 + Math.floor(levelNumber * 1.2),
            platforms: [
                { x: 200, y: 450, width: 200, height: 20 },
                { x: 500, y: 350, width: 150, height: 20 },
                { x: 100, y: 250, width: 150, height: 20 }
            ],
            levelMessage: `Dynamic Level ${levelNumber}`,
            coinReward: 5 + Math.floor(levelNumber * 0.7)
        };
    }
}

// Start level transition with visual effects
export function startLevelTransition(currentLevel, nextLevel, callback) {
    console.log(`Starting level transition from ${currentLevel} to ${nextLevel}`);
    progressionState.inTransition = true;
    progressionState.transitionProgress = 0;
    
    // Simple timeout to simulate transition effect
    setTimeout(() => {
        console.log("Transition callback firing");
        if (callback) callback();
    }, 1000);
}