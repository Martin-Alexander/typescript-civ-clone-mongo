/* global rawGameData */

const gameData = JSON.parse(rawGameData);

gameData.square = function(col, row = false) {
  let square;
  if (row === false) {
    square = this.squares[col];
  } else {
    square = this.squares[row * (this.size + 1) + col];
  }
  return square;
};

export { gameData };