import { AStarSquare } from "./a_star_square";
import { AStarBoard } from "./a_star_board";

function AStar(gameData, squareObjects) {
  this.board = new AStarBoard(gameData);
  this.start = new AStarSquare(squareObjects.start);
  this.finish = new AStarSquare(squareObjects.finish);
}

AStar.prototype.run = function() {
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

    const neighbours = this.board.neighbours(currentSquare);

    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];

      if (closedSquares.includes(neighbour)) {
        continue;
      }

      if (!openedSquares.includes(neighbour)) {
        openedSquares.push(neighbour);
      }

      if (currentSquare.currentPathCost + neighbour.moveCost >= neighbour.currentPathCost) {
        continue;
      }

      neighbour.pathVia = currentSquare;
      neighbour.currentPathCost = currentSquare.currentPathCost + neighbour.moveCost;
    }
  }
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

AStar.run = function(gameData, squareObjects) {
  return new AStar(gameData, squareObjects).run();
}

export { AStar };