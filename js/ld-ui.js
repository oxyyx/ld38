(function(LD) {
    (function(UI) {
        var uiContainer;

        var currencyText;
        var technologyText;
        var foodText;
        var waterText;
        var electricityText;
        
        UI.initialize = function initializeUI() {
            uiContainer = new PIXI.Container();

            currencyText = new PIXI.Text(0, { fontSize: 20 });
            currencyText.y = 0;

            technologyText = new PIXI.Text(0, { fontSize: 20 });
            technologyText.y = 20;

            foodText = new PIXI.Text(0, { fontSize: 20 });
            foodText.y = 40;

            waterText = new PIXI.Text(0, { fontSize: 20 });
            waterText.y = 60;

            electricityText = new PIXI.Text(0, { fontSize: 20 });
            electricityText.y = 80;

            uiContainer.addChild(currencyText);
            uiContainer.addChild(technologyText);
            uiContainer.addChild(foodText);
            uiContainer.addChild(waterText);
            uiContainer.addChild(electricityText);

            return uiContainer;
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
    }(window.LD.UI = window.LD.UI || {}));
}(window.LD = window.LD || {}));