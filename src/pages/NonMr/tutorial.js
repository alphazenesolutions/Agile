import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/NonmrSidebar";
import "../../assest/css/doctorpage.css";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import Tutorial from "../../Components/Tutorial";
export default class tutorial extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      users: [],
    };
  }
  componentDidMount = async () => {
    var userid1 = sessionStorage.getItem("userid");
    if (userid1 === null) {
      var userid2 = localStorage.getItem("userid");
      this.setState({
        userid: userid2,
      });
    } else {
      this.setState({
        userid: userid1,
      });
    }
  };
  render() {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <div className="mt-2">
            <h5>Tutorial..</h5>
            <Tutorial />
          </div>
        </div>
        <div className="bottomnavigation">
          <Navigation />
        </div>
        {/* <SpeedDial /> */}
      </div>
    );
  }
}
