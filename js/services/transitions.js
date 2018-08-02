Transitions = (function() {

    var _this;

    function Transitions(cSettings) {
        this.m_cSettings = cSettings;
        this.m_cCamera = null;
        this.m_cImagePlanes = null;
        this.m_aPlanes = null;
        this.m_rFOV = 60;
        this.m_fIsTweening = false;
        _this = this;
        _init.call(this);
    }

    function _init() {
        // Calculating horizontal fov
        var vFOV = 2 * Math.atan(this.m_cSettings.height / (2 * this.m_cSettings.distFromCamera));
        var hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * this.m_cSettings.aspect );
        this.m_rFOV = (vFOV * 180) / Math.PI;
        this.m_cCamera = new THREE.PerspectiveCamera(this.m_rFOV, this.m_cSettings.aspect, 0.1, 10000.0);

        this.m_cImagePlanes = new ImagePlanes(this.m_cSettings, hFOV);
        this.m_cImagePlanes.createPlanes();
        this.m_aPlanes = this.m_cImagePlanes.m_aPlanes;
    }

    Transitions.prototype = {

        startTransition: function(action) {
            if(!this.m_fIsTweening) {
                this.m_fIsTweening = true;
                var tweenTime = 750;
                var oldRotation = this.m_cCamera.rotation.y;
                var source = {
                    rotation: this.m_cCamera.rotation.y,
                };
                var target = {
                    rotation: this.m_cCamera.rotation.y,
                };

                if(action === "next") {
                    target.rotation -= this.m_cSettings.fi;
                    this.m_aPlanes.current.material.uniforms.direction.value = 0;
                    this.m_aPlanes.previous.material.uniforms.direction.value = 1;
                } else {
                    target.rotation += this.m_cSettings.fi;
                    this.m_aPlanes.current.material.uniforms.direction.value = 1;
                    this.m_aPlanes.next.material.uniforms.direction.value = 0;
                }

                var tween = new TWEEN.Tween(source);
                tween.to(target, tweenTime);
                tween.interpolation(TWEEN.Interpolation.Linear);
                tween.easing(TWEEN.Easing.Quadratic.InOut);
                tween.onUpdate(function() {
                    _this.m_cCamera.rotation.y = source.rotation;
                    var factor = Math.abs(source.rotation - oldRotation) / _this.m_cSettings.fi;
                    var value;
                    if((factor *= 2) < 1) {
                        value = 0.5 * factor * factor;
                        _this.m_aPlanes.current.material.uniforms.opacity.value = 1.0 - value;
                        _this.m_aPlanes[action].material.uniforms.opacity.value = value;
                        console.log(_this.m_aPlanes.current.material.uniforms.opacity.value);
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
                        _this.m_cImagePlanes.goToNext();
                    } else {
                        _this.m_cImagePlanes.goToPrevious();
                    }
                    _this.m_fIsTweening = false;
                });
                tween.start();
            }
        },

        getCamera: function() {
            return this.m_cCamera;
        },

        getPlanes: function() {
            return this.m_cImagePlanes.getPlanes();
        }

    };

    return Transitions;
})();
