import Player from './player';
import Vector from './vector';

class Frankie extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const frankieSize = size || new Vector(1.5, .8);
        const frankieXSpeed = xSpeed || 4;
        const frankieJumpSpeed = jumpSpeed || 6;
        super(pos, ch, speed, frankieSize, frankieXSpeed, frankieJumpSpeed);
    }
}

export default Frankie;