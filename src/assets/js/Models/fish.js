var dbg = require('debug')('luma:fish');
var Animal = require('./animal.js');

var Fish = _.assign({
  type: 'fish',

  create: function (scene, listener, camera) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create fish ' + that.name);

    that.mesh.geometry.animations = this.asset.geometry.animations;

    this.setPosition(that, camera);
    that.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1);
    that.translateAxis = new THREE.Vector3(0, -1, 0);

    scene.add(that.mesh);

    this.goForward(that);

    this.initCollider(that, 0.1);
    this.initAnimation(that);
    this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
  },

  assetsLoaded: function (asset, cb) {
    dbg('fish assets loaded');
    this.asset = asset.children[0].children[0];
    cb();
  },

  initAnimation: function (that) {
    that.mixer = new THREE.AnimationMixer(that.mesh);

    that.action = that.mixer.clipAction(that.mesh.geometry.animations[0]);
    that.action.play();
  }
}, Animal);

module.exports = Fish;