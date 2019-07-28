MUSIC_VOLUME = 0.55;

function MusicManager() {
  this.audioButton = new AudioButton();
  this.music = new Audio();
  this.loaded = false;
  var that = this;
  loaded++;
  this.music.addEventListener("loadeddata", function() {
    that.loaded || loaded--;
    that.loaded = true;
  });
  this.music.addEventListener("canplay", function() {
    that.loaded || loaded--;
    that.loaded = true;
  });
  this.music.volume = MUSIC_VOLUME;
  this.music.src = "res/music.ogg";
  this.music.loop = true;
  this.state = "menu";

  document.body.appendChild(this.music);
}

MusicManager.prototype.changeState = function(state) {
  this.state = state;
  if (state === 'game') {
    this.music.play();
  }
};

MusicManager.prototype.update = function() {

};

