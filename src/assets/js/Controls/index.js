var Controls = {
    create: function(camera) {
        return new THREE.DeviceOrientationControls( camera );
    },

    createMouse: function(camera, renderer) {
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        return controls;
    }
};

module.exports = Controls;