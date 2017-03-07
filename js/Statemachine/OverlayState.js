// OverlayState constructor
function OverlayState(){
  State.call(this);
};

OverlayState.prototype = Object.create(State.prototype);

OverlayState.prototype.dismissEventHandler = null;

OverlayState.prototype.activate = function activate(){
  console.log("OverlayState.activate");
};

OverlayState.prototype.deactivate = function deactivate(){
  console.log("OverlayState.deactivate");
};

OverlayState.prototype.update = function update(){
  console.log("OverlayState.update");
};

OverlayState.prototype.dismiss = function dismiss(){
  this.dismissEventHandler();
};