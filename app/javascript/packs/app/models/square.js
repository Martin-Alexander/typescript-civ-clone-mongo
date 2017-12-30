import { Unit } from "./unit";
import { Structure } from "./structure";

function Square(rawSquareObject) {
  this.units = [];
  this.structures = [];
  Object.keys(rawSquareObject).forEach((property) => {
    if (property === "units") {
      rawSquareObject.units.forEach((unit) => {
        this.units.push(new Unit(unit));
      });
    } else if (property === "structures") {
      rawSquareObject.structures.forEach((structure) => {
        this.structures.push(new Structure(structure));
      });      
    } else if (property === "_id") {
      this.id = rawSquareObject[property]["$oid"];
    } else {
      this[property] = rawSquareObject[property];
    }
  });
}

Square.prototype.color = function(selectionSquare) {
  const terrainColorLookup = {};

  if (this == selectionSquare) {
    return "white";
  } else if (this.terrain) {
    return terrainColorLookup[this.terrain];
  }
  return "#0e960c";
};

Square.prototype.hasCompletedStructure = function(type) {
  for (let i = 0; i < this.structures.length; i++) {
    if (this.structures[i].type === type && this.structures[i].complete) {
      return true;
    }
  }

  return false;
}

Square.prototype.equalTo = function(otherSquare) {
  return this.x === otherSquare.x && this.y === otherSquare.y;
}

Square.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

Square.prototype.render = function(context, UI) {
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
  context.lineTo(0, UI.tileHeight);
  context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
  context.closePath();
  context.fillStyle = this.color(UI.selection.square);
  context.fill();
}


export { Square };