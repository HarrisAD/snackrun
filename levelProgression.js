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
    
    // Storage settings
    useLocalStorage: false  // Completely disabled to avoid errors
};