import React from "react";
import MenuBar from "./MenuBar";
import SelectionDetails from "./SelectionDetails";
import TurnTimer from "./TurnTimer";
import Minimap from "./Minimap";

export default class UserInterface extends React.Component {
  render() {
    const userInterfaceStyle = {
      position: "absolute",
      top: "0", 
      bottom: "0",
      width: "100%"
    }

    return(
      <div style={userInterfaceStyle}>
        <MenuBar />
        <SelectionDetails />
        <TurnTimer />
        <Minimap />
      </div>
    );
  }
}