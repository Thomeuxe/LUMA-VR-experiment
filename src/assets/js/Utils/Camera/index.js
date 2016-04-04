var Camera = {
    create: function() {
        return new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    }
};

module.exports = Camera;