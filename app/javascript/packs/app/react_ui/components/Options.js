import React from "react";

export default class Options extends React.Component {
  render() {
    const optionsStyle = {
      height: "100%"
    }

    return(
      <div style={optionsStyle}>
        <span>Demographics </span>
        <span>Diplomacy </span>
        <span>Menu</span>
      </div>
    );
  }
}