function Player(gameState) {
  this.gameState = gameState;
  this.x = 0;  // in game units
  this.y = 0;  // in game units
  this.rotation = 0;  // in radians
  this.rotationSpeed = 0.035;  // in radians per frame
  this.movementSpeed = 2;  // in game units per frame
  this.brickPositions = [
    {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
    {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
    {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
    {x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
  ];
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
    this.x += this.movementSpeed;
  }
  this.rotation = this.rotation.mod(Math.PI * 2);
};

Player.prototype.render = function() {
  ctx.save();
  ctx.translate(CENTER.x * GU + this.x, CENTER.y * GU + this.y);
  ctx.scale(GU, GU);
  ctx.rotate(this.rotation);

  ctx.fillStyle = '#FF56B0';
  ctx.strokeStyle = '#7A7A7A';
  ctx.lineWidth = 0.0003 * GU;
  for (let brickPosition of this.brickPositions) {
    ctx.fillRect(
      brickPosition.x * BRICK_SIZE - 2 * BRICK_SIZE,
      brickPosition.y * BRICK_SIZE - 2 * BRICK_SIZE,
      BRICK_SIZE,
      BRICK_SIZE
    );
    ctx.strokeRect(
      brickPosition.x * BRICK_SIZE - 2 * BRICK_SIZE,
      brickPosition.y * BRICK_SIZE - 2 * BRICK_SIZE,
      BRICK_SIZE,
      BRICK_SIZE
    );
  }

  ctx.restore();
};
