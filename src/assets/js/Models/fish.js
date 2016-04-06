var dbg = require('debug')('luma:fish');
var Animal = require('./animal.js');

var Fish = _.assign({
  type: 'fish',

  create: function (scene, listener, name) {
    this.mesh = this.asset.clone();
    this.name = name;
    this.mesh.name = name;
    dbg('create fish ' + name);

    this.mesh.animations = this.asset.animations;

    this.initPosition();

    scene.add(this.mesh);

    this.initCollider();
    this.initAnimation(this.mesh);
    this.initAudio('assets/sounds/fish_noise.mp3', listener);

    return this;
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

  initAnimation: function (object) {
    this.mixer = new THREE.AnimationMixer(this.mesh);

    this.action = this.mixer.clipAction(object.animations[0]);
    this.action.play();
  }
}, Animal);

module.exports = Fish;