var Terrain = {

    create: function(scene, camera, renderer) {

        var width = 128;
        var height = 128;
        var midWidth = width / 2;
        var midHeight = height / 2;

        var data = this.generateHeight(width, height);
        camera.position.y = data[ midWidth + midHeight * midWidth ] * 10 + 500;

        var geometry = new THREE.PlaneBufferGeometry( 3500, 3500, width - 1, height - 1 );
        geometry.rotateX( - Math.PI / 2 );

        var vertices = geometry.attributes.position.array;

        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
            vertices[ j + 1 ] = data[ i ] * 10;
        }

        var texture = new THREE.CanvasTexture( this.generateTexture( data, width, height ) );
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        //mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        var texture = new THREE.TextureLoader().load( './assets/img/topography.jpg' );
        texture.mapping = THREE.SphericalReflectionMapping;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x006994, shininess: 0, map: texture } ) );
        scene.add( mesh );

        //this.createSkyBox(scene);

        return mesh;
    },

    generateHeight: function(width, height) {
        var size = width * height, data = new Uint8Array( size ),
            perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 5;

        for ( var j = 0; j < 4; j ++ ) {

            for ( var i = 0; i < size; i ++ ) {

                var x = i % width, y = ~~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

            }

            quality *= 5;

        }

        return data;
    },

    generateTexture: function(data, width, height) {

        var canvas, canvasScaled, context, image, imageData,
            level, diff, vector3, sun, shade;

        vector3 = new THREE.Vector3( 0, 0, 0 );

        sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();

        canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;

        for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

            vector3.x = data[ j - 2 ] - data[ j + 2 ];
            vector3.y = 2;
            vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
            vector3.normalize();

            shade = vector3.dot( sun );

            imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        }

        context.putImageData( image, 0, 0 );

        // Scaled 4x

        canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );

        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;

        for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

            var v = ~~ ( Math.random() * 5 );

            imageData[ i ] += v;
            imageData[ i + 1 ] += v;
            imageData[ i + 2 ] += v;

        }

        context.putImageData( image, 0, 0 );

        return canvasScaled;
    },

    createSkyBox: function(scene) {
        var urlPrefix	= "./assets/js/Terrain/";

        var materials = [
            urlPrefix + "posx.jpg",
            urlPrefix + "negx.jpg",
            urlPrefix + "posy.jpg",
            urlPrefix + "negy.jpg",
            urlPrefix + "posz.jpg",
            urlPrefix + "negz.jpg"
        ];

        var skyGeometry = new THREE.CubeGeometry( 50, 50, 50 );

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( materials[i] ),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
    }
};
module.exports = Terrain;