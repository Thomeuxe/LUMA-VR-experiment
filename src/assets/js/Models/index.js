var Models = {
    test: function (scene) {
        // instantiate a loader
        var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            'assets/js/Models/monkey.json',
            // Function when resource is loaded
            function (geometry, materials) {
                //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

                for(var i = 0; i < 50; i++) {
                    var object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0x009900, shininess: 70, shading: THREE.FlatShading } ));

                    object.position.x = Math.random() * 60 - 30;
                    object.position.y = Math.random() * 60 - 30;
                    object.position.z = Math.random() * 60 - 30;

                    scene.add(object);
                }

                return;
            }
        );
    }
};

module.exports = Models;