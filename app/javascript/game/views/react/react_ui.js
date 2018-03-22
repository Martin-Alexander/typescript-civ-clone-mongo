import React                   from "react";
import ReactDOM                from "react-dom";

import ReactUserInterface from "./ReactUserInterface";

const ReactUI = {
  initialize: function(UI, gameData, inputController, networkController) {
    const canvasContainer = document.getElementById("canvas-container");
    ReactDOM.render(
      <ReactUserInterface 
        currentPlayer={gameData.getCurrentPlayer()}
        gameData={gameData}
        UI={UI}
        inputController={inputController}
        networkController={networkController}
      />, canvasContainer
    );
  }
};

export { ReactUI };
