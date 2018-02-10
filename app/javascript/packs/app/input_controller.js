import { AStar } from "./a_star/a_star";

function InputController(UI, gameData, networkController, reactController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
  this.reactController = reactController;
}

InputController.prototype.setTileMousePosition = function(squareCoordinates) {
  if (!this._authorized("setTileMousePosition")) { return false; }

  this.UI.tileMousePosition = this.gameData.square(squareCoordinates);

  this.reactController.updateUI(this.UI);
}

// Selecting a square and cycling through units & structures
InputController.prototype.selectSquare = function() {
  if (!this._authorized("selectSquare")) { return false; }

  const selectedSquare = this.squareClickedOn();

  console.log(selectedSquare);

  // Selecting the same square twice will no longer deselected it
  // if (selectedSquare.units.length > 0 && selectedSquare != this.UI.selection.square) {
  if (selectedSquare.units.length > 0) {
    this.UI.selection.square = selectedSquare;
    // this.UI.selection.unit = selectedSquare.units[0];
    this._selectUnit(selectedSquare);
  } else {
    this.UI.selection.square = null;
    this.UI.selection.unit = null;
  }

  this.reactController.updateUI(this.UI);
};

// Pressing the right mouse button to begin unit movement path finding
InputController.prototype.pathFindBegin = function() {
  if (!this._authorized("pathFindBegin")) { return false; }
  if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }

  if (this.UI.selection.square && this.UI.selection.square.units[0]) { 
    this.drawPathLine();
  }
};

// Moving the mouse while holding down the right mouse button
InputController.prototype.pathUpdate = function() {
  if (!this._authorized("pathUpdate")) { return false; }
  if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }

  if (this.UI.selection.square && this.UI.currentPath) {
    this.drawPathLine();
  }
};

// Releasing the right mouse button and issuing a unit move or canceling
InputController.prototype.moveUnit = function() {
  if (!this._authorized("moveUnit")) { return false; }
  if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }

  if (this.UI.selection.square && this.UI.currentPath.length > 1) { 
    this.networkController.pieceMove({
      unit: this.UI.selection.unit.id,
      path: this.UI.currentPath
    });

    this.UI.selection.square = null;
    this.UI.selection.unit = null;
    this.UI.currentPath = null;
  }

  this.reactController.updateUI(this.UI);
};

InputController.prototype.drawPathLine = function() {
  if (!this._authorized("drawPathLine")) { return false; }
  if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }

  this.UI.currentPath = AStar.run(this.gameData, { 
    start: this.UI.selection.square,
    finish: this.squareClickedOn()
  });

  this.reactController.updateUI(this.UI);
}

// Tell server to initiate next turn
InputController.prototype.nextTurn = function() {
  if (!this._authorized("nextTurn")) { return false; }
  
  // this.UI.ongoingTurnTransition = true;
  this.networkController.nextTurn();
}

InputController.prototype.giveOrder = function(order) {
  if (!this._authorized("giveOrder")) { return false; }

  this.networkController.giveOrder({
    square_coords: this.UI.selection.square.getCoordinates(),
    unit: this.UI.selection.square.units[0].id,
    order: order
  });
}

// Querries gameData for the square corresponding to the tile that the mouse is over
InputController.prototype.squareClickedOn = function() {
  return this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
}

InputController.prototype._functionIsAllowed = function(functionName, allowedFunctionRules) {
  if (allowedFunctionRules.type === "inclusion") {
    return allowedFunctionRules.functionNames.includes(functionName);
  } else if (allowedFunctionRules.type === "exclusion") {
    return !allowedFunctionRules.functionNames.includes(functionName);
  }
}

InputController.prototype._authorized = function(functionName) {
  let allowedFunctionRules;

  if (this.UI.ongoingTurnTransition) {
    allowedFunctionRules = {
      type: "inclusion",
      functionNames: ["setTileMousePosition"]
    }
  } else if (this.UI.ready) {
    allowedFunctionRules = {
      type: "inclusion",
      functionNames: ["setTileMousePosition", "nextTurn", "selectSquare"]
    }    
  } else {
    allowedFunctionRules = {
      type: "exclusion",
      functionNames: []
    }    
  }

  return this._functionIsAllowed(functionName, allowedFunctionRules);
}

// Allows for the cycling selection of units
InputController.prototype._selectUnit = function(selectedSquare) {
  // Don't select unit if there aren't any units 
  if (this.UI.selection.square.units.length == 0) { return false; }

  // If there's already a unit from this square selected or there's no unit selected
  if (this.UI.selection.unit && selectedSquare == this.UI.selection.square) {
    const indexOfAlreadySelectedUnit = this.UI.selection.square.units.indexOf(this.UI.selection.unit);
    if (indexOfAlreadySelectedUnit == this.UI.selection.square.units.length - 1) {
      this.UI.selection.unit = null;
      this.UI.selection.square = null;
    } else {
      this.UI.selection.unit = this.UI.selection.square.units[indexOfAlreadySelectedUnit + 1];
    }
  } else {
    this.UI.selection.unit = this.UI.selection.square.units[0];
  }
}

export { InputController };