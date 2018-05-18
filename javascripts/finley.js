import Player from './player';
import Vector from './vector';

class Finley extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const finleySize = size || new Vector(1.5, 2.9);
        const finleyXSpeed = xSpeed || 15;
        const finleyJumpSpeed = jumpSpeed || 70;
        super(pos, ch, speed, finleySize, finleyXSpeed, finleyJumpSpeed);
    }
}

export default Finley;