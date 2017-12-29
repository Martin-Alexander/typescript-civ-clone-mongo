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
      backgroundColor: "yellow"
    }
    return(
      <div style={menuBarStyle}>
        <Resources />
        <Options />
      </div>
    );
  }
}