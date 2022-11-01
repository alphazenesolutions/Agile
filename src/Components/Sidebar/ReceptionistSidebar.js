import React, { Component } from "react";
import logo from "../../assest/img/Victor logo2.png";
import {
  VideoCameraFrontRounded,
  AccessAlarmRounded,
  GroupAddRounded,
  AssessmentRounded,
  OndemandVideoRounded,
  MessageRounded,
  PendingActionsRounded,
  NotificationsActiveRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import "./Sidebar.css";

import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import profilepic from "../../assest/img/profilepic.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";

export default class MrSidebar extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      qrcode: null,
      notificationcount: "0",
      users: [],
    };
  }
  componentDidMount = async () => {
    var userid1 =
      sessionStorage.getItem("userid") || localStorage.getItem("userid");
    this.setState({
      userid: userid1,
    });
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (userdata.length !== 0) {
      this.setState({
        firstname: userdata[0].first_name,
        initial: userdata[0].initial,
        number: userdata[0].mobile_number,
        degree: userdata[0].degree,
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        landline: userdata[0].landline_number,
        specility: userdata[0].speciality,
        profileurl: userdata[0].profile_pic,
        qrcode: userdata[0].qrcode,
        users: user,
      });
    }

    var mynotificationcount = await axios
      .get(`${process.env.REACT_APP_SERVER}/notification/count/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (mynotificationcount.length !== 0) {
      this.setState({
        notificationcount: mynotificationcount[0].count,
      });
    }
    if (userid == null) {
      window.location.replace("/");
    }
    setTimeout(() => {
      this.componentDidMount();
    }, 60000);
  };
  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/");
  };
  peofileupdate = () => {
    window.location.replace("/rec_review_edit");
  };

  render() {
    const { notificationcount } = this.state;
    return (
      <div className="sidebar">
        <div className="sidebar_header">
          <img src={logo} alt="" />
        </div>
        <div className="sidebar_body">
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/waitingroom" }}
            >
              <VideoCameraFrontRounded />
              <span> Waiting Room</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/appointment" }}
            >
              <AccessAlarmRounded />
              <span>Appointment</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/connection" }}
            >
              <GroupAddRounded />
              <span>Connection</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/waitingroom" }}
            >
              {" "}
              <AssessmentRounded />
              <span>Report</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/tutorial" }}
            >
              <OndemandVideoRounded />
              <span>Tutorial</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/message" }}
            >
              {" "}
              <MessageRounded />
              <span>Messages</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/approveappointment" }}
            >
              {" "}
              <PendingActionsRounded />
              <span>Pending Actions</span>
            </Link>
          </div>
          <div className="sidebar_menu sublink">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/approveappointment" }}
            >
              {" "}
              <PendingActionsRounded />
              <span>Approve Appointments</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link
              className="linktag"
              to={{ pathname: "/receptionist/notification" }}
            >
              <NotificationsActiveRounded />
              <span>
                Notifications{" "}
                {notificationcount !== "0" ? (
                  <span className="countspanside">{notificationcount}</span>
                ) : null}
              </span>
            </Link>
          </div>
        </div>
        <div className="sidebar_footer">
          <Stack direction="row" spacing={2}>
            {this.state.profileurl !== null ? (
              <Avatar
                alt="Remy Sharp"
                src={this.state.profileurl}
                variant="rounded"
              />
            ) : (
              <Avatar alt="Remy Sharp" src={profilepic} variant="rounded" />
            )}
            <div className="sidebar_headerRight">
              <span className="title">
                {this.state.initial}. {this.state.firstname}{" "}
                {this.state.lastname}
                <br />
                <span className="profilerole">Receptionist</span>
              </span>
            </div>
            <div className="dropdown dropright">
              <span className="" data-toggle="dropdown">
                <MoreVertRounded />
              </span>
              <div className="dropdown-menu">
                <Button className="dropdown-item" onClick={this.peofileupdate}>
                  Profile Update
                </Button>
                <Button className="dropdown-item" onClick={this.logout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </Stack>
        </div>
      </div>
    );
  }
}
