var supports = require('./Utils/Supports');

var scene = require('./Utils/Scene').create();
var cameraUtils = require('./Utils/Camera');
var camera = cameraUtils.create();
scene.add(camera);
var listenerUtils = require('./Utils/Listener');
var listener = listenerUtils.create(camera);
var rendererUtils = require('./Utils/Renderer');
var renderer = rendererUtils.create();

var terrain = require('./Terrain').create(scene, camera, renderer);
var sounds = require('./Sounds').create(listener);
var Fish = require('./Models/fish.js');
Fish.setScene(scene);

var lights = require('./Models/lights.js');

lights.addAsChild(camera, scene);

var controls = require('./Controls');
var touchControls;
var rotationControls;
var fRenderer;

touchControls = controls.initTouchMovements(camera);

if(supports.isMobile()) {
    rotationControls = controls.create(camera);

    fRenderer = rendererUtils.setCardboardEffect();
} else {
    rotationControls = controls.createMouse(camera, renderer);
    fRenderer = renderer;
}

var UI = require('./UI');
UI.createTarget(camera);

var raycaster = require('./Controls/raycaster.js').create(scene, camera, UI);

var clock = new THREE.Clock();

console.log(scene);

/**
 * Create model instances
 */

var fish = new Fish(scene);
var fish2 = new Fish(scene);


/**
 * FullScreen Toggle Button
 */
var toggleFullScreenBtn = document.getElementById('playBtn');
toggleFullScreenBtn.addEventListener('click', toggleFullScreen);
function toggleFullScreen (){
    var domElem = document.getElementById('wrapper');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (domElem.requestFullscreen) {
            domElem.requestFullscreen();
        } else if (domElem.mozRequestFullScreen) {
            domElem.mozRequestFullScreen();
        } else if (domElem.webkitRequestFullscreen) {
            domElem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    if(supports.isMobile()) {
        screen.orientation.lock("landscape-primary");
    }
}

/**
 * Audio Toggle Button
 */
var toggleAudioBtn = document.getElementById('toggleAudioBtn');
toggleAudioBtn.addEventListener('click', toggleAudio);
function toggleAudio(){
    listenerUtils.toggle();
}

/**
 * Render
 */
var render = function() {
    var delta = 0.75 * clock.getDelta();

    requestAnimationFrame(render);

    rotationControls.update();
    //touchControls.update();
    raycaster.update();
    cameraUtils.render();

    fRenderer.render(scene, camera);

    Fish.update(delta);
};

render();

/**
 * On Window Resize
 */
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    cameraUtils.handleResize();
    rendererUtils.handleResize();
    //controls.handleResize();
}
