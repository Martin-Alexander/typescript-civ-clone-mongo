import React from "react";

export default class Order extends React.Component {
  render() {
    return(
      <button>{this.props.name}</button>
    );
  }
}

