/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(otherVector) {
        return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    // to get distance traveled during a particular time
    times(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Vector);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


const finleyJumpAudio = document.getElementById('finley-jump');
const frankieJumpAudio = document.getElementById('frankie-jump');
finleyJumpAudio.volume = .08;
frankieJumpAudio.volume = .08;
class Player {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        this.pos = pos;
        this.speed = speed || new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0); // initial speed
        this.size = size;
        this.xSpeed = xSpeed;
        this.jumpSpeed = jumpSpeed;
    }

    moveX(time, state, keys, overlap) {
        this.speed.x = 0;
        if (keys.left && this === state.player && !overlap.includes('rightOverlap')) this.speed.x -= this.xSpeed;
        if (keys.right && this === state.player && !overlap.includes('leftOverlap')) this.speed.x += this.xSpeed;

        // what does this do?
        if (this !== state.player && ['topOverlap'].includes(overlap)) {
            this.speed.x += state.player.speed.x;
        }

        const movedX = this.pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.speed.x * time, 0));
        if (overlap.includes('leftOverlap') && movedX < this.pos.x || overlap.includes('rightOverlap') && movedX > this.pos.x) {
            return;
        } else if (state.level.touching(movedX, this.size) !== 'wall') {
            this.pos = movedX;
        }
    }

    moveY(time, state, keys, overlap) {
        this.speed.y += time * state.gravity;
        const motion = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, this.speed.y * time);
        const newPos = this.pos.plus(motion);
        const obstacle = state.level.touching(newPos, this.size);
        if (obstacle || overlap.includes('topOverlap') || overlap.includes('bottomOverlap') && (this === state.player || state.nonPlayers.includes(this))) {
            if (['gravity', 'poison', 'instruction'].includes(obstacle)) {
                // jump through gravity, poison, and instructions
                this.pos = newPos;
            } else if (overlap.includes('Platform')) {
                const platform = overlap.find(overlapType => typeof overlapType === 'object').platform;
                if (keys.up && this === state.player) {
                    this.pos.y = platform.pos.y - this.size.y - .5;
                    state.player.constructor.name === "Finley" ? finleyJumpAudio.play() : frankieJumpAudio.play();
                    this.speed.y = -this.jumpSpeed;
                } else {
                    this.pos.y = platform.pos.y - this.size.y;
                    this.speed.y = Math.sin(platform.wobble) * .5;
                }
            } else if (overlap.includes('topOverlap') && this.speed.y < 0) {
                // 
                this.pos = newPos;
            } else if (obstacle === 'trampoline') {
                state.player.constructor.name === "Finley" ? finleyJumpAudio.play() : frankieJumpAudio.play();
                this.speed.y = -Math.floor(Math.random() * 2 + 12);
                this.pos.y -= .1;
            } else if (overlap.includes('bottomOverlap')) {
                if (newPos < this.pos || !['water', 'wall'].includes(obstacle)) {
                    this.pos = newPos;
                } else if (this.constructor.name === 'Frankie') {
                    if (this.speed.y > 0) this.speed.y = 0;
                } else {
                    this.speed.y = this.jumpSpeed * .1;
                }
            } else if (keys.up && (this.speed.y >= 0 || overlap.includes('topOverlap')) && this === state.player) {
                state.player.constructor.name === "Finley" ? finleyJumpAudio.play() : frankieJumpAudio.play();
                this.speed.y = -this.jumpSpeed;
                if (obstacle === 'water') this.speed.y -= .5;
            } else if (obstacle === 'water') {
                if (this.constructor.name === "Finley") {
                    this.speed.y -= 1;
                    if (this.speed.y < 0) this.speed.y += 1.5;
                    // if (this.speed.y > 0) this.speed.y -= 1;
                    this.pos = newPos;
                } else this.pos.y = 8.1;
            } else {
                this.speed.y = 0;
            }
        } else {
            this.pos = newPos;
        }
    }

    update(time, state, keys) {
        let overlap = [];
        for (let actor of state.actors) {
            if (!(this === actor)) {
                const currOverlap = state.overlap(this, actor);
                if (currOverlap === 'topOverlap' && actor.constructor.name === "Platform") overlap.push('Platform', { platform: actor });
                if (currOverlap && ['topOverlap', 'bottomOverlap', 'leftOverlap', 'rightOverlap'].includes(currOverlap)) {
                    overlap.push(currOverlap);
                } else if (currOverlap) {
                    overlap.push(currOverlap);
                    break;
                }
            }
        }

        if (state.status !== 'won') {
            // if (overlap.includes('leftOverlap') && overlap.includes('rightOverlap')) {debugger;}
            if (!(overlap.includes('leftOverlap') && overlap.includes('rightOverlap'))) {
                this.moveX(time, state, keys, overlap);
            }
            if (!(overlap.includes('topOverlap') && overlap.includes('bottomOverlap'))) {
                this.moveY(time, state, keys, overlap);
            }
        }

        const Actor = this.constructor;
        return new Actor(this.pos, null, new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.speed.x, this.speed.y));
    }

}

