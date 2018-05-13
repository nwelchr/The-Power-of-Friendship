import Vector from "./vector";

// unsure how to manage current player

class State {
  constructor(
    level,
    actors,
    status,
    player,
    switchKey,
    gravity,
    finleyStatus,
    frankieStatus
  ) {
    this.level = level;
    this.actors = actors;
    this.player = this.actors.find(
      actor => actor.constructor.name === player.constructor.name
    );
    this.nonPlayers = this.actors.filter(
      actor =>
        Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name ===
          "Player" && actor !== this.player
    );
    this.status = status;
    this.finleyStatus = finleyStatus;
    this.frankieStatus = frankieStatus;
    this.gravity = gravity || 20;

    switch (this.level.levelId) {
      case 1:
        this.frankieStatus = true;
        if (this.player.pos.y < 30 && this.player.pos.y > 2) this.gravity = 0.8;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        this.frankieStatus = true;
        if (this.player.pos.y < 80 && this.player.pos.y > 5) this.gravity = 2;
        const wrapper = document.getElementById("game-wrapper");
        if (wrapper.classList.contains("rotated")) {
          this.gravity = -5;
        }
        break;
      case 11:
        this.frankieStatus = true;
        this.gravity = this.player.pos.x > 20 ? 10 : -1;
        if (status !== 'won') this.status = "playing last-level";
        break;
    }


    if (this.finleyStatus === true && this.frankieStatus === true) {
      return new State(this.level, this.actors, "won", this.player);
    }

    // to check whether switch is currently being pressed to prevent repeat switching on update
    this.switch = switchKey;
  }

  static start(level) {
    return new State(
      level,
      level.actors,
      "playing",
      level.actors.find(a => a.constructor.name === "Finley")
    );
  }

  overlap(player, actor) {
    if (["FinleyGoal", "FrankieGoal"].includes(actor.constructor.name)) {
      return (
        player.pos.x + player.size.x / 2 > actor.pos.x &&
        player.pos.x < actor.pos.x + actor.size.x / 2 &&
        player.pos.y + player.size.y / 2 > actor.pos.y &&
        player.pos.y < actor.pos.y + actor.size.y / 2
      );
    } else if (
      Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name ===
      "Player"
    ) {
      const horizontalOverlap =
        player.pos.x + player.size.x / 2 - (actor.pos.x + actor.size.x / 2);
      const horizontalDistance = player.size.x / 2 + actor.size.x / 2;

      const verticalOverlap =
        player.pos.y + player.size.y / 2 - (actor.pos.y + actor.size.y / 2);
      const verticalDistance = player.size.y / 2 + actor.size.y / 2;

      if (
        -verticalOverlap >= verticalDistance - 0.1 &&
        -verticalOverlap <= verticalDistance + 0.1 &&
        ((player.pos.x + player.size.x > actor.pos.x &&
          player.pos.x + player.size.x < actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x < actor.pos.x + actor.size.x) ||
          (player.pos.x < actor.pos.x &&
            player.pos.x + player.size.x > actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x + player.size.x < actor.pos.x + actor.size.x))
      ) {
        return "topOverlap";
      }

      if (
        verticalOverlap >= verticalDistance - 0.1 &&
        verticalOverlap <= verticalDistance + 0.1 &&
        ((player.pos.x + player.size.x > actor.pos.x &&
          player.pos.x + player.size.x < actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x < actor.pos.x + actor.size.x) ||
          (player.pos.x < actor.pos.x &&
            player.pos.x + player.size.x > actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x + player.size.x < actor.pos.x + actor.size.x))
      ) {
        return "bottomOverlap";
      }

      if (
        -horizontalOverlap >= horizontalDistance - 0.1 &&
        -horizontalOverlap <= horizontalDistance + 0.1 &&
        ((player.pos.y + player.size.y > actor.pos.y &&
          player.pos.y + player.size.y < actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y < actor.pos.y + actor.size.y) ||
          (player.pos.y < actor.pos.y &&
            player.pos.y + player.size.y > actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y + player.size.y < actor.pos.y + actor.size.y))
      ) {
        return "leftOverlap";
      }

      if (
        horizontalOverlap >= horizontalDistance - 0.1 &&
        horizontalOverlap <= horizontalDistance + 0.1 &&
        ((player.pos.y + player.size.y > actor.pos.y &&
          player.pos.y + player.size.y < actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y < actor.pos.y + actor.size.y) ||
          (player.pos.y < actor.pos.y &&
            player.pos.y + player.size.y > actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y + player.size.y < actor.pos.y + actor.size.y))
      ) {
        return "rightOverlap";
      }

    } else {
      return (
        player.pos.x + player.size.x > actor.pos.x &&
        player.pos.x < actor.pos.x + actor.size.x &&
        player.pos.y + player.size.y > actor.pos.y &&
        player.pos.y < actor.pos.y + actor.size.y
      );
    }
  }

