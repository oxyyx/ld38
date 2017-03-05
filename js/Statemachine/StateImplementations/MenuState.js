// MenuState constructor
function MenuState(){
  this.startGame = null;

  this.activate = function activate(){
    console.log("MenuState.activate");

    this.startGame();
  };

  this.deactivate = function deactivate(){
    console.log("MenuState.deactivate");
  };

  this.update = function update(){
    console.log("MenuState.update");
  };
};

MenuState.prototype = new OverlayState();
