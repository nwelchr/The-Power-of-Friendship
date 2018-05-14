import Vector from "./vector";
import Finley from './finley';
import Frankie from './frankie';
import Forest from './forest';
import Poison from './poison';
import Player from "./player";
import { FinleyGoal, FrankieGoal, ForestGoal } from './goals';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";

const actorChars = {
    'i': Finley,
    'r': Frankie,
    'o': Forest,
    '=': Poison, '|': Poison, 'v': Poison, 'p': Poison,
    '!': FinleyGoal, '@': FrankieGoal, 'O': ForestGoal,
};

const instructionChars = {

};

class Level {
    constructor(levelMap, levelId) {
        this.levelId = levelId;
        this.rows = [];
        this.width = levelMap[0].length; // width of level determined my first row
        this.height = levelMap.length; // # of rows in array
        this.actors = []; // array of 'actors' i.e. non-background objs

        for (let y = 0; y < this.height; y++) { // iterate over each string in the map
            const line = levelMap[y];
            const currRow = [];

            for (let x = 0; x < this.width; x++) { // iterate over each character
                const ch = line[x];
                let fieldType;

                const Actor = actorChars[ch];
                if (Actor) { 
                    this.actors.push(new Actor(new Vector(x, y), ch));
                }
                else {
                    switch(ch) {
                        case 'x':
                            fieldType = 'wall';
                            break;
                        case 'w':
                            fieldType = 'water';
                            break;                            
                        case 't':
                            fieldType = 'trampoline';
                            break;
                        case 'g':
                            fieldType = 'gravity';
                            break;
                        case 'h':
                            fieldType = 'heart';
                            break;
                        case '0':
                            fieldType = 'instruction zero';
                            break;
                        case '1':
                            fieldType = 'instruction one';
                            break;
                        case '2':
                            fieldType = 'instruction two';
                            break;
                        case '3':
                            fieldType = 'instruction three';
                            break;
                        case '4':
                            fieldType = 'instruction four';
                            break;
                        case '5':
                            fieldType = 'instruction five';
                            break;
                        case '6':
                            fieldType = 'instruction six';
                            break;
                        case '7':
                            fieldType = 'instruction seven';
                            break;
                        case '8':
                            fieldType = 'instruction eight';
                            break;
                        case '9':
                            fieldType = 'instruction nine';
                            break;
                        case '~':
                            fieldType = 'instruction ten';
                            break;
                        case '#':
                            fieldType = 'instruction eleven';
                            break;
                        case '$':
                            fieldType = 'instruction twelve';
                            break;
                        case '%':
                            fieldType = 'instruction thirteen';
                            break;
                        case '^':
                            fieldType = 'instruction fourteen';
                            break;
                        case '&':
                            fieldType = 'instruction fifteen';
                            break;
                        case '*':
                            fieldType = 'instruction sixteen';
                            break;
                        case '(':
                            fieldType = 'instruction seventeen';
                            break;
                        case ')':
                            fieldType = 'instruction eighteen';
                            break;
                        case '-':
                            fieldType = 'instruction nineteen';
                            break;    
                        default:
                            fieldType = null;
                            break;
                    }
                }
                currRow.push(fieldType);
            }

            this.rows.push(currRow);
        }
    }

    touching(pos, size) {
        // defines boundaries of what counts as touching
        const xStart = Math.floor(pos.x);
        const xEnd = Math.ceil(pos.x + size.x);
        const yStart = Math.floor(pos.y);
        const yEnd = Math.ceil(pos.y + size.y);

        // if the user hits top/right/left margins, it's a wall
        if (xStart < 0 || xEnd > this.width || yStart < 0) {
            return "wall";
        }

        // if the user hits the bottom margin, it counts as poison
        if (yEnd > this.height) {
            return "poison";
        }


        for (let y = yStart; y < yEnd; y++) {
            let fieldType;
            for (let x = xStart; x < xEnd; x++) {
                fieldType = this.rows[y][x];
                if (fieldType) return fieldType;
            }
        }
    }


}

export default Level;