(function(LD) {
    var app = null;
    var backgroundMusic;

    var gameworkContainer;
    var uiContainer;
    var statusBarContainer;
    var backgroundFilter;

    var eventListeners = {};

    var loseAmount = -10000;
    var initialCurrency = 10000;

    var gameOver = false;

    var currency = initialCurrency;
    var technology = 0;
    var food = 0;
    var work = 0;
    var water = 0;
    var electricity = 0;
    var populationCapacity = 0;
    var currentPopulation = 0;

    var milisecondsCounter = 0;
    const updateEveryMS = 250;

    var overlayBackground;
    var overlayText;
    var resetButton;

    LD.activeTileConstructor = null;

    LD.initialize = function initialize() {
        app = new PIXI.Application(1280, 720, {backgroundColor : 0x9FD4E3});

        backgroundMusic = new Howl({
            src: ['audio/bg-music.mp3', 'audio/bg-music.wav'],
            autoplay: true,
            loop: true,
            volume: 0.8,
            rate: 1.0
        });
        gameworkContainer = document.getElementById('canvas-container');
		gameworkContainer.appendChild(app.view);
        
        uiContainer = LD.UI.initialize(180, 720);
        uiContainer.x = 1100;

        statusBarContainer = LD.UI.StatusBar.initialize(160, 180);
        statusBarContainer.x = 940;
        statusBarContainer.y = 10;

        var gridContainers = LD.Grid.initialize(13, 11, 11, 9, 64, 64);

        LD.addEventListener('keyup_esc', function(event) {
            LD.UI.StatusBar.clearActiveBuilding();
            LD.setActiveTile(null);
        });

        for(var i = 0; i < gridContainers.length; i++){
            app.stage.addChild(gridContainers[i]);
        }        
        app.stage.addChild(uiContainer);
        app.stage.addChild(statusBarContainer);

        initializeOverlay(app.stage);

        LD.Input.Keyboard.initialize();

        LD.addEventListener('tileClicked', function onTileClicked(args) {
            if(LD.activeTileConstructor != null){
                var tile = new LD.activeTileConstructor();
                var hasPlacedTile = LD.Grid.tryPlaceTile(tile, args.x, args.y);

                if(hasPlacedTile){
                    setCurrency(currency - tile.initialCost);
                }
            }
            else if(!args.tile.isDefaultTile){    
                LD.UI.StatusBar.setActiveBuilding(args.tile);
            }
        });

        LD.addEventListener('upgradeTileButtonClicked', function(buildingToUpgrade){            
            buildingToUpgrade.level++;
            setCurrency(currency - buildingToUpgrade.getCurrentUpgradeCost());

            if(buildingToUpgrade.level == buildingToUpgrade.maxLevel){
                LD.UI.StatusBar.hideUpgradeButton();
            }
        });

        LD.addEventListener('toggleLayerButtonClicked', toggleLayerButtonClicked());

        app.ticker.add(LD.update);
    }

    LD.setActiveTile = function setActiveTile(id) {
        var newActiveTile = LD.TileStorage.buildingConstructors[id];
        LD.activeTileConstructor = newActiveTile;

        LD.UI.StatusBar.clearActiveBuilding();
    }

    LD.update = function update(delta) {
        milisecondsCounter += app.ticker.elapsedMS;
        if(milisecondsCounter < updateEveryMS){
            return;
        }
        milisecondsCounter -= updateEveryMS;

        var tiles = LD.Grid.getTiles();

        if (!gameOver) {
            updateCurrency(tiles);
            updateWater(tiles);
            updateElectricity(tiles);
            updateTechnologyPoints(tiles);
            updateFood(tiles);
            updateJobs(tiles);
            updatePopulation(tiles);
            
            if (isGameWon(tiles)) {
                gameOver = true;
                showGameWonOverlay();
            }
        }

        if (currency <= loseAmount) {
            gameOver = true;
            showGameLostOverlay();
        }
    }

    LD.addEventListener = function addEventListener(eventName, eventHandler) {
        if (!eventListeners.hasOwnProperty(eventName)) { 
            eventListeners[eventName] = [];
        }

        eventListeners[eventName].push(eventHandler);
    }

    LD.notify = function notify(eventName, event) {
        if (!eventListeners.hasOwnProperty(eventName)) { 
            return; 
        }

        for (var i = 0; i < eventListeners[eventName].length; i++) {
            eventListeners[eventName][i](event);
        }
    }

    LD.resetGame = function resetGame() {
        gridContainers = LD.Grid.reset();

        setCurrency(initialCurrency);
        setPeople(0, 0);
        setTechnology(0);
        setWater(0);
        setElectricity(0);
        setFood(0);

        gameOver = false;
        setOverlayVisibile(false);
    }

    function initializeOverlay(stage) {
        overlayBackground = new PIXI.Graphics();
        overlayBackground.beginFill(0x000000);
        overlayBackground.drawRect(0, 290, 1280, 120);
        overlayBackground.visible = false;
        overlayBackground.alpha = 0.8;

        overlayText = new PIXI.Text('', { fontFamily: 'Courier New', fontSize: 52, fill: 0xFFFFFF});
        overlayText.visible = false;

        resetButton = PIXI.Sprite.fromImage('img/resetButton.png');
        resetButton.buttonMode = true;
        resetButton.interactive = true;
        resetButton.on('pointerup', function() { LD.resetGame(); });
        resetButton.visible = false;

        resetButton.x = Math.floor(1280 / 2 - (resetButton.width / 2));
        resetButton.y = Math.floor(720 / 2 - (resetButton.height / 2)) + 10;

        stage.addChild(overlayBackground);
        stage.addChild(overlayText);
        stage.addChild(resetButton);
    }

    function isGameWon(tiles) {
        var populationCapacity = tiles.reduce(
            function(acc, val){
                return acc + val.getCurrentPopulationCapacity();
            },
         0);

        var maxLevelHouses = tiles.filter(function(value) {
            return value.id == 'house' && value.level == value.maxLevel;
        });

        if (maxLevelHouses.length == LD.Grid.getAmountOfPlayableTiles() && currentPopulation == populationCapacity) {
            return true;
        }

        return false;
    }

    function setOverlayText(text) {
        overlayText.text = text;
        overlayText.x = Math.floor(1280 / 2 - (overlayText.width / 2));
        overlayText.y = Math.floor(720 / 2 - (overlayText.height / 2)) - 40;
    }

    function showGameLostOverlay() {
        setOverlayText('You went bankrupt, you lose! :(');
        setOverlayVisibile(true);
    }

    function showGameWonOverlay() {
        setOverlayText('You win! Small worlds for everyone..');
        setOverlayVisibile(true);
    }

    function setOverlayVisibile(overlayVisible) {
        overlayText.visible = overlayVisible;
        overlayBackground.visible = overlayVisible;
        resetButton.visible = overlayVisible;
    }

    function updateCurrency(tiles){
        var incomeSum = tiles.reduce(
            function(acc, val){
                return acc + val.getCurrentIncome() - val.getCurrentCost();
            },
        0);

        currency += incomeSum;

        setCurrency(currency);
    }

    function updateWater(tiles){
        var water = tiles.reduce(
            function(acc, val){
                if(val.isDefaultTile){
                    return acc;
                }

                return acc + val.getCurrentWaterProvided();
            },
        0);

        setWater(water);
    }

    function updateElectricity(tiles){
        var electricity = tiles.reduce(
            function(acc, val){
                if(val.isDefaultTile){
                    return acc;
                }

                return acc + val.getCurrentElectricityProvided();
            },
        0);

        setElectricity(electricity);
    }

    function updatePopulation(tiles){
        var populationCapacity = tiles.reduce(
            function(acc, val){
                return acc + val.getCurrentPopulationCapacity();
            },
         0);         

         if(food > currentPopulation && water > currentPopulation && electricity > currentPopulation && work > currentPopulation && currentPopulation < populationCapacity){
            var notFullHouses = tiles.filter(function(value) {
                return value.id == 'house' && value.currentPopulation < value.getCurrentPopulationCapacity();
            });

            if(notFullHouses.length > 0){
                notFullHouses[0].currentPopulation++;
            }
         }
         else if(food < currentPopulation || water < currentPopulation || electricity < currentPopulation || work < currentPopulation){
             var housesWithResidents = tiles.filter(function(value) {
                 return value.id == 'house' && value.currentPopulation > 0;
             });

             if(housesWithResidents.length > 0){
                 housesWithResidents[0].currentPopulation--;
             }
         }
         currentPopulation = tiles.reduce(
             function(acc, val){
                 return acc + val.currentPopulation;
            }
         , 0);
         setPeople(currentPopulation, populationCapacity);
    }

    function updateTechnologyPoints(tiles){
        var technologyPoints = tiles.reduce(
            function(acc, val){
                if(val.id == 'house'){
                    return acc;
                }
                return acc + val.level;
            },
        0);

        setTechnology(technologyPoints);
    }

    function updateFood(tiles){
        var foodProduction = tiles.reduce(
            function(acc, val){
                return acc + val.getCurrentFoodProduced();
            },
        0);

        setFood(foodProduction);
    }

    function updateJobs(tiles){
        var jobs = tiles.reduce(
            function(acc, val){
                return acc + val.getCurrentJobsProvided();
            },
        0);

        setWork(jobs);
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

    function setWork(value) {
        work = value;
        LD.UI.setWork(value);
    }

    function setPeople(current, totalCapacity) {
        currentPopulation = current
        populationCapacity = totalCapacity;
        LD.UI.setPeople(current, totalCapacity);
    }

    function toggleLayerButtonClicked(){
        var mustSwitchToUnderground = true;

        return function(){
            if(mustSwitchToUnderground) {
                LD.Grid.switchToUnderground(app.stage);
            }
            else {
                LD.Grid.switchToSurface(app.stage);
            }

            mustSwitchToUnderground = !mustSwitchToUnderground;
        }
    };
}(window.LD = window.LD || {}));