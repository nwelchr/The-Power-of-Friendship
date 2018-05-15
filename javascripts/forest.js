import Player from './player';
import Vector from './vector';

class Forest extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const forestSize = size || new Vector(2.5, .6);
        const forestXSpeed = xSpeed || 5;
        const forestJumpSpeed = jumpSpeed || 7;
        super(pos, ch, speed, forestSize, forestXSpeed, forestJumpSpeed);
    }
}

export default Forest;