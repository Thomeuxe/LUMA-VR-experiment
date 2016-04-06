var dbg = require('debug')('luma:jellyfish');

var Jellyfish = {

  create: function(scene, listener, name) {
    this.name = name;
    this.mesh = this.asset.clone();
    this.mesh.position.set( Math.random() * 1500,  Math.random() * 10 + 1000,  Math.random() * 1500);
    dbg('create jellyfish ' + name + ' at position [' + this.mesh.position.x + ', ' + this.mesh.position.y + ', ' + this.mesh.position.z + ']' );

    this.mesh.name = name;

    scene.add(this.mesh);

    var box = new THREE.Box3().setFromObject(this.mesh);
    var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius * 0.7, 6, 6);
    this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
    this.mesh.add(this.meshCollider);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.meshCollider.targetable = true;

    //this.initAnimation(this.mesh);
    this.initAudio(listener);

    return this;
  },

  loadAssets: function(successCb, progressCb) {
    dbg('Load jellyfish assets');
    var _self = this;
    var loader = new THREE.JSONLoader();
    loader.load('assets/js/Models/skinned/jellyfish.json', function(geometry, materials) {
      _self.assetsLoaded(geometry, materials, successCb);
    }, function(event) {
      _self.assetsLoading(event, progressCb);
    }, function() {
      dbg('Error: load jellyfish assets');
    });
  },

  assetsLoaded: function(geometry, materials, cb) {
    dbg('jellyfish assets loaded');

    var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0x431655, transparent: true, opacity: 0.35}) );
    mesh.scale.set( 2, 2, 2 );
    this.asset = mesh;
    cb();
  },

  assetsLoading: function(event, progressCb) {
    progressCb({
      key: 'jellyfishJson',
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

  initAnimation: function (object) {
    this.mixer = new THREE.AnimationMixer(this.mesh);

    this.action = this.mixer.clipAction( object.geometry.animations[ 0 ] );
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
};

module.exports = Jellyfish;