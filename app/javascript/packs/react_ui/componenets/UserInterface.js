import React from "react";

export default class UserInterface extends React.Component {
  render() {
    const userInterfaceStyle = {
      position: "absolute",
      top: "0", 
      bottom: "0",
      width: "100%"
    }

    return(
      <div style={userInterfaceStyle}></div>
    );
  }
}