(function(Grid){
  var tileTextures = {};
  var tiles = [];
  var spriteContainer = new PIXI.Container();
  var gridWidth = 0;
  var gridHeight = 0;
  var playableArea = {xStart: 0, yStart: 0, width: 0, height: 0};
  var tileWidth = 0;
  var tileHeight = 0;

  Grid.initialize = function initialize(totalWidth, totalHeight, playableWidth, playableHeight, pTileWidth, pTileHeight){
    gridWidth = totalWidth;
    gridHeight = totalHeight;
    
    playableArea.width = playableWidth;
    playableArea.height = playableHeight;
    playableArea.xStart = Math.round((totalWidth - playableWidth) / 2) - 1;
    playableArea.yStart = Math.round((totalHeight - playableHeight) / 2) - 1;

    tileWidth = pTileWidth;
    tileHeight = pTileHeight;

    initializeTileData('img/farmland.png', 'default');
    initializeTileData('img/house.png', 'special');

    for(var y = 0; y < gridHeight; y++){
      for(var x = 0; x < gridWidth; x++){
        var tileIndex = getTileIndex(x, y);

        if(x > playableArea.xStart && x <= playableArea.xStart + playableArea.width && y > playableArea.yStart && y <= playableArea.yStart + playableArea.height){
          tiles[tileIndex] = {id: 1};
          spriteContainer.addChildAt(createSpriteAtPosition('special', x, y), tileIndex);
        }
        else{
          tiles[tileIndex] = {id: 0};
          spriteContainer.addChildAt(createSpriteAtPosition('default', x, y), tileIndex);
        }        
      }
    }

    return spriteContainer;
  }

  Grid.getTileAmounts = function getTileAmounts(){

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

    if(x > playableArea.xStart && x <= playableArea.xStart + playableArea.width && y > playableArea.yStart && y <= playableArea.yStart + playableArea.height){
      sprite.buttonMode = true;
      sprite.interactive = true;
      sprite.on('pointerdown', onTileClicked);
    }

    function onTileClicked(){
      var tileIndex = getTileIndex(x, y);
      var activeTile = LD.activeTile;
      spriteContainer.children[tileIndex].texture = LD.activeTile.texture;
      tiles[tileIndex] = activeTile.id;
    }

    return sprite;
  }

  function getTileIndex(x, y){
    return (y * gridWidth) + x;
  }
}(window.LD.Grid = window.LD.Grid || {}))