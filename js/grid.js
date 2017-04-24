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

    Grid.onTileClicked = null;
    
    Grid.initialize = function initialize(totalWidth, totalHeight, playableWidth, playableHeight, pTileWidth, pTileHeight){
        gridWidth = totalWidth;
        gridHeight = totalHeight;
        
        playableArea.width = playableWidth;
        playableArea.height = playableHeight;
        playableArea.xStart = Math.round((totalWidth - playableWidth) / 2);
        playableArea.yStart = Math.round((totalHeight - playableHeight) / 2);
        
        tileWidth = pTileWidth;
        tileHeight = pTileHeight;
        
        initializeTileData('img/grass.png', 'default');
        initializeTileData('img/dirt.png', 'special');
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
    
    Grid.getTiles = function getTiles(){
        return surfaceTiles.concat(undergroundTiles);
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
                    surfaceSpriteContainer.addChildAt(createSpriteAtPosition('special', x, y), tileIndex);
                }
                else{
                    surfaceTiles[tileIndex] = new PassiveTile();
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
                    undergroundTiles[tileIndex] = new PassiveTile();
                    undergroundSpriteContainer.addChildAt(createSpriteAtPosition('default', x, y), tileIndex);
                }
                else{
                    undergroundTiles[tileIndex] = new PassiveTile();
                    undergroundSpriteContainer.addChildAt(createSpriteAtPosition('default', x, y), tileIndex);
                }
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
            if(LD.Grid.onTileClicked != null){
                LD.Grid.onTileClicked(activeTiles[getTileIndex(x, y)], x, y);
            }
        }
        
        return sprite;
    }

    function checkCanPlaceTile(activeTile, x, y){
        var undergroundAndCanBePlaced = activeTile.isUnderground && activeSpriteContainer == undergroundSpriteContainer && activeTiles == undergroundTiles;
        var surfaceAndCanbePlaced = !activeTile.isUnderground && activeSpriteContainer == surfaceSpriteContainer && activeTiles == surfaceTiles;

        if(!undergroundAndCanBePlaced && !surfaceAndCanbePlaced){
            return false;
        }

        if(activeTile.id == 'road'){
            return checkHasConnectionOfType(activeTile, x, y);
        }
        else if(activeTile.id == 'pipe'){
            return checkHasConnectionOfType(activeTile, x, y);
        }
        else if(activeTile.id == 'powercable'){
            return checkHasConnectionOfType(activeTile, x, y);
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