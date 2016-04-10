var dbg = require('debug')('luma:jellyfish');
var Animal = require('./animal.js');

var Jellyfish = _.assign({
  type: 'jellyfish',

  create: function(scene, listener, camera) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create jellyfish ' + that.name );

    this.setPosition(that, camera);
    that.translateAxis = new THREE.Vector3(0, 1, 0);

    scene.add(that.mesh);

    this.goForward(that);

    this.initCollider(that, 0.8);
    this.initAnimation(that);
    //this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
  },

  assetsLoaded: function(geometry, materials, cb) {
    dbg('jellyfish assets loaded');

    var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0x431655, transparent: true, opacity: 0.35}) );
    this.asset = mesh;
    cb();
  },

  initAnimation: function (that) {
    TweenMax.to(that.mesh.scale, 1, {x: 0.75, y: 0.75, ease: Power4.easeInOut, yoyo: true, repeat: -1});
  }
}, Animal);

module.exports = Jellyfish;