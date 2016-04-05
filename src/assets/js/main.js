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
var monkey = require('./Models').test(scene);

var lights = require('./Models/lights.js');

lights.addAsChild(camera, scene);

var controls = require('./Controls');
var rotationControls;
var fRenderer;

if(supports.isMobile()) {
    rotationControls = controls.create(camera);
    controls.initTouchMovements(camera);

    fRenderer = rendererUtils.setCardboardEffect();
} else {
    rotationControls = controls.createMouse(camera, renderer);
    fRenderer = renderer;
}

var raycaster = require('./Controls/raycaster.js').create(scene, camera);

var UI = require('./UI');

console.log(scene);

/**
 * FullScreen Toggle Button
 */
var toggleFullScreenBtn = document.getElementById('toggleFullScreenBtn');
toggleFullScreenBtn.addEventListener('click', toggleFullScreen);
function toggleFullScreen (){
    var domElem = renderer.domElement;
    if (domElem.requestFullscreen) {
        domElem.requestFullscreen();
    } else if (domElem.mozRequestFullScreen) {
        domElem.mozRequestFullScreen();
    } else if (domElem.webkitRequestFullscreen) {
        domElem.webkitRequestFullscreen();
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
    requestAnimationFrame(render);

    rotationControls.update();
    raycaster.update();

    fRenderer.render(scene, camera);
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
