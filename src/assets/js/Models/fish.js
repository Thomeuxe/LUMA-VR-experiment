var Fish = function () {

  Fish.loader.load( 'assets/js/Models/skinned/knight.json', this.init.bind(this));

  return this;
};

Fish.loader = new THREE.JSONLoader();
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


Fish.prototype.init = function (geometry, materials) {
  materials.forEach( function (material) {
    material.skinning = true;
  } );

  this.mesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial( materials ) );
  //this.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));

  this.mesh.position.x = Math.random() * 2000;
  this.mesh.position.y = Math.random() * 2000;
  this.mesh.position.z = Math.random() * 2000;

  this.mesh.scale.set(10, 10, 10);

  Fish.scene.add(this.mesh);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

  this.mesh.targetable = true;

  this.initAnimation(geometry);
  this.initAudio(Fish.listener);

  Fish.instances.push(this);
};

Fish.prototype.initAnimation = function (geometry) {
  this.mixer = new THREE.AnimationMixer(this.mesh);

  this.action = this.mixer.clipAction( geometry.animations[ 0 ] );
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