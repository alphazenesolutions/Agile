import React, { Component } from "react";
import victor from "../assest/img/Victor logo2.png";
import { Link } from "react-router-dom";
import "../assest/css/pagesidebar.css";
import camera from "../assest/img/video_camera_front_black_24dp.svg";
import notification from "../assest/img/notifications.svg";
import connection from "../assest/img/connection.svg";
import appointment from "../assest/img/appointment.svg";
import profilepic from "../assest/img/profilepic.png";
import { GrMoreVertical } from "react-icons/gr";
import axios from "axios";

export default class mrsidebar extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      qrcode: null,
      notificationcount: null,
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
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    for (var i = 0; i < company.length; i++) {
      if (company[i].mr_id === userid) {
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
  };
  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/");
  };
  appointment = () => {
    window.location.replace("/mr/setappointments");
  };
  render() {
    const { qrcode, notificationcount } = this.state;
    return (
      <>
        <div className="sidebardiv">
          <div className="logosidebar mt-5">
            <img src={victor} alt="" />
          </div>
          <div className="itemlinkpage">
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/waitingroom", page: "Personal" }}
              >
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Waiting Room
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/appointment", page: "Personal" }}
              >
                <span>
                  <img src={appointment} alt="" />
                </span>{" "}
                Appointments
              </Link>
            </div>
            <div className="pagetitlelinkpage sublink">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/instantappointments", page: "Personal" }}
              >
                <span>
                  <img src={appointment} alt="" />
                </span>{" "}
                Set an Instant Appointment
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/connection", page: "Personal" }}
              >
                <span>
                  <img src={connection} alt="" />
                </span>{" "}
                Connections
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/tutorial", page: "Personal" }}
              >
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Tutorials
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/messages", page: "Personal" }}
              >
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Messages
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/setappointments", page: "Personal" }}
              >
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Pending Actions
              </Link>
            </div>
            <div className="pagetitlelinkpage sublink">
              <Link className="linkitem" onClick={this.appointment}>
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Set Appointments
              </Link>
            </div>
            <div className="pagetitlelinkpage sublink">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/reseduleappointments", page: "Personal" }}
              >
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Reschedule Appointments
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/mr/notification", page: "Personal" }}
              >
                <span>
                  <img src={notification} alt="" />
                </span>{" "}
                Notifications
                {notificationcount !== null ? (
                  <span className="countspanside">{notificationcount}</span>
                ) : null}
              </Link>
            </div>
          </div>
          <div>
            {qrcode !== null ? <img src={qrcode} alt="" width="100px" /> : null}
          </div>
          <div className="footer mt-5">
            <div className="row">
              <div className="col-sm-3">
                {this.state.profileurl !== null ? (
                  <img
                    className="sidebarprofile"
                    src={this.state.profileurl}
                    alt=""
                  />
                ) : (
                  <img className="sidebarprofile" src={profilepic} alt="" />
                )}
              </div>
              <div className="col-sm-7 namelist">
                <span className="sidebarname">
                  <b>
                    {this.state.initial}. {this.state.firstname}{" "}
                    {this.state.lastname}
                  </b>
                </span>
                <br />
                <span className="headingspanside">
                  {" "}
                  {this.state.company_name}
                </span>
              </div>
              <div className="col-sm-1">
                <div className="dropdown dropright">
                  <span className="" data-toggle="dropdown">
                    <GrMoreVertical />
                  </span>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/mr_profile">
                      Profile Update
                    </a>
                    <a
                      className="dropdown-item"
                      href="##"
                      onClick={this.logout}
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
