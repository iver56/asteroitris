function MusicManager() {
  this.audioButton = new AudioButton();
  this.music = new Audio();
  this.loaded = false;
  var that = this;
  loaded++;
  this.music.addEventListener("loadeddata", function() {
    that.loaded || loaded--;
    that.loaded = true;
    this.play()
  });
  this.music.addEventListener("canplay", function() {
    that.loaded || loaded--;
    that.loaded = true;
    this.play()
  });
  this.music.volume = 0.95;
  this.music.src = "res/music.ogg";
  this.state = "menu";
  this.musictimes = {
    menustart: 0,
    menuend: 70,
    menulength: 70,
    gamestart: 0,
    gameend: 70,
    gamelength: 70
  };
  document.body.appendChild(this.music);
}

MusicManager.prototype.changeState = function(state) {
  this.state = state;
};

MusicManager.prototype.update = function() {
  if (this.loaded) {
    if (this.state == "menu" && this.music.currentTime > this.musictimes.menuend) {
      this.music.currentTime -= this.musictimes.menulength;
    } else if (this.state == "game" && this.music.currentTime < this.musictimes.gamestart) {
      this.music.currentTime = this.musictimes.gamestart;
    } else if (this.music.currentTime > this.musictimes.gameend) {
      this.music.currentTime -= this.musictimes.gamelength;
    }
  }
};

