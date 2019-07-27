const BRICK_SIZE = 0.37; // as factor of GU;

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
  this.timeOfNewBrickSpawn = this.initialT;
};

GameState.prototype.render = function(ctx) {
  this.player.render();
  for (let brick of this.bricks) {
    brick.render();
  }

  mm.audioButton.render();

  this.snapBricks(); // TODO: Move to update!
};

GameState.prototype.update = function() {
  this.t = +(new Date()) / 1000;

  this.spawnBricks();

  // this.snapBricks();

  this.player.update();
  for (let brick of this.bricks) {
    brick.update();
  }
};

GameState.prototype.spawnBricks = function() {
  if (this.t >= this.timeOfNewBrickSpawn) {
    let brick = spawnBrick(this);
    this.bricks.push(brick);

    this.timeOfNewBrickSpawn = this.t + 3.5;
  }
};

GameState.prototype.snapBricks = function() {
  const playerBricks = this.player.absoluteBrickCenterPositions;

  for (let brick of this.bricks) {
    if (brick.state !== 'floating') {
      continue;
    }
    let shortestDistance = 999999;
    let shortestDistanceBrick = {x: 0, y: 0};
    const brickBricks = brick.getBrickCenterPositions();
    for (let brickBrick of brickBricks) {
      for (let playerBrick of playerBricks) {
        let distance = euclideanDistance(brickBrick, playerBrick);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          shortestDistanceBrick = brickBrick;
        }
      }
    }

    if (shortestDistance <= 1.5 * BRICK_SIZE) {
      brick.state = 'snapping';
      console.log('close!')
      ctx.save();
      ctx.scale(GU, GU);
      ctx.translate(CENTER.x, CENTER.y);
      ctx.fillStyle = 'pink';
      ctx.fillRect(shortestDistanceBrick.x, shortestDistanceBrick.y, 0.05, 0.05)

      ctx.restore();
    }
  }
};

GameState.prototype.playSound = function(soundName) {
  createjs.Sound.play(soundName);
};
