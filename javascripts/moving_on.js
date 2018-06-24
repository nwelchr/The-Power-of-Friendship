import Level from './level';
import Display from './display';
import levelMaps from './level_maps';
import State from './state';

const keyCodes = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
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
const levelSelectButton = document.querySelector('.level-select');
const instructionButton = document.querySelector('.instructions');
const controlsButton = document.querySelector('.controls');
const goBackButton = document.querySelector('.go-back');
const mainMenuButton = document.querySelector('.main-menu-btn');
const mainMenuButton2 = document.querySelector('.main-menu-btn-2');
const mainMenuPauseButton = document.querySelector('.main-menu-pause-btn');
const levelSelectorMenu = document.querySelector('.level-selector-menu');
const instructionsMenu = document.querySelector('.instructions-menu');
const controlsMenu = document.querySelector('.controls-menu');
const playInstructions = document.querySelector('.play-instructions');
const gameWrapper = document.getElementById('game-wrapper');

const instructions = [
  { text: 'Meet Finley, your new friend.', img: 'finley-1.png' },
  { text: '...along with a few others.', img: 'all-1.png' },
  {
    text: 'Hold the arrow keys to move.\nPress up to jump.',
    img: 'movement.gif'
  },
  {
    text: 'Press s to switch between\ndifferent characters.',
    img: 'switch.gif'
  },
  {
    text: 'Your objective?\nGet to your goal.',
    img: 'goal.gif'
  },
  {
    text: 'Help each other get to the goal!\nTeamwork is required.',
    img: 'teamwork.gif'
  }
];

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
    this.gameStarted = false;

    this.instructionsVisited = false;
    this.instructionsIdx = 0;

    this.trackKeys = this.trackKeys.bind(this);
    this.restartLevel = this.restartLevel.bind(this);
    this.startInstructions = this.startInstructions.bind(this);
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
    this.handleLevelClick = this.handleLevelClick.bind(this);
    this.loadLevels = this.loadLevels.bind(this);
    this.goBackToMainMenu = this.goBackToMainMenu.bind(this);
    this.goToMainMenu = this.goToMainMenu.bind(this);

    restartButton.addEventListener('click', this.restartLevel);
    startButton.addEventListener('click', this.startInstructions);
    levelSelectButton.addEventListener('click', this.loadLevels);
    instructionButton.addEventListener('click', this.loadInstructions);
    controlsButton.addEventListener('click', this.loadControls);
    goBackButton.addEventListener('click', this.goBackToPauseMenu);
    levelSelectorMenu.addEventListener('click', this.handleLevelClick);
    mainMenuButton.addEventListener('click', this.goBackToMainMenu);
    mainMenuButton2.addEventListener('click', this.goBackToMainMenu);
    mainMenuPauseButton.addEventListener('click', () =>
      this.goToMainMenu('pause')
    );
    pauseButton.addEventListener('click', this.togglePauseScreen);
    window.addEventListener('keydown', this.trackKeys);
    window.addEventListener('keyup', this.trackKeys);
  }

  startInstructions(e) {
    // reset idx if clicked start button;
    if (this.instructionsIdx === 0 && this.instructionsVisited) {
      this.start();
      return;
    }

    const goToNext = () => {
      switch (this.instructionsIdx) {
        case instructions.length - 1:
          this.instructionsIdx = 0;
          this.start();
          return;
        default:
          this.instructionsIdx += 1;
          clearAnimatedTimeout();
          this.startInstructions();
          return;
      }
    };

    this.animatedTimeout = null;

    const setAnimatedTimeout = imgLink => {
      this.animatedTimeout = setTimeout(function() {
        const animatedImgLink = imgLink.replace('1', '2');
        img.setAttribute(
          'src',
          `https://s3.us-east-2.amazonaws.com/power-of-friendship/${animatedImgLink}`
        );
      }, 1500);
    };

    const clearAnimatedTimeout = () => {
      clearTimeout(this.animatedTimeout);
      this.animatedTimeout = null;
    };

    const setButtonListener = () => {
      button.addEventListener('click', goToNext);
    };

    let button, h2, img, buttonText;
    if (this.instructionsIdx === 0) {
      playInstructions.classList.add('show');
      titleScreen.classList.remove('show');
    }

    if (!this.instructionsVisited) {
      this.instructionsVisited = true;
      // show screen

      // make h2
      h2 = document.createElement('h2');
      h2.innerText = instructions[this.instructionsIdx].text;

      // make img
      img = document.createElement('img');
      button = document.createElement('button');

      // append to page
      playInstructions.appendChild(h2);
      playInstructions.appendChild(img);
      playInstructions.appendChild(button);

      setButtonListener();
    } else {
      h2 = document.querySelector('.play-instructions h2');
      h2.innerText = instructions[this.instructionsIdx].text;
      img = document.querySelector('.play-instructions img');
      button = document.querySelector('.play-instructions button');
    }

    const imgLink = instructions[this.instructionsIdx].img;
    img.setAttribute(
      'src',
      `https://s3.us-east-2.amazonaws.com/power-of-friendship/${imgLink}`
    );

    if (imgLink.substring(imgLink.length - 3) === 'png') {
      setAnimatedTimeout(imgLink);
    }

    buttonText =
      this.instructionsIdx === instructions.length - 1 ? 'Play' : 'Next';
    button.innerText = buttonText;
  }

  loadLevels(e) {
    levelSelectorMenu.classList.add('show');
    titleScreen.classList.remove('show');
  }

  loadInstructions(e) {
    instructionsMenu.classList.add('show');
    titleScreen.classList.remove('show');
  }

  loadControls(e) {
    controlsMenu.classList.add('show');
    pauseModal.classList.remove('show');
  }

  goBackToPauseMenu(e) {
    controlsMenu.classList.remove('show');
    pauseModal.classList.add('show');
  }

  handleLevelClick(e) {
    if (e.target.className === 'level-btn') {
      this.levelId =
        e.target.innerHTML === 'Final' ? 10 : parseInt(e.target.innerHTML) - 1;
      levelSelectorMenu.classList.remove('show');
      this.start();
    }
  }

  goBackToMainMenu(e) {
    levelSelectorMenu.classList.remove('show');
    instructionsMenu.classList.remove('show');
    titleScreen.classList.add('show');
  }

  goToMainMenu(from) {
    if (from === 'pause') {
      this.statusFunction('lost');
      this.display.clear();
      const game = document.querySelector('.game');
      game.remove();
    } else if (from === 'win') {
      startButton.innerHTML = 'Play Again';
      gameWrapper.classList.add('won');
    }
    audio.pause();
    audio.currentTime = 0;
    this.musicIsPlaying = false;
    this.gameIsRunning = true;
    this.keys = Object.create(null);
    this.levelId = 0;
    this.display = {};
    this.state = {};
    this.ending = 0;
    this.lastTime = 0;
    this.gameStarted = false;
    pauseModal.classList.remove('show');
    titleScreen.classList.add('show');
  }

  togglePauseScreen(e) {
    if (!this.gameStarted) return;

    this.gameIsRunning = !this.gameIsRunning;

    // toggle music
    this.musicIsPlaying = !this.musicIsPlaying;
    this.musicIsPlaying ? audio.play() : audio.pause();

    pauseModal.classList.toggle('show');

    if (this.gameIsRunning) {
      requestAnimationFrame(this.frame);
    }
  }

  trackKeys(e) {
    if (!e) return;
    if (controlsMenu.classList.contains('show')) return;
    if (e.keyCode === 27 && e.type === 'keydown') {
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
    this.gameStarted = true;
    this.musicIsPlaying = true;
    audio.play();

    titleScreen.classList.remove('show');
    playInstructions.classList.remove('show');
    this.startLevel();
  }

  startLevel() {
    this.runLevel(new Level(levelMaps[this.levelId], this.levelId + 1));
  }

  statusFunction(status) {
    if (status.includes('lost')) {
      this.startLevel();
    } else if (this.levelId < levelMaps.length - 1) {
      this.levelId += 1;
      this.startLevel();
    } else {
      this.goToMainMenu('win');
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
      this.display.clear();
      this.statusFunction(this.state.status);
      return false;
    }
  }

  runLevel(level) {
    this.display = new Display(gameWrapper, level);
    this.state = State.start(level);
    this.ending = 1;

    // Rotate on the 10th level after 10 seconds
    // if (level.levelId === 10) setTimeout(this.rotateLevel10, 10000);
    // else if (gameWrapper.classList.contains('rotated')) {
    //     gameWrapper.classList.remove('rotated');
    // }

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

    this.togglePauseScreen();
    this.state.status = 'lost';
  }
}

const game = new Game();
