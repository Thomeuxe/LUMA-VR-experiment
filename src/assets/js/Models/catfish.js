var dbg = require('debug')('luma:catfish');
var Animal = require('./animal.js');

var Catfish = _.assign({
  type: 'catfish',

  create: function(scene, listener) {
    this.mesh = this.asset.clone();
    this.setName(this.type);
    dbg('create catfish ' + this.name);

    this.mesh.animations = this.asset.animations;

    this.initPosition();

    this.goForward();

    scene.add(this.mesh);

    this.initCollider();
    this.initAnimation(this.mesh);
    this.initAudio('assets/sounds/fish_noise.mp3', listener);

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
    mesh.scale.set( 4, 4, 4 );
    this.asset = mesh;
    cb();
  },

  initAnimation: function (object) {
    this.mixer = new THREE.AnimationMixer(this.mesh);

    this.action = this.mixer.clipAction( object.geometry.animations[ 0 ] );
    this.action.play();
  },
}, Animal);

module.exports = Catfish;