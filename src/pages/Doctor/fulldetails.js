import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/DrSidebar";
import "../../assest/css/doctorpage.css";

import { BsFillChatLeftTextFill } from "react-icons/bs";
import axios from "axios";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import LanguageIcon from "@mui/icons-material/Language";
import Upcommping from "../../Components/upcommingappointment";
import Completed from "../../Components/Completeappointment";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import { Link } from "react-router-dom";
import profilepic from "../../assest/img/profilepic.png";
import Avatar from "@mui/material/Avatar";

export default class fulldetails extends Component {
  constructor(props) {
    super();
    this.state = {
      profileid: sessionStorage.getItem("viewprofile"),
      userdata: [],
      userid:
        sessionStorage.getItem("userid") || localStorage.getItem("userid"),
      myconnectiondata: [],
      clinicdatanew: [],
      companyname: null,
      division: null,
      title: null,
    };
  }
  componentDidMount = async () => {
    // const { profileid } = this.state
    var profileid = sessionStorage.getItem("viewprofile");
    console.log(profileid);
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${profileid}`)
      .then((res) => {
        return res.data;
      });
    console.log(userdata[0]);
    if (userdata.length !== 0) {
      this.setState({
        userdata: userdata[0],
      });
    }
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
    var connection = await axios
      .get(`${process.env.REACT_APP_SERVER}/connection/connect`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var myconnection = await connection.filter((connections) => {
      return (
        (connections.to_id === userid || connections.from_id === userid) &&
        connections.connection_status === "Approved"
      );
    });
    var doctorinfo = [],
      doctorinfoid = [];
    for (var j = 0; j < myconnection.length; j++) {
      for (var i = 0; i < user.length; i++) {
        if (myconnection[j].to_id === userid) {
          if (user[i].userid === myconnection[j].from_id) {
            doctorinfo.push(user[i]);
            doctorinfoid.push(myconnection[j]);
          }
        } else {
          if (user[i].userid === myconnection[j].to_id) {
            doctorinfo.push(user[i]);
            doctorinfoid.push(myconnection[j]);
          }
        }
      }
    }
    var myconnectiondata = [];

    for (var c = 0; c < doctorinfo.length; c++) {
      if (
        doctorinfo[c].userid !== userid &&
        doctorinfo[c].userid === profileid
      ) {
        myconnectiondata.push({
          info: doctorinfo[c],
          connection: doctorinfoid[c],
        });
      }
    }
    this.setState({
      myconnectiondata: myconnectiondata[0],
    });
    var clinidata = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic`)
      .then((res) => {
        return res.data;
      });

    var clinicdatanew = [];
    for (var i = 0; i < clinidata.length; i++) {
      if (clinidata[i].doctors === profileid) {
        clinicdatanew.push(clinidata[i]);
      }
    }
    this.setState({
      clinicdatanew: clinicdatanew,
    });
    var companydata = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    for (var a = 0; a < companydata.length; a++) {
      if (companydata[a].mr_id === profileid) {
        this.setState({
          companyname: companydata[a].company_name,
          division: companydata[a].company_division,
          title: companydata[a].title,
        });
      }
    }
  };
  render() {
    const { userdata, myconnectiondata, clinicdatanew, companyname, title } =
      this.state;
    console.log(userdata);
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <div className="mt-2">
            <h5>View Full Details</h5>
          </div>
          <div className="col-md-12">
            <div className="row mt-3">
              <div className="col-md-1">
                {userdata.profile_pic === null ? (
                  <Avatar src={profilepic} alt="" width="50px"></Avatar>
                ) : (
                  <Avatar
                    className="profileavatar"
                    src={userdata.profile_pic}
                    alt=""
                    width="50px"
                  ></Avatar>
                )}
              </div>
              <div className="col-md-4">
                <h4>
                  {userdata.initial}. {userdata.first_name} {userdata.last_name}
                </h4>
                <p className="p">
                  {userdata.role === "mr"
                    ? "Medical Representative"
                    : userdata.role === "doctor"
                    ? "Doctor"
                    : userdata.role === "nonmr"
                    ? "Company Representative"
                    : "Receptionist"}
                </p>
                <p>{userdata.speciality}</p>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-sm-6">
                      <h6>Status</h6>
                      <p className="status">Available</p>
                    </div>
                    <div className="col-sm-6">
                      <button className="editbtn btn-sm m-1">
                        View Profile
                      </button>
                    </div>
                    <div className="row mt-3">
                      <div className=" reviewVisitingcard mt-3">
                        <div className="card reviewVisitingcardBody ">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-3">
                                {userdata.profile_pic !== null ? (
                                  <img
                                    className="profilepicdisplay"
                                    width="50"
                                    src={userdata.profile_pic}
                                    alt="profilepicdisplay"
                                  />
                                ) : (
                                  <img
                                    className="profilepicdisplay"
                                    src={profilepic}
                                    width="50"
                                    alt="profilepicdisplay"
                                  />
                                )}
                              </div>
                              <div className="col-sm-9">
                                <p
                                  style={{
                                    color: "#9F63A9",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {userdata.initial}. {userdata.first_name}{" "}
                                  {userdata.last_name}
                                </p>

                                <h6 className="profilename">
                                  {userdata.role === "mr"
                                    ? "Medical Representative"
                                    : userdata.role === "doctor"
                                    ? "Doctor"
                                    : userdata.role === "nonmr"
                                    ? "Company Representative"
                                    : "Receptionist"}
                                </h6>
                                <h6 className="profilename">
                                  {userdata.degree} - {userdata.speciality}
                                </h6>
                                <div className="flex">
                                  <p>
                                    <b>Phone:</b>
                                  </p>
                                  <span>+91 {userdata.mobile_number}</span>
                                </div>
                                <div className="flex">
                                  <p>
                                    <b>Email :</b>
                                  </p>
                                  <span>{userdata.email}</span>
                                </div>
                                <div className="mt-2">
                                  {/* {facebook === true ? ( */}
                                  <span className="vistingename m-3">
                                    {/* <a href={facebookname}> */}
                                    <FaFacebookF style={{ fontSize: "20px" }} />
                                    {/* </a> */}
                                  </span>
                                  {/* ) : null} */}
                                  {/* {twitter === true ? ( */}
                                  <span className="vistingename  m-3">
                                    {/* <a href={twittername}> */}
                                    <FaTwitter style={{ fontSize: "20px" }} />
                                    {/* </a> */}
                                  </span>
                                  {/* ) : null} */}
                                  {/* {website === true ? ( */}
                                  <span className="vistingename  m-3">
                                    {/* <a href={websitename}> */}
                                    <LanguageIcon
                                      style={{ fontSize: "20px" }}
                                    />
                                    {/* </a> */}
                                  </span>
                                  {/* ) : null} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* 
                      {setvistingcard === true ? (
                        <button
                          className="addbtn addbtn213 btn-sm m-1"
                          onClick={this.savevistingcard}
                        >
                          {" "}
                          Save Visting Card Details{" "}
                        </button>
                      ) : (
                        <button
                          className="addbtn addbtn213 btn-sm m-1"
                          onClick={this.updatevistingcard}
                        >
                          {" "}
                          Update Visting Card Details{" "}
                        </button>
                      )} */}
                      </div>
                    </div>
                    {/*  */}

                    {/*  */}
                  </div>
                </div>
                <div className="col-md-8">
                  <h6>
                    <b>Meeting history</b>
                  </h6>
                  <div className="row mt-3">
                    <div className="col-sm-2">
                      <span className="headingspan">Date of Appointment</span>
                    </div>
                    <div className="col-sm-2">
                      <span className="headingspan">Duration</span>
                    </div>
                    <div className="col-sm-2">
                      <span className="headingspan">Time of call</span>
                    </div>
                    <div className="col-sm-2">
                      <span className="headingspan">Meeting Status</span>
                    </div>
                    <div className="col-sm-1">
                      <span className="headingspan">Video</span>
                    </div>
                    <div className="col-sm-1">
                      <span className="headingspan">Ratings</span>
                    </div>
                    <div className="col-sm-2">
                      <span className="headingspan">Feedback</span>
                    </div>
                  </div>
                  <Completed />

                  <h6 className="mt-5">
                    <b>List of all Upcoming Appointments</b>
                  </h6>
                  <div className="row mt-3">
                    <div className="col-sm-3">
                      <span className="headingspan">Date of Appointment</span>
                    </div>
                    <div className="col-sm-3">
                      <span className="headingspan">Virtual / Video call​</span>
                    </div>
                    <div className="col-sm-3">
                      <span className="headingspan">Time of call</span>
                    </div>
                    <div className="col-sm-3">
                      <span className="headingspan">Action</span>
                    </div>
                    {/* <div className="col-sm-3">
                                            <span className="headingspan">Add Participant</span>
                                        </div> */}
                  </div>
                  <Upcommping />
                </div>
              </div>
            </div>
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
//
