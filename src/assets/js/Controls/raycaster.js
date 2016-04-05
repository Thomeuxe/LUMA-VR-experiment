Raycaster = {
    raycaster: null,
    mouse: null,
    scene: null,
    camera: null,

    create: function(scene, camera) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.scene = scene;
        this.camera = camera;

        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

        return this;
    },

    update: function() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        for (var i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }
    },

    onMouseMove: function(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }
};

module.exports = Raycaster;
