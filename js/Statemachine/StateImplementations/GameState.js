// MenuState constructor
function GameState(){
  State.call(this);
};

GameState.prototype = Object.create(State.prototype);

GameState.prototype.pause = null;

GameState.prototype.activate = function activate(){
  console.log("GameState.activate");
};

GameState.prototype.deactivate = function deactivate(){
  console.log("GameState.deactivate");
};

GameState.prototype.update = function update(){
  console.log("GameState.update");
};