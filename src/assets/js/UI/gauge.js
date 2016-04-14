var Gauge = {
  value: 0,
  max: 11000,
  create: function (camera, UI, Renderer) {

    this.UI = UI;

    this.camera = camera;
    
    this.renderer = Renderer.renderer;
    this.factor = (this.renderer.getPixelRatio() - 1) * 0.5 + 1;
    this.margin = Renderer.cbEffect ? 0.9 : 0;

    var texture = new THREE.TextureLoader().load('assets/img/graduation.png');
    this.marker = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2, 0), new THREE.MeshBasicMaterial( { map: texture, transparent: true, color: 0xffffff }));
    this.marker.position.set(-((this.renderer.domElement.width * this.factor) / 1100 - 0.4) + this.margin, 0, -1.8);

    this.location = new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), new THREE.MeshBasicMaterial( { color: 0xcbe9e3 }));
    this.location.position.set(0, 0, 0.001);
    this.marker.add(this.location);

    camera.add(this.marker);

    this.createText();

    this.update();

    return this;
  },

  createText: function() {

    if(!this.UI.font){
      this.UI.loadFont(function() {
        this.createText(this.UI);
      }.bind(this));
      return;
    }

    this.locationText = new THREE.Mesh(new THREE.TextGeometry("", {font: this.UI.font, size: 0.05, height: 0.01}), new THREE.MeshBasicMaterial( { color: 0xcbe9e3 }));
    this.locationText.position.set(0.1, -0.02, 0);
    //this.locationText.rotateOnAxis(new THREE.Vector3(0, 1, 1), Math.PI/4);
    this.location.add(this.locationText);
  },

  update: function () {
    var newValue = Math.round(this.camera.position.y / 50) - this.max;
    if(this.locationText && (this.value != newValue)){
      this.location.position.setY(newValue/this.max * 2 + 1.25);
      this.locationText.geometry = new THREE.TextGeometry((newValue + 2800) + "m", {font: this.UI.font, size: 0.05, height: 0.01});
      //this.locationText.computeBoundingBox();
      this.value = newValue;
    }
  },

  setMargin: function(margin) {
    this.marker.position.setX(this.marker.position.x - this.margin + margin);
    this.margin = margin;
  },
  
  onWindowResize: function() {
    if (!this.marker) return;
    this.marker.position.setX(- ((this.renderer.domElement.width * this.factor) / 1100 - 0.4) + this.margin);
  }

};

module.exports = Gauge;