var dbg = require('debug')('luma:rockbass');
var Animal = require('./animal.js');

var Rockbass = _.assign({
  type: 'rockbass',

  create: function(scene, listener) {
    this.mesh = this.asset.clone();
    this.setName(this.type);
    dbg('create rockbass ' + this.name);

    this.mesh.animations = this.asset.animations;

    this.initPosition();

    scene.add(this.mesh);

    this.initCollider();
    this.initAnimation(this.mesh);
    this.initAudio('assets/sounds/fish_noise.mp3', listener);

    return this;
  },

  loadAssets: function(successCb, progressCb) {
    dbg('Load rockbass assets');
    var _self = this;
    var loader = new THREE.JSONLoader();
    loader.load('assets/js/Models/skinned/rockbass.json', function(geometry, materials) {
      _self.assetsLoaded(geometry, materials, successCb);
    }, function(event) {
      _self.assetsLoading(event, progressCb);
    }, function() {
      dbg('Error: load rockbass assets');
    });
  },

  assetsLoaded: function(geometry, materials, cb) {
    dbg('rockbass assets loaded');
    materials.forEach( function (material) {
      material.skinning = true;
    } );

    var mesh = new THREE.SkinnedMesh( geometry, materials[0] );
    mesh.scale.set( 2, 2, 2 );
    this.asset = mesh;
    cb();
  },

  initAnimation: function (object) {
    this.mixer = new THREE.AnimationMixer(this.mesh);

    this.action = this.mixer.clipAction( object.geometry.animations[ 0 ] );
    this.action.play();
  }
}, Animal);

module.exports = Rockbass;
