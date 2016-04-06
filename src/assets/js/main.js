var Supports = require('./Utils/Supports');
var Scene = require('./Utils/Scene');
var Camera = require('./Utils/Camera');
var Listener = require('./Utils/Listener');
var Renderer = require('./Utils/Renderer');
var Ui = require('./UI');

var Terrain = require('./Terrain');
var Sounds = require('./Sounds');
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
        this.scene = Scene.create();
        this.camera = Camera.create();
        this.listener = Listener.create(this.camera);
        this.renderer = Renderer.create();
        this.fishes = [];
        this.rockbasses = [];
        this.catfishes = [];
        this.jellyfishes = [];
        this.progressStatus = [];
        Ui.createTarget(this.camera);

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
            toggleFullScreenBtn: document.getElementById('playBtn'),
            toggleAudioBtn: document.getElementById('toggleAudioBtn'),
            wrapper: document.getElementById('wrapper'),
            window: window
        };
    },

    initEvents: function() {
        dbg('initialize events');
        this.$els.toggleFullScreenBtn.addEventListener('click', this.toggleFullScreen.bind(this));
        this.$els.toggleAudioBtn.addEventListener('click', this.toggleAudio.bind(this));
        this.$els.window.addEventListener('resize', this.onWindowResize.bind(this), false );
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
        Fish.loadAssets(this.createFishes.bind(this), this.assetsLoadingProgress.bind(this));
        Rockbass.loadAssets(this.createRockbass.bind(this), this.assetsLoadingProgress.bind(this));
        Catfish.loadAssets(this.createCatfish.bind(this), this.assetsLoadingProgress.bind(this));
        Jellyfish.loadAssets(this.createJellyfish.bind(this), this.assetsLoadingProgress.bind(this));
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
        dbg('Global asset loading progress', percentage);
    },

    launch: function() {
        dbg('launch');
        this.scene.add(this.camera);
        this.sound = Sounds.create(this.listener);
    },

    createElements: function() {
        dbg('create elements');
        Lights.addAsChild(this.camera, this.scene);
        Lantern.attachAsChild(this.scene);
        this.gauge = Gauge.create(this.camera);
        this.terrain = Terrain.create(this.scene, this.camera, this.renderer);
        this.particles = Particles.create(this.camera);
        this.raycaster = Raycaster.create(this.scene, this.camera, Ui, this.terrain);
    },

    createFishes: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            var fishName = fishList[i].name + ' the fish';
            this.fishes.push(Fish.create(this.scene, this.listener, fishName));
        }
    },

    createRockbass: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            var fishName = fishList[i].name + ' the rockbass';
            this.rockbasses.push(Rockbass.create(this.scene, this.listener, fishName));
        }
    },

    createCatfish: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            var fishName = fishList[i].name + ' the catfish';
            this.catfishes.push(Catfish.create(this.scene, this.listener, fishName));
        }
    },

    createJellyfish: function() {
        for(var i = 0 ; i < fishList.length; i++) {
            var fishName = fishList[i].name + ' the jellyfish';
            this.jellyfishes.push(Jellyfish.create(this.scene, this.listener, fishName));
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

        this.rotationControls.update();
        //touchControls.update();
        this.raycaster.update();
        Camera.render();

        this.renderer.render(this.scene, this.camera);

        Fish.update(this.fishes, delta);
        Rockbass.update(this.rockbasses, delta);
        Catfish.update(this.catfishes, delta);
        Jellyfish.update(this.jellyfishes, delta);
        this.gauge.update();
    }
};

var app = App.init();
app.render();