import Player from './player';
import Vector from './vector';

class Fe extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const feSize = size || new Vector(.5, .8);
        const feXSpeed = xSpeed || 6.5;
        const feJumpSpeed = jumpSpeed || 9.5;
        super(pos, ch, speed, feSize, feXSpeed, feJumpSpeed);
    }
}

export default Fe;