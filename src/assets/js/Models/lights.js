var Lights = {
    addAsChild: function(object, scene) {
        var light = new THREE.PointLight( 0xffffff, 1, 50 );
        object.add(light);
        console.log(object);
    }
};

module.exports = Lights;