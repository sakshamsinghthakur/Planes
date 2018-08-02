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
            var oldRotation = _this.m_cCamera.rotation.y;
            var source = {
                rotation: _this.m_cCamera.rotation.y,
            };
            var target = {
                rotation: _this.m_cCamera.rotation.y,
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
                var factor = Math.abs(source.rotation - oldRotation) / fi;
                var value;
                if((factor *= 2) < 1) {
                    value = 0.5 * factor * factor;
                    _this.m_aPlanes.current.material.uniforms.opacity.value = 1.0 - value;
                    _this.m_aPlanes[action].material.uniforms.opacity.value = value;
                } else {
                    value = -0.5 * (--factor * (factor - 2) - 1);
                    _this.m_aPlanes.current.material.uniforms.opacity.value = 1.0 - value;
                    _this.m_aPlanes[action].material.uniforms.opacity.value = value;
                }
            });
            tween.onComplete(function() {
                _this.m_cCamera.rotation.y = target.rotation;
                _this.m_aPlanes.current.material.uniforms.opacity.value = 0;
                _this.m_aPlanes[action].material.uniforms.opacity.value = 1;
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
            tween.start();
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

            this.m_cRenderer = new Renderer(this.m_cSettings);
            this.m_cRenderer.setupScene();

            _createPlanes();

            function runProcessLoop() {
                requestAnimationFrame(runProcessLoop);
                _this.m_cRenderer.update();
                TWEEN.update();
            }

            runProcessLoop();
        }

    };

    return Main;
})();
