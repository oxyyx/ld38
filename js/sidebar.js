(function(LD) {
    (function(UI) {
        var uiContainer;

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
        var powerWaterCableButton;

        var sideBarTextStyle;

        var tooltipBackground = new PIXI.Graphics();
        var tooltipTextStyle = new PIXI.TextStyle({
            fontFamily: 'Courier New',
            fontSize: 15,
            fill: ['#FFFFFF']
        });
        var initialCostTooltipText = new PIXI.Text('', tooltipTextStyle);
        
        UI.initialize = function initializeUI(width, height) {
            uiContainer = new PIXI.Container();
            uiContainer.width = width;
            uiContainer.height = height;

            sideBarTextStyle = new PIXI.TextStyle({
                fontFamily: 'Courier New',
                fontSize: 20,
                fill: ['#ffffff']
            });

            // Currencies & values 
            currencyText = createSidebarValue(uiContainer, 8, 6, 160, 32, 'img/money.png');
            peopleText = createSidebarValue(uiContainer, 8, 44, 160, 32, 'img/people.png');
            technologyText = createSidebarValue(uiContainer, 8, 82, 160, 32, 'img/tech.png');
            foodText = createSidebarValue(uiContainer, 8, 120, 160, 32, 'img/food.png');
            waterText = createSidebarValue(uiContainer, 8, 158, 160, 32, 'img/water.png');
            electricityText = createSidebarValue(uiContainer, 8, 196, 160, 32, 'img/electricity.png');
            workText = createSidebarValue(uiContainer, 8, 234, 160, 32, 'img/work.png');


            // Buildings
            var buildingBackground = new PIXI.Graphics();
            buildingBackground.beginFill(0x888888);
            buildingBackground.drawRect(8, 270, 160, 180);

            var buildingsHeader = PIXI.Sprite.fromImage('img/buildingsHeader.png');
            buildingsHeader.x = 8;
            buildingsHeader.y = 270;

            uiContainer.addChild(buildingBackground);
            uiContainer.addChild(buildingsHeader);

            farmButton = createSidebarTile(uiContainer, 98, 300, 'farm', 'img/farmland.png');
            houseButton = createSidebarTile(uiContainer, 18, 300, 'house', 'img/house.png');
            
            shopButton = createSidebarTile(uiContainer, 98, 380, 'shop', 'img/shop.png');
            industryButton = createSidebarTile(uiContainer, 18, 380, 'industry', 'img/industry.png');            

            // Transport
            var transportHeader = PIXI.Sprite.fromImage('img/transportHeader.png');
            transportHeader.x = 8;
            transportHeader.y = 455;

            var transportBackground = new PIXI.Graphics();
            transportBackground.beginFill(0x888888);
            transportBackground.drawRect(8, 455, 160, 180);

            uiContainer.addChild(transportBackground);
            uiContainer.addChild(transportHeader);

            pipeButton = createSidebarTile(uiContainer, 98, 485, 'pipe', 'img/pipeline.png');
            roadButton = createSidebarTile(uiContainer, 18, 485, 'road', 'img/road.png');
            powerWaterCableButton = createSidebarTile(uiContainer, 98, 565, 'powerwatercable', 'img/powerWaterCable.png');
            powerCableButton = createSidebarTile(uiContainer, 18, 565, 'powercable', 'img/powercable.png');

            createToggleLayerButton(uiContainer, 'img/toggleLayerButton.png', 8, 645);

            initialCostTooltipText.x = 8;
            initialCostTooltipText.y = 8;
            tooltipBackground.addChild(initialCostTooltipText);
            tooltipBackground.redraw = function(coordinates, tileInitialCost){
                initialCostTooltipText.text = "$" + tileInitialCost.formatCustom(0, '.', ',');

                if(coordinates){
                    tooltipBackground.x = coordinates.x;
                    tooltipBackground.y = coordinates.y;
                }
                tooltipBackground.clear();
                tooltipBackground.beginFill(0x333333, 0.75);
                tooltipBackground.drawRect(0, 0, initialCostTooltipText.width + 16, initialCostTooltipText.height + 16);                    
            }

            return uiContainer;
        }

        function createSidebarValue(container, x, y, width, height, icon) {
            var valueBackground = new PIXI.Graphics();
            valueBackground.beginFill(0x888888);
            valueBackground.drawRect(x + 8, y + 2, width - 8, height - 4);

            var valueIcon = PIXI.Sprite.fromImage(icon);
            valueIcon.x = x
            valueIcon.y = y;

            var valueText = new PIXI.Text(0, sideBarTextStyle);
            valueText.x = x + 40;
            valueText.y = y + 6;

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

            var overTileButton = false;
            var tileInitialCost = new LD.TileStorage.buildingConstructors[id]().initialCost;                
            tileButton.on('pointerover', function(args){
                tileButton.addChild(tooltipBackground);
                overTileButton = true;                    
                tooltipBackground.visible = true;
                
                var localPosition = args.data.getLocalPosition(tileButton);
                localPosition.x += 10;
                localPosition.y -= initialCostTooltipText.height + 10;
                tooltipBackground.redraw(localPosition, tileInitialCost);
            });
            tileButton.on('pointermove', function(args){
                if(!overTileButton){
                    return;
                }
                var localPosition = args.data.getLocalPosition(tileButton);
                localPosition.x += 10;
                localPosition.y -= initialCostTooltipText.height + 10;
                tooltipBackground.redraw(localPosition, tileInitialCost);
            });
            tileButton.on('pointerout', function(args){
                overTileButton = false;
                tooltipBackground.visible = false;
            });

            tooltipBackground.beginFill(0x333333);
            tooltipBackground.visible = false;

            container.addChild(tileButton);

            return tileButton;
        }

        function createToggleLayerButton(container, icon, x, y){
            var button = PIXI.Sprite.fromImage(icon);
            button.interactive = true;
            button.buttonMode = true;
            button.on('pointerup', () => LD.notify('toggleLayerButtonClicked'));

            button.x = x;
            button.y = y;

            container.addChild(button);
        }

        UI.setCurrency = function setCurrency(value) {
            currencyText.text = value.formatCustom(0, '.', ',');
        }

        UI.setTechnology = function setTechnology(value) {
            technologyText.text = value.formatCustom(0, '.', ',');
        }

        UI.setFood = function setFood(value) {
            foodText.text = value.formatCustom(0, '.', ',');
        }

        UI.setWater = function setWater(value) {
            waterText.text = value.formatCustom(0, '.', ',');
        }

        UI.setElectricity = function setElectricity(value) {
            electricityText.text = value.formatCustom(0, '.', ',');
        }

        UI.setWork = function setWork(value) {
            workText.text = value.formatCustom(0, '.', ',');
        }

        UI.setPeople = function setPeople(current, total) {
            peopleText.text = current.formatCustom(0, '.', ',') + " / " + total.formatCustom(0, '.', ',');
        }
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));