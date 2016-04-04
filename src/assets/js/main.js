var scene = require('./Utils/Scene').create();
var camera = require('./Utils/Camera').create();
var renderer = require('./Utils/Renderer').create();

var terrain = require('./Terrain').create(scene, camera, renderer);

var monkey = require('./Models').test(scene);

var sounds = require('./Sounds').create();
var controls = require('./Controls').create(camera);
var UI = require('./UI');

console.log(scene);

var render = function() {
    requestAnimationFrame(render);

    controls.update();
    renderer.render(scene, camera);
};

render();
