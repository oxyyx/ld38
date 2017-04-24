function Tile(){}
Tile.prototype.id = -1;
Tile.prototype.name = 'Unnamed';
Tile.prototype.baseIncome = 0;
Tile.prototype.initialCost = 0;
Tile.prototype.maintenanceCost = 0;
Tile.prototype.level = 0;
Tile.prototype.texture = null;
Tile.prototype.isUnderground = false;
Tile.prototype.hasWater = false;
Tile.prototype.hasElectricity = false;
Tile.prototype.hasRoad = false;
Tile.prototype.isDefaultTile = false;
Tile.prototype.basePopulationCapacity = 0;
Tile.prototype.baseFoodProduction = 0;
Tile.prototype.baseJobsProvided = 0;
Tile.prototype.baseWaterProvided = 0;
Tile.prototype.baseElectricityProvided = 0;
Tile.prototype.getCurrentUpgradeCost = function getCurrentUpgradeCost(){
    return (this.initialCost + (200 * this.level)) + 200;
}
Tile.prototype.getCurrentIncome = function getCurrentIncome(){
    if(this.isDefaultTile){
        return 0;
    }

    return (this.level * 35) / (this.level + 2.5) + this.baseIncome;
}
Tile.prototype.getCurrentCost = function getCurrentCost(){
    if(this.isDefaultTile){
        return 0;
    }

    return (0.5 * this.level * 35) / ( 0.5 * this.level + 2.5) + this.maintenanceCost;
}
Tile.prototype.getCurrentJobsProvided = function getCurrentJobsProvided(){
    return this.baseJobsProvided * (this.level + 1);
}

Tile.prototype.getCurrentFoodProduced = function getCurrentFoodProduced(){
    return this.baseFoodProduction * (this.level + 1);
}

Tile.prototype.getCurrentWaterProvided = function getCurrentWaterProvided(){
    return this.baseWaterProvided * (this.level + 1);
}

Tile.prototype.getCurrentElectricityProvided = function getCurrentElectricityProvided(){
    return this.baseElectricityProvided * (this.level + 1);
}

Tile.prototype.getCurrentPopulationCapacity = function getCurrentPopulationCapacity(){
    return this.basePopulationCapacity * (this.level + 1);
}

function House(){
    this.id = 'house';
    this.baseIncome = 5;
    this.initialCost = 100;
    this.texture = PIXI.Texture.fromImage('img/house.png');
    this.basePopulationCapacity = 10;

    switch(getRandomInt(1, 3)) {
        case 1: this.name = 'The Garfields'; break;
        case 2: this.name = 'The Fredricks'; break;
        case 3: this.name = 'The Ericsons'; break;
    }
}
House.prototype = Tile.prototype;

function Industry(){
    this.id = 'industry';
    this.initialCost = 100;
    this.baseJobsProvided = 10;
    this.texture = PIXI.Texture.fromImage('img/industry.png');
    this.name = 'Industry';
}
Industry.prototype = Tile.prototype;

function ShopEntertainment(){
    this.id = 'shop';
    this.initialCost = 100;
    this.baseJobsProvided = 5;
    this.texture = PIXI.Texture.fromImage('img/shop.png');
    this.name = 'Shop';
}
ShopEntertainment.prototype = Tile.prototype;

function Farm(){
    this.id = 'farm';
    this.initialCost = 100;
    this.baseFoodProduction = 10;
    this.texture = PIXI.Texture.fromImage('img/farmland.png');
    this.name = 'Farm';
}
Farm.prototype = Tile.prototype;

function Road(){
    this.id = 'road';
    this.initialCost = 100;
    this.maintenanceCost = 20;
    this.texture = PIXI.Texture.fromImage('img/road.png');
}
Road.prototype = Tile.prototype;

function Pipeline(){
    this.id = 'pipe';
    this.initialCost = 100;
    this.maintenanceCost = 20 ;
    this.isUnderground = true;
    this.baseWaterProvided = 10;
    this.texture = PIXI.Texture.fromImage('img/pipeline.png');
}
Pipeline.prototype = Tile.prototype;

function Powerline(){
    this.id = 'powercable';
    this.initialCost = 100;
    this.maintenanceCost = 20;
    this.isUnderground = true;
    this.baseElectricityProvided = 10;
    this.texture = PIXI.Texture.fromImage('img/powercable.png');
}
Powerline.prototype = Tile.prototype;

function PassiveTile(){
    this.id = 'passive';
    this.getCurrentIncome = function(){ return 0; }
    this.getCurrentCost = function() { return 0; }
}
PassiveTile.prototype = Tile.prototype;

(function(TileStorage){
    TileStorage.buildingConstructors = {};

    TileStorage.buildingConstructors[new House().id] = House;
    TileStorage.buildingConstructors[new Industry().id] = Industry;
    TileStorage.buildingConstructors[new ShopEntertainment().id] = ShopEntertainment;
    TileStorage.buildingConstructors[new Farm().id] = Farm;
    TileStorage.buildingConstructors[new Road().id] = Road;
    TileStorage.buildingConstructors[new Pipeline().id] = Pipeline;
    TileStorage.buildingConstructors[new Powerline().id] = Powerline;
})(window.LD.TileStorage = window.LD.TileStorage || {});