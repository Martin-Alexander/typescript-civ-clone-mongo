import { Square } from "./models/square";

function GameDataController(gameData) {
  this.gameData = gameData;
}

GameDataController.prototype.replaceFromSquare = function(data) {
  const fromSquare = new Square(JSON.parse(data.new_squares[0]));
  this.gameData.replaceSquare(fromSquare);
}

GameDataController.prototype.replaceToSquare = function(data) {
  const toSquare = new Square(JSON.parse(data.new_squares[1]));
  this.gameData.replaceSquare(toSquare);
}

export { GameDataController };
