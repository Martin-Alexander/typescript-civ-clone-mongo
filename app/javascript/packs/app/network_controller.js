import { Square } from "./models/square";

/*global App*/
/*global gameId*/

function NetworkController(gameData) {
  App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
    received: (data) => {
      gameData.replaceSquare(new Square(JSON.parse(data.result[0])));
      gameData.replaceSquare(new Square(JSON.parse(data.result[1])));
    }
  });
}

NetworkController.prototype.send = function(object) {
  fetch("http://localhost:3000/game/input", {
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
}

export { NetworkController };