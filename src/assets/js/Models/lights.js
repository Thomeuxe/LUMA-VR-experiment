var Lights = {
  addAsChild: function (object, scene) {
    var light;
    var lightPositions = [new THREE.Vector3(0, 2, 1), new THREE.Vector3(0, 2, -1)];
    lightPositions.forEach(function (pos) {
      light = new THREE.PointLight(0xffffff, 2, 300);
      light.position.set(pos.x, pos.y, pos.z);
      object.add(light);
    });
  }
};

module.exports = Lights;