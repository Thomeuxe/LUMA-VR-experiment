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

    this.mesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial( materials ) );
    //this.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));

    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    this.mesh.position.z = -200;

    this.mesh.scale.set(0.1, 0.1, 0.1);

    Lantern.parent.add(this.mesh);

    var geometryColliderRadius = this.mesh.geometry.boundingSphere.radius;
    var geometryCollider = new THREE.SphereGeometry(geometryColliderRadius, 6, 6);
    this.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({wireframe: true}));
    this.meshCollider.position.set(0, geometryColliderRadius / 2, 0);
    this.mesh.add(this.meshCollider);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.meshCollider.targetable = true;

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