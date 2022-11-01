import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import profilepic from "../../assest/img/profilepic.png";
import "../../assest/css/doctorpage.css";
import { Link } from "react-router-dom";
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
  updateapoointment,
  oneapoointment,
  allappointment,
} from "../../apis/appointment";
import { allconnection } from "../../apis/connection";
import { newparticipate, allparticipate } from "../../apis/participate";
import {
  newnotification,
  newnotificationmsgnew,
} from "../../apis/notification";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
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
      participant: [],
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
        users: user,
      });
    }

    var company = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    for (var q = 0; q < company.length; q++) {
      if (company[q].mr_id === userid) {
        this.setState({
          company_name: company[q].company_name,
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
    this.getnotification();
  };
  gettime = () => {
    this.setState({
      time: moment().format("hh:mm A"),
    });
    setTimeout(() => {
      this.gettime();
    }, 10000);
  };

  handlechangecalender = (e) => {

    var month = document.getElementById("months").value;
    console.log(month)
    this.setState({
      months: month,
    });
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
    var allappointmentnew = await allappointment();
    var allparticipant = await allparticipate();
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

    var participant = await allparticipant.filter((res) => {
      return res.userid === userid && res.meeting_status === "await";
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

      participant: participant,
    });
    var todaysingle = single.filter((data) => {
      return data.meeting_date === today;
    });
    var todayrecurring = recurring.filter((data) => {
      return data.meeting_date === today;
    });

    var todaydeclineappointment = declineappointment.filter((data) => {
      return data.meeting_date === today;
    });
    var todaycompleteappointment = completeappointment.filter((data) => {
      return data.meeting_date === today;
    });
    var todayparticipateappointment = participant.filter((data) => {
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
    for (var c = 0; c < users.length; c++) {
      for (var b = 0; b < todayrecurring.length; b++) {
        if (users[c].userid === todayrecurring[b].to_id) {
          totalappointment.push({
            info: users[c],
            appointment: todayrecurring[b],
          });
        }
      }
    }

    for (var m = 0; m < users.length; m++) {
      for (var n = 0; n < todaydeclineappointment.length; n++) {
        if (users[m].userid === todaydeclineappointment[n].to_id) {
          declineappointmentnew.push({
            info: users[m],
            appointment: todaydeclineappointment[n],
          });
        }
      }
    }
    var completeappointmentnew = [];
    for (var a = 0; a < users.length; a++) {
      for (var f = 0; f < todaycompleteappointment.length; f++) {
        if (users[a].userid === todaycompleteappointment[f].to_id) {
          completeappointmentnew.push({
            info: users[a],
            appointment: todaycompleteappointment[f],
          });
        }
      }
    }
    var myappointmentdata = [];
    for (var x = 0; x < todayparticipateappointment.length; x++) {
      // eslint-disable-next-line no-loop-func
      var myappointment = await allappointmentnew.filter((data) => {
        return data.meeting_id === todayparticipateappointment[x].meetingid;
      });
      myappointmentdata.push(myappointment[0]);
    }

    for (var u = 0; u < users.length; u++) {
      for (var v = 0; v < myappointmentdata.length; v++) {
        if (users[u].userid === myappointmentdata[j].to_id) {
          totalappointment.push({
            info: users[u],
            appointment: myappointmentdata[v],
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
    for (var a = 0; a < liveappointment.length; a++) {
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
        liveappointment[a].appointment.to_time <=
        hoursIntnew + ":" + minutesnew
      ) {
        reseduleappointment.push(liveappointment[a]);
      } else {
        liveappointmentnew.push(liveappointment[a]);
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


    var todaycompleteappointment = completeappointment.filter((data) => {
      return data.meeting_date === today;
    });

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
    for (var x = 0; x < users.length; x++) {
      for (var y = 0; y < todayrecurring.length; y++) {
        if (users[x].userid === todayrecurring[y].to_id) {
          totalappointment.push({
            info: users[x],
            appointment: todayrecurring[y],
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
    const { userid } = this.state;
    var data = {
      waiting_room: "false",
      waitingroom_time: "00:00",
    };
    var nodata = {
      userid: [userid, e.target.name],
    };
    var notimsg = {
      fromid: userid,
      toid: e.target.name,
      notification_from: "Appointment",
      tablename: "Appointment",
      msg: "Leave",
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      var notification = await axios
        .post(`${process.env.REACT_APP_SERVER}/notification`, nodata)
        .then((res) => {
          return res.data;
        });
      var notificationmsg = await axios
        .post(
          `${process.env.REACT_APP_SERVER}/notification/msg/create`,
          notimsg
        )
        .then((res) => {
          return res.data;
        });
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
    console.log(appointment[0]);
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
  viewfulldetails = (e) => {
    sessionStorage.setItem("viewprofile", e.target.value);
    window.location.replace("/mr/fulldetails");
  };
  getnotification = () => {
    setTimeout(() => {
      this.notification();
    }, 2000);
  };

  notification = async () => {
    const { userid } = this.state;
    var mynotification = await axios
      .get(`${process.env.REACT_APP_SERVER}/notification/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (mynotification.length !== 0) {
      var alert = [];
      for (var i = 0; i < mynotification.length; i++) {
        if (mynotification[i].msg === "New Connection") {
          alert.push(mynotification[i]);
          await axios
            .delete(
              `${process.env.REACT_APP_SERVER}/notification/${mynotification[i].id}`
            )
            .then((res) => {
              return res.data;
            });
        }
      }
      if (alert.length !== 0) {
        toast.info("You Receive New Connection...", {
          autoClose: 2000,
          transition: Slide,
        });
      }
    }
    this.getnotification();
  };
  viewfulldetailnews = (e) => {
    sessionStorage.setItem("viewprofile", e.target.id);
    window.location.replace("/doctor/fulldetails");
  }
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
    console.log(reseduleappointment);
    return (
      <>
        <div className="dashboard">
          <Sidebar />
          <div className="waitingroom">
            <div className="row">
              <div className="col-md-6">
                <div className="row p-1 mt-1">
                  <div className="col-sm-2 col-3">
                    {this.state.profileurl !== null ? (
                      <img
                        className="profilepictop"
                        src={this.state.profileurl}
                        alt=""
                      />
                    ) : (
                      <img className="profilepictop" src={profilepic} alt="" />
                    )}
                  </div>
                  <div
                    className="col-sm-10 col-9"
                    style={{ marginLeft: "-30px" }}
                  >
                    <h5>
                      {this.state.initial}. {this.state.firstname}{" "}
                      {this.state.lastname}
                    </h5>
                    <span className="headingspan">
                      {" "}
                      {this.state.company_name}
                    </span>
                    <h6 className="profilerole">Medical Representative</h6>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row p-1 mt-1">
                  <div className="col-sm-4 col-4">
                    <button className="editbtn">
                      <Link to="/mr/setappointments" className="linktag">
                        Pending Actions
                      </Link>
                    </button>
                  </div>
                  <div className="col-sm-6 col-8">
                    <button className="addbtn1">
                      <Link to="/mr/instantappointments" className="linktagadd">
                        + New Instant Appointment
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                            <span className="weekDay">{data.day}</span>
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
                        className="searchbtn btn-sm"
                        onClick={this.searchuser}
                      >
                        Search
                      </button>
                    </div>
                    {myconnectionuser.length !== 0
                      ? myconnectionuser.map((data, index) => (
                        <div className="row userlistdiv" key={index}>
                          <div className="col-md-2">
                            {data.profile_pic !== null ? (
                              <Avatar
                                src={data.profile_pic}
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
              <div className="col-md-10">
                <div className="row livetablelabel">
                  <div className="headingspan col-md-3">Name</div>
                  <div className="headingspan col-md-2">Action</div>
                  <div className="headingspan col-md-2">Status</div>
                  <div className="headingspan col-md-2">Meeting Type</div>
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
                                  <span className="heading" id={data.info.userid}
                                    onClick={this.viewfulldetailnews}>
                                    {data.info.initial}.{" "}
                                    {data.info.first_name}{" "}
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
                            <div className="col-sm-2 col-7 mt-3">
                              <span className="headingspan">
                                {data.appointment.meeting_date === currentdate
                                  ? "You can click and join the Doctor's virtual waiting room"
                                  : "Doctor session NOT started"}
                              </span>
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
                            <div className="col-sm-1 col-1 mt-3">
                              <div className="dropdown dropright">
                                <span className="" data-toggle="dropdown">
                                  <button className="editbtn btn-sm">
                                    <AiOutlineMore
                                      style={{ fontSize: "20px" }}
                                    />
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
                                  <span className="heading" id={data.info.userid}
                                    onClick={this.viewfulldetailnews}>
                                    {data.info.initial}.{" "}
                                    {data.info.first_name}{" "}
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
                              <button
                                className="addbtn btn-sm"
                                id={data.appointment.appointment_id}
                                onClick={this.amendappointment}
                              >
                                Amend
                              </button>
                            </div>
                            <div className="col-sm-2 col-7 mt-3">
                              <span className="headingspan">
                                Doctor session NOT started
                              </span>
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
                            <div className="col-sm-1 col-1 mt-3">
                              <div className="dropdown dropright">
                                <span className="" data-toggle="dropdown">
                                  <button className="editbtn btn-sm">
                                    <AiOutlineMore
                                      style={{ fontSize: "20px" }}
                                    />
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
                                  <span className="heading" id={data.info.userid}
                                    onClick={this.viewfulldetailnews}>
                                    {data.info.initial}.{" "}
                                    {data.info.first_name}{" "}
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
                              <button
                                className="editbtn btn-sm"
                                id={data.appointment.appointment_id}
                                name={data.appointment.to_id}
                                onClick={this.leaveroombtn}
                              >
                                Leave Room
                              </button>
                            </div>
                            <div className="col-sm-2 col-7 mt-3">
                              <span className="headingspan">
                                Attention ! Doctor Might Call you anytime,You
                                are in Waiting Room
                              </span>
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
                            </div>
                            <div className="col-sm-2 col-5 mt-3">
                              <button
                                className="editbtn btn-sm"
                                value={data.info.userid}
                                onClick={this.viewfulldetails}
                              >
                                View Full Details
                              </button>
                            </div>
                            <div className="col-sm-1 col-1 mt-3">
                              <div className="dropdown dropright">
                                <span className="" data-toggle="dropdown">
                                  <button className="editbtn btn-sm">
                                    <AiOutlineMore
                                      style={{ fontSize: "20px" }}
                                    />
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
                                  <span className="heading" id={data.info.userid}
                                    onClick={this.viewfulldetailnews}>
                                    {data.info.initial}.{" "}
                                    {data.info.first_name}{" "}
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
                              <span className="headingspan">
                                Meeting Missed
                              </span>
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
                                  <span className="heading" id={data.info.userid}
                                    onClick={this.viewfulldetailnews}>
                                    {data.info.initial}.{" "}
                                    {data.info.first_name}{" "}
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
                            <div className="col-sm-2 col- mt-3">
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
                              <span className="headingspan">
                                Meeting Decline
                              </span>
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
                                  <span className="heading" id={data.info.userid}
                                    onClick={this.viewfulldetailnews}>
                                    {data.info.initial}.{" "}
                                    {data.info.first_name}{" "}
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
                            <div className="col-sm-2 col-5 mt-3">-</div>
                            <div className="col-sm-2 col-7 mt-3">
                              <span className="headingspan completebtn">
                                Meeting Completed
                              </span>
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
                            </div>
                            <div className="col-sm-2 col-5 mt-3">
                              <button
                                className="editbtn btn-sm"
                                value={data.info.userid}
                                onClick={this.viewfulldetails}
                              >
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
