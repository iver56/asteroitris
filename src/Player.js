function Player(gameState) {
  this.gameState = gameState;
  this.x = 0;  // in game units
  this.y = 0;  // in game units
  this.rotation = 0;  // in radians
  this.rotationSpeed = 0.035;  // in radians per frame
  this.movementSpeed = 2;  // in game units per frame
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
  ctx.translate(8 * GU + this.x, 4.5 * GU + this.y);
  ctx.rotate(this.rotation);

  ctx.fillStyle = 'red';
  ctx.fillRect(-GU / 2, -GU / 2, GU, GU);

  ctx.restore();
};