/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


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

    this.gravity = gravity || 25;

    let players, goals, startingPlayer;

    switch (this.level.levelId) {
      case 1:
        this.players = ['Finley'];
        goals = ['FinleyGoal'];
        startingPlayer = 'Finley';
        break;
      case 2:
        this.players = ['Finley'];
        goals = ['FinleyGoal'];
        startingPlayer = 'Finley';
        break;
      case 3:
        this.players = ['Finley'];
        goals = ['FinleyGoal'];
        startingPlayer = 'Finley';
        break;
      case 4:
        this.players = ['Finley', 'Frankie'];
        goals = ['FinleyGoal', 'FrankieGoal'];
        startingPlayer = 'Finley';
        break;
      case 5:
        this.players = ['Finley', 'Frankie'];
        goals = ['FinleyGoal', 'FrankieGoal'];
        startingPlayer = 'Frankie';
        break;
      case 6:
        this.players = ['Finley', 'Frankie', 'Forest'];
        goals = ['FinleyGoal', 'FrankieGoal', 'ForestGoal'];
        startingPlayer = 'Finley';
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      default:
        this.players = ['Finley', 'Frankie', 'Forest', 'Fe', 'Fitz'];
        goals = ['FinleyGoal', 'FrankieGoal', 'ForestGoal', 'FeGoal', 'FitzGoal'];
        startingPlayer = 'Finley';
        break;
    }

    this.switchKeyPressed = switchKeyPressed;
    this.actors = actors;
    this.player = player || this.actors.find(actor => actor.constructor.name === startingPlayer);
    this.nonPlayers = nonPlayers || this.actors.filter(actor => this.players.includes(actor.constructor.name) && actor !== this.player);

    switch (this.level.levelId) {
      case 1:
        this.gravity = this.player.pos.y < 12 ? 4 : 20;
        break;
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
        if (this.player.pos.y < 80 && this.player.pos.y > 5) this.gravity = 2;
        const wrapper = document.getElementById("game-wrapper");
        if (wrapper.classList.contains("rotated")) {
          this.gravity = -10;
        }
        break;
      case 11:
        this.gravity = this.player.pos.x > 20 ? 10 : -1;
        if (status !== 'won') this.status = "playing last-level";
        break;
      default:
        break;
    }

    // to check whether switch is currently being pressed to prevent repeat switching on update

    if (this.finleyStatus === true && this.frankieStatus === true && this.forestStatus === true && this.fitzStatus === true && this.feStatus === true && this.status !== 'won') {
      return new State(Object.assign({}, this, { status: "won" }));
    }
  }

  static start(level) {
    const newLevelState = {
      level: level,
      actors: level.actors,
      status: "playing"
    };
    return new State(newLevelState);
  }

  overlap(player, actor) {
    if (["FinleyGoal", "FrankieGoal", "ForestGoal", "FitzGoal", "FeGoal"].includes(actor.constructor.name)) {
      return player.pos.x + player.size.x / 2 > actor.pos.x && player.pos.x < actor.pos.x + actor.size.x / 2 && player.pos.y + player.size.y / 2 > actor.pos.y && player.pos.y < actor.pos.y + actor.size.y / 2;
    } else if (Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name === "Player" || actor.constructor.name === "Platform") {

      const distFactor = Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name === "Player" ? .1 : .2;

      const horizontalOverlap = player.pos.x + player.size.x / 2 - (actor.pos.x + actor.size.x / 2);
      const horizontalDistance = player.size.x / 2 + actor.size.x / 2;

      const verticalOverlap = player.pos.y + player.size.y / 2 - (actor.pos.y + actor.size.y / 2);
      const verticalDistance = player.size.y / 2 + actor.size.y / 2;

      if (-verticalOverlap >= verticalDistance - distFactor && -verticalOverlap <= verticalDistance + distFactor && (player.pos.x + player.size.x > actor.pos.x && player.pos.x + player.size.x < actor.pos.x + actor.size.x || player.pos.x > actor.pos.x && player.pos.x < actor.pos.x + actor.size.x || player.pos.x < actor.pos.x && player.pos.x + player.size.x > actor.pos.x + actor.size.x || player.pos.x > actor.pos.x && player.pos.x + player.size.x < actor.pos.x + actor.size.x)) {
        return "topOverlap";
      }

      if (verticalOverlap >= verticalDistance - distFactor && verticalOverlap <= verticalDistance + distFactor && (player.pos.x + player.size.x > actor.pos.x && player.pos.x + player.size.x < actor.pos.x + actor.size.x || player.pos.x > actor.pos.x && player.pos.x < actor.pos.x + actor.size.x || player.pos.x < actor.pos.x && player.pos.x + player.size.x > actor.pos.x + actor.size.x || player.pos.x > actor.pos.x && player.pos.x + player.size.x < actor.pos.x + actor.size.x)) {
        return "bottomOverlap";
      }

      if (-horizontalOverlap >= horizontalDistance - distFactor && -horizontalOverlap <= horizontalDistance + distFactor && (player.pos.y + player.size.y > actor.pos.y && player.pos.y + player.size.y < actor.pos.y + actor.size.y || player.pos.y > actor.pos.y && player.pos.y < actor.pos.y + actor.size.y || player.pos.y < actor.pos.y && player.pos.y + player.size.y > actor.pos.y + actor.size.y || player.pos.y > actor.pos.y && player.pos.y + player.size.y < actor.pos.y + actor.size.y)) {
        return "leftOverlap";
      }

      if (horizontalOverlap >= horizontalDistance - distFactor && horizontalOverlap <= horizontalDistance + distFactor && (player.pos.y + player.size.y > actor.pos.y && player.pos.y + player.size.y < actor.pos.y + actor.size.y || player.pos.y > actor.pos.y && player.pos.y < actor.pos.y + actor.size.y || player.pos.y < actor.pos.y && player.pos.y + player.size.y > actor.pos.y + actor.size.y || player.pos.y > actor.pos.y && player.pos.y + player.size.y < actor.pos.y + actor.size.y)) {
        return "rightOverlap";
      }

      return false;
    } else {
      return player.pos.x + player.size.x > actor.pos.x && player.pos.x < actor.pos.x + actor.size.x && player.pos.y + player.size.y > actor.pos.y && player.pos.y < actor.pos.y + actor.size.y;
    }
  }

  // any place I return keys.switch is to make sure the user doesn't hold down the switch key and have the characters switch rapidly between each other
  update(time, keys) {
    const oldPos = this.player.pos;

    let actors = this.actors.map(actor => actor.update(time, this, keys));

    // if s is being pressed and wasn't already being pressed, AND if the current player isn't jumping/falling/etc (w this.player.speed.y === 0), switch player
    if (keys.switch && !this.switchKeyPressed && this.nonPlayers.length > 0
    // ![1].includes(this.level.levelId)
    ) {
        const newPlayer = this.nonPlayers.shift();
        this.nonPlayers.push(this.player);
        const newState = Object.assign({}, this, {
          actors,
          player: actors.find(actor => actor.constructor.name === newPlayer.constructor.name),
          nonPlayers: this.nonPlayers,
          switchKeyPressed: keys.switch });
        return new State(newState);
      }

    let newState = new State(Object.assign({}, this, {
      actors,
      player: actors.find(actor => actor.constructor.name === this.player.constructor.name),
      nonPlayers: this.nonPlayers,
      switchKeyPressed: keys.switch //idk if i need to put this at false or keys.switch
    }));
    // new State(
    //   this.level,
    //   actors,
    //   this.status,
    //   this.player,
    //   keys.switch,
    //   null,
    //   this.finleyStatus,
    //   this.frankieStatus
    // );
    const levelOver = !newState.status.includes("playing");
    if (levelOver) return newState;

    let player = newState.player;

    switch (this.level.touching(player.pos, player.size)) {
      case "poison":
        // return new State(this.level, actors, "lost", this.player);
        return new State(Object.assign({}, newState, { status: "lost" }));
      case "water":
        if (player.constructor.name === "Finley" && this.level.levelId !== 9) {
          // return new State(this.level, actors, "lost drowned", this.player);
          return new State(Object.assign({}, newState, { status: "lost drowned" }));
        }
        break;
      case "trampoline":

        return new State(Object.assign({}, newState, { gravity: -this.gravity * 1.5 }));
      //   this.level,
      //   actors,
      //   "playing",
      //   this.player,
      //   keys.switch,
      //   -this.gravity * 1.5,
      //   this.finleyStatus,
      //   this.frankieStatus
      // );
      default:
        break;
    }

    let overlapActors = actors.filter(actor => !(Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name === "Player" || ["FinleyGoal", "FrankieGoal", "ForestGoal", "FitzGoal", "FeGoal"].includes(actor.constructor.name)));
    for (let actor of overlapActors) {
      const overlap = this.overlap(player, actor);
      if (overlap && !["Poison", "Platform"].includes(actor.constructor.name)) return actor.collide(newState);
    }

    const frankieGoal = actors.find(actor => actor.constructor.name === "FrankieGoal");
    const frankie = actors.find(actor => actor.constructor.name === "Frankie");
    const finleyGoal = actors.find(actor => actor.constructor.name === "FinleyGoal");
    const finley = actors.find(actor => actor.constructor.name === "Finley");
    const forestGoal = actors.find(actor => actor.constructor.name === "ForestGoal");
    const forest = actors.find(actor => actor.constructor.name === "Forest");
    const fitzGoal = actors.find(actor => actor.constructor.name === "FitzGoal");
    const fitz = actors.find(actor => actor.constructor.name === "Fitz");
    const feGoal = actors.find(actor => actor.constructor.name === "FeGoal");
    const fe = actors.find(actor => actor.constructor.name === "Fe");

    newState.finleyStatus = this.overlap(finley, finleyGoal) ? true : false;
    newState.frankieStatus = this.overlap(frankie, frankieGoal) ? true : false;
    newState.forestStatus = this.overlap(forest, forestGoal) ? true : false;
    newState.fitzStatus = this.overlap(fitz, fitzGoal) ? true : false;
    newState.feStatus = this.overlap(fe, feGoal) ? true : false;

    if (this.level.touching(this.player.pos, this.player.size) === "gravity") {
      newState.gravity = -Math.abs(newState.gravity);
      // } else if (![73, 67, 58].includes(this.level.width)) {
    } else if (![1, 10, 11].includes(this.level.levelId)) {
      newState.gravity = Math.abs(newState.gravity);
    }

    // attempting to do swimming in water level
    // if (this.level.touching(this.player.pos, this.player.size) === 'water' && this.level.width === 77) {
    //     newState.gravity = -Math.abs(newState.gravity) * 2;
    // } else {
    //     newState.gravity = Math.abs(newState.gravity);
    // }

    // const overlap = this.overlap(player, actor);
    // if (overlap && Object.getPrototypeOf(Object.getPrototypeOf(actor)).constructor.name !== 'Player') {
    //     newState = actor.collide(newState);
    // }
    // }

    return new State(newState);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (State);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__level__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__display__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__level_maps__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__state__ = __webpack_require__(2);





const keyCodes = {
    37: 'left',
    38: 'up',
    39: 'right',
    83: 'switch'
};

const audio = document.getElementById('intro');
audio.volume = 0.2;
audio.loop = true;
let isPlaying = false;

const finish = document.getElementById('level-finish');
finish.volume = 0.05;

const pauseModal = document.querySelector('.pause-modal');
const pauseButton = document.querySelector('.unpause');
const restartButton = document.querySelector('.restart');
const titleScreen = document.querySelector('.title-screen');
const startButton = document.querySelector('.start');

const gameWrapper = document.getElementById('game-wrapper');

class Game {
    constructor() {
        this.musicIsPlaying = false;
        this.gameIsRunning = true;
        this.keys = Object.create(null);
        this.levelId = 0;
        this.display = {};
        this.state = {};
        this.ending = 0;
        this.lastTime = 0;

        this.trackKeys = this.trackKeys.bind(this);
        this.restartLevel = this.restartLevel.bind(this);
        this.start = this.start.bind(this);
        this.startLevel = this.startLevel.bind(this);
        this.statusFunction = this.statusFunction.bind(this);
        this.rotateLevel10 = this.rotateLevel10.bind(this);
        this.frameFunction = this.frameFunction.bind(this);
        this.runLevel = this.runLevel.bind(this);
        this.runAnimation = this.runAnimation.bind(this);
        this.frame = this.frame.bind(this);
        this.restartLevel = this.restartLevel.bind(this);
        this.togglePauseScreen = this.togglePauseScreen.bind(this);

        restartButton.addEventListener('click', this.restartLevel);
        startButton.addEventListener('click', this.start);
        pauseButton.addEventListener('click', this.togglePauseScreen);
        window.addEventListener('keydown', this.trackKeys);
        window.addEventListener('keyup', this.trackKeys);
    }

    togglePauseScreen(e) {
        this.gameIsRunning = !this.gameIsRunning;

        // toggle music
        this.musicIsPlaying = !this.musicIsPlaying;
        this.musicIsPlaying ? audio.play() : audio.pause();

        pauseModal.classList.toggle("show");

        if (this.gameIsRunning) {
            requestAnimationFrame(this.frame);
        }
    }

    trackKeys(e) {
        if (!e) return;
        if (e.keyCode === 27 && e.type === "keydown") {
            this.togglePauseScreen();
            return;
        }
        if (keyCodes.hasOwnProperty(e.keyCode)) {
            e.preventDefault();
            const isKeydown = e.type === 'keydown';
            this.keys[keyCodes[e.keyCode]] = isKeydown;
        }
    }

    start() {
        this.musicIsPlaying = true;
        audio.play();

        titleScreen.classList.remove('show');
        this.levelId = 5;
        this.startLevel();
    }

    startLevel() {
        this.runLevel(new __WEBPACK_IMPORTED_MODULE_0__level__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__level_maps__["a" /* default */][this.levelId], this.levelId + 1));
    }

    statusFunction(status) {
        if (status.includes('lost')) {
            this.startLevel();
        } else if (this.levelId < __WEBPACK_IMPORTED_MODULE_2__level_maps__["a" /* default */].length - 1) {
            this.levelId += 1;
            this.startLevel();
        } else {
            this.titleScreen.classList.add('show');
        }
    }

    rotateLevel10() {
        const wrap = document.getElementById('game-wrapper');
        wrap.classList.add('rotated');
    }

    frameFunction(time) {
        this.state = this.state.update(time, this.keys);
        this.display.drawFrame(this.state);

        if (this.state.status.includes('playing')) {
            return true;
        } else if (this.ending > 0) {
            finish.play();
            this.ending -= time;
            return true;
        } else {
            this.display.clear('else statement of runAnimation', this.state.status);
            this.statusFunction(this.state.status);
            // return false;
        }
    }

    runLevel(level) {
        this.display = new __WEBPACK_IMPORTED_MODULE_1__display__["a" /* default */](gameWrapper, level);
        this.state = __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].start(level);
        this.ending = 1;

        // Rotate on the 10th level after 10 seconds
        if (level.levelId === 10) setTimeout(this.rotateLevel10, 10000);else if (gameWrapper.classList.contains('rotated')) {
            gameWrapper.classList.remove('rotated');
        }

        this.runAnimation(this.frameFunction);
    }

    runAnimation() {
        // last time since window has been open
        this.lastTime = null;

        if (this.gameIsRunning) requestAnimationFrame(this.frame);
    }

    frame(time) {
        if (this.gameIsRunning === false) {
            return;
        }

        if (this.lastTime !== null) {
            // converts time between ms and s for convenience
            let timeStep = Math.min(time - this.lastTime, 100) / 1000;
            if (this.frameFunction(timeStep) === false) return;
        }

        this.lastTime = time;
        requestAnimationFrame(this.frame);
    }

    restartLevel(e) {
        this.ending = 0;

        this.display.clear('restart button clicked', this.state.status);
        this.togglePauseScreen();
        this.statusFunction('lost');
    }

}

