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

export default class recpsidebar extends Component {
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
  };
  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/");
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
                to={{ pathname: "/receptionist/waitingroom", page: "Personal" }}
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
                to={{ pathname: "/receptionist/appointment", page: "Personal" }}
              >
                <span>
                  <img src={appointment} alt="" />
                </span>{" "}
                Appointments
              </Link>
            </div>

            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{ pathname: "/receptionist/connection", page: "Personal" }}
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
                to={{ pathname: "/receptionist/waitingroom", page: "Personal" }}
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
                to={{ pathname: "/receptionist/waitingroom", page: "Personal" }}
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
                to={{
                  pathname: "/receptionist/approveappointment",
                  page: "Personal",
                }}
              >
                <span>
                  <img src={camera} alt="" />
                </span>{" "}
                Pending Actions
              </Link>
            </div>
            <div className="pagetitlelinkpage sublink">
              <Link
                className="linkitem"
                to={{
                  pathname: "/receptionist/approveappointment",
                  page: "Personal",
                }}
              >
                <span>
                  <img src={appointment} alt="" />
                </span>{" "}
                Approve Appointments
              </Link>
            </div>
            <div className="pagetitlelinkpage">
              <Link
                className="linkitem"
                to={{
                  pathname: "/receptionist/notification",
                  page: "Personal",
                }}
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
                  {this.state.degree} - {this.state.specility}
                </span>
              </div>
              <div className="col-sm-1">
                <div className="dropdown dropright">
                  <span className="" data-toggle="dropdown">
                    <GrMoreVertical />
                  </span>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/recp_profile">
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
