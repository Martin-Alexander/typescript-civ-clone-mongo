import React from "react";
import ReactDOM from "react-dom";

import UserInterface from "./components/UserInterface";

const canvasContainer = document.getElementById("canvas-container");

ReactDOM.render(<UserInterface />, canvasContainer);