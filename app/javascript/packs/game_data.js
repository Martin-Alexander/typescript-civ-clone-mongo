import { Square } from "./square";

/* global rawGameData */

const gameData = JSON.parse(rawGameData);

gameData.initialize = function() {
  for (let i = 0; i < this.squares.length; i++) {
    this.squares[i] = new Square(this.squares[i]);
  }
}

gameData.square = function(col, row = false) {
  let square;
  if (row === false) {
    square = this.squares[col];
  } else {
    square = this.squares[row * (this.size + 1) + col];
  }
  return square;
};

gameData.initialize();

export { gameData };