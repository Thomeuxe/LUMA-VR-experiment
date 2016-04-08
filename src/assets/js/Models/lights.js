var Lights = {
    addAsChild: function(object, scene) {
        var light = new THREE.PointLight( 0xffffff, 2, 300 );
        light.position.set(0,2,1);
        object.add(light);
        var light = new THREE.PointLight( 0xffffff, 2, 300 );
        light.position.set(0,2,-1);
        object.add(light);
    }
};

module.exports = Lights;