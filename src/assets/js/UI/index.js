var UI = {
    infoPanel: null,
    font: null,

    createTarget: function(camera) {
        var target = new THREE.Mesh(new THREE.CircleGeometry(0.01), new THREE.MeshBasicMaterial({color: 0x5555ff}));
        camera.add(target);
        target.position.set(0,0,-1.2);

        return target;
    },

    openInfoPanel: function(scene, camera, parent) {
        if(!this.font){
            var loader = new THREE.FontLoader();
            loader.load( 'assets/fonts/helvetiker_regular.typeface.js', function (font) {
                this.font = font;
                this.openInfoPanel();
            }.bind(this));
            return;
        }

        if(!parent) return;

        if (!this.infoPanel) {
            this.infoPanel = new THREE.Object3D();
            this.infoName = this.createInfoName(parent.parent.name);
            scene.add(this.infoPanel);
        } else {
            this.infoPanel.remove( this.infoName );
            this.infoName = this.createInfoName(parent.parent.name);
        }

        this.infoPanel.add(this.infoName);

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( parent.matrixWorld );

        this.infoPanel.lookAt(camera.position);
        this.infoPanel.position.set(vector.x + 30, vector.y, vector.z);

        this.infoPanel.visible = true;
    },

    createInfoName: function (name) {
        return new THREE.Mesh(
          new THREE.TextGeometry(name, {font: this.font, size: 13, height: 1}),
          new THREE.MeshBasicMaterial({color: 0xffffff})
        );
    },

    closeInfoPanel: function() {
        if (!this.infoPanel) return;

        this.infoPanel.visible = false;
    }
};

module.exports = UI;
