import React from "react";

export default class Resources extends React.Component {
  render() {
    const resourcesStyle = {
      height: "100%"
    }

    return(
      <div style={resourcesStyle}>
        <span>Military: {this.props.militaryCount} </span>
        <span>Civilian: {this.props.civilianCount} </span>
        <span>Supply: {this.props.supply} </span>
        <span>Growth: {this.props.growth}</span>
      </div>
    );
  }
}
