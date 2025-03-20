# SnackRun

## Game Overview
SnackRun is a 2D platformer where players control a character who must collect all snacks on each level while avoiding bombs. The game features progressively challenging levels with more bombs appearing as the player advances. Players can earn coins to upgrade their jump ability, allowing them to overcome more difficult obstacles.

## Game Features

### Core Mechanics
- **Movement**: Control the character using arrow keys
- **Objective**: Collect all snacks on each level to progress
- **Obstacles**: Avoid bombs - touching them results in game over
- **Progression**: Levels become increasingly difficult with more bombs
- **Upgrades**: Collect coins to enhance jumping ability

### Level Design
- **Level 1**: Basic layout with few bombs and many snacks
- **Level 2-5**: Progressively more bombs and challenging layouts
- **Level 6+**: Dynamic bomb spawning during gameplay

### Upgrade System
- Collect coins by completing levels
- Spend coins in the upgrade shop between levels
- Upgrade jump height and distance to overcome more challenging obstacles

## Development Roadmap

Each phase below is designed to be tested in isolation before integration with other components. This modular approach allows for easier debugging and ensures each feature works correctly before building upon it.

### Phase 1: Project Setup & Basic Environment
- [ ] Initialize project structure
- [ ] Set up basic HTML/CSS/JS files
- [ ] Create game canvas
- [ ] Implement basic game loop
- [ ] **Test:** Confirm canvas renders and game loop runs (use console logs or simple shapes)

### Phase 2: Player Character
- [ ] Create player sprite
- [ ] Implement left/right movement
- [ ] Add jumping mechanics
- [ ] Set up player boundaries
- [ ] **Test:** Isolated movement test page where character responds to arrow keys

### Phase 3: Game Objects
- [ ] Create snack sprites
- [ ] Implement bomb sprites
- [ ] Add basic object placement
- [ ] **Test:** Render objects on test canvas to verify appearance and positioning

### Phase 4: Collision System
- [ ] Implement collision detection
- [ ] Create snack collection logic
- [ ] Add bomb collision (game over)
- [ ] Create hit detection areas
- [ ] **Test:** Simple test environment with player and objects to verify collision works

### Phase 5: Basic Level Design
- [ ] Design first level layout
- [ ] Implement static object positioning
- [ ] Create level boundaries
- [ ] Add level completion detection
- [ ] **Test:** Demo level with completion trigger (collect all snacks)

### Phase 6: UI Elements
- [ ] Add score display
- [ ] Create lives/health indicator
- [ ] Implement game over screen
- [ ] Add level indicator
- [ ] **Test:** UI test page that simulates different game states

### Phase 7: Level Progression
- [ ] Create level transition system
- [ ] Design additional level layouts
- [ ] Implement difficulty scaling
- [ ] Add bomb spawn algorithm
- [ ] **Test:** Level switcher demo to verify transitions work correctly

### Phase 8: Coin System
- [ ] Create coin sprites
- [ ] Implement coin collection
- [ ] Add coin counter UI
- [ ] Create end-of-level coin rewards
- [ ] **Test:** Isolated coin collection test with counter

### Phase 9: Upgrade Shop
- [ ] Design shop interface
- [ ] Implement shop navigation
- [ ] Create jump upgrade system
- [ ] Add coin spending mechanics
- [ ] **Test:** Standalone shop interface that saves upgrade state

### Phase 10: Advanced Movement
- [ ] Enhance jump mechanics with upgrades
- [ ] Implement variable jump heights/distances
- [ ] Add special movement abilities (optional)
- [ ] **Test:** Movement test page with configurable jump parameters

### Phase 11: Game States
- [ ] Create main menu
- [ ] Implement pause functionality
- [ ] Add settings menu
- [ ] Create save/load system
- [ ] **Test:** Menu navigation test page and save/load functionality test

### Phase 12: Audio & Visual Polish
- [ ] Add background music
- [ ] Implement sound effects
- [ ] Create visual feedback (particles, animations)
- [ ] Polish UI elements
- [ ] **Test:** Sound board test page and animation demos

### Phase 13: Testing & Balancing
- [ ] Test gameplay mechanics
- [ ] Balance difficulty progression
- [ ] Adjust upgrade costs and benefits
- [ ] Optimize performance
- [ ] **Test:** Difficulty testing tool and performance benchmarking

### Phase 14: Final Features & Launch
- [ ] Add tutorial/instructions
- [ ] Implement leaderboard (optional)
- [ ] Create promotional materials
- [ ] Prepare for distribution
- [ ] **Test:** Final integration testing and user acceptance testing

## Technical Requirements
- **Programming Language**: JavaScript (or your preferred language)
- **Framework**: HTML5 Canvas, Phaser.js, or similar 2D game framework
- **Graphics**: Simple 2D sprites with clear visual distinction between elements
- **Controls**: Keyboard (arrow keys), with possible touch controls for mobile

## Getting Started
(To be added after initial codebase is established)

## Testing Strategy

### Modular Testing
Each component of the game is designed to be tested independently:
- Create separate HTML files for testing individual features
- Use simple test environments with minimal dependencies
- Verify functionality before integration

### Test Pages
For each phase, create a dedicated test page that isolates the feature:
1. **Movement Test:** Tests player controls without game logic
2. **Collision Test:** Verifies collision detection in isolation
3. **UI Test:** Shows UI elements with simulated game states
4. **Shop Test:** Tests upgrade mechanics with mock data
5. **Level Test:** Tests individual levels without full game progression

### Integration Testing
After individual components pass testing:
1. Combine related components
2. Test interactions between systems
3. Identify and fix integration issues
4. Build up to full game testing

## Team Members
(Add your name and role here)

## License
(Choose your preferred license)