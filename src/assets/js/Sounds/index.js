var Sounds = {
  create: function(listener) {
    this.listener = listener;

    this.initAmbientSound();

    return this;
  },
  initAmbientSound: function () {
    this.ambient = new THREE.Audio( this.listener );
    this.ambient.load( 'assets/sounds/ninjatracks-oneforall.mp3' );
    this.ambient.autoplay = true;
    this.ambient.setLoop(true);
    this.ambient.setVolume(0.5);
  }
};

module.exports = Sounds;