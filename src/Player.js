function Player(gameState) {
  this.gameState = gameState;
  this.x = 0;  // in game units
  this.y = 0;  // in game units
  this.rotation = 0;  // in radians
  this.rotationSpeed = 0.035;  // in radians per frame
  this.movementSpeed = 0.02;  // in game units per frame
  this.brickPositions = [
    {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
    {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
    {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
    {x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
  ];
  this.absoluteBrickCenterPositions = [];
  this.relativeCenterOfMass = {x: 1.5, y: 1.5}
}

Player.prototype.update = function() {
  if (KEYS[37]) {
    // left arrow
    this.rotation -= this.rotationSpeed;
  }
  if (KEYS[39]) {
    // right arrow
    this.rotation += this.rotationSpeed;
  }

  if (KEYS[87]) {
    // w
    this.y -= this.movementSpeed;
  }
  if (KEYS[65]) {
    // a
    this.x -= this.movementSpeed;
  }
  if (KEYS[83]) {
    // s
    this.y += this.movementSpeed;
  }
  if (KEYS[68]) {
    // d
    this.x += this.movementSpeed;
  }
  this.rotation = this.rotation.mod(Math.PI * 2);
  this.absoluteBrickCenterPositions = this.getBrickCenterPositions();
};

Player.prototype.render = function() {
  ctx.save();
  ctx.scale(GU, GU);
  ctx.translate(CENTER.x, CENTER.y);

  ctx.fillStyle = '#FF56B0';
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

Player.prototype.getBrickCenterPositions = function() {
  const cosFactor = Math.cos(this.rotation);
  const sinFactor = Math.sin(this.rotation);

  let positions = [];
  for (let brickPosition of this.brickPositions) {
    const position = {
      x: this.x + (brickPosition.x - this.relativeCenterOfMass.x) * BRICK_SIZE * cosFactor - (brickPosition.y - this.relativeCenterOfMass.y) * BRICK_SIZE * sinFactor,
      y: this.y + (brickPosition.x - this.relativeCenterOfMass.x) * BRICK_SIZE * sinFactor + (brickPosition.y - this.relativeCenterOfMass.y) * BRICK_SIZE * cosFactor,
    };
    positions.push(position);
  }
  return positions
};
