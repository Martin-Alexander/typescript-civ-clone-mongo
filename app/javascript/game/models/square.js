import { Unit }      from "./unit";
import { Structure } from "./structure";

function Square(rawSquareObject) {
  this.units = [];
  this.structures = [];
  Object.keys(rawSquareObject).forEach((property) => {
    if (property === "units") {
      rawSquareObject.units.forEach((unit) => {
        this.units.push(new Unit(unit, this));
      });
    } else if (property === "structures") {
      rawSquareObject.structures.forEach((structure) => {
        this.structures.push(new Structure(structure, this));
      });      
    } else if (property === "_id") {
      this.id = rawSquareObject[property]["$oid"];
    } else {
      this[property] = rawSquareObject[property];
    }
  });
}

Square.prototype.isOwnedBy = function(player) {
  return this.units[0] && this.units[0].player_number == player.number;
}

Square.prototype.color = function(selectionSquare) {
  const terrainColorLookup = {
    grass: "#0e960c",
    plains: "#dbab0d",
    desert: "#f9f459",
    forest: "#086001",
    marsh: "#70876d",
    hill: "#a08a73",
    mountains: "#848484",
    water: "#2651d3"
  };

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
  if (UI.reachableSquares && UI.reachableSquares.includes(this)) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
    context.lineTo(0, UI.tileHeight);
    context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
    context.closePath();
    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    context.fill();
  }
}

Square.prototype.hasStructure = function(structureName) {
  for (let i = 0; i < this.structures.length; i++) {
    const structure = this.structures[i];
    if (structure.type == structureName) {
      return true;
    }
  }

  return false;
}

// Assumes that only one structure of each type exists in a given square
Square.prototype.getStructure = function(structureName) {
  for (let i = 0; i < this.structures.length; i++) {
    const structure = this.structures[i];
    if (structure.type == structureName) {
      return structure;
    }
  }

  return false;
}

Square.prototype.getMilitaryUnit = function() {
  return this.units.find(unit => unit.type !== "worker");
}

Square.prototype.getCivilianUnit = function() {
  return this.units.find(unit => unit.type === "worker");
}

Square.prototype.hasMilitaryUnit = function() {
  return this.units.some(unit => unit.type !== "worker");
}

Square.prototype.hasCivilianUnit = function() {
  return this.units.some(unit => unit.type === "worker");
}

export { Square };