import { Square } from "./models/square";
import { MoveAnimation } from "./models/move_animation";

/*global App*/
/*global gameId*/
/*global userId*/

function NetworkController(gameData, renderer) {
  App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
    received: (data) => {
      const fromSquare = new Square(JSON.parse(data.result[0]))
      const toSquare = new Square(JSON.parse(data.result[1]))
      renderer.addAnimation(new MoveAnimation(fromSquare, toSquare));
      gameData.replaceSquare(fromSquare);
      gameData.replaceSquare(toSquare);
    }
  });
}

NetworkController.prototype.send = function(object) {
  fetch("/game/input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      game_id: gameId,
      data: object,
    })
  });
};

export { NetworkController };