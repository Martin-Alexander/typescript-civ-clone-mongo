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

export { NetworkController };