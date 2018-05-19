import Player from './player';
import Vector from './vector';

class Forest extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed, gravity) {
        const forestSize = size || new Vector(1.2, 6);
        const forestXSpeed = xSpeed || 14;
        const forestJumpSpeed = jumpSpeed || 22;
        super(pos, ch, speed, forestSize, forestXSpeed, forestJumpSpeed, gravity);
    }
}

export default Forest;