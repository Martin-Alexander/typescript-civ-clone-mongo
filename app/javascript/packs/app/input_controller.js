/* global userId */
/* global gameId */

function InputController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

InputController.prototype.click = function() {
  if (this.UI.selectedTile) {
    const destinationTile = this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
    this.networkController.send({ from: this.UI.selectedTile.id, to: destinationTile.id });
    this.UI.selectedTile = null;
  } else {
    this.UI.selectedTile = this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
  }
};

export { InputController };