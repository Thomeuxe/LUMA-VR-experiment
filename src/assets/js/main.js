var scene = require('./Utils/Scene').create();
var camera = require('./Utils/Camera').create();
var listener = require('./Utils/Listener').create(camera);
var renderer = require('./Utils/Renderer').create();

var terrain = require('./Terrain').create(scene, camera, renderer);
var sounds = require('./Sounds').create(listener);
var controls = require('./Controls').create(camera);
var UI = require('./UI');

var render = function() {
    requestAnimationFrame(render);

    controls.update();
    renderer.render(scene, camera);
};

render();
