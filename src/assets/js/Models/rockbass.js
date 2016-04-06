var Rockbass = function (infos) {
  infos = infos || {};

  this.name = infos.name;

  if (!Rockbass._base) {
    // Start object loading
    if (!Rockbass._loadingBase) {
      Rockbass.loader.load('assets/js/Models/skinned/rockbass.json', Rockbass._setBase);
      Rockbass._loadingBase = true;
    }
    // Add current object to wait list
    Rockbass._needsInit.push(this);
  } else {
    this.init();
  }

  return this;
};

Rockbass._base = null;
Rockbass._loadingBase = false;
Rockbass._needsInit = [];

Rockbass._setBase = function(geometry, materials) {
  materials.forEach( function (material) {
    material.skinning = true;
  } );

  var mesh = new THREE.SkinnedMesh( geometry, materials[0] );
  mesh.scale.set( 2, 2, 2 );
  Rockbass._base = mesh;
  Rockbass._loadingBase = false;
  // Instanciate wait list objects
  for (var i = 0; i < Rockbass._needsInit.length; i++) {
    Rockbass._needsInit[i].init();
  }
};

Rockbass.loader = new THREE.JSONLoader();
Rockbass.instances = [];

Rockbass.setScene = function (scene) {
  Rockbass.scene = scene;
};

Rockbass.setListener = function (listener) {
  Rockbass.listener = listener;
};

Rockbass.update = function (delta) {
  Rockbass.instances.forEach(function (instance) {
    if (instance.mixer) {
      instance.mixer.update(delta);
    }
  });
};

Rockbass.prototype.init = function () {
  this.mesh = Rockbass._base.clone();

  this.mesh.position.x = Math.random() * 2000;
  this.mesh.position.y = Math.random() * 2000;
  this.mesh.position.z = Math.random() * 2000;

  this.mesh.name = this.name;

  Rockbass.scene.add(this.mesh);

  var box = new THREE.Box3().setFromObject(this.mesh);
  var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius, 6, 6);
  this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
  this.mesh.add(this.meshCollider);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

  this.meshCollider.targetable = true;

  this.initAnimation(this.mesh);
  this.initAudio(Rockbass.listener);

  Rockbass.instances.push(this);
};

Rockbass.prototype.initAnimation = function (object) {
  this.mixer = new THREE.AnimationMixer(this.mesh);

  this.action = this.mixer.clipAction( object.geometry.animations[ 0 ] );
  this.action.play();
};

Rockbass.prototype.initAudio = function (listener) {
  this.audio = new THREE.PositionalAudio( listener );
  this.audio.load( 'assets/sounds/fish_noise.mp3' );
  this.audio.setRefDistance( 4 );
  this.audio.setLoop(true);
  this.audio.autoplay = true;
  this.audio.setVolume(3);
  this.mesh.add( this.audio );
};

module.exports = Rockbass;