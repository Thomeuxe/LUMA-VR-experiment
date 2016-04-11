Raycaster = {
    targetRaycaster: null,
    center: null,

    collisionRaycaster: null,
    collisionVector: null,

    scene: null,
    camera: null,
    UI: null,

    intersected: null,
    intersections: [],
    terrain: null,

    lastTerrainTile: null,

    create: function(scene, camera, UI, terrain) {
        this.targetRaycaster = new THREE.Raycaster();
        this.center = new THREE.Vector2(0, 0);

        this.collisionRaycaster = new THREE.Raycaster();
        this.collisionVector = new THREE.Vector3(0, -1, 0);

        this.scene = scene;
        this.camera = camera;
        this.UI = UI;
        this.terrain = terrain;

        this.lastTerrainTile = this.terrain.currentTile;

        return this;
    },

    update: function() {
        this.targetRaycaster.setFromCamera(this.center, this.camera);
        this.collisionRaycaster.set(this.camera.position, this.collisionVector);

        // calculate objects intersecting the picking ray
        var intersects = this.targetRaycaster.intersectObjects(this.scene.children, true);

        var collisions = this.collisionRaycaster.intersectObjects(this.terrain.meshs);

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
                this.UI.openInfoPanel(this.scene, this.camera, this.intersected);
            } else {
                this.UI.closeInfoPanel();
            }
        }

        if (collisions.length > 0) {
            var collision = collisions[0];
            for (i = 1; i < collisions.length; i++) {
                if (collisions[i].distance < collision.distance) {
                    collision = collisions[i];
                }
            }

            if (this.lastTerrainTile.mesh.uuid != collision.object.uuid) {
                this.lastTerrainTile = collision.object.terrainTile;
                this.terrain.setCurrentTile(this.lastTerrainTile);
            }

            if (collision.distance < 30) {
                this.camera.position.setY(this.camera.position.y + 30 - collision.distance);
            }
        }
    }
};

module.exports = Raycaster;
