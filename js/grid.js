(function(Grid){
    var tileTextures = {};
    var surfaceTiles = [];
    var undergroundTiles = [];
    var activeTiles = surfaceTiles;
    var surfaceSpriteContainer = new PIXI.Container();
    var undergroundSpriteContainer = new PIXI.Container();
    var activeSpriteContainer = surfaceSpriteContainer;
    var gridWidth = 0;
    var gridHeight = 0;
    var playableArea = {xStart: 0, yStart: 0, width: 0, height: 0};
    var tileWidth = 0;
    var tileHeight = 0;
    
    var pipelineConnection = null;
    var electricityConnection = null;
    var defaultConnectionTextures = null;
    
    
    Grid.initialize = function initialize(totalWidth, totalHeight, playableWidth, playableHeight, pTileWidth, pTileHeight){
        gridWidth = totalWidth;
        gridHeight = totalHeight;
        
        playableArea.width = playableWidth;
        playableArea.height = playableHeight;
        playableArea.xStart = Math.round((totalWidth - playableWidth) / 2);
        playableArea.yStart = Math.round((totalHeight - playableHeight) / 2);
        
        tileWidth = pTileWidth;
        tileHeight = pTileHeight;
        
        initializeTileData('img/farmland.png', 'default');
        initializeTileData('img/industry.png', 'special');
        initializeTileData('img/pipeline.png', 'pipeline');
        initializeTileData('img/powercable.png', 'powercable');
        initializeTileData('img/road.png', 'road');
        
        defaultConnectionTextures = [{spriteContainer: undergroundSpriteContainer, texture: tileTextures['pipeline']}, {spriteContainer: undergroundSpriteContainer, texture: tileTextures['powercable']}, {spriteContainer: surfaceSpriteContainer, texture: tileTextures['road']}];
        
        intitializeSurfaceTiles();
        initializeUndergroundTiles();
        
        activeSpriteContainer = surfaceSpriteContainer;
        activeTiles = surfaceTiles;
        
        return surfaceSpriteContainer;
    }
    
    Grid.switchToUnderground = function switchToUnderground(stage){
        activeSpriteContainer = undergroundSpriteContainer;
        activeTiles = undergroundTiles;
        
        var surfaceSpriteContainerStageIndex = stage.getChildIndex(surfaceSpriteContainer);
        stage.removeChild(surfaceSpriteContainer);
        stage.addChildAt(undergroundSpriteContainer, surfaceSpriteContainerStageIndex);
    }
    
    Grid.switchToSurface = function switchToSurface(stage){
        activeSpriteContainer = surfaceSpriteContainer;
        activeTiles = surfaceTiles;
        
        var undergroundSpriteContainerStageIndex = stage.getChildIndex(undergroundSpriteContainer);
        stage.removeChild(undergroundSpriteContainer);
        stage.addChildAt(surfaceSpriteContainer, undergroundSpriteContainerStageIndex);
    }
    
    Grid.getTileAmounts = function getTileAmounts(){
        
    }
    
    function intitializeSurfaceTiles(){
        for(var y = 0; y < gridHeight; y++){
            for(var x = 0; x < gridWidth; x++){
                var tileIndex = getTileIndex(x, y);
                
                if(x >= playableArea.xStart && x < playableArea.xStart + playableArea.width && y >= playableArea.yStart && y < playableArea.yStart + playableArea.height){
                    surfaceTiles[tileIndex] = {id: 1};
                    surfaceSpriteContainer.addChildAt(createSpriteAtPosition('special', x, y), tileIndex);
                }
                else{
                    surfaceTiles[tileIndex] = {id: 0};
                    surfaceSpriteContainer.addChildAt(createSpriteAtPosition('default', x, y), tileIndex);
                }        
            }
        }
    }
    
    function initializeUndergroundTiles(){
        for(var y = 0; y < gridHeight; y++){
            for(var x = 0; x < gridWidth; x++){
                var tileIndex = getTileIndex(x, y);
                
                if(x >= playableArea.xStart && x < playableArea.xStart + playableArea.width && y >= playableArea.yStart && y < playableArea.yStart + playableArea.height){
                    undergroundTiles[tileIndex] = {id: 1};
                    undergroundSpriteContainer.addChildAt(createSpriteAtPosition('default', x, y), tileIndex);
                }
                else{
                    undergroundTiles[tileIndex] = {id: 0};
                    undergroundSpriteContainer.addChildAt(createSpriteAtPosition('default', x, y), tileIndex);
                }
            }
        }
        
        for(var i = 0; i < defaultConnectionTextures.length; i++){
            while(!generateDefaultConnections(defaultConnectionTextures[i].spriteContainer, defaultConnectionTextures[i].texture));
        }
    }
    
    function generateDefaultConnections(spriteContainer, texture){
        var pipelineConnectionAtHorizontalEdge = Math.round(Math.random()) == 1;
        var pipelineConnectionAtFarEdge = Math.round(Math.random()) == 1;
        
        if(pipelineConnectionAtHorizontalEdge == true){
            var pipelineConnectionX = playableArea.xStart + Math.floor(Math.random() * playableArea.width);
            
            if(pipelineConnectionAtFarEdge){
                for(var i = playableArea.yStart + playableArea.height; i < gridHeight; i++){
                    var tileIndex = getTileIndex(pipelineConnectionX, i);
                    if(defaultConnectionTextures.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = texture;
                }
            }
            else{
                for(var i = 0; i < playableArea.yStart; i++){
                    var tileIndex = getTileIndex(pipelineConnectionX, i);
                    if(defaultConnectionTextures.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = texture;
                }
            }      
        }
        else{
            var pipelineConnectionY = playableArea.yStart + Math.floor(Math.random() * playableArea.height);
            
            if(pipelineConnectionAtFarEdge){
                for(var i = playableArea.xStart + playableArea.width; i < gridWidth; i++){
                    var tileIndex = getTileIndex(i, pipelineConnectionY);
                    if(defaultConnectionTextures.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = texture;
                }
            }
            else{
                for(var i = 0; i < playableArea.xStart; i++){
                    var tileIndex = getTileIndex(i, pipelineConnectionY);
                    if(defaultConnectionTextures.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = texture;
                }
            }
        }
        
        return true;
    }
    
    function initializeTileData(imageName, key){
        var texture = PIXI.Texture.fromImage(imageName);
        tileTextures[key] = texture;
    }
    
    function createSpriteAtPosition(key, x, y){
        var sprite = new PIXI.Sprite(tileTextures[key]);
        sprite.anchor.set(0);
        sprite.width = tileWidth;
        sprite.height = tileHeight;
        sprite.x = x * tileWidth;
        sprite.y = y * tileHeight;
        
        if(x >= playableArea.xStart && x < playableArea.xStart + playableArea.width && y >= playableArea.yStart && y < playableArea.yStart + playableArea.height){
            sprite.buttonMode = true;
            sprite.interactive = true;
            sprite.on('pointerdown', onTileClicked);
        }
        
        function onTileClicked(){
            var activeTile = LD.activeTile;
            if(activeTile != null && activeTile.texture != null && activeTile.id != null){
                var tileIndex = getTileIndex(x, y);      
                activeSpriteContainer.children[tileIndex].texture = LD.activeTile.texture;
                activeTiles[tileIndex] = activeTile.id;
            }
            else{
                // Select tile.
            }
        }
        
        return sprite;
    }
    
    function getTileIndex(x, y){
        return (y * gridWidth) + x;
    }
}(window.LD.Grid = window.LD.Grid || {}));








function Building(){}
Building.prototype.id = -1;
Building.prototype.income = 0;
Building.prototype.initialCost = 0;
Building.prototype.maintenanceCost = 0;
Building.prototype.level = 0;
Building.prototype.texture = null;

function House(){
    this.id = 0;
    this.income = 5;
    this.initialCost = 100;
}
House.prototype = Building.prototype;

function Industry(){
    this.id = 1;
    this.initialCost = 100;
}
Industry.prototype = Building.prototype;

function ShopEntertainment(){
    this.id = 2;
    this.initialCost = 100;
}
ShopEntertainment.prototype = Building.prototype;

function Farm(){
    this.id = 3;
    this.initialCost = 100;
}
Farm.prototype = Building.prototype;

function Road(){
    this.id = 4;
    this.initialCost = 100;
    this.maintenanceCost = 20;
}
Road.prototype = Building.prototype;

function Pipeline(){
    this.id = 5;
    this.initialCost = 100;
    this.maintenanceCost = 20;
}
Road.prototype = Building.prototype;

function Powerline(){
    this.id = 6;
    this.initialCost = 100;
    this.maintenanceCost = 20;
}
Road.prototype = Building.prototype;