import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import "../../assest/css/doctorpage.css";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import axios from "axios";
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
    };
  }
  componentDidMount = async () => {
    const { profileid } = this.state;
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${profileid}`)
      .then((res) => {
        return res.data;
      });
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
  };
  render() {
    const { userdata, myconnectiondata, clinicdatanew } = this.state;
    console.log(userdata, myconnectiondata);

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
                <p>
                  {userdata.role === "mr"
                    ? "Medical Representative"
                    : userdata.role === "doctor"
                    ? "Doctor"
                    : userdata.role === "nonmr"
                    ? "Company Representative"
                    : "Receptionist"}
                </p>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-sm-6">
                      <h6>Status</h6>
                      <p className="status">Available</p>
                    </div>
                    {/* <div className="col-sm-6">
                                        <button className="editbtn btn-sm m-1">View Profile</button>
                                    </div> */}
                    <div className="row mt-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-8">
                              <h5>
                                <b>Visiting Card</b>
                              </h5>
                              <p>
                                {userdata.degree} - {userdata.speciality}
                              </p>
                              <span>+91 {userdata.mobile_number}</span>
                              <br />
                              <span>{userdata.email}</span>
                              <br />
                              {clinicdatanew.length !== 0
                                ? clinicdatanew.map((data, index) => (
                                    <>
                                      <span className="clinichead">
                                        {" "}
                                        {data.clinic_name},{" "}
                                      </span>
                                    </>
                                  ))
                                : null}
                              {userdata.role !== "doctor" ? (
                                <>
                                  <span className="headingspan">
                                    {userdata.address}, {userdata.city},{" "}
                                    {userdata.state}, {userdata.country} -{" "}
                                    {userdata.postalcode}
                                  </span>
                                  <br />
                                </>
                              ) : null}
                            </div>
                            {myconnectiondata !== undefined ? (
                              <div className="col-sm-4">
                                {myconnectiondata.length !== 0 ? (
                                  <Link
                                    className="rolelink"
                                    to={{
                                      pathname: "/mr/messages",
                                      connectionid:
                                        myconnectiondata.connection
                                          .connection_id,
                                      msgdisplay: true,
                                      myconnectiondisplay: false,
                                    }}
                                  >
                                    <button className="chatbtn" id="hii">
                                      <BsFillChatLeftTextFill /> Chat
                                    </button>
                                  </Link>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
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
