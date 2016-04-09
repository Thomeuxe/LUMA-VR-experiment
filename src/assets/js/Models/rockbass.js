var dbg = require('debug')('luma:rockbass');
var Animal = require('./animal.js');

var Rockbass = _.assign({
  type: 'rockbass',

  create: function(scene, listener, i) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create rockbass ' + that.name);

    this.initPosition(that);

    scene.add(that.mesh);

    this.goForward(that);

    this.initCollider(that);
    this.initAnimation(that);
    this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
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

  initAnimation: function (that) {
    that.mixer = new THREE.AnimationMixer(that.mesh);

    that.action = that.mixer.clipAction( that.mesh.geometry.animations[ 0 ] );
    that.action.play();
  }
}, Animal);

module.exports = Rockbass;
