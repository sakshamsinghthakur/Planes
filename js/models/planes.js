Planes = (function() {

    function Planes(cSettings) {
        this.m_cSettings = cSettings;
        this.m_cObjectContainer = null;
        this.m_aPlanes = {
            current: null,
            previous: null,
            next: null
        };
        _inti.call(this);
    }

    function _init() {
        var common = (this.m_nWidth / 2) - (distFromCamera * Math.tan(fi - hFOV / 2));
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
                value: common / this.m_nWidth
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
                value: common / this.m_nWidth
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
                value: common / this.m_nWidth
            }
        };

        var geometry = new THREE.PlaneGeometry( _this.m_nWidth, _this.m_nHeight, 32 );
        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true,
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        _this.m_aPlanes.current = new THREE.Mesh(geometry, material);

        geometry = new THREE.PlaneGeometry( _this.m_nWidth, _this.m_nHeight, 32 );
        material = new THREE.ShaderMaterial({
            uniforms: uniforms1,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true,
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        _this.m_aPlanes.previous = new THREE.Mesh(geometry, material);

        geometry = new THREE.PlaneGeometry( _this.m_nWidth, _this.m_nHeight, 32 );
        material = new THREE.ShaderMaterial({
            uniforms: uniforms2,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true,
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        _this.m_aPlanes.next = new THREE.Mesh(geometry, material);

        _this.m_cObjectContainer.add(_this.m_aPlanes.current);
        _this.m_cObjectContainer.add(_this.m_aPlanes.previous);
        _this.m_cObjectContainer.add(_this.m_aPlanes.next);
    }

    Planes.prototype = {

        createPlanes: function() {

        },

        getPlanes: function() {
            return this.m_cObjectContainer;
        }

    };

})();
