import { Square } from "./models/square";

function GameData(UI, rawGameData) {
  this.UI = UI;
  const data = JSON.parse(rawGameData);
  Object.keys(data).forEach((property) => {
    this[property] = data[property];
  });

  this.UI.size = this.size;
}

GameData.prototype.initialize = function() {
  for (let i = 0; i < this.squares.length; i++) {
    this.squares[i] = new Square(this.squares[i]);
  }
};

GameData.prototype.square = function(col, row = false) {
  let square;
  if (row === false) {
    if (col.x !== undefined && col.y !== undefined) {
      square = this.squares[col.y * (this.size + 1) + col.x];
    } else {
      square = this.squares[col];
    }
  } else {
    square = this.squares[row * (this.size + 1) + col];
  }
  return square;
};

GameData.prototype.updatePlayersReady = function(playersReady) {
  this.game_players.forEach((gameDataGamePlayers) => {
    playersReady.forEach((gamePlayers) => {
      if (gameDataGamePlayers.number === gamePlayers.number) {
        gameDataGamePlayers.turn_over = gamePlayers.turn_over;
      }
    });
  });
}

GameData.prototype.replaceSquare = function(square) {
  this.squares[square.y * (this.size + 1) + square.x] = square;
};

GameData.prototype.newGameData = function(rawGameData) {
  Object.keys(rawGameData).forEach((property) => {
    this[property] = rawGameData[property];
  });

  this.initialize();
}

GameData.prototype.getCurrentPlayer = function() {
  let currentPlayer;

  this.game_players.forEach((player) => {
    if (player.current_player) {
      currentPlayer = player;
    }
  })

  return currentPlayer;
}

export { GameData };