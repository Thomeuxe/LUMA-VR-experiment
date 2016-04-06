var dbg = require('debug')('luma:UI');

var UI = {
    infoPanel: null,
    font: null,

    createTarget: function(camera) {
        dbg('create target');
        var target = new THREE.Mesh(new THREE.CircleGeometry(0.01), new THREE.MeshBasicMaterial({color: 0x5555ff}));
        camera.add(target);
        target.position.set(0,0,-1.2);

        return target;
    },

    openInfoPanel: function(scene, camera, parent) {
        if(!this.font){
            var loader = new THREE.FontLoader();
            loader.load( 'assets/fonts/helvetiker_regular.typeface.js', function (font) {
                this.font = font;
                this.openInfoPanel();
            }.bind(this));
            return;
        }

        if(!parent) return;

        if (!this.infoPanel) {
            dbg('open info panel');
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
        this.infoPanel.position.set(vector.x + 30, vector.y, vector.z);

        this.infoPanel.visible = true;
    },

    closeInfoPanel: function() {
        if (!this.infoPanel) return;
        dbg('close info panel');

        this.infoPanel.visible = false;
    },

    toggleFullScreen: function(wrapper, supports) {
        dbg('toggle full screen');
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            if (wrapper.requestFullscreen) {
                wrapper.requestFullscreen();
            } else if (wrapper.mozRequestFullScreen) {
                wrapper.mozRequestFullScreen();
            } else if (wrapper.webkitRequestFullscreen) {
                wrapper.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }

        if(supports.isMobile()) {
            screen.orientation.lock("landscape-primary");
        }
    },

    toggleAudio: function(listener) {
        dbg('toggle audio');
        listener.toggle();
    },

    onWindowResize: function(camera, renderer) {
        dbg('window resize');
        camera.handleResize();
        renderer.handleResize();
    }
};

module.exports = UI;
