import Vector from "./vector";
import State from "./state";

export class FrankieGoal {
    constructor(pos, ch) {
        this.pos = pos;
        this.ch = ch;
        this.size = new Vector(1.5, .8);
    }

    update() {
        return this;
    }

    collide(state) {
        return new State(Object.assign({}, state, { frankieStatus: true }));
    }
}

export class FinleyGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, -.5));
        this.ch = ch;
        this.size = new Vector(.8, 1.5);
    }

    update() {
        return this;
    }

    collide(state) {
        debugger;
        return new State(Object.assign({}, state, { finleyStatus: true }));
    }
}

export class ForestGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, 0));
        this.ch = ch;
        this.size = new Vector(2.5, .8);
    }

    update() {
        return this;
    }

    collide(state) {
        return new State(Object.assign({}, state, { forestStatus: true }));      
    }
}