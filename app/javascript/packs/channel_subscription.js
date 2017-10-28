App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
  received: function(data) {
    const fromSquare = JSON.parse(data.result[0]);
    const toSquare = JSON.parse(data.result[1]);
    const fromIndex = (fromSquare.y * 14) + fromSquare.x;
    const toIndex = (toSquare.y * 14) + toSquare.x;
    console.log(fromSquare, toSquare);
    gameData.squares[fromIndex] = fromSquare;
    gameData.squares[toIndex] = toSquare;
  }
});