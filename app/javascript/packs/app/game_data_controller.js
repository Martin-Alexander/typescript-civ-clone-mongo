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
  this.gameData.newGameData(rawGameData);
}

GameDataController.prototype.updateSelectedSquare = function(newSquare) {
  if (this.UI.selection.square && newSquare.equalTo(this.UI.selection.square)) {
    this.UI.selection.square = newSquare;
    this.UI.selection.unit = newSquare.units[0];
    this.reactController.updateSelectionDetails();
  }
}

export { GameDataController };
