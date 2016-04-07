var Particles = {
    create: function (camera) {
        var group = new THREE.Gyroscope();

        var rectLength = 0.001, rectWidth = 0.001;

        var rectMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8});
        var rectShape = new THREE.Shape();
        rectShape.moveTo( 0,0 );
        rectShape.lineTo( 0, rectWidth );
        rectShape.lineTo( rectLength, rectWidth );
        rectShape.lineTo( rectLength, 0 );
        rectShape.lineTo( 0, 0 );

        //var rectGeom = new THREE.ShapeGeometry( rectShape );
        //var rectGeom = new THREE.CircleGeometry( 0.001 );
        var rectGeom = new THREE.BoxGeometry( 0.001, 0.001, 0.001 );

        for ( var i = 0; i < 200; i ++ ) {
            var particle = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
            particle.position.x = Math.random() * 1 - 0.5;
            particle.position.y = Math.random() * 1 - 0.5;
            particle.position.z = Math.random() * 2 - 1;
            particle.scale = Math.random()*0.02;
            var rd = Math.random() * 10 + 10;
            var t =TweenMax.to(particle.position, rd, {x: (Math.random() * 0.2 - 0.1), y: (Math.random() * 0.2 - 0.1), z: (Math.random() * 0.1), ease: Quad.easeInOut, yoyo: true, repeat: -1});
            t.seek(rd/Math.random());
            var t = TweenMax.to(particle.material, (rd-5)/Math.random()/3, {opacity: 0, yoyo: true, repeat: -1});
            t.seek((rd-5)/Math.random()/3);
            group.add( particle );
        }

        camera.add(group);
    }
};

module.exports = Particles;
