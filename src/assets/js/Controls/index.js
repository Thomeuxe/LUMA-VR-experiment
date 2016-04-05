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
    },

    initTouchMovements: function(camera) {
        window.addEventListener('touchstart', function() {
            this.goForward(camera);
        }.bind(this), false);
        window.addEventListener('touchend', function() {
            this.stop(camera);
        }.bind(this), false);
    },

    goForward: function(object) {
        console.log("goForward", object);
    },

    stop: function(object) {
        console.log("stop");
    }
};

module.exports = Controls;