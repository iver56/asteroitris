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
  var that = this;
  this.elements = [
    [function() {
      mm.audioButton.toggleActivated();
    }, {x: 15, y: 0, w: 1, h: 1}]
  ];
  this.player = new Player();
};

GameState.prototype.render = function(ctx) {
  ctx.save();
  ctx.translate(8 * GU, 4.5 * GU);

  if (KEYS[9]) { //TAB
    ctx.fillStyle = 'red';
    ctx.fillRect(-GU / 2, -GU / 2, GU, GU)
  }

  ctx.restore();

  mm.audioButton.render();
};

GameState.prototype.update = function() {
  var that = this;
};

GameState.prototype.playSound = function(soundName) {
  createjs.Sound.play(soundName);
};
