// The purpose of this controller is the gather the relevant information the the UI state and
// from the game data to construct the appropriate instructions for the network controller and
// eventually the animations controller when client-side unit-move "prediction" is implemented
function UnitsController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

UnitsController.prototype.move = function() {
  if (this.UI.currentPath.length > 1) { 
    this.networkController.pieceMove({
      unit: this.UI.selection.unit.id,
      path: this.UI.currentPath
    });

    this.UI.selection.structure = null;
    this.UI.selection.square = null;
    this.UI.selection.unit = null;
    this.UI.currentPath = null;
    this.UI.reachableSquares= null;
  }  
}

UnitsController.prototype.order = function() {

}

export { UnitsController }
