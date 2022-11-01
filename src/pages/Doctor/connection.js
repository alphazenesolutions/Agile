import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/DrSidebar";
import qrcodeimg from "../../assest/img/qrcode.png";
import "../../assest/css/doctorpage.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import moment from "moment";
import NoticeBox from "../../Components/noticebox-connection";
import Navigation from "../../Components/FixedBottomNavigationDr";
import Avatar from "@mui/material/Avatar";
import profilepic from "../../assest/img/profilepic.png";
import Advertisment from "../../Components/Advertisment/Advertisment";
import spinner from "../../assest/img/agile.png";

import {
  newnotification,
  newnotificationmsgnew,
} from "../../apis/notification";
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
      nonmrlist: [],
      mrconnection: [],
      drconnectionlength: 0,
      mrconnectionlength: 0,
      profileurl: null,
      invitediv: false,
      connectionid: [],
      users: [],
      onclickuser: [],
      role: sessionStorage.getItem("role") || localStorage.getItem("role"),
      qrcode: null,
      connectionrequest: [],
      loading: true,
      loader: false,
      id: null,
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
          if (unique.length !== 0) {
            this.setState({
              alluserconnection: unique,
            });
          } else {
            this.setState({
              alluserconnection: unique,
              myconnection: []
            });
          }

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
        if (alluserdata.length !== 0) {
          this.setState({
            alluserconnection: alluserdata,
          });
        } else {
          this.setState({
            alluserconnection: alluserdata,
            myconnection: []
          });
        }

      }
    } else {
      this.setState({
        alluserconnection: [],
        myconnection: []
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
    if (alluserdata.length !== 0) {
      this.setState({
        alluserconnection: alluserdata,
      });
    } else {
      this.setState({
        alluserconnection: alluserdata,
        myconnection: []
      });
    }

  };

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
        qrcode: userdata[0].qrcode,
      });
    }

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
    for (var x = 0; x < myconnectiondata.length; x++) {
      if (myconnectiondata[x].connection.from_id === userid) {
        connectionrequest.push(myconnectiondata[x]);
      }
      connectionid.push(myconnectiondata[x].connection);
    }
    var nonmrlist = await myconnectiondata.filter((data) => {
      return data.info.role === "nonmr";
    });
    this.setState({
      myconnection: myconnectiondata,
      myconnectionlength: myconnection.length,
      drconnection: doctorlist,
      nonmrlist: nonmrlist,
      mrconnection: mrlist,
      drconnectionlength: doctorlist.length,
      mrconnectionlength: mrlist.length,
      connectionid: connectionid,
      connectionrequest: connectionrequest,
    });
    setTimeout(() => {
      this.notification();
    }, 10000);
    const { match } = this.props;
    if (match.params.touserid !== undefined) {
      this.connectbtnqrcode(match.params.touserid);
      sessionStorage.setItem("needconnect", match.params.touserid);
    }
    document.getElementById("myconnection").classList.add("mystylediv");

    this.setState({
      loading: false,
    });
    var needconnect = sessionStorage.getItem("needconnect");
    if (needconnect !== null) {
      var checkconnection = await myconnectiondata.filter((data) => {
        return data.info.userid === needconnect;
      });
      if (checkconnection.length === 0) {
        var data = {
          from_id: userid,
          to_id: needconnect,
          approved_date: moment().format("MM-DD-YYYY"),
        };
        var connectiondata = await axios
          .post(`${process.env.REACT_APP_SERVER}/connection`, data)
          .then((res) => {
            return res.data;
          });
        if (connectiondata === true) {
          toast.success("The User Connected with you...", {
            autoClose: 2000,
            transition: Slide,
          });
          const { role } = this.state;
          setTimeout(() => {
            window.location.replace(`/${role}/connection`);
          }, 2000);
        }
      } else {
        sessionStorage.removeItem("needconnect");
      }
    }
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
  connectbtnqrcode = async (e) => {
    const { userid, myconnection, role } = this.state;
    if (userid !== null) {
      if (myconnection.length !== 0) {
        var checkconnection = await myconnection.filter((data) => {
          return data.info.userid === e;
        });
        if (checkconnection.length === 0) {
          var data = {
            from_id: userid,
            to_id: e,
            approved_date: moment().format("MM-DD-YYYY"),
          };
          var nodata = {
            userid: [userid, e],
          };
          var notimsg = {
            fromid: userid,
            toid: e,
            notification_from: "Connection",
            tablename: "Connection",
            msg: "New",
          };
          var informationdata = {
            userid: e,
            msg: "New Connection",
          };
          var connectiondata = await axios
            .post(`${process.env.REACT_APP_SERVER}/connection`, data)
            .then((res) => {
              return res.data;
            });
          if (connectiondata === true) {
            var notification = await axios
              .post(`${process.env.REACT_APP_SERVER}/notification`, nodata)
              .then((res) => {
                return res.data;
              });
            if (notification === true) {
              var notificationmsg = await axios
                .post(
                  `${process.env.REACT_APP_SERVER}/notification/msg/create`,
                  notimsg
                )
                .then((res) => {
                  return res.data;
                });
              if (notificationmsg === true) {
                var information = await axios
                  .post(
                    `${process.env.REACT_APP_SERVER}/notification/information`,
                    informationdata
                  )
                  .then((res) => {
                    return res.data;
                  });
                if (information === true) {
                  toast.success("The User Connected with you...", {
                    autoClose: 2000,
                    transition: Slide,
                  });
                  setTimeout(() => {
                    window.location.replace(`/${role}/connection`);
                  }, 2000);
                }
              }
            }
            sessionStorage.removeItem("needconnect");
          }
        } else {
          toast.error("The User Already Connected with you...", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.replace(`/${role}/connection`);
          }, 2000);
        }
      } else {
        var datanew = {
          from_id: userid,
          to_id: e,
          approved_date: moment().format("MM-DD-YYYY"),
        };
        var nodatanew = {
          userid: [userid, e],
        };
        var notimsgnew = {
          fromid: userid,
          toid: e,
          notification_from: "Connection",
          tablename: "Connection",
          msg: "New",
        };
        var informationdatanew = {
          userid: e,
          msg: "New Connection",
        };
        var connectiondatanew = await axios
          .post(`${process.env.REACT_APP_SERVER}/connection`, datanew)
          .then((res) => {
            return res.data;
          });
        if (connectiondatanew === true) {
          var notificationnew = await axios
            .post(`${process.env.REACT_APP_SERVER}/notification`, nodatanew)
            .then((res) => {
              return res.data;
            });
          if (notificationnew === true) {
            var notificationmsgnew = await axios
              .post(
                `${process.env.REACT_APP_SERVER}/notification/msg/create`,
                notimsgnew
              )
              .then((res) => {
                return res.data;
              });
            if (notificationmsgnew === true) {
              var informationnew = await axios
                .post(
                  `${process.env.REACT_APP_SERVER}/notification/information`,
                  informationdatanew
                )
                .then((res) => {
                  return res.data;
                });
              if (informationnew === true) {
                toast.success("The User Connected with you...", {
                  autoClose: 2000,
                  transition: Slide,
                });
                setTimeout(() => {
                  window.location.replace(`/${role}/connection`);
                }, 2000);
              }
            }
          }
        }
      }
    } else {
      toast.error("Please Login...", {
        autoClose: 2000,
        transition: Slide,
      });
      setTimeout(() => {
        window.location.replace("/");
      }, 1000);
    }
  };

  connectbtn = async (e) => {
    this.setState({
      loader: true,
      id: e.target.id,
    });
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
        return res.data;
      });
    if (connectiondata === true) {
      document.getElementById(`${e.target.id}`).classList.add("newstylebtn");
      document.getElementById(`${e.target.id}`).innerHTML = "Connected";
      document.getElementById(`${e.target.id}`).disabled = true;
    }
    if (connectiondata === true) {
      var notification = await axios
        .post(`${process.env.REACT_APP_SERVER}/notification`, nodata)
        .then((res) => {
          return res.data;
        });
      if (notification === true) {
        var notificationmsg = await axios
          .post(
            `${process.env.REACT_APP_SERVER}/notification/msg/create`,
            notimsg
          )
          .then((res) => {
            return res.data;
          });
        if (notificationmsg === true) {
          await axios
            .post(
              `${process.env.REACT_APP_SERVER}/notification/information`,
              informationdata
            )
            .then((res) => {
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
    document.getElementById("nonmrlist").classList.remove("mystylediv");
  };
  nonmrlist = async () => {
    const { myconnection } = this.state;
    var nonmrlist = await myconnection.filter((data) => {
      return data.info.role === "nonmr";
    });
    this.setState({
      myconnection: nonmrlist,
    });

    document.getElementById("nonmrlist").classList.add("mystylediv");
    document.getElementById("mrlist").classList.remove("mystylediv");
    document.getElementById("drlist").classList.remove("mystylediv");
    document.getElementById("myconnection").classList.remove("mystylediv");
  };

  mrlist = () => {
    const { mrconnection } = this.state;
    this.setState({
      myconnection: mrconnection,
    });
    document.getElementById("mrlist").classList.add("mystylediv");
    document.getElementById("myconnection").classList.remove("mystylediv");
    document.getElementById("drlist").classList.remove("mystylediv");
    document.getElementById("nonmrlist").classList.remove("mystylediv");
  };
  myconnection = () => {
    this.componentDidMount();
    document.getElementById("myconnection").classList.add("mystylediv");
    document.getElementById("mrlist").classList.remove("mystylediv");
    document.getElementById("drlist").classList.remove("mystylediv");
    document.getElementById("nonmrlist").classList.remove("mystylediv");
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
      for (var k = 0; k < myconnection.length; k++) {
        datanew.push(myconnection[k]);
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
    sessionStorage.setItem("viewprofile", e.target.id);
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
      nonmrlist,
      loading,
      loader,
      id,
    } = this.state;

    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
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
                  className="modal fade mo"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className=" modal-content">
                      <div className="modal-header butonClose">
                        <h4>Scan QR code to get connected</h4>

                        <button
                          type="button"
                          className="btn-close "
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body qrcode text-center">
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

          <div className="row mt-4">
            {alluserconnection.length === 0 ? (
              <div className="col-md-8">
                {myconnection.length !== 0
                  ? myconnection.map((connectiondata, index) => (
                    <div className="row connectiondiv" key={index}>
                      {!loading && (
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-sm-4">
                                  <div className="DislayFelx">
                                    <div className="col-sm-3 col-3">
                                      {connectiondata.info.profile_pic !==
                                        null ? (
                                        <Avatar
                                          src={
                                            connectiondata.info.profile_pic
                                          }
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
                                            : connectiondata.info.role ===
                                              "nonmr"
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
                                  <span className="headingspan">
                                    {" "}
                                    {moment(
                                      connectiondata.connection.approved_date
                                    ).format("MMM Do YYYY")}
                                  </span>
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
                      )}
                    </div>
                  ))
                  : "No Connection Found"}
                {loading && (
                  <center className="spinner">
                    {/* <LoadingButton loading variant="outlined">
                      Submit
                    </LoadingButton> */}
                    <img src={spinner} alt="" />
                  </center>
                )}
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
                                    {connectiondata.profile_pic !== null ? (
                                      <Avatar
                                        src={connectiondata.profile_pic}
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
                                {loader === false ? (
                                  <button
                                    className="addrecep btn-sm m-1"
                                    onClick={this.connectbtn}
                                    id={connectiondata.userid}
                                  >
                                    Connect
                                  </button>
                                ) : id === connectiondata.userid ? (
                                  <button
                                    className="addrecep btn-sm m-1"
                                    id={connectiondata.userid}
                                  >
                                    <span
                                      class="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    <span class="sr-only">Loading...</span>
                                  </button>
                                ) : (
                                  <button
                                    className="addrecep btn-sm m-1"
                                    onClick={this.connectbtn}
                                    id={connectiondata.userid}
                                  >
                                    Connect
                                  </button>
                                )}
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

              <div className="buttondiv mt-2">
                <span className="flexNotification">
                  Connection Requests
                  <Avatar style={{ backgroundColor: "#9F63A9" }}>
                    {connectionrequest.length > 99
                      ? "99+"
                      : connectionrequest.length}
                  </Avatar>
                </span>
              </div>
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
              <div className="buttondiv mt-2" id="nonmrlist">
                <span className="flexNotification" onClick={this.nonmrlist}>
                  Company Representatives{" "}
                  {/* <span className="countdiv">{nonmrlist.length}</span> */}
                  <Avatar style={{ backgroundColor: "#9F63A9" }}>
                    {nonmrlist.length > 99 ? "99+" : nonmrlist.length}
                  </Avatar>
                </span>
              </div>
            </div>
          </div>
          <div className="row ml-2 mt-5 text-center">
            <Advertisment />
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
