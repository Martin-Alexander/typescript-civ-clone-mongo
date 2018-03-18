import { Square } from "./../models/square";

function GameDataController(gameData, UI, reactController) {
  this.gameData = gameData;
  this.UI = UI;
  this.reactController = reactController;
}

GameDataController.prototype.pieceMove = function(data, animationCallback) {
  this.replaceSquare(data.new_squares[0])
  if (data.new_squares[1]) {
    animationCallback(data, () => {
      const newSquare = this.replaceSquare(data.new_squares[1])
      if (!this.UI.ongoingTurnTransition && newSquare.units[0].player_number == this.gameData.getCurrentPlayer().number) {
        // this.updateSelectedSquare(newSquare);
      }
    })
  }
}

GameDataController.prototype.updatePlayersReady = function(playersReady) {
  this.gameData.updatePlayersReady(playersReady);
  this.reactController.updateGameData(gameData);
}

GameDataController.prototype.giveOrder = function(newSquare) {
  this.replaceSquare(newSquare);
  this.updateSelectedSquare();
}

GameDataController.prototype.replaceSquare = function(square) {
  const newSquare = new Square(square);
  this.gameData.replaceSquare(newSquare);

  return newSquare;
}

GameDataController.prototype.newGameData = function(rawGameData) {
  this.gameData.newGameData(rawGameData);
  this.updateSelectedSquare();
  this.UI.ongoingTurnTransition = false;
  this.reactController.updateGameData(gameData);
}

GameDataController.prototype.updateSelectedSquare = function(newSelectionSquare = false) {
  if (this.UI.selection.square || (newSelectionSquare && newSelectionSquare.units[0].moves > 0)) {

    if (newSelectionSquare) {
      this.UI.selection.square = newSelectionSquare;
    } else {
      this.UI.selection.square = this.gameData.square(this.UI.selection.square);
    }

    this.UI.selection.unit = this.UI.selection.square.units[0];
    this.reactController.updateUI();
  }
}

export { GameDataController };
