import { Square } from "./models/square";

function GameData(rawGameData) {
  const data = JSON.parse(rawGameData);
  Object.keys(data).forEach((property) => {
    this[property] = data[property];
  });
}

GameData.prototype.initialize = function() {
  for (let i = 0; i < this.squares.length; i++) {
    this.squares[i] = new Square(this.squares[i]);
  }
};

GameData.prototype.square = function(col, row = false) {
  let square;
  if (row === false) {
    square = this.squares[col];
  } else {
    square = this.squares[row * (this.size + 1) + col];
  }
  return square;
};

GameData.prototype.replaceSquare = function(square) {
  this.squares[square.y * (this.size + 1) + square.x] = square;
};

export { GameData };