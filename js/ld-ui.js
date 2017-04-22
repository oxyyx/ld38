(function(LD) {
    (function(UI) {
        var uiContainer;
        var backgroundGraphics;

        var currencyText;
        var technologyText;
        var foodText;
        var waterText;
        var electricityText;

        var houseButton;
        var shopButton;
        var farmButton;
        var industryButton;

        var roadButton;
        
        UI.initialize = function initializeUI(width, height) {
            uiContainer = new PIXI.Container();
            uiContainer.width = width;
            uiContainer.height = height;

            backgroundGraphics = new PIXI.Graphics();
            backgroundGraphics.beginFill(0x333333);
            backgroundGraphics.drawRect(0, 0, width, height);

            uiContainer.addChild(backgroundGraphics);

            currencyText = new PIXI.Text(0, { fontSize: 20, fill : 0xffffff});
            currencyText.y = 0;

            technologyText = new PIXI.Text(0, { fontSize: 20, fill : 0xffffff });
            technologyText.y = 20;

            foodText = new PIXI.Text(0, { fontSize: 20, fill : 0xffffff });
            foodText.y = 40;

            waterText = new PIXI.Text(0, { fontSize: 20, fill : 0xffffff });
            waterText.y = 60;

            electricityText = new PIXI.Text(0, { fontSize: 20, fill : 0xffffff });
            electricityText.y = 80;

            houseButton = PIXI.Sprite.fromImage('img/house.png');
            houseButton.interactive = true;
            houseButton.buttonMode = true;
            houseButton.on('pointerup', function() { LD.setActiveTile('house', houseButton.texture); })

            houseButton.y = 120;

            farmButton = PIXI.Sprite.fromImage('img/farmland.png');
            farmButton.interactive = true;
            farmButton.buttonMode = true;
            farmButton.on('pointerup', function() { LD.setActiveTile('farm', farmButton.texture); })

            farmButton.y = 200;

            industryButton = PIXI.Sprite.fromImage('img/industry.png');
            industryButton.interactive = true;
            industryButton.buttonMode = true;
            industryButton.on('pointerup', function() { LD.setActiveTile('industry', industryButton.texture); })

            industryButton.y = 280;

            shopButton = PIXI.Sprite.fromImage('img/shop.png');
            shopButton.interactive = true;
            shopButton.buttonMode = true;
            shopButton.on('pointerup', function() { LD.setActiveTile('shop', shopButton.texture); })

            shopButton.y = 360;

            roadButton = PIXI.Sprite.fromImage('img/road.png');
            roadButton.interactive = true;
            roadButton.buttonMode = true;
            roadButton.on('pointerup', function() { LD.setActiveTile('road', roadButton.texture); })

            roadButton.y = 460;

            // Currencies & values
            uiContainer.addChild(currencyText);
            uiContainer.addChild(technologyText);
            uiContainer.addChild(foodText);
            uiContainer.addChild(waterText);
            uiContainer.addChild(electricityText);

            // Buildings
            uiContainer.addChild(houseButton);
            uiContainer.addChild(farmButton);
            uiContainer.addChild(industryButton);
            uiContainer.addChild(shopButton);

            // Transport
            uiContainer.addChild(roadButton);

            return uiContainer;
        }


        UI.setCurrency = function setCurrency(value) {
            currencyText.text = '$' + value;
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
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));