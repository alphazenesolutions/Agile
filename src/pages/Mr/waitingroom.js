import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import "../../assest/css/doctorpage.css";
import RoomCard from "../../Components/RoomCardMR";
import Titlecard from "../../Components/TitleBarMR";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import FeedbackMr from "../../Components/FeedbackMr";

export default class waitingroom extends Component {
  render() {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <Titlecard />
          <div className="mt-3">
            <h5>Virtual Waiting Room</h5>
          </div>
          <div className="row mt-3">
            <RoomCard />
            <FeedbackMr />
          </div>
          <div className="bottomnavigation">
            <Navigation />
          </div>
          {/* <SpeedDial /> */}
        </div>
      </div>
    );
  }
}
