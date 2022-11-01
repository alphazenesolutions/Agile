import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/ReceptionistSidebar";
import qrcodeimg from "../../assest/img/qrcode.png";
import "../../assest/css/doctorpage.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import moment from "moment";
import NoticeBox from "../../Components/noticebox-connection";
import Navigation from "../../Components/FixedBottomNavigationRecep";
import Doctorlist from "../../Components/recpdoctor";
import { Avatar } from "@mui/material";

export default class connection extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      myconnection: [],
      alluserconnection: [],
      searchname: null,
      myconnectionlength: 0,
      drconnection: [],
      mrconnection: [],
      drconnectionlength: 0,
      mrconnectionlength: 0,
      profileurl: null,
      invitediv: false,
      connectionid: [],
      users: [],
      onclickuser: [],
      connectionrequest: [],
      qrcode: null,
    };
  }
  handlechangesearch = async (e) => {
    const { myconnection, userid, users } = this.state;
    if (e.target.value.length !== 0) {
      if (myconnection.length !== 0) {
        var myuser = [];
        for (var i = 0; i < myconnection.length; i++) {
          for (var j = 0; j < users.length; j++) {
            if (
              users[j].userid === myconnection[i].info.userid &&
              users[j].userid !== userid
            ) {
              myuser.push(users[j].userid);
            }
          }
        }
        for (i = 0; i < myuser.length; i++) {
          // eslint-disable-next-line no-loop-func
          var munew = users.filter((data) => {
            return data.userid !== myuser[i];
          });
          var alluserdata = [];
          for (j = 0; j < munew.length; j++) {
            if (
              munew[j].first_name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              munew[j].last_name
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
            ) {
              if (munew[j].userid !== userid) {
                alluserdata.push(munew[j]);
              }
            }
          }
          let unique = [...new Set(alluserdata)];
          this.setState({
            alluserconnection: unique,
          });
        }
      } else {
        alluserdata = [];
        for (i = 0; i < users.length; i++) {
          if (users[i].userid !== userid) {
            if (
              users[i].first_name
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              users[i].last_name
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
            ) {
              alluserdata.push(users[i]);
            }
          }
        }
        this.setState({
          alluserconnection: alluserdata,
        });
      }
    } else {
      this.setState({
        alluserconnection: [],
      });
    }
  };
  handlechangelocaton = async (e) => {
    const { userid } = this.state;
    var alluser = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
    var alluserdata = [];
    for (var i = 0; i < alluser.length; i++) {
      if (alluser[i].userid !== userid) {
        if (alluser[i].city !== null) {
          if (
            alluser[i].city.toLowerCase().includes(e.target.value.toLowerCase())
          ) {
            if (alluser[i].userid !== userid) {
              alluserdata.push(alluser[i]);
            }
          }
        }
      }
    }
    this.setState({
      alluserconnection: alluserdata,
    });
  };

  componentDidMount = async () => {
    var userid1 = sessionStorage.getItem("doctorid");
    this.setState({
      userid: userid1,
    });
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
    var finaluserlist = await user.filter((data) => {
      return (
        data.role === "doctor" || data.role === "mr" || data.role === "nonmr"
      );
    });
    var connection = await axios
      .get(`${process.env.REACT_APP_SERVER}/connection/connect`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`)
      .then((res) => {
        return res.data;
      });
    var doctordata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${userid1}`)
      .then((res) => {
        return res.data;
      });
    if (userdata.length !== 0) {
      this.setState({
        users: finaluserlist,
        firstname: userdata[0].first_name,
        initial: userdata[0].initial,
        number: userdata[0].mobile_number,
        degree: userdata[0].degree,
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        landline: userdata[0].landline_number,
        specility: userdata[0].speciality,
        profileurl: userdata[0].profile_pic,
      });
    }
    this.setState({
      qrcode: doctordata[0].qrcode,
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
    var doctorlist = [],
      mrlist = [];
    for (i = 0; i < doctorinfo.length; i++) {
      if (doctorinfo[i].userid !== userid) {
        myconnectiondata.push({
          info: doctorinfo[i],
          connection: doctorinfoid[i],
        });
      }
    }
    for (i = 0; i < myconnectiondata.length; i++) {
      if (myconnectiondata[i].info.role === "mr") {
        mrlist.push(myconnectiondata[i]);
      } else {
        doctorlist.push(myconnectiondata[i]);
      }
    }
    var connectionid = [],
      connectionrequest = [];
    for (var z = 0; z < myconnectiondata.length; z++) {
      if (myconnectiondata[z].connection.from_id === userid) {
        connectionrequest.push(myconnectiondata[z]);
      }
      connectionid.push(myconnectiondata[z].connection);
    }
    this.setState({
      myconnection: myconnectiondata,
      myconnectionlength: myconnection.length,
      drconnection: doctorlist,
      mrconnection: mrlist,
      drconnectionlength: doctorlist.length,
      mrconnectionlength: mrlist.length,
      connectionid: connectionid,
      connectionrequest: connectionrequest,
    });
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
      for (var i = 0; i < mynotification.length; i++) {
        if (mynotification[i].msg === "New Connection") {
          toast.info("You Receive New Connection...", {
            autoClose: 2000,
            transition: Slide,
          });
          await axios
            .delete(
              `${process.env.REACT_APP_SERVER}/notification/${mynotification[i].id}`
            )
            .then((res) => {
              return res.data;
            });
        }
      }
    }
    setTimeout(() => {
      this.componentDidMount();
    }, 2000);
  };

  connectbtn = async (e) => {
    const { userid } = this.state;
    var data = {
      from_id: userid,
      to_id: e.target.id,
      approved_date: moment().format("MM-DD-YYYY"),
    };
    var nodata = {
      userid: [userid, e.target.id],
    };
    var notimsg = {
      fromid: userid,
      toid: e.target.id,
      notification_from: "Connection",
      tablename: "Connection",
      msg: "New",
    };
    var informationdata = {
      userid: e.target.id,
      msg: "New Connection",
    };
    var connectiondata = await axios
      .post(`${process.env.REACT_APP_SERVER}/connection`, data)
      .then((res) => {
        console.log(res.data);
        return res.data;
      });
    if (connectiondata === true) {
      console.log("Design Changed...");
      document.getElementById(`${e.target.id}`).classList.add("newstylebtn");
      document.getElementById(`${e.target.id}`).innerHTML = "Connected";
      document.getElementById(`${e.target.id}`).disabled = true;
    }
    if (connectiondata === true) {
      var notification = await axios
        .post(`${process.env.REACT_APP_SERVER}/notification`, nodata)
        .then((res) => {
          console.log(res.data);
          return res.data;
        });
      if (notification === true) {
        var notificationmsg = await axios
          .post(
            `${process.env.REACT_APP_SERVER}/notification/msg/create`,
            notimsg
          )
          .then((res) => {
            console.log(res.data);
            return res.data;
          });
        if (notificationmsg === true) {
          await axios
            .post(
              `${process.env.REACT_APP_SERVER}/notification/information`,
              informationdata
            )
            .then((res) => {
              console.log(res.data);
              return res.data;
            });
        }
      }
    }
  };

  doctorlist = () => {
    const { drconnection } = this.state;
    this.setState({
      myconnection: drconnection,
    });
    document.getElementById("drlist").classList.add("mystylediv");
    document.getElementById("myconnection").classList.remove("mystylediv");
    document.getElementById("mrlist").classList.remove("mystylediv");
  };

  mrlist = () => {
    const { mrconnection } = this.state;
    this.setState({
      myconnection: mrconnection,
    });
    document.getElementById("mrlist").classList.add("mystylediv");
    document.getElementById("myconnection").classList.remove("mystylediv");
    document.getElementById("drlist").classList.remove("mystylediv");
  };
  myconnection = () => {
    this.componentDidMount();
    document.getElementById("myconnection").classList.add("mystylediv");
    document.getElementById("mrlist").classList.remove("mystylediv");
    document.getElementById("drlist").classList.remove("mystylediv");
  };

  handlechangecollection = (e) => {
    const { myconnection } = this.state;
    if (e.target.value !== "") {
      var data = [];
      for (var i = 0; i < myconnection.length; i++) {
        if (
          myconnection[i].info.first_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          myconnection[i].info.last_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          data.push(myconnection[i]);
        }
      }
      this.setState({
        myconnection: data,
      });
    } else {
      this.setState({
        myconnection: myconnection,
      });
    }
  };
  handlechangesort = (e) => {
    if (e.target.value === "Assending") {
      const { myconnection } = this.state;
      var data = [];
      for (var i = 0; i < myconnection.length; i++) {
        data.push(myconnection[i]);
      }
      var finallist = data.sort((a, b) => {
        if (a.info.first_name.toLowerCase() > b.info.first_name.toLowerCase())
          return -1;
        if (a.info.first_name.toLowerCase() < b.info.first_name.toLowerCase())
          return 1;
        return 0;
      });
      this.setState({
        myconnection: finallist,
      });
    } else {
      const { myconnection } = this.state;
      var datanew = [];
      for (var c = 0; c < myconnection.length; c++) {
        datanew.push(myconnection[c]);
      }
      var finallistnew = datanew.sort((a, b) => {
        if (a.info.first_name.toLowerCase() < b.info.first_name.toLowerCase())
          return -1;
        if (a.info.first_name.toLowerCase() > b.info.first_name.toLowerCase())
          return 1;
        return 0;
      });
      this.setState({
        myconnection: finallistnew,
      });
    }
  };
  viewfulldetails = (e) => {
    sessionStorage.setItem("viewprofile", e.target.value);
    window.location.replace("/doctor/fulldetails");
  };
  sendinvite = () => {
    this.setState({
      invitediv: true,
    });
  };
  cancelinvite = () => {
    this.setState({
      invitediv: false,
    });
  };
  declinebtn = async (e) => {
    var delectconnection = await axios
      .delete(`${process.env.REACT_APP_SERVER}/connection/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (delectconnection === true) {
      this.componentDidMount();
    }
  };
  render() {
    const {
      myconnection,
      alluserconnection,
      drconnectionlength,
      mrconnectionlength,
      connectionrequest,
      qrcode,
    } = this.state;
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <Doctorlist />
          <div className="mt-5">
            <h4>Connection</h4>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-2 col-3">
                  {qrcode === null ? (
                    <img
                      src={qrcodeimg}
                      alt=""
                      height="85px"
                      width="85px"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    />
                  ) : (
                    <img
                      src={qrcode}
                      alt=""
                      height="85px"
                      width="85px"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    />
                  )}
                </div>
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4>Scan QR code to get connected</h4>

                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body qrcoddee text-center">
                        {qrcode === null ? (
                          <img src={qrcodeimg} alt="" />
                        ) : (
                          <img src={qrcode} alt="" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-10 col-9">
                  <NoticeBox />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6 col-6">
              <input
                type="text"
                className="form-control"
                name="searchname"
                placeholder="Search With Name, Company.."
                onChange={(e) => this.handlechangesearch(e)}
              />
            </div>
            {/* <div className="col-md-3 col-6">
                            <input type="text" className="form-control" name="searchname" placeholder="Search Location" onChange={(e) => this.handlechangelocaton(e)} />
                        </div> */}
            <div className="col-md-2 col-6">
              <select
                className="form-control"
                onChange={(e) => this.handlechangesort(e)}
              >
                <option>Sort By:</option>
                <option value="Assending">Ascending</option>
                <option value="Dessending">Descending</option>
              </select>
            </div>
          </div>
          {this.state.invitediv === true ? (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5>Send invite to connect via</h5>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mt-3">
                          <label>
                            Email Address{" "}
                            <span className="red-asterisk">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mt-3">
                          <label>
                            Email Address{" "}
                            <span className="red-asterisk">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-sm-6">
                        <button className="addbtn">Send Invite</button>
                      </div>
                      <div className="col-sm-6">
                        <button className="editbtn" onClick={this.cancelinvite}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="row mt-4">
            {alluserconnection.length === 0 ? (
              <div className="col-md-8">
                {myconnection.length !== 0
                  ? myconnection.map((connectiondata, index) => (
                    <div className="row connectiondiv" key={index}>
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <div className="col-sm-3 col-3">
                                    <img
                                      className="profilepiccard"
                                      src={connectiondata.info.profile_pic}
                                      alt=""
                                      width="80%"
                                    />
                                  </div>
                                  <div className="col-sm-9 col-9">
                                    <span className="drname">
                                      {connectiondata.info.initial}.{" "}
                                      {connectiondata.info.first_name}{" "}
                                      {connectiondata.info.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {" "}
                                      {connectiondata.info.role === "doctor"
                                        ? "Doctor"
                                        : connectiondata.info.role === "mr"
                                          ? "Medical Representative"
                                          : connectiondata.info.role === "nonmr"
                                            ? "Non Mr"
                                            : "Receptionist"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4 col-4 mt-3">
                                <h6 className="connectiontime">
                                  Connected on{" "}
                                  {moment(
                                    connectiondata.connection.approved_date
                                  ).format("MMM Do YYYY")}{" "}
                                </h6>
                                {/* <span className="headingspan"> {moment(connectiondata.connection.approved_date).format("MMM Do YYYY")}</span> */}
                              </div>
                              <div className="col-sm-3 col-6 mt-3">
                                <button
                                  className="editbtn btn-sm m-1"
                                  id={connectiondata.info.userid}
                                  onClick={this.viewfulldetails}
                                >
                                  View Full Details
                                </button>
                              </div>
                              <div className="col-sm-1 col-1 mt-3">
                                <div className="dropdown dropright">
                                  <span className="" data-toggle="dropdown">
                                    <FiMoreHorizontal />
                                  </span>
                                  <div className="dropdown-menu">
                                    <a
                                      className="dropdown-item declinebtn"
                                      href="##"
                                      onClick={this.declinebtn}
                                      id={
                                        connectiondata.connection
                                          .connection_id
                                      }
                                    >
                                      Decline
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  : "No Connection Found"}
              </div>
            ) : null}

            {alluserconnection.length !== 0 ? (
              <div className="col-md-8">
                {alluserconnection.length !== 0
                  ? alluserconnection.map((connectiondata, index) => (
                    <div className="row connectiondiv" key={index}>
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <div className="col-sm-3 col-3">
                                    <img
                                      className="profilepiccard"
                                      src={connectiondata.profile_pic}
                                      alt=""
                                      width="80%"
                                    />
                                  </div>
                                  <div className="col-sm-9 col-9">
                                    <span className="drname">
                                      {connectiondata.initial}.{" "}
                                      {connectiondata.first_name}{" "}
                                      {connectiondata.last_name}
                                    </span>
                                    <br />
                                    <span className="headingspan">
                                      {" "}
                                      {connectiondata.role === "doctor"
                                        ? "Doctor"
                                        : connectiondata.role === "mr"
                                          ? "Medical Representative"
                                          : connectiondata.role === "nonmr"
                                            ? "Non Mr"
                                            : "Receptionist"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-3 col-6 mt-3">
                                <h6 className="drname">
                                  {connectiondata.email}
                                </h6>
                                <span className="headingspan">
                                  {" "}
                                  {connectiondata.city}
                                </span>
                              </div>
                              <div className="col-sm-5 col-6 mt-3">
                                <button className="editbtn btn-sm m-1"
                                  id={connectiondata.info.userid} onClick={this.viewfulldetails}>
                                  View Full Details
                                </button>
                                <button
                                  className="addrecep btn-sm m-1"
                                  onClick={this.connectbtn}
                                  id={connectiondata.userid}
                                >
                                  Connect
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  : "No User"}
              </div>
            ) : null}

            <div className="col-md-4 connectionsidediv">
              <div className="buttondivnew">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search By Name"
                  onChange={(e) => this.handlechangecollection(e)}
                />
              </div>
              {/* <div className="buttondiv mt-2">
                                <span>Connection Requests<span className="countdiv">{connectionrequest.length}</span></span>
                            </div> */}
              <div className="buttondiv mt-2" id="myconnection">
                <span className="flexNotification" onClick={this.myconnection}>
                  My Connections{" "}
                  <Avatar style={{ backgroundColor: "#9F63A9" }}>
                    {this.state.myconnectionlength > 99
                      ? "99+"
                      : this.state.myconnectionlength}
                  </Avatar>
                </span>
              </div>
              <div className="buttondiv mt-2" id="mrlist">
                <span className="flexNotification" onClick={this.mrlist}>
                  Medical Representatives{" "}
                  <Avatar style={{ backgroundColor: "#9F63A9" }}>
                    {mrconnectionlength > 99 ? "99+" : mrconnectionlength}
                  </Avatar>
                </span>
              </div>
              <div className="buttondiv mt-2" id="drlist">
                <span className="flexNotification" onClick={this.doctorlist}>
                  Doctors
                  <Avatar style={{ backgroundColor: "#9F63A9" }}>
                    {drconnectionlength > 99 ? "99+" : drconnectionlength}
                  </Avatar>
                </span>
              </div>
              <div className="buttondiv mt-2">
                <span className="flexNotification">
                  Company Representatives
                  <Avatar style={{ backgroundColor: "#9F63A9" }}>
                    {drconnectionlength > 99 ? "99+" : drconnectionlength}
                  </Avatar>
                </span>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <div className="bottomnavigation">
          <Navigation />
        </div>
      </div>
    );
  }
}
