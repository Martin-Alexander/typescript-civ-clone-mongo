import { AStarSquareCollection } from "./../a_star_square_collection";
import { BoardMethods }          from "./../board_methods";
import { AStarSquare }           from "./../a_star_square";

// This is a basic implementation of the A* algorithm that is designed to find a path between two
// squares. It is only used to connect "turn-moves".
function AStar(squares, unit, startSquare, finishSquare) {
  this.unit         = unit;
  this.startSquare  = new AStarSquare(startSquare);
  this.finishSquare = new AStarSquare(finishSquare);
  this.squares      = new AStarSquareCollection(squares.map(square => new AStarSquare(square)));
}

AStar.prototype.find = function() {
  // Since one of the condition of unreachability is that the square contains a unit, when a move
  // has the same destination and origin (i.e., there is no actual move), then the finish square
  // contains the unit that is doing the movement. So, in this case, we want to avoid returning an
  // empty path
  if (this.finishSquare.isUnreachable() && !this.startSquare.equalTo(this.finishSquare)) { return []; }

  // Represents all squares connected to our exploration network, but have get to be full explored
  const openedSquares = new AStarSquareCollection([this.startSquare]);

  // Represents all explored squares
  const closedSquares = new AStarSquareCollection();

  this.startSquare.currentPathCost = 0;

  while (openedSquares.stillHasSquaresLeft()) {
    // Sort all openned squares by the huristic
    openedSquares.huristicSort(this.finishSquare);

    // Assign `currentSquare` as the square with the best huristic score and move it from the set of
    // openned squares to the set of closed squares
    const currentSquare = openedSquares.getNewCurrentSquare();
    closedSquares.addSquare(currentSquare);

    // Stop and resolve path if you've reached the destination square
    if (currentSquare.equalTo(this.finishSquare)) { return this.resolvePath(currentSquare); }

    // Get all neighbours of the current square... 
    const neighbours = this.getNeighboursOf(currentSquare);

    // ...and iterate over each of them 
    neighbours.forEach((neighbour) => {

      // Only proceed if moving to this square is better than the best alternative
      if (currentSquare.currentPathCost + neighbour.moveCost(this.unit, currentSquare) < neighbour.currentPathCost) {

        // Add it to the set of oppened squares if has never been evaluated before
        if (openedSquares.doesNotInclude(neighbour) && closedSquares.doesNotInclude(neighbour)) { 
          openedSquares.addSquare(neighbour);
        }

        // Updates its `pathVia` and its current path cost
        neighbour.pathVia = currentSquare;
        neighbour.currentPathCost = neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost;
      }
    });
  }
}

AStar.prototype.findSquare = BoardMethods.findSquare;

AStar.prototype.getNeighboursOf = BoardMethods.neighboursAndCurrentSquare;

AStar.prototype.resolvePath = function(square) {
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

export { AStar };