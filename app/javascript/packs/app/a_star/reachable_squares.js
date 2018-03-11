import { AStarSquare }           from "./a_star_square";
import { BoardMethods }          from "./board_methods";
import { AStarSquareCollection } from "./a_star_square_collection";
import { findAvailableMoves }    from "./find_available_moves";

function ReachableSquares(squares, unit, startSquare, freshMoves) {
  this.unit        = unit;
  this.startSquare = new AStarSquare(startSquare);
  this.squares     = squares;
  this.freshMoves  = freshMoves;
}

ReachableSquares.run = function(squares, unit, square, freshMoves) {
  const aStarSquares = new AStarSquareCollection(squares.map(square => new AStarSquare(square)));
  return new ReachableSquares(aStarSquares, unit, square, freshMoves).find();
}

ReachableSquares.prototype.find = function() {
  const closedSquares    = new AStarSquareCollection();
  const openedSquares    = new AStarSquareCollection([this.startSquare]);
  const reachableSquares = new AStarSquareCollection();
  const availableMoves   = findAvailableMoves(this.unit, this.freshMoves)

  this.startSquare.currentPathCost = 0;

  while (openedSquares.stillHasSquaresLeft()) {
    const currentSquare = openedSquares.getNewCurrentSquare();
    closedSquares.addSquare(currentSquare);

    const neighbours = this.getNeighboursOf(currentSquare);

    neighbours.forEach((neighbour) => {
      if (openedSquares.doesNotInclude(neighbour) && closedSquares.doesNotInclude(neighbour) &&
          neighbour.moveCost() + currentSquare.currentPathCost <= availableMoves) {
        
        openedSquares.addSquare(neighbour);

        if (neighbour.moveCost() + currentSquare.currentPathCost < neighbour.currentPathCost) {

          neighbour.currentPathCost = neighbour.moveCost() + currentSquare.currentPathCost;
          reachableSquares.addSquare(neighbour);      
        }
      }
    });
  }

  return this.transformToCoordinates(reachableSquares);
}

ReachableSquares.prototype.transformToCoordinates = function(squares) {
  return squares.map(square => ({ x: square.x, y: square.y, moveToCost: square.currentPathCost }));
}

ReachableSquares.prototype.findSquare = BoardMethods.findSquare;

ReachableSquares.prototype.getNeighboursOf = BoardMethods.neighbours;

export { ReachableSquares };
