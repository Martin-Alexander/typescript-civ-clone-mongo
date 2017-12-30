import React from "react";

export default class Minimap extends React.Component {
  render() {
    const minimapStyle = {
      position: "absolute",
      bottom: "0",
      right: "0",
      width: "300px",
      height: "200px",
      backgroundColor: "#e4e5d7"
    }

    return(
      <div style={minimapStyle}></div>
    );
  }
}