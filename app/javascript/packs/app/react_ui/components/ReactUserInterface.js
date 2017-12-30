import React from "react";
import MenuBar from "./MenuBar";
import SelectionDetails from "./SelectionDetails";
import TurnTimer from "./TurnTimer";
import Minimap from "./Minimap";

export default class ReactUserInterface extends React.Component {
  render() {
    const userInterfaceStyle = {
      position: "absolute",
      top: "0", 
      bottom: "0",
      width: "100%"
    }

    return(
      <div style={userInterfaceStyle}>
        <MenuBar currentPlayer={this.props.currentPlayer}/>
        <SelectionDetails UI={this.props.UI} inputController={this.props.inputController}/>
        <TurnTimer />
        <Minimap />
      </div>
    );
  }
}