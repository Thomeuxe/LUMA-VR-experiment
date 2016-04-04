var supports = require('./Utils/Supports');

var scene = require('./Utils/Scene').create();
var cameraUtils = require('./Utils/Camera');
var camera = cameraUtils.create();
var listenerUtils = require('./Utils/Listener');
var listener = listenerUtils.create(camera);
var rendererUtils = require('./Utils/Renderer');
var renderer = rendererUtils.create();

var terrain = require('./Terrain').create(scene, camera, renderer);
var sounds = require('./Sounds').create(listener);
var monkey = require('./Models').test(scene);

var controls;
var fRenderer;

if(supports.isMobile()) {
    controls = require('./Controls').create(camera);
    fRenderer = rendererUtils.setCardboardEffect();
} else {
    controls = require('./Controls').createMouse(camera, renderer);
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

    controls.update();
    raycaster.update();

    fRenderer.render(scene, camera);
};


var mouse = new THREE.Vector2();

function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );

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
