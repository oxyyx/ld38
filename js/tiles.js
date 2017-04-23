function Tile(){}
Tile.prototype.id = -1;
Tile.prototype.baseIncome = 0;
Tile.prototype.initialCost = 0;
Tile.prototype.maintenanceCost = 0;
Tile.prototype.level = 0;
Tile.prototype.texture = null;
Tile.prototype.isUnderground = false;
Tile.prototype.getCurrentUpgradeCost = function getCurrentUpgradeCost(){
    return (this.initialCost + (200 * this.level)) + 200;
}
Tile.prototype.getCurrentIncome = function getCurrentUpgradeCost(){
    return (this.level * 35) / (this.level + 2.5) + this.baseIncome;
}

function House(){
    this.id = 'house';
    this.baseIncome = 5;
    this.initialCost = 100;
    this.texture = PIXI.Texture.fromImage('img/house.png');
}
House.prototype = Tile.prototype;

function Industry(){
    this.id = 'industry';
    this.initialCost = 100;
    this.texture = PIXI.Texture.fromImage('img/industry.png');
}
Industry.prototype = Tile.prototype;

function ShopEntertainment(){
    this.id = 'shop';
    this.initialCost = 100;
    this.texture = PIXI.Texture.fromImage('img/shop.png');
}
ShopEntertainment.prototype = Tile.prototype;

function Farm(){
    this.id = 'farm';
    this.initialCost = 100;
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
    this.maintenanceCost = 20;
    this.isUnderground = true;
    this.texture = PIXI.Texture.fromImage('img/pipeline.png');
}
Road.prototype = Tile.prototype;

function Powerline(){
    this.id = 'powercable';
    this.initialCost = 100;
    this.maintenanceCost = 20;
    this.isUnderground = true;
    this.texture = PIXI.Texture.fromImage('img/powercable.png');
}
Road.prototype = Tile.prototype;