import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/NonmrSidebar";
import profilepic from "../../assest/img/profilepic.png";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";
import Vistingcard from "../../Components/Visting Card/Vistingcard";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import Avatar from "@mui/material/Avatar";
export default class nonmr_review_edit extends Component {
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
      editvisting: false,
      vistingcarddata: [],
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
    var companydata = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/nonmr`)
      .then((res) => {
        return res.data;
      });
    for (var a = 0; a < companydata.length; a++) {
      if (companydata[a].nonmr_id === userid) {
        this.setState({
          companyname: companydata[a].company_name,
          division: companydata[a].company_division,
          title: companydata[a].title,
        });
      }
    }
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
  };
  editvisting = () => {
    this.setState({
      editvisting: true,
    });
  };
  backbtn = () => {
    window.location.replace("/nonmr_team");
  };
  saveprofile = () => {
    this.setState({
      loader: true,
    });
    window.location.replace("/nonmr/waitingroom");
  };
  render() {
    const { profileurl, editvisting, vistingcarddata, loader } = this.state;
    console.log(vistingcarddata);
    return (
      <div className=" row">
        <div
          className="col-md-2"
          style={{
            width: "100%",
            backgroundColor: "whitesmoke",
          }}
        >
          <Sidebar />
        </div>

        <div className="col-md-10 profileside">
          {editvisting === false ? (
            <>
              <h4 className="mt-5">
                <b>Complete Your Company Representative (Non-MR) Profile</b>
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
                      <h5 className="profilerole">
                        Company Representative (Non-MR)
                      </h5>
                    </div>
                    <div className="col-sm-6 text-end">
                      <button className="btn editpersonalbtn">
                        <MdEdit />{" "}
                        <Link className="linktag" to="/nonmr_profile_edit">
                          Edit Personal Details
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-sm-7">
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
                          {this.state.address},{this.state.city},
                          {this.state.state},{this.state.postalcode}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="row mb-2">
                    <div className="col-sm-7 col-6">
                      <h5>Company Information</h5>
                    </div>
                    <div className="col-sm-5 col-6">
                      <button
                        className="btn editpersonalbtn"
                        style={{ float: "right" }}
                      >
                        <MdEdit />
                        <Link className="linktag" to="/nonmr_company_edit">
                          {" "}
                          Edit Details{" "}
                        </Link>
                      </button>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body clinicdisplaydiv">
                      <div className="mt-2">
                        <span className="clinichead">
                          <b>Company Name</b>
                        </span>{" "}
                        -
                        <span className="clinicaddress">
                          <b> {this.state.companyname} </b>
                        </span>
                        <br />
                      </div>
                      <div className="mt-2">
                        <span className="clinichead">
                          <b>Division</b>
                        </span>{" "}
                        -
                        <span className="clinicaddress">
                          <b> {this.state.division} </b>
                        </span>
                        <br />
                      </div>
                      <div className="mt-2">
                        <span className="clinichead">
                          <b>Function</b>
                        </span>{" "}
                        -
                        <span className="clinicaddress">
                          <b> Medical Representative </b>
                        </span>
                        <br />
                      </div>
                      <div className="mt-2">
                        <span className="clinichead">
                          <b>Title</b>
                        </span>{" "}
                        -
                        <span className="clinicaddress">
                          <b> {this.state.title}</b>
                        </span>
                        <br />
                      </div>
                    </div>
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
                            <h6 className="profilename">
                              {vistingcarddata.initial}.{" "}
                              {vistingcarddata.firstname}{" "}
                              {vistingcarddata.lastname}
                            </h6>
                            {/* <h6>{vistingcarddata.company === "1" ? <h6><span className='profilerole'>Company Representative (Non-MR)</span> -{vistingcarddata.companyname}</h6> : <span className='profilerole'>Company Representative (Non-MR)</span>}</h6> */}
                          </div>
                        </div>
                        <div className="mt-2">
                          {vistingcarddata.numbercheck === "1" ? (
                            <h6 className="vistingename">
                              <b> Mobile Number:</b> {vistingcarddata.number}
                            </h6>
                          ) : null}
                          {vistingcarddata.emailcheck === "1" ? (
                            <h6 className="vistingename">
                              <b>Email :</b> {vistingcarddata.email}
                            </h6>
                          ) : null}

                          <h6 className="vistingename">
                            Address: {vistingcarddata.address},
                            {vistingcarddata.city},{vistingcarddata.state},
                            {vistingcarddata.postalcode}
                          </h6>
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
                                <SiWebmoney />
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
        </div>

        {/* {editvisting === true ? <Vistingcard /> : null} */}
      </div>
    );
  }
}
