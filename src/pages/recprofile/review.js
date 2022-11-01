import React, { Component } from "react";
import Sidebar from "../../Components/sidebarrecp";
import profilepic from "../../assest/img/profilepic.png";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
export default class review extends Component {
  constructor(props) {
    super();
    this.state = {
      initial: null,
      firstname: null,
      number: null,
      postalcode: null,
      email: null,
      lastname: null,
      landline: null,
      city: null,
      address: null,
      state: null,
      country: null,
      file: "",
      imagePreviewUrl: "",
      baseLogo: "",
      slogo: "",
      profileurl: null,
      userid: null,
      companyname: null,
      division: null,
      title: null,
      users: [],
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
        city: userdata[0].city,
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        landline: userdata[0].landline_number,
        state: userdata[0].state,
        profileurl: userdata[0].profile_pic,
        country: userdata[0].country,
        address: userdata[0].address,
        postalcode: userdata[0].postalcode,
        users: user,
      });
    }
  };
  backbtn = () => {
    window.location.replace("/recp_hospitalaccess");
  };
  saveprofile = () => {
    this.setState({
      loader: true,
    });
    window.location.replace("/receptionist/waitingroom");
  };
  render() {
    const { profileurl, loader } = this.state;
    return (
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Receptionist Profilee</b>
          </h4>
          <h5>Profile Review</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader !== true ? (
              <button className="btn addrecep  ml-3" onClick={this.saveprofile}>
                {" "}
                Finish Profile Setup
              </button>
            ) : (
              <button className="btn addrecep  ml-3">
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Loading...</span>
              </button>
            )}
          </div>
          <div className="row mt-5">
            <div className="col-sm-8">
              <div className="row">
                <div className="col-sm-1">
                  {profileurl !== null ? (
                    <Avatar
                      alt="Remy Sharp"
                      src={profileurl}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar
                      alt="Remy Sharp"
                      src={profilepic}
                      sx={{ width: 56, height: 56 }}
                      variant="rounded"
                    />
                  )}
                </div>
                <div className="col-sm-4">
                  <h5 className="profilename">
                    {this.state.initial}. {this.state.firstname}{" "}
                    {this.state.lastname}
                  </h5>
                  <h5 className="profilerole">Receptionist</h5>
                </div>
                <div className="col-sm-6 text-end">
                  <button className="btn editpersonalbtn">
                    <MdEdit />{" "}
                    <Link className="linktag" to="/recp_profile">
                      Edit Personal Details
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm-8">
              <div className="row">
                <div className="col-md-4">
                  <p className="titlehead">Email Address</p>
                  <p>
                    <b>{this.state.email}</b>
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="titlehead">Mobile Number</p>
                  <p>
                    <b>{this.state.number}</b>
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="titlehead">Landline Number</p>
                  <p>
                    <b>{this.state.landline}</b>
                  </p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <p className="titlehead">Address</p>
                  <p>
                    <b>
                      {this.state.address},{this.state.city},{this.state.state},
                      {this.state.postalcode}
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* <div className="row">
                        <h5>Visting Card - This Information will be Visble On Platform</h5>
                        <div className="col-md-4 mt-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            {profileurl !== null ? <img className="profilepicdisplay" src={profileurl} width="50" alt="profilepicdisplay" /> : <img className="profilepicdisplay" src={profilepic} width="50" alt="profilepicdisplay" />}

                                        </div>
                                        <div className="col-sm-9">
                                            <h6 className="profilename">{this.state.initial}. {this.state.firstname} {this.state.lastname}</h6>
                                            <h6 className="profilerole">Receptionist</h6>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <h6 className="vistingename">{this.state.number}</h6>
                                        <h6 className="vistingename">{this.state.email}</h6>
                                        <h6 className="vistingename">{this.state.address},{this.state.city},{this.state.state},{this.state.postalcode}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <button className="editbtn btn-sm m-1"> <MdEdit /> Edit Visting Card Details </button>
                        </div>
                    </div>
                    <hr /> */}
        </div>
      </div>
    );
  }
}
