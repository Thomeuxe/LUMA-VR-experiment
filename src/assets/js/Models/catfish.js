var dbg = require('debug')('luma:fish');

var Catfish = {

  create: function(scene, listener, name) {
    dbg('create catfish ' + name);
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

  loadAssets: function(successCb, progressCb) {
    dbg('Load catfish assets');
    var _self = this;
    var loader = new THREE.JSONLoader();
    loader.load('assets/js/Models/skinned/catfish.json', function(geometry, materials) {
      _self.assetsLoaded(geometry, materials, successCb);
    }, function(event) {
      _self.assetsLoading(event, progressCb);
    }, function() {
      dbg('Error: load catfish assets');
    });
  },

  assetsLoaded: function(geometry, materials, cb) {
    dbg('catfish assets loaded');
    materials.forEach( function (material) {
      material.skinning = true;
    } );

    var mesh = new THREE.SkinnedMesh( geometry, materials[0] );
    mesh.scale.set( 2, 2, 2 );
    this.asset = mesh;
    cb();
  },

  assetsLoading: function(event, progressCb) {
    progressCb({
      key: 'catfishJson',
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

module.exports = Catfish;