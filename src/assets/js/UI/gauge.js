var Gauge = {
  value: 0,
  max: 11000,
  create: function (camera) {

    this.camera = camera;

    //this.marker = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0), new THREE.MeshBasicMaterial({color: 0x5555ff}));
    //camera.add(this.marker);
    //this.marker.position.set(0.4,0,-1.2);

    return this;
  },
  update: function () {
    this.value = Math.round(this.camera.position.y) - this.max;
  }
};

module.exports = Gauge;