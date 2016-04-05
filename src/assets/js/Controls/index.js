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
        /*controls = new THREE.VRControls( camera );
        controls.movementSpeed = 150;
        controls.lookSpeed = 0.1;
        return controls;*/

        window.addEventListener('touchstart', function() {
            this.goForward(camera);
        }.bind(this), false);

        window.addEventListener('touchend', function() {
            this.stop(camera);
        }.bind(this), false);
    },

    goForward: function(camera) {
        console.log("yo", camera);
        TweenMax.to(camera, 1, {acceleration: -10, ease: Quad.easeIn});
    },

    stop: function(camera) {
        console.log("stop", camera);
        TweenMax.to(camera, 2, {acceleration: 0, ease: Quad.easeOut});
    }
};

module.exports = Controls;