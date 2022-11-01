import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import "../../assest/css/doctorpage.css";
import axios from "axios";
import { MdOutlineMessage } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import { singlecart } from "../../apis/clinic";
import { allavailability } from "../../apis/availability";
import { newappointment, allappointment } from "../../apis/appointment";
import {
  newnotification,
  newnotificationmsgnew,
} from "../../apis/notification";
import { updateconnectionzero } from "../../apis/connection";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import Avatar from "@mui/material/Avatar";
import profilepic from "../../assest/img/profilepic.png";
import { Link } from "react-router-dom";
export default class setappointment extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      inclinic: false,
      general: true,
      recurringform: false,
      singleform: false,
      myuser: [],
      clinic_names: [],
      clinicname: null,
      doctor_id: null,
      doctorinfo: null,
      availability: [],
      timeslots: [],
      priority: null,
      timeslot: null,
      selectdate: null,
      route: true,
      active: true,
      daily: null,
      slot_time: null,
      segmentDay: [],
      meetingid: null,
      from_time: null,
      to_time: null,
      routeplan: true,
      availabilitydata: false,
      loader: false,
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
    for (var z = 0; z < company.length; z++) {
      if (company[z].mr_id === userid) {
        this.setState({
          company_name: company[z].company_name,
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
          // &&connections.iscalling === "true"
        );
      });
      console.log(myconnection,"my")
      var myuser = [],
        userids = [];
      for (var i = 0; i < myconnection.length; i++) {
        for (var j = 0; j < user.length; j++) {
          console.log(user[j].userid,myconnection[i].from_id,myconnection[i].to_id)
          // eslint-disable-next-line no-mixed-operators
          if (
            user[j].userid === myconnection[i].from_id ||
            (user[j].userid === myconnection[i].to_id &&
              user[j].create_on === null)
          ) {
            myuser.push({
              info: user[j],
              connection: myconnection[i],
            });
          }
          if (user[j].create_on !== null) {
            userids.push(user[j].userid);
          }
        }
      }
      console.log(myuser);
      for (var x = 0; x < userids.length; x++) {
        var datanew = {
          create_on: null,
        };
        await axios
          .post(
            `${process.env.REACT_APP_SERVER}/users/update/${userids[x]}`,
            datanew
          )
          .then((res) => {
            return res.data;
          });
      }
      var allappointmentnew = await allappointment();
      if (allappointmentnew.length !== 0) {
        var todaydate = moment().format("YYYY-MM-DD");
        var myappointment = await allappointmentnew.filter((data) => {
          return (
            data.from_id === userid &&
            data.meeting_status === "await" &&
            data.decline_status === null &&
            data.tablename !== "Instant" &&
            data.meeting_date >= todaydate
          );
        });
        if (myappointment.length !== 0) {
          var finaluser = [];
          for (var a = 0; a < myappointment.length; a++) {
            finaluser.push(myappointment[a].to_id);
          }
          var unique = finaluser.filter((v, i, a) => a.indexOf(v) === i);
          for (var y = 0; y < unique.length; y++) {
            var datanewdara = {
              create_on: true,
            };
            await axios
              .post(
                `${process.env.REACT_APP_SERVER}/users/update/${unique[y]}`,
                datanewdara
              )
              .then((res) => {
                return res.data;
              });
          }
          console.log(myuser,"1")
          this.setState({
            myuser: myuser,
          });
        } else {
          console.log(myuser,"2")
          this.setState({
            myuser: myuser,
          });
        }
      } else {
        console.log(myuser,"3")
        this.setState({
          myuser: myuser,
        });
      }
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

    setTimeout(() => {
      this.componentDidMount();
    }, 2000);
  };
  clinicname = async (e) => {
    const { doctor_id } = this.state;
    const availability = await allavailability();
    var myavailability = await availability.filter((data) => {
      return data.doctor_id === doctor_id;
    });
    var single = await myavailability.filter((data) => {
      return data.clinic_name === e.target.value;
    });
    this.setState({
      availability: single,
      clinicname: e.target.value,
      availabilitydata: false,
      segmentDay: [],
    });
    document.getElementById("dateslot").value = "";
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value === "In Clinic") {
      this.setState({
        inclinic: true,
      });
      alert(
        "In-Clinic appointments go to the Doctor for approval. This appointment will reflect after Doctor approves the appointment"
      );
      this.timeslot();
    } else if (e.target.value === "Virtual") {
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
      inclinic: true,
    });
  };
  handlechangedate = async (e) => {
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

      var time = moment().format("HH:mm");
      var today = moment().format("YYYY-MM-DD");
      var alertdata = [];
      for (var i = 0; i < single.length; i++) {
        if (single[i].notes !== null) {
          var allday = [single[i].notes];
          var checkday = await allday.filter((data) => {
            return data === day;
          });
          if (checkday.length !== 0) {
            if (alertdata.length === 0) {
              if (e.target.value === today) {
                if (single[i].to_time > time) {
                  alertdata.push(single[i]);
                }
              } else {
                alertdata.push(single[i]);
              }
            }
          }
        } else {
          if (alertdata.length === 0) {
            if (e.target.value === today) {
              if (single[i].to_time > time) {
                alertdata.push(single[i]);
              }
            } else {
              alertdata.push(single[i]);
            }
          }
        }
      }
      this.setState({
        availability: alertdata,
        selectdate: e.target.value,
        availabilitydata: true,
      });
    }
  };
  handlechangepriority = async (e) => {
    const { selectdate } = this.state;
    if (
      Number(e.target.value) === 1 ||
      Number(e.target.value) === 3 ||
      Number(e.target.value) === 5 ||
      Number(e.target.value) > 6
    ) {
      alert("Priority should be 2, 4 ,6");
      document.getElementById("priorityvalue").value = "";
    } else {
      this.setState({
        priority: e.target.value,
      });
      var dates = [];
      var startDates = moment(selectdate)
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      var fudate = moment(selectdate).add(90, "days").format("YYYY-MM-DD");
      var currDate = moment(startDates).startOf("day");
      var lastDate = moment(fudate).startOf("day");
      while (currDate.add(1, "days").diff(lastDate) < 0) {
        dates.push(moment(currDate.clone().toDate()).format("YYYY-MM-DD"));
      }
      this.setState({
        segmentDay: [],
      });
      const segmentDay = await this.segmentDays(dates, Number(e.target.value));
      this.setState({
        segmentDay: segmentDay,
      });
    }
  };
  recurring = async (e) => {
    this.setState({
      general: false,
      recurringform: true,
      singleform: false,
      doctor_id: e.target.id,
    });
    const clinic = await singlecart();
    var clinic_names = await clinic.filter((data) => {
      return data.doctors === e.target.id;
    });
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    this.setState({
      clinic_names: clinic_names,
      doctorinfo: `${userdata[0].initial}. ${userdata[0].first_name} ${userdata[0].last_name}`,
    });
  };
  single = async (e) => {
    this.setState({
      general: false,
      recurringform: false,
      singleform: true,
      doctor_id: e.target.id,
    });
    const clinic = await singlecart();
    var clinic_names = await clinic.filter((data) => {
      return data.doctors === e.target.id;
    });
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    this.setState({
      clinic_names: clinic_names,
      doctorinfo: `${userdata[0].initial}. ${userdata[0].first_name} ${userdata[0].last_name}`,
    });
  };
  recurringcancel = () => {
    this.setState({
      general: true,
      recurringform: false,
      singleform: false,
    });
  };
  singlecancel = () => {
    this.setState({
      general: true,
      recurringform: false,
      singleform: false,
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
      });
    }
  };
  selecttimerecuring = async (e) => {
    const { selectdate, availability, priority } = this.state;
    var single = await availability.filter((data) => {
      return data.availability_id === e.target.value;
    });
    var dates = [];
    var startDates = moment(selectdate)
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    var fudate = moment(selectdate).add(90, "days").format("YYYY-MM-DD");
    var currDate = moment(startDates).startOf("day");
    var lastDate = moment(fudate).startOf("day");
    while (currDate.add(1, "days").diff(lastDate) < 0) {
      dates.push(moment(currDate.clone().toDate()).format("YYYY-MM-DD"));
    }
    this.setState({
      segmentDay: [],
    });
    const segmentDay = await this.segmentDays(dates, Number(priority));
    this.setState({
      from_time: single[0].from_time,
      to_time: single[0].to_time,
      slot_time: `${single[0].from_time}-${single[0].to_time}`,
      segmentDay: segmentDay,
    });
  };
  segmentDays = async (dates, weekday) => {
    var segment = weekday;
    var segments = 0;
    if (segment === 2) {
      segments = 14;
    } else if (segment === 4) {
      segments = 28;
    } else {
      segments = 42;
    }
    console.log(segments);
    var finaldate = [];
    for (var i = 0; i < dates.length; i++) {
      var check = i % segments;
      if (check === 0) {
        finaldate.push(dates[i]);
      }
    }
    return finaldate;
  };
  singleappointment = async () => {
    const {
      priority,
      doctor_id,
      clinicname,
      daily,
      selectdate,
      timeslot,
      from_time,
      to_time,
      userid,
      meetingid,
    } = this.state;
    if (clinicname === null) {
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
      var today = moment().format("YYYY-MM-DD");
      var httime = moment().format("h:mm A");
      const [time, modifier] = httime.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      var newtime = `${hours}:${minutes}`;
      if (today >= selectdate && to_time < newtime) {
        toast.error("Appointment should not be made for the past timing...", {
          autoClose: 2000,
          transition: Slide,
        });
      } else {
        this.setState({
          loader: true,
        });
        var nodata = {
          userid: [userid, doctor_id],
        };
        var notimsg = {
          fromid: userid,
          toid: doctor_id,
          notification_from: "Appointment",
          tablename: "Single",
          msg: "New",
          meeting_date: selectdate,
        };
        if (daily === "In Clinic") {
          var data = {
            from_id: userid,
            to_id: doctor_id,
            action: "wait",
            clinic_name: clinicname,
            priority: priority,
            meeting_status: "await",
            meeting_type: daily,
            meeting_date: selectdate,
            meeting_time: `${from_time}-${to_time}`,
            meeting_slot: timeslot,
            meeting_plan: "Route Plan,Active",
            status: "Waiting",
            tablename: "Single",
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
                window.location.reload();
              }
            }
          }
        } else {
          var data1 = {
            from_id: userid,
            to_id: doctor_id,
            action: "wait",
            clinic_name: clinicname,
            priority: priority,
            meeting_status: "await",
            meeting_type: daily,
            meeting_date: selectdate,
            meeting_time: `${from_time}-${to_time}`,
            meeting_slot: timeslot,
            meeting_plan: "Route Plan,Active",
            status: "Approved",
            tablename: "Single",
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
                window.location.reload();
              }
            }
          }
        }
      }
    }
  };
  recurringppointment = async () => {
    const {
      priority,
      doctor_id,
      clinicname,
      selectdate,
      timeslot,
      userid,
      slot_time,
      segmentDay,
      from_time,
      to_time,
    } = this.state;
    if (clinicname === null) {
      toast.info("Clinic Name Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (priority === null) {
      toast.info("Priority Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (selectdate === null) {
      toast.info("Date Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var today = moment().format("YYYY-MM-DD");
      var httime = moment().format("h:mm A");
      const [time, modifier] = httime.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      var newtime = `${hours}:${minutes}`;

      if (today >= selectdate && to_time < newtime) {
        toast.error("Appointment should not be made for the past timing...", {
          autoClose: 2000,
          transition: Slide,
        });
      } else {
        this.setState({
          loader: true,
        });
        var nodata = {
          userid: [userid, doctor_id],
        };

        for (var i = 0; i < segmentDay.length; i++) {
          var seed = Date.now();
          if (
            window.performance &&
            typeof window.performance.now === "function"
          ) {
            seed += performance.now();
          }
          // eslint-disable-next-line no-loop-func
          var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            // eslint-disable-next-line no-loop-func
            function (c) {
              var r = (seed + Math.random() * 16) % 16 | 0;
              seed = Math.floor(seed / 16);
              return (c === "x" ? r : r & (0x3 | 0x8)).toString(16);
            }
          );
          var data = {
            from_id: userid,
            to_id: doctor_id,
            action: "wait",
            clinic_name: clinicname,
            priority: priority,
            meeting_status: "await",
            meeting_date: segmentDay[i],
            meeting_time: slot_time,
            meeting_slot: timeslot,
            meeting_plan: "Route Plan,Active",
            status: "Approved",
            meeting_type: "Virtual",
            tablename: "Recurring",
            meeting_id: uuid,
            from_time: from_time,
            to_time: to_time,
          };
          var notimsg = {
            fromid: userid,
            toid: doctor_id,
            notification_from: "Appointment",
            tablename: "Recurring",
            msg: "New",
            meeting_date: segmentDay[i],
          };
          var appointment = await newappointment(data);
          if (appointment === true) {
            var notification = await newnotification(nodata);
            if (notification === true) {
              var newnotificationmsg = await newnotificationmsgnew(notimsg);
              if (newnotificationmsg === true) {
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          }
        }
      }
    }
  };
  routecheck = () => {
    const { routeplan } = this.state;
    if (routeplan === true) {
      // eslint-disable-next-line no-restricted-globals
      var alert = confirm(
        "Please confirm that this doctor is a NOT a Calling Doctor !"
      );
      if (alert === true) {
        this.setState({
          routeplan: false,
        });
      }
    } else {
      this.setState({
        routeplan: true,
      });
    }
  };
  saveappointment = async () => {
    const { myuser, doctor_id } = this.state;
    var myconnection = await myuser.filter((data) => {
      return data.info.userid === doctor_id;
    });
    var data = {
      iscalling: false,
    };
    var Updatedata = await updateconnectionzero(
      data,
      myconnection[0].connection.connection_id
    );
    if (Updatedata === true) {
      window.location.reload();
    }
  };
  cancelappointment = () => {
    window.location.reload();
  };
  changeplan = async (e) => {
    // eslint-disable-next-line no-restricted-globals
    var alert = confirm(
      "Please confirm that this doctor is a NOT a Calling Doctor !"
    );
    if (alert === true) {
      var data = {
        iscalling: false,
      };
      var Updatedata = await updateconnectionzero(data, e.target.id);
      if (Updatedata === true) {
        window.location.reload();
      }
    }
  };
  render() {
    const {
      myuser,
      clinic_names,
      doctorinfo,
      availability,
      timeslots,
      segmentDay,
      slot_time,
      routeplan,
      loader,
      availabilitydata,
    } = this.state;
    console.log(myuser);
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          {this.state.general === true ? (
            <div className="general">
              <div className="mt-2">
                <h5>Pending Actions</h5>
                <p>
                  <b>Set Appointments with Connected Doctors</b>
                </p>
              </div>
              <div className="row mt-5">
                <div className="col-md-10">
                  {myuser.length !== 0
                    ? myuser.map((data, index) => (
                        <div className="card" key={index}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 mt-1">
                                <div className="row">
                                  <div className="col-sm-4 col-3">
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
                                  <div className="col-sm-8 mt-2 col-9">
                                    <h6 className="heading">
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </h6>
                                    <span className="headingspan">
                                      {" "}
                                      {data.info.role === "doctor"
                                        ? "Doctor"
                                        : data.info.role === "mr"
                                        ? "Medical Representative"
                                        : data.info.role === "nonmr"
                                        ? "Non Mr"
                                        : "Receptionist"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-2 mt-3 col-12">
                                <h6 className="headingspan">
                                  Connected on{" "}
                                  {moment(data.connection.approved_date).format(
                                    "MMM Do YYYY"
                                  )}
                                </h6>
                              </div>
                              <div className="col-md-2 col-6 mt-3">
                                <button
                                  className="addbtn btn-sm"
                                  id={data.info.userid}
                                  onClick={this.recurring}
                                >
                                  Set Recurring Appointment
                                </button>
                              </div>
                              <div className="col-md-2 col-6 mt-3">
                                <button
                                  className="editbtn btn-sm"
                                  id={data.info.userid}
                                  onClick={this.single}
                                >
                                  Set Single Appointment
                                </button>
                              </div>
                              <div
                                className="col-md-1 col-6 mt-1"
                                style={{ display: "flex" }}
                              >
                                <Link
                                  className="mt-3"
                                  to={{
                                    pathname: "/mr/messages",
                                    connectionid: data.connection.connection_id,
                                    msgdisplay: true,
                                    myconnectiondisplay: false,
                                  }}
                                >
                                  <span className="spanicon m-1">
                                    <MdOutlineMessage />
                                  </span>
                                </Link>
                              </div>
                              <div className="col-md-1 col-6 mt-3">
                                <span
                                  className="spaniconclose m-1"
                                  style={{ cursor: "pointer" }}
                                  id={data.connection.connection_id}
                                  onClick={this.changeplan}
                                >
                                  <AiOutlineClose />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          ) : null}

          {this.state.recurringform === true ? (
            <div className="recurring">
              <div className="mt-2">
                <h5>New Appointment</h5>
                <h4>
                  <b>Recurring Appointment</b>
                </h4>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="row mt-3 ml-5">
                    <div className="col-sm-6">
                      {routeplan === true ? (
                        <input
                          type="checkbox"
                          checked
                          id="route"
                          name="vehicle1"
                          value="Bike"
                          onClick={this.routecheck}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          id="route"
                          name="vehicle1"
                          value="Bike"
                          onClick={this.routecheck}
                        />
                      )}

                      <label className="form-check-label">Route Plan</label>
                    </div>
                    <div className="col-sm-6">
                      {routeplan === false ? (
                        <input
                          type="checkbox"
                          checked
                          className="form-check-input"
                          name="active"
                          value="false"
                          onClick={this.routecheck}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked
                          className="form-check-input"
                          name="active"
                          value="false"
                          onClick={this.routecheck}
                        />
                      )}

                      <label className="form-check-label">Active</label>
                    </div>
                  </div>
                  {routeplan === true ? (
                    <>
                      <div className="mt-3">
                        <div className="mt-3">
                          <label>
                            Doctor Name <span className="red-asterisk">*</span>
                          </label>
                          <input
                            type="text"
                            defaultValue={doctorinfo}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label>
                          Select Clinic / Hospital{" "}
                          <span className="red-asterisk">*</span>
                        </label>
                        <select
                          className="form-control"
                          onChange={(e) => this.clinicname(e)}
                        >
                          <option>--select--</option>
                          {clinic_names.length !== 0
                            ? clinic_names.map((data, index) => (
                                <option
                                  key={index}
                                  defaultValue={data.clinic_name}
                                >
                                  {data.clinic_name}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>
                      <div className="mt-3">
                        <label>
                          Priority <span className="red-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="priority"
                          id="priorityvalue"
                          onChange={(e) => this.handlechangepriority(e)}
                        />
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
                      <div className="mt-3">
                        <label>
                          Select Time <span className="red-asterisk">*</span>
                        </label>
                        <select
                          className="form-control"
                          onChange={(e) => this.selecttimerecuring(e)}
                        >
                          <option>--select--</option>
                          {availability.length !== 0
                            ? availability.map((data, index) => (
                                <option
                                  key={index}
                                  Value={data.availability_id}
                                >
                                  {data.from_time}-{data.to_time}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>
                      <label className="mt-3">
                        <b>Your Appointment Details</b>
                      </label>
                      <div
                        className="row mt-3"
                        id={segmentDay.length !== 0 ? "recurringdiv" : null}
                      >
                        {segmentDay.length !== 0
                          ? segmentDay.map((data, index) => (
                              <>
                                <div className="col-md-6 mt-2">
                                  <div className="mt-1" key={index}>
                                    <input
                                      type="text"
                                      defaultValue={data}
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6 mt-2">
                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      defaultValue={slot_time}
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                            ))
                          : null}
                      </div>
                      <div className="mt-3">
                        <div className="row">
                          <div className="col-sm-6 col-6">
                            {loader === false ? (
                              <button
                                className="savebtn"
                                onClick={this.recurringppointment}
                              >
                                Save Appointment
                              </button>
                            ) : (
                              <button className="savebtn">
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span class="sr-only">Loading...</span>
                              </button>
                            )}
                          </div>
                          <div className="col-sm-6 col-6">
                            <button
                              className="cancelbtn"
                              onClick={this.recurringcancel}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-3">
                      <div className="row">
                        <div className="col-sm-6">
                          <button
                            className="savebtn"
                            onClick={this.saveappointment}
                          >
                            Save
                          </button>
                        </div>
                        <div className="col-sm-6">
                          <button
                            className="cancelbtn"
                            onClick={this.cancelappointment}
                          >
                            cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {this.state.singleform === true ? (
            <div className="single">
              <div className="mt-2">
                <h5>New Appointment</h5>
                <h4>
                  <b>Single appointment</b>
                </h4>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="row mt-3 ml-5">
                    <div className="col-sm-6">
                      {routeplan === true ? (
                        <input
                          type="checkbox"
                          checked
                          id="route"
                          name="vehicle1"
                          value="Bike"
                          onClick={this.routecheck}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          id="route"
                          name="vehicle1"
                          value="Bike"
                          onClick={this.routecheck}
                        />
                      )}

                      <label className="form-check-label">Route Plan</label>
                    </div>
                    <div className="col-sm-6">
                      {routeplan === false ? (
                        <input
                          type="checkbox"
                          onClick={this.routecheck}
                          className="form-check-input"
                          name="active"
                          value="false"
                          checked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          onClick={this.routecheck}
                          className="form-check-input"
                          name="active"
                          value="false"
                        />
                      )}

                      <label className="form-check-label">Active</label>
                    </div>
                  </div>
                  {routeplan === true ? (
                    <>
                      <div className="mt-3">
                        <label>
                          Doctor Name <span className="red-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={doctorinfo}
                          className="form-control"
                        />
                      </div>

                      <div className="mt-3">
                        <label>
                          Select Clinic / Hospital{" "}
                          <span className="red-asterisk">*</span>
                        </label>
                        <select
                          className="form-control"
                          onChange={(e) => this.clinicname(e)}
                        >
                          <option>--select--</option>
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
                          Meeting Type <span className="red-asterisk">*</span>
                        </label>
                        <div className="col-sm-3 radiobtn col-5">
                          <input
                            type="radio"
                            name="daily"
                            value="Virtual"
                            onChange={(e) => this.handlechange(e)}
                            className="radio-input"
                          />
                          <label htmlFor="daily" className="radio-label">
                            {" "}
                            <span className="radio-border"></span>{" "}
                            <b> Virtual</b>{" "}
                          </label>
                        </div>
                        <div className="col-sm-1 col-1"></div>
                        <div className="col-sm-3 radiobtn col-5">
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
                      {/* <div className="mt-3">
                        <label>
                          Priority <span className="red-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="priority"
                          onChange={(e) => this.handlechange(e)}
                        />
                      </div> */}
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
                        {availabilitydata === true ? (
                          <label>
                            Time Slot<span className="red-asterisk">*</span>
                          </label>
                        ) : null}
                        {availabilitydata === true
                          ? availability.length !== 0
                            ? availability.map((data, index) => (
                                <>
                                  <div
                                    className="col-sm-4 radiobtn mr-2 mt-1"
                                    key={index}
                                  >
                                    <input
                                      type="radio"
                                      name="new"
                                      defaultValue={data.availability_id}
                                      onChange={(e) => this.gettimimg(e)}
                                      className="radio-input"
                                    />
                                    <label
                                      htmlFor="new"
                                      className="radio-label"
                                    >
                                      {" "}
                                      <span className="radio-border"></span>{" "}
                                      <b>
                                        {" "}
                                        {data.from_time}-{data.to_time}
                                      </b>{" "}
                                    </label>
                                  </div>
                                </>
                              ))
                            : null
                          : null}
                      </div>
                      {this.state.inclinic === true ? (
                        <div className="mt-3">
                          <label>
                            Select Time Slot{" "}
                            <span className="red-asterisk">*</span>
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
                            {loader === false ? (
                              <button
                                className="savebtn"
                                onClick={this.singleappointment}
                              >
                                Save Appointment
                              </button>
                            ) : (
                              <button className="savebtn">
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span class="sr-only">Loading...</span>
                              </button>
                            )}
                          </div>
                          <div className="col-sm-6">
                            <button
                              className="cancelbtn"
                              onClick={this.singlecancel}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-3">
                      <div className="row">
                        <div className="col-sm-6">
                          <button
                            className="savebtn"
                            onClick={this.saveappointment}
                          >
                            Save
                          </button>
                        </div>
                        <div className="col-sm-6">
                          <button
                            className="cancelbtn"
                            onClick={this.cancelappointment}
                          >
                            cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
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
