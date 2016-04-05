var Scene = {
    create: function() {
        this.scene = new THREE.Scene();
        return this.scene;
    },

    enableHelpers: function() {
        var axisHelper = new THREE.AxisHelper( 5 );
        this.scene.add( axisHelper );
    }
};

module.exports = Scene;
