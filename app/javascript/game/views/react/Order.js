import React from "react";

export default class Order extends React.Component {
  clickHandler() {
    this.props.inputController.giveOrder(this.props.name);
  }

  render() {
    return(
      <button onClick={this.clickHandler.bind(this)}>{this.props.name}</button>
    );
  }
}

