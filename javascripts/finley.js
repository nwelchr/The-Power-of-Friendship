import Player from './player';
import Vector from './vector';

class Finley extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const finleySize = size || new Vector(.7, 1.3);
        const finleyXSpeed = xSpeed || 6;
        const finleyJumpSpeed = jumpSpeed || 10;
        super(pos, ch, speed, finleySize, finleyXSpeed, finleyJumpSpeed);
    }
}

export default Finley;