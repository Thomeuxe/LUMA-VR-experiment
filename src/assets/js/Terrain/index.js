var dbg = require('debug')('luma:terrain');

var Terrain = {

    heightmapPath: "./assets/img/bump.jpg",
    texturePath: "./assets/img/topography.jpg",
    color: 0x006994,

    width: 1024,
    height: 1024,
    quality: 0.25,
    softness: 10,

    loadAssets: function(successCb, progressCb) {
        dbg('Load terrain assets');
        var _self = this;

        var iLoader = new THREE.ImageLoader();
        var tLoader = new THREE.TextureLoader();

        iLoader.load(Terrain.heightmapPath, function(img) {
            _self.heightmap = img;
            tLoader.load(Terrain.texturePath, function(texture) {
                _self.texture = texture;
                _self.assetsLoaded(successCb);
            }, function(event){
                _self.assetsLoading(event, progressCb, "Texture")
            }, function() {
                dbg('Error: load terrain texture');
            });
        }, function(event){
            _self.assetsLoading(event, progressCb, "Heightmap")
        }, function() {
            dbg('Error: load terrain heightmap');
        });
    },

    assetsLoaded: function(cb) {
        dbg('terrain assets loaded');
        cb();
    },

    assetsLoading: function(event, progressCb, key) {
        progressCb({
            key: 'terrain' + key,
            value: event.loaded / event.total
        })
    },

    create: function(scene) {
        dbg('create terrain');

        this.imgc = document.createElement("canvas");
        this.ictx = this.imgc.getContext("2d");

        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");

        cvs.width = this.heightmap.width;
        cvs.height = this.heightmap.height;
        ctx.drawImage(this.heightmap, 0, 0, this.heightmap.width, this.heightmap.height);

        this.imgc.width = Terrain.width * Terrain.quality;
        this.imgc.height = Terrain.height * Terrain.quality;
        this.ictx.drawImage(cvs, 0, 0, cvs.width, cvs.height, 0, 0, this.imgc.width, this.imgc.height);

        this.createMesh(
            this.createGeometry(this.imageDataMinMax(this.blur(Terrain.softness)).data),
            this.createMaterial(Terrain.color)
        );

        scene.add(this.mesh);

        return this.mesh;
    },

    createMesh: function(geometry, material) {
        dbg('create terrain : Mesh');
        this.mesh = new THREE.Mesh(geometry, material);

        return this.mesh;
    },

    createGeometry: function(data) {
        dbg('create terrain : Geometry');
        this.geometry = new THREE.PlaneBufferGeometry(Terrain.width, Terrain.height, this.imgc.width - 1, this.imgc.height - 1);
        this.geometry.rotateX(- Math.PI / 2);

        for (var i = 0, j = 0, l = this.geometry.attributes.position.array.length - 1; i < l; i += 3, j += 4) {
            this.geometry.attributes.position.array[i + 1] = data[j];
        }

        return this.geometry;
    },

    imageDataMinMax: function(image) {
        var m = this.imgc.width;
        var n = this.imgc.height;

        // find range
        var minimum = 1000000000000000000;
        var maximum = 0;
        var first = true;
        var d = 0;

        for (var i=0; i<n*m; i++) {
            try {d = image[i]}
            catch(e) {console.log(e); console.log("i: "+i); console.log("image: "+image); break}

            minimum = Math.min(minimum, d);
            maximum = Math.max(maximum, d);

            if (i == m*n-1) first = false;
        }

        var finalImage = this.ictx.createImageData(m, n);
        var data = finalImage.data;   // pixel data array of (width*height*4) elements
        var ceil = 255;
        var floor = 0;

        var newmin = 1000000000000000;
        var newmax = 0;

        // Convert to visible
        for (var i = 0; i < n * m; i++) {
            d = image[i];
            normd = ((ceil - floor) * (d - minimum))/(maximum - minimum) + floor;
            newmin = Math.min(newmin, normd);
            newmax = Math.max(newmax, normd);
            data[i*4]   = normd; //r
            data[i*4+1] = normd; //g
            data[i*4+2] = normd; //b
            data[i*4+3] = 255;    //a
        }

        this.ictx.putImageData(finalImage, 0, 0);

        return finalImage;
    },

    createTexture: function() {
        dbg('create terrain : Texture');
        this.texture.mapping = THREE.SphericalReflectionMapping;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(8, 8);

        return this.texture;
    },

    createMaterial: function(color) {
        dbg('create terrain : Material');
        this.material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 0,
            map: this.createTexture()
        });

        return this.material;
    },

    blur: function(radius) {
        var imageData = this.imageData();

        if (isNaN(radius) || radius < 1) return this.image(imageData);
        radius |= 0;

        return this.image(StackBlur.imageDataRGB(imageData, 0, 0, this.imgc.width, this.imgc.height, radius));
    },

    imageData: function() {
        var data;

        try {
            data = this.ictx.getImageData(0, 0, this.imgc.width, this.imgc.height);
        } catch(e) {
            throw new Error("unable to access local image data: " + e);
        }

        return data;
    },

    image: function(imageData) {
        var data = imageData.data;
        var image = new Array(this.imgc.width * this.imgc.height);

        for (var i = 0; i < this.imgc.height * this.imgc.width; i++) {
            image[i] = data[i*4];
        }

        return image;
    }
};

module.exports = Terrain;