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

Structure.prototype.render = function(context, UI) {
  context.beginPath();
  context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, 0, Math.PI * 2);
  context.fillStyle = this.typeColor();
  context.fill();  
}

export { Structure };