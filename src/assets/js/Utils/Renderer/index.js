var Renderer = {
    create: function() {
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        
        document.body.appendChild(this.renderer.domElement);

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
