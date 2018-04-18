import Vector from './vector';

class Player {
    constructor(pos, ch, speed) {
        // this.pos = pos;
        // this.size = size;
        // this.speed = speed;
        // this.jumpSpeed = jumpSpeed;
        // this.gravity = gravity;
        this.pos = pos;
        this.size = new Vector(.8, 1.5);
        this.speed = speed || new Vector(0, 0); // initial speed
        this.xSpeed = 7;
        this.jumpSpeed = 7;
        this.gravity = 10;
    }

    moveX(time, state, keys) {

        // this.speed.x = 0;
        // if (keys.left) this.speed.x -= this.xSpeed;
        // if (keys.right) this.speed.x += this.xSpeed;
        if (keys.left || keys.right || keys.up) {
            if (this.speed.x < this.jumpSpeed && this.speed.x > -this.jumpSpeed) {
            if (keys.left) this.speed.x -= this.xSpeed;
            if (keys.right) this.speed.x += this.xSpeed;
            } else if (this.speed.x === this.jumpSpeed || this.speed.x === -this.jumpSpeed) {
              if (keys.left && this.speed.x === this.jumpSpeed) this.speed.x -= this.xSpeed;
              if (keys.right && this.speed.x === -this.jumpSpeed) this.speed.x += this.xSpeed;
            } 
          } else { 
            if (this.speed.x > 0) this.speed.x -= this.speed.x < this.xSpeed ? this.speed.x : this.xSpeed;
            if (this.speed.x < 0) this.speed.x += this.speed.x > -this.xSpeed ? -this.speed.x : this.xSpeed;
          }

        const movedX = this.pos.plus(new Vector(this.speed.x * time, 0));
        if (state.level.touching(movedX, this.size) !== 'wall') {
            this.pos = movedX;
        }
    }

    moveY(time, state, keys) {
        this.speed.y += time * this.gravity;
        const motion = new Vector(0, this.speed.y * time);
        const newPos = this.pos.plus(motion);
        const obstacle = state.level.touching(newPos, this.size);
        if (obstacle) {
            if (keys.up && this.speed.y >= 0) {
                this.speed.y = -this.jumpSpeed;
            } else {
                this.speed.y = 0;
            }
        } else { 
            this.pos = newPos;
        }
    }

    update (time, state, keys) {
        this.moveX(time, state, keys);
        this.moveY(time, state, keys);
        return new Player (this.pos, null, new Vector(this.speed.x, this.speed.y));
    }

}

export default Player;