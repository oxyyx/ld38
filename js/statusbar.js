(function(LD) {
    (function(UI) {
        (function(StatusBar) {
            var barContainer;
            var background;

            var activeBuilding;
            var activeBuildingSprite;

            StatusBar.initialize = function initialize(width, height) {
                barContainer = new PIXI.Container();
                barContainer.width = width;
                barContainer.height = height;

                background = new PIXI.Graphics();
                background.beginFill(0xFFFFFF);
                background.drawRect(0, 0, width, height);

                activeBuildingSprite = PIXI.Sprite.fromImage('img/house.png');

                barContainer.addChild(background);
                barContainer.addChild(activeBuildingSprite);
                return barContainer;
            }

            StatusBar.setActiveBuilding = function setActiveBuilding(building) {
                activeBuildingSprite.texture = building.texture;
                activeBuildingSprite.alpha = 255;
            }

            StatusBar.clearActiveBuilding = function clearActiveBuilding() {
                activeBuilding = null;
                activeBuildingSprite.alpha = 0;
            }
        }(window.LD.UI.StatusBar = window.LD.UI.StatusBar || {}));
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));