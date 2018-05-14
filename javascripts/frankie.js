import Player from './player';
import Vector from './vector';

class Frankie extends Player {
constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
    const frankieSize = size || new Vector(1.6, 1.6);
    const frankieXSpeed = xSpeed || 5;
    const frankieJumpSpeed = jumpSpeed || 8;
    super(pos, ch, speed, frankieSize, frankieXSpeed, frankieJumpSpeed);
}
}

export default Frankie;