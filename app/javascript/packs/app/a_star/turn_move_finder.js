import { AStarSquareCollection } from "./a_star_square_collection";
import { findAvailableMoves }    from "./find_available_moves";
import { ReachableSquares }      from "./reachable_squares";
import { AStarSquare }           from "./a_star_square";

function TurnMoveFinder(gameData, unit, finishSquare) {
  this.gameData     = gameData;
  this.unit         = unit;
  this.startSquare  = new AStarSquare(this.unit.square);
  this.finishSquare = new AStarSquare(finishSquare);
  this.freshMoves   = this.unit.moves === 0;
  this.squares      = new AStarSquareCollection(
    gameData.squares.map(square => new AStarSquare(square))
  );
}

TurnMoveFinder.run = function(squares, unit, finishSquare) {
  return new TurnMoveFinder(squares, unit, finishSquare).find();
}

TurnMoveFinder.prototype.find = function() {
  if (this.finishSquare.isUnreachable()) { return []; }

  const closedSquares = new AStarSquareCollection();
  const openedSquares = new AStarSquareCollection([this.startSquare]);

  this.startSquare.currentPathCost = 0;

  while (openedSquares.stillHasSquaresLeft()) {
    openedSquares.huristicSort(this.finishSquare);

    const currentSquare = openedSquares.getNewCurrentSquare();
    closedSquares.addSquare(currentSquare);

    if (currentSquare.equalTo(this.finishSquare)) { return this.resolvePath(currentSquare); }

    const reachableSquares = this.getReachableSquares(
      this.gameData.squares,
      this.unit,
      currentSquare,
      this.freshMoves
    )

    const availableMoves = findAvailableMoves(this.unit, this.freshMoves);

    reachableSquares.forEach((square) => {
      if (openedSquares.doesNotInclude(square) && closedSquares.doesNotInclude(square)) {
        
        openedSquares.addSquare(square);

        if (currentSquare.currentPathCost < square.currentPathCost) {

          square.pathVia = currentSquare;
          square.currentPathCost = currentSquare.currentPathCost + availableMoves;
        }
      }
    });

    this.freshMoves = true;
  }
}

TurnMoveFinder.prototype.getReachableSquares = function(squares, unit, currentSquare, freshMoves) {
  const neighbourCoordinates = ReachableSquares.run(squares, unit, currentSquare, freshMoves);

  return neighbourCoordinates.map((coordinates) => { 
    return this.squares.findSquare(coordinates.x, coordinates.y);
  });
}

TurnMoveFinder.prototype.resolvePath = function(square) {
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

export { TurnMoveFinder };