function Structure(rawStructureObject) {
  Object.keys(rawStructureObject).forEach((property) => {
  if (property == "_id") {
      this.id = rawStructureObject[property]["$oid"];
    } else {
      this[property] = rawStructureObject[property];
    }
  });
}

Structure.prototype.typeColor = function() {
  const structureTypeColorLookup = {
    road: "#bf743f",
    fortress: "#3a3a3a",
    farm: "#627221",
    city: "#80a09f"
  }

  return structureTypeColorLookup[this.type];
}

Structure.prototype.playerColor = function() {
  const structurePlayerColorLookup = {
    1: "red",
    2: "blue",
    3: "pink",
    4: "purple"
  };

  return structurePlayerColorLookup[this.player_number];
}


Structure.prototype.render = function(context, UI) {
  context.beginPath();
  context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
  context.fillStyle = this.typeColor();
  context.fill();
  context.beginPath();
  context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
  context.fillStyle = this.playerColor();
  context.fill();
}

export { Structure };