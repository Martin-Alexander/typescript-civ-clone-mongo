function GameDataController(gameData) {
  this.gameData = gameData;
}

GameDataController.prototype.pieceMove = function(data) {
  console.log("update gameData with new move");
}

export { GameDataController };

// const fromSquare = new Square(JSON.parse(data.result[0]));
// const toSquare = new Square(JSON.parse(data.result[1]));
// gameData.replaceSquare(fromSquare);
// gameData.replaceSquare(toSquare);