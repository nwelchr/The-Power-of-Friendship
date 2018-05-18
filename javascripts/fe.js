import Player from './player';
import Vector from './vector';

class Fe extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const feSize = size || new Vector(1.2, 2);
        const feXSpeed = xSpeed || 20;
        const feJumpSpeed = jumpSpeed || 50;
        super(pos, ch, speed, feSize, feXSpeed, feJumpSpeed);
    }
}

export default Fe;