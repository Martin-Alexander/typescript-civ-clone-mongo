import React from "react";

export default class Options extends React.Component {
  handleMenuClick() {
    this.props.toggleMenu();
  }

  render() {
    const optionsStyle = {
      height: "100%"
    }

    return(
      <div style={optionsStyle}>
        <button>Demographics</button>
        <button>Diplomacy</button>
        <button onClick={this.handleMenuClick.bind(this)}>Menu</button>
      </div>
    );
  }
}