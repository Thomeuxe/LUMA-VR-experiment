var Gauge = {
  value: 0,
  max: 11000,
  create: function (camera, UI) {

    this.UI = UI;

    this.camera = camera;

    this.marker = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2, 0), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/img/graduation.png' ), transparent: true, color: 0xffffff }));
    this.marker.position.set(-0.6,0,-1.8);


    this.location = new THREE.Mesh(new THREE.SphereGeometry(0.05, 7, 7), new THREE.MeshBasicMaterial( { color: 0xff0000 }));
    this.location.position.set(0,0,0);
    this.marker.add(this.location);

    camera.add(this.marker);

    this.createText();

    return this;
  },

  createText: function() {

    if(!this.UI.font){
      this.UI.loadFont(function() {
        this.createText(this.UI);
      }.bind(this));
    }

    this.locationText = new THREE.Mesh(new THREE.TextGeometry("", {font: this.UI.font, size: 0.05, height: 0.01}), new THREE.MeshBasicMaterial( { color: 0xff0000 }));
    this.locationText.position.set(0.1, -0.02, 0);
    //this.locationText.rotateOnAxis(new THREE.Vector3(0, 1, 1), Math.PI/4);
    this.location.add(this.locationText);
  },

  update: function () {
    this.value = Math.round(this.camera.position.y) - this.max;
    this.location.position.setY(this.value/this.max * 2 + 2);
    this.locationText.geometry = new THREE.TextGeometry(this.value + "m", {font: this.UI.font, size: 0.05, height: 0.01});
    //this.locationText.computeBoundingBox();
  }

};

module.exports = Gauge;