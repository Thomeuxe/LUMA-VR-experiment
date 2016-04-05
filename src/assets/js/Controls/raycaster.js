Raycaster = {
    raycaster: null,
    center: null,

    scene: null,
    camera: null,

    intersected: null,
    intersections: [],

    create: function(scene, camera, UI) {
        this.raycaster = new THREE.Raycaster();
        this.center = new THREE.Vector2(0, 0);

        this.scene = scene;
        this.camera = camera;
        this.UI = UI;

        return this;
    },

    update: function() {
        this.raycaster.setFromCamera(this.center, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        var i;

        if (intersects.length > 0) {
            var nearest = null;

            for (i = 0; i < intersects.length; i++) {
                if (intersects[i].object.targetable && (!nearest || intersects[i].distance < nearest.distance)) {
                    nearest = intersects[i];
                }
            }

            this.intersected = nearest;
            if (this.intersected) {
                this.UI.openInfoPanel(this.scene, this.camera, this.intersected.object);
            } else {
                this.UI.closeInfoPanel(this.camera);
            }
        }
    }
};

module.exports = Raycaster;
