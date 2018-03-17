import { AStar } from "./a_star";

function TotalPathFinder(gameData, unit, coordinatePath) {
  this.gameData       = gameData;
  this.unit           = unit;
  this.coordinatePath = coordinatePath;
}

TotalPathFinder.run = function(gameData, unit, coordinatePath) {
  return new TotalPathFinder(gameData, unit, coordinatePath).find();
}

TotalPathFinder.prototype.find = function() {
  const moves = this.splitCoordinatesIntoSqaurePairs();

  return this.buildFinalMovePath(moves);
}

TotalPathFinder.prototype.buildFinalMovePath = function(moves) {
  const movePaths = [];

  moves.forEach((move, index) => {
    const startSquare = this.gameData.findSquare(move.coordinates.start);
    const finishSquare = this.gameData.findSquare(move.coordinates.finish);
    
    const path = new AStar(this.gameData.squares, this.unit, startSquare, finishSquare).find();

    path[path.length - 1].moveNumber = move.moveNumber;

    if (index === 0) {
      movePaths.push(path);
    } else {
      movePaths.push(path.slice(1));
    }
  });

  return this.flatten(movePaths);
}

TotalPathFinder.prototype.flatten = function(array) {
  const flattenedArray = [];

  array.forEach(element => element.forEach(subElement => flattenedArray.push(subElement)));

  return flattenedArray;
}

TotalPathFinder.prototype.splitCoordinatesIntoSqaurePairs = function() {
  const collector = [];

  this.coordinatePath.forEach((coordinate, index) => {
    if (this.coordinatePath[index + 1] === undefined) { return false; }
    
    collector.push(
      {
        coordinates: {
          start: coordinate,
          finish: this.coordinatePath[index + 1]
        },
        moveNumber: index + 1
      }
    );
  });

  return collector;
}

export { TotalPathFinder };
