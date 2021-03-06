import Vector from './vector';

// unsure how to manage current player

class State {
  constructor({
    level,
    actors,
    status,
    player,
    nonPlayers,
    switchKeyPressed,
    gravity,
    finleyStatus,
    frankieStatus,
    forestStatus,
    fitzStatus,
    feStatus
  }) {
    this.level = level;
    this.status = status;
    this.finleyStatus = finleyStatus;
    this.frankieStatus = frankieStatus;
    this.forestStatus = forestStatus;
    this.fitzStatus = fitzStatus;
    this.feStatus = feStatus;

    let players, goals, startingPlayer;

    switch (this.level.levelId) {
      case 1:
      case 2:
        this.players = ['Finley'];
        goals = ['FinleyGoal'];
        startingPlayer = 'Finley';
        break;
      case 3:
      case 4:
        this.players = ['Finley', 'Frankie'];
        goals = ['FinleyGoal', 'FrankieGoal'];
        startingPlayer = 'Frankie';
        break;
      case 5:
      case 6:
        this.players = ['Finley', 'Frankie', 'Forest'];
        goals = ['FinleyGoal', 'FrankieGoal', 'ForestGoal'];
        startingPlayer = 'Forest';
        break;
      case 7:
      case 8:
      case 9:
        this.players = ['Finley', 'Frankie', 'Forest', 'Fe'];
        goals = ['FinleyGoal', 'FrankieGoal', 'ForestGoal', 'FeGoal'];
        startingPlayer = 'Fe';
        break;
      case 10:
      case 11:
        this.players = ['Finley', 'Frankie', 'Forest', 'Fe', 'Fitz'];
        goals = [
          'FinleyGoal',
          'FrankieGoal',
          'ForestGoal',
          'FeGoal',
          'FitzGoal'
        ];
        startingPlayer = 'Fitz';
        break;
      default:
        this.players = ['Finley', 'Frankie', 'Forest', 'Fe', 'Fitz'];
        goals = [
          'FinleyGoal',
          'FrankieGoal',
          'ForestGoal',
          'FeGoal',
          'FitzGoal'
        ];
        startingPlayer = 'Finley';
        break;
    }

    this.switchKeyPressed = switchKeyPressed;
    this.actors = actors;
    this.player =
      player ||
      this.actors.find(actor => actor.constructor.name === startingPlayer);
    this.nonPlayers =
      nonPlayers ||
      this.actors.filter(
        actor =>
          this.players.includes(actor.constructor.name) && actor !== this.player
      );

    if (
      this.finleyStatus === true &&
      this.frankieStatus === true &&
      this.forestStatus === true &&
      this.fitzStatus === true &&
      this.feStatus === true &&
      this.status !== 'won'
    ) {
      return new State(
        Object.assign({}, this, {
          status: 'won'
        })
      );
    }
  }

  static start(level) {
    const newLevelState = {
      level: level,
      actors: level.actors,
      status: 'playing'
    };
    return new State(newLevelState);
  }

  overlap(player, actor) {
    if (
      [
        'FinleyGoal',
        'FrankieGoal',
        'ForestGoal',
        'FitzGoal',
        'FeGoal'
      ].includes(actor.constructor.name)
    ) {
      return (
        player.pos.x + player.size.x / 2 > actor.pos.x &&
        player.pos.x < actor.pos.x + actor.size.x / 2 &&
        player.pos.y + player.size.y / 2 > actor.pos.y &&
        player.pos.y < actor.pos.y + actor.size.y / 2
      );
    } else if (
      Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name ===
        'Player' ||
      actor.constructor.name === 'Platform'
    ) {
      const distFactor = 0.25;

      const horizontalOverlap =
        player.pos.x + player.size.x / 2 - (actor.pos.x + actor.size.x / 2);
      const horizontalDistance = player.size.x / 2 + actor.size.x / 2;

      const verticalOverlap =
        player.pos.y + player.size.y / 2 - (actor.pos.y + actor.size.y / 2);
      const verticalDistance = player.size.y / 2 + actor.size.y / 2;

      if (
        -verticalOverlap >= verticalDistance - distFactor &&
        -verticalOverlap <= verticalDistance + distFactor &&
        ((player.pos.x + player.size.x > actor.pos.x &&
          player.pos.x + player.size.x < actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x < actor.pos.x + actor.size.x) ||
          (player.pos.x < actor.pos.x &&
            player.pos.x + player.size.x > actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x + player.size.x < actor.pos.x + actor.size.x))
      ) {
        return 'topOverlap';
      }

      if (
        verticalOverlap >= verticalDistance - distFactor &&
        verticalOverlap <= verticalDistance + distFactor &&
        ((player.pos.x + player.size.x > actor.pos.x &&
          player.pos.x + player.size.x < actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x < actor.pos.x + actor.size.x) ||
          (player.pos.x < actor.pos.x &&
            player.pos.x + player.size.x > actor.pos.x + actor.size.x) ||
          (player.pos.x > actor.pos.x &&
            player.pos.x + player.size.x < actor.pos.x + actor.size.x))
      ) {
        return 'bottomOverlap';
      }

      if (
        -horizontalOverlap >= horizontalDistance - distFactor &&
        -horizontalOverlap <= horizontalDistance + distFactor &&
        ((player.pos.y + player.size.y > actor.pos.y &&
          player.pos.y + player.size.y < actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y < actor.pos.y + actor.size.y) ||
          (player.pos.y < actor.pos.y &&
            player.pos.y + player.size.y > actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y + player.size.y < actor.pos.y + actor.size.y))
      ) {
        return 'leftOverlap';
      }

      if (
        horizontalOverlap >= horizontalDistance - distFactor &&
        horizontalOverlap <= horizontalDistance + distFactor &&
        ((player.pos.y + player.size.y > actor.pos.y &&
          player.pos.y + player.size.y < actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y < actor.pos.y + actor.size.y) ||
          (player.pos.y < actor.pos.y &&
            player.pos.y + player.size.y > actor.pos.y + actor.size.y) ||
          (player.pos.y > actor.pos.y &&
            player.pos.y + player.size.y < actor.pos.y + actor.size.y))
      ) {
        return 'rightOverlap';
      }

      return false;
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
    if (keys.switch && !this.switchKeyPressed && this.nonPlayers.length > 0) {
      const newPlayer = this.nonPlayers.shift();
      this.nonPlayers.push(this.player);
      const newState = Object.assign({}, this, {
        actors,
        player: actors.find(
          actor => actor.constructor.name === newPlayer.constructor.name
        ),
        nonPlayers: this.nonPlayers,
        switchKeyPressed: keys.switch
      });
      return new State(newState);
    }

    // generate copy state to modify
    let newState = new State(
      Object.assign({}, this, {
        actors,
        player: actors.find(
          actor => actor.constructor.name === this.player.constructor.name
        ),
        nonPlayers: this.nonPlayers,
        switchKeyPressed: keys.switch
      })
    );
    const levelOver = !newState.status.includes('playing');
    if (levelOver) return newState;

    let player = newState.player;

    switch (this.level.touching(player.pos, player.size)) {
      case 'poison':
        return new State(
          Object.assign({}, newState, {
            status: 'lost'
          })
        );
      case 'trampoline':
        newState.player.gravity = -newState.player.gravity * 1.5;
        return new State(newState);
      default:
        break;
    }

    // checks collisions for all players
    let overlapActors = actors.filter(
      actor =>
        !(
          Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor
            .name === 'Player' ||
          [
            'FinleyGoal',
            'FrankieGoal',
            'ForestGoal',
            'FitzGoal',
            'FeGoal'
          ].includes(actor.constructor.name)
        )
    );

    let players = [];
    this.players.forEach(playerStr => {
      players.push(
        this.actors.find(actor => actor.constructor.name === playerStr)
      );
    });
    for (let actor of overlapActors) {
      for (let playerChar of players) {
        const overlap = this.overlap(playerChar, actor);
        if (overlap && !['Platform'].includes(actor.constructor.name))
          return actor.collide(newState);
      }
    }

    // determine of players are in their goalspots
    const frankieGoal = actors.find(
      actor => actor.constructor.name === 'FrankieGoal'
    );
    const frankie = actors.find(actor => actor.constructor.name === 'Frankie');
    const finleyGoal = actors.find(
      actor => actor.constructor.name === 'FinleyGoal'
    );
    const finley = actors.find(actor => actor.constructor.name === 'Finley');
    const forestGoal = actors.find(
      actor => actor.constructor.name === 'ForestGoal'
    );
    const forest = actors.find(actor => actor.constructor.name === 'Forest');
    const fitzGoal = actors.find(
      actor => actor.constructor.name === 'FitzGoal'
    );
    const fitz = actors.find(actor => actor.constructor.name === 'Fitz');
    const feGoal = actors.find(actor => actor.constructor.name === 'FeGoal');
    const fe = actors.find(actor => actor.constructor.name === 'Fe');

    newState.finleyStatus = this.overlap(finley, finleyGoal) ? true : false;
    newState.frankieStatus = this.overlap(frankie, frankieGoal) ? true : false;
    newState.forestStatus = this.overlap(forest, forestGoal) ? true : false;
    newState.fitzStatus = this.overlap(fitz, fitzGoal) ? true : false;
    newState.feStatus = this.overlap(fe, feGoal) ? true : false;

    return new State(newState);
  }
}

export default State;
