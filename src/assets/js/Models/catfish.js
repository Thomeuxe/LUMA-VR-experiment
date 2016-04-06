var Catfish = function (infos) {
  infos = infos || {};

  this.name = infos.name;

  if (!Catfish._base) {
    // Start object loading
    if (!Catfish._loadingBase) {
      Catfish.loader.load('assets/js/Models/skinned/cat_fish.json', Catfish._setBase);
      Catfish._loadingBase = true;
    }
    // Add current object to wait list
    Catfish._needsInit.push(this);
  } else {
    this.init();
  }

  return this;
};

Catfish._base = null;
Catfish._loadingBase = false;
Catfish._needsInit = [];

Catfish._setBase = function(geometry, materials) {

  materials.forEach( function (material) {
    material.skinning = true;
  } );

  var mesh = new THREE.SkinnedMesh( geometry, materials[0] );
  mesh.scale.set( 2, 2, 2 );
  Catfish._base = mesh;
  Catfish._loadingBase = false;
  // Instanciate wait list objects
  for (var i = 0; i < Catfish._needsInit.length; i++) {
    Catfish._needsInit[i].init();
  }
};

Catfish.loader = new THREE.JSONLoader();
Catfish.instances = [];

Catfish.setScene = function (scene) {
  Catfish.scene = scene;
};

Catfish.setListener = function (listener) {
  Catfish.listener = listener;
};

Catfish.update = function (delta) {
  Catfish.instances.forEach(function (instance) {
    if (instance.mixer) {
      instance.mixer.update(delta);
    }
  });
};

Catfish.prototype.init = function () {
  this.mesh = Catfish._base.clone();

  this.mesh.position.x = Math.random() * 2000;
  this.mesh.position.y = Math.random() * 2000;
  this.mesh.position.z = Math.random() * 2000;

  this.mesh.name = this.name;

  Catfish.scene.add(this.mesh);

  var box = new THREE.Box3().setFromObject(this.mesh);
  var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius, 6, 6);
  this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
  this.mesh.add(this.meshCollider);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

  this.meshCollider.targetable = true;

  this.initAnimation(this.mesh);
  this.initAudio(Catfish.listener);

  Catfish.instances.push(this);
};

Catfish.prototype.initAnimation = function (object) {
  this.mixer = new THREE.AnimationMixer(this.mesh);

  this.action = this.mixer.clipAction( object.geometry.animations[ 0 ] );
  this.action.play();
};

Catfish.prototype.initAudio = function (listener) {
  this.audio = new THREE.PositionalAudio( listener );
  this.audio.load( 'assets/sounds/fish_noise.mp3' );
  this.audio.setRefDistance( 4 );
  this.audio.setLoop(true);
  this.audio.autoplay = true;
  this.audio.setVolume(3);
  this.mesh.add( this.audio );
};

module.exports = Catfish;