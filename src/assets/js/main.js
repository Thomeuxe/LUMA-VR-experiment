var Supports = require('./Utils/Supports');
var Scene = require('./Utils/Scene');
var Camera = require('./Utils/Camera');
var Listener = require('./Utils/Listener');
var Renderer = require('./Utils/Renderer');
var Ui = require('./UI');

var Terrain = require('./Terrain');
var Sounds = require('./Sounds');
var Fish = require('./Models/fish.js');
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
        Fish.loadAssets(this.createFishes.bind(this));
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
            var fishName = fishList[i].name;
            this.fishes.push(Fish.create(this.scene, this.listener, fishName));
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
        this.gauge.update();
    }

};

var app = App.init();
app.render();