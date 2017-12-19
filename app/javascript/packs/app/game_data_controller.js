import { Square } from "./models/square";

function GameDataController(gameData) {
  this.gameData = gameData;
}

GameDataController.prototype.pieceMove = function(data) {
  const fromSquare = new Square(JSON.parse(data.new_squares[0]));
  const toSquare = new Square(JSON.parse(data.new_squares[1]));
  this.gameData.replaceSquare(fromSquare);
  this.gameData.replaceSquare(toSquare);
}

export { GameDataController };
