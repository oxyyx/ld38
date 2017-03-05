// MenuState constructor
function GameState(){
  this.activate = function activate(){
    console.log("GameState.activate");
  };

  this.deactivate = function deactivate(){
    console.log("GameState.deactivate");
  };

  this.update = function update(){
    console.log("GameState.update");
  };
};

MenuState.prototype = new State();
