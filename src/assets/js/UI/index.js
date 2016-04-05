var UI = {
    infoPanel: null,

    createTarget: function(camera) {
        var target = new THREE.Mesh(new THREE.CircleGeometry(0.01), new THREE.MeshBasicMaterial({color: 0x5555ff}));
        camera.add(target);
        target.position.set(0,0,-1.2);

        return target;
    },

    openInfoPanel: function(scene, camera, parent) {
        if (!this.infoPanel) {
            this.infoPanel = new THREE.Mesh(new THREE.PlaneGeometry(100,100,32), new THREE.MeshBasicMaterial({color: 0xccccff}));
            scene.add(this.infoPanel);
        }

        this.infoPanel.lookAt(camera.position);
        this.infoPanel.position.set(parent.position.x, parent.position.y, parent.position.z);

        this.infoPanel.visible = true;
    },

    closeInfoPanel: function(camera) {
        if (!this.infoPanel) return;

        this.infoPanel.visible = false;
    }
};

module.exports = UI;
