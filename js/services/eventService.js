EventService = (function() {

    var _this = this;

    function EventService(cSettings, cRenderer) {
        this.m_cSettings = cSettings;
        this.m_cRenderer = cRenderer;
        _init.call(this);
    }

    function _init() {
        window.addEventListener("keydown", _onKeyDown, true);
    }

    function _onKeyDown(event) {
        if(event.keyCode === 37) {
            _this.m_cRenderer.startTransition("previous");
        } else if(event.keyCode === 39) {
            _this.m_cRenderer.startTransition("next");
        }
    }

    EventService.prototype = {

    };

    return EventService;
})();
