var dbg = require('debug')('luma:jellyfish');
var Animal = require('./animal.js');

var Jellyfish = _.assign({
  type: 'jellyfish',

  create: function(scene, listener, name) {
    this.mesh = this.asset.clone();
    this.name = name;
    this.mesh.name = name;
    dbg('create jellyfish ' + name );

    this.initPosition();

    scene.add(this.mesh);

    this.initCollider();
    //this.initAnimation(this.mesh);
    //this.initAudio('assets/sounds/fish_noise.mp3', listener);

    return this;
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
    mesh.scale.set( 2, 2, 2 );
    this.asset = mesh;
    cb();
  },

  initAnimation: function (object) {
    this.mixer = new THREE.AnimationMixer(this.mesh);

    this.action = this.mixer.clipAction( object.geometry.animations[ 0 ] );
    this.action.play();
  }
}, Animal);

module.exports = Jellyfish;