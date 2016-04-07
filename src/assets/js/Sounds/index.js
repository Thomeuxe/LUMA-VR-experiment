var Sounds = {
  value: 0,
  max: 11000,
  create: function(listener, camera) {
    this.listener = listener;
    this.camera = camera;

    this.initAtmosphere();
    this.initHeartBeats();

    return this;
  },
  initAtmosphere: function () {
    this.atmosphere = new THREE.Audio( this.listener );
    this.atmosphere.load( 'assets/sounds/atmosphere.mp3' );
    this.atmosphere.autoplay = true;
    this.atmosphere.setLoop(true);
    this.atmosphere.setVolume(0.5);
  },
  initHeartBeats: function () {
    this.heartBeats = new THREE.Audio( this.listener );
    this.heartBeats.load( 'assets/sounds/heart_beats.mp3' );
    this.heartBeats.autoplay = true;
    this.heartBeats.setLoop(true);
    this.heartBeats.setVolume(2);
  },
  initVoiceSynthesis: function() {
    var request = new XMLHttpRequest();
    request.open('GET', '/assets/js/Sounds/data/depth.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        this.depthData = JSON.parse(request.responseText);
        this.depthArray = _.map(this.depthData, function(el) {
          return el.depth;
        });
        this.speech = new SpeechSynthesisUtterance();
        this.speech.lang = "en-US";
      } else {
        this.depthData = {};
        this.depthArray = [];
      }
    }.bind(this);

    request.onerror = function() {
      console.log("Loading audio data file error");
    };

    request.send();
  },
  update: function() {
    if(!window.speechSynthesis.talking) {
      var depth = Math.round(this.camera.position.y) - this.max;
      if (this.depthArray.indexOf(depth) != -1) {

        this.speech.text = _.find(this.depthData, function (o) {
          return o.depth == depth;
        }).message;

        if (!window.speechSynthesis.talking)
          window.speechSynthesis.speak(this.speech);
      }
    }
  }
};

module.exports = Sounds;