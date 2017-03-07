// MenuPopupStackedOverlay constructor
function MenuPopupStackedOverlay(){
  OverlayState.call(this);
};

MenuPopupStackedOverlay.prototype = Object.create(OverlayState.prototype);

MenuPopupStackedOverlay.prototype.activate = function activate(){
  console.log("MenuPopupStackedOverlay.activate");

  this.dismiss();
};

MenuPopupStackedOverlay.prototype.deactivate = function deactivate(){
  console.log("MenuPopupStackedOverlay.deactivate");
};

MenuPopupStackedOverlay.prototype.update = function update(){
  console.log("MenuPopupStackedOverlay.update");
};