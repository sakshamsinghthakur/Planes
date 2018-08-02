Main = (function() {

    function Main() {
        this.m_cRenderer = null;
        this.m_cEventService = null;
        this.m_cSettings = null;
        _init.call(this);
    }

    function _init() {
        this.m_cSettings = {
            numberOfImages: 8,
            aspect: 0,
            distFromCamera: 1200,
            fi: Math.PI * (36 / 180),
            currPlaneIndex: 0,
            theta: -Math.PI / 2,
            width: 800,
            height: 600
        };
    }

    Main.prototype = {

        startRender: function() {
            var ownObject = this;
            this.m_cRenderer = new Renderer(this.m_cSettings);
            this.m_cEventService = new EventService(this.m_cSettings, this.m_cRenderer);
            this.m_cRenderer.setupScene();

            function runProcessLoop() {
                requestAnimationFrame(runProcessLoop);
                ownObject.m_cRenderer.update();
                TWEEN.update();
            }

            runProcessLoop();
        }

    };

    return Main;
})();
