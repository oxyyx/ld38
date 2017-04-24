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
    var defaultConnectionTiles = null;

    var amountOfPlayableTiles;
    
    Grid.initialize = function initialize(totalWidth, totalHeight, playableWidth, playableHeight, pTileWidth, pTileHeight){
        gridWidth = totalWidth;
        gridHeight = totalHeight;

        amountOfPlayableTiles = playableWidth * playableHeight;
        
        playableArea.width = playableWidth;
        playableArea.height = playableHeight;
        playableArea.xStart = Math.round((totalWidth - playableWidth) / 2);
        playableArea.yStart = Math.round((totalHeight - playableHeight) / 2);
        
        tileWidth = pTileWidth;
        tileHeight = pTileHeight;
        
        initializeTileData('img/grass.png', 'passiveGrass');
        initializeTileData('img/dirt.png', 'passiveDirt');
        initializeTileData('img/pipeline.png', 'pipeline');
        initializeTileData('img/powercable.png', 'powercable');
        initializeTileData('img/road.png', 'road');
        
        var pipeline = new Pipeline();
        pipeline.isDefaultTile = true;
        var powercable = new Powerline();
        powercable.isDefaultTile = true;
        var road = new Road();
        road.isDefaultTile = true;
        defaultConnectionTiles = [pipeline, powercable, road];
        
        intitializeSurfaceTiles();
        initializeUndergroundTiles();
        
        activeSpriteContainer = surfaceSpriteContainer;
        activeTiles = surfaceTiles;
        
        surfaceSpriteContainer.visible = true;
        undergroundSpriteContainer.visible = false;

        return [surfaceSpriteContainer, undergroundSpriteContainer];
    }
    
    Grid.switchToUnderground = function switchToUnderground(){
        activeSpriteContainer = undergroundSpriteContainer;
        activeTiles = undergroundTiles;
        
        surfaceSpriteContainer.visible = false;
        undergroundSpriteContainer.visible = true;
    }
    
    Grid.switchToSurface = function switchToSurface(){
        activeSpriteContainer = surfaceSpriteContainer;
        activeTiles = surfaceTiles;

        surfaceSpriteContainer.visible = true;
        undergroundSpriteContainer.visible = false;
    }
    
    Grid.getTiles = function getTiles(){
        return surfaceTiles.concat(undergroundTiles);
    }

    Grid.getAmountOfPlayableTiles = function getAmountOfPlayableTiles() {
        return amountOfPlayableTiles;
    }

    Grid.tryPlaceTile = function tryPlaceTile(tile, x, y){  
        var canPlace = checkCanPlaceTile(tile, x, y);

        if(canPlace){
            var tileIndex = getTileIndex(x, y);
            activeSpriteContainer.children[tileIndex].texture = tile.texture;
            activeTiles[tileIndex] = tile;
        }

        return canPlace;
    }
    
    function intitializeSurfaceTiles(){
        for(var y = 0; y < gridHeight; y++){
            for(var x = 0; x < gridWidth; x++){
                var tileIndex = getTileIndex(x, y);
                
                if(x >= playableArea.xStart && x < playableArea.xStart + playableArea.width && y >= playableArea.yStart && y < playableArea.yStart + playableArea.height){
                    surfaceTiles[tileIndex] = new PassiveTile();
                    surfaceTiles[tileIndex].isDefaultTile = true;
                    surfaceSpriteContainer.addChildAt(createSpriteAtPosition('passiveDirt', x, y), tileIndex);
                }
                else{
                    surfaceTiles[tileIndex] = new PassiveTile();
                    surfaceTiles[tileIndex].isDefaultTile = true;
                    surfaceSpriteContainer.addChildAt(createSpriteAtPosition('passiveGrass', x, y), tileIndex);
                }        
            }
        }
    }
    
    function initializeUndergroundTiles(){
        for(var y = 0; y < gridHeight; y++){
            for(var x = 0; x < gridWidth; x++){
                var tileIndex = getTileIndex(x, y);

                undergroundTiles[tileIndex] = new PassiveTile();
                surfaceTiles[tileIndex].isDefaultTile = true;
                undergroundSpriteContainer.addChildAt(createSpriteAtPosition('passiveDirt', x, y), tileIndex);
            }
        }
        
        for(var i = 0; i < defaultConnectionTiles.length; i++){
            while(!generateDefaultConnections(defaultConnectionTiles[i]));
        }
    }
    
    function generateDefaultConnections(tile){
        var spriteContainer = tile.isUnderground ? undergroundSpriteContainer : surfaceSpriteContainer;
        var tilesArray = tile.isUnderground ? undergroundTiles : surfaceTiles;

        var pipelineConnectionAtHorizontalEdge = Math.round(Math.random()) == 1;
        var pipelineConnectionAtFarEdge = Math.round(Math.random()) == 1;
        
        if(pipelineConnectionAtHorizontalEdge == true){
            var pipelineConnectionX = playableArea.xStart + Math.floor(Math.random() * playableArea.width);
            
            if(pipelineConnectionAtFarEdge){
                for(var i = playableArea.yStart + playableArea.height; i < gridHeight; i++){
                    var tileIndex = getTileIndex(pipelineConnectionX, i);
                    if(defaultConnectionTiles.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = tile.texture;
                    tilesArray[tileIndex] = tile;
                }
            }
            else{
                for(var i = 0; i < playableArea.yStart; i++){
                    var tileIndex = getTileIndex(pipelineConnectionX, i);
                    if(defaultConnectionTiles.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = tile.texture;
                    tilesArray[tileIndex] = tile;
                }
            }      
        }
        else{
            var pipelineConnectionY = playableArea.yStart + Math.floor(Math.random() * playableArea.height);
            
            if(pipelineConnectionAtFarEdge){
                for(var i = playableArea.xStart + playableArea.width; i < gridWidth; i++){
                    var tileIndex = getTileIndex(i, pipelineConnectionY);
                    if(defaultConnectionTiles.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = tile.texture;
                    tilesArray[tileIndex] = tile;
                }
            }
            else{
                for(var i = 0; i < playableArea.xStart; i++){
                    var tileIndex = getTileIndex(i, pipelineConnectionY);
                    if(defaultConnectionTiles.contains(spriteContainer.children[tileIndex].texture)){
                        return false;
                    }
                    
                    spriteContainer.children[tileIndex].texture = tile.texture;
                    tilesArray[tileIndex] = tile;
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
            LD.notify('tileClicked', {tile: activeTiles[getTileIndex(x, y)], x: x, y: y});
        }
        
        return sprite;
    }

    function checkCanPlaceTile(activeTile, x, y){
        if(activeTile.id == activeTiles[getTileIndex(x, y)].id){
            return false;
        }

        var undergroundAndCanBePlaced = activeTile.isUnderground && activeSpriteContainer == undergroundSpriteContainer && activeTiles == undergroundTiles;
        var surfaceAndCanbePlaced = !activeTile.isUnderground && activeSpriteContainer == surfaceSpriteContainer && activeTiles == surfaceTiles;

        if(!undergroundAndCanBePlaced && !surfaceAndCanbePlaced){
            return false;
        }

        if(activeTile.id == 'road'){
            return checkHasConnectionOfType(activeTile, x, y);
        }
        else if(activeTile.id == 'pipe'){
            return checkHasConnectionOfType(activeTile, x, y) || checkHasConnectionOfType({ id: 'powerwatercable'}, x, y);
        }
        else if(activeTile.id == 'powercable'){
            return checkHasConnectionOfType(activeTile, x, y) || checkHasConnectionOfType({ id: 'powerwatercable'}, x, y);
        }
        else if(activeTile.id == 'powerwatercable'){
            return (checkHasConnectionOfType({ id: 'pipe'}, x, y) && checkHasConnectionOfType({ id: 'powercable'}, x, y)) || checkHasConnectionOfType({ id: 'powerwatercable'}, x, y);
        }

        return true;
    }

    function checkHasConnectionOfType(activeTile, x, y){
        
        if(x - 1 >= 0){
            var tileIndex = getTileIndex(x - 1, y);
            if(activeTiles[tileIndex].id == activeTile.id){
                return true;
            }
        }
        if(x + 1 < gridWidth){
            var tileIndex = getTileIndex(x + 1, y);
            if(activeTiles[tileIndex].id == activeTile.id){
                return true;
            }
        }
        if(y - 1 >= 0){
            var tileIndex = getTileIndex(x, y - 1);
            if(activeTiles[tileIndex].id == activeTile.id){
                return true;
            }
        }
        if(y + 1 < gridHeight){
            var tileIndex = getTileIndex(x, y + 1);
            if(activeTiles[tileIndex].id == activeTile.id){
                return true;
            }
        }

        return false;
    }
    
    function getTileIndex(x, y){
        return (y * gridWidth) + x;
    }
}(window.LD.Grid = window.LD.Grid || {}));