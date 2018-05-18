import Player from './player';
import Vector from './vector';

class Frankie extends Player {
constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
    const frankieSize = size || new Vector(3.5, 3.5);
    const frankieXSpeed = xSpeed || 12;
    const frankieJumpSpeed = jumpSpeed || 10;
    super(pos, ch, speed, frankieSize, frankieXSpeed, frankieJumpSpeed);
}
}

export default Frankie;