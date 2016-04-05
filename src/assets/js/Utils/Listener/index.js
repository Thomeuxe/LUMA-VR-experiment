var Listener = {
  active: true,

  create: function(camera) {
    this.listener = new THREE.AudioListener();
    camera.add( this.listener );
    this.listener.setMasterVolume(this.active ? 1 : 0);
    return this.listener
  },

  toggle: function () {
    this.active = !this.active;
    this.listener.setMasterVolume(this.active ? 1 : 0);
  }
};

module.exports = Listener;