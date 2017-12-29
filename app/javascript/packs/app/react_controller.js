function ReactController(UI, gameData) {
  this.UI = UI;
  this.gameData = gameData;
}

ReactController.prototype.updateSelectionDetails = function() {
  global.updateSelectionDetails(this.UI);
}

export { ReactController };