import Vector from "./vector";
import State from "./state";

export class FinleyGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, -1.9));
        this.ch = ch;
        this.size = new Vector(1.5, 2.9);
    }

    update() {
        return this;
    }

    collide(state) {
        return new State(Object.assign({}, state, { finleyStatus: true }));
    }
}
export class FrankieGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, -2.5));
        this.ch = ch;
        this.size = new Vector(3.5, 3.5);
    }

    update() {
        return this;
    }

    collide(state) {
        return new State(Object.assign({}, state, { frankieStatus: true }));
    }
}


export class ForestGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, -5));
        this.ch = ch;
        this.size = new Vector(1.2, 6);
    }

    update() {
        return this;
    }

    collide(state) {
        return new State(Object.assign({}, state, { forestStatus: true }));      
    }
}


export class FeGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, -.8));
        this.ch = ch;
        this.size = new Vector(1.2, 1.8);
    }
    
    update() {
        return this;
    }
    
    collide(state) {
        return new State(Object.assign({}, state, { feStatus: true }));
    }
}
export class FitzGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new Vector(0, 0));
        this.ch = ch;
        this.size = new Vector(6, 1);
    }

    update() {
        return this;
    }

    collide(state) {
        return new State(Object.assign({}, state, { fizStatus: true }));
    }
}