import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import "../../assest/css/doctorpage.css";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import axios from "axios";
import { allappointment, updateapoointment } from "../../apis/appointment";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import profilepic from "../../assest/img/profilepic.png";
import { AiOutlineClose } from "react-icons/ai";

export default class resedulelist extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      resedulelist: [],
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
    var today = moment().format("YYYY-MM-DD");
    var time = moment().format("HH:mm");
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/doctor`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var allappointmentnew = await allappointment();
    var single = await allappointmentnew.filter((res) => {
      return (
        (res.from_id === userid &&
          res.meeting_status === "await" &&
          res.status === "Approved" &&
          res.decline_status !== null) ||
        (res.decline_status === null &&
          res.meeting_date <= today &&
          res.to_time < time)
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
    this.setState({
      resedulelist: totalappointment,
    });
  };
  reseduleappointmentbtn = (e) => {
    sessionStorage.setItem("appointmentid", e.target.id);
    window.location.replace("/mr/reseduleappointments");
  };
  viewfulldetails = (e) => {
    sessionStorage.setItem("viewprofile", e.target.value);
    window.location.replace("/mr/fulldetails");
  };
  declinebtn = async (e) => {
    console.log(e.target.id);
    var data = {
      decline_status: "true",
      meeting_status: "cancel"
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      this.componentDidMount();
    }
  };
  render() {
    const { resedulelist } = this.state;
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <div className="mt-3">
            <h5>Reschedule Appointments</h5>
            <p>Reschedule MISSED/ CANCELLED APPOINTMENT​</p>
          </div>
          <div className="row mt-3">
            {resedulelist.length !== 0
              ? resedulelist.map((data, index) => (
                <div className="card" key={index}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <div className="row">
                          <div className="col-sm-3 col-3">
                            {data.info.profile_pic !== null ? (
                              <Avatar
                                src={data.info.profile_pic}
                                variant="rounded"
                                sx={{ width: 56, height: 56 }}
                              />
                            ) : (
                              <Avatar
                                src={profilepic}
                                variant="rounded"
                                sx={{ width: 56, height: 56 }}
                              />
                            )}
                          </div>
                          <div className="col-sm-9 col-9">
                            <span className="heading">
                              {data.info.initial}. {data.info.first_name}{" "}
                              {data.info.last_name}
                            </span>
                            <br />
                            <span className="headingspan">
                              {data.appointment.clinic_name}
                            </span>
                            <br />
                            <span className="headingspan">Doctor</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 col-5 mt-3">
                        {data.appointment.tablename !== "Instant" ? (
                          <button
                            className="addbtn btn-sm resedulebtn"
                            id={data.appointment.appointment_id}
                            onClick={this.reseduleappointmentbtn}
                          >
                            Re-Schedule
                          </button>
                        ) : null}
                      </div>
                      <div className="col-sm-2 col-7 mt-3">
                        <span className="headingspan">Meeting Missed</span>
                      </div>
                      <div className="col-sm-2 col-6 mt-3">
                        <span className="headingspan">
                          {data.appointment.meeting_type === null
                            ? "Video Call"
                            : data.appointment.meeting_type}
                        </span>
                        <br />
                        <span className="headingspan">
                          {data.appointment.meeting_time}
                        </span>
                        <br />
                        <span className="headingspan">
                          {data.appointment.meeting_date}
                        </span>
                        <br />
                      </div>
                      <div className="col-sm-2 col-4 mt-3">
                        <button
                          className="editbtn btn-sm"
                          value={data.info.userid}
                          onClick={this.viewfulldetails}
                        >
                          View Full Details
                        </button>
                      </div>
                      <div className="col-md-1 col-6 mt-3">
                        <span
                          className="spaniconclose m-1"
                          id={data.appointment.appointment_id}
                          onClick={this.declinebtn}
                        >
                          <AiOutlineClose id={data.appointment.appointment_id}
                            onClick={this.declinebtn} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              : null}
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
