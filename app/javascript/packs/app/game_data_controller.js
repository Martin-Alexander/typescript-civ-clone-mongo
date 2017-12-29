import { Square } from "./models/square";

function GameDataController(gameData, UI, reactController) {
  this.gameData = gameData;
  this.UI = UI;
  this.reactController = reactController;
}

GameDataController.prototype.replaceSquare = function(square) {
  const fromSquare = new Square(square);
  this.gameData.replaceSquare(fromSquare);
  this.updateSelectedSquare(fromSquare);
}

GameDataController.prototype.newGameData = function(rawGameData) {
  const oldSelectionSquare = this.UI.selection.square;
  this.gameData.newGameData(rawGameData);
  this.UI.selection.square = this.gameData.square(oldSelectionSquare.x, oldSelectionSquare.y);
  this.UI.selection.unit = this.UI.selection.square.units[0];
  this.reactController.updateSelectionDetails();
}

GameDataController.prototype.updateSelectedSquare = function(newSquare) {
  if (this.UI.selection.square && newSquare.equalTo(this.UI.selection.square)) {
    this.UI.selection.square = newSquare;
    this.UI.selection.unit = newSquare.units[0];
    this.reactController.updateSelectionDetails();
  }
}

export { GameDataController };
