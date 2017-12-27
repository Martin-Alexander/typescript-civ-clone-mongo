/*global App*/
/*global gameId*/

function NetworkController(gameDataController, animationController) {
  App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
    received: (data) => {
      switch (data.type) {
        case "piece_move":
          gameDataController.replaceSquare(data.new_squares[0]);
          animationController.pieceMove(data, () => {
            gameDataController.replaceSquare(data.new_squares[1]);
          });
          break;
        case "train_piece":
          gameDataController.buildPiece(data);
          animationController.buildPiece(data);
          break;
        case "build_structure":
          gameDataController.buildStructure(data);
          animationController.buildStructure(data);
          break;
        case "combat":
          gameDataController.combat(data);
          animationController.combat(data);
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