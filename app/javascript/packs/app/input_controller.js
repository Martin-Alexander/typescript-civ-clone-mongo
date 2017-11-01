/* global userId */
/* global gameId */

function InputController(UI, gameData) {
  this.UI = UI;
  this.gameData = gameData;
}

InputController.prototype.click = function() {
  if (this.UI.selectedTile) {
    const destinationTile = this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
    move(this.UI.selectedTile, destinationTile);
    this.UI.selectedTile = null;
  } else {
    this.UI.selectedTile = this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
  }
};

function move(fromSquare, toSquare) {
  fetch("http://localhost:3000/game/input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      game_id: gameId,
      move_from: fromSquare["_id"]["$oid"],
      move_to: toSquare["_id"]["$oid"]
    })
  });
}

export { InputController };