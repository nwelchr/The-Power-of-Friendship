import Vector from './vector';
import State from './state';

const wobbleSpeed = .5, wobbleDist = 5;
class Platform {
    constructor(pos, ch, basePos, size, wobble) {
        this.pos = pos;
        this.ch = ch;
        this.basePos = basePos || pos.plus(new Vector(0, 0));
        this.size = size || new Vector(10, 1.5);
        this.wobble = wobble || 0;
    }

    collide(state) {
        return;
    }

    update(time, state) {
        let wobble = this.wobble + time * wobbleSpeed;
        let wobblePos = Math.sin(wobble) * wobbleDist;
        return new Platform(this.basePos.plus(new Vector(0, wobblePos)), this.ch,
                        this.basePos, this.size, wobble);
      }
}

export default Platform;