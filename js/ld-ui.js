(function(LD) {
    (function(UI) {
        var uiContainer;
        var backgroundGraphics;

        var currencyText;
        var technologyText;
        var foodText;
        var waterText;
        var electricityText;
        var workText;
        var peopleText;

        var houseButton;
        var shopButton;
        var farmButton;
        var industryButton;

        var roadButton;
        var pipeButton;
        var powerCableButton;

        UI.toggleLayerButtonClicked = null;
        
        UI.initialize = function initializeUI(width, height) {
            uiContainer = new PIXI.Container();
            uiContainer.width = width;
            uiContainer.height = height;

            backgroundGraphics = new PIXI.Graphics();
            backgroundGraphics.beginFill(0x999999);
            backgroundGraphics.drawRect(0, 0, width, height);

            uiContainer.addChild(backgroundGraphics);

            // Currencies & values 
            currencyText = createSidebarValue(uiContainer, 8, 6, 160, 32, 'img/money.png');
            technologyText = createSidebarValue(uiContainer, 8, 44, 160, 32, 'img/tech.png');
            foodText = createSidebarValue(uiContainer, 8, 82, 160, 32, 'img/food.png');
            waterText = createSidebarValue(uiContainer, 8, 120, 160, 32, 'img/water.png');
            electricityText = createSidebarValue(uiContainer, 8, 158, 160, 32, 'img/electricity.png');
            workText = createSidebarValue(uiContainer, 8, 196, 160, 32, 'img/work.png');
            peopleText = createSidebarValue(uiContainer, 8, 234, 160, 32, 'img/people.png');

            // Buildings
            var buildingsText = new PIXI.Text('BUILDINGS', { fontSize: 20, fill : 0x000000 }); 
            buildingsText.x = 35;
            buildingsText.y = 270;

            houseButton = createSidebarTile(uiContainer, 18, 300, 'house', 'img/house.png');
            farmButton = createSidebarTile(uiContainer, 98, 300, 'farm', 'img/farmland.png');
            industryButton = createSidebarTile(uiContainer, 18, 380, 'industry', 'img/industry.png');
            shopButton = createSidebarTile(uiContainer, 98, 380, 'shop', 'img/shop.png');

            uiContainer.addChild(buildingsText);

            // Transport
            var transportText = new PIXI.Text('TRANSPORT', { fontSize: 20, fill : 0x000000 }); 
            transportText.x = 30;
            transportText.y = 450;

            roadButton = createSidebarTile(uiContainer, 18, 480, 'road', 'img/road.png');
            pipeButton = createSidebarTile(uiContainer, 98, 480, 'pipe', 'img/road.png');
            powerCableButton = createSidebarTile(uiContainer, 18, 560, 'powercable', 'img/road.png');

            uiContainer.addChild(transportText);

            createToggleLayerButton(uiContainer, 'img/toggleLayerButton.png', 18, 640);

            return uiContainer;
        }

        function createSidebarValue(container, x, y, width, height, icon) {
            var valueBackground = new PIXI.Graphics();
            valueBackground.beginFill(0x666666);
            valueBackground.drawRect(x + 8, y + 2, width - 8, height - 4);

            var valueIcon = PIXI.Sprite.fromImage(icon);
            valueIcon.x = x
            valueIcon.y = y;

            var valueText = new PIXI.Text(0, { fontSize: 20, fill : 0xFFFFFF});
            valueText.x = x + 40;
            valueText.y = y + 4;

            container.addChild(valueBackground);
            container.addChild(valueIcon);
            container.addChild(valueText);

            return valueText;
        }

        function createSidebarTile(container, x, y, id, icon) {
            var tileButton = PIXI.Sprite.fromImage(icon);
            tileButton.interactive = true;
            tileButton.buttonMode = true;
            tileButton.on('pointerup', function() { LD.setActiveTile(id, tileButton.texture); });

            tileButton.x = x;
            tileButton.y = y;

            container.addChild(tileButton);

            return tileButton;
        }

        function createToggleLayerButton(container, icon, x, y){
            var button = PIXI.Sprite.fromImage(icon);
            button.interactive = true;
            button.buttonMode = true;
            button.on('pointerup', function(){UI.toggleLayerButtonClicked();});

            button.x = x;
            button.y = y;

            container.addChild(button);
        }

        UI.setCurrency = function setCurrency(value) {
            currencyText.text = value;
        }

        UI.setTechnology = function setTechnology(value) {
            technologyText.text = value;
        }

        UI.setFood = function setFood(value) {
            foodText.text = value;
        }

        UI.setWater = function setWater(value) {
            waterText.text = value;
        }

        UI.setElectricity = function setElectricity(value) {
            electricityText.text = value;
        }

        UI.setWork = function setWork(value) {
            workText.text = value;
        }

        UI.setPeople = function setPeople(value) {
            peopleText.text = value;
        }
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));