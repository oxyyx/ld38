(function(LD) {
    (function(UI) {
        (function(StatusBar) {
            var barWidth;
            var barHeight;

            var barContainer;
            var background;

            var buildingName;
            var buildingLevel;

            var activeBuilding;
            var activeBuildingSprite;

            var upgradeButton;
            var buildingTextStyle;

            var upgradeCostTooltip;

            StatusBar.initialize = function initialize(width, height) {
                barWidth = width;
                barHeight = height;

                barContainer = new PIXI.Container();
                barContainer.width = width;
                barContainer.height = height;

                background = new PIXI.Graphics();
                background.beginFill(0x999999);
                background.drawRect(0, 0, width, height);

                var headerBackground = new PIXI.Graphics();
                headerBackground.beginFill(0x333333);
                headerBackground.drawRect(0, 0, width, 32);

                buildingTextStyle = new PIXI.TextStyle({
                    fontFamily: 'Courier New',
                    fontSize: 20,
                    fill: ['#FFFFFF']
                });

                buildingName = new PIXI.Text('', buildingTextStyle);
                buildingName.x = Math.floor(width / 2 - (buildingName.width / 2));
                buildingName.y = 6;

                buildingLevel = new PIXI.Text('', buildingTextStyle);
                buildingLevel.x = Math.floor(width / 2 - (buildingLevel.width / 2));
                buildingLevel.y = 112;

                activeBuildingSprite = PIXI.Sprite.fromImage('img/road.png');
                activeBuildingSprite.x = width / 2 - 32;
                activeBuildingSprite.y = 40;

                upgradeButton = PIXI.Sprite.fromImage('img/upgradeButton.png');
                upgradeButton.x = width / 2 - 72;
                upgradeButton.y = 140;
                upgradeButton.interactive = true;
                upgradeButton.buttonMode = true;
                upgradeButton.on('pointerup', function() { 
                    if (activeBuilding) {                        
                        LD.notify('upgradeTileButtonClicked', activeBuilding);

                        tooltipBackground.redraw();
                        
                        setBuildingLevelDisplay(activeBuilding.level);
                    }
                });

                var overUpgradeButton = false;
                upgradeButton.on('pointerover', function(args){
                    overUpgradeButton = true;                    
                    tooltipBackground.visible = true;
                    
                    var localPosition = args.data.getLocalPosition(upgradeButton);
                    localPosition.x += 10;
                    localPosition.y -= upgradeCostTooltipText.height + 10;
                    tooltipBackground.redraw(localPosition);
                });
                upgradeButton.on('pointermove', function(args){
                    if(!overUpgradeButton){
                        return;
                    }

                    var localPosition = args.data.getLocalPosition(upgradeButton);
                    localPosition.x += 10;
                    localPosition.y -= upgradeCostTooltipText.height + 10;
                    tooltipBackground.redraw(localPosition);
                });
                upgradeButton.on('pointerout', function(args){
                    overUpgradeButton = false;
                    tooltipBackground.visible = false;
                });

                var tooltipTextStyle = new PIXI.TextStyle({
                    fontFamily: 'Courier New',
                    fontSize: 15,
                    fill: ['#FFFFFF']
                });

                var tooltipBackground = new PIXI.Graphics();
                tooltipBackground.visible = false;
                tooltipBackground.redraw = function(coordinates){
                    upgradeCostTooltipText.text = "$" + activeBuilding.getCurrentUpgradeCost().formatCustom(0, '.', ',');

                    if(coordinates){
                        tooltipBackground.x = coordinates.x;
                        tooltipBackground.y = coordinates.y;
                    }
                    tooltipBackground.clear();
                    tooltipBackground.beginFill(0x333333, 0.75);
                    tooltipBackground.drawRect(0, 0, upgradeCostTooltipText.width + 16, upgradeCostTooltipText.height + 16);                    
                }
                upgradeCostTooltipText = new PIXI.Text('', tooltipTextStyle);
                upgradeCostTooltipText.x = 8;
                upgradeCostTooltipText.y = 8;

                barContainer.addChild(background);
                barContainer.addChild(headerBackground);
                barContainer.addChild(activeBuildingSprite);
                barContainer.addChild(upgradeButton);
                barContainer.addChild(buildingName);
                barContainer.addChild(buildingLevel);
                upgradeButton.addChild(tooltipBackground);
                tooltipBackground.addChild(upgradeCostTooltipText);

                barContainer.visible = false;

                return barContainer;
            }

            StatusBar.setActiveBuilding = function setActiveBuilding(building) {
                activeBuilding = building;
                activeBuildingSprite.texture = activeBuilding.texture;
                activeBuildingSprite.alpha = 255;

                setBuildingNameDisplay(building.name);
                setBuildingLevelDisplay(building.level);

                barContainer.visible = true;
            }

            StatusBar.clearActiveBuilding = function clearActiveBuilding() {
                activeBuilding = null;
                activeBuildingSprite.alpha = 0;

                barContainer.visible = false;
            }

            function setBuildingNameDisplay(name) {
                buildingName.text = name;
                buildingName.x = Math.floor(barWidth / 2 - (buildingName.width / 2)); 
            }

            function setBuildingLevelDisplay(level) {
                buildingLevel.text = level;
                buildingLevel.x = Math.floor(barWidth / 2 - (buildingLevel.width / 2)); 
            }
        }(window.LD.UI.StatusBar = window.LD.UI.StatusBar || {}));
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));