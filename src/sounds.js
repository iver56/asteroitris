var sounds = {
  byName: {
    'fx1.ogg': '0',
    'game_over.ogg': '1',
    'fx6.ogg': '2',
  },
  byId: {}
};
for (var soundName in sounds.byName) {
  if (sounds.byName.hasOwnProperty(soundName)) {
    sounds.byId[sounds.byName[soundName]] = soundName;
  }
}
module.exports = SOUNDS = sounds;
