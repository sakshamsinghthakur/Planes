Renderer = (function() {

    function Renderer(cSettings) {
        this.m_cSettings = cSettings;
    }

    Renderer.prototype = {

        setupScene: function() {
            // get canvas dimentions
            this.m_nWidth = window.innerWidth;
            this.m_nHeight = window.innerHeight;
            aspect = this.m_nWidth / this.m_nHeight;

            // create renderer
            this.m_cRenderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                depth: 100000
            });

            this.m_cRenderer.setSize(this.m_nWidth, this.m_nHeight);
            document.body.appendChild(this.m_cRenderer.domElement);
            var dom = this.m_cRenderer.domElement;




            // Event Service
            window.addEventListener("keydown", _onKeyDown, true);

            this.m_cRenderer.setClearColor(0x000000, 1);
            this.m_cRenderer.setFaceCulling(THREE.CullFaceNone); // disable face culling
            this.m_cRenderer.alpha = true;

            // create a new 3D scene
            this.m_cScene = new THREE.Scene();
            this.m_cTransitions = new Transitions(this.m_cSettings);

            // add ambient light to scene
            var light = new THREE.AmbientLight(0xFFFFFF);
            this.m_cScene.add(light);

            this.m_cScene.add(this.m_cTransitions.getCamera());
            this.m_cScene.add(this.m_cTransitions.getPlanes());
            this.m_cScene.background = new THREE.Color(0x000000);

            _this.m_cRenderer.render(_this.m_cScene, _this.m_cCamera);
        },

        update: function() {
            _this.m_cRenderer.render(_this.m_cScene, _this.m_cCamera);
        }

    };

})();
