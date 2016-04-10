var dbg = require('debug')('luma:catfish');
var Animal = require('./animal.js');

var Catfish = _.assign({
  type: 'catfish',

  create: function(scene, listener) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create catfish ' + that.name);

    this.initPosition(that);

    this.goForward(that);

    scene.add(that.mesh);

    this.initCollider(that);
    this.initAnimation(that);
    this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
  },

  assetsLoaded: function(geometry, materials, cb) {
    dbg('catfish assets loaded');
    materials.forEach( function (material) {
      material.skinning = true;
    } );

    var mesh = new THREE.SkinnedMesh( geometry, materials[0] );
    this.asset = mesh;
    cb();
  },

  initAnimation: function (that) {
    that.mixer = new THREE.AnimationMixer(that.mesh);
    that.mixer.timeScale = 2;

    that.action = that.mixer.clipAction( that.mesh.geometry.animations[ 0 ] );
    that.action.play();
  }
}, Animal);

module.exports = Catfish;