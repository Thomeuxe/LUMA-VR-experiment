var Renderer = {
    create: function() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        return this.renderer;
    },
    
    setCardboardEffect: function() {
        this.cbEffect = new THREE.CardboardEffect( this.renderer );
        this.cbEffect.setSize( window.innerWidth, window.innerHeight );

        return this.cbEffect;
    }
};

module.exports = Renderer;
