Raycaster = {
    targetRaycaster: null,
    center: null,

    collisionRaycaster: null,
    collisionVector: null,

    animalsRaycasters: [],

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

    addAnimals: function(animals) {
        for (var i = 0; i < animals.length; i++) {
            this.addAnimal(animals[i]);
        }
    },

    addAnimal: function(animal) {
        this.animalsRaycasters.push({
            animal: animal,
            raycaster: new THREE.Raycaster(),
            collisions: []
        });
    },

    update: function() {
        var i;

        this.targetRaycaster.setFromCamera(this.center, this.camera);
        this.collisionRaycaster.set(this.camera.position, this.collisionVector);

        // calculate objects intersecting the picking ray
        var intersects = this.targetRaycaster.intersectObjects(this.scene.children, true);

        var collisions = this.collisionRaycaster.intersectObjects(this.terrain.meshs);

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

        var ar;
        for (i = 0; i < this.animalsRaycasters.length; i++) {
            ar = this.animalsRaycasters[i];
            ar.raycaster.set(ar.animal.mesh.position, this.collisionVector);
            ar.collisions = ar.raycaster.intersectObjects(this.terrain.meshs);
            if (ar.collisions.length > 0 && ar.collisions[0].distance < 30) {
                ar.animal.mesh.position.setY(ar.animal.mesh.position.y + 30 - ar.collisions[0].distance);
                var rx = ar.animal.mesh.rotation.x;
                var rz = ar.animal.mesh.rotation.z;
                ar.animal.mesh.rotation.set(rx + Math.random() / 10, 0, rz + Math.random() / 10);
            }
        }
    }
};

module.exports = Raycaster;
