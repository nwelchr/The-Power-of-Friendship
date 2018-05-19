import Player from './player';
import Vector from './vector';

class Frankie extends Player {
constructor(pos, ch, speed, size, xSpeed, jumpSpeed, gravity) {
    const frankieSize = size || new Vector(3.5, 3.5);
    const frankieXSpeed = xSpeed || 12;
    const frankieJumpSpeed = jumpSpeed || 13;
    super(pos, ch, speed, frankieSize, frankieXSpeed, frankieJumpSpeed, gravity);
}
}

export default Frankie;