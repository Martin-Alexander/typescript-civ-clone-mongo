import { AStarSquare } from "./a_star_square";

/*

  Refactoring guidline:

  There will be two seperate classes of A* procedures:

  The first will consider a a unit and determine of its reachable squares as well as the shortest
  given its number of remaining moves.

  The second will use a network of nodes wherein there is not a 1:1 relationship between squares and
  nodes, rather, each node will represent a square that the unit can move to within a single turn.

  The first will use the `AStarBoard`'s `neighbour` method, while the second will use another method
  that calculates all possible squares that the unit can move to within a single turn

*/

function AStar(gameData, squareObjects) {
  this.gameData = gameData;
  this.squares = [];

  gameData.squares.forEach((square) => {
    this.squares.push(new AStarSquare(square, gameData));
  });

  this.start = new AStarSquare(squareObjects.start, gameData);
  this.finish = new AStarSquare(squareObjects.finish, gameData);
}


AStar.run = function(gameData, squareObjects) {
  return new AStar(gameData, squareObjects).run();
}

AStar.prototype.run = function() {
  if (this.finishSquareIsNotReachable(this.finish)) { return []; }

  const closedSquares = [];
  const openedSquares = [this.start];

  this.start.currentPathCost = 0;

  while (openedSquares.length > 0) {
    this.sortSquares(openedSquares);
    const currentSquare = openedSquares[0];

    if (currentSquare.equalTo(this.finish)) {
      return this.findPath(currentSquare);
    }

    closedSquares.push(currentSquare);
    openedSquares.splice(0, 1);

    const neighbours = this.neighbours(currentSquare);

    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];

      if (closedSquares.includes(neighbour)) {
        continue;
      }

      if (!openedSquares.includes(neighbour)) {
        openedSquares.push(neighbour);
      }

      if (currentSquare.currentPathCost + neighbour.moveCost() >= neighbour.currentPathCost) {
        continue;
      }

      neighbour.pathVia = currentSquare;
      neighbour.currentPathCost = currentSquare.currentPathCost + neighbour.moveCost();
    }
  }
}

AStar.prototype.reachableSquares = function() {};

AStar.prototype.finishSquareIsNotReachable = function(finishSquare) {
  const gameSquare = this.gameData.findSquare(finishSquare);

  return(
    gameSquare.terrain === "mountains" ||
    gameSquare.terrain === "water" ||
    gameSquare.units.length !== 0
  );
}

AStar.prototype.sortSquares = function(squares) {
  squares.sort((a, b) => {
    const difference = a.estimatedTotalCost(this.finish) - b.estimatedTotalCost(this.finish)
    if (difference > 0) {
      return 1;
    } else if (difference < 0) {
      return -1;
    } else {
      return 0;
    }
  });
}

AStar.prototype.findPath = function(square) {
  const path = [];
  let currentSquare = square;

  while (currentSquare !== null) {
    path.unshift({
      x: currentSquare.x,
      y: currentSquare.y
    });

    currentSquare = currentSquare.pathVia;
  }

  return path;
}

AStar.prototype.neighbours = function(square, radius = 1) {
  const xRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
  const yRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
  const neighbourSquares = [];

  xRange.forEach((x) => {
    yRange.forEach((y) => {
      if (!(                                 // None of the following are true:
        (x === 0 && y === 0)              || // is original square
        x + square.x < 0                  || // is...
        y + square.y < 0                  || // outside...
        x + square.x > this.gameData.size || // board...
        y + square.y > this.gameData.size    // bounderies
      )) {
        neighbourSquares.push(this.findSquare(x + square.x, y + square.y));
      }
    });
  });

  return neighbourSquares;
}

AStar.prototype.findSquare = function(x, y) {
  return this.squares[y * (this.gameData.size + 1) + x];
}

export { AStar };