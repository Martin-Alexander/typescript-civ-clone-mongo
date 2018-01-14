function ReactController(UI, gameData, networkController) {
  this.UI = UI;
  this.gameData = gameData;
  this.networkController = networkController;
}

ReactController.prototype.updateUI = function() {
  global.updateUI(this.UI);
}

ReactController.prototype.updateGameData = function() {
  global.updateGameData(this.gameData);
}

ReactController.prototype.leaveGame = function() {
  networkController.leaveGame();
}

export { ReactController };