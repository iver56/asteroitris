const bricks = [
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}],
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}],
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 1}],
  [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}],
  [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}],
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}],
];
const bombBrick = [{x: 0, y: 0}];

function rotateBrick(brickPositions, angle) {
  const cosFactor = Math.cos(angle);
  const sinFactor = Math.sin(angle);

  let rotatedBrickPositions = [];

  for (let brickPosition of brickPositions) {
    const position = {
      x: Math.round(brickPosition.x * cosFactor - brickPosition.y * sinFactor) | 0,
      y: Math.round(brickPosition.x * sinFactor + brickPosition.y * cosFactor) | 0,
    };
    rotatedBrickPositions.push(position);
  }
  return rotatedBrickPositions;
}


function Brick(gameState, brickPositions, x, y, dx, dy, rotation, isBomb) {
  this.gameState = gameState;
  this.brickPositions = brickPositions;
  this.x = x;  // in game units
  this.y = y;  // in game units
  this.dx = dx;
  this.dy = dy;
  this.speedFactor = 0.018;
  this.rotation = rotation;  // in radians
  this.state = 'floating';  // or 'snapping'
  this.absoluteBrickCenterPositions = [];
  this.isBomb = isBomb;
}

Brick.prototype.update = function() {
  if (this.state === 'floating') {
    this.x += this.dx * this.speedFactor;
    this.y += this.dy * this.speedFactor;
  } else if (this.state === 'snapping') {

  }
  this.absoluteBrickCenterPositions = this.getBrickCenterPositions();
};

Brick.prototype.render = function() {
  ctx.save();
  ctx.scale(GU, GU);
  ctx.translate(CENTER.x, CENTER.y);

  if (this.isBomb) {
    const red = 255;
    const greenAndBlue = 0 | (127 + 120 * Math.sin(this.gameState.t * 5));
    ctx.fillStyle = `rgb(${red},${greenAndBlue},${greenAndBlue})`;
  } else {
    ctx.fillStyle = '#9BC4EF';
  }
  ctx.strokeStyle = '#7A7A7A';
  ctx.lineWidth = 0.03;

  for (let brickPosition of this.absoluteBrickCenterPositions) {
    ctx.save();
    ctx.translate(brickPosition.x, brickPosition.y);
    ctx.rotate(this.rotation);
    ctx.fillRect(
      -0.5 * BRICK_SIZE,
      -0.5 * BRICK_SIZE,
      BRICK_SIZE,
      BRICK_SIZE
    );
    ctx.strokeRect(
      -0.5 * BRICK_SIZE,
      -0.5 * BRICK_SIZE,
      BRICK_SIZE,
      BRICK_SIZE
    );
    ctx.restore();
  }

  ctx.restore();
};

Brick.prototype.getBrickCenterPositions = function() {
  const cosFactor = Math.cos(this.rotation);
  const sinFactor = Math.sin(this.rotation);

  let positions = [];
  for (let brickPosition of this.brickPositions) {
    const position = {
      x: this.x + (brickPosition.x + 0.5) * BRICK_SIZE * cosFactor - (brickPosition.y + 0.5) * BRICK_SIZE * sinFactor,
      y: this.y + (brickPosition.x + 0.5) * BRICK_SIZE * sinFactor + (brickPosition.y + 0.5) * BRICK_SIZE * cosFactor,
    };
    positions.push(position);
  }
  return positions
};

function spawnBrick(gameState) {
  const isBomb = Math.random() < 0.25;
  const brickIndex = (Math.random() * bricks.length) | 0;
  const brick = isBomb ? bombBrick : bricks[brickIndex];
  const angle = Math.random() * Math.PI * 2;
  const reverseAngle = angle + Math.PI;
  const dx = Math.cos(reverseAngle);
  const dy = Math.sin(reverseAngle);
  const x = (8 + BRICK_SIZE) * Math.cos(angle);
  const y = (8 + BRICK_SIZE) * Math.sin(angle);
  const rotationIndex = (Math.random() * 4) | 0;
  const rotation = (angle + rotationIndex * Math.PI / 2) % (Math.PI * 2);
  return new Brick(gameState, brick, x, y, dx, dy, rotation, isBomb);
}
