const BRICK_SIZE = 0.25; // as factor of GU;

function GameState() {
}

GameState.prototype.init = function() {
  var soundPath = 'res/sounds/';
  for (var soundName in SOUNDS.byName) {
    if (SOUNDS.byName.hasOwnProperty(soundName)) {
      createjs.Sound.registerSound(soundPath + soundName, soundName);
    }
  }
};

GameState.prototype.pause = function() {
};

GameState.prototype.resume = function() {
  this.elements = [
    [function() {
      mm.audioButton.toggleActivated();
    }, {x: 15, y: 0, w: 1, h: 1}]
  ];
  this.player = new Player(this);
  this.bricks = [];
  this.initialT = +(new Date()) / 1000;
  this.timeOfNewBrickSpawn = this.initialT + 0.5;
};

GameState.prototype.render = function(ctx) {
  ctx.save();
  ctx.translate(CENTER.x * GU, CENTER.y * GU);
  ctx.restore();

  this.player.render();
  for (let brick of this.bricks) {
    brick.render();
  }

  mm.audioButton.render();
};

GameState.prototype.update = function() {
  this.t = +(new Date()) / 1000;

  this.spawnBricks();

  this.player.update();
  for (let brick of this.bricks) {
    brick.update();
  }
};

GameState.prototype.spawnBricks = function() {
  if (this.t >= this.timeOfNewBrickSpawn) {
    let brick = spawnBrick();
    this.bricks.push(brick);

    this.timeOfNewBrickSpawn = this.t + 3.5;
  }
};

GameState.prototype.playSound = function(soundName) {
  createjs.Sound.play(soundName);
};