const game = new Game();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__finley__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__frankie__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__forest__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fitz__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__fe__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__poison__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__platform__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__goals__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_constants__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_constants__);












const actorChars = {
    'i': __WEBPACK_IMPORTED_MODULE_1__finley__["a" /* default */],
    'r': __WEBPACK_IMPORTED_MODULE_2__frankie__["a" /* default */],
    'o': __WEBPACK_IMPORTED_MODULE_3__forest__["a" /* default */],
    'z': __WEBPACK_IMPORTED_MODULE_4__fitz__["a" /* default */],
    'e': __WEBPACK_IMPORTED_MODULE_5__fe__["a" /* default */],
    '=': __WEBPACK_IMPORTED_MODULE_6__poison__["a" /* default */], '|': __WEBPACK_IMPORTED_MODULE_6__poison__["a" /* default */], 'v': __WEBPACK_IMPORTED_MODULE_6__poison__["a" /* default */], 'p': __WEBPACK_IMPORTED_MODULE_6__poison__["a" /* default */],
    'L': __WEBPACK_IMPORTED_MODULE_8__platform__["a" /* default */],
    '!': __WEBPACK_IMPORTED_MODULE_9__goals__["b" /* FinleyGoal */], '@': __WEBPACK_IMPORTED_MODULE_9__goals__["e" /* FrankieGoal */], 'O': __WEBPACK_IMPORTED_MODULE_9__goals__["d" /* ForestGoal */], 'Z': __WEBPACK_IMPORTED_MODULE_9__goals__["c" /* FitzGoal */], 'E': __WEBPACK_IMPORTED_MODULE_9__goals__["a" /* FeGoal */]
};

const instructionChars = {};

class Level {
    constructor(levelMap, levelId) {
        this.levelId = levelId;
        this.rows = [];
        this.width = levelMap[0].length; // width of level determined my first row
        this.height = levelMap.length; // # of rows in array
        this.actors = []; // array of 'actors' i.e. non-background objs

        for (let y = 0; y < this.height; y++) {
            // iterate over each string in the map
            const line = levelMap[y];
            const currRow = [];

            for (let x = 0; x < this.width; x++) {
                // iterate over each character
                const ch = line[x];
                let fieldType;

                const Actor = actorChars[ch];
                if (Actor) {
                    this.actors.push(new Actor(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](x, y), ch));
                } else {
                    switch (ch) {
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

/* harmony default export */ __webpack_exports__["a"] = (Level);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);



class Finley extends __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */] {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const finleySize = size || new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](1.5, 2.9);
        const finleyXSpeed = xSpeed || 15;
        const finleyJumpSpeed = jumpSpeed || 18;
        super(pos, ch, speed, finleySize, finleyXSpeed, finleyJumpSpeed);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Finley);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);



class Frankie extends __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */] {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const frankieSize = size || new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](3.5, 3.5);
        const frankieXSpeed = xSpeed || 12;
        const frankieJumpSpeed = jumpSpeed || 13;
        super(pos, ch, speed, frankieSize, frankieXSpeed, frankieJumpSpeed);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Frankie);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);



class Forest extends __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */] {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const forestSize = size || new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](1.2, 6);
        const forestXSpeed = xSpeed || 14;
        const forestJumpSpeed = jumpSpeed || 20;
        super(pos, ch, speed, forestSize, forestXSpeed, forestJumpSpeed);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Forest);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);



class Fitz extends __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */] {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const fitzSize = size || new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](6, 1);
        const fitzXSpeed = xSpeed || 10;
        const fitzJumpSpeed = jumpSpeed || 10;
        super(pos, ch, speed, fitzSize, fitzXSpeed, fitzJumpSpeed);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Fitz);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);



