var Renderer = {
    create: function() {
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        return renderer;
    }
};

module.exports = Renderer;
