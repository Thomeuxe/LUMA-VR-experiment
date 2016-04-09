var Supports = require('./Utils/Supports');
var Scene = require('./Utils/Scene');
var Camera = require('./Utils/Camera');
var Listener = require('./Utils/Listener');
var Renderer = require('./Utils/Renderer');
var Ui = require('./UI');

var Terrain = require('./Terrain');
var Sounds = require('./Sounds');
var Animal = require('./Models/animal.js');
var Fish = require('./Models/fish.js');
var Rockbass = require('./Models/rockbass.js');
var Jellyfish = require('./Models/jellyfish.js');
var Catfish = require('./Models/catfish.js');
var Particles = require('./Models/particles.js');
var Lights = require('./Models/lights.js');
var Lantern = require('./Models/lantern.js');
var Gauge = require('./UI/gauge.js');
var Controls = require('./Controls');
var Raycaster = require('./Controls/raycaster.js');

var fishList = require('./fishList');
var dbg = require('debug')('luma:app');

// Enable debug
window.myDebug = require("debug");

var App = {

    init:function() {
        dbg('init');
        this.isPlaying = false;
        this.scene = Scene.create();
        this.camera = Camera.create();
        this.listener = Listener.create(this.camera);
        this.renderer = Renderer.create();
        this.animals = [];
        this.progressStatus = [];

        this.clock = new THREE.Clock();

        this.initElements();
        this.initEvents();
        this.getDevice();
        this.launch();
        this.createElements();
        this.initAssets();

        return this;
    },

    initElements: function() {
        dbg('initialize elements');
        this.$els = {
            onboarding: document.getElementById('onboarding'),
            playBtn: document.getElementById('playBtn'),
            toggleAudioBtn: document.getElementById('toggleAudioBtn'),
            wrapper: document.getElementById('wrapper'),
            window: window
        };
    },

    initEvents: function() {
        dbg('initialize events');

        // Listen for fullscreen change events
        document.addEventListener('webkitfullscreenchange', this.onFullScreenChange.bind(this), false);
        document.addEventListener('mozfullscreenchange', this.onFullScreenChange.bind(this), false);
        document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this), false);
        document.addEventListener('MSFullscreenChange', this.onFullScreenChange.bind(this), false);

        this.$els.playBtn.addEventListener('click', this.play.bind(this));
        this.$els.toggleAudioBtn.addEventListener('click', this.toggleAudio.bind(this));
        this.$els.window.addEventListener('resize', this.onWindowResize.bind(this), false );
    },

    play: function () {
        this.toggleFullScreen();

        if(!this.isPlaying) {
            this.createUI();
            Sounds.initVoiceSynthesis();
            this.isPlaying = true;
        }
    },

    onFullScreenChange: function () {
        document.isFullScreen = document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
        if (document.isFullScreen) {
            this.$els.onboarding.style.display = 'none';
            this.showUI();
        } else {
            this.$els.onboarding.style.display = 'initial';
            this.hideUI();
        }
    },

    toggleFullScreen: function() {
        Ui.toggleFullScreen(this.$els.wrapper,  Supports);
    },

    toggleAudio: function() {
        Ui.toggleAudio(Listener);
    },

    onWindowResize: function() {
        Ui.onWindowResize(Camera, Renderer);
    },

    initAssets: function() {
        dbg('load assets');
        Terrain.loadAssets(this.createTerrain.bind(this), this.assetsLoadingProgress.bind(this));
        Fish.loadObjectAssets('assets/js/Models/skinned/fish.json', this.createFishes.bind(this), this.assetsLoadingProgress.bind(this));
        Rockbass.loadJSONAssets('assets/js/Models/skinned/rockbass.json', this.createRockbass.bind(this), this.assetsLoadingProgress.bind(this));
        Catfish.loadJSONAssets('assets/js/Models/skinned/catfish.json', this.createCatfish.bind(this), this.assetsLoadingProgress.bind(this));
        Jellyfish.loadJSONAssets('assets/js/Models/skinned/jellyfish.json', this.createJellyfish.bind(this), this.assetsLoadingProgress.bind(this));
    },

    assetsLoadingProgress: function(progress) {
        this.progressStatus[progress.key] = progress.value;
        var sum = 0;
        var divider = 0;
        for(var key in this.progressStatus) {
            sum += this.progressStatus[key];
            divider ++;
        }
        var percentage = sum / divider;
        TweenMax.to("#logo-overlay", 0.2, {right: (100 - percentage*100) + "%"});
        TweenMax.to("#logo-background", 0.2, {webkitClipPath:'inset(0 ' + (100 - percentage*100) +'% 0 0)'});

        if(percentage == 1)
            TweenMax.set("#logo-overlay", {autoAlpha: 0});

        dbg('Global asset loading progress', percentage);
    },

    launch: function() {
        dbg('launch');
        this.scene.add(this.camera);
        this.sound = Sounds.create(this.listener, this.camera);
    },

    createElements: function() {
        dbg('create elements');
        Lights.addAsChild(this.camera, this.scene);
        Lantern.attachAsChild(this.scene);
        this.particles = Particles.create(this.camera);
    },

    createTerrain: function() {
        dbg('create terrain');
        this.terrain = Terrain.create(this.scene, this.camera);
        this.raycaster = Raycaster.create(this.scene, this.camera, Ui, this.terrain);
    },

    createUI: function() {
        this.gauge = Gauge.create(this.camera, Ui);
        this.target = Ui.createTarget(this.camera);
    },

    showUI: function () {
        this.gauge.location.visible = true;
        this.gauge.locationText.visible = true;
        this.gauge.marker.visible = true;
        this.target.visible = true;
    },

    hideUI: function () {
        this.gauge.location.visible = false;
        this.gauge.locationText.visible = false;
        this.gauge.marker.visible = false;
        this.target.visible = false;
    },

    createFishes: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            this.animals.push(Fish.create(this.scene, this.listener));
        }
    },

    createRockbass: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            this.animals.push(Rockbass.create(this.scene, this.listener));
        }
    },

    createCatfish: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            this.animals.push(Catfish.create(this.scene, this.listener));
        }
    },

    createJellyfish: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            this.animals.push(Jellyfish.create(this.scene, this.listener));
        }
    },

    getDevice: function() {
        dbg('get device');
        touchControls = Controls.initTouchMovements(this.camera);

        if(Supports.isMobile()) {
            this.rotationControls = Controls.create(this.camera);
            this.renderer = Renderer.setCardboardEffect();
        } else {
            this.rotationControls = Controls.createMouse(this.camera, this.renderer);
        }
    },

    render: function() {
        var delta = 0.75 * this.clock.getDelta();

        requestAnimationFrame(this.render.bind(this));

        if(this.isPlaying) {
            this.rotationControls.update();
            //touchControls.update();
            if (this.raycaster) this.raycaster.update();
        }
        Camera.render();

        this.renderer.render(this.scene, this.camera);

        Animal.update(this.animals, delta);

        if(this.isPlaying) {
            this.gauge.update();
            Sounds.update();
        }
    }
};

var app = App.init();
app.render();