(function(LD) {
    (function(UI) {
        (function(StatusBar) {
            var barContainer;
            var background;

            var activeBuilding;
            var activeBuildingSprite;

            var upgradeButton;

            StatusBar.initialize = function initialize(width, height) {
                barContainer = new PIXI.Container();
                barContainer.width = width;
                barContainer.height = height;

                background = new PIXI.Graphics();
                background.beginFill(0xFFFFFF);
                background.drawRect(0, 0, width, height);

                activeBuildingSprite = PIXI.Sprite.fromImage('img/road.png');

                upgradeButton = PIXI.Sprite.fromImage('img/upgradeButton.png');
                upgradeButton.x = width / 2 - 64;
                upgradeButton.y = 100;
                upgradeButton.interactive = true;
                upgradeButton.buttonMode = true;
                upgradeButton.on('pointerup', function() { 
                    if (activeBuilding) {
                        console.log('Leveling up building!');
                        activeBuilding.level += 1; 
                    }
                });

                //barContainer.addChild(background);
                barContainer.addChild(activeBuildingSprite);
                barContainer.addChild(upgradeButton);
                return barContainer;
            }

            StatusBar.setActiveBuilding = function setActiveBuilding(building) {
                activeBuilding = building;
                activeBuildingSprite.texture = activeBuilding.texture;
                activeBuildingSprite.alpha = 255;
            }

            StatusBar.clearActiveBuilding = function clearActiveBuilding() {
                activeBuilding = null;
                activeBuildingSprite.alpha = 0;
            }
        }(window.LD.UI.StatusBar = window.LD.UI.StatusBar || {}));
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));