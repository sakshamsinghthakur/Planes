Renderer = (function() {

    function Renderer(cSettings) {
        this.m_cSettings = cSettings;
    }

    Renderer.prototype = {

        setupScene: function() {
            // get canvas dimentions
            this.m_cSettings.width = window.innerWidth;
            this.m_cSettings.height = window.innerHeight;
            this.m_cSettings.aspect = this.m_cSettings.width / this.m_cSettings.height;

            // create renderer
            this.m_cRenderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                depth: 100000
            });

            this.m_cRenderer.setSize(this.m_cSettings.width, this.m_cSettings.height);
            document.body.appendChild(this.m_cRenderer.domElement);
            var dom = this.m_cRenderer.domElement;

            this.m_cRenderer.setClearColor(0x000000, 1);
            this.m_cRenderer.setFaceCulling(THREE.CullFaceNone); // disable face culling
            this.m_cRenderer.alpha = true;

            // create a new 3D scene
            this.m_cScene = new THREE.Scene();
            this.m_cTransitions = new Transitions(this.m_cSettings);

            // add ambient light to scene
            var light = new THREE.AmbientLight(0xFFFFFF);
            this.m_cScene.add(light);
            this.m_cCamera = this.m_cTransitions.getCamera();
            this.m_cScene.add(this.m_cCamera);
            this.m_cScene.add(this.m_cTransitions.getPlanes());
            console.log(this.m_cScene);
            this.m_cScene.background = new THREE.Color(0x000000);

            this.m_cRenderer.render(this.m_cScene, this.m_cCamera);
        },

        update: function() {
            this.m_cRenderer.render(this.m_cScene, this.m_cCamera);
        },

        startTransition: function(action) {
            this.m_cTransitions.startTransition(action);
        }

    };

    return Renderer;
})();
