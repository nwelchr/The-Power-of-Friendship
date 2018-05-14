import Vector from './vector';
import State from './state';

class Poison {
    constructor(pos, ch, speed, resetPos) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.ch = ch;
        
        switch(ch) {
            case '=':
                this.speed = speed || new Vector(2, 0); // sideways lava
                break;
            case '|':
                this.speed = speed || new Vector(0, 2); // speed in terms of vector, up & down
                break;
            case 'v':
                this.speed = speed || new Vector(0, 3);
                this.resetPos = resetPos || pos; // original starting position
                break;
            default:
                this.speed = new Vector(0, 0);
                break;
        }

    }

    collide(state) {
        return new State(Object.assign({}, state, { status: "lost" }));
    }

    update(time, state) {
        const newPos = this.pos.plus(this.speed.times(time));
        // if poison touching a wall, just reset
        if (!state.level.touching(newPos, this.size)) {
            return new Poison(newPos, this.ch, this.speed, this.resetPos);
        } else if (this.resetPos) {
            return new Poison(this.resetPos, this.ch, this.speed, this.resetPos);
        } else {
            return new Poison(this.pos, this.ch, this.speed.times(-1));
        }
    }
}

export default Poison;