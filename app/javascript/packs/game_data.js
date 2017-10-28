function GameData(rawGameData) {
  const parsedData = JSON.parse(rawGameData);
  Object.keys(parsedData).forEach((key) => {
    if (typeof parsedData[key] != "function") {
      this[key] = parsedData[key];
    }
  });
}

GameData.prototype.square = function(col, row = false) {
  let square;
  if (row === false) {
    square = this.squares[col];
  } else {
    square = this.squares[row * this.size + col]
  }
  return square;
}

export { GameData }