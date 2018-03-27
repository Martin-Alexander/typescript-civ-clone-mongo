import { ReachableSquares } from "./../services/a_star/calculations/reachable_squares";

// The purpose of this controller is the gather the relevant information the the UI state and
// from the game data to construct the appropriate instructions for the network controller and
// eventually the animations controller when client-side unit-move "prediction" is implemented
function UnitsController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

UnitsController.prototype.move = function() {
  this.destinationSquare = gameData.findSquare(this.UI.currentPath[this.UI.currentPath.length - 1]);

  if (this.UI.currentPath.length > 1) { 
    this.determineAndSendUnitCommand();

    this.UI.selection.structure = null;
    this.UI.selection.square = null;
    this.UI.selection.unit = null;
    this.UI.currentPath = null;
    this.UI.reachableSquares= null;
  }  
}

UnitsController.prototype.determineAndSendUnitCommand = function() {
  if (this.allowedToMerge()) {
    this.pieceMerge();
  } else {
    this.pieceMove();
  }
}

UnitsController.prototype.pieceMove = function() {
  this.networkController.pieceMove({
    unit: this.UI.selection.unit.id,
    path: this.UI.currentPath,
  });  
}

UnitsController.prototype.pieceMerge = function() {
  this.networkController.pieceMerge({
    unit: this.UI.selection.unit.id,
    path: this.UI.currentPath,
  });  
}

UnitsController.prototype.destinationIsImmediatelyReachable = function() {
  const reachableSquares = ReachableSquares.run({
    squares: this.gameData.squares,
    unit: this.UI.selection.unit,
    startSquare: this.UI.selection.square,
    allSquaresAreDestinations: true
  });
  return reachableSquares.map(coordinates => this.gameData.findSquare(coordinates)).includes(this.destinationSquare);
}

UnitsController.prototype.allowedToMerge = function() {
  return this.destinationIsImmediatelyReachable(this.destinationSquare) && 
  this.destinationSquare.hasMilitaryUnit() &&
  this.areOwnedBySamePlayer(this.destinationSquare.getMilitaryUnit(), this.UI.selection.unit) &&
  this.areTheSameUnit(this.destinationSquare.getMilitaryUnit(), this.UI.selection.unit);
}

UnitsController.prototype.areOwnedBySamePlayer = function(firstUnit, secondUnit) {
  return firstUnit.player_number === secondUnit.player_number;
}

UnitsController.prototype.areTheSameUnit = function (firstUnit, secondUnit) {
  return firstUnit.type === secondUnit.type;
}

UnitsController.prototype.order = function() {

}

export { UnitsController }
