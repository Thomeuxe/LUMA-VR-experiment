var scene = require('./Utils/Scene').create();
var camera = require('./Utils/Camera').create();
var listener = require('./Utils/Listener').create(camera);
var rendererUtils = require('./Utils/Renderer');
var renderer = rendererUtils.create();
var cbEffect = rendererUtils.setCardboardEffect();

var terrain = require('./Terrain').create(scene, camera, renderer);
var sounds = require('./Sounds').create(listener);
var monkey = require('./Models').test(scene);
var controls = require('./Controls').create(camera);
var mouseControls = require('./Controls').createMouse(camera, renderer);
var UI = require('./UI');

console.log(scene);

var toggleFullScreenBtn = document.getElementById('toggleFullScreen');
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

var render = function() {
    requestAnimationFrame(render);

    controls.update();
    //mouseControls.update();

    cbEffect.render(scene, camera);
};

render();
