var Controls = {
    create: function(camera) {
        return new THREE.DeviceOrientationControls( camera );
    }
};

module.exports = Controls;