import React, { Component } from "react";
import Router from "./routers/Routers";

export default class App extends Component {
  componentDidMount = () => {
    document.body.style.zoom = "100%";
  };
  render() {
    return (
      <div className="App">
        <div className="app_body">
          <Router></Router>
        </div>
      </div>
    );
  }
}
