import { UI } from "./ui_state";
import { gameData } from "./game_data";

const inputController = {};

inputController.click = function() {
  console.log(gameData.square(UI.tileMousePosition.x, UI.tileMousePosition.y));
};

export { inputController };