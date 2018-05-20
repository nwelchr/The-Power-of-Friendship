import Vector from './vector';
import State from './state';

const finleyJumpAudio = document.getElementById('finley-jump');
const frankieJumpAudio = document.getElementById('frankie-jump');
const forestJumpAudio = document.getElementById('forest-jump');
const feJumpAudio = document.getElementById('fe-jump');
const fitzJumpAudio = document.getElementById('fitz-jump');
finleyJumpAudio.volume = .08;
frankieJumpAudio.volume = .08;
forestJumpAudio.volume = .08;
feJumpAudio.volume = .08;
fitzJumpAudio.volume = .08;

class Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed, gravity) {
        this.pos = pos;
        this.speed = speed || new Vector(0, 0); // initial speed
        this.size = size;
        this.xSpeed = xSpeed;
        this.jumpSpeed = jumpSpeed;
        this.gravity = gravity || 25;
    }

    moveX(time, state, keys, overlap) {
        this.speed.x = 0;
        if (keys.left && this === state.player && !(overlap.includes('rightOverlap'))) this.speed.x -= this.xSpeed;
        if (keys.right && this === state.player && !(overlap.includes('leftOverlap'))) this.speed.x += this.xSpeed;

        // what does this do?
        if (this !== state.player && ['topOverlap'].includes(overlap)) { 
            this.speed.x += state.player.speed.x;
         }

        const movedX = this.pos.plus(new Vector(this.speed.x * time, 0));
        if ((overlap.includes('leftOverlap') && movedX < this.pos.x) 
        || (overlap.includes('rightOverlap') && movedX > this.pos.x)) {
            return;
        } else if (state.level.touching(movedX, this.size) !== 'wall') {
            this.pos = movedX;
        }
    }

    moveY(time, state, keys, overlap) {
        this.speed.y += time * this.gravity;
        const motion = new Vector(0, this.speed.y * time);
        const newPos = this.pos.plus(motion); 
        const obstacle = state.level.touching(newPos, this.size);
        if (['gravity'].includes(obstacle)) { 
            this.gravity = -25;
            this.pos = newPos;
        } else {
            this.gravity = 25;
        }
        if (obstacle || overlap.includes('topOverlap') || overlap.includes('bottomOverlap') && (this === state.player || state.nonPlayers.includes(this))) {
             if (['gravity', 'poison', 'instruction'].includes(obstacle)) {
                this.pos = newPos;    
            } else if (overlap.includes('Platform')) {
                const platform = overlap.find(overlapType => typeof overlapType === 'object').platform;
                if (keys.up && this === state.player) {
                    this.pos.y = platform.pos.y - this.size.y - .5;
                    this.playJumpAudio(state);                
                    this.speed.y = -this.jumpSpeed;
                } else {
                    this.pos.y = platform.pos.y - this.size.y;
                    this.speed.y = Math.sin(platform.wobble) * .5;
                }
            } else if (overlap.includes('topOverlap') && this.speed.y < 0) {
                this.pos = newPos;
            }  else if (obstacle === 'trampoline') {
                this.playJumpAudio(state);
                this.speed.y = -(Math.floor(Math.random() * 6 + this.jumpSpeed * 1.5));
                this.pos.y -= .1;
            } else if (overlap.includes('bottomOverlap')) {
                if (newPos < this.pos || !['water', 'wall'].includes(obstacle)) {
                    this.pos = newPos;
                } else if (this.constructor.name === 'Frankie') {
                    if (this.speed.y > 0) this.speed.y = 0;
                } else {
                    this.speed.y = this.jumpSpeed * .1;
                }
            }
            else if (keys.up && ((this.speed.y >= 0 && !(this.speed.y <= 1 && obstacle === 'water')) || overlap.includes('topOverlap')) && this === state.player) {
                this.playJumpAudio(state);                
                this.speed.y = -this.jumpSpeed;
                if (obstacle === 'water') this.speed.y -= (Math.random() * 8 + 3);               
            } 
            else if (keys.down && this.speed.y < 1 && obstacle === 'water' && this === state.player) {
                this.pos = newPos;
                console.log(this.speed.y);
                this.playJumpAudio(state);                
                this.speed.y += (Math.random() * 10 + 13);
            } 
            else if (obstacle === 'water') {
                    this.speed.y -= 1;
                    if (this.speed.y < 0) this.speed.y += 1.5;
                    // if (this.speed.y > 0) this.speed.y -= 1;
                    this.pos = newPos;
            } 
            else {
                this.speed.y = 0;
            }
        } else { 
            this.pos = newPos;
        }

    }

    playJumpAudio(state) {
        switch (state.player.constructor.name) {
            case "Finley":
                finleyJumpAudio.play();
                break;
            case "Frankie":
                frankieJumpAudio.play();
                break;
            case "Forest":
                forestJumpAudio.play();
                break;
            case "Fe":
                feJumpAudio.play();
                break;
            case "Fitz":
                fitzJumpAudio.play();
                break;
            default:
                break;
        }
    }

    update (time, state, keys) {
        let overlap = [];
        for(let actor of state.actors) {
            if (!(this === actor)) {
                const currOverlap = state.overlap(this, actor);
                // if (Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor.name === 'Player'
                //     && actor.constructor.name === 'Poison'
                //     && currOverlap) {
                //         actor.collide(state);
                //     }
                if (currOverlap === 'topOverlap' && actor.constructor.name === "Platform") overlap.push('Platform', { platform: actor });
                overlap.push(currOverlap);
                // if (currOverlap 
                //     && ['topOverlap', 'bottomOverlap', 'leftOverlap', 'rightOverlap'].includes(currOverlap)) {
                //         overlap.push(currOverlap);
                //     }
                // else if (currOverlap) { 
                //     overlap.push(currOverlap);
                //     break;
                // }
            }
        }

        if (state.status !== 'won') {
            if (!(overlap.includes('leftOverlap') && overlap.includes('rightOverlap'))) {
                this.moveX(time, state, keys, overlap);
            }
            if (!(overlap.includes('topOverlap') && overlap.includes('bottomOverlap'))) {        
                this.moveY(time, state, keys, overlap);
            }
        }

        const Actor = this.constructor;
        return new Actor (
            this.pos, 
            null, 
            new Vector(this.speed.x, this.speed.y), 
            this.size, 
            this.xSpeed, 
            this.jumpSpeed, 
            this.gravity
        );
    }

}

export default Player;