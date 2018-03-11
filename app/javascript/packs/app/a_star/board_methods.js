const BoardMethods = {};

BoardMethods.neighbours = function(square, radius = 1) {
  const xRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
  const yRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
  const neighbourSquares = [];

  xRange.forEach((x) => {
    yRange.forEach((y) => {
      if (!(                                 // None of the following are true:
        (x === 0 && y === 0)              || // is original square
        x + square.x < 0                  || // is...
        y + square.y < 0                  || // outside...
        x + square.x > this.squares.size  || // board...
        y + square.y > this.squares.size     // bounderies
      )) {
        neighbourSquares.push(this.findSquare(x + square.x, y + square.y));
      }
    });
  });

  return neighbourSquares;
}

BoardMethods.findSquare = function(x, y) {
  return this.squares[y * (this.squares.size + 1) + x];
}

export { BoardMethods };
