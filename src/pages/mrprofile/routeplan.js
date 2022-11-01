import React, { Component } from "react";
import Sidebar from "../../Components/sidebarmr";
import { AiOutlineSearch } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import profilepic from "../../assest/img/profilepic.png";
export default class routeplan extends Component {
  constructor(props) {
    super();
    this.state = {
      seg1: "0",
      seg2: "0",
      seg3: "0",
      seg4: "0",
      frequency1: 0,
      frequency2: 0,
      frequency3: 0,
      frequency4: 0,
      frequency5: 0,
      frequency6: 0,
      seg1user: 0,
      seg2user: 0,
      seg3user: 0,
      seg4user: 0,
      countworking: 0,
      myconnectionuser: [],
      doctorinfo: [],
      callingdr: [],
      noncallingdr: [],
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
    setTimeout(() => {
      this.getroutedata();
      // this.frequencydata();
    }, 2000);
  };
  getroutedata = async () => {
    const { userid } = this.state;
    var routeplan = await axios
      .get(`${process.env.REACT_APP_SERVER}/mr_profile_routine/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (routeplan.length !== 0) {
      console.log(routeplan[0]);
      this.setState({
        frequency5: routeplan[0].workingday,
        seg1: routeplan[0].typea,
        seg2: routeplan[0].typeb,
        seg3: routeplan[0].typec,
        seg4: routeplan[0].typed,
        frequency1: routeplan[0].typeaa,
        frequency2: routeplan[0].typebb,
        frequency3: routeplan[0].typecc,
        frequency4: routeplan[0].typedd,

        frequency6: routeplan[0].callday,
        seg1user: routeplan[0].counta,
        seg2user: routeplan[0].countb,
        seg3user: routeplan[0].countc,
        seg4user: routeplan[0].countd,
        countworking: routeplan[0].countworking
      });
    }

    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/doctor`)
      .then((res) => {
        return res.data;
      });
    var connection = await axios
      .get(`${process.env.REACT_APP_SERVER}/connection/connect`)
      .then((res) => {
        return res.data;
      });
    var myconnection = await connection.filter((data) => {
      return data.from_id === userid || data.to_id === userid;
    });
    var doctorinfo = [];
    for (var j = 0; j < myconnection.length; j++) {
      for (var i = 0; i < user.length; i++) {
        if (myconnection[j].to_id === userid) {
          if (user[i].userid === myconnection[j].from_id) {
            doctorinfo.push({
              info: user[i],
              connection: myconnection[j],
            });
          }
        } else {
          if (user[i].userid === myconnection[j].to_id) {
            doctorinfo.push({
              info: user[i],
              connection: myconnection[j],
            });
          }
        }
      }
    }
    var callingdr = [],
      noncallingdr = [];
    for (var a = 0; a < doctorinfo.length; a++) {
      if (doctorinfo[a].connection.iscalling === "true") {
        callingdr.push(doctorinfo[a]);
      } else {
        noncallingdr.push(doctorinfo[a]);
      }
    }
    this.setState({
      myconnectionuser: doctorinfo,
      doctorinfo: doctorinfo,
      callingdr: callingdr,
      noncallingdr: noncallingdr,
    });
  };
  segmentation = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    setTimeout(() => {
      this.frequencydata();
    }, 2000);
  };