class Fe extends __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */] {
    constructor(pos, ch, speed, size, xSpeed, jumpSpeed) {
        const feSize = size || new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](1.2, 2);
        const feXSpeed = xSpeed || 20;
        const feJumpSpeed = jumpSpeed || 16;
        super(pos, ch, speed, feSize, feXSpeed, feJumpSpeed);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Fe);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(2);



class Poison {
    constructor(pos, ch, speed, resetPos) {
        this.pos = pos;
        this.size = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](1, 1);
        this.ch = ch;

        switch (ch) {
            case '=':
                this.speed = speed || new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](2, 0); // sideways lava
                break;
            case '|':
                this.speed = speed || new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 2); // speed in terms of vector, up & down
                break;
            case 'v':
                this.speed = speed || new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 3);
                this.resetPos = resetPos || pos; // original starting position
                break;
            default:
                this.speed = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0);
                break;
        }
    }

    collide(state) {
        return new __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */](Object.assign({}, state, { status: "lost" }));
    }

    update(time, state) {
        const newPos = this.pos.plus(this.speed.times(time));
        // if poison touching a wall, just reset
        if (!state.level.touching(newPos, this.size)) {
            return new Poison(newPos, this.ch, this.speed, this.resetPos);
        } else if (this.resetPos) {
            return new Poison(this.resetPos, this.ch, this.speed, this.resetPos);
        } else {
            return new Poison(this.pos, this.ch, this.speed.times(-1));
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Poison);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(2);



class FinleyGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -1.9));
        this.ch = ch;
        this.size = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](1.5, 2.9);
    }

    update() {
        return this;
    }

    collide(state) {
        return new __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */](Object.assign({}, state, { finleyStatus: true }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = FinleyGoal;

class FrankieGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -2.5));
        this.ch = ch;
        this.size = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](3.5, 3.5);
    }

    update() {
        return this;
    }

    collide(state) {
        return new __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */](Object.assign({}, state, { frankieStatus: true }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = FrankieGoal;


class ForestGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -5));
        this.ch = ch;
        this.size = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](1.2, 6);
    }

    update() {
        return this;
    }

    collide(state) {
        return new __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */](Object.assign({}, state, { forestStatus: true }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = ForestGoal;


class FeGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -1));
        this.ch = ch;
        this.size = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](1.2, 2);
    }

    update() {
        return this;
    }

    collide(state) {
        return new __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */](Object.assign({}, state, { feStatus: true }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FeGoal;

class FitzGoal {
    constructor(pos, ch) {
        this.pos = pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0));
        this.ch = ch;
        this.size = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](6, 1);
    }

    update() {
        return this;
    }

    collide(state) {
        return new __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */](Object.assign({}, state, { fizStatus: true }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = FitzGoal;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = {"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"E2BIG":7,"EACCES":13,"EADDRINUSE":48,"EADDRNOTAVAIL":49,"EAFNOSUPPORT":47,"EAGAIN":35,"EALREADY":37,"EBADF":9,"EBADMSG":94,"EBUSY":16,"ECANCELED":89,"ECHILD":10,"ECONNABORTED":53,"ECONNREFUSED":61,"ECONNRESET":54,"EDEADLK":11,"EDESTADDRREQ":39,"EDOM":33,"EDQUOT":69,"EEXIST":17,"EFAULT":14,"EFBIG":27,"EHOSTUNREACH":65,"EIDRM":90,"EILSEQ":92,"EINPROGRESS":36,"EINTR":4,"EINVAL":22,"EIO":5,"EISCONN":56,"EISDIR":21,"ELOOP":62,"EMFILE":24,"EMLINK":31,"EMSGSIZE":40,"EMULTIHOP":95,"ENAMETOOLONG":63,"ENETDOWN":50,"ENETRESET":52,"ENETUNREACH":51,"ENFILE":23,"ENOBUFS":55,"ENODATA":96,"ENODEV":19,"ENOENT":2,"ENOEXEC":8,"ENOLCK":77,"ENOLINK":97,"ENOMEM":12,"ENOMSG":91,"ENOPROTOOPT":42,"ENOSPC":28,"ENOSR":98,"ENOSTR":99,"ENOSYS":78,"ENOTCONN":57,"ENOTDIR":20,"ENOTEMPTY":66,"ENOTSOCK":38,"ENOTSUP":45,"ENOTTY":25,"ENXIO":6,"EOPNOTSUPP":102,"EOVERFLOW":84,"EPERM":1,"EPIPE":32,"EPROTO":100,"EPROTONOSUPPORT":43,"EPROTOTYPE":41,"ERANGE":34,"EROFS":30,"ESPIPE":29,"ESRCH":3,"ESTALE":70,"ETIME":101,"ETIMEDOUT":60,"ETXTBSY":26,"EWOULDBLOCK":35,"EXDEV":18,"SIGHUP":1,"SIGINT":2,"SIGQUIT":3,"SIGILL":4,"SIGTRAP":5,"SIGABRT":6,"SIGIOT":6,"SIGBUS":10,"SIGFPE":8,"SIGKILL":9,"SIGUSR1":30,"SIGSEGV":11,"SIGUSR2":31,"SIGPIPE":13,"SIGALRM":14,"SIGTERM":15,"SIGCHLD":20,"SIGCONT":19,"SIGSTOP":17,"SIGTSTP":18,"SIGTTIN":21,"SIGTTOU":22,"SIGURG":16,"SIGXCPU":24,"SIGXFSZ":25,"SIGVTALRM":26,"SIGPROF":27,"SIGWINCH":28,"SIGIO":23,"SIGSYS":12,"SSL_OP_ALL":2147486719,"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION":262144,"SSL_OP_CIPHER_SERVER_PREFERENCE":4194304,"SSL_OP_CISCO_ANYCONNECT":32768,"SSL_OP_COOKIE_EXCHANGE":8192,"SSL_OP_CRYPTOPRO_TLSEXT_BUG":2147483648,"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS":2048,"SSL_OP_EPHEMERAL_RSA":0,"SSL_OP_LEGACY_SERVER_CONNECT":4,"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER":32,"SSL_OP_MICROSOFT_SESS_ID_BUG":1,"SSL_OP_MSIE_SSLV2_RSA_PADDING":0,"SSL_OP_NETSCAPE_CA_DN_BUG":536870912,"SSL_OP_NETSCAPE_CHALLENGE_BUG":2,"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG":1073741824,"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG":8,"SSL_OP_NO_COMPRESSION":131072,"SSL_OP_NO_QUERY_MTU":4096,"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION":65536,"SSL_OP_NO_SSLv2":16777216,"SSL_OP_NO_SSLv3":33554432,"SSL_OP_NO_TICKET":16384,"SSL_OP_NO_TLSv1":67108864,"SSL_OP_NO_TLSv1_1":268435456,"SSL_OP_NO_TLSv1_2":134217728,"SSL_OP_PKCS1_CHECK_1":0,"SSL_OP_PKCS1_CHECK_2":0,"SSL_OP_SINGLE_DH_USE":1048576,"SSL_OP_SINGLE_ECDH_USE":524288,"SSL_OP_SSLEAY_080_CLIENT_DH_BUG":128,"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG":0,"SSL_OP_TLS_BLOCK_PADDING_BUG":512,"SSL_OP_TLS_D5_BUG":256,"SSL_OP_TLS_ROLLBACK_BUG":8388608,"ENGINE_METHOD_DSA":2,"ENGINE_METHOD_DH":4,"ENGINE_METHOD_RAND":8,"ENGINE_METHOD_ECDH":16,"ENGINE_METHOD_ECDSA":32,"ENGINE_METHOD_CIPHERS":64,"ENGINE_METHOD_DIGESTS":128,"ENGINE_METHOD_STORE":256,"ENGINE_METHOD_PKEY_METHS":512,"ENGINE_METHOD_PKEY_ASN1_METHS":1024,"ENGINE_METHOD_ALL":65535,"ENGINE_METHOD_NONE":0,"DH_CHECK_P_NOT_SAFE_PRIME":2,"DH_CHECK_P_NOT_PRIME":1,"DH_UNABLE_TO_CHECK_GENERATOR":4,"DH_NOT_SUITABLE_GENERATOR":8,"NPN_ENABLED":1,"RSA_PKCS1_PADDING":1,"RSA_SSLV23_PADDING":2,"RSA_NO_PADDING":3,"RSA_PKCS1_OAEP_PADDING":4,"RSA_X931_PADDING":5,"RSA_PKCS1_PSS_PADDING":6,"POINT_CONVERSION_COMPRESSED":2,"POINT_CONVERSION_UNCOMPRESSED":4,"POINT_CONVERSION_HYBRID":6,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_UDP_REUSEADDR":4}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const scale = 20; // scale units into pixels

// helper function to create an element in the dom and give it a class;

const createElement = (name, className) => {
    const element = document.createElement(name);
    if (className) element.className = className;
    return element;
};

class Display {
    constructor(parent, level) {
        this.wrapper = parent.appendChild(createElement('div', 'game')); // create wrapper for actual game (since screen will be slipping off)
        // this.wrapper = parent;

        this.level = level;

        // tracks element that holds actors so they can be removed/replaced
        this.actorLayer = null; // background and actor layers important for time save

        this.wrapper.appendChild(this.drawBackground());

        this.drawActors = this.drawActors.bind(this);
    }

    // drawn once
    drawBackground() {
        const table = createElement('table', 'background');
        table.style.width = `${this.level.width * scale}px`; // sets specifc style, doesn't change other inline styles

        // iterate over each row of the previously built out grid (full of just words)
        this.level.rows.forEach(row => {

            // create row to append to the parent table
            const rowElement = table.appendChild(createElement('tr'));

            rowElement.style.height = `${scale}px`;

            row.forEach(fieldType => {
                // append individual tiles onto row
                rowElement.appendChild(createElement('td', fieldType));
            });
        });

        return table;
    }

    // drawn every time the display is updated with the given state
    drawActors(state) {
        const wrapper = createElement('div');

        const currPlayer = state.player;
        const currLevel = state.level.levelId;

        for (let actor of state.actors) {
            const currPlayerStatus = currPlayer === actor ? 'curr-player' : '';
            const currLevelStatus = currLevel === 1 ? 'finley-tut' : '';
            const el = wrapper.appendChild(createElement('div', `actor ${actor.constructor.name.toLowerCase()} ${currPlayerStatus} ${currLevelStatus}`)); // actor.constructor.name finds the name of the class of the actor
            el.style.width = `${actor.size.x * scale}px`;
            el.style.height = `${actor.size.y * scale}px`;
            el.style.left = `${actor.pos.x * scale}px`;
            el.style.top = `${actor.pos.y * scale}px`;
        }

        return wrapper;
    }

    drawFrame(state) {
        if (this.actorLayer) this.actorLayer.remove();
        this.actorLayer = this.drawActors(state);
        this.wrapper.appendChild(this.actorLayer);
        this.wrapper.className = `game ${state.status}`;
        this.scrollPlayerIntoView(state);
    }

    scrollPlayerIntoView(state) {
        const width = this.wrapper.clientWidth; // takes width of game div
        const height = this.wrapper.clientHeight;
        const margin = width / 3; // it bugs out if I try too hard to make it centered???

        const left = this.wrapper.scrollLeft;
        const right = left + width;
        const top = this.wrapper.scrollTop;
        const bottom = top + height;

        const player = state.player;
        const center = player.pos.plus(player.size.times(0.5)).times(scale); // to find the player's center, we add the position + half the size


        // if we set scrollLeft or scrollTop to negative number, it will re-center to 0
        // margin creates a "neutral" area to not force player into the center
        if (center.x < left + margin) {
            this.wrapper.scrollLeft = center.x - margin;
        } else if (center.x > right - margin) {
            this.wrapper.scrollLeft = center.x + margin - width;
        }

        if (center.y < top + margin) {
            this.wrapper.scrollTop = center.y - margin;
        } else if (center.y > bottom - margin) {
            this.wrapper.scrollTop = center.y + margin - height;
        }
    }

    clear(text, stateStatus) {
        // odd syntax to remove the wrapper because htmlelements are weird! DOESN'T WORK
        this.wrapper.parentNode.removeChild(this.wrapper);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Display);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levelMaps = [['                                                                          ', '                                                          ', '               z        r       o      e   ', '                                           ', '                                           ', '                                           ', '                                           ', '                                           ', '               Z        @       O      E   ', '           xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '                                           ', '                                           ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '                                                        ', '               xxxxxxxxxxxxxxxxxxxxxx                                ', '               x   0                x                  ', '               x                    x                   ', '               x                    x                   ', '               x       i            x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    x                   ', '               x                    xxxxxxxxxxxxxxxxxx                   ', '               x                                     x                   ', '               x                                     x                   ', '               x                                     x                   ', '               x                                     x                    ', '               x                                     x   ', '               x                           !         x   ', '               xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ', '                       ', '       1               ', '                       ', '                       ', '                       ', '                       '], ['                                                                         ', '                                                          ', '               z        r       o      e   ', '                                           ', '                                           ', '                                           ', '                                           ', '                                           ', '               Z        @       O      E   ', '           xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '                                           ', '                                           ', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xx  2                                                                xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx       i                                                        !  xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                                                                   xxx', 'xx                     xxxxx       xxx                xxx            xxx', 'xx                     xxxxx                                         xxx', 'xx                     xxxxx                                         xxx', 'xx                 xxxxxxxxx                                         xxx', 'xxxxxx             xxxxxxxxx                                         xxx', 'xxxxxx             xxxxxxxxx                                         xxx', 'xxxxxx             xxxxxxxxx                                         xxx', 'xxxxxx             xxxxxxxxx                                         xxx', 'xxxxxx             xxxxxxxxx                                         xxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'], ['xxxxxxxxxxxxxx        z        r       o      e    xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx        Z        @       O      E    xxxxxxxxxx', 'xxxxxxxxxxxxxx    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx          h                          xxxxxxxxxx', 'xxxxxxxxxxxxxx     h          h          h         xxxxxxxxxx', 'xxxxxxxxxxxxxx        h    h       h            h  xxxxxxxxxx', 'xxxxxxxxxxxxxx   h                      h          xxxxxxxxxx', 'xxxxxxxxxxxxxx           h     h    h              xxxxxxxxxx', 'xxxxxxxxxxxxxx     h             h         h   h   xxxxxxxxxx', 'xxxxxxxxxxxxxx              h        h             xxxxxxxxxx', 'xxxxxxxxxxxxxx    h   h         h        h         xxxxxxxxxx', 'xxxxxxxxxxxxxx      h         h    h          h    xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx          !                          xxxxxxxxxx', 'xxxxxxxxxxxx            xx                         xxxxxxxxxx', 'xxxxxxxxxxxx            xx                         xxxxxxxxxx', 'xxxxxxxxxxxx                                       xxxxxxxxxx', 'xxxxxxxxxxxx                                       xxxxxxxxxx', 'xxxxxxxxxxxxxx                                       xxxxxxxx', 'xxxxxxxxxxxxxx                                       xxxxxxxx', 'xxxxxxxxxxxxxx                           xx          xxxxxxxx', 'xxxxxxxxxxxxxx  xx                       xx          xxxxxxxx', 'xxxxxxxxxxxxxx  xx               xx                  xxxxxxxx', 'xxxxxxxxxxxxxx                   xx                xxxxxxxxxx', 'xxxxxxxxxxxxxx       xx                            xxxxxxxxxx', 'xxxxxxxxxxxxxx       xx                            xxxxxxxxxx', 'xxxxxxxxxxxxxx                                 xxxxxxxxxxxxxx', 'xxxxxxxxxxxxxx                                 xxxxxxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                      xx             xxxxxxxxxx', 'xxxxxxxxxxxxxx                      xx             xxxxxxxxxx', 'xxxxxxxxxxxxxx              xx                     xxxxxxxxxx', 'xxxxxxxxxxxxxx              xx                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx    xx                               xxxxxxxxxx', 'xxxxxxxxxxxxxx    xx                               xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx            xx           xx          xxxxxxxxxx', 'xxxxxxxxxxxxxx            xx           xx          xxxxxxxxxx', 'xxxxxxxxxxxxxx                                     xxxxxxxxxx', 'xxxxxxxxxxxxxx                          i        xxxxxxxxxxxx', 'xxxxxxxxxxxxxx                                   xxxxxxxxxxxx', 'xxxxxxxxxxxxxx                                   xxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'], ['                                             ', '                                              ', '               z               o      e     ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '               Z               O      E     ', '           xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '         3                   4              ', '                                            ', '     i                              r       ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '                                            ', '         @                      !           ', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'], ['                                                                               ', '                                                                                ', '               z               o      e                                       ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '               Z               O      E                                       ', '           xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx                                   ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                                                                              ', '                 @                                                             ', '                                                                              ', '                                                                              ', '                                                                             ', '                                                                              ', '             i                                                                        ', '                                                                              ', '                                                                              ', '             xxxxxxx! xxxxxxxxxxx                                                                      ', 'xxx          xxxxxxxxxxxxxxxxxxxx                                             ', 'xxx                             x                                                 ', 'xxxxx                           x                                                 ', 'xxxxx                           x                                                 ', 'xxxxxxx                         x                 r                                ', 'xxxxxxx                         x                                                 ', 'x                               x                                                 ', 'x                               x                                                  ', 'x                               x                                                 ', 'x            xxxx               x                                               ', 'x            xxxx               x                                                 ', 'x                               x                                               ', 'x                               x                                           ', 'x                           xxxxx                                                 ', 'x                           xxxxx                                                 ', 'x                xx         xxxxx                                                 ', 'x                xx         xxxxx                                                 ', 'x              xxxx             x                                   ', 'x              xxxx             x                                    ', 'x              xxxx             x                                    ', 'x              xxxx             x                                    ', 'xxxxx                                                                              ', 'xxxxx                                                                               ', 'xxxxx                                                                              ', 'xxxxx                                                                             ', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'], ['                                             ', '                                             ', '               z             e              ', '                                             ', '                                             ', '                                             ', '                                             ', '                                             ', '               Z             E              ', '           xxxxxxxxxxxxxxxxxxxxxxxx          ', '                                             ', '                                             ', '                                             ', '                                             ', '                                             ', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxx5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x                                         o x', 'x                                           x', 'x    i         r                            x', 'x                                           x', 'x                                           x', 'x                                           x', 'x    O                               !  @   x', 'xxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '                                             ', '                                             ', '                                             ', '                                             ', '                                             ', '                                                                              '], ["                                                                ", "                      ", "                     ", " x                                x          x", " x                                x          x", " x                                x          x ", " x                                x          x         x", " x                               !x          x         x", " x                                x          x         x", " x   3                     4      x          x         x", " x                              xxx          x         x", " x i                              xxxxxxxxxxxx      r  x", " x                              @                      x", " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["                                                        ", " x                                                  x", " x                                                  x", " x                                                  x", " x                                                  x", " x                                                  x", " x                       ! @                        x", " x   5           xxxxxxxxxxxxxxxxxx                 x", " x               xxxxxxxxxxxxxxxxxx                 x", " x i          xxxxxxxxxxxxxxxxxxxxxxxx           r  x", " x            xxxxxxxxxxxxxxxxxxxxxxxx              x", " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["x                                                                                                      ", "x             x                                          ", "x             x                                                                                  ", "x             x                                                                                    ", "x             x                                                                                  ", "x             x                                                                       xxxxxxxxxxxxxxx              ", "x             x                                                                       x             x           ", "x             x                                                                       x   !   @     x      ", "x             x      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx              xxxxxxxxxxxxxxxxx             x      ", "x             x      x                                 x              x                             x ", "x             x      x                      7          x              x                             x  ", "x             x      x                                 x              x                             x   ", "x             x      x                                 x              x                   t   t     x   ", "x             x      x       xxxxxxxxxxxxxxxxxxx       x              x ggggg xxxxxxxxxxxxxxxxxxxxxxx     ", "x             x      x ggggg x                 x       x              x ggggg x      ", "x             x      x ggggg x                 x       x              x ggggg x", "x             x      x ggggg x                 x       x              x ggggg x", "x             x      x ggggg x                 x       x              x ggggg x ", "x             xxxxxxxx ggggg x                 x       xxxxxxxxxxxxxxxx ggggg x", "x                      ggggg x                 x                        ggggg x                                       x", "x   i  r         6     ggggg x                 x                        ggggg x", "x                            x                 x                        ggggg x", "x                            x                 x                        ggggg x", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx                 x                        ggggg x", "                                               x                        ggggg x", "                                               x                        ggggg x", "                                               x                        ggggg x", "                                               x                        ggggg x", "                                               x                        ggggg x", "                                               xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["                                                                             ", " x                                                                  x        x", " x                                                                  x         x", " x   8                                                              x         x", " x                                                                  x        x", " x   i    r                                                         x            x", " x                                                                  x        x", " xxxxxxxxxxxxx           xxx             xxx                    ! @ x                    x", " xxxxxxxxxxxxx                                              xxxxxxxxx                     x", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx                   x", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx", " xxxxxxxxxxxxxwwwwwwwwwwwww9wwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx", " xxxxxxxxxxxxxppppppppppppppppppppppppppppppppppppppppppxxxxxxxxxxxxx", " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["x             x                                            ", "x    i    r   x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "xp  ppppppppppx", "x             x", "x   ~         x", "x             x          #", "x             xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "x                |   v   |   v   |   v  =|   |   v =   x", "x                  v   v    v   v   v  =v   |   v   =  x", "x     !                                            @   x", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["                                                                                             r  ", " x                                                                                        x  @ x", " x                                                                                        xxxxxx", " x                                                               x", " x               x                                x              x", " x                              x                          x     x", " x           x                            x                      x", " x                      x                            x           x", " x                                           x                   x", " x               $                  x                            x", " x                            x                           x      x", " x i                                                             x", " x                                                           !   x", " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["                                                           r  ", " x                                     x                x  @ x", " x                                     x                xxxxxx", " x                                     x", " x              xhh ! hhx              x", " x             xhhhh hhhhx     t       x", " x             xhhhhhhhhhx             x", " x             xxhhhhhhhxx             x", " x              xxhhhhhxx              x", " x   %           xxhhhxx    t          x", " x                xxhxx                x", " x i               xxx                 x", " x                                     x", " x                             t       x", " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["                                                                          r      ", " x                                                                  x     @     x", " x                                                                  x   xxxxxxxxx         x", " x   ^                                                              x         x", " x                                                                  x        x", " x   i                                                              x            x", " x                                                                  x        x", " xxxxxxxxxxxxx           xxx             xxx                    !   x                    x", " xxxxxxxxxxxxx                                              xxxxxxxxx                     x", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx                   x", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx", " xxxxxxxxxxxxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxx", " xxxxxxxxxxxxxppppppppppppppppppppppppppppppppppppppppppxxxxxxxxxxxxx", " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], ["xxxxxxxxxxxxxxxxxx                                                       ", "x                x                                          ", "x      !         x                                         ", "x                x                               r         ", "x                x                               @          ", "x                x                                         ", "x                x", "x                x                                          ", "x                x                                        ", "x                x", "x                x", "x                x", "x                x", "x   i    &       x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                x", "x                xxxxxxxxxxxxxxxx", "x               *               x", "x                               x", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"], [" )                                                      @ ", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "x                                         x", "x                                      !  x", "x             xxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x             x", "x    i    r   x", "x (           x", "xxxxxxxxxxxxxxx"]];

/* harmony default export */ __webpack_exports__["a"] = (levelMaps);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(2);



const wobbleSpeed = .5,
      wobbleDist = 5;
class Platform {
    constructor(pos, ch, basePos, size, wobble) {
        this.pos = pos;
        this.ch = ch;
        this.basePos = basePos || pos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0));
        this.size = size || new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](10, 1.5);
        this.wobble = wobble || 0;
    }

    collide(state) {
        return;
    }

    update(time, state) {
        let wobble = this.wobble + time * wobbleSpeed;
        let wobblePos = Math.sin(wobble) * wobbleDist;
        return new Platform(this.basePos.plus(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, wobblePos)), this.ch, this.basePos, this.size, wobble);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Platform);

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map