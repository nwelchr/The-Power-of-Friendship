const scale = 20; // scale units into pixels

// helper function to create an element in the dom and give it a class;

const createElement = (name, className) => {
    const element = document.createElement(name);
    if (className) element.className = className;
    return element;
};

class Display {
    constructor(parent, level) {
        this.wrapper = parent.appendChild(createElement('div', 'game')); // create wrapper for actual game (since screen will be slipping off)
        // this.wrapper = parent;

        this.level = level;

        // tracks element that holds actors so they can be removed/replaced
        this.actorLayer = null; // background and actor layers important for time save

        this.wrapper.appendChild(this.drawBackground());

        this.drawActors = this.drawActors.bind(this);
    }

    drawBackground() { 
        let background = 'background ';
        switch (this.level.levelId) {
            case 1:
            case 2:
                background += 'bg1';
                break;
            case 3:  
            case 4:
                background += 'bg2';
                break;
            case 5:
            case 6:
                background += 'bg3';
                break;
            case 7:
            case 8:
            case 9:
                background += 'bg4';
                break;
            case 10:
            case 11:
                background += 'bg5';
                break;
        }
        const table = createElement('table', background);
        table.style.width = `${this.level.width * scale}px`; // sets specifc style, doesn't change other inline styles

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
        const wrapper = createElement('div');

        const currPlayer = state.player;
        const currLevel = state.level.levelId;

        for (let actor of state.actors) {
            const currPlayerStatus = currPlayer === actor ? 'curr-player' : '';
            const currLevelStatus = currLevel === 1 ? 'finley-tut' : '';
            const el = wrapper.appendChild(createElement('div', `actor ${actor.constructor.name.toLowerCase()} ${currPlayerStatus} ${currLevelStatus}`)); // actor.constructor.name finds the name of the class of the actor
            el.style.width = `${actor.size.x * scale}px`;
            el.style.height = `${actor.size.y * scale}px`;
            el.style.left = `${actor.pos.x * scale}px`;
            el.style.top = `${actor.pos.y * scale}px`;
        }

        return wrapper;
    }

    drawFrame(state) {
        if (this.actorLayer) this.actorLayer.remove();
        this.actorLayer = this.drawActors(state);
        this.wrapper.appendChild(this.actorLayer);
        this.wrapper.className = `game ${state.status}`;
        this.scrollPlayerIntoView(state);
    }

    scrollPlayerIntoView(state) {
        const width = this.wrapper.clientWidth; // takes width of game div
        const height = this.wrapper.clientHeight;
        const margin = width / 3; // it bugs out if I try too hard to make it centered???
        
        const left = this.wrapper.scrollLeft;
        const right = left + width;
        const top = this.wrapper.scrollTop;
        const bottom = top + height;
        
        const player = state.player;
        const center = player.pos.plus(player.size.times(0.5)).times(scale); // to find the player's center, we add the position + half the size


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

    clear() {
        // odd syntax to remove the wrapper because htmlelements are weird! DOESN'T WORK
        // this.wrapper.parentNode.removeChild(this.wrapper);
        this.wrapper.remove();
    }
}

export default Display;