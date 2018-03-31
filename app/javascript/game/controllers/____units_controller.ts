import { ReachableSquares } from "./../services/a_star/calculations/reachable_squares";

interface UnitsController {
  UI: any,
  gameData: any,
  networkController: any,
  destinationSquare: any
}

// The purpose of this controller is the gather the relevant information the the UI state and
// from the game data to construct the appropriate instructions for the network controller and
// eventually the animations controller when client-side unit-move "prediction" is implemented
function UnitsController(UI: any, gameData: any, networkController: any): UnitsController {
  const unitsController = Object.create(prototype);

  unitsController.UI = UI;
  unitsController.gameData = gameData;
  unitsController.networkController = networkController;

  return unitsController;
}

const prototype = {
  move: function(): void {
    this.destinationSquare = this.gameData.findSquare(this.UI.currentPath[this.UI.currentPath.length - 1]);
    
    if (this.UI.currentPath.length > 1) { 
      this.determineAndSendUnitCommand();
      
      this.UI.selection.structure = null;
      this.UI.selection.square = null;
      this.UI.selection.unit = null;
      this.UI.currentPath = null;
      this.UI.reachableSquares= null;
    }
  },
  
  determineAndSendUnitCommand: function(): void {
    if (this.allowedToMerge()) {
      this.pieceMerge();
    } else {
      this.pieceMove();
    }
  },

  pieceMove: function(): any {
    this.networkController.pieceMove({
      unit: this.UI.selection.unit.id,
      path: this.UI.currentPath,
    });
  },

  pieceMerge: function(): any {
    this.networkController.pieceMerge({
      unit: this.UI.selection.unit.id,
      path: this.UI.currentPath,
    });  
  },
  
  destinationIsImmediatelyReachable: function(): any {
    const reachableSquares = ReachableSquares.run({
      squares: this.gameData.squares,
      unit: this.UI.selection.unit,
      startSquare: this.UI.selection.square,
      allSquaresAreDestinations: true
    });
    
    return reachableSquares.map(coordinates => this.gameData.findSquare(coordinates)).includes(this.destinationSquare);
  },
  
  allowedToMerge: function(): any {
    return this.destinationIsImmediatelyReachable(this.destinationSquare) && 
    this.destinationSquare.units[0] &&
    this.UI.selection.unit.type !== "worker" &&
    this.destinationSquare.units[0].player_number == this.UI.selection.unit.player_number;
  },
  
  order: function(): any {}
}

export { UnitsController };

// function UnitsController(UI, gameData, networkController) {
//   this.UI = UI;
//   this.gameData = gameData;
//   this.networkController = networkController;
// }

// UnitsController.prototype.move = function() {
//   this.destinationSquare = this.gameData.findSquare(this.UI.currentPath[this.UI.currentPath.length - 1]);

//   if (this.UI.currentPath.length > 1) { 
//     this.determineAndSendUnitCommand();

//     this.UI.selection.structure = null;
//     this.UI.selection.square = null;
//     this.UI.selection.unit = null;
//     this.UI.currentPath = null;
//     this.UI.reachableSquares= null;
//   }  
// }

// UnitsController.prototype.determineAndSendUnitCommand = function() {
//   if (this.allowedToMerge()) {
//     this.pieceMerge();
//   } else {
//     this.pieceMove();
//   }
// }

// UnitsController.prototype.pieceMove = function() {
//   this.networkController.pieceMove({
//     unit: this.UI.selection.unit.id,
//     path: this.UI.currentPath,
//   });  
// }

// UnitsController.prototype.pieceMerge = function() {
//   this.networkController.pieceMerge({
//     unit: this.UI.selection.unit.id,
//     path: this.UI.currentPath,
//   });  
// }

// UnitsController.prototype.destinationIsImmediatelyReachable = function() {
//   const reachableSquares = ReachableSquares.run({
//     squares: this.gameData.squares,
//     unit: this.UI.selection.unit,
//     startSquare: this.UI.selection.square,
//     allSquaresAreDestinations: true
//   });
//   return reachableSquares.map(coordinates => this.gameData.findSquare(coordinates)).includes(this.destinationSquare);
// }

// UnitsController.prototype.allowedToMerge = function() {
//   return this.destinationIsImmediatelyReachable(this.destinationSquare) && 
//   this.destinationSquare.units[0] &&
//   this.UI.selection.unit.type !== "worker" &&
//   this.destinationSquare.units[0].player_number == this.UI.selection.unit.player_number;
// }

// UnitsController.prototype.order = function() {
  
// }


