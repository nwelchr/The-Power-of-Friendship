import Player from './player';
import Vector from './vector';

class Forest extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const forestSize = size || new Vector(1.2, 6);
        const forestXSpeed = xSpeed || 14;
        const forestJumpSpeed = jumpSpeed || 20;
        super(pos, ch, speed, forestSize, forestXSpeed, forestJumpSpeed);
    }
}

export default Forest;