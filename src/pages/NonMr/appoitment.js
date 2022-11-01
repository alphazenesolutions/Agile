import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/NonmrSidebar";
import profilepic from "../../assest/img/profilepic.png";
import "../../assest/css/doctorpage.css";
import axios from "axios";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineMore,
} from "react-icons/ai";
import moment from "moment";
import {
  singleappointment,
  recurringappointment,
  instantappointment,
  updateapoointment,
  oneapoointment,
  allappointment,
} from "../../apis/appointment";
import { allconnection } from "../../apis/connection";
import { newparticipate } from "../../apis/participate";
import {
  newnotification,
  newnotificationmsgnew,
} from "../../apis/notification";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import Team from "../../Components/nonmrteam";
import Avatar from "@mui/material/Avatar";

export default class appointment extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      months: null,
      year: null,
      single: [],
      recurring: [],
      instant: [],
      liveappointment: [],
      users: [],
      totalappointment: [],
      reseduleappointment: [],
      data: [],
      Day: null,
      today: moment().format("YYYY-MM-DD"),
      currentdate: moment().format("YYYY-MM-DD"),
      time: null,
      company_name: null,
      leaveappointment: [],
      myconnectionuser: [],
      meeting_id: null,
      onlyid: null,
      declineappointment: [],
      completeappointment: [],
      datepicker: null,
    };
  }
  componentDidMount = async () => {
    var role = sessionStorage.getItem("role") || localStorage.getItem("role");
    if (role === "nonmr") {
      var userid3 = sessionStorage.getItem("doctorid");
      this.setState({
        userid: userid3,
      });
    } else {
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
        users: user,
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
    var today = moment().format("YYYY-MM-DD");
    var date = moment().format("MMMM");
    var year = moment().format("YYYY");
    var Day = moment().format("D");
    this.setState({
      months: date,
      Day: Day,
      today: today,
    });
    var monthnew = 12;
    if (date === "January") {
      monthnew = 1;
    } else if (date === "February") {
      monthnew = 2;
    } else if (date === "March") {
      monthnew = 3;
    } else if (date === "April") {
      monthnew = 4;
    } else if (date === "May") {
      monthnew = 5;
    } else if (date === "June") {
      monthnew = 6;
    } else if (date === "July") {
      monthnew = 7;
    } else if (date === "August") {
      monthnew = 8;
    } else if (date === "September") {
      monthnew = 9;
    } else if (date === "October") {
      monthnew = 10;
    } else if (date === "November") {
      monthnew = 11;
    }
    var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var daysInMonth = new Date(year, monthnew, 0).getDate();
    var data = [];
    for (var i = 1; i < daysInMonth + 1; i++) {
      var weekDay =
        days[(new Date(year, monthnew - 1, 1).getDay() + i - 1) % 7];
      if (i < 10) {
        data.push({
          date: i,
          day: weekDay,
        });
      } else {
        data.push({
          date: i,
          day: weekDay,
        });
      }
    }
    this.gettime();
    this.setState({
      months: date,
      year: year,
      data: data,
    });
    if (Day > 10 && Day <= 20) {
      document.getElementById("calendarnew").scrollBy(800, 0);
    } else if (Day > 20) {
      document.getElementById("calendarnew").scrollBy(1700, 0);
    }
    this.todayappointment();
  };
  gettime = () => {
    this.setState({
      time: moment().format("hh:mm A"),
    });
    setTimeout(() => {
      this.gettime();
    }, 1000);
  };

  handlechangecalender = () => {
    this.setState({
      months: null,
    });
    var month = document.getElementById("months").value;
    var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var year = document.getElementById("year").value;
    var daysInMonth = new Date(year, month, 0).getDate();
    var data = [];
    for (var i = 1; i < daysInMonth + 1; i++) {
      var weekDay = days[(new Date(year, month - 1, 1).getDay() + i - 1) % 7];
      if (i < 10) {
        data.push({
          date: i,
          day: weekDay,
        });
      } else {
        data.push({
          date: i,
          day: weekDay,
        });
      }
    }
    this.setState({
      data: data,
    });
  };
  previousItem = () => {
    document.getElementById("calendarnew").scrollBy(-100, 0);
  };
  nextItem = () => {
    document.getElementById("calendarnew").scrollBy(100, 0);
  };
  todayappointment = async () => {
    const { users, userid, today } = this.state;
    var singleAppointment = await singleappointment();
    var recurringAppointment = await recurringappointment();
    var instantAppointment = await instantappointment();
    var allappointmentnew = await allappointment();
    var single = await singleAppointment.filter((res) => {
      return (
        res.from_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Approved" &&
        res.decline_status === null
      );
    });
    var recurring = await recurringAppointment.filter((res) => {
      return (
        res.from_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Approved" &&
        res.decline_status === null
      );
    });
    var instant = await instantAppointment.filter((res) => {
      return (
        res.from_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Approved" &&
        res.decline_status === null
      );
    });
    var declineappointment = await allappointmentnew.filter((res) => {
      return res.decline_status === "true";
    });
    var completeappointment = await allappointmentnew.filter((res) => {
      return res.meeting_status === "completed";
    });

    this.setState({
      single: single,
      recurring: recurring,
      instant: instant,
    });
    var todaysingle = single.filter((data) => {
      return data.meeting_date === today;
    });
    var todayrecurring = recurring.filter((data) => {
      return data.meeting_date === today;
    });
    var todayinstant = instant.filter((data) => {
      return data.meeting_date === today;
    });
    var todaydeclineappointment = declineappointment.filter((data) => {
      return data.meeting_date === today;
    });
    var todaycompleteappointment = completeappointment.filter((data) => {
      return data.meeting_date === today;
    });
    var totalappointment = [],
      declineappointmentnew = [];
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < todaysingle.length; j++) {
        if (users[i].userid === todaysingle[j].to_id) {
          totalappointment.push({
            info: users[i],
            appointment: todaysingle[j],
          });
        }
      }
    }
    for (var a = 0; a < users.length; a++) {
      for (var b = 0; b < todayrecurring.length; b++) {
        if (users[a].userid === todayrecurring[b].to_id) {
          totalappointment.push({
            info: users[a],
            appointment: todayrecurring[b],
          });
        }
      }
    }
    for (var c = 0; c < users.length; c++) {
      for (var d = 0; d < todayinstant.length; d++) {
        if (users[c].userid === todayinstant[d].to_id) {
          totalappointment.push({
            info: users[c],
            appointment: todayinstant[d],
          });
        }
      }
    }
    for (var e = 0; e < users.length; e++) {
      for (var f = 0; f < todaydeclineappointment.length; f++) {
        if (users[e].userid === todaydeclineappointment[f].to_id) {
          declineappointmentnew.push({
            info: users[e],
            appointment: todaydeclineappointment[f],
          });
        }
      }
    }
    var completeappointmentnew = [];
    for (var g = 0; g < users.length; g++) {
      for (var h = 0; h < todaycompleteappointment.length; h++) {
        if (users[g].userid === todaycompleteappointment[h].to_id) {
          completeappointmentnew.push({
            info: users[g],
            appointment: todaycompleteappointment[h],
          });
        }
      }
    }

    this.setState({
      totalappointment: totalappointment,
      declineappointment: declineappointmentnew,
      completeappointment: completeappointmentnew,
    });
    this.liveappointment();
  };
  liveappointment = () => {
    const { totalappointment } = this.state;
    var time = moment().format("h:mm A");
    var liveappointment = [],
      nonliveappointment = [];
    for (var i = 0; i < totalappointment.length; i++) {
      var colon = time.indexOf(":");
      var hours = time.substr(0, colon),
        minutes = time.substr(colon + 1, 2),
        meridian = time.substr(colon + 4, 2).toUpperCase();
      var hoursInt = parseInt(hours, 10),
        offset = meridian === "PM" ? 12 : 0;
      if (hoursInt === 12) {
        hoursInt = offset;
      } else {
        hoursInt += offset;
      }
      if (
        totalappointment[i].appointment.from_time <=
        hoursInt + ":" + minutes
      ) {
        liveappointment.push(totalappointment[i]);
      } else {
        nonliveappointment.push(totalappointment[i]);
      }
    }
    var reseduleappointment = [],
      liveappointmentnew = [];
    for (var k = 0; k < liveappointment.length; k++) {
      var colonnew = time.indexOf(":");
      var hoursnew = time.substr(0, colonnew),
        minutesnew = time.substr(colonnew + 1, 2),
        meridiannew = time.substr(colonnew + 4, 2).toUpperCase();
      var hoursIntnew = parseInt(hoursnew, 10),
        offsetnew = meridiannew === "PM" ? 12 : 0;
      if (hoursIntnew === 12) {
        hoursIntnew = offsetnew;
      } else {
        hoursIntnew += offsetnew;
      }
      if (
        liveappointment[k].appointment.to_time <=
        hoursIntnew + ":" + minutesnew
      ) {
        reseduleappointment.push(liveappointment[k]);
      } else {
        liveappointmentnew.push(liveappointment[k]);
      }
    }
    var joinroom = [],
      leaveroom = [];
    for (var x = 0; x < liveappointmentnew.length; x++) {
      if (liveappointmentnew[x].appointment.waiting_room === "true") {
        leaveroom.push(liveappointmentnew[x]);
      } else {
        joinroom.push(liveappointmentnew[x]);
      }
    }
    this.setState({
      totalappointment: nonliveappointment,
      liveappointment: joinroom,
      reseduleappointment: reseduleappointment,
      leaveappointment: leaveroom,
    });
    // setTimeout(() => {
    //     this.todayappointment()
    // }, 2000)
  };
  reseduleappointmentbtn = (e) => {
    sessionStorage.setItem("appointmentid", e.target.id);
    window.location.replace("/mr/reseduleappointments");
  };
  amendappointment = (e) => {
    sessionStorage.setItem("appointmentid", e.target.id);
    window.location.replace("/mr/amendappointment");
  };
  getdatemobile = (e) => {
    this.setState({
      datepicker: e.target.value,
    });
    setTimeout(() => {
      this.getdate();
    }, 2000);
  };

  getdate = async (e) => {
    const {
      datepicker,
      months,
      year,
      single,
      recurring,
      instant,
      users,
      currentdate,
    } = this.state;
    console.log(datepicker);
    if (datepicker === null && e.target.id !== undefined) {
      var selectdate = `${year}-${months}-${e.target.id}`;
      var today = moment(selectdate).format("YYYY-MM-DD");
      this.setState({
        Day: e.target.id,
        today: today,
      });
    } else {
      var todaynew = datepicker;
      this.setState({
        today: todaynew,
      });
    }
    this.setState({
      totalappointment: [],
      liveappointment: [],
      reseduleappointment: [],
      leaveappointment: [],
      declineappointment: [],
      completeappointment: [],
    });

    var allappointmentnew = await allappointment();
    var completeappointment = await allappointmentnew.filter((res) => {
      return res.meeting_status === "completed";
    });
    var todaysingle = single.filter((data) => {
      return data.meeting_date === today;
    });
    var todayrecurring = recurring.filter((data) => {
      return data.meeting_date === today;
    });
    var todayinstant = instant.filter((data) => {
      return data.meeting_date === today;
    });

    var todaycompleteappointment = completeappointment.filter((data) => {
      return data.meeting_date === today;
    });
    console.log(todaysingle, todayrecurring, todayinstant);
    var totalappointment = [];
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < todaysingle.length; j++) {
        if (users[i].userid === todaysingle[j].to_id) {
          totalappointment.push({
            info: users[i],
            appointment: todaysingle[j],
          });
        }
      }
    }
    for (var u = 0; u < users.length; u++) {
      for (var v = 0; v < todayrecurring.length; v++) {
        if (users[u].userid === todayrecurring[v].to_id) {
          totalappointment.push({
            info: users[u],
            appointment: todayrecurring[v],
          });
        }
      }
    }
    for (var m = 0; m < users.length; m++) {
      for (var n = 0; n < todayinstant.length; n++) {
        if (users[m].userid === todayinstant[n].to_id) {
          totalappointment.push({
            info: users[m],
            appointment: todayinstant[n],
          });
        }
      }
    }
    for (var a = 0; a < users.length; a++) {
      for (var b = 0; b < todaycompleteappointment.length; b++) {
        if (users[a].userid === todaycompleteappointment[b].to_id) {
          totalappointment.push({
            info: users[a],
            appointment: todaycompleteappointment[b],
          });
        }
      }
    }
    if (currentdate === today) {
      this.setState({
        totalappointment: totalappointment,
      });
      this.todayappointment();
    } else if (currentdate > today) {
      this.setState({
        reseduleappointment: totalappointment,
      });
    } else {
      this.setState({
        totalappointment: totalappointment,
      });
    }
  };
  leaveroombtn = async (e) => {
    var data = {
      waiting_room: "false",
      waitingroom_time: "00:00",
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      this.componentDidMount();
    }
  };
  joinroombtn = async (e) => {
    var data = {
      waiting_room: "true",
      waitingroom_time: moment().format("h:mm:ss"),
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      this.componentDidMount();
    }
  };
  searchuser = async () => {
    const { userid } = this.state;
    var usernamesearch = document.getElementById("usernamesearch").value;
    var connection = await allconnection();
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
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
    for (var k = 0; k < doctorinfo.length; k++) {
      // eslint-disable-next-line no-mixed-operators
      if (
        (doctorinfo[k].userid !== userid && doctorinfo[k].role === "mr") ||
        doctorinfo[k].role === "nonmr"
      ) {
        myconnectiondata.push(doctorinfo[k]);
      }
    }
    var myconnectionuser = [];
    if (myconnectiondata.length !== 0) {
      for (var l = 0; l < myconnectiondata.length; l++) {
        if (
          myconnectiondata[l].first_name
            .toLocaleLowerCase()
            .includes(usernamesearch.toLocaleLowerCase()) ||
          myconnectiondata[l].email
            .toLocaleLowerCase()
            .includes(usernamesearch.toLocaleLowerCase())
        ) {
          myconnectionuser.push(myconnectiondata[l]);
        }
      }
    }
    this.setState({
      myconnectionuser: myconnectionuser,
    });
  };
  addparticipate = async (e) => {
    const { meeting_id, userid } = this.state;
    var appointment = await oneapoointment(meeting_id);
    var data = {
      userid: e.target.id,
      meetingid: appointment[0].meeting_id,
      meeting_table: appointment[0].tablename,
      fromid: userid,
      meeting_date: appointment[0].meeting_date,
      meeting_status: "await",
      meeting_time: appointment[0].meeting_time,
      status: "Approved",
    };
    var nodata = {
      userid: [userid, e.target.id],
    };
    var notimsg = {
      fromid: userid,
      toid: e.target.id,
      notification_from: "Appointment",
      tablename: "Participate",
      msg: "New",
      meeting_date: appointment[0].meeting_date,
    };
    var participate = await newparticipate(data);
    if (participate === true) {
      var notification = await newnotification(nodata);
      if (notification === true) {
        var newnotificationmsg = await newnotificationmsgnew(notimsg);
        if (newnotificationmsg === true) {
          toast.info("Participate Added..", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    }
  };
  declinebtn = async (e) => {
    var data = {
      decline_status: "true",
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      this.componentDidMount();
    }
  };
  openaddparticipate = async (e) => {
    var appointment = await oneapoointment(e.target.id);
    this.setState({
      meeting_id: e.target.id,
      onlyid: appointment[0].meeting_id,
      myconnectionuser: [],
    });
    document.getElementById("usernamesearch").value = "";
  };
  render() {
    const {
      months,
      year,
      totalappointment,
      liveappointment,
      reseduleappointment,
      data,
      Day,
      currentdate,
      leaveappointment,
      myconnectionuser,
      declineappointment,
      completeappointment,
    } = this.state;
    return (
      <>
        <div className="dashboard">
          <Sidebar />
          <div className="waitingroom">
            <Team />
            <div className="mt-2">
              <h5>Appointment</h5>
            </div>
            <div className="row">
              <div className="col-md-3 col-6">
                <select
                  className="form-control"
                  id="months"
                  onChange={(e) => this.handlechangecalender(e)}
                >
                  {months !== null ? (
                    <option value={months} selected>
                      {months}
                    </option>
                  ) : (
                    ""
                  )}
                  <option value="0">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div className="col-md-3 yeardiv col-6">
                <select
                  className="form-control"
                  id="year"
                  onChange={(e) => this.handlechangecalender(e)}
                >
                  {year !== null ? (
                    <option value={year} selected>
                      {year}
                    </option>
                  ) : (
                    ""
                  )}
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6 mobiledatepicker">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => this.getdatemobile(e)}
                />
              </div>
              <div className="col-md-10 calenderdiv">
                <div className="wrapper2 new">
                  <button onClick={this.previousItem} id="backBtn">
                    <AiFillCaretLeft onClick={this.previousItem} />
                  </button>
                  <ul id="calendarnew">
                    {data.length !== 0
                      ? data.map((data, index) =>
                          Number(Day) === data.date ? (
                            <li
                              key={index}
                              id={data.date}
                              onClick={this.getdate}
                              className="day liveday"
                              style={{ display: "grid" }}
                            >
                              {data.date}
                              <span
                                className="weekDay"
                                id={data.date}
                                onClick={this.getdate}
                              >
                                {data.day}
                              </span>
                            </li>
                          ) : (
                            <li
                              key={index}
                              id={data.date}
                              onClick={this.getdate}
                              className="day"
                              style={{ display: "grid" }}
                            >
                              {data.date}
                              <span
                                className="weekDay"
                                id={data.date}
                                onClick={this.getdate}
                              >
                                {data.day}
                              </span>
                            </li>
                          )
                        )
                      : null}
                  </ul>
                  <button id="forBtn" onClick={this.nextItem}>
                    <AiFillCaretRight onClick={this.nextItem} />
                  </button>
                </div>
              </div>
              <div className="col-md-2 col-6">
                <div className="card text-center timecard">
                  <div className="card-body">
                    <h6 className="headingspan">Current Time</h6>
                    <h4 className="timespan" id="currenttime">
                      {this.state.time}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Add Participate
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body row">
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control addinput"
                        id="usernamesearch"
                      />
                    </div>
                    <div className="col-md-4 mb-5">
                      <button
                        className="addbtn btn-sm"
                        onClick={this.searchuser}
                      >
                        Search
                      </button>
                    </div>
                    {myconnectionuser.length !== 0
                      ? myconnectionuser.map((data, index) => (
                          <div className="row userlistdiv" key={index}>
                            <div className="col-md-2">
                              <img
                                className="profilepiccard"
                                id="imageResult1"
                                src={data.profile_pic}
                                alt=""
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="drname">
                                {data.initial}. {data.first_name}{" "}
                                {data.last_name}
                              </span>
                              <br />
                              <span className="headingspan">
                                {" "}
                                {data.role === "doctor"
                                  ? "Doctor"
                                  : data.role === "mr"
                                  ? "Medical Representative"
                                  : data.role === "nonmr"
                                  ? "Non Mr"
                                  : "Receptionist"}
                              </span>
                            </div>
                            <div className="col-md-4">
                              <button
                                type="button"
                                className="editbtn btn-sm"
                                id={data.userid}
                                onClick={this.addparticipate}
                              >
                                Add Participant
                              </button>
                            </div>
                          </div>
                        ))
                      : "No User Found"}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-md-12">
                <div className="row livetablelabel">
                  <div className="headingspan col-md-3">Name</div>
                  <div className="headingspan col-md-2">Action</div>
                  <div className="headingspan col-md-3">Status</div>
                  <div className="headingspan col-md-1">Meeting Type</div>
                  <div className="headingspan col-md-2">Full Details</div>
                  <div className="headingspan col-md-1">Action</div>
                </div>
                <div className="row mt-3">
                  {liveappointment.length !== 0
                    ? liveappointment.map((data, index) => (
                        <div
                          className="card"
                          id={
                            data.appointment.meeting_date === currentdate
                              ? "liveappointment"
                              : null
                          }
                          key={index}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-3 col-12">
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
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {data.appointment.clinic_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-2 col-5 mt-3">
                                {data.appointment.meeting_date ===
                                currentdate ? (
                                  <button
                                    className="addbtn btn-sm"
                                    id={data.appointment.appointment_id}
                                    onClick={this.joinroombtn}
                                  >
                                    Join Room
                                  </button>
                                ) : (
                                  <button
                                    className="addbtn btn-sm"
                                    id={data.appointment.appointment_id}
                                    onClick={this.amendappointment}
                                  >
                                    Amend
                                  </button>
                                )}
                              </div>
                              <div className="col-sm-3 col-7 mt-3">
                                <span className="headingspan">
                                  {data.appointment.meeting_date === currentdate
                                    ? "You can click and join the Doctor's virtual waiting room"
                                    : "Doctor session NOT started"}
                                </span>
                              </div>
                              <div className="col-sm-1 col-6 mt-3">
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
                              </div>
                              <div className="col-sm-2 col-4 mt-3">
                                <button className="editbtn btn-sm">
                                  View Full Details
                                </button>
                              </div>
                              <div className="col-sm-1 col-1 mt-3">
                                <div className="dropdown dropright">
                                  <span className="" data-toggle="dropdown">
                                    <button className="editbtn btn-sm">
                                      <AiOutlineMore />
                                    </button>
                                  </span>
                                  <div className="dropdown-menu">
                                    <button
                                      className="dropdown-item declinebtn"
                                      id={data.appointment.appointment_id}
                                      onClick={this.declinebtn}
                                    >
                                      Decline
                                    </button>
                                    <button
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#staticBackdrop"
                                      id={data.appointment.appointment_id}
                                      onClick={this.openaddparticipate}
                                    >
                                      Add Participate
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                  {totalappointment.length !== 0
                    ? totalappointment.map((data, index) => (
                        <div className="card" key={index}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-3 col-12">
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
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {data.appointment.clinic_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-2 col-5 mt-3">
                                <button
                                  className="addbtn btn-sm"
                                  id={data.appointment.appointment_id}
                                  onClick={this.amendappointment}
                                >
                                  Amend
                                </button>
                              </div>
                              <div className="col-sm-3 col-7 mt-3">
                                <span className="headingspan">
                                  Doctor session NOT started
                                </span>
                              </div>
                              <div className="col-sm-1 col-6 mt-3">
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
                              </div>
                              <div className="col-sm-2 col-4 mt-3">
                                <button className="editbtn btn-sm">
                                  View Full Details
                                </button>
                              </div>
                              <div className="col-sm-1 col-1 mt-3">
                                <div className="dropdown dropright">
                                  <span className="" data-toggle="dropdown">
                                    <button className="editbtn btn-sm">
                                      <AiOutlineMore />
                                    </button>
                                  </span>
                                  <div className="dropdown-menu">
                                    <button
                                      className="dropdown-item declinebtn"
                                      id={data.appointment.appointment_id}
                                      onClick={this.declinebtn}
                                    >
                                      Decline
                                    </button>
                                    <button
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#staticBackdrop"
                                      id={data.appointment.appointment_id}
                                      onClick={this.openaddparticipate}
                                    >
                                      Add Participate
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                  {leaveappointment.length !== 0
                    ? leaveappointment.map((data, index) => (
                        <div className="card" id="liveappointment" key={index}>
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
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {data.appointment.clinic_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-2 col-5 mt-3">
                                <button
                                  className="editbtn btn-sm"
                                  id={data.appointment.appointment_id}
                                  onClick={this.leaveroombtn}
                                >
                                  Leave Room
                                </button>
                              </div>
                              <div className="col-sm-3 col-7 mt-3">
                                <span className="headingspan">
                                  Attention ! Doctor Might Call you anytime,You
                                  are in Waiting Room
                                </span>
                              </div>
                              <div className="col-sm-1 col-6 mt-3">
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
                              </div>
                              <div className="col-sm-2 col-5 mt-3">
                                <button className="editbtn btn-sm">
                                  View Full Details
                                </button>
                              </div>
                              {/* <div className='col-sm-1'>
                                                    <button className='editbtn btn-sm'><AiOutlineMore /></button>
                                                </div> */}
                            </div>
                          </div>
                        </div>
                      ))
                    : null}

                  {reseduleappointment.length !== 0
                    ? reseduleappointment.map((data, index) => (
                        <div
                          className="card"
                          id="reseduleappointment"
                          key={index}
                        >
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
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {data.appointment.clinic_name}
                                    </span>
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
                                    Re-Schedule ​
                                  </button>
                                ) : null}
                              </div>
                              <div className="col-sm-3 col-7 mt-3">
                                <span className="headingspan">
                                  Meeting Missed
                                </span>
                              </div>
                              <div className="col-sm-1 col-6 mt-3">
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
                              </div>
                              <div className="col-sm-2 col-4 mt-3">
                                <button className="editbtn btn-sm">
                                  View Full Details
                                </button>
                              </div>
                              {/* <div className='col-sm-1'>
                                                    <button className='editbtn btn-sm'><AiOutlineMore /></button>
                                                </div> */}
                            </div>
                          </div>
                        </div>
                      ))
                    : null}

                  {declineappointment.length !== 0
                    ? declineappointment.map((data, index) => (
                        <div
                          className="card"
                          id="reseduleappointment"
                          key={index}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-3">
                                <div className="row">
                                  <div className="col-sm-3 col-3 mt-3">
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
                                  <div className="col-sm-9 col-9 mt-3">
                                    <span className="heading">
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {data.appointment.clinic_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-2 col- mt-3">
                                {data.appointment.tablename !== "Instant" ? (
                                  <button
                                    className="addbtn btn-sm resedulebtn"
                                    id={data.appointment.appointment_id}
                                    onClick={this.reseduleappointmentbtn}
                                  >
                                    Re-Schedule ​
                                  </button>
                                ) : null}
                              </div>
                              <div className="col-sm-3 col-7 mt-3">
                                <span className="headingspan">
                                  Meeting Decline
                                </span>
                              </div>
                              <div className="col-sm-1 col-6 mt-3">
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
                              </div>
                              <div className="col-sm-2 col-4 mt-3">
                                <button className="editbtn btn-sm">
                                  View Full Details
                                </button>
                              </div>
                              {/* <div className='col-sm-1'>
                                                    <button className='editbtn btn-sm'><AiOutlineMore /></button>
                                                </div> */}
                            </div>
                          </div>
                        </div>
                      ))
                    : null}

                  {completeappointment.length !== 0
                    ? completeappointment.map((data, index) => (
                        <div className="card" id="liveappointment" key={index}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-3">
                                <div className="row">
                                  <div className="col-sm-3 col-3 mt-3">
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
                                  <div className="col-sm-9 col- mt-3">
                                    <span className="heading">
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {data.appointment.clinic_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-2 col-5 mt-3">-</div>
                              <div className="col-sm-3 col-7 mt-3">
                                <span className="headingspan completebtn">
                                  Meeting Completed
                                </span>
                              </div>
                              <div className="col-sm-1 col-6 mt-3">
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
                              </div>
                              <div className="col-sm-2 col-5 mt-3">
                                <button className="editbtn btn-sm">
                                  View Full Details
                                </button>
                              </div>
                              {/* <div className='col-sm-1'>
                                                    <button className='editbtn btn-sm'><AiOutlineMore /></button>
                                                </div> */}
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
          <div className="bottomnavigation">
            <Navigation />
          </div>
        </div>
        {/* <SpeedDial /> */}
      </>
    );
  }
}
