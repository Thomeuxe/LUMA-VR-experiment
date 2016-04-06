var dbg = require('debug')('luma:fish');

var Fish = {

  create: function(scene, listener, name) {
    dbg('create fish ' + name);
    this.name = name;
    this.mesh = this.asset.clone();
    this.mesh.animations = this.asset.animations;
    this.mesh.position.x = Math.random() * 100;
    this.mesh.position.y = Math.random() * 100;
    this.mesh.position.z = Math.random() * 100;
    this.mesh.name = name;

    scene.add(this.mesh);

    var box = new THREE.Box3().setFromObject(this.mesh);
    var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius, 6, 6);
    this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
    this.mesh.add(this.meshCollider);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.meshCollider.targetable = true;

    this.initAnimation(this.mesh);
    this.initAudio(listener);

    return this;
  },

  loadAssets: function(cb) {
      dbg('Load fish assets');
      var _self = this;
      var loader = new THREE.ObjectLoader();
      loader.load('assets/js/Models/skinned/fish.json', function(asset) {
          _self.assetsLoaded(asset, cb);
      }, function(){}, function() {
          dbg('Error: load fish assets');
      });
  },

  assetsLoaded: function(asset, cb) {
      dbg('fish assets loaded');
      this.asset = asset;
      cb();
  },

  update: function(instances, delta) {
    instances.forEach(function (instance) {
      if (instance.mixer) {
        instance.mixer.update(delta);
      }
    });
  },

  initAnimation: function (object) {
      this.mixer = new THREE.AnimationMixer(this.mesh);

      this.action = this.mixer.clipAction(object.animations[0]);
      this.action.play();
  },

  initAudio: function (listener) {
      this.audio = new THREE.PositionalAudio( listener );
      this.audio.load( 'assets/sounds/fish_noise.mp3' );
      this.audio.setRefDistance( 4 );
      this.audio.setLoop(true);
      this.audio.autoplay = true;
      this.audio.setVolume(3);
      this.mesh.add( this.audio );
  }
}

module.exports = Fish;