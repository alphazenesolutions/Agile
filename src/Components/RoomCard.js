import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  singleappointment,
  recurringappointment,
  instantappointment,
  updateapoointment,
  updateapoointmentmeeting,
} from "../apis/appointment";
import moment from "moment";
import chair from "../assest/img/chair.png";
import { BsCameraVideoFill } from "react-icons/bs";
import Noperson from "../assest/img/No Person.svg";
import Avatar from "@mui/material/Avatar";
import { FaHandPaper } from "react-icons/fa";
import profilepic from "../assest/img/profilepic.png";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
class RoomCard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      users: [],
      today: moment().format("YYYY-MM-DD"),
      currentdate: moment().format("YYYY-MM-DD"),
      months: null,
      year: null,
      single: [],
      recurring: [],
      instant: [],
      liveappointment: [],
      totalappointment: [],
      data: [],
      Day: null,
      time: null,
      leaveappointment: [],
      ansermodaldata: [],
      ansermodaldiv: false,
      role: sessionStorage.getItem("role") || localStorage.getItem("role"),
      missedmodeldata: [],
      missedmodeldiv: false,
      missedcalltime: 0
    };
  }
  componentDidMount = async () => {
    var role = sessionStorage.getItem("role") || localStorage.getItem("role");
    if (role === "receptionist") {
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
      .get(`${process.env.REACT_APP_SERVER}/users/mr`)
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
    this.todayappointment();
    this.getnotification();
  };
  todayappointment = async () => {
    const { users, userid, today } = this.state;
    var singleAppointment = await singleappointment();
    var recurringAppointment = await recurringappointment();
    var instantAppointment = await instantappointment();

    var single = await singleAppointment.filter((res) => {
      return (
        res.to_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Approved"
      );
    });
    var recurring = await recurringAppointment.filter((res) => {
      return (
        res.to_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Approved"
      );
    });
    var instant = await instantAppointment.filter((res) => {
      return (
        res.to_id === userid &&
        res.meeting_status === "await" &&
        res.status === "Approved"
      );
    });
    this.setState({
      single: single,
      recurring: recurring,
      instant: instant,
    });
    var todaysingle = single.filter((data) => {
      return data.meeting_date === today && data.meeting_type === "Virtual";
    });
    var todayrecurring = recurring.filter((data) => {
      return data.meeting_date === today && data.meeting_type === "Virtual";
    });
    var todayinstant = instant.filter((data) => {
      return data.meeting_date === today && data.meeting_type === "Virtual";
    });
    var totalappointment = [];
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < todaysingle.length; j++) {
        if (users[i].userid === todaysingle[j].from_id) {
          totalappointment.push({
            info: users[i],
            appointment: todaysingle[j],
          });
        }
      }
    }
    for (i = 0; i < users.length; i++) {
      for (j = 0; j < todayrecurring.length; j++) {
        if (users[i].userid === todayrecurring[j].from_id) {
          totalappointment.push({
            info: users[i],
            appointment: todayrecurring[j],
          });
        }
      }
    }
    for (i = 0; i < users.length; i++) {
      for (j = 0; j < todayinstant.length; j++) {
        if (users[i].userid === todayinstant[j].from_id) {
          totalappointment.push({
            info: users[i],
            appointment: todayinstant[j],
          });
        }
      }
    }
    this.setState({
      totalappointment: totalappointment,
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
    for (i = 0; i < liveappointment.length; i++) {
      var colon1 = time.indexOf(":");
      var hours1 = time.substr(0, colon1),
        minutes1 = time.substr(colon + 1, 2),
        meridian1 = time.substr(colon + 4, 2).toUpperCase();
      var hoursInt1 = parseInt(hours1, 10),
        offset1 = meridian1 === "PM" ? 12 : 0;
      if (hoursInt1 === 12) {
        hoursInt1 = offset1;
      } else {
        hoursInt1 += offset1;
      }
      if (liveappointment[i].appointment.to_time <= hoursInt + ":" + minutes1) {
        reseduleappointment.push(liveappointment[i]);
      } else {
        liveappointmentnew.push(liveappointment[i]);
      }
    }
    var leaveroom = [];
    for (i = 0; i < liveappointmentnew.length; i++) {
      if (liveappointmentnew[i].appointment.waiting_room === "true") {
        var current_time = moment().format("h:mm:ss");
        var mins = moment
          .utc(
            moment(current_time, "HH:mm:ss").diff(
              moment(
                liveappointmentnew[i].appointment.waitingroom_time,
                "HH:mm:ss"
              )
            )
          )
          .format("mm");
        leaveroom.push({
          time: mins,
          appointment: liveappointmentnew[i],
        });
      }
    }
    leaveroom.sort(function (a, b) {
      return a.appointment.appointment.waitingroom_time.localeCompare(
        b.appointment.appointment.waitingroom_time
      );
    });
    this.setState({
      leaveappointment: leaveroom,
    });
    this.modaldata();
  };
  waivebtn = async (e) => { };
  waivebtn = async (e) => {
    // eslint-disable-next-line default-case
    switch (e.detail) {
      case 1:
        var data = {
          action: "waive",
        };
        var appointment = await updateapoointment(data, e.target.id);
        if (appointment === true) {
          // alert("Request Send..")
          this.componentDidMount();
        }
        break;
      case 2:
        var datanew = {
          action: "answer",
        };
        var appointmentnew = await updateapoointment(datanew, e.target.id);
        if (appointmentnew === true) {
          // alert("Request Send..")
          this.componentDidMount();
        }
        break;
    }
  };
  videocall = async (e) => {
    var data = {
      action: "answer",
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      // alert("Request Send..")
      this.componentDidMount();
    }
  };
  callNow = async (e) => {
    var data = {
      action: "answer",
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      // alert("Request Send..")
      this.componentDidMount();
    }
  };
  joincall = async (e) => {
    const { userid } = this.state;
    var data = {
      incall: "true",
      meeting_ontime: moment().format("h:mm:ss"),
      action: "ready",
    };
    var appointment = await updateapoointmentmeeting(data, e.target.id);
    if (appointment === true) {
      window.open(
        `https://meet.mindinfinitisolutions.com/room/${e.target.id}?&id=${userid}`
      );
    }
  };
  extendcall = async (e) => {
    const { missedcalltime } = this.state;
    const endTime = moment(missedcalltime, 'HH:mm:ss').add(30, 'minutes').format('HH:mm');
    var data = {
      to_time: endTime
    };
    var appointment = await updateapoointmentmeeting(data, e.target.id);
    if (appointment === true) {
      window.location.reload()
    }
  }
  modaldata = async () => {
    const { leaveappointment } = this.state;
    var ansermodal = await leaveappointment.filter((data) => {
      return data.appointment.appointment.action === "answer";
    });
    this.setState({
      ansermodaldata: ansermodal[0],
      ansermodaldiv: true,
    });
    setTimeout(() => {
      this.todayappointment();
    }, 10000);
    var futuretime = moment().add(15, "m").format("HH:mm")
    // var futuretime = "17:40"
    for (var i = 0; i < leaveappointment.length; i++) {
      if (leaveappointment[i].appointment.appointment.to_time === futuretime) {
        this.setState({
          missedmodeldata: leaveappointment[i],
          missedmodeldiv: true,
          missedcalltime: leaveappointment[i].appointment.appointment.to_time
        });
      }
    }
  };
  initiatecall = async (e) => {
    var data = {
      action: "initiate",
    };
    var appointment = await updateapoointment(data, e.target.id);
    if (appointment === true) {
      this.componentDidMount();
    }
  };
  getnotification = () => {
    setTimeout(() => {
      this.notification();
    }, 60000);
  };
  notification = async () => {
    const { userid } = this.state;
    var mynotification = await axios
      .get(`${process.env.REACT_APP_SERVER}/notification/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (mynotification.length !== 0) {
      var alert = [],
        alertnew = [];
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
        if (mynotification[i].msg === "New Waitingroom") {
          alertnew.push(mynotification[i]);
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
      if (alertnew.length !== 0) {
        toast.info("New Mr Join Your WaitingRoom...", {
          autoClose: 2000,
          transition: Slide,
        });
      }
    }
    setTimeout(() => {
      this.componentDidMount();
    }, 60000);
  };
  joincallnew = (e) => {
    const { userid } = this.state;
    window.open(
      `https://meet.mindinfinitisolutions.com/room/${e.target.id}?&id=${userid}`
    );
  };
  cloasemissed = () => {
    this.setState({
      missedmodeldiv: false
    })
  }
  viewfulldetails = (e) => {
    sessionStorage.setItem("viewprofile", e.target.id);
    window.location.replace("/doctor/fulldetails");
  }
  render() {
    const { leaveappointment, ansermodaldiv, ansermodaldata, role, missedmodeldiv, missedmodeldata } =
      this.state;
    var data = [];
    var count = 9 - leaveappointment.length;
    for (var i = 0; i < count; i++) {
      data.push(count[i]);
    }

    return (
      <>
        {leaveappointment.length !== 0 ? (
          leaveappointment.map((data, index) => (
            <div className="col-md-4" key={index}>
              <div className="card waitingcard" id="liveappointment">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-2 col-2">
                      {data.appointment.info.profile_pic !== null ? (
                        <Avatar
                          src={data.appointment.info.profile_pic}
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
                    <div className="col-sm-6 col-6">
                      <span className="headingwaiting">
                        {data.appointment.info.initial}.{" "}
                        {data.appointment.info.first_name}{" "}
                        {data.appointment.info.last_name}
                      </span>
                      <br />
                      <span className="headingspan">
                        <span className="headingwaiting"></span>
                        {data.appointment.appointment.clinic_name}
                      </span>
                    </div>
                    <div className="col-sm-4 col-4">
                      {data.appointment.appointment.action === "waive" ? (
                        <button
                          className="savebtn btn-sm"
                          id={data.appointment.appointment.appointment_id}
                          onClick={this.videocall}
                        >
                          <BsCameraVideoFill />
                        </button>
                      ) : data.appointment.appointment.action === "initiate" ? (
                        <button
                          className="savebtn btn-sm"
                          id={data.appointment.appointment.appointment_id}
                          onClick={this.callNow}
                        >
                          Call Now
                        </button>
                      ) : data.appointment.appointment.action === "answer" ? (
                        <button
                          className="savebtn btn-sm"
                          id={data.appointment.appointment.meeting_id}
                          onClick={this.joincall}
                        >
                          Join Call
                        </button>
                      ) : data.appointment.appointment.action === "incall" ? (
                        role === "receptionist" ? (
                          <button
                            className="savebtn btn-sm"
                            id={data.appointment.appointment.meeting_id}
                            onClick={this.joincallnew}
                          >
                            Join Call
                          </button>
                        ) : role === "doctor" ? (
                          <button
                            className="savebtn btn-sm"
                            id={data.appointment.appointment.meeting_id}
                            onClick={this.joincallnew}
                          >
                            Join Call
                          </button>
                        ) : (
                          <button
                            className="savebtn btn-sm"
                            id={data.appointment.appointment.appointment_id}
                            onClick={this.waivebtn}
                          >
                            <FaHandPaper />
                            Waive
                          </button>
                        )
                      ) : (
                        <button
                          className="savebtn btn-sm"
                          id={data.appointment.appointment.appointment_id}
                          onClick={this.waivebtn}
                        >
                          <FaHandPaper />
                          Waive
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-3 col-4">
                      <span className="headingspan">
                        <b>Time slot</b>
                      </span>
                      <br />
                      <span className="headingspan">
                        {data.appointment.appointment.meeting_time}
                      </span>
                    </div>
                    {data.appointment.appointment.action === "incall" ? (
                      <div className="col-sm-5 col-5">
                        <span className="headingspan">
                          <b>
                            In Call{" "}
                            {moment
                              .utc(
                                moment(
                                  moment().format("h:mm:ss"),
                                  "HH:mm:ss"
                                ).diff(
                                  moment(
                                    data.appointment.appointment.meeting_ontime,
                                    "HH:mm:ss"
                                  )
                                )
                              )
                              .format("mm")}{" "}
                            m
                          </b>
                        </span>
                        <br />
                      </div>
                    ) : (
                      <div className="col-sm-5 col-5">
                        <span className="headingspan">
                          <b>Waiting for {data.time}m</b>
                        </span>
                        <br />
                        {data.time < 15 ? (
                          <span className="availabletypeshort btn-sm">
                            Short
                          </span>
                        ) : data.time < 30 ? (
                          <span className="availabletypemedium btn-sm">
                            Medium{" "}
                          </span>
                        ) : (
                          <span className="availabletypered btn-sm">Long</span>
                        )}
                      </div>
                    )}
                    <div className="col-sm-4 col-4">
                      <span className="headingspan">
                        <b>Call history</b>
                      </span>
                      <br />
                      <Link className="profilelink" id={data.appointment.appointment.from_id} onClick={this.viewfulldetails}>View Profile</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <img src={Noperson} width="15%" alt="" />
            <h6 className="mt-3">
              <b>There's no one in the meeting room</b>
            </h6>
          </div>
        )}
        {data.length !== 0 && data.length !== 9
          ? data.map((data, index) => (
            <div className="col-md-4 mt-1" key={index}>
              <div className="card waitingcardempty">
                <div className="card-body text-center">
                  <img src={chair} alt="" width="15%" />
                  <h6>
                    <b>Your waiting room is empty</b>
                  </h6>
                </div>
              </div>
            </div>
          ))
          : null}
        {ansermodaldiv === true ? (
          ansermodaldata !== undefined ? (
            <div className="modal mrwaitingroommodal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {ansermodaldata.appointment.info.initial}.{" "}
                      {ansermodaldata.appointment.info.first_name}{" "}
                      {ansermodaldata.appointment.info.last_name} is Calling..
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      id={ansermodaldata.appointment.appointment.appointment_id}
                      onClick={this.initiatecall}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="row">
                        <div className="col-sm-2">
                          {ansermodaldata.appointment.info.profile_pic !==
                            null ? (
                            <Avatar
                              src={ansermodaldata.appointment.info.profile_pic}
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
                        <div className="col-sm-10">
                          <span className="modal-title">
                            {ansermodaldata.appointment.info.initial}.{" "}
                            {ansermodaldata.appointment.info.first_name}{" "}
                            {ansermodaldata.appointment.info.last_name}{" "}
                          </span>
                          <br />
                          <span className="modal-title">
                            {ansermodaldata.appointment.appointment.clinic_name}
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="headingspan">Time Slot</span>
                          <br />
                          <span className="modal-title">
                            {
                              ansermodaldata.appointment.appointment
                                .meeting_time
                            }
                          </span>
                          <br />
                        </div>
                        <div className="mt-3 text-center">
                          <button
                            className="editbtn"
                            style={{ fontSize: "20px" }}
                            id={
                              ansermodaldata.appointment.appointment.meeting_id
                            }
                            onClick={this.joincall}
                          >
                            Join Call
                          </button>
                          <p className="modal-title">
                            <b>Start the meeting by attending the call.</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        ) : null}

        {missedmodeldiv === true ? (
          missedmodeldata !== undefined ? (
            <div className="modal mrwaitingroommodal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      This meeting is gonna end. Do you wanna extend this appointment?
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      id={missedmodeldata.appointment.appointment.appointment_id}
                      onClick={this.cloasemissed}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="row">
                        <div className="col-sm-2">
                          {missedmodeldata.appointment.info.profile_pic !==
                            null ? (
                            <Avatar
                              src={missedmodeldata.appointment.info.profile_pic}
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
                        <div className="col-sm-10">
                          <span className="modal-title">
                            {missedmodeldata.appointment.info.initial}.{" "}
                            {missedmodeldata.appointment.info.first_name}{" "}
                            {missedmodeldata.appointment.info.last_name}{" "}
                          </span>
                          <br />
                          <span className="modal-title">
                            {missedmodeldata.appointment.appointment.clinic_name}
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="headingspan">Time Slot</span>
                          <br />
                          <span className="modal-title">
                            {
                              missedmodeldata.appointment.appointment
                                .meeting_time
                            }
                          </span>
                          <br />
                        </div>
                        <div className="mt-3 text-center">
                          <button
                            className="editbtn"
                            style={{ fontSize: "20px" }}
                            id={
                              missedmodeldata.appointment.appointment.meeting_id
                            }
                            onClick={this.extendcall}
                          >
                            Extend  Call
                          </button>
                          {/* <p>
                            <b>Start the meeting by attending the call.</b>
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        ) : null}
        <ToastContainer />
      </>
    );
  }
}

export default RoomCard;
