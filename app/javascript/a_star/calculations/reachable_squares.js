import { AStarSquare }           from "./../a_star_square";
import { BoardMethods }          from "./../board_methods";
import { AStarSquareCollection } from "./../a_star_square_collection";
import { findAvailableMoves }    from "./../find_available_moves";

// The purpose is, for a given unit and square, return all the squares that it is capable of
// reaching in a single turn
function ReachableSquares(squares, unit, startSquare, freshMoves) {
  this.unit        = unit;
  this.startSquare = new AStarSquare(startSquare);
  this.squares     = squares;
  this.freshMoves  = freshMoves;
}

// ReachableSquares is used by calling the method `run` which takes in an array of game squares,
// converts them into a grid of AStarSquares, and returns all reachable squares of a given unit
ReachableSquares.run = function(squares, unit, square, freshMoves) {
  const aStarSquares = new AStarSquareCollection(squares.map(square => new AStarSquare(square)));
  return new ReachableSquares(aStarSquares, unit, square, freshMoves).find();
}

ReachableSquares.canReach = function(unit, square) {
  const squares = square.game.squares;
  const aStarSquares = new AStarSquareCollection(squares.map(square => new AStarSquare(square)));

  const reachableCoordinates = new ReachableSquares(aStarSquares, unit, square, freshMoves).find();
  return reachableCoordinates.some(square => square.equalTo(square));
}

// The heavy lifting happens here
ReachableSquares.prototype.find = function() {

  // Similar to the plain AStar function, we store to-be explored squares in `opennedSquares`...
  const openedSquares    = new AStarSquareCollection([this.startSquare]);

  // ...and already explored squares in closed squares
  const closedSquares    = new AStarSquareCollection();

  // This stores all squares that are reachable and is the ultimate product of this function
  const reachableSquares = new AStarSquareCollection();

  // Calculates how many moves the unit has for this algorithm to spend looking for reachable
  // squares
  const availableMoves   = findAvailableMoves(this.unit, this.freshMoves)

  this.startSquare.currentPathCost = 0;

  while (openedSquares.stillHasSquaresLeft()) {
    // There is not sorting in this case, because there is not destination square and so no need

    const currentSquare = openedSquares.getNewCurrentSquare();
    closedSquares.addSquare(currentSquare);

    const neighbours = this.getNeighboursOf(currentSquare);

    neighbours.forEach((neighbour) => {
      // Proceed if the "neighbouring" square is the current square
      // Or if 1) this square is better than the best alternative, and 2) the unit has enough moves
      // to reach it
      if (currentSquare.equalTo(neighbour) ||
          (neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost < neighbour.currentPathCost
          && neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost <= availableMoves)) {

        if (openedSquares.doesNotInclude(neighbour) && closedSquares.doesNotInclude(neighbour)) {
          openedSquares.addSquare(neighbour);
        }

        // Record how many moves it takes to reach this square
        neighbour.currentPathCost = neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost;

        // And add it to the set of reachable squares
        reachableSquares.addSquare(neighbour); 
      }
    });
  }

  // Once all reachable squares have been explored transform 
  return this.transformToCoordinates(reachableSquares);
}

// Transforms each square in the set of reachable squares to just its coordinates and the cost of
// reaching it
ReachableSquares.prototype.transformToCoordinates = function(squares) {
  return squares.map(square => ({ x: square.x, y: square.y, moveToCost: square.currentPathCost }));
}

ReachableSquares.prototype.findSquare = BoardMethods.findSquare;

ReachableSquares.prototype.getNeighboursOf = BoardMethods.neighboursAndCurrentSquare;

export { ReachableSquares };
