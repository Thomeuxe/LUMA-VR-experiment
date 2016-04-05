var Lights = {
    addAsChild: function(object, scene) {
        var light = new THREE.PointLight( 0xffffff, 0.6, 300 );
        object.add(light);
        console.log(object);
    }
};

module.exports = Lights;