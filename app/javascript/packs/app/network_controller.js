/*global App*/
/*global gameId*/

function NetworkController(gameDataController, animationController) {
  App.cable.subscriptions.create({ channel: "GameChannel", room: gameId}, {
    received: (data) => {
      console.log(data);
      switch (data.type) {
        case "piece_move":
          gameDataController.replaceFromSquare(data);
          animationController.pieceMove(data, () => {
            gameDataController.replaceToSquare(data);
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

NetworkController.prototype.aStar = function(aStarData) {
  const payload = { method: "a_star" };
  payload.data = aStarData;

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