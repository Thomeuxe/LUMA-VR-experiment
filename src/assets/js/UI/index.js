var dbg = require('debug')('luma:UI');

var UI = {
    infoPanel: null,
    font: null,

    createTarget: function(camera) {
        dbg('create target');


        var targetCanvas = document.createElement("canvas");
        canvg(targetCanvas, 'assets/img/target.svg');

        var targetTexture = new THREE.Texture(targetCanvas);
        targetTexture.needsUpdate = true;

        var targetMaterial = new THREE.MeshBasicMaterial({
            map : targetTexture,
            transparent: true
        });

        var target = new THREE.Mesh(new THREE.CircleGeometry(0.1), targetMaterial);

        camera.add(target);
        target.position.set(0,0,-1.2);

        return target;
    },

    loadFont: function(callback) {
        var loader = new THREE.FontLoader();
        loader.load( 'assets/fonts/helvetiker_regular.typeface.js', function (font) {
            this.font = font;
            callback();
        }.bind(this));
    },

    openInfoPanel: function(scene, camera, parent) {
        if(!this.font){
            this.loadFont(function() {
                this.openInfoPanel();
            }.bind(this));
            return;
        }

        // Exit if there's no parent to target or if panel is already visible
        if(!parent || (this.infoPanel && this.infoPanel.visible)) return;

        var fontSize = 0.06 * parent.distance;

        if (!this.infoPanel) {
            dbg('open info panel');
            this.infoPanel = new THREE.Object3D();
            this.infoName = this.createInfoName(parent.object.parent.name, fontSize);
            scene.add(this.infoPanel);
        } else {
            this.infoPanel.remove( this.infoName );
            this.infoName = this.createInfoName(parent.object.parent.name, fontSize);
        }
        this.infoName.userData.originalDistance = parent.distance;

        this.infoPanel.add(this.infoName);
    
        this.infoPanel.visible = true;
        
        this.updateInfoPanel(scene, camera, parent);
    },

    createInfoName: function (name, size) {
        return new THREE.Mesh(
          new THREE.TextGeometry(name, {font: this.font, size: size, height: 0.1}),
          new THREE.MeshBasicMaterial({color: 0xffffff})
        );
    },

    closeInfoPanel: function() {
        if (!this.infoPanel || !this.infoPanel.visible) return;
        dbg('close info panel');

        this.infoPanel.visible = false;
    },
    
    updateInfoPanel: function(scene, camera, parent) {
        if(!parent || (this.infoPanel && !this.infoPanel.visible)) return;

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(parent.object.matrixWorld);

        var scaleFactor = 0.2 + parent.distance / this.infoName.userData.originalDistance;
        var margin = parent.object.geometry.boundingSphere.radius;

        this.infoName.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.infoPanel.lookAt(camera.position);
        this.infoPanel.position.set(vector.x - margin, vector.y + margin, vector.z);
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

        wrapper.requestPointerLock = wrapper.requestPointerLock ||
        wrapper.mozRequestPointerLock ||
        wrapper.webkitRequestPointerLock;
        wrapper.requestPointerLock();

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
