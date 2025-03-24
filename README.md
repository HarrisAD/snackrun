# SnackRun

A 2D platformer game where players control a character who must collect all snacks on each level while avoiding bombs.

## Play the Game

You can play the game directly in your browser: [Play SnackRun](https://yourusername.github.io/snackrun/)

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

## Controls

- **Left/Right Arrows**: Move character
- **Up Arrow**: Jump
- **S Key**: Open Shop Menu
- **ESC Key**: Close Shop Menu
- **R Key**: Reset current level
- **P Key**: Pause game
- **T Key**: Show tutorial

## Development

This game is built using vanilla JavaScript and HTML Canvas, with a modular architecture for extensibility.

### Project Structure

```
snackrun/
├── index.html                # Main game entry point
├── css/
│   └── styles.css            # Consolidated styles
├── js/
│   ├── game.js               # Main game initialization
│   ├── gameState.js          # Game state management
│   ├── physics.js            # Physics and movement
│   ├── renderer.js           # Rendering functions
│   ├── collision.js          # Collision detection
│   ├── controls.js           # Keyboard/input handling
│   ├── levels.js             # Level definitions
│   ├── levelProgression.js   # Level progression system
│   ├── shop.js               # Shop system
│   └── ui.js                 # UI elements and rendering
└── assets/                   # (Optional) For future graphics/sounds
    ├── images/
    └── sounds/
```

## Future Improvements

- Mobile/touch support for tablets and phones
- Additional levels and game mechanics
- Visual and audio enhancements
- Leaderboard and achievement system

## License

[Choose your preferred license]