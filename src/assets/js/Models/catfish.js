var dbg = require('debug')('luma:catfish');
var Animal = require('./animal.js');

var Catfish = _.assign({
  type: 'catfish',

  create: function(scene, listener) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create catfish ' + that.name);

    that.mesh.animations = this.asset.animations;

    this.initPosition(that);

    this.goForward(that);

    scene.add(that.mesh);

    this.initCollider(that);
    this.initAnimation(that);
    this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
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

  initAnimation: function (that) {
    that.mixer = new THREE.AnimationMixer(that.mesh);

    that.action = that.mixer.clipAction( that.mesh.geometry.animations[ 0 ] );
    that.action.play();
  }
}, Animal);

module.exports = Catfish;