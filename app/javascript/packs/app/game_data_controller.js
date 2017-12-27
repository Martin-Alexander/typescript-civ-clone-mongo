import { Square } from "./models/square";

function GameDataController(gameData) {
  this.gameData = gameData;
}

GameDataController.prototype.replaceSquare = function(square) {
  const fromSquare = new Square(square);
  this.gameData.replaceSquare(fromSquare);
}

export { GameDataController };