  callfrequency = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    setTimeout(() => {
      this.frequencydata();
    }, 2000);
  };
  frequencydata = async () => {
    const {
      seg1,
      seg2,
      seg3,
      seg4,
      userid,
      frequency5,
      frequency1,
      frequency2,
      frequency3,
      frequency4,
    } = this.state;
    var connection = await axios
      .get(`${process.env.REACT_APP_SERVER}/connection/connect`)
      .then((res) => {
        return res.data;
      });
    var myconnection = await connection.filter((data) => {
      return data.from_id === userid || data.to_id === userid;
    });
    var seg1user = await myconnection.filter((data) => {
      return data.frequency === seg1;
    });
    var seg2user = await myconnection.filter((data) => {
      return data.frequency === seg2;
    });
    var seg3user = await myconnection.filter((data) => {
      return data.frequency === seg3;
    });
    var seg4user = await myconnection.filter((data) => {
      return data.frequency === seg4;
    });
    var totoalcount = ((Number(frequency1)) * (Number(4) / seg1)) + ((Number(frequency2)) * (Number(4) / seg2)) + ((Number(frequency3)) * (Number(4) / seg3)) + ((Number(frequency4)) * (Number(4) / seg4));
    var totoalcount2 = ((Number(seg1user.length)) * (Number(4) / seg1)) + ((Number(seg2user.length)) * (Number(4) / seg2)) + ((Number(seg3user.length)) * (Number(4) / seg3)) + ((Number(seg4user.length)) * (Number(4) / seg4));

    var count = totoalcount / Number(frequency5);
    var count2 = totoalcount2 / Number(frequency5);
    var finalcount = Math.round(count);
    var finalcount2 = Math.round(count2);
    var routeplan = await axios
      .get(`${process.env.REACT_APP_SERVER}/mr_profile_routine/${userid}`)
      .then((res) => {
        return res.data;
      });

    this.setState({
      seg1user: seg1user.length,
      seg2user: seg2user.length,
      seg3user: seg3user.length,
      seg4user: seg4user.length,
      frequency6: finalcount,
      countworking: finalcount2,
    });
  };
  saveroute = async () => {
    this.setState({
      loader: true
    })
    const {
      seg1,
      seg2,
      seg3,
      seg4,
      seg1user,
      seg2user,
      seg3user,
      seg4user,
      frequency1,
      frequency2,
      frequency3,
      frequency4,
      frequency5,
      frequency6,
      countworking,
      userid,
    } = this.state;
    var data = {
      typea: seg1,
      typeb: seg2,
      typec: seg3,
      typed: seg4,
      typeaa: frequency1,
      typebb: frequency2,
      typecc: frequency3,
      typedd: frequency4,
      workingday: frequency5,
      callday: frequency6,
      counta: seg1user,
      countb: seg2user,
      countc: seg3user,
      countd: seg4user,
      countworking: countworking,
      userid: userid,
    };
    var routeplan = await axios
      .post(`${process.env.REACT_APP_SERVER}/mr_profile_routine/`, data)
      .then((res) => {
        return res.data;
      });
    console.log(routeplan);
    if (routeplan === true) {
      window.location.replace("/mr_review");
    }
  };
  searchname = () => {
    var name = document.getElementById("srch-term").value;
    const { doctorinfo } = this.state;
    var searchuser = [];
    for (var i = 0; i < doctorinfo.length; i++) {
      if (
        doctorinfo[i].info.first_name
          .toLowerCase()
          .includes(name.toLowerCase()) ||
        doctorinfo[i].info.last_name.toLowerCase().includes(name.toLowerCase())
      ) {
        searchuser.push(doctorinfo[i]);
      }
    }
    this.setState({
      myconnectionuser: searchuser,
    });
  };
  backbtn = () => {
    window.location.replace("/mr_company");
  };

  changeplan = async (e) => {
    const { seg1, seg2, seg3, seg4 } = this.state
    console.log(seg1, seg2, seg3, seg4)
    var value = document.getElementById(e.target.id).value
    var data = {
      frequency: value
    }
    var update = await axios.post(`${process.env.REACT_APP_SERVER}/connection/update/${e.target.id}`, data).then((res) => {
      return res.data;
    });
    if (update === true) {
      // this.componentDidMount()
      if (seg1 === value) {
        this.setState({
          seg1: value
        })
        setTimeout(() => {
          this.frequencydata();
        }, 2000);
      } else if (seg2 === value) {
        this.setState({
          seg2: value
        })
        setTimeout(() => {
          this.frequencydata();
        }, 2000);
      } else if (seg3 === value) {
        this.setState({
          seg3: value
        })
        setTimeout(() => {
          this.frequencydata();
        }, 2000);
      } else {
        this.setState({
          seg4: value
        })
        setTimeout(() => {
          this.frequencydata();
        }, 1000);
      }
      // this.segmentation(value)
    }
  }
  render() {
    const { myconnectionuser, callingdr, noncallingdr, loader } = this.state;

    return (
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Mr Profile</b>
          </h4>
          <h5>Route Planning</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? <button className="btn addrecep  ml-3" onClick={this.saveroute}>
              {" "}
              Save & Next Step
            </button> : <button className="btn addrecep  ml-3" >
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="sr-only">Loading...</span>
            </button>}
          </div>
          <div className="row mt-5">
            <div className="col-md-9">
              <div className="row">
                <div className="col-sm-2">
                  <h6 className="headingroute">A Type Doctors</h6>
                </div>
                <div className="col-sm-2">
                  <h6 className="headingroute">B Type Doctors</h6>
                </div>
                <div className="col-sm-2">
                  <h6 className="headingroute">C Type Doctors</h6>
                </div>
                <div className="col-sm-2">
                  <h6 className="headingroute">D Type Doctors</h6>
                </div>
                <div className="col-sm-2">
                  <h6 className="headingroute">Working Days</h6>
                </div>
                <div className="col-sm-2">
                  <h6 className="headingroute">Call / Day</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="mt-3">
                <p>Customer Segmentation (Based on frequency)</p>
                <div className="row">
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="seg1"
                      value={this.state.seg1}
                      className="form-control"
                      onChange={(e) => this.segmentation(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="seg2"
                      value={this.state.seg2}
                      className="form-control"
                      onChange={(e) => this.segmentation(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="seg3"
                      value={this.state.seg3}
                      className="form-control"
                      onChange={(e) => this.segmentation(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="seg4"
                      value={this.state.seg4}
                      className="form-control"
                      onChange={(e) => this.segmentation(e)}
                    />
                  </div>
                  <div className="col-sm-2"></div>
                  <div className="col-sm-2"></div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-5">
              <p>Number of weeks between calls (Please input data)</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="mt-3">
                <p>Doctor Profile based on call frequency</p>
                <div className="row">
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="frequency1"
                      value={this.state.frequency1}
                      className="form-control"
                      onChange={(e) => this.callfrequency(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="frequency2"
                      value={this.state.frequency2}
                      className="form-control"
                      onChange={(e) => this.callfrequency(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="frequency3"
                      value={this.state.frequency3}
                      className="form-control"
                      onChange={(e) => this.callfrequency(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="frequency4"
                      value={this.state.frequency4}
                      className="form-control"
                      onChange={(e) => this.callfrequency(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="frequency5"
                      value={this.state.frequency5}
                      className="form-control"
                      onChange={(e) => this.segmentation(e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      name="frequency6"
                      disabled
                      value={this.state.frequency6}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-5">
              <p>
                Total No. of Doctors in your route (Please input data for count
                irrespective whether in or out of this platform)
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="mt-3">
                <p>No. of Doctors currently using this platform</p>
                <div className="row">
                  <div className="col-sm-2">
                    <input
                      type="text"
                      value={this.state.seg1user}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      value={this.state.seg2user}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      value={this.state.seg3user}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      value={this.state.seg4user}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-2"></div>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      value={this.state.countworking}
                      name="finalcont"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-5">
              <p>No. of Calling Doctors currently using this platform</p>
            </div>
          </div>
          <div className="row">
            <h5>
              Classification of Doctors with whom Connection has been made
            </h5>
            <div className="row">
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-4">
                    <p>Name</p>
                  </div>
                  <div className="col-md-5">
                    <p>Route list - Please de-select if Not appropriate</p>
                  </div>
                  <div className="col-md-3">
                    <p>Input Doctor Type</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {myconnectionuser.length !== 0
                      ? myconnectionuser.map((data, index) => (
                        <div className="card" key={index}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="row">
                                  <div className="col-sm-4">
                                    {data.info.profile_pic !== null ? (
                                      <Avatar
                                        alt="Remy Sharp"
                                        src={data.info.profile_pic}
                                        variant="rounded"
                                      />
                                    ) : (
                                      <Avatar
                                        alt="Remy Sharp"
                                        src={profilepic}
                                        variant="rounded"
                                      />
                                    )}
                                  </div>
                                  <div className="col-sm-8">
                                    <span className="namehead">
                                      {data.info.initial}.{" "}
                                      {data.info.first_name}{" "}
                                      {data.info.last_name}
                                    </span>
                                    <br />
                                    {/* <span className="namevalue">Hospital</span> */}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Is the Doctor in Route?
                                  <input type="checkbox" checked />
                                </label>
                                <label>
                                  Is the Doctor taking virtual calls?
                                  <input type="checkbox" checked />
                                </label>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  defaultValue={data.connection.frequency}
                                  className="form-control"
                                  id={data.connection.connection_id}
                                  onChange={(e) => this.changeplan(e)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                      : null}
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <p>Filter</p>
                <div className="row">
                  <div className="xt-blog-form" role="search">
                    <div className="input-group add-on">
                      <input
                        className="form-control"
                        placeholder="Search"
                        name="srch-term"
                        id="srch-term"
                        type="text"
                      />
                      <div className="input-group-btn">
                        <button
                          className="btn btn-default"
                          onClick={this.searchname}
                          type="submit"
                        >
                          <AiOutlineSearch />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <span>
                      <b>My Doctor</b>
                    </span>{" "}
                    <span className="countspan" style={{ float: "right" }}>
                      {myconnectionuser.length}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span>
                      <b>Virtually Active</b>
                    </span>{" "}
                    <span className="countspan" style={{ float: "right" }}>
                      {callingdr.length}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span>
                      <b>Virtually Not Active</b>
                    </span>{" "}
                    <span className="countspan" style={{ float: "right" }}>
                      {noncallingdr.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    );
  }
}
