import { AStar } from "./a_star/a_star";

function InputController(UI, gameData, networkController, reactController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
  this.reactController = reactController;
}

// Selecting a square and cycling through units & structures
InputController.prototype.selectSquare = function() {
  const selectedSquare = this.squareClickedOn();

  console.log(selectedSquare);

  if (this.UI.selection.square == selectedSquare) {
    this.UI.selection.square = null;
    this.UI.selection.unit = null;
  } else if (selectedSquare.units.length > 0) {
    this.UI.selection.square = selectedSquare;
    this.UI.selection.unit = selectedSquare.units[0];
  }

  this.reactController.updateSelectionDetails(this.UI);
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
  if (this.UI.selection.square && this.UI.currentPath.length > 1) { 
    this.networkController.pieceMove({
      unit: this.UI.selection.square.units[0].id,
      path: this.UI.currentPath
    });

    this.UI.selection.square = null;
    this.UI.selection.unit = null;
    this.UI.currentPath = null;
  }

  this.reactController.updateSelectionDetails(this.UI);
};

InputController.prototype.drawPathLine = function() {
  this.UI.currentPath = AStar.run(this.gameData, { 
    start: this.UI.selection.square,
    finish: this.squareClickedOn()
  });

  this.reactController.updateSelectionDetails(this.UI);
}

// Tell server to initiate next turn
InputController.prototype.nextTurn = function() {
  this.networkController.nextTurn();
}

InputController.prototype.giveOrder = function(order) {
  this.networkController.giveOrder({
    square_coords: this.UI.tileMousePosition,
    unit: this.UI.selection.square.units[0].id,
    order: order
  });
}

// Querries gameData for the square corresponding to the tile that the mouse is over
InputController.prototype.squareClickedOn = function() {
  return this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
}

export { InputController };