(function(PJB) {
    var renderer = null;

    PJB.initialize = function initialize() {
        renderer = new PIXI.autoDetectRenderer(1280, 720);
		renderer.backgroundColor = 0xFFFFFF;

        gameworkContainer = document.getElementById('canvas-container');
		gameworkContainer.appendChild(renderer.view);

        stage = new PIXI.Container();
    }
}(window.PJB = window.PJB || {}));