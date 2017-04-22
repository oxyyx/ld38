(function(LD) {
    var app = null;
    var gameworkContainer;

    LD.initialize = function initialize() {
        app = new PIXI.Application(1280, 720, {backgroundColor : 0x1099bb});

        gameworkContainer = document.getElementById('canvas-container');
		gameworkContainer.appendChild(app.view);
    }
}(window.LD = window.LD || {}));