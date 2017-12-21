function InputController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

// Selecting a square and cycling through units & structures
InputController.prototype.selectSquare = function() {
  const selectedSquare = this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
  console.log(selectedSquare);

  if (this.UI.selection.square == selectedSquare) {
    this.UI.selection.square = null;
  } else if (selectedSquare.units.length > 0) {
    this.UI.selection.square = selectedSquare;
  }
};

// Pressing the right mouse button to begin unit movement path finding
InputController.prototype.pathFindBegin = function() {
  if (this.UI.selection.square) {
    this.drawPathLine();
  }
};

// Moving the mouse while holding down the right mouse button
InputController.prototype.pathUpdate = function() {
  if (this.UI.selection.square && this.UI.currentPath) {
    this.drawPathLine();
  }
};

// Releasing the right mouse button and issuing a unit move or canceling
InputController.prototype.moveUnit = function() {
  this.UI.selection.square = null;
  this.UI.currentPath = null;
};

InputController.prototype.drawPathLine = function() {
  const destinationTile = this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);

  this.networkController.aStar({
    from: this.UI.selection.square.id,
    to: destinationTile.id
  }, (data) => {
    this.UI.currentPath = data.path;
  });
}

export { InputController };