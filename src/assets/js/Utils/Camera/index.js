var Camera = {
    create: function() {
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        camera.position.z = 50;
        return camera;
    }
};

module.exports = Camera;