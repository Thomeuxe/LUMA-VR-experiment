var Listener = {
  create: function(camera) {
    this.listener = new THREE.AudioListener();
    camera.add( this.listener );
    return this.listener
  }
};

module.exports = Listener;