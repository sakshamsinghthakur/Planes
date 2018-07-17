Main = (function() {

    var numberOfImages = 14,
        _this,
        vFOV,
        hFOV,
        aspect,
        distFromCamera = 1200,
        fi = Math.PI / 6,
        currPlaneIndex = 0,
        previous = false,
        next = false,
        theta = -Math.PI / 2,
        isTweening = false,
        overlap;

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
        _this.m_aPlanes.current.material.map = texture;
        _this.m_aPlanes.current.index = 0;
        _this.m_aPlanes.current.position.set(0, 0, -distFromCamera);

        texture = THREE.ImageUtils.loadTexture("./images/1.jpg");
        _this.m_aPlanes.next.material.map = texture;
        _this.m_aPlanes.next.index = 1;
        _this.m_aPlanes.next.position.set(overlap - _this.m_nWidth, 0, -distFromCamera);
        _this.m_aPlanes.next.material.opacity = 0;

        texture = THREE.ImageUtils.loadTexture("./images/" + (numberOfImages - 1) + ".jpg");
        _this.m_aPlanes.previous.material.map = texture;
        _this.m_aPlanes.next.position.set(_this.m_nWidth - overlap, 0, -distFromCamera);
        _this.m_aPlanes.previous.index = numberOfImages - 1;
        _this.m_aPlanes.previous.material.opacity = 0;
    }

    function _onKeyDown(event) {
        if(event.keyCode === 37) {
            _transition("previous");
        } else if(event.keyCode === 39) {
            _transition("next");
        }
    }

    function _transition(action) {
        if(!isTweening) {
            isTweening = true;
            var source = {
                position: _this.m_cCamera.position.x,
                oldOpacity: 1,
                newOpacity: 0
            };
            var target = {
                position: _this.m_cCamera.position.x,
                oldOpacity: 0,
                newOpacity: 1
            };

            if(action === "next") {
                target.position = _this.m_aPlanes.next.position.x;
            } else {
                target.position = _this.m_aPlanes.previous.position.x;
            }

            var tween = new TWEEN.Tween(source);
            tween.delay(0);
            tween.to(target, 2000);
            tween.interpolation(TWEEN.Interpolation.Linear);
            tween.easing(TWEEN.Easing.Quadratic.InOut);
            tween.onUpdate(function() {
                _this.m_cCamera.position.x = source.position;
                _this.m_aPlanes.current.material.opacity = source.oldOpacity;
                _this.m_aPlanes[action].material.opacity = source.newOpacity;
            });
            tween.onComplete(function() {
                _this.m_cCamera.position.x = target.position;
                _this.m_aPlanes.current.material.opacity = target.oldOpacity;
                _this.m_aPlanes[action].material.opacity = target.newOpacity;
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
        nextPlane.material.map = texture;
        nextPlane.position.set(_this.m_aPlanes.current.position.x - overlap + _this.m_nWidth, 0, -distFromCamera);
        nextPlane.material.opacity = 0;
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
        prevPlane.material.map = texture;
        prevPlane.position.set(_this.m_aPlanes.current.position.x + overlap - _this.m_nWidth, 0, -distFromCamera);
        prevPlane.material.opacity = 0;
        _this.m_aPlanes.previous = prevPlane;
        _this.m_aPlanes.previous.index = prevIndex;
    }

    Main.prototype = {

        startRender: function() {
            // this.m_cRenderer = new Renderer();
            // this.m_cRenderer.setupScene();

            // get canvas dimentions
            this.m_nWidth = window.innerWidth;
            this.m_nHeight = window.innerHeight;
            aspect = this.m_nWidth / this.m_nHeight;
            // create renderer
            this.m_cRenderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });

            this.m_cRenderer.setSize(this.m_nWidth, this.m_nHeight);
            document.body.appendChild(this.m_cRenderer.domElement);
            var dom = this.m_cRenderer.domElement;
            window.addEventListener("keydown", _onKeyDown, true);

            this.m_cRenderer.setClearColor(this.m_xSceneColor, 1);

            // create a new 3D scene
            this.m_cScene = new THREE.Scene();
            var geometry = new THREE.PlaneGeometry( _this.m_nWidth, _this.m_nHeight, 32 );
            var material = new THREE.MeshBasicMaterial();
            material.transparent = true;
            _this.m_aPlanes.current = new THREE.Mesh(geometry, material);

            geometry = new THREE.PlaneGeometry( _this.m_nWidth, _this.m_nHeight, 32 );
            material = new THREE.MeshBasicMaterial();
            material.transparent = true;
            _this.m_aPlanes.previous = new THREE.Mesh(geometry, material);

            geometry = new THREE.PlaneGeometry( _this.m_nWidth, _this.m_nHeight, 32 );
            material = new THREE.MeshBasicMaterial();
            material.transparent = true;
            _this.m_aPlanes.next = new THREE.Mesh(geometry, material);
            _this.m_cScene.add(_this.m_aPlanes.current);
            _this.m_cScene.add(_this.m_aPlanes.previous);
            _this.m_cScene.add(_this.m_aPlanes.next);

            //create another scene for the markers
            // add ambient light to scene
            var light = new THREE.AmbientLight(0xFFFFFF);
            this.m_cScene.add(light);

            // Calculating horizontal fov
            vFOV = 2 * Math.atan(this.m_nHeight / (2 * distFromCamera));
            hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * aspect );
            overlap = (this.m_nWidth / 2) - (distFromCamera * Math.tan(fi / 2));
            this.m_rFOV = (vFOV * 180) / Math.PI;
            // this.m_rFOV = 60;
            this.m_cCamera = new THREE.PerspectiveCamera(this.m_rFOV, aspect, 0.1, 10000.0);
            // this.m_cCamera.rotation.x = -Math.PI / 3;
            // this.m_cCamera.position.y = 1200;
            this.m_cScene.add(this.m_cCamera);

            _createPlanes();

            function runProcessLoop() {
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
