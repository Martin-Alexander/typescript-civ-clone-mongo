function InputController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

// Selecting a square and cycling through units & structures
InputController.prototype.selectSquare = function() {
  console.log(this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y));
};

// Pressing the right mouse button to begin unit movement path finding
InputController.prototype.pathFindBegin = function() {
  console.log("path finding mode begins");
};

// Moving the mouse while holding down the right mouse button
InputController.prototype.pathUpdate = function() {
  console.log(this.UI.tileMousePosition);
};

// Releasing the right mouse button and issuing a unit move or canceling
InputController.prototype.moveUnit = function() {
  console.log("move unit or cancel path finding");
};

export { InputController };