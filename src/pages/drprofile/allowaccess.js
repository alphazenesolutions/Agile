import React, { Component } from "react";
import Sidebar from "../../Components/sidebar";
import "../../assest/css/profile.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default class allowaccess extends Component {
  constructor(props) {
    super();
    this.state = {
      accessform: false,
      accessbtn: true,
      userid: null,
      clinicdata: [],
      email: null,
      number: null,
      receptionist: [],
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
    var clinic = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic/`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var data = [];
    for (var i = 0; i < clinic.length; i++) {
      if (clinic[i].doctors === userid) {
        data.push(clinic[i]);
      }
    }
    var receptionist = await axios
      .get(`${process.env.REACT_APP_SERVER}/receptionist`)
      .then((res) => {
        return res.data;
      });
    var receptionistdata = [];
    for (var a = 0; a < receptionist.length; a++) {
      if (receptionist[a].doctor_id === userid) {
        receptionistdata.push(receptionist[a]);
      }
    }
    // var receptionistdatafinal = []
    // for (var i = 0; i < receptionist.length; i++) {
    //     for (var j = 0; j < data.length; j++) {
    //         if (receptionist[i].access_clinic === data[j].clinic_id) {
    //             receptionistdatafinal.push({
    //                 receptionist: receptionist[i],
    //                 clinicdata: data[j]
    //             })

    //         }
    //     }
    // }
    this.setState({
      clinicdata: data,
      receptionist: receptionistdata,
    });
  };
  sendbtn = async () => {
    const { userid } = this.state;
    var checkedValue = [];
    var inputElements = document.getElementsByClassName("clinicname");
    for (var i = 0; inputElements[i]; ++i) {
      if (inputElements[i].checked) {
        checkedValue.push(inputElements[i].id);
      }
    }
    var emailnew = document.getElementById("email").value;
    var numbernew = document.getElementById("number").value;

    var dc = checkedValue.toString();
    var data = {
      receptionist_email: emailnew,
      receptionist_number: numbernew,
      doctor_id: userid,
      access_clinic: dc,
    };
    var receptionist = await axios
      .post(`${process.env.REACT_APP_SERVER}/receptionist`, data)
      .then((res) => {
        return res.data;
      });
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
    var mydatanew = await user.filter((data) => {
      return data.userid === userid;
    });
    var needata = {
      phone: numbernew,
      username: `${mydatanew[0].initial}. ${mydatanew[0].first_name} ${mydatanew[0].last_name}`,
    };
    await axios
      .post(`${process.env.REACT_APP_SERVER}/mail/invitationsms`, needata)
      .then((res) => {
        return res.data;
      });
    if (receptionist === true) {
      window.location.reload();
    }
  };

  addrecp = () => {
    this.setState({
      accessform: true,
      accessbtn: false,
    });
  };
  cancelbtn = () => {
    this.setState({
      accessform: false,
      accessbtn: true,
    });
  };
  disconnect = async (e) => {
    var deleterecp = await axios
      .delete(`${process.env.REACT_APP_SERVER}/receptionist/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (deleterecp === true) {
      this.componentDidMount();
    }
  };
  nextstep = () => {
    this.setState({
      loader: true
    })
    window.location.replace("/dr_profilereview");
  };
  backbtn = () => {
    window.location.replace("/dr_clinictimimg");
  };
  render() {
    const { clinicdata, receptionist, loader } = this.state;
    console.log(receptionist);
    return (
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Profile</b>
          </h4>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? <button className="btn addrecep ml-3" onClick={this.nextstep}>
              {" "}
              Save & Next Step
            </button> : <button className="btn addrecep ml-3" onClick={this.nextstep}>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="sr-only">Loading...</span>
            </button>}

          </div>
          <h5>Allow Access</h5>
          <p>
            Add Receptionist and allow access to manage this platform as well
          </p>
          {this.state.accessbtn === true ? (
            <button className="btn addrecep" onClick={this.addrecp}>
              {" "}
              + Add Receptionist
            </button>
          ) : null}
          {this.state.accessform === true ? (
            <div className="row">
              <div className="col-md-5">
                <div className="mt-3">
                  <label>
                    <b>
                      Email Address <span className="red-asterisk">*</span>
                    </b>
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="form-control"
                  />
                </div>
                <div className="mt-3">
                  <label>
                    <b>
                      Mobile Number <span className="red-asterisk">*</span>
                    </b>
                  </label>
                  <input
                    type="text"
                    name="number"
                    id="number"
                    className="form-control"
                  />
                </div>
                <p>Select Clinic & Hospital to allow access</p>
                <div className="mt-3">
                  {clinicdata.length !== 0
                    ? clinicdata.map((data, index) => (
                      <div>
                        <label key={index}>
                          <input
                            className="clinicname"
                            type="checkbox"
                            id={data.clinic_name}
                          />{" "}
                          {data.clinic_name}
                        </label>
                      </div>
                    ))
                    : null}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mt-3">
                      <button className="btn savebtn" onClick={this.sendbtn}>
                        {" "}
                        Send Invite
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mt-3">
                      <button
                        className="btn cancelbtn"
                        onClick={this.cancelbtn}
                      >
                        {" "}
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {receptionist.length !== 0
            ? receptionist.map((data, index) => (
              <div className="row mt-5 mb-5" key={index}>
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="row">
                          <div className="col-md-4">
                            <p className="titlehead">Email</p>
                            <p>
                              <b>{data.receptionist_email}</b>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="titlehead">Mobile Number</p>
                            <p>
                              <b>{data.receptionist_number}</b>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <button className="btn invitesendbtn">
                              {" "}
                              Invite Send{" "}
                            </button>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <p className="titlehead">
                              Clinic & Hospital Access
                            </p>
                            <p>
                              <b>{data.access_clinic}</b>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <button
                              className="btn disconnectedbtn"
                              id={data.receptionist_id}
                              onClick={this.disconnect}
                            >
                              {" "}
                              Disconnect
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2"></div>
              </div>
            ))
            : null}
        </div>

        <ToastContainer />
      </div>
    );
  }
}
