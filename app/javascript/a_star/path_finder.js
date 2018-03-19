import { TurnMoveFinder }        from "./calculations/turn_move_finder";
import { TotalPathFinder }       from "./total_path_finder";

const PathFinder = {};

PathFinder.run = function(gameData, unit, destinationSquare) {
  const turnMoveCoordinates = TurnMoveFinder.run(gameData, unit, destinationSquare);
  return TotalPathFinder.run(gameData, unit, turnMoveCoordinates);
}

export { PathFinder };
