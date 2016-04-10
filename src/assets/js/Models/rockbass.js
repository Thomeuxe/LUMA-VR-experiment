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
    that.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), 1);
    that.translateAxis = new THREE.Vector3(0, 1, 0);

    scene.add(that.mesh);

    this.goForward(that);

    this.initCollider(that);
    this.initAnimation(that);
    this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
  },

  assetsLoaded: function(geometry, materials, cb) {
    dbg('rockbass assets loaded');
    materials.forEach( function (material) {
      material.skinning = true;
    } );

    var mesh = new THREE.SkinnedMesh( geometry, materials[0] );
    this.asset = mesh;
    cb();
  },

  initAnimation: function (that) {
    that.mixer = new THREE.AnimationMixer(that.mesh);
    that.mixer.timeScale = 3;

    that.action = that.mixer.clipAction( that.mesh.geometry.animations[ 0 ] );
    that.action.play();
  }
}, Animal);

module.exports = Rockbass;
