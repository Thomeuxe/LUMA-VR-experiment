var Fish = function (infos) {
  infos = infos || {};

  this.name = infos.name;

  if (!Fish._base) {
    // Start object loading
    if (!Fish._loadingBase) {
      Fish.loader.load('assets/js/Models/skinned/fish.json', Fish._setBase);
      Fish._loadingBase = true;
    }
    // Add current object to wait list
    Fish._needsInit.push(this);
  } else {
    this.init();
  }

  return this;
};

Fish._base = null;
Fish._loadingBase = false;
Fish._needsInit = [];

Fish._setBase = function(object) {
  Fish._base = object;
  Fish._loadingBase = false;
  // Instanciate wait list objects
  for (var i = 0; i < Fish._needsInit.length; i++) {
    Fish._needsInit[i].init();
  }
};

Fish.loader = new THREE.ObjectLoader();
Fish.instances = [];

Fish.setScene = function (scene) {
  Fish.scene = scene;
};

Fish.setListener = function (listener) {
  Fish.listener = listener;
};

Fish.update = function (delta) {
  Fish.instances.forEach(function (instance) {
    if (instance.mixer) {
      instance.mixer.update(delta);
    }
  });
};

Fish.prototype.init = function () {
  this.mesh = Fish._base.clone();
  this.mesh.animations = Fish._base.animations; // Clone doesn't clone animation array

  this.mesh.position.x = Math.random() * 2000;
  this.mesh.position.y = Math.random() * 2000;
  this.mesh.position.z = Math.random() * 2000;

  this.mesh.name = this.name;

  Fish.scene.add(this.mesh);

  var box = new THREE.Box3().setFromObject(this.mesh);
  var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius, 6, 6);
  this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
  this.mesh.add(this.meshCollider);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

  this.meshCollider.targetable = true;

  this.initAnimation(this.mesh);
  this.initAudio(Fish.listener);

  Fish.instances.push(this);
};

Fish.prototype.initAnimation = function (object) {
  this.mixer = new THREE.AnimationMixer(this.mesh);

  this.action = this.mixer.clipAction(object.animations[0]);
  this.action.play();
};

Fish.prototype.initAudio = function (listener) {
  this.audio = new THREE.PositionalAudio( listener );
  this.audio.load( 'assets/sounds/fish_noise.mp3' );
  this.audio.setRefDistance( 4 );
  this.audio.setLoop(true);
  this.audio.autoplay = true;
  this.audio.setVolume(3);
  this.mesh.add( this.audio );
};

module.exports = Fish;