(function(LD) {
    var app = null;
    var gameworkContainer;

    var currency = 0;
    var technology = 0;
    var food = 0;
    var water = 0;
    var electricity = 0;

    LD.initialize = function initialize() {
        app = new PIXI.Application(1280, 720, {backgroundColor : 0x1099bb});

        gameworkContainer = document.getElementById('canvas-container');
		gameworkContainer.appendChild(app.view);
        
        app.stage.addChild(LD.UI.initialize());
        app.ticker.add(LD.update);
    }

    LD.update = function update(delta) {
        setCurrency(10);
        setTechnology(20);
        setFood(30);
        setWater(40);
        setElectricity(50);
    }

    function setCurrency(value) {
        currency = value;
        LD.UI.setCurrency(value);
    }

    function setTechnology(value) {
        technology = value;
        LD.UI.setTechnology(value);
    }

    function setFood(value) {
        food = value;
        LD.UI.setFood(value);
    }

    function setWater(value) {
        water = value;
        LD.UI.setWater(value);
    }

    function setElectricity(value) {
        electricity = value;
        LD.UI.setElectricity(value);
    }
}(window.LD = window.LD || {}));