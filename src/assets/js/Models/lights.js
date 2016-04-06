var Lights = {
    addAsChild: function(object, scene) {
        var light = new THREE.PointLight( 0xffffff, 5, 8000 );
        light.position.set(0,1,1);
        object.add(light);
        var light = new THREE.PointLight( 0xffffff, 5, 8000 );
        light.position.set(0,1,-1);
        object.add(light);
    }
};

module.exports = Lights;