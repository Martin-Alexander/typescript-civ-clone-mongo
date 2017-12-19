import { Square } from "./models/square";
import { MoveAnimation } from "./models/move_animation";

/*global App*/
/*global gameId*/
/*global userId*/

function NetworkController(gameDataController, animationController) {
  App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
    received: (data) => {
      console.log(data);
      // const fromSquare = new Square(JSON.parse(data.result[0]));
      // const toSquare = new Square(JSON.parse(data.result[1]));
      // renderer.addAnimation(new MoveAnimation(fromSquare, toSquare));
      // gameData.replaceSquare(fromSquare);
      // gameData.replaceSquare(toSquare);
    }
  });
}

NetworkController.prototype.pieceMove = function(pieceMoveData) {
  const payload = { method: "piece_move" };
  payload.data = pieceMoveData;

  this.send(payload);
}

NetworkController.prototype.send = function(payload) {
  payload.game_id = gameId;

  fetch("/game/input", {
    method: "POST",
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
    credentials: "same-origin"
  });
};

export { NetworkController };