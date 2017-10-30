/* global rawGameData */

function GameData(rawGameData) {
  const parsedData = JSON.parse(rawGameData);
  Object.keys(parsedData).forEach((key) => {
    this[key] = parsedData[key];
  });
}

GameData.prototype.square = function(col, row = false) {
  let square;
  if (row === false) {
    square = this.squares[col];
  } else {
    square = this.squares[row * (this.size + 1) + col];
  }
  return square;
};

const gameData = new GameData(rawGameData);

export { gameData };