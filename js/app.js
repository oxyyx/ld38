(function(LD) {
    var app = null;
    var gameworkContainer;
    var uiContainer;
    var statusBarContainer;
    var backgroundFilter;

    var eventListeners = {};

    var currency = 10000;
    var technology = 0;
    var food = 0;
    var water = 0;
    var electricity = 0;
    var populationCapacity = 0;
    var currentPopulation = 0;

    var milisecondsCounter = 0;
    const updateEveryMS = 250;

    LD.activeTileConstructor = null;

    LD.initialize = function initialize() {
        app = new PIXI.Application(1280, 720, {backgroundColor : 0x9FD4E3});

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

        LD.Input.Keyboard.initialize();

        LD.addEventListener('tileClicked', function onTileClicked(args) {
            if(LD.activeTileConstructor != null){
                var tile = new LD.activeTileConstructor();
                var hasPlacedTile = LD.Grid.tryPlaceTile(tile, args.x, args.y);

                if(hasPlacedTile){
                    setCurrency(currency - tile.initialCost);
                }
            }
            else{    
                LD.UI.StatusBar.setActiveBuilding(args.tile);
            }
        });

        LD.addEventListener('upgradeTileButtonClicked', function(buildingToUpgrade){
            buildingToUpgrade.level++;
            setCurrency(currency - buildingToUpgrade.getCurrentUpgradeCost());
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
        updateCurrency(tiles);
        updateWater(tiles);
        updateElectricity(tiles);
        updateTechnologyPoints(tiles);
        updateFood(tiles);
        updateJobs(tiles);
        updatePopulation(tiles);
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

         var populationChange = 0;
         if(food > currentPopulation && water > currentPopulation && electricity > currentPopulation && work > currentPopulation && currentPopulation < populationCapacity){
            populationChange = 1;
         }
         else if(food < currentPopulation || water < currentPopulation || electricity < currentPopulation || work < currentPopulation){
             populationChange = -1;
         }

         if(currentPopulation > populationCapacity){
             populationChange = populationCapacity - currentPopulation;
         }

        setPeople(currentPopulation + populationChange, populationCapacity);
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