Raycaster = {
    raycaster: null,
    center: null,

    scene: null,
    camera: null,

    intersected: null,
    intersections: [],

    create: function(scene, camera) {
        this.raycaster = new THREE.Raycaster();
        this.center = new THREE.Vector2(0, 0);

        this.scene = scene;
        this.camera = camera;

        return this;
    },

    update: function() {
        this.raycaster.setFromCamera(this.center, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        var i;

        for (i = 0; i < this.intersections.length; i++) {
            this.intersections[i].object.material.color.set(0x0000ff);
        }
        this.intersections = intersects;

        if (intersects.length > 0) {
            var nearest = intersects[0];

            for (i = 1; i < intersects.length; i++) {
                if (intersects[i].distance < nearest.distance) {
                    nearest = intersects[i];
                }
            }

            this.intersected = nearest;
            this.intersected.object.material.color.set(0xff0000);
        } else {
            if (this.intersected) this.intersected.object.material.color.set(0x00ff00); // reset color

            this.intersected = null;
        }
    }
};

module.exports = Raycaster;
