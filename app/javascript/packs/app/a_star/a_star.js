import { AStarSquare } from "./a_star_square";
import { ReachableSquares } from "./reachable_squares";
import { BoardMethods } from "./board_methods";
import { AStarSquareCollection } from "./a_star_square_collection";

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

function AStar(gameData, paramaters) {
  this.unit = paramaters.unit
  this.gameData = gameData;
  this.squares = [];

  gameData.squares.forEach((square) => {
    this.squares.push(new AStarSquare(square, gameData));
  });

  if (paramaters.startSquare) {
    this.start = new AStarSquare(paramaters.startSquare, gameData);
  } else {
    this.start = new AStarSquare(this.unit.square, gameData);
  }
  this.finish = new AStarSquare(paramaters.endSquare, gameData);
}


AStar.run = function(gameData, paramaters) {
  const turnLeaps = new AStar(gameData, paramaters).findTurnLeaps();
  const collector = [];

  let startingMoveTurnNumberIndex;
  if (paramaters.unit.moves === 0) {
    startingMoveTurnNumberIndex = 2;
  } else {
    startingMoveTurnNumberIndex = 1;
  }

  for (let i = 0; i < turnLeaps.length - 1; i++) {
    const leapPath = new AStar(gameData, {
      startSquare: turnLeaps[i],
      endSquare: turnLeaps[i + 1],
      unit: paramaters.unit
    }).findPath();

    collector.push(leapPath)
  }

  const flattenedPath = [];

  collector.forEach((subArray, index) => {
    const choppedArray = subArray.slice(1)
    choppedArray[choppedArray.length - 1].move = index + startingMoveTurnNumberIndex;

    choppedArray.forEach((square) => {
      flattenedPath.push(square);
    });
  });

  flattenedPath.unshift({
    x: paramaters.unit.square.x,
    y: paramaters.unit.square.y
  })

  return flattenedPath;
}

AStar.prototype.findPath = function() {
  if (this.finishSquareIsNotReachable(this.finish)) { return []; }

  const closedSquares = new AStarSquareCollection();
  const openedSquares = new AStarSquareCollection(this.start);

  this.start.currentPathCost = 0;

  while (openedSquares.length > 0) {
    openedSquares.huristicSort(this.finish);
    const currentSquare = openedSquares[0];

    if (currentSquare.equalTo(this.finish)) {
      return this.resolvePath(currentSquare);
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

AStar.prototype.findTurnLeaps = function() {
  if (this.finishSquareIsNotReachable(this.finish)) { return []; }

  const closedSquares = new AStarSquareCollection();
  const openedSquares = new AStarSquareCollection(this.start);
  var freshMoves = this.unit.moves === 0;

  this.start.currentPathCost = 0;

  while (openedSquares.length > 0) {
    openedSquares.huristicSort(this.finish);
    const currentSquare = openedSquares[0];

    if (currentSquare.equalTo(this.finish)) {
      return this.resolvePath(currentSquare);
    }

    closedSquares.push(currentSquare);
    openedSquares.splice(0, 1);

    const reachableSquares = new ReachableSquares(this.gameData, { 
      unit: this.unit,
      start: currentSquare,
      freshMoves: freshMoves
    });

    freshMoves = true;

    const neighbours = reachableSquares.find();

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

AStar.prototype.finishSquareIsNotReachable = function(finishSquare) {
  const gameSquare = this.gameData.findSquare(finishSquare);

  return(
    gameSquare.terrain === "mountains" ||
    gameSquare.terrain === "water" ||
    gameSquare.units.length !== 0
  );
}

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

AStar.prototype.neighbours = BoardMethods.neighbours;

AStar.prototype.findSquare = BoardMethods.findSquare;

export { AStar };
