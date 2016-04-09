var dbg = require('debug')('luma:fish');
var Animal = require('./animal.js');

var Fish = _.assign({
  type: 'fish',

  create: function (scene, listener) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create fish ' + that.name);

    that.mesh.animations = this.asset.animations;

    this.initPosition(that);

    scene.add(that.mesh);

    this.goForward(that);

    this.initCollider(that);
    this.initAnimation(that);
    this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
  },

  loadAssets: function (successCb, progressCb) {
    dbg('Load fish assets');
    var _self = this;
    var loader = new THREE.ObjectLoader();
    loader.load('assets/js/Models/skinned/fish.json', function (asset) {
      _self.assetsLoaded(asset, successCb);
    }, function (event) {
      _self.assetsLoading(event, progressCb)
    }, function () {
      dbg('Error: load fish assets');
    });
  },

  assetsLoaded: function (asset, cb) {
    dbg('fish assets loaded');
    this.asset = asset;
    cb();
  },

  initAnimation: function (that) {
    that.mixer = new THREE.AnimationMixer(that.mesh);

    that.action = that.mixer.clipAction(that.mesh.animations[0]);
    that.action.play();
  }
}, Animal);

module.exports = Fish;