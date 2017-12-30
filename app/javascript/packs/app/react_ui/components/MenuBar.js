import React from "react";
import Resources from "./Resources";
import Options from "./Options";

export default class MenuBar extends React.Component {
  render() {
    const menuBarStyle = {
      display: "flex",
      justifyContent: "space-between",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "30px",
      backgroundColor: "#e4e5d7"
    }
    return(
      <div style={menuBarStyle}>
        <Resources 
          militaryCount={this.props.currentPlayer.military_count}
          civilianCount={this.props.currentPlayer.civilian_count_count}
          supply={this.props.currentPlayer.supply}
          growth={this.props.currentPlayer.growth}
        />
        <Options />
      </div>
    );
  }
}