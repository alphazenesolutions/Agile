import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/NonmrSidebar";
import "../../assest/css/doctorpage.css";
import RoomCard from "../../Components/RoomCardMR";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import Team from "../../Components/nonmrteam";

export default class waitingroom extends Component {
  render() {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <Team />
          <div className="mt-3">
            <h5>Virtual Waiting Room</h5>
          </div>
          <div className="row mt-3">
            <RoomCard />
          </div>
          <div className="bottomnavigation">
            <Navigation />
          </div>
          {/* <SpeedDial/> */}
        </div>
      </div>
    );
  }
}
