function TurnTransitioner(UI, reactController) {
  this.UI = UI;
  this.reactController = reactController;
}

TurnTransitioner.prototype.begin = function() {
  this.UI.ongoingTurnTransition = true;
  this.UI.clearAllSelection();
  this.UI.currentPath = null;

  this.reactController.updateUI(this.UI);
}

TurnTransitioner.prototype.end = function() {
  this.UI.ongoingTurnTransition = false;
  this.UI.clearAllSelection();

  this.reactController.updateUI(this.UI);
}

export { TurnTransitioner };