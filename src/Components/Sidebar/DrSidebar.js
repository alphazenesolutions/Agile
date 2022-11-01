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
import {
  singleappointment,
  instantappointment,
  allappointment,
} from "../../apis/appointment";
import "animate.css";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import profilepic from "../../assest/img/profilepic.png";
import axios from "axios";
import moment from "moment";
import { Button } from "@mui/material";
import NotificationSound from "../../assest/Notification/Notification.mp3";

export default class MrSidebar extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      qrcode: null,
      notificationcount: 0,
      approvecount: 0,
      users: [],
      myappointment: 0,
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
      // if (this.state.notificationcount !== Number(mynotificationcount[0].count)) {
      //   console.log("alert")
      // } else {
      //   console.log("okk")
      // }
      this.setState({
        notificationcount: Number(mynotificationcount[0].count),
      });
    }
    // if (userid == null) {
    //   window.location.replace("/");
    // }

    var singleAppointment = await singleappointment();
    var instantAppointment = await instantappointment();
    var single = await singleAppointment.filter((res) => {
      return (
        res.to_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Waiting"
      );
    });
    var instant = await instantAppointment.filter((res) => {
      return (
        res.to_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Waiting"
      );
    });
    var totalappointment = [];
    for (var i = 0; i < user.length; i++) {
      for (var j = 0; j < single.length; j++) {
        if (user[i].userid === single[j].to_id) {
          totalappointment.push({
            info: user[i],
            appointment: single[j],
          });
        }
      }
    }
    for (i = 0; i < user.length; i++) {
      for (j = 0; j < instant.length; j++) {
        if (user[i].userid === instant[j].to_id) {
          totalappointment.push({
            info: user[i],
            appointment: instant[j],
          });
        }
      }
    }

    this.setState({
      approvecount: totalappointment.length,
    });
    var Allappointment = await allappointment();
    if (Allappointment.length !== 0) {
      var today = moment().format("YYYY-MM-DD");
      var time = moment().format("HH:mm");
      // eslint-disable-next-line no-mixed-operators
      var myappointment = await Allappointment.filter((data) => {
        return (
          data.to_id === userid &&
          data.meeting_date === today &&
          data.waiting_room === "true" &&
          data.to_time >= time
        );
      });
      var todayappoitment = await myappointment.filter((data) => {
        return (
          data.meeting_date === today &&
          data.waiting_room === "true" &&
          data.meeting_status !== "completed"
        );
      });
      this.setState({
        myappointment: todayappoitment.length,
      });
    }
    setTimeout(() => {
      this.componentDidMount();
    }, 10000);
  };
  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/");
  };
  peofileupdate = () => {
    window.location.replace("/Review_edit_Doctor");
  };

  render() {
    const { notificationcount, approvecount, myappointment } = this.state;
    console.log(myappointment);
    return (
      <div className="sidebar">
        <div className="sidebar_header">
          <img src={logo} alt="" />
        </div>
        <div className="sidebar_body">
          {myappointment !== 0 ? (
            <div className="sidebar_menu animate__animated animate__shakeX">
              <a className="linktag" href="/doctor/waitingroom">
                <VideoCameraFrontRounded />
                <span>
                  Waiting Room{" "}
                  {myappointment !== 0 ? (
                    <span className="countspanside">{myappointment}</span>
                  ) : null}
                </span>
              </a>
            </div>
          ) : (
            <div className="sidebar_menu">
              <a className="linktag" href="/doctor/waitingroom">
                <VideoCameraFrontRounded />
                <span>
                  Waiting Room{" "}
                  {myappointment !== 0 ? (
                    <span className="countspanside"></span>
                  ) : null}
                </span>
              </a>
            </div>
          )}

          <div className="">
            <span>
              <b>Appointment</b>
            </span>
          </div>

          <div className="sidebar_menu sublink">
            <a className="linktag" href="/doctor/appointment">
              <AccessAlarmRounded />
              <span>All Appointment</span>
            </a>
          </div>

          <div className="sidebar_menu sublink">
            <a className="linktag" href="/dr_clinictimimg">
              <AccessAlarmRounded />
              <span>Edit Clinic Timimg</span>
            </a>
          </div>

          <div className="sidebar_menu">
            <a className="linktag" href="/doctor/connection">
              <GroupAddRounded />
              <span>Connection</span>
            </a>
          </div>
          <div className="sidebar_menu">
            <a className="linktag" href="/doctor/report">
              {" "}
              <AssessmentRounded />
              <span>Report</span>
            </a>
          </div>

          <div className="sidebar_menu">
            <a className="linktag" href="/doctor/tutorial">
              <OndemandVideoRounded />
              <span>Tutorial</span>
            </a>
          </div>

          <div className="sidebar_menu">
            <a className="linktag" href="/doctor/messages">
              {" "}
              <MessageRounded />
              <span>Messages</span>
            </a>
          </div>
          <div className="">
            <span>
              <b>Pending Actions</b>
            </span>
          </div>

          {approvecount !== 0 ? (
            <div
              style={{ width: "280px" }}
              className="sidebar_menu animate__animated animate__shakeX"
            >
              <a className="linktag" href="/doctor/approve">
                {" "}
                <PendingActionsRounded />
                <span>
                  Approve Appointments{" "}
                  {approvecount !== 0 ? (
                    <span className="countspanside">{approvecount}</span>
                  ) : null}
                </span>
              </a>
            </div>
          ) : (
            <div className="sidebar_menu">
              <a className="linktag" href="/doctor/approve">
                {" "}
                <PendingActionsRounded />
                <span>
                  Approve Appointments{" "}
                  {approvecount !== 0 ? (
                    <span className="countspanside">{approvecount}</span>
                  ) : null}
                  {/* <span className="flexNotification">
                  Approve Appointments{" "}
                  {approvecount !== 0 ? (
                    <Avatar style={{ backgroundColor: "#9F63A9" }}>
                      {approvecount > 99 ? "99+" : approvecount}
                    </Avatar>
                  ) : null}
                </span> */}
                </span>
              </a>
            </div>
          )}

          {notificationcount !== 0 ? (
            <div className="sidebar_menu animate__animated animate__shakeX">
              <a className="linktag" href="/doctor/notification">
                <NotificationsActiveRounded />
                <span>
                  Notifications{" "}
                  {notificationcount === 0 ? null : (
                    <span className="countspanside">{notificationcount}</span>
                  )}
                </span>
              </a>
            </div>
          ) : (
            <div className="sidebar_menu">
              <a className="linktag" href="/doctor/notification">
                <NotificationsActiveRounded />
                <span>
                  Notifications{" "}
                  {notificationcount === 0 ? null : (
                    <span className="countspanside">{notificationcount}</span>
                  )}
                </span>
              </a>
            </div>
          )}
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
                {this.state.lastname} <br />
                <span className="headingspan">
                  {this.state.degree} - {this.state.specility}
                </span>
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
