ImagePlanes = (function() {

    function ImagePlanes(cSettings, hFOV) {
        this.m_cSettings = cSettings;
        this.m_cObjectContainer = null;
        this.m_rhFOV = hFOV;
        this.m_aPlanes = {
            current: null,
            previous: null,
            next: null
        };
        this.m_nCurrPlaneIndex = 0;
        _init.call(this);
    }

    function _init() {
        this.m_cObjectContainer = new THREE.Object3D();
        var common = (this.m_cSettings.width / 2) - (this.m_cSettings.distFromCamera * Math.tan(this.m_cSettings.fi - this.m_rhFOV / 2));
        var uniforms = {
            opacity: {
                type: 'f',
                value: 1.0
            },
            map: {
                type: 't',
                value: null
            },
            direction: {
                type: 'i',
                value: -1
            },
            overlap: {
                type: 'f',
                value: common / this.m_cSettings.width
            }
        };

        var uniforms1 = {
            opacity: {
                type: 'f',
                value: 1.0
            },
            map: {
                type: 't',
                value: null
            },
            direction: {
                type: 'i',
                value: -1
            },
            overlap: {
                type: 'f',
                value: common / this.m_cSettings.width
            }
        };

        var uniforms2 = {
            opacity: {
                type: 'f',
                value: 1.0
            },
            map: {
                type: 't',
                value: null
            },
            direction: {
                type: 'i',
                value: -1
            },
            overlap: {
                type: 'f',
                value: common / this.m_cSettings.width
            }
        };

        var geometry = new THREE.PlaneGeometry( this.m_cSettings.width, this.m_cSettings.height, 32 );
        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true,
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        this.m_aPlanes.current = new THREE.Mesh(geometry, material);

        geometry = new THREE.PlaneGeometry( this.m_cSettings.width, this.m_cSettings.height, 32 );
        material = new THREE.ShaderMaterial({
            uniforms: uniforms1,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true,
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        this.m_aPlanes.previous = new THREE.Mesh(geometry, material);

        geometry = new THREE.PlaneGeometry( this.m_cSettings.width, this.m_cSettings.height, 32 );
        material = new THREE.ShaderMaterial({
            uniforms: uniforms2,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true,
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        this.m_aPlanes.next = new THREE.Mesh(geometry, material);

        this.m_cObjectContainer.add(this.m_aPlanes.current);
        this.m_cObjectContainer.add(this.m_aPlanes.previous);
        this.m_cObjectContainer.add(this.m_aPlanes.next);
    }

    ImagePlanes.prototype = {

        createPlanes: function() {
            this.m_nCurrPlaneIndex = 0;
            var texture = THREE.ImageUtils.loadTexture("./images/0.jpg");
            this.m_aPlanes.current.material.uniforms.map.value = texture;
            this.m_aPlanes.current.index = 0;
            this.m_aPlanes.current.position.set(0, 0, -this.m_cSettings.distFromCamera);

            texture = THREE.ImageUtils.loadTexture("./images/1.jpg");
            this.m_aPlanes.next.material.uniforms.map.value = texture;
            this.m_aPlanes.next.material.uniforms.opacity.value = 0.0;
            this.m_aPlanes.next.index = 1;
            this.m_aPlanes.next.position.set(this.m_cSettings.distFromCamera * Math.cos(this.m_cSettings.theta + this.m_cSettings.fi), 0, this.m_cSettings.distFromCamera * Math.sin(this.m_cSettings.theta + this.m_cSettings.fi));
            this.m_aPlanes.next.rotation.y -= this.m_cSettings.fi;

            texture = THREE.ImageUtils.loadTexture("./images/" + (this.m_cSettings.numberOfImages - 1) + ".jpg");
            this.m_aPlanes.previous.material.uniforms.map.value = texture;
            this.m_aPlanes.previous.material.uniforms.opacity.value = 0.0;
            this.m_aPlanes.previous.index = this.m_cSettings.numberOfImages - 1;
            this.m_aPlanes.previous.position.set(this.m_cSettings.distFromCamera * Math.cos(this.m_cSettings.theta - this.m_cSettings.fi), 0, this.m_cSettings.distFromCamera * Math.sin(this.m_cSettings.theta - this.m_cSettings.fi));
            this.m_aPlanes.previous.rotation.y += this.m_cSettings.fi;
        },

        getPlanes: function() {
            return this.m_cObjectContainer;
        },

        goToNext: function() {
            var nextIndex;
            this.m_nCurrPlaneIndex = this.m_aPlanes.next.index;
            if(this.m_nCurrPlaneIndex === this.m_cSettings.numberOfImages - 1) {
                nextIndex = 0;
            } else {
                nextIndex = this.m_nCurrPlaneIndex + 1;
            }

            var nextPlane = this.m_aPlanes.previous;
            this.m_aPlanes.previous = this.m_aPlanes.current;
            this.m_aPlanes.current = this.m_aPlanes.next;

            var texture = THREE.ImageUtils.loadTexture("./images/" + nextIndex + ".jpg");
            nextPlane.material.uniforms.map.value = texture;
            nextPlane.position.set(this.m_cSettings.distFromCamera * Math.cos(this.m_cSettings.theta - this.m_aPlanes.current.rotation.y + this.m_cSettings.fi), 0, this.m_cSettings.distFromCamera * Math.sin(this.m_cSettings.theta - this.m_aPlanes.current.rotation.y + this.m_cSettings.fi));
            nextPlane.rotation.y = this.m_aPlanes.current.rotation.y - this.m_cSettings.fi;
            this.m_aPlanes.next = nextPlane;
            this.m_aPlanes.next.index = nextIndex;
        },

        goToPrevious: function() {
            var prevIndex;
            this.m_nCurrPlaneIndex = this.m_aPlanes.previous.index;
            if(this.m_nCurrPlaneIndex === 0) {
                prevIndex = this.m_cSettings.numberOfImages - 1;
            } else {
                prevIndex = this.m_nCurrPlaneIndex - 1;
            }

            var prevPlane = this.m_aPlanes.next;
            this.m_aPlanes.next = this.m_aPlanes.current;
            this.m_aPlanes.current = this.m_aPlanes.previous;

            var texture = THREE.ImageUtils.loadTexture("./images/" + prevIndex + ".jpg");
            prevPlane.material.uniforms.map.value = texture;
            prevPlane.position.set(this.m_cSettings.distFromCamera * Math.cos(this.m_cSettings.theta - this.m_aPlanes.current.rotation.y - this.m_cSettings.fi), 0, this.m_cSettings.distFromCamera * Math.sin(this.m_cSettings.theta - this.m_aPlanes.current.rotation.y - this.m_cSettings.fi));
            prevPlane.rotation.y = this.m_aPlanes.current.rotation.y + this.m_cSettings.fi;
            this.m_aPlanes.previous = prevPlane;
            this.m_aPlanes.previous.index = prevIndex;
        }

    };

    return ImagePlanes;
})();
