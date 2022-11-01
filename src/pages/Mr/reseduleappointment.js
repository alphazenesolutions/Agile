import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import "../../assest/css/doctorpage.css";
import axios from "axios";
import { oneapoointment } from "../../apis/appointment";
import { singlecart } from "../../apis/clinic";
import { allavailability } from "../../apis/availability";
import moment from "moment";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  newnotification,
  newnotificationmsgnew,
} from "../../apis/notification";
import { updateapoointment } from "../../apis/appointment";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
export default class reseduleappointment extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      username: null,
      doctor_id: null,
      userinfo: [],
      myclinic: [],
      availability: [],
      timeslots: [],
      selectdate: null,
      slot_time: null,
      tablename: null,
      loader: false
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
      });
    }

    var company = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    for (var x = 0; x < company.length; x++) {
      if (company[x].mr_id === userid) {
        this.setState({
          company_name: company[x].company_name,
        });
      }
    }
    var appointmentid = sessionStorage.getItem("appointmentid");
    var oneApoointment = await oneapoointment(appointmentid);
    if (oneApoointment.length !== 0) {
      var userinfo = [];
      for (var i = 0; i < user.length; i++) {
        if (user[i].userid === oneApoointment[0].to_id) {
          userinfo.push(user[i]);
          this.setState({
            username: `${user[i].initial}. ${user[i].first_name} ${user[i].last_name}`,
            doctor_id: user[i].userid,
            tablename: oneApoointment[0].tablename,
          });
        }
      }
      this.setState({
        userinfo: userinfo,
      });
      this.getclinicdata();
    }
  };
  getclinicdata = async () => {
    const { doctor_id } = this.state;
    var clinic = await singlecart();
    if (clinic.length !== 0) {
      var myclinic = [];
      for (var i = 0; i < clinic.length; i++) {
        if (clinic[i].doctors === doctor_id) {
          myclinic.push(clinic[i]);
        }
      }
      this.setState({
        myclinic: myclinic,
      });
    }
  };
  handlechange = async (e) => {
    const { doctor_id, clinicname } = this.state;
    const availability = await allavailability();
    var myavailability = await availability.filter((data) => {
      return data.doctor_id === doctor_id;
    });
    var single = await myavailability.filter((data) => {
      return data.clinic_name === clinicname;
    });
    if (single.length === 0) {
      toast.info("Doctor is not available...", {
        autoClose: 2000,
        transition: Slide,
      });
      this.setState({
        selectdate: null,
        availabilitydata: false,
      });
    } else {
      var day = moment(e.target.value).format("llll").split(",")[0];

      var time = moment().format("HH:mm")
      var today = moment().format("YYYY-MM-DD")
      var alertdata = []
      for (var i = 0; i < single.length; i++) {
        if (single[i].notes !== null) {
          var allday = [single[i].notes]
          var checkday = await allday.filter((data) => { return data === day })
          if (checkday.length !== 0) {
            if (alertdata.length === 0) {
              if (e.target.value === today) {
                if (single[i].to_time > time) {
                  alertdata.push(single[i])
                }
              } else {
                alertdata.push(single[i])
              }
            }
          }
        } else {
          if (alertdata.length === 0) {
            if (e.target.value === today) {
              if (single[i].to_time > time) {
                alertdata.push(single[i])
              }
            } else {
              alertdata.push(single[i])
            }
          }
        }
      }
      this.setState({
        availability: alertdata,
        selectdate: e.target.value,
        availabilitydata: true
      })
    }
  };
  selectclinic = async (e) => {
    this.setState({
      clinicname: e.target.value,
    });
  };
  gettimimg = async (e) => {
    const { availability, daily } = this.state;
    var single = await availability.filter((data) => {
      return data.availability_id === e.target.value;
    });
    this.setState({
      from_time: single[0].from_time,
      to_time: single[0].to_time,
    });
    if (daily === "In Clinic") {
      var startTime = moment(single[0].from_time, "HH:mm");
      var endTime = moment(single[0].to_time, "HH:mm");
      if (endTime.isBefore(startTime)) {
        endTime.add(1, "day");
      }
      var timeStops = [];
      while (startTime <= endTime) {
        timeStops.push(new moment(startTime).format("HH:mm"));
        startTime.add(15, "minutes");
      }
      this.setState({
        timeslots: timeStops,
        slot_time: `${single[0].from_time}-${single[0].to_time}`,
      });
    }
  };
  timeslot = () => {
    const { from_time, to_time } = this.state;
    var startTime = moment(from_time, "HH:mm");
    var endTime = moment(to_time, "HH:mm");
    if (endTime.isBefore(startTime)) {
      endTime.add(1, "day");
    }
    var timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(new moment(startTime).format("HH:mm"));
      startTime.add(15, "minutes");
    }
    console.log(timeStops)
    this.setState({
      timeslots: timeStops,
    });
  };
  updateresedule = async () => {
    const {
      doctor_id,
      clinicname,
      selectdate,
      timeslot,
      userid,
      from_time,
      to_time,
      tablename,
    } = this.state;
    if (clinicname === null) {
      toast.info("Clinic Name Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (selectdate === null) {
      toast.info("Date Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      this.setState({
        loader: true
      })
      var nodata = {
        userid: [userid, doctor_id],
      };
      var notimsg = {
        fromid: userid,
        toid: doctor_id,
        notification_from: "Appointment",
        tablename: tablename,
        msg: "Resedule",
        meeting_date: selectdate,
      };
      var data = {
        clinic_name: clinicname,
        meeting_date: selectdate,
        meeting_time: `${from_time}-${to_time}`,
        meeting_slot: timeslot,
        meeting_plan: "Route Plan,Active",
        status: "Approved",
        from_time: from_time,
        to_time: to_time,
        decline_status: null,
      };
      var appointment = await updateapoointment(
        data,
        sessionStorage.getItem("appointmentid")
      );
      if (appointment === true) {
        var notification = await newnotification(nodata);
        if (notification === true) {
          var newnotificationmsg = await newnotificationmsgnew(notimsg);
          if (newnotificationmsg === true) {
            setTimeout(() => {
              window.location.replace("/mr/appointment");
            }, 2000);
          }
        }
      }
    }
  };
  render() {
    const { username, myclinic, availability, timeslots, loader } = this.state;
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <div className="mt-2">
            <h5>Reschedule Appointments</h5>
            <p>
              <b>Reschedule MISSED/ CANCELLED APPOINTMENT​</b>
            </p>
          </div>
          <div className="col-md-4">
            <div className="mt-3">
              <label>
                Doctor Name<span className="red-asterisk">*</span>
              </label>
              <input type="text" className="form-control" value={username} />
            </div>
            <div className="mt-3">
              <label>
                Select Clinic / Hospital <span className="red-asterisk">*</span>
              </label>
              <select
                className="form-control"
                onChange={(e) => this.selectclinic(e)}
              >
                <option>--select--</option>
                {myclinic.length !== 0
                  ? myclinic.map((data, index) => (
                    <option key={index} value={data.clinic_name}>
                      {data.clinic_name}
                    </option>
                  ))
                  : null}
              </select>
            </div>

            <div className="mt-3">
              <label>
                Select Date <span className="red-asterisk">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="selectdate"
                onChange={(e) => this.handlechange(e)}
              />
            </div>
            <div className="row dailybtn mt-3">
              <label>
                Time Slot<span className="red-asterisk">*</span>
              </label>
              {availability.length !== 0
                ? availability.map((data, index) => (
                  <div className="col-sm-4 radiobtn mr-2 mt-1" key={index}>
                    <input
                      type="radio"
                      name="new"
                      defaultValue={data.availability_id}
                      onChange={(e) => this.gettimimg(e)}
                      className="radio-input"
                    />
                    <label htmlFor="new" className="radio-label">
                      {" "}
                      <span className="radio-border"></span>{" "}
                      <b>
                        {" "}
                        {data.from_time}-{data.to_time}
                      </b>{" "}
                    </label>
                  </div>
                ))
                : null}
            </div>
            {this.state.inclinic === true ? (
              <div className="mt-3">
                <label>
                  Select Time Slot <span className="red-asterisk">*</span>
                </label>
                <select
                  className="form-control"
                  name="timeslot"
                  onChange={(e) => this.handlechange(e)}
                >
                  <option>Time Slot</option>
                  {timeslots.map((data, index) => (
                    <option key={index} value={data}>
                      {data}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="mt-3">
              <div className="row">
                <div className="col-sm-6">
                  {loader === false ? <button className="addbtn" onClick={this.updateresedule}>
                    Reschedule Now
                  </button> : <button className="addbtn">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">Loading...</span>
                  </button>}

                </div>
                <div className="col-sm-6">
                  <button className="editbtn">cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <div className="bottomnavigation">
          <Navigation />
        </div>
        {/* <SpeedDial /> */}
      </div>
    );
  }
}
