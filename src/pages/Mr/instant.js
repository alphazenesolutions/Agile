import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import "../../assest/css/doctorpage.css";
import axios from "axios";
import { singlecart } from "../../apis/clinic";
import { allavailability } from "../../apis/availability";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { newappointment } from "../../apis/appointment";
import {
  newnotification,
  newnotificationmsgnew,
} from "../../apis/notification";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
export default class instant extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      inclinic: false,
      myuser: [],
      doctor_id: null,
      clinic_names: [],
      clinic_info: [],
      selectdate: null,
      daily: null,
      timeslots: [],
      from_time: null,
      to_time: null,
      timeslot: null,
      clinicname: null,
      meetingid: null,
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
      .get(`${process.env.REACT_APP_SERVER}/users/doctor`)
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
    var connection = await axios
      .get(`${process.env.REACT_APP_SERVER}/connection/connect`)
      .then((res) => {
        return res.data;
      });
    if (connection.length !== 0) {
      var myconnection = await connection.filter((connections) => {
        return (
          (connections.to_id === userid || connections.from_id === userid) &&
          connections.connection_status === "Approved"
        );
      });
      var myuser = [];
      for (var i = 0; i < myconnection.length; i++) {
        for (var j = 0; j < user.length; j++) {
          if (
            user[j].userid === myconnection[i].from_id ||
            user[j].userid === myconnection[i].to_id
          ) {
            myuser.push({
              info: user[j],
              connection: myconnection[i],
            });
          }
        }
      }
      this.setState({
        myuser: myuser,
      });
    }
    var seed = Date.now();
    if (window.performance && typeof window.performance.now === "function") {
      seed += performance.now();
    }
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (seed + Math.random() * 16) % 16 | 0;
        seed = Math.floor(seed / 16);
        return (c === "x" ? r : r & (0x3 | 0x8)).toString(16);
      }
    );
    this.setState({
      meetingid: uuid,
    });
    // alert("Instant Appointment go to the Doctor for approval. This appointment will reflect after Doctor approves the appointment")
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value === "In Clinic") {
      alert(
        "In-Clinic appointments go to the Doctor for approval. This appointment will reflect after Doctor approves the appointment.."
      );
      this.setState({
        inclinic: true,
      });
      this.timeslot();
    } else {
      this.setState({
        inclinic: false,
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
    this.setState({
      timeslots: timeStops,
    });
  };
  handlechangename = async (e) => {
    const clinic = await singlecart();
    var clinic_names = await clinic.filter((data) => {
      return data.doctors === e.target.value;
    });
    this.setState({
      clinic_names: clinic_names,
      doctor_id: e.target.value,
    });
  };
  handlechangeclinic = async (e) => {
    const clinic = await allavailability();
    var clinic_name = await clinic.filter((data) => {
      return data.clinic_name === e.target.value;
    });
    this.setState({
      clinic_info: clinic_name,
      clinicname: e.target.value,
    });
  };
  handlechangedate = async (e) => {
    const { clinic_info } = this.state;
    if (clinic_info.length === 0) {
      toast.info("Please Select Clinic / Hospital...", {
        autoClose: 2000,
        transition: Slide,
      });
      this.setState({
        selectdate: null,
      });
    }
    var single = await clinic_info.filter((data) => {
      return data.from_date <= e.target.value;
    });
    if (single.length === 0) {
      toast.info("Clinic Not Available ...", {
        autoClose: 2000,
        transition: Slide,
      });
      this.setState({
        selectdate: null,
      });
      document.getElementById("dateslot").value = "";
    } else {
      this.setState({
        selectdate: e.target.value,
      });
    }
  };
  gettimimg = async (e) => {
    const { clinic_info, daily } = this.state;
    var single = await clinic_info.filter((data) => {
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
      });
    }
  };
  instantappointment = async () => {
    const {
      userid,
      doctor_id,
      selectdate,
      timeslot,
      clinicname,
      daily,
      from_time,
      to_time,
      meetingid,
    } = this.state;
    if (doctor_id === null) {
      toast.info("Doctor Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (clinicname === null) {
      toast.info("Clinic Name Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (daily === null) {
      toast.info("Meeting Type Is Required...", {
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
        tablename: "Instant",
        msg: "New",
        meeting_date: selectdate,
      };
      if (daily === "In Clinic") {
        var data = {
          from_id: userid,
          to_id: doctor_id,
          action: "wait",
          clinic_name: clinicname,
          meeting_status: "await",
          meeting_type: daily,
          meeting_date: selectdate,
          meeting_time: `${from_time}-${to_time}`,
          meeting_slot: timeslot,
          meeting_plan: "Route Plan,Active",
          status: "Waiting",
          tablename: "Instant",
          meeting_id: meetingid,
          from_time: timeslot,
          to_time: to_time,
        };
        var appointment = await newappointment(data);
        if (appointment === true) {
          var notification = await newnotification(nodata);
          if (notification === true) {
            var newnotificationmsg = await newnotificationmsgnew(notimsg);
            if (newnotificationmsg === true) {
              window.location.replace("/mr/appointment");
            }
          }
        }
      } else {
        var data1 = {
          from_id: userid,
          to_id: doctor_id,
          action: "wait",
          clinic_name: clinicname,
          meeting_status: "await",
          meeting_type: daily,
          meeting_date: selectdate,
          meeting_time: `${from_time}-${to_time}`,
          meeting_slot: timeslot,
          meeting_plan: "Route Plan,Active",
          status: "Waiting",
          tablename: "Instant",
          meeting_id: meetingid,
          from_time: from_time,
          to_time: to_time,
        };

        var appointment1 = await newappointment(data1);
        if (appointment1 === true) {
          var notification1 = await newnotification(nodata);
          if (notification1 === true) {
            var newnotificationmsg1 = await newnotificationmsgnew(notimsg);
            if (newnotificationmsg1 === true) {
              window.location.replace("/mr/appointment");
            }
          }
        }
      }
    }
  };
  cancelbtn = () => {
    window.location.reload();
  };
  render() {
    const { myuser, clinic_names, clinic_info, timeslots, loader } = this.state;
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <div className="mt-2">
            <h5>New Instant Appointment</h5>
            <p>
              Set an instant appointment with a doctor from your connections
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="mt-3">
                <label>
                  Select Doctor<span className="red-asterisk">*</span>
                </label>
                <select
                  className="form-control"
                  onChange={(e) => this.handlechangename(e)}
                >
                  <option>--Select--</option>
                  {myuser.length !== 0
                    ? myuser.map((data, index) => (
                      <option key={index} value={data.info.userid}>
                        {data.info.initial}. {data.info.first_name}{" "}
                        {data.info.last_name}
                      </option>
                    ))
                    : null}
                </select>
              </div>
              <div className="mt-3">
                <label>
                  Select Clnic<span className="red-asterisk">*</span>
                </label>
                <select
                  className="form-control"
                  onChange={(e) => this.handlechangeclinic(e)}
                >
                  <option>Doctor Clinic</option>
                  {clinic_names.length !== 0
                    ? clinic_names.map((data, index) => (
                      <option key={index} value={data.clinic_name}>
                        {data.clinic_name}
                      </option>
                    ))
                    : null}
                </select>
              </div>
              <div className="row dailybtn mt-3">
                <label>
                  Meeting Type<span className="red-asterisk">*</span>
                </label>
                <div className="col-sm-3 col-5 radiobtn">
                  <input
                    type="radio"
                    name="daily"
                    value="Virtual"
                    onChange={(e) => this.handlechange(e)}
                    className="radio-input"
                  />
                  <label htmlFor="daily" className="radio-label">
                    {" "}
                    <span className="radio-border"></span> <b> Virtual</b>{" "}
                  </label>
                </div>
                <div className="col-sm-1 col-1"></div>
                <div className="col-sm-3 col-5 radiobtn">
                  <input
                    type="radio"
                    name="daily"
                    value="In Clinic"
                    onChange={(e) => this.handlechange(e)}
                    className="radio-input"
                  />
                  <label htmlFor="weekly" className="radio-label">
                    <span className="radio-border"></span>
                    <b> In Clinic</b>{" "}
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <label>
                  Select Date <span className="red-asterisk">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dateslot"
                  name="selectdate"
                  onChange={(e) => this.handlechangedate(e)}
                />
              </div>
              <div className="row dailybtn mt-3">
                <label>
                  Time Slot<span className="red-asterisk">*</span>
                </label>
                {clinic_info.length !== 0
                  ? clinic_info.map((data, index) => (
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
                  <div className="col-sm-6 col-8">
                    {loader === false ? <button
                      className="savebtn"
                      onClick={this.instantappointment}
                    >
                      Set Appointment
                    </button> : <button
                      className="savebtn"

                    >
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span class="sr-only">Loading...</span>
                    </button>}

                  </div>
                  <div className="col-sm-6 col-4">
                    <button className="cancelbtn" onClick={this.cancelbtn}>
                      cancel
                    </button>
                  </div>
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
