import { AStarSquare } from "./a_star_square";
import { BoardMethods } from "./board_methods";

function ReachableSquares(gameData, paramaters) {
  this.unit = paramaters.unit
  this.gameData = gameData;
  this.squares = [];

  gameData.squares.forEach((square) => {
    this.squares.push(new AStarSquare(square, gameData));
  });

  this.start = new AStarSquare(this.unit.square, gameData);
}

ReachableSquares.prototype.find = function() {
  const closedSquares = [];
  const openedSquares = [this.start];
  const reachableSquares = []

  const availableMoves = this.unit.moves;

  this.start.currentPathCost = 0;

  while (openedSquares.length > 0) {
    const currentSquare = openedSquares[0];

    closedSquares.push(currentSquare);
    openedSquares.splice(0, 1);

    const neighbours = this.neighbours(currentSquare);

    neighbours.forEach((neighbour) => {
      if (
          !openedSquares.includes(neighbour) &&
          // If the neighbour is not an openned square

          !closedSquares.includes(neighbour) &&
          // AND the neighbour is not a closed square

          neighbour.moveCost() + currentSquare.currentPathCost <= availableMoves
          // AND the unit has enough moves to reach the neighbour square
         ) {

        // Add it to the open squares list 
        openedSquares.push(neighbour);

        if (
            neighbour.moveCost() + currentSquare.currentPathCost < neighbour.currentPathCost
            // If the move cost plus the current path cost of the current square is better than 
            // what the current path cost of the square is
           ) {

          // Update its current path cost
          neighbour.currentPathCost = neighbour.moveCost() + currentSquare.currentPathCost;

          // And add is as a reachable square
          reachableSquares.push(neighbour);
        }
      } 
    });
  }

  return reachableSquares;
}

ReachableSquares.prototype.neighbours = BoardMethods.neighbours;

ReachableSquares.prototype.findSquare = BoardMethods.findSquare;

export { ReachableSquares };
