import React from "react";
import socialconnection from "../assest/img/social-connection.png";
import { allregister } from "../apis/users";
import axios from "axios";
import moment from "moment";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profilepic from "../assest/img/profilepic.png";
import Avatar from "@mui/material/Avatar";

class NoticeBox extends React.Component {
  constructor(props) {
    super();
    this.state = {
      invitediv: false,
      email: null,
      phone: null,
      myconnectiondata: [],
      userid: null,
      userdata: [],
      mydata: [],
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
    var useridnew = sessionStorage.getItem("userid") || localStorage.getItem("userid");
    for (var a = 0; a < doctorinfo.length; a++) {
      if (doctorinfo[a].userid !== useridnew) {
        myconnectiondata.push({
          info: doctorinfo[a],
          connection: doctorinfoid[a],
        });
      }
    }
    var mydata = await user.filter((data) => {
      return data.userid === useridnew;
    });
    this.setState({
      myconnectiondata: myconnectiondata,
      mydata: mydata,
    });
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

  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  sendinvitebtn = async () => {
    const { email, phone, mydata } = this.state;
    const Alldoctor = await allregister();
    const doctor = await Alldoctor.filter((users) => {
      return users.mobile_number === phone || users.email === email;
    });
    if (doctor.length !== 0) {
      this.setState({
        userdata: doctor,
      });
    } else {
      this.setState({
        userdata: [],
      });
      // eslint-disable-next-line no-restricted-globals
      var alertdata = confirm(
        "This user not using this platform...Are you Invite by Email (or) Phone Number"
      );
      var user = await axios
        .get(`${process.env.REACT_APP_SERVER}/users/`)
        .then((res) => {
          return res.data;
        });
      var mydatanew = await user.filter((data) => {
        return data.userid === this.state.userid;
      });
      if (alertdata === true) {
        this.setState({
          loader: true,
        });
        var data = {
          inviteemail: email,
          username: `${mydatanew[0].initial}. ${mydatanew[0].first_name} ${mydatanew[0].last_name}`,
          user_email: mydatanew[0].email,
          userid: mydatanew[0].userid
        };
        var needata = {
          phone: phone,
          username: `${mydatanew[0].initial}. ${mydatanew[0].first_name} ${mydatanew[0].last_name}`,
          userid: mydatanew[0].userid
        };
        if (email === null) {
          await axios
            .post(`${process.env.REACT_APP_SERVER}/mail/invitationsms`, needata)
            .then((res) => {
              return res.data;
            });
          toast.success("Invite Send Successfully..", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } if (phone === null) {
          await axios
            .post(`${process.env.REACT_APP_SERVER}/mail/invitationmail`, data)
            .then((res) => {
              return res.data;
            });
          toast.success("Invite Send Successfully..", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          await axios
            .post(`${process.env.REACT_APP_SERVER}/mail/invitationsms`, needata)
            .then((res) => {
              return res.data;
            });

          await axios
            .post(`${process.env.REACT_APP_SERVER}/mail/invitationmail`, data)
            .then((res) => {
              return res.data;
            });
          toast.success("Invite Send Successfully..", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }


        // await axios
        //   .get(
        //     `${process.env.REACT_APP_SERVER}/otp/?message=test&number=8056521461&subject=Agile`
        //   )
        //   .then((res) => {
        //     return res.data;
        //   });


      }
    }
  };

  connectbtn = async (e) => {
    const { userid, myconnectiondata } = this.state;
    var checkuser = await myconnectiondata.filter((data) => {
      return data.info.userid === e.target.id;
    });
    if (checkuser.length === 0) {
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
              document
                .getElementById(`${e.target.id}`)
                .classList.add("newstylebtn");
              document.getElementById(`${e.target.id}`).innerHTML = "Connected";
              document.getElementById(`${e.target.id}`).disabled = true;
            }
          }
        }
      }
    } else {
      document.getElementById(`${e.target.id}`).classList.add("newstylebtn");
      document.getElementById(`${e.target.id}`).innerHTML = "Connected";
      document.getElementById(`${e.target.id}`).disabled = true;
    }
  };
  render() {
    const { userdata, loader } = this.state;
    return (
      <>
        <div className="card" style={{ borderColor: "#9F63A9" }}>
          <div className="card-body py-2">
            <div className="row">
              <div className="col-sm-2">
                <img
                  className="inviteimg"
                  src={socialconnection}
                  alt=""
                  width="100%"
                />
              </div>
              <div className="col-sm-7">
                <p className="inviteconten pt-2">
                  Send invites to make Connections with MR to save time and
                  overcrowding at clinic, Company Representatives to build
                  network, Doctors to build peer network.
                </p>
              </div>
              <div className="col-sm-3 mt-3">
                <button
                  className="sendinvitebtn btn-sm m-1"
                  onClick={this.sendinvite}
                >
                  Send Invite Now
                </button>


              </div>
            </div>
          </div>
        </div>
        {this.state.invitediv === true ? (
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5>Send invite to connect via</h5>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mt-3">
                        <label>
                          Email Address <span className="red-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          onChange={(e) => this.handlechange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mt-3">
                        <label>
                          Phone Number <span className="red-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          onChange={(e) => this.handlechange(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-6">
                      {loader === false ? <button className="addbtn" onClick={this.sendinvitebtn}>
                        Send Invite
                      </button> : <button className="addbtn" >
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="sr-only">Loading...</span>
                      </button>}
                    </div>
                    <div className="col-sm-6">
                      <button className="editbtn" onClick={this.cancelinvite}>
                        Cancel
                      </button>
                    </div>
                  </div>
                  {userdata.length !== 0
                    ? userdata.map((data, index) => (
                      <div className="row connectiondiv mt-3" key={index}>
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-sm-4">
                                  <div className="row">
                                    <div className="col-sm-3 col-3">
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
                                    <div className="col-sm-9 col-9">
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
                                  </div>
                                </div>
                                <div className="col-sm-3 col-6">
                                  <h6 className="drname">{data.email}</h6>
                                  <span className="headingspan">
                                    {" "}
                                    {data.city}
                                  </span>
                                </div>
                                <div className="col-sm-5 col-6">
                                  <button
                                    className="editbtn btn-sm m-1"
                                    value={data.userid}
                                    onClick={this.viewfulldetails}
                                  >
                                    View Full Details
                                  </button>
                                  <button
                                    className="addrecep btn-sm m-1"
                                    onClick={this.connectbtn}
                                    id={data.userid}
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
                    : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <ToastContainer />
      </>
    );
  }
}

export default NoticeBox;
