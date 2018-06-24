## **The Power of Friendship** - A Minimalist Puzzle Game

[Live](https://nwelchr.github.io/The-Power-of-Friendship)

### Background and Overview

Inspired by the game _Thomas was Alone_, **The Power of Friendship** is a minimalist puzzle platformer. The goal is to have the player get each character into their respective goal. They must all work together in order to complete each level. Each level features different mechanics, including swimming, gravity chambers, trampolines, avoiding poison, and much more.

### Technologies

This game is built with standard JavaScript, HTML5, and CSS3. Scripts were bundled using Webpack.

### Features

**The Power of Friendship** features:

- An in-depth tutorial to explain the rules of the game
- A pause menu with a reminder of controls, as well as the ability to restart levels
- Up to five characters at a time, all controlled by one player
- 10+ levels of puzzle goodness!

### Highlights

#### Camera

One of the features I was most excited about implementing was the camera. Because levels extend beyond the reach of the 'canvas', there needs to be a way to zoom in on the current player. The following method is called every frame after everything has been updated and redrawn. It finds the current player's position and scrolls my map to the proper location so as to center the player on the screen while giving a bit of leeway, so as to not have the screen constantly moving.

```javascript
    scrollPlayerIntoView(state) {
        const width = this.wrapper.clientWidth;
        const height = this.wrapper.clientHeight;
        const margin = width / 3;

        const left = this.wrapper.scrollLeft;
        const right = left + width;
        const top = this.wrapper.scrollTop;
        const bottom = top + height;

        const player = state.player;
        const center = player.pos.plus(player.size.times(0.5)).times(scale);

        // if we set scrollLeft or scrollTop to negative number, it will re-center to 0
        // margin creates a "neutral" area to not force player into the center
        if (center.x < left + margin) {
            this.wrapper.scrollLeft = center.x - margin;
        } else if (center.x > right - margin) {
            this.wrapper.scrollLeft = center.x + margin - width;
        }

        if (center.y < top + margin) {
            this.wrapper.scrollTop = center.y - margin;
        } else if (center.y > bottom - margin) {
            this.wrapper.scrollTop = center.y + margin - height;
        }
    }
```

#### Frame Function

The meat of this game occurs in the `frameFunction`, called each frame (over 20 times per second). This function handles updating all of the current positions and statuses of each character, redraws new positions for each object, and delegates information about new states to allow for winning, losing, and restarting levels. State is updated in a flux pattern, ensuring that state is only mutated by a pure function that takes in a state and returns a new state.

```javascript
frameFunction(time) {
    this.state = this.state.update(time, this.keys);
    this.display.drawFrame(this.state);

    if (this.state.status.includes('playing')) {
      return true;
    } else if (this.ending > 0) {
      finish.play();
      this.ending -= time;
      return true;
    } else {
      this.display.clear();
      this.statusFunction(this.state.status);
      return false;
    }
  }
```

#### Level parsing

To ensure optimal frame updating, I create a background layer that is drawn at the beginning of each level and is never updated, as well as an actors layer that is redrawn every frame. The actors layer only includes objects with changeable statuses that affect gameplay.

```javascript
class Display {
  constructor(parent, level) {
    // create wrapper for game
    this.wrapper = parent.appendChild(createElement('div', 'game'));
    // ...
    this.wrapper.appendChild(this.drawBackground());
    // ...
  }

  drawBackground() {
    // ...
    // iterate over each row of the previously built out grid (full of just words)
    this.level.rows.forEach(row => {
      // create row to append to the parent table
      const rowElement = table.appendChild(createElement('tr'));
      rowElement.style.height = `${scale}px`;
      row.forEach(fieldType => {
        // append individual tiles onto row
        rowElement.appendChild(createElement('td', fieldType));
      });
    });
    return table;
  }

  // drawn every time the display is updated with the given state
  drawActors(state) {
    // ...
    for (let actor of state.actors) {
      // ...
      const el = wrapper.appendChild(
        createElement('div', `actor ${actor.constructor.name.toLowerCase()} ${currPlayerStatus} ${currLevelStatus}`);
      // ...
    }
    return wrapper;
  }

  drawFrame(state) {
    // ...
    this.actorLayer = this.drawActors(state);
    this.wrapper.appendChild(this.actorLayer);
    // ...
    this.scrollPlayerIntoView(state);
  }
}
```

### Future plans

- [x] ~~Tutorial~~
- [x] ~~Responsive and personalized audio for each characters' jumps, as well as level completion~~
- [x] ~~More characters~~ (previously 2, currently 5)
- [x] ~~Better collision detection that allows for stacking of characters~~
- [ ] Visual responsiveness: trampoline bouncing, simulation of moving water
- [ ] Parallax scrolling: 2.5D background that gives a pseudo-3D effect
- [ ] Portals that transport players to different parts of levels
