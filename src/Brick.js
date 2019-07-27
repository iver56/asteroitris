const bricks = [
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}],
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}],
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 1}],
  [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}],
  [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}],
  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}],
];


function Brick(brickPositions, x, y, dx, dy, rotation) {
  this.brickPositions = brickPositions;
  this.x = x;  // in game units
  this.y = y;  // in game units
  this.dx = dx;
  this.dy = dy;
  this.speedFactor = 0.04;
  this.rotation = rotation;  // in radians
}

Brick.prototype.update = function() {
  this.x += this.dx * this.speedFactor;
  this.y += this.dy * this.speedFactor;
};

Brick.prototype.render = function() {
  ctx.save();
  ctx.translate(CENTER.x * GU + this.x * GU, CENTER.y * GU + this.y * GU);
  ctx.scale(GU, GU);
  ctx.rotate(this.rotation);

  ctx.fillStyle = '#9BC4EF';
  ctx.strokeStyle = '#7A7A7A';
  ctx.lineWidth = 0.0003 * GU;
  for (let brickPosition of this.brickPositions) {
    ctx.fillRect(
      brickPosition.x * BRICK_SIZE - BRICK_SIZE / 2,
      brickPosition.y * BRICK_SIZE - BRICK_SIZE / 2,
      BRICK_SIZE,
      BRICK_SIZE
    );
    ctx.strokeRect(
      brickPosition.x * BRICK_SIZE - BRICK_SIZE / 2,
      brickPosition.y * BRICK_SIZE - BRICK_SIZE / 2,
      BRICK_SIZE,
      BRICK_SIZE
    );
  }
  ctx.restore();
};

function spawnBrick() {
  const brickIndex = (Math.random() * bricks.length) | 0;
  const brick = bricks[brickIndex];
  const angle = Math.random() * Math.PI * 2;
  const reverseAngle = angle + Math.PI;
  const dx = Math.cos(reverseAngle);
  const dy = Math.sin(reverseAngle);
  const x = (8 + BRICK_SIZE) * Math.cos(angle);
  const y = (8 + BRICK_SIZE) * Math.sin(angle);
  const rotationIndex = (Math.random() * 4) | 0;
  const rotation = (angle + rotationIndex * Math.PI / 2) % (Math.PI * 2);
  return new Brick(brick, x, y, dx, dy, rotation);
}
