import Player from './player';
import Vector from './vector';

class Fitz extends Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const fitzSize = size || new Vector(.6, 3);
        const fitzXSpeed = xSpeed || 5.5;
        const fitzJumpSpeed = jumpSpeed || 13;
        super(pos, ch, speed, fitzSize, fitzXSpeed, fitzJumpSpeed);
    }
}

export default Fitz;