var Particles = {
    create: function (camera) {
        var group = new THREE.Object3D();

        for ( var i = 0; i < 200; i ++ ) {
            var particle = new THREE.Mesh(new THREE.CircleGeometry(0.001), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
            particle.position.x = Math.random() * 2 - 1;
            particle.position.y = Math.random() * 2 - 1;
            particle.position.z = -Math.random() * 2;
            particle.scale = Math.random()*0.01;
            TweenMax.to(particle.position, Math.random() * 10 + 10, {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1), z: (Math.random() * 2 - 1), ease: Linear.easeNone, yoyo: true, repeat: -1});
            TweenMax.to(particle.material, Math.random() * 10 + 10, {opacity: 0, yoyo: true, repeat: -1});
            group.add( particle );
        }

        camera.add(group);
    }
};

module.exports = Particles;
