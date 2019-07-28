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
  this.isGameOver = false;
};

GameState.prototype.render = function(ctx) {
  this.player.render();
  for (let brick of this.bricks) {
    brick.render();
  }

  mm.audioButton.render();
};

GameState.prototype.update = function() {
  if (this.isGameOver) {
    return;
  }
  this.t = +(new Date()) / 1000;

  this.spawnBricks();

  this.snapBricks();

  this.player.update();
  for (let brick of this.bricks) {
    brick.update();
  }
};

GameState.prototype.spawnBricks = function() {
  if (this.t >= this.timeOfNewBrickSpawn) {
    let brick = spawnBrick(this);
    this.bricks.push(brick);

    this.timeOfNewBrickSpawn = this.t + 4.5;
  }
};

GameState.prototype.snapBricks = function() {
  const playerBricks = this.player.absoluteBrickCenterPositions;
  const playerAngles = [
    this.player.rotation,
    this.player.rotation + Math.PI / 2,
    this.player.rotation + Math.PI,
    this.player.rotation + 1.5 * Math.PI
  ];

  let brickIndexesToRemove = [];

  for (let brickIndex = 0; brickIndex < this.bricks.length; brickIndex++) {
    let brick = this.bricks[brickIndex];
    if (brick.state === 'floating') {
      let shortestDistance = 999999;
      let shortestDistanceBrick = {x: 0, y: 0};
      let shortestDistanceBrickIndex = null;
      let shortestDistancePlayerBrick = {x: 0, y: 0};
      let shortestDistancePlayerBrickIndex = null;
      const brickBricks = brick.absoluteBrickCenterPositions;
      for (let i = 0; i < brickBricks.length; i++) {
        let brickBrick = brickBricks[i];
        for (let j = 0; j < playerBricks.length; j++) {
          let playerBrick = playerBricks[j];
          let distance = calculateEuclideanDistance(brickBrick, playerBrick);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestDistanceBrick = brickBrick;
            shortestDistanceBrickIndex = i;
            shortestDistancePlayerBrick = playerBrick;
            shortestDistancePlayerBrickIndex = j;
          }
        }
      }

      if (shortestDistance <= 1.44 * BRICK_SIZE) {
        brickIndexesToRemove.push(brickIndex);
        brick.state = 'snapping';
        brick.endOfSnapState = this.t + 0.5;

        // Snap angle
        let minAngleDifference = 99999;
        let bestAngle = null;
        for (let candidateAngle of playerAngles) {
          let angleDiff = calculateAngleDifference(brick.rotation, candidateAngle);
          if (angleDiff < minAngleDifference) {
            minAngleDifference = angleDiff;
            bestAngle = candidateAngle;
          }
        }
        brick.rotation = bestAngle;

        let updatedAbsoluteBrickPositions = brick.getBrickCenterPositions();
        let updatedShortestDistanceBrick = updatedAbsoluteBrickPositions[shortestDistanceBrickIndex];

        // Snap position
        let minDistance = 99999;
        let bestPosition = {x: 0, y: 0};
        let bestRelativeAngle = null;
        for (let i = 0; i < 4; i++) {
          let angle = this.player.rotation + i * Math.PI / 2;
          let candidatePosition = {
            x: shortestDistancePlayerBrick.x + BRICK_SIZE * Math.cos(angle),
            y: shortestDistancePlayerBrick.y + BRICK_SIZE * Math.sin(angle)
          };
          let distance = calculateEuclideanDistance(candidatePosition, shortestDistanceBrick);
          if (distance < minDistance) {
            minDistance = distance;
            bestPosition = candidatePosition;
            bestRelativeAngle = i * Math.PI / 2;
          }
        }

        const cosFactor = Math.cos(bestRelativeAngle);
        const sinFactor = Math.sin(bestRelativeAngle);
        let targetRelativeBrickPosition = {
          x: this.player.brickPositions[shortestDistancePlayerBrickIndex].x + Math.round(cosFactor) | 0,
          y: this.player.brickPositions[shortestDistancePlayerBrickIndex].y + Math.round(sinFactor) | 0,
        };

        let dx = bestPosition.x - updatedShortestDistanceBrick.x;
        let dy = bestPosition.y - updatedShortestDistanceBrick.y;
        brick.x += dx;
        brick.y += dy;

        let relativeBrickRotation = (brick.rotation - this.player.rotation).mod(Math.PI * 2);
        let rotatedBrickPositions = rotateBrick(brick.brickPositions, relativeBrickRotation);
        let brickBrickOffset = rotatedBrickPositions[shortestDistanceBrickIndex];

        // apply offset
        for (let rotatedBrickPosition of rotatedBrickPositions) {
          this.player.brickPositions.push(
            {
              x: targetRelativeBrickPosition.x + rotatedBrickPosition.x - brickBrickOffset.x,
              y: targetRelativeBrickPosition.y + rotatedBrickPosition.y - brickBrickOffset.y
            }
          )
        }

        // Play sound effect
        this.playSound('fx1.ogg')
      }
    }
  }

  // Remove bricks that have snapped into place
  for (let brickIndexToRemove of brickIndexesToRemove) {
    this.bricks.remove(brickIndexToRemove);
  }
};

GameState.prototype.playSound = function(soundName) {
  createjs.Sound.play(soundName);
};
