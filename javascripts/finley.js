import Player from './player';
import Vector from './vector';

class Finley extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed, gravity) {
        const finleySize = size || new Vector(1.5, 2.9);
        const finleyXSpeed = xSpeed || 15;
        const finleyJumpSpeed = jumpSpeed || 18;
        super(pos, ch, speed, finleySize, finleyXSpeed, finleyJumpSpeed, gravity);
    }
}

export default Finley;