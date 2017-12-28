function ReactController(UI, gameData) {
  global.UI = UI;
  global.gameData = gameData;
}

ReactController.prototype.updateSelectionDetails = function(UI) {
  global.updateSelectionDetails(UI);
}

export { ReactController };