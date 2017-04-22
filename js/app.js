(function(LD) {
    var app = null;
    var gameworkContainer;
    var uiContainer;
    var backgroundFilter;

    var background;

    var currency = 0;
    var technology = 0;
    var food = 0;
    var water = 0;
    var electricity = 0;

    LD.initialize = function initialize() {
        app = new PIXI.Application(1280, 720, {backgroundColor : 0x1099bb});

        background = PIXI.Sprite.fromImage('img/jebroer.jpg');
        background.width = app.renderer.width;
        background.height = app.renderer.height;

        gameworkContainer = document.getElementById('canvas-container');
		gameworkContainer.appendChild(app.view);
        
        uiContainer = LD.UI.initialize(180, 720);
        uiContainer.x = 1100;

        app.stage.addChild(background);

        var gridContainer = LD.Grid.initialize(13, 11, 11, 9, 64, 64);
        app.stage.addChild(gridContainer);
        app.stage.addChild(uiContainer);
        app.ticker.add(LD.update);
    }

    LD.activeTile = {id: null, texture: null};

    LD.setActiveTile = function setActiveTile(id, texture) {
        LD.activeTile = {id: id, texture: texture};
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