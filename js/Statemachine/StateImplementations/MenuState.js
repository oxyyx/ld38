// MenuState constructor
function MenuState(){
  OverlayState.call(this);
};

MenuState.prototype = Object.create(OverlayState.prototype);

MenuState.prototype.startGame = null;
MenuState.prototype.showPopup = null;

MenuState.prototype.activate = function activate(){
  console.log("MenuState.activate");
};

MenuState.prototype.deactivate = function deactivate(){
  console.log("MenuState.deactivate");
};

MenuState.prototype.update = function update(){
  console.log("MenuState.update");
};