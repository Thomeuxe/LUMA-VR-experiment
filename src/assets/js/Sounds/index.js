var Sounds = {
  create: function(listener) {
    this.listener = listener;

    this.initAtmosphere();
    this.initHeartBeats();

    return this;
  },
  initAtmosphere: function () {
    this.atmosphere = new THREE.Audio( this.listener );
    this.atmosphere.load( 'assets/sounds/atmosphere.mp3' );
    this.atmosphere.autoplay = true;
    this.atmosphere.setLoop(true);
    this.atmosphere.setVolume(0.5);
  },
  initHeartBeats: function () {
    this.heartBeats = new THREE.Audio( this.listener );
    this.heartBeats.load( 'assets/sounds/heart_beats.mp3' );
    this.heartBeats.autoplay = true;
    this.heartBeats.setLoop(true);
    this.heartBeats.setVolume(2);
  }
};

module.exports = Sounds;