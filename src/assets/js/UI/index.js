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
            loader.load( 'assets/fonts/helvetiker_regular.typeface.js', fontLoaded.bind(this));
            function fontLoaded (font){
                this.font = font;
                this.openInfoPanel();
            }
            return;
        }

        if(!parent) return;


        if (!this.infoPanel) {
            this.infoPanel = new THREE.Object3D();
            this.infoName = new THREE.Mesh(
              new THREE.TextGeometry(parent.parent.name, {font: this.font, size: 13, height: 1}),
              new THREE.MeshBasicMaterial({color: 0xffffff})
            );

            this.infoPanel.add(this.infoName);
            scene.add(this.infoPanel);
        }

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( parent.matrixWorld );

        this.infoPanel.lookAt(camera.position);
        console.log(vector.x);
        this.infoPanel.position.set(vector.x + 30, vector.y, vector.z);

        this.infoPanel.visible = true;
    },

    closeInfoPanel: function(camera) {
        if (!this.infoPanel) return;

        this.infoPanel.visible = false;
    }
};

module.exports = UI;
