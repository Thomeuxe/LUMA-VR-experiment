var Camera = {
    create: function() {
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 10;
        this.camera.acceleration = 0;

        return this.camera
    },

    handleResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    },
    
    render: function() {
        this.camera.translateZ(this.camera.acceleration);
    }
};

module.exports = Camera;