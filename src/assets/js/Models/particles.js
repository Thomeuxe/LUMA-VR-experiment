var Particles = {
    create: function (camera) {
        var group = new THREE.Object3D();

        for ( var i = 0; i < 100; i ++ ) {
            var particle = new THREE.Mesh(new THREE.CircleGeometry(0.001), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
            particle.position.x = Math.random() * 1 - 0.5;
            particle.position.y = Math.random() * 1 - 0.5;
            particle.position.z = -Math.random() * 2;
            particle.scale = Math.random()*0.01;
            var rd = Math.random() * 10 + 10;
            var t =TweenMax.to(particle.position, rd, {x: (Math.random() * 0.2 - 0.1), y: (Math.random() * 0.2 - 0.1), z: (Math.random() * 0.1), ease: Linear.easeNone, yoyo: true, repeat: -1});
            t.seek(rd/Math.random());
            var t = TweenMax.to(particle.material, (rd-5)/Math.random()/3, {opacity: 0, yoyo: true, repeat: -1});
            t.seek((rd-5)/Math.random()/3);
            group.add( particle );
        }

        camera.add(group);
    }
};

module.exports = Particles;
