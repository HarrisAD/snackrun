// Handle level transition effects
export function startLevelTransition(fromLevel, toLevel, callback) {
    // Prevent duplicate transitions
    if (progressionState.inTransition) {
        console.log("Transition already in progress, ignoring duplicate");
        return;
    }
    
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