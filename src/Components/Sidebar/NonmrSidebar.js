import React, { Component } from "react";
import logo from "../../assest/img/Victor logo2.png";
import {
  VideoCameraFrontRounded,
  AccessAlarmRounded,
  GroupAddRounded,
  AssessmentRounded,
  OndemandVideoRounded,
  MessageRounded,
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

export default class NonmrSidebar extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      qrcode: null,
      notificationcount: "0",
      users: [],
      company_name: null,
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
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        profileurl: userdata[0].profile_pic,
        qrcode: userdata[0].qrcode,
        users: user,
      });
    }

    var company = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/nonmr`)
      .then((res) => {
        return res.data;
      });
    for (var i = 0; i < company.length; i++) {
      if (company[i].nonmr_id === userid) {
        this.setState({
          company_name: company[i].company_name,
        });
      }
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
    window.location.replace("/nonmr_review_edit");
  };

  render() {
    const { company_name } = this.state;
    return (
      <div className="sidebar">
        <div className="sidebar_header">
          <img src={logo} alt="" />
        </div>
        <div className="sidebar_body">
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/waitingroom" }}>
              <VideoCameraFrontRounded />
              <span> Waiting Room</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/appointment" }}>
              <AccessAlarmRounded />
              <span>Appointment</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/connection" }}>
              <GroupAddRounded />
              <span>Connection</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/waitingroom" }}>
              {" "}
              <AssessmentRounded />
              <span>Report</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/tutorial" }}>
              <OndemandVideoRounded />
              <span>Tutorial</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/messages" }}>
              {" "}
              <MessageRounded />
              <span>Messages</span>
            </Link>
          </div>
          <div className="sidebar_menu">
            <Link className="linktag" to={{ pathname: "/nonmr/notification" }}>
              <NotificationsActiveRounded />
              <span>Notifications</span>
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
                <span className="profilerole">{company_name}</span>
              </span>
            </div>
            <div className="dropdown dropright">
              <span className="" data-toggle="dropdown">
                <MoreVertRounded />
              </span>
              <div className="dropdown-menu">
                <Button
                  className="dropdown-item"
                  onClick={this.peofileupdate}
                  style={{ color: "black" }}
                >
                  Profile Update
                </Button>
                <Button
                  className="dropdown-item"
                  onClick={this.logout}
                  style={{ color: "red" }}
                >
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
