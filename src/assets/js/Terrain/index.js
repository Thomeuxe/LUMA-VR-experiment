var Terrain = {
    
    create: function(scene, camera, renderer) {
        var axes = new THREE.AxisHelper(100);
        scene.add(axes);

        var geometry = new THREE.PlaneGeometry(60, 60, 9, 9);
        var material = new THREE.MeshBasicMaterial({
            color: 0x333333,
            wireframe: true
        });
        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        // this.controls = new THREE.TrackballControls(camera);
        document.getElementById('webgl1').appendChild(renderer.domElement);
        this.render();
    },

    render: function() {
        this.controls.update();
        requestAnimationFrame(this.render);
        renderer.render(scene, camera);
    }
};
Terrain.test();
// exports.module = Terrain;