function Tile(){}
Tile.prototype.id = -1;
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
Tile.prototype.populationCapacity = 0;
Tile.prototype.foodProduction = 0;
Tile.prototype.jobsProvided = 0;
Tile.prototype.waterProvided = 0;
Tile.prototype.electricityProvided = 0;
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

function House(){
    this.id = 'house';
    this.baseIncome = 5;
    this.initialCost = 100;
    this.texture = PIXI.Texture.fromImage('img/house.png');
    this.populationCapacity = 10;
}
House.prototype = Tile.prototype;

function Industry(){
    this.id = 'industry';
    this.initialCost = 100;
    this.jobsProvided = 10;
    this.texture = PIXI.Texture.fromImage('img/industry.png');
}
Industry.prototype = Tile.prototype;

function ShopEntertainment(){
    this.id = 'shop';
    this.initialCost = 100;
    this.jobsProvided = 5;
    this.texture = PIXI.Texture.fromImage('img/shop.png');
}
ShopEntertainment.prototype = Tile.prototype;

function Farm(){
    this.id = 'farm';
    this.initialCost = 100;
    this.foodProduction = 10;
    this.texture = PIXI.Texture.fromImage('img/farmland.png');
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
    this.waterProvided = 10;
    this.texture = PIXI.Texture.fromImage('img/pipeline.png');
}
Pipeline.prototype = Tile.prototype;

function Powerline(){
    this.id = 'powercable';
    this.initialCost = 100;
    this.maintenanceCost = 20;
    this.isUnderground = true;
    this.electricityProvided = 10;
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