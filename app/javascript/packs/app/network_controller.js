/*global App*/
/*global gameId*/

function NetworkController(turnTransitioner, gameDataController, animationController) {
  this.turnTransitioner = turnTransitioner;
  this.gameDataController = gameDataController;
  this.animationController = animationController;

  App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
    received: (data) => {
      switch (data.type) {
        case "piece_move":
          this.gameDataController.pieceMove(data, this.animationController.pieceMove.bind(this.animationController));
          break;
        case "next_turn":
          this.turnTransitioner.begin();
          data.move_animations.forEach((moveAnimation) => {
            this.gameDataController.pieceMove(moveAnimation, this.animationController.pieceMove.bind(this.animationController));
          });
          this.getGameData();
          break;
        case "give_order":
          this.gameDataController.giveOrder(data.new_square);
          break;
        default:
          break;
      }
    }
  });
}

NetworkController.prototype.pieceMove = function(pieceMoveData) {
  const payload = { method: "piece_move" };
  payload.data = pieceMoveData;

  this.send(payload);
}

NetworkController.prototype.nextTurn = function() {
  const payload = { method: "next_turn" };
  this.send(payload);
}

NetworkController.prototype.giveOrder = function(orderData) {
  const payload = { method: "give_order" };
  payload.data = orderData;
  this.send(payload)
}

NetworkController.prototype.getGameData = function() {
  const payload = { method: "get_game_data" };
  this.send(payload, (data) => {
    console.log("next turn");
    this.gameDataController.newGameData(data.new_game);
    this.turnTransitioner.end();
  });  
}

NetworkController.prototype.send = function(payload, callback) {
  payload.game = gameId;

  const response = fetch("/game/input", {
    method: "POST",
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
    credentials: "same-origin"
  }).then(response => response.json()).then((data) => {
    if (callback) { callback(data); }
  });
};

export { NetworkController };