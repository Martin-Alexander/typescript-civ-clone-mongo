function UserInterface() {
  this.tileHeight = 40;
  this.tileWidth = 80;
  this.offset = { x: 0, y: 0 };
  this.tileMousePosition = {};
  this.selection = {
    square: null,
    unit: null,
    structure: null
  };
  this.currentPath = null;
}

export { UserInterface };