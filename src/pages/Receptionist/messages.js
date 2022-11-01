import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/ReceptionistSidebar";
import "../../assest/css/doctorpage.css";
import axios from "axios";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import moment from "moment";
import { MdArrowBack } from "react-icons/md";
import { newmessage, allmessage } from "../../apis/message";
import {
  updateconnectionfrom,
  updateconnectionzero,
} from "../../apis/connection";
import Doctorlist from "../../Components/recpdoctor";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar } from "@mui/material";
export default class messages extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      users: [],
      myconnection: [],
      connectionid: null,
      msgdisplay: false,
      myconnectiondisplay: true,
      singleconnection: [],
      mymrconnection: [],
      mydrconnection: [],
      mynonmrconnection: [],
      mymrconnectionlength: 0,
      mydrconnectionlength: 0,
      mynonmrconnectionlength: 0,
      myconnectionlength: 0,
    };
  }
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
        users: user,
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
      if (doctorinfo[c].userid !== userid) {
        myconnectiondata.push({
          info: doctorinfo[c],
          connection: doctorinfoid[c],
        });
      }
    }

    var mymrconnection = [],
      mydrconnection = [],
      mynonmrconnection = [];
    for (var a = 0; a < myconnectiondata.length; a++) {
      if (myconnectiondata[a].info.role === "mr") {
        mymrconnection.push(myconnectiondata[a]);
      } else if (myconnectiondata[a].info.role === "doctor") {
        mydrconnection.push(myconnectiondata[a]);
      } else {
        mynonmrconnection.push(myconnectiondata[a]);
      }
    }
    this.setState({
      myconnection: myconnectiondata,
      myconnectionlength: myconnection.length,
      mymrconnection: mymrconnection,
      mydrconnection: mydrconnection,
      mynonmrconnection: mynonmrconnection,
      mymrconnectionlength: mymrconnection.length,
      mydrconnectionlength: mydrconnection.length,
      mynonmrconnectionlength: mynonmrconnection.length,
    });
    setTimeout(() => {
      this.componentDidMount();
    }, 60000);
  };
  mrlist = () => {
    const { mymrconnection } = this.state;
    this.setState({
      myconnection: mymrconnection,
    });
  };
  drlist = () => {
    const { mydrconnection } = this.state;
    this.setState({
      myconnection: mydrconnection,
    });
  };
  nonmrlist = () => {
    const { mynonmrconnection } = this.state;
    this.setState({
      myconnection: mynonmrconnection,
    });
  };
  messagenow = (e) => {
    const { myconnection } = this.state;
    var singleconnection = [];
    for (var a = 0; a < myconnection.length; a++) {
      if (myconnection[a].connection.connection_id === e.target.id) {
        singleconnection.push(myconnection[a]);
      }
    }
    this.setState({
      connectionid: e.target.id,
      msgdisplay: true,
      myconnectiondisplay: false,
      singleconnection: singleconnection,
    });
    setTimeout(() => {
      this.messages();
    }, 2000);
    var data = {
      to: 0,
    };
    updateconnectionzero(data, e.target.id);
  };
  messages = async () => {
    const { connectionid, userid, singleconnection } = this.state;
    var message = await allmessage(connectionid);
    var block_name = "";
    for (var i = 0; i < message.length; i++) {
      if (message[i].fromid === userid) {
        var strDateTime = message[i].date;
        var myDate = new Date(strDateTime);
        var date_ = myDate.toLocaleString();
        var split_time = date_.split(",");
        block_name =
          block_name +
          '<div style="background-color:#9F63A9;border-radius: 20px 0px 20px 20px;;float:right;margin-bottom: 5px;padding-right: 20px;padding: 5px;"><div style="font-size:16px;padding-left:20px;color:white">' +
          message[i].message +
          '<span style="font-size: 12px; padding-left: 10px; color: #ffffffbf;">' +
          split_time[1] +
          '</span></div><div style="float:right;color:white;padding-right:10px;font-size: 12px;padding-left: 20px;"></div></div><br><br>';
      } else {
        var strDateTime1 = message[i].date;
        var myDate1 = new Date(strDateTime1);
        var date_1 = myDate1.toLocaleString();
        var split_time1 = date_1.split(",");
        block_name =
          block_name +
          '<div style="background-color:#5834A4;border-radius: 0px 20px 20px 20px;float:left;margin-bottom: 5px;padding-right: 20px;"><div style="float:left;color:white;padding-left:20px;font-size:13px">' +
          singleconnection[0].info.initial +
          ". " +
          singleconnection[0].info.first_name +
          " " +
          singleconnection[0].info.last_name +
          '</div><br><div style="font-size:16px;padding-left:20px;color:white;">' +
          message[i].message +
          '<span style="font-size: 12px; padding-left: 10px; color: #ffffffbf;">' +
          split_time1[1] +
          '</span></div><div style="color:white;padding-left:20px;font-size:12px"></div></div><br><br><br>';
      }
    }
    document.getElementById("fetching_comments").innerHTML = block_name;
    var mynotification = await axios
      .get(`${process.env.REACT_APP_SERVER}/notification/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (mynotification.length !== 0) {
      for (var a = 0; a < mynotification.length; a++) {
        if (mynotification[a].msg === "New Message") {
          toast.info(
            `You Receive New Message from ${mynotification[a].name}...`,
            {
              autoClose: 2000,
              transition: Slide,
            }
          );
          await axios
            .delete(
              `${process.env.REACT_APP_SERVER}/notification/${mynotification[a].id}`
            )
            .then((res) => {
              return res.data;
            });
        }
      }
    }
    setTimeout(() => {
      this.messages();
    }, 60000);
  };
  backbtn = () => {
    window.location.reload();
  };
  sendmessage = async () => {
    const { firstname, lastname, initial } = this.state;
    document.getElementById("fetching_comments").scrollTop =
      document.getElementById("fetching_comments").scrollHeight;
    var message = document.getElementById("newmsginput").value;
    const { singleconnection, connectionid, userid } = this.state;
    if (message.length !== 0) {
      var data = {
        fromid: userid,
        toid: singleconnection[0].info.userid,
        connectionid: connectionid,
        message: message,
        read_status: "false",
      };
      var informationdata = {
        userid: singleconnection[0].info.userid,
        msg: "New Message",
        name: `${initial}. ${firstname} ${lastname}`,
      };
      var newmsg = await newmessage(data);
      if (newmsg === true) {
        await axios
          .post(
            `${process.env.REACT_APP_SERVER}/notification/information`,
            informationdata
          )
          .then((res) => {
            return res.data;
          });
        this.messages();
        updateconnectionfrom(connectionid);
        document.getElementById("newmsginput").value = "";
      }
    }
  };
  searchname = (e) => {
    const { myconnection } = this.state;
    if (e.target.value.length !== 0) {
      var filterconnection = [];
      for (var i = 0; i < myconnection.length; i++) {
        if (
          myconnection[i].info.first_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          filterconnection.push(myconnection[i]);
        }
      }
      this.setState({
        myconnection: filterconnection,
      });
    } else {
      this.componentDidMount();
    }
  };
  viewfulldetails = (e) => {
    sessionStorage.setItem("viewprofile", e.target.value);
    window.location.replace("/mr/fulldetails");
  };
  render() {
    const {
      myconnection,
      msgdisplay,
      myconnectiondisplay,
      singleconnection,
      mymrconnectionlength,
      mydrconnectionlength,
      mynonmrconnectionlength,
      myconnectionlength,
    } = this.state;
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <Doctorlist />
          <div className="mt-2">
            <h5>Messages</h5>
          </div>
          <div className="row">
            <div className="col-md-8">
              {myconnectiondisplay === true ? (
                <div className="row mb-2 mt-5">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Name"
                      onChange={(e) => this.searchname(e)}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="buttondiv">
                      <span
                        className="flexNotification"
                        onClick={this.componentDidMount}
                      >
                        {" "}
                        All{" "}
                        <Avatar style={{ backgroundColor: "#9F63A9" }}>
                          {myconnectionlength > 99 ? "99+" : myconnectionlength}
                        </Avatar>
                      </span>
                    </div>
                    <div className="buttondiv mt-2">
                      <span className="flexNotification" onClick={this.mrlist}>
                        {" "}
                        Medical Representatives{" "}
                        <Avatar style={{ backgroundColor: "#9F63A9" }}>
                          {mymrconnectionlength > 99
                            ? "99+"
                            : mymrconnectionlength}
                        </Avatar>
                      </span>
                    </div>
                    <div className="buttondiv mt-2">
                      <span className="flexNotification" onClick={this.drlist}>
                        Doctors{" "}
                        <Avatar style={{ backgroundColor: "#9F63A9" }}>
                          {mydrconnectionlength > 99
                            ? "99+"
                            : mydrconnectionlength}
                        </Avatar>
                      </span>
                    </div>
                    <div className="buttondiv mt-2">
                      <span
                        className="flexNotification"
                        onClick={this.nonmrlist}
                      >
                        Company Representatives
                        <Avatar style={{ backgroundColor: "#9F63A9" }}>
                          {mynonmrconnectionlength > 99
                            ? "99+"
                            : mynonmrconnectionlength}
                        </Avatar>
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {myconnectiondisplay === true
                ? myconnection.length !== 0
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
                                  <h6 className="drname">
                                    Connected on{" "}
                                    {moment(
                                      connectiondata.connection.approved_date
                                    ).format("MMM Do YYYY")}{" "}
                                  </h6>
                                </div>
                                <div className="col-sm-4 col-6 mt-3">
                                  <button
                                    className="editbtn btn-sm m-1"
                                    id={connectiondata.connection.connection_id}
                                    onClick={this.messagenow}
                                  >
                                    Message Now{" "}
                                    {connectiondata.connection.to ===
                                    "0" ? null : (
                                      <span className="countspansidemsg">
                                        {connectiondata.connection.to}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : "No User Found"
                : null}
            </div>
            {msgdisplay === true ? (
              <div className="col-md-8">
                <div className="card">
                  {singleconnection[0] !== undefined ? (
                    <div className="card-header">
                      <div className="row">
                        <div className="col-sm-1 col-1">
                          <span onClick={this.backbtn}>
                            {" "}
                            <MdArrowBack />
                          </span>
                        </div>
                        <div className="col-sm-1 col-2">
                          <img
                            className="profilepiccard"
                            src={singleconnection[0].info.profile_pic}
                            alt=""
                            width="80%"
                          />
                        </div>
                        <div className="col-sm-7 col-7">
                          <span className="drname">
                            {singleconnection[0].info.initial}.{" "}
                            {singleconnection[0].info.first_name}{" "}
                            {singleconnection[0].info.last_name}
                          </span>
                          <br />
                          <span className="headingspan">
                            {" "}
                            {singleconnection[0].info.role === "doctor"
                              ? "Doctor"
                              : singleconnection[0].info.role === "mr"
                              ? "Medical Representative"
                              : singleconnection[0].info.role === "nonmr"
                              ? "Non Mr"
                              : "Receptionist"}
                          </span>
                        </div>
                        <div className="col-sm-3 col-2 mt-3 livetablelabel">
                          <button
                            className="editbtn btn-sm m-1"
                            id={singleconnection[0].info.userid}
                            onClick={this.Viewprofile}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="card-body">
                    <main className="msger-chat" id="fetching_comments"></main>
                  </div>
                  <div className="card-footer text-muted">
                    <div className="row">
                      <div className="messageAction">
                        <input
                          type="text"
                          className="form-control"
                          id="newmsginput"
                          placeholder="Enter your message"
                        />
                        <div className="">
                          <button
                            className="editbtn btn-sm m-1"
                            onClick={this.sendmessage}
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="bottomnavigation">
          <Navigation />
        </div>
        {/* <SpeedDial /> */}
        <ToastContainer />
      </div>
    );
  }
}
