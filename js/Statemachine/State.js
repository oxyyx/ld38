// State constructor.
function State(){
};

State.prototype.activate = function activate(){
  console.log("State.activate");
};

State.prototype.deactivate = function deactivate(){
  console.log("State.deactivate");
};

State.prototype.update = function update(){
  console.log("State.update");
};
