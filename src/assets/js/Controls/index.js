var Controls = {
    active: false,

    create: function (camera) {
        this.camera = camera;
        this.camera.tmpRotation = 0;
        return new THREE.DeviceOrientationControls(camera);
    },

    createMouse: function (camera) {
        var elem = document.getElementById('wrapper');
        this.camera = camera;

        this.movementX = 0;
        this.movementY = 0;

        document.addEventListener("mousemove", function (e) {
            this.movementX = e.movementX ||
                e.mozMovementX ||
                e.webkitMovementX ||
                0;
            this.movementY = e.movementY ||
                e.mozMovementY ||
                e.webkitMovementY ||
                0;
        }.bind(this), false);

        window.addEventListener('mousedown', function () {
            this.goForward();
        }.bind(this), false);

        window.addEventListener('mouseup', function () {
            this.stop();
        }.bind(this), false);

        this.camera.tmpRotation = 0;
        TweenMax.set(this.camera, {tmpRotation: 0});

        return this;
    },

    update: function () {
        this.camera.rotateOnAxis(new THREE.Vector3(-1,0,0), this.movementY / 200);
        this.camera.rotateOnAxis(new THREE.Vector3(0,-1,0), this.movementX / 200);
        this.movementY = 0;
        this.movementX = 0;
    },

    initTouchMovements: function () {
        /*controls = new THREE.VRControls( camera );
         controls.movementSpeed = 150;
         controls.lookSpeed = 0.1;
         return controls;*/

        window.addEventListener('touchstart', function () {
            this.goForward();
        }.bind(this), false);

        window.addEventListener('touchend', function () {
            this.stop();
        }.bind(this), false);
    },

    goForward: function () {
        if (this.active)
            TweenMax.to(this.camera, 1, {acceleration: -6, ease: Quad.easeIn});
    },

    stop: function (immediately) {
        var duration = immediately ? 0.1 : 2;

        if(null != this.camera.tmpRotation)
            TweenMax.to(this.camera, 3, {tmpRotation: 0, ease: Quad.easeInOut, delay: 0.5});

        TweenMax.to(this.camera, duration, {acceleration: 0, ease: Quad.easeOut});
    }
};

module.exports = Controls;