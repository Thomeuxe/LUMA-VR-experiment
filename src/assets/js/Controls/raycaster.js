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
                this.UI.openInfoPanel(this.scene, this.camera, this.intersected.object, intersects);
            } else {
                this.UI.closeInfoPanel();
            }
        }

        if (collisions.length > 1) console.warn("COLLISIONS > 1");

        if (collisions.length > 0 && this.lastTerrainTile.mesh.uuid != collisions[0].object.uuid) {
            this.lastTerrainTile = collisions[0].object.terrainTile;
            this.terrain.setCurrentTile(this.lastTerrainTile);
        }

        if (collisions.length > 0 && collisions[0].distance < 60) {
            this.camera.position.set(
                this.camera.position.x,
                this.camera.position.y + 60 - collisions[0].distance,
                this.camera.position.z
            );
        }
    }
};

module.exports = Raycaster;
