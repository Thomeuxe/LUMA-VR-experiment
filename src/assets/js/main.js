var scene = require('./Utils/Scene').create();
var camera = require('./Utils/Camera').create();
var renderer = require('./Utils/Renderer').create();

var terrain = require('./Terrain');
var sounds = require('./Sounds');
var controls = require('./Controls');
var UI = require('./UI');

var render = function() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

render();
