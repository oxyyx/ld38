// MenuPopup constructor
function MenuPopup(){
  OverlayState.call(this);
};

MenuPopup.prototype = Object.create(OverlayState.prototype);

MenuPopup.prototype.showStackedOverlay = null;

var activateCount = 0;
MenuPopup.prototype.activate = function activate(){
  console.log("MenuPopup.activate");

  activateCount++;
  if(activateCount == 1){
    this.showStackedOverlay();
  }
  
  console.log("Half way MenuPopup.activate! ActivateCount: " + activateCount);

  if(activateCount == 2){
    this.dismiss();
  }

  activateCount++;
};

MenuPopup.prototype.deactivate = function deactivate(){
  console.log("MenuPopup.deactivate");
};

MenuPopup.prototype.update = function update(){
  console.log("MenuPopup.update");
};