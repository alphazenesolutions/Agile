import React, { Component } from "react";
import Sidebar from "../../Components/sidebar";
import profilepic from "../../assest/img/profilepic.png";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";
import Vistingcard from "../../Components/Visting Card/VistingcardDr";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import LanguageIcon from "@mui/icons-material/Language";
import { AiOutlineClose } from "react-icons/ai";
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
      degree: null,
      speciality: null,
      clinicdata: [],
      users: [],
      editvisting: false,
      vistingcarddata: [],
      loader: false,
      availabilityform: false,
      availabilitybtn: true,

      fromtimearray: [],
      totimearray: [],
      clinic: null,
      daily: false,
      weekly: false,
      fromtime: null,
      totime: null,
      fromdate: null,
      clinicdatafinal: [],
      clinicdisplay: true,
      outofclinicdisplay: false,
      updatebtn: false,
      savebtn: true,
      clinicdataoutfinal: [],
      outofficeformedit: false,
      totimeinput: null,
      fromtimeinput: null,
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
        degree: userdata[0].degree,
        speciality: userdata[0].speciality,
        users: user,
      });
    }
    var clinidata = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic`)
      .then((res) => {
        return res.data;
      });

    var clinicdata = [];
    for (var i = 0; i < clinidata.length; i++) {
      if (clinidata[i].doctors === userid) {
        clinicdata.push(clinidata[i]);
      }
    }
    this.setState({
      clinicdata: clinicdata,
    });
    var myvistingcard = await axios
      .get(`${process.env.REACT_APP_SERVER}/vistingcard/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (myvistingcard.length !== 0) {
      this.setState({
        vistingcarddata: myvistingcard[0],
      });
    }

    var clinicdatanew = await axios
      .get(`${process.env.REACT_APP_SERVER}/availability/all`)
      .then((res) => {
        return res.data;
      });
    var clinicdatafinal = [],
      clinicdataoutfinal = [];
    if (clinicdatanew.length !== 0) {
      for (var a = 0; a < clinicdatanew.length; a++) {
        if (clinicdatanew[a].doctor_id === userid) {
          clinicdatafinal.push(clinicdatanew[a]);
        }
      }
    }

    var clinicdataout = await axios
      .get(`${process.env.REACT_APP_SERVER}/availability/out`)
      .then((res) => {
        return res.data;
      });
    if (clinicdataout.length !== 0) {
      for (var b = 0; b < clinicdataout.length; b++) {
        if (clinicdataout[b].doctor_id === userid) {
          clinicdataoutfinal.push(clinicdataout[b]);
        }
      }
    }
    var clinic = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic/`)
      .then((res) => {
        return res.data;
      });
    var data = [];
    for (var i = 0; i < clinic.length; i++) {
      if (clinic[i].doctors === userid) {
        data.push(clinic[i].clinic_name);
      }
    }
    var finallistarray = [];
    for (var i = 0; i < data.length; i++) {
      var list = [];
      for (var j = 0; j < clinicdatafinal.length; j++) {
        if (clinicdatafinal[j].clinic_name === data[i]) {
          list.push(clinicdatafinal[j]);
        }
      }
      if (list.length !== 0) {
        finallistarray.push({
          availability: list,
        });
      }
    
    }

    this.setState({
      clinicdatafinal: finallistarray,
      clinicdataoutfinal: clinicdataoutfinal,
    });
  };
  editvisting = () => {
    this.setState({
      editvisting: true,
    });
  };
  deletebtn = async (e) => {
    var deletedata = await axios
      .delete(`${process.env.REACT_APP_SERVER}/availability/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (deletedata === true) {
      window.location.reload();
    }
  };
  backbtn = () => {
    window.location.replace("/dr_access");
  };
  saveprofile = () => {
    this.setState({
      loader: true,
    });
    window.location.replace("/doctor/waitingroom");
  };
  edithosptitaltimimg = () => {
    window.location.replace("/dr_clinictimimg");
  };
  render() {
    const {
      profileurl,
      clinicdata,
      editvisting,
      vistingcarddata,
      clinicdatafinal,
      clinicdataoutfinal,
      loader,
    } = this.state;
    console.log(vistingcarddata);
    return (
      <div className=" row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          {editvisting === false ? (
            <>
              <h4 className="mt-5">
                <b>Complete Your Profile</b>
              </h4>
              <h5>Profile Review</h5>
              <div className="mt-3 text-end">
                <button className="btn backbtn" onClick={this.backbtn}>
                  {" "}
                  Back
                </button>
                {loader === false ? (
                  <button
                    className="btn addrecep  ml-3"
                    onClick={this.saveprofile}
                  >
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
                      <h5 className="profilerole">
                        {this.state.initial}. {this.state.firstname}{" "}
                        {this.state.lastname}
                      </h5>
                      <h5 className="profilename">
                        {this.state.degree}-{this.state.speciality}
                      </h5>
                    </div>
                    <div className="col-sm-6">
                      <button className="btn editpersonalbtn">
                        <MdEdit />
                        <Link className="editlink" to="/dr_profile">
                          {" "}
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
                    <div className="col-md-4">
                      <p className="titlehead">Degree</p>
                      <p>
                        <b>{this.state.degree}</b>
                      </p>
                    </div>
                    <div className="col-md-4">
                      <p className="titlehead">Speciality</p>
                      <p>
                        <b>{this.state.speciality}</b>
                      </p>
                    </div>
                    {/* <div className="col-md-4">
                                  <p className="titlehead">Address</p>
                                  <p><b>{this.state.address},{this.state.city},{this.state.state},{this.state.postalcode}</b></p>
                              </div> */}
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="row mb-2">
                    <div className="col-sm-6 col-6">
                      <h5>Clinic / Hospital</h5>
                    </div>
                    <div className="col-sm-6 col-6">
                      <button
                        className="btn editpersonalbtn"
                        style={{ float: "right" }}
                      >
                        <MdEdit />{" "}
                        <Link className="editlink" to="/dr_clinic">
                          Edit Details
                        </Link>
                      </button>
                    </div>
                  </div>
                  <div className="card">
                    {clinicdata !== null
                      ? clinicdata.map((data, index) => (
                          <div className="card-body clinicdisplaydiv">
                            <span className="clinichead">
                              {data.clinic_name}
                            </span>
                            <br />
                            <span className="clinicaddress">
                              <b>{data.city} </b>
                            </span>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <h5>
                  Visting Card - This Information will be Visble On Platform
                </h5>
                <div className="col-md-4 mt-3">
                  {vistingcarddata.length !== 0 ? (
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-2">
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
                          <div className="col-sm-10">
                            <h6
                              style={{ color: "#9F63A9", fontWeight: "bold" }}
                            >
                              {vistingcarddata.initial}.{" "}
                              {vistingcarddata.firstname}{" "}
                              {vistingcarddata.lastname}
                            </h6>
                            {/* <h6 className="profilerole">Doctor</h6> */}
                            <h6>
                              {vistingcarddata.degree} -{" "}
                              {vistingcarddata.speciality}
                            </h6>
                          </div>
                        </div>
                        <div className="mt-2">
                          <b>
                            {" "}
                            Clinic :<span></span>{" "}
                          </b>
                          {clinicdata.length !== 0
                            ? clinicdata.map((data, index) => (
                                <span className="clinichead" key={index}>
                                  {data.clinic_name},
                                </span>
                              ))
                            : null}
                          {vistingcarddata.numbercheck === "1" ? (
                            <h6>
                              <b> Mobile Number:</b> {vistingcarddata.number}
                            </h6>
                          ) : null}
                          {vistingcarddata.emailcheck === "1" ? (
                            <h6>
                              <b>Email :</b> {vistingcarddata.email}
                            </h6>
                          ) : null}
                        </div>
                        <div className="mt-2">
                          {vistingcarddata.facebook === "1" ? (
                            <span className="clinicaddress m-2">
                              <a href={vistingcarddata.facebookname}>
                                <FaFacebookF />
                              </a>
                            </span>
                          ) : null}
                          {vistingcarddata.twitter === "1" ? (
                            <span className="clinicaddress m-2">
                              <a href={vistingcarddata.twittername}>
                                <FaTwitter />
                              </a>
                            </span>
                          ) : null}
                          {vistingcarddata.website === "1" ? (
                            <span className="clinicaddress m-2">
                              <a href={vistingcarddata.twittername}>
                                <LanguageIcon />
                              </a>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-4">
                  <button
                    style={{ fontSize: "15px" }}
                    className="editbtn btn-sm m-1"
                    onClick={this.editvisting}
                  >
                    {" "}
                    <MdEdit /> Edit Visting Card Details{" "}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Vistingcard />
          )}

          <hr />
          <h5> Clinic / Hospital Timing</h5>
          <button
            className="editbtn btn-sm m-1"
            style={{ float: "right", fontSize: "15px" }}
            onClick={this.edithosptitaltimimg}
          >
            {" "}
            <MdEdit /> Edit Clinic / Hospital Timing
          </button>
          {this.state.clinicdisplay === true ? (
            <div className="col-md-12 text-center">
              {clinicdatafinal.length !== 0 ? (
                <div className="row mt-5">
                  <div className="col-sm-3 col-4">
                    <span className="clinichead">
                      <b>Clinic / Hospital</b>
                    </span>
                  </div>
                  <div className="col-sm-4 col-4">
                    <span className="clinichead">
                      <b>Day</b>
                    </span>
                  </div>
                  <div className="col-sm-3 col-4">
                    <span className="clinichead">
                      <b>Time</b>
                    </span>
                  </div>
                </div>
              ) : null}
              {clinicdatafinal.length !== 0
                ? clinicdatafinal.map((datafinal, index) => (
                    // console.log(datafinal)
                    <div className="card mt-2" key={index}>
                      <div className="card-body mt-2">
                        <div className="row">
                          <div className="col-sm-2 col-4">
                            <span className="clinichead">
                              <b>{datafinal.availability[0].clinic_name}</b>
                            </span>
                          </div>
                          <div className="col-sm-4 col-4">
                            <div className="row">
                              <div className="col-sm-12 slotdiv">
                                {datafinal.availability.length !== 0
                                  ? datafinal.availability.map((datanew) => (
                                      <>
                                        <span style={{ marginTop: "5px" }}>
                                          {datanew.notes}
                                        </span>
                                        <br />
                                      </>
                                    ))
                                  : null}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3 col-4">
                            <div className="row">
                              <div className="col-sm-12 slotdiv">
                                {datafinal.availability.length !== 0
                                  ? datafinal.availability.map((datanew) => (
                                      <>
                                        <span style={{ marginTop: "5px" }}>
                                          {datanew.from_time}- {datanew.to_time}
                                        </span>
                                        <br />
                                      </>
                                    ))
                                  : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          ) : null}
          {this.state.outofclinicdisplay === true ? (
            <div className="col-md-12 text-center">
              {clinicdataoutfinal.length !== 0 ? (
                <div className="row mt-5">
                  <div className="col-sm-3 col-4">
                    <span className="clinichead">
                      <b>Clinic / Hospital</b>
                    </span>
                  </div>
                  <div className="col-sm-3 col-4">
                    <span className="clinichead">
                      <b>Date</b>
                    </span>
                  </div>
                  <div className="col-sm-3 col-4">
                    <span className="clinichead">
                      <b>Notes</b>
                    </span>
                  </div>
                  <div className="col-sm-3 col-4">
                    <span className="clinichead">
                      <b>Action</b>
                    </span>
                  </div>
                </div>
              ) : null}
              {clinicdataoutfinal.length !== 0
                ? clinicdataoutfinal.map((datafinal, index) => (
                    <div className="card mt-2" key={index}>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-2 col-4">
                            <span className="clinichead">
                              <b>{datafinal.clinic_name}</b>
                            </span>
                          </div>
                          <div className="col-sm-4 col-4">
                            <div className="row">
                              <div className="col-sm-12 slotdiv">
                                <span className="clinicslottimimg">
                                  From : {datafinal.from_date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3 col-4">
                            <div className="row">
                              <div className="col-sm-12 slotdiv">
                                <span className="clinicslottimimg">
                                  {datafinal.notes}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3 col-4">
                            {/* <button className="editbtn btn-sm m-1" onClick={this.editbtnout} id={datafinal.availability_id}> <MdEdit /> Edit </button> */}
                            <button className="deletebtn">
                              <AiOutlineClose />
                              Delete{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