  // any place I return keys.switch is to make sure the user doesn't hold down the switch key and have the characters switch rapidly between each other
  update(time, keys) {
    const oldPos = this.player.pos;

    let actors = this.actors.map(actor => actor.update(time, this, keys));

    // if s is being pressed and wasn't already being pressed, AND if the current player isn't jumping/falling/etc (w this.player.speed.y === 0), switch player
    if (
      keys.switch &&
      !this.switch &&
      ![1, 7, 8, 9, 10, 11].includes(this.level.levelId)
    //   ![96, 62, 78, 58].includes(this.level.width)
    )
      return new State(
        this.level,
        actors,
        this.status,
        this.nonPlayers[0],
        keys.switch,
        this.gravity,
        this.finleyStatus,
        this.frankieStatus
      );
    let newState = new State(
      this.level,
      actors,
      this.status,
      this.player,
      keys.switch,
      null,
      this.finleyStatus,
      this.frankieStatus
    );
    if (!newState.status.includes("playing")) return newState;

    let player = newState.player;

    switch (this.level.touching(player.pos, player.size)) {
      case "poison":
        if (player.size.x === 0.8)
          return new State(this.level, actors, "lost", this.player);
      case "water":
        if (player.size.x === 0.8 && this.level.levelId !== 9)
          return new State(this.level, actors, "lost drowned", this.player);
        break;
      case "trampoline":
        return new State(
          this.level,
          actors,
          "playing",
          this.player,
          keys.switch,
          -this.gravity * 1.5,
          this.finleyStatus,
          this.frankieStatus
        );
      default:
        break;
    }

    let overlapActors = actors.filter(
      actor =>
        !(
          Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor
            .name === "Player" ||
          ["FinleyGoal", "FrankieGoal"].includes(actor.constructor.name)
        )
    );
    for (let actor of overlapActors) {
      const overlap = this.overlap(player, actor);
      if (
        overlap &&
        !(actor.constructor.name === "Poison" && player.size.x === 1.5)
      )
        return actor.collide(newState);
    }

    const frankieGoal = actors.find(
      actor => actor.constructor.name === "FrankieGoal"
    );
    const frankie = actors.find(actor => actor.constructor.name === "Frankie");
    const finleyGoal = actors.find(
      actor => actor.constructor.name === "FinleyGoal"
    );
    const finley = actors.find(actor => actor.constructor.name === "Finley");

    newState.finleyStatus = this.overlap(finley, finleyGoal) ? true : false;
    newState.frankieStatus = this.overlap(frankie, frankieGoal) ? true : false;

    if (this.level.touching(this.player.pos, this.player.size) === "gravity") {
      newState.gravity = -Math.abs(newState.gravity);
    // } else if (![73, 67, 58].includes(this.level.width)) {
    } else if (![1, 10, 11].includes(this.level.levelId)) {
      newState.gravity = Math.abs(newState.gravity);
    }

    // attempting to do swimming in water level
    // if (this.level.touching(this.player.pos, this.player.size) === 'water' && this.level.width === 77) {
    //     console.log(this.level.width);
    //     newState.gravity = -Math.abs(newState.gravity) * 2;
    // } else {
    //     newState.gravity = Math.abs(newState.gravity);
    // }

    // const overlap = this.overlap(player, actor);
    // if (overlap && Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name !== 'Player') {
    //     newState = actor.collide(newState);
    // }
    // }

    return newState;
  }
}

export default State;
