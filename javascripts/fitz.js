import Player from './player';
import Vector from './vector';

class Fitz extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed, gravity) {
        const fitzSize = size || new Vector(6, 1);
        const fitzXSpeed = xSpeed || 10;
        const fitzJumpSpeed = jumpSpeed || 12;
        super(pos, ch, speed, fitzSize, fitzXSpeed, fitzJumpSpeed, gravity);
    }
}

export default Fitz;