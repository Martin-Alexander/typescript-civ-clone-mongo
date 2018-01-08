function ReactController(UI, gameData) {
  this.UI = UI;
  this.gameData = gameData;
}

ReactController.prototype.updateUI = function() {
  global.updateUI(this.UI);
}

ReactController.prototype.updateGameData = function() {
  global.updateGameData(this.gameData);
}

export { ReactController };