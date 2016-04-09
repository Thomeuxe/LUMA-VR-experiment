var dbg = require('debug')('luma:jellyfish');
var Animal = require('./animal.js');

var Jellyfish = _.assign({
  type: 'jellyfish',

  create: function(scene, listener, i) {
    var that = {};
    that.mesh = this.asset.clone();
    this.setName(that, this.type);
    dbg('create jellyfish ' + that.name );

    this.initPosition(that);

    scene.add(that.mesh);

    this.goForward(that);

    this.initCollider(that, 0.8);
    this.initAnimation(that);
    //this.initAudio(that, 'assets/sounds/fish_noise.mp3', listener);

    return that;
  },

  loadAssets: function(successCb, progressCb) {
    dbg('Load jellyfish assets');
    var _self = this;
    var loader = new THREE.JSONLoader();
    loader.load('assets/js/Models/skinned/jellyfish.json', function(geometry, materials) {
      _self.assetsLoaded(geometry, materials, successCb);
    }, function(event) {
      _self.assetsLoading(event, progressCb);
    }, function() {
      dbg('Error: load jellyfish assets');
    });
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