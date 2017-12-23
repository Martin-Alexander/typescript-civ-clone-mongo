import { AStarSquare } from "./a_star_square";

function AStarBoard(gameData) {
  this.boardSize = gameData.size;
  this.squares = [];
  gameData.squares.forEach((square) => {
    this.squares.push(new AStarSquare(square));
  });
}

AStarBoard.manhattanDistance = function(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

AStarBoard.prototype.neighbours = function(square, radius = 1) {
  const xRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
  const yRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
  const neighbourSquares = [];

  xRange.forEach((x) => {
    yRange.forEach((y) => {
      if (!(                             // None of the following are true:
        (x === 0 && y === 0)          || // is original square
        x + square.x < 0              || // is...
        y + square.y < 0              || // outside...
        x + square.x > this.boardSize || // board...
        y + square.y > this.boardSize    // bounderies
      )) {
        neighbourSquares.push(this.findSquare(x + square.x, y + square.y));
      }
    });
  });

  return neighbourSquares;
}

AStarBoard.prototype.findSquare = function(x, y) {
  return this.squares[y * (this.boardSize + 1) + x];
}

export { AStarBoard };