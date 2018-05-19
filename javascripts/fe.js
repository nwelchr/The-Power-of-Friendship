import Player from './player';
import Vector from './vector';

class Fe extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const feSize = size || new Vector(1.2, 1.8);
        const feXSpeed = xSpeed || 25;
        const feJumpSpeed = jumpSpeed || 16;
        super(pos, ch, speed, feSize, feXSpeed, feJumpSpeed);
    }
}

export default Fe;