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
  this.UI.ready = false;
  this.UI.clearAllSelection();

  this.reactController.updateUI(this.UI);
}

TurnTransitioner.prototype.ready = function() {
  if (this.UI.ready) {
    this.UI.ready = false;
  } else {
    this.UI.clearAllSelection();
    this.UI.currentPath = null;    
    this.UI.ready = true;
  }
}

export { TurnTransitioner };