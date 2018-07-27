Main = (function() {

    var numberOfImages = 8,
        _this,
        vFOV,
        hFOV,
        aspect,
        distFromCamera = 1200,
        fi = Math.PI * (36 / 180),
        currPlaneIndex = 0,
        previous = false,
        next = false,
        theta = -Math.PI / 2,
        isTweening = false,
        common,
        _transitionCenter = {
            x: 0,
            z: 0
        };

    function Main() {
        this.m_cRenderer = null;
        this.m_rFOV = 60;
        this.m_aPlanes = {
            current: null,
            previous: null,
            next: null
        };
        _init.call(this);
    }

    function _init() {
        _this = this;
    }

    function _createPlanes() {
        currPlaneIndex = 0;
        var texture = THREE.ImageUtils.loadTexture("./images/0.jpg");
        _this.m_aPlanes.current.material.uniforms.map.value = texture;
        _this.m_aPlanes.current.index = 0;
        _this.m_aPlanes.current.position.set(0, 0, -distFromCamera);

        texture = THREE.ImageUtils.loadTexture("./images/1.jpg");
        _this.m_aPlanes.next.material.uniforms.map.value = texture;
        _this.m_aPlanes.next.material.uniforms.opacity.value = 0.0;
        _this.m_aPlanes.next.index = 1;
        _this.m_aPlanes.next.position.set(distFromCamera * Math.cos(theta + fi), 0, distFromCamera * Math.sin(theta + fi));
        _this.m_aPlanes.next.rotation.y -= fi;

        texture = THREE.ImageUtils.loadTexture("./images/" + (numberOfImages - 1) + ".jpg");
        _this.m_aPlanes.previous.material.uniforms.map.value = texture;
        _this.m_aPlanes.previous.material.uniforms.opacity.value = 0.0;
        _this.m_aPlanes.previous.index = numberOfImages - 1;
        _this.m_aPlanes.previous.position.set(distFromCamera * Math.cos(theta - fi), 0, distFromCamera * Math.sin(theta - fi));
        _this.m_aPlanes.previous.rotation.y += fi;
    }

    function _onKeyDown(event) {
        if(event.keyCode === 37) {
            _this.m_aPlanes.current.material.uniforms.direction.value = 0;
            _this.m_aPlanes.previous.material.uniforms.direction.value = 1;
            _transition("previous");
        } else if(event.keyCode === 39) {
            _this.m_aPlanes.current.material.uniforms.direction.value = 1;
            _this.m_aPlanes.next.material.uniforms.direction.value = 0;
            _transition("next");
        }
    }

    function _transition(action) {
        if(!isTweening) {
            isTweening = true;
            var tweenTime = 750;
            var source = {
                rotation: _this.m_cCamera.rotation.y,
                oldOpacity: 1,
                newOpacity: 0
            };
            var target = {
                rotation: _this.m_cCamera.rotation.y,
                oldOpacity: 0,
                newOpacity: 1
            };

            if(action === "next") {
                target.rotation -= fi;
            } else {
                target.rotation += fi;
            }

            var tween = new TWEEN.Tween(source);
            tween.to(target, tweenTime);
            tween.interpolation(TWEEN.Interpolation.Linear);
            tween.easing(TWEEN.Easing.Quadratic.InOut);
            tween.onUpdate(function() {
                _this.m_cCamera.rotation.y = source.rotation;
            });
            tween.onComplete(function() {
                _this.m_cCamera.rotation.y = target.rotation;
            });

            var sourceOldOp = {
                opacity: 1
            };
            var targetOldOp = {
                opacity: 0
            };
            var oldTween = new TWEEN.Tween(sourceOldOp);
            oldTween.to(targetOldOp, tweenTime);
            oldTween.interpolation(TWEEN.Interpolation.Linear);
            oldTween.easing(TWEEN.Easing.Quadratic.InOut);
            oldTween.onUpdate(function() {
                _this.m_aPlanes.current.material.uniforms.opacity.value = sourceOldOp.opacity;
                // _this.m_aPlanes.current.material.uniforms.opacity.value += (1 / 60);
            });
            oldTween.onComplete(function() {
                _this.m_aPlanes.current.material.uniforms.opacity.value = targetOldOp.opacity;
                _this.m_aPlanes.current.material.uniforms.direction.value = -1;
                _this.m_aPlanes.next.material.uniforms.direction.value = -1;
                _this.m_aPlanes.previous.material.uniforms.direction.value = -1;
                if(action === "next") {
                    _goToNext();
                } else {
                    _goToPrevious();
                }
                isTweening = false;
            });

            var sourcenewOp = {
                opacity: 0
            };
            var targetnewOp = {
                opacity: 1
            };
            var newTween = new TWEEN.Tween(sourcenewOp);
            newTween.to(targetnewOp, tweenTime);
            newTween.interpolation(TWEEN.Interpolation.Linear);
            newTween.easing(TWEEN.Easing.Quadratic.InOut);
            newTween.onUpdate(function() {
                _this.m_aPlanes[action].material.uniforms.opacity.value = sourcenewOp.opacity;
                // _this.m_aPlanes[action].material.uniforms.opacity.value -= (1 / 60);
            });
            newTween.onComplete(function() {
                _this.m_aPlanes[action].material.uniforms.opacity.value = targetnewOp.opacity;

            });

            tween.start();
            newTween.start();
            oldTween.start();
        }
    }

    function _goToNext() {
        var nextIndex;
        currPlaneIndex = _this.m_aPlanes.next.index;
        if(currPlaneIndex === numberOfImages - 1) {
            nextIndex = 0;
        } else {
            nextIndex = currPlaneIndex + 1;
        }

        var nextPlane = _this.m_aPlanes.previous;
        _this.m_aPlanes.previous = _this.m_aPlanes.current;
        _this.m_aPlanes.current = _this.m_aPlanes.next;

        var texture = THREE.ImageUtils.loadTexture("./images/" + nextIndex + ".jpg");
        nextPlane.material.uniforms.map.value = texture;
        nextPlane.position.set(distFromCamera * Math.cos(theta - _this.m_aPlanes.current.rotation.y + fi), 0, distFromCamera * Math.sin(theta - _this.m_aPlanes.current.rotation.y + fi));
        nextPlane.rotation.y = _this.m_aPlanes.current.rotation.y - fi;
        _this.m_aPlanes.next = nextPlane;
        _this.m_aPlanes.next.index = nextIndex;
    }

    function _goToPrevious() {
        var prevIndex;
        currPlaneIndex = _this.m_aPlanes.previous.index;
        if(currPlaneIndex === 0) {
            prevIndex = numberOfImages - 1;
        } else {
            prevIndex = currPlaneIndex - 1;
        }

        var prevPlane = _this.m_aPlanes.next;
        _this.m_aPlanes.next = _this.m_aPlanes.current;
        _this.m_aPlanes.current = _this.m_aPlanes.previous;

        var texture = THREE.ImageUtils.loadTexture("./images/" + prevIndex + ".jpg");
        prevPlane.material.uniforms.map.value = texture;
        prevPlane.position.set(distFromCamera * Math.cos(theta - _this.m_aPlanes.current.rotation.y - fi), 0, distFromCamera * Math.sin(theta - _this.m_aPlanes.current.rotation.y - fi));
        prevPlane.rotation.y = _this.m_aPlanes.current.rotation.y + fi;
        _this.m_aPlanes.previous = prevPlane;
        _this.m_aPlanes.previous.index = prevIndex;
    }

    Main.prototype = {

        startRender: function() {
            // get canvas dimentions
            this.m_nWidth = window.innerWidth;
            this.m_nHeight = window.innerHeight;
            aspect = this.m_nWidth / this.m_nHeight;

            // Calculating horizontal fov
            vFOV = 2 * Math.atan(this.m_nHeight / (2 * distFromCamera));
            hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * aspect );
            this.m_rFOV = (vFOV * 180) / Math.PI;

            // create renderer
            this.m_cRenderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                depth: 100000
            });

            this.m_cRenderer.setSize(this.m_nWidth, this.m_nHeight);
            document.body.appendChild(this.m_cRenderer.domElement);
            var dom = this.m_cRenderer.domElement;
            window.addEventListener("keydown", _onKeyDown, true);

            this.m_cRenderer.setClearColor(0x000000, 1);
            this.m_cRenderer.setFaceCulling(THREE.CullFaceNone); // disable face culling
            this.m_cRenderer.alpha = true;

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

            // create a new 3D scene
            this.m_cScene = new THREE.Scene();
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

            _this.m_cScene.add(_this.m_aPlanes.current);
            _this.m_cScene.add(_this.m_aPlanes.previous);
            _this.m_cScene.add(_this.m_aPlanes.next);

            // add ambient light to scene
            var light = new THREE.AmbientLight(0xFFFFFF);
            this.m_cScene.add(light);

            // this.m_rFOV = 60;
            this.m_cCamera = new THREE.PerspectiveCamera(this.m_rFOV, aspect, 0.1, 10000.0);
            // this.m_cCamera.rotation.x = -Math.PI / 3;
            // this.m_cCamera.position.y = 1200;
            this.m_cScene.add(this.m_cCamera);
            this.m_cScene.background = new THREE.Color(0x000000);
            _createPlanes();

            function runProcessLoop() {
                // if(uniforms.opacity.value > 0 ) {
                //     uniforms.opacity.value -= 0.005;
                // }
                requestAnimationFrame(runProcessLoop);
                _this.m_cRenderer.render(_this.m_cScene, _this.m_cCamera);
                TWEEN.update();
            }

            runProcessLoop();
        },

        stopRender: function() {

        }

    };

    return Main;
})();
