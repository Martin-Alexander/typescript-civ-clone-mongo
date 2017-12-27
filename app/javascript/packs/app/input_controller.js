import { AStar } from "./a_star/a_star";

function InputController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

// Selecting a square and cycling through units & structures
InputController.prototype.selectSquare = function() {
  const selectedSquare = this.squareClickedOn();

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
  if (this.UI.selection.square && this.UI.currentPath.length > 1) { 
    this.networkController.pieceMove({
      unit: this.UI.selection.square.units[0].id,
      path: this.UI.currentPath
    });

    this.UI.selection.square = null;
    this.UI.currentPath = null;
  }
};

// Ask server for AStar path and update UI
InputController.prototype.drawPathLine = function() {
  // this.networkController.aStar({
  //   from: this.UI.selection.square.id,
  //   to: this.squareClickedOn().id
  // }, (data) => {
  //   if (this.UI.selection.square) {
  //     this.UI.currentPath = data.path;
  //   }
  // });
  this.UI.currentPath = AStar.run(this.gameData, { 
    start: this.UI.selection.square,
    finish: this.squareClickedOn()
  });
}

// Querries gameData for the square corresponding to the tile that the mouse is over
InputController.prototype.squareClickedOn = function() {
  return this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
}

export { InputController };