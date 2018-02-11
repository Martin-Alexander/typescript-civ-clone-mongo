import React from "react";

export default class CityOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "nothing"};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    const userInterfaceStyle = {
      position: "absolute",
      left: "0",
      bottom: "210px",
      width: "400px",
      height: "50px",
      backgroundColor: "#e4e5d7"
    }
    
    return(
      <div style={userInterfaceStyle}>
        <form>
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="nothing">Nothing</option>
            <option value="infantry">Infantry</option>
            <option value="worker">Worker</option>
          </select>
        </form>
      </div>
    )
  }
}