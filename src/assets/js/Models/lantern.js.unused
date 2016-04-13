var Lantern = function () {

    Lantern.loader.load( 'assets/js/Models/skinned/lantern.json', this.init.bind(this));

    return this;
};

Lantern.loader = new THREE.JSONLoader();
Lantern.instances = [];

Lantern.attachAsChild = function(object) {
    Lantern.parent = object;
};

Lantern.update = function (delta) {
    Lantern.instances.forEach(function (instance) {
        if (instance.mixer) {
            instance.mixer.update(delta);
        }
    });
};


Lantern.prototype.init = function (geometry, materials) {

    materials.forEach( function (material) {
        material.skinning = true;
    } );

    //this.mesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial( materials ) );
    /*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.mesh = new THREE.Mesh( geometry, material );
    console.log(this.mesh.rotateY(1));*/
    var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ) ;
    this.mesh = new THREE.SkinnedMesh(geometry, material );
    this.mesh.rotateY(Math.PI);
    this.mesh.rotateX(Math.PI/8);

    this.mesh.position.x = 0;
    this.mesh.position.y = -0.3;
    this.mesh.position.z = 0;

    //this.mesh.scale.set(1, 0.5, 0.5);

    Lantern.parent.add(this.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    //this.initAnimation(geometry);

    Lantern.instances.push(this);
};

Lantern.prototype.initAnimation = function (geometry) {
    if(null != geometry.animations) {
        this.mixer = new THREE.AnimationMixer(this.mesh);

        this.action = this.mixer.clipAction( geometry.animations[ 0 ] );
        this.action.play();
    }
};

module.exports = Lantern;