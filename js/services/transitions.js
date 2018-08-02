Transitions = (function() {

    function Transitions(cSettings) {
        this.m_cSettings = cSettings;
        this.m_cCamera = null;
        this.m_cPlanes = null;
        this.m_rFOV = 60;
        _init.call(this);
    }

    function _init() {
        // Calculating horizontal fov
        vFOV = 2 * Math.atan(this.m_nHeight / (2 * distFromCamera));
        hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * aspect );
        this.m_rFOV = (vFOV * 180) / Math.PI;
        this.m_cCamera = new THREE.PerspectiveCamera(this.m_rFOV, aspect, 0.1, 10000.0);

        this.m_cPlanes = new Planes(this.m_cSettings);
    }

    Transitions.prototype = {

        transition: function(action) {

        },

        getCamera: function() {
            return this.m_cCamera;
        },

        getPlanes: function() {
            return this.m_cPlanes.getPlanes();
        }

    };

})();
