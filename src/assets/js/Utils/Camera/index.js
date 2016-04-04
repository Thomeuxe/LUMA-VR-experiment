var Camera = {
    create: function() {
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 10;

        this.initListener();

        return this.camera
    },
    initListener: function () {
        this.listener = new THREE.AudioListener();
        this.camera.add( this.listener );
    }
};

module.exports = Camera;