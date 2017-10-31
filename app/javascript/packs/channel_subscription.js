import { Square } from "./square";

/*global App*/
/*global gameId*/
/*global gameData*/

App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
  received: (data) => {
    gameData.replaceSquare(new Square(JSON.parse(data.result[0])));
    gameData.replaceSquare(new Square(JSON.parse(data.result[1])));
  }
});