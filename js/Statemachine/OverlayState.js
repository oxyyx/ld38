// OverlayState constructor
function OverlayState(){
  this.activate = function activate(){
    console.log("OverlayState.activate");
  };

  this.deactivate = function deactivate(){
    console.log("OverlayState.deactivate");
  };

  this.update = function update(){
    console.log("OverlayState.update");
  };
};

OverlayState.prototype = new State();
