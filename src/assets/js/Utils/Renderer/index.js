var Renderer = {
    create: function() {
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio ? window.devicePixelRatio : 1, 2));

        document.getElementById('wrapper').appendChild(this.renderer.domElement);

        return this.renderer;
    },
    
    setCardboardEffect: function() {
        this.cbEffect = new THREE.CardboardEffect( this.renderer );
        this.cbEffect.setSize( window.innerWidth, window.innerHeight );

        return this.cbEffect;
    },

    handleResize: function () {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
};

module.exports = Renderer;
