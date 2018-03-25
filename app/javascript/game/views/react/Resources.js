import React from "react";

export default class Resources extends React.Component {
  render() {
    const resourcesStyle = {
      height: "100%"
    }

    return(
      <div style={resourcesStyle}>
        <span>Military: <strong>{this.props.militaryCount}</strong> </span>
        {/*<span>Civilian: {this.props.civilianCount} </span>*/}
        <span>Supply: <strong>{this.props.supply}</strong> </span>
        <span>Growth: <strong>{this.props.growth}</strong> </span>
      </div>
    );
  }
}
