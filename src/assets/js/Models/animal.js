var Animal = {

  assetsLoading: function(event, progressCb) {
    progressCb({
      key: this.type + 'Json',
      value: event.loaded / event.total
    })
  },

  update: function(instances, delta) {
    instances.forEach(function (instance) {
      if (instance.mixer) {
        instance.mixer.update(delta);
      }
    });
  },

  initPosition: function () {
    this.mesh.position.set(
      Math.random() * 1500,
      Math.random() * 10 + 1000,
      Math.random() * 1500);
  },

  initCollider: function () {
    var box = new THREE.Box3().setFromObject(this.mesh);
    var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius, 6, 6);
    this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
    this.mesh.add(this.meshCollider);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.meshCollider.targetable = true;
  },

  initAudio: function (filePath, listener) {
    this.audio = new THREE.PositionalAudio( listener );
    this.audio.load( filePath );
    this.audio.setRefDistance( 4 );
    this.audio.setLoop(true);
    this.audio.autoplay = true;
    this.audio.setVolume(3);
    this.mesh.add( this.audio );
  },

  setName: function (name) {
    this.name = name.charAt(0).toUpperCase() + name.slice(1);
    this.mesh.name = this.name;
  }
};

module.exports = Animal;