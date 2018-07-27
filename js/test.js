window.onload = function() {

    var _this = this;

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

    var map = new THREE.TextureLoader().load("./images/1.jpg");
    var uniforms = {
        opacity: {
            type: 'f',
            value: 0.0
        },
        map: {
            type: 't',
            value: map
        }
    };

    // create a new 3D scene
    this.m_cCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 10000.0);
    this.m_cScene = new THREE.Scene();
    var geometry = new THREE.PlaneGeometry(300, 400, 32, 32);
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
		vertexShader:   $('#vertexshader').text(),
		fragmentShader: $('#fragmentshader').text(),
        transparent: true,
        needsUpdate: true
    });

    var plane = new THREE.Mesh(geometry, material);
    plane.position.z = -100;
    this.m_cScene.add(plane);

    function runProcessLoop() {
        if(uniforms.opacity.value < 1) {
            uniforms.opacity.value += 0.005;
        }
        // plane.material.needsUpdate = true;
        requestAnimationFrame(runProcessLoop);
        _this.m_cRenderer.render(_this.m_cScene, _this.m_cCamera);
    }

    runProcessLoop();
};
