import { UI } from "./ui_state";

/* global userId */
/* global gameId */

const inputController = {};

inputController.click = function() {
  if (UI.selectedTile) {
    const destinationTile = gameData.square(UI.tileMousePosition.x, UI.tileMousePosition.y);
    move(UI.selectedTile, destinationTile);
    UI.selectedTile = null;
  } else {
    UI.selectedTile = gameData.square(UI.tileMousePosition.x, UI.tileMousePosition.y);
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

export { inputController };