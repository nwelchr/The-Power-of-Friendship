## **Moving On** - A Minimalist Puzzle Game

[Live](https://nwelchr.github.io/moving-on)<br />
[Video Playthrough](https://www.youtube.com/watch?v=8KlIGm3vNsc)

### Background and Overview
Inspired by the game *Thomas was Alone*, **The Power of Friendship** is a minimalist puzzle platformer where a single player controls multiple characters that must work together in order to reach their goal. Each character is gifted and hindered by their own individual characteristics. TODO: Add info

### Functionality and MVPs
**The Power of Friendship** features:
- Two characters, Finley and Frankie, that you can switch between
- Interface, instructions, and storyline incorporated into game
- A camera that pans on the current character 
- Multiple levels of puzzle goodness that test the brain!

Current features:
- Characters:
    - Finley: Thinner and taller, jumps higher
    - Frankie: Wider and shorter, jumps low, impervious to poison, can float on water
- Obstacles:
    - Poison: Vats of poison as well as flying and falling poison
    - Water: Bodies of water that players must traverse to get to their goal
    - Trampolines: Allow characters to bounce and reach their goalposts
- Special Features:
    - Gravity: While most of the game will operate under normal physics mechanics, certain areas of the game may trigger gravity to reverse or otherwise change.
    - Audio: Background soundtrack as well as responsive audio to level completion and loss.

### Wireframes

![Level Example](/assets/wireframe.png)

### Architecture and Technologies
This project was implemented with the following technologies:

- Vanilla JavaScript for game logic, HTML element creation, and DOM manipulation (no Canvas!)
- CSS for styling
- Webpack for compilation of javascripts

### Bonus Features (to be implemented)
- Audio that responds to collisions, jumps, coin collection, level completion, etc.
- Visual responsiveness: bouncing effects, simulation of moving water, etc.
- 2.5D background that moves dynamically to give a 3D-esque effect to gameplay
- More characters, more features, more levels, more types of objects
- Portals that teleport players to different areas of the level
- Vastly DRYer and less glitchy code, as well as more robust physics engines (Phaser? Canvas?)
