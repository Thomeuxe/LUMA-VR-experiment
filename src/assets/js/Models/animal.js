var dbg = require('debug')('luma:animal');

var Animal = {

  assetsLoading: function(event, progressCb) {
    progressCb({
      key: this.type + 'Json',
      value: event.loaded / event.total
    })
  },

  loadObjectAssets: function (url, successCb, progressCb) {
    var filename = url.substring(url.lastIndexOf('/')+1);
    dbg('Load ' + filename + ' assets');
    var _self = this;
    var loader = new THREE.ObjectLoader();
    loader.load(url, function (asset) {
      _self.assetsLoaded(asset, successCb);
    }, function (event) {
      _self.assetsLoading(event, progressCb)
    }, function () {
      dbg('Error: load ' + filename + ' assets');
    });
  },

  loadJSONAssets: function(url, successCb, progressCb) {
    var filename = url.substring(url.lastIndexOf('/')+1);
    dbg('Load ' + filename + ' assets');
    var _self = this;
    var loader = new THREE.JSONLoader();
    loader.load(url, function(geometry, materials) {
      _self.assetsLoaded(geometry, materials, successCb);
    }, function(event) {
      _self.assetsLoading(event, progressCb);
    }, function() {
      dbg('Error: load ' + filename + ' assets');
    });
  },

  update: function(instances, delta, camera) {
    var cameraDistance;
    instances.forEach(function (instance) {
      cameraDistance = instance.mesh.position.distanceTo( camera.position );
      if (cameraDistance > 500){
        this.setPosition(instance, camera);
      }

      instance.mesh.translateOnAxis(instance.translateAxis, instance.speed * delta);

      if (instance.mixer) {
        instance.mixer.update(delta);
      }
    }, this);
  },

  setPosition: function (that, camera) {
    that.mesh.position.set(
      (Math.random() < 0.5 ? -1 : +1 ) * Math.random() * 500 + camera.position.x,
      camera.position.y,
      (Math.random() < 0.5 ? -1 : +1 ) * Math.random() * 500 + camera.position.z);
  },

  initCollider: function (that, optionalScaleFactor) {
    optionalScaleFactor = optionalScaleFactor || 1;
    var box = new THREE.Box3().setFromObject(that.mesh);
    var geometryCollider = new THREE.SphereGeometry(box.getBoundingSphere().radius * optionalScaleFactor, 6, 6);
    that.meshCollider = new THREE.Mesh(geometryCollider, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));
    that.mesh.add(that.meshCollider);

    that.mesh.castShadow = true;
    that.mesh.receiveShadow = true;

    that.meshCollider.targetable = true;
  },

  initAudio: function (that, filePath, listener) {
    that.audio = new THREE.PositionalAudio( listener );
    that.audio.load( filePath );
    that.audio.setRefDistance( 4 );
    that.audio.setLoop(true);
    that.audio.autoplay = true;
    that.audio.setVolume(3);
    that.mesh.add( that.audio );
  },

  setName: function (that, name) {
    that.name = name.charAt(0).toUpperCase() + name.slice(1);
    that.mesh.name = that.name;
  },

  goForward: function (that) {
    that.speed = Math.random() * 20 + 20;
  }
};

module.exports = Animal;