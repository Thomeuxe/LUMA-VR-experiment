var UI = {
    createTarget: function(camera) {
        var target = new THREE.Mesh(new THREE.CircleGeometry(0.01), new THREE.MeshBasicMaterial({color: 0x5555ff}));
        camera.add(target);
        target.position.set(0,0,-1.2);

        return target;
    }
};

module.exports = UI;
