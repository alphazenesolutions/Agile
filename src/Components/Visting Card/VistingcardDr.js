import React, { Component } from "react";
import axios from "axios";
import profilepic from "../../assest/img/profilepic.png";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import LanguageIcon from "@mui/icons-material/Language";

export default class Vistingcard extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      users: [],
      mydata: [],
      facebook: false,
      twitter: false,
      website: false,
      twittername: null,
      websitename: null,
      facebookname: null,
      initial: null,
      firstname: null,
      number: null,
      email: null,
      lastname: null,
      landline: null,
      setvistingcard: true,
      speciality: null,
      degree: null,
      emailcheck: false,
      numbercheck: false
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
        mydata: userdata[0],
        users: user,
        firstname: userdata[0].first_name,
        initialnew: userdata[0].initial,
        initial: userdata[0].initial,
        number: userdata[0].mobile_number,
        speciality: userdata[0].speciality,
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        landline: userdata[0].landline_number,
        degree: userdata[0].degree,
        profileurl: userdata[0].profile_pic,
      });
    }

    var myvistingcard = await axios.get(`${process.env.REACT_APP_SERVER}/vistingcard/${userid}`).then((res) => {
      return res.data;
    });
    if (myvistingcard.length === 0) {
      this.setState({
        setvistingcard: true,
      });
    } else {
      this.setState({
        setvistingcard: false,
        userid: userid,
        facebook: myvistingcard[0].facebook,
        twitter: myvistingcard[0].twitter,
        website: myvistingcard[0].website,
        twittername: myvistingcard[0].twittername,
        websitename: myvistingcard[0].websitename,
        facebookname: myvistingcard[0].facebookname,
        initial: myvistingcard[0].initial,
        firstname: myvistingcard[0].firstname,
        number: myvistingcard[0].number,
        email: myvistingcard[0].email,
        lastname: myvistingcard[0].lastname,
        landline: myvistingcard[0].landline,
        speciality: myvistingcard[0].speciality,
        degree: myvistingcard[0].degree,
        emailcheck: myvistingcard[0].emailcheck === "1" ? true : false,
        numbercheck: myvistingcard[0].numbercheck === "1" ? true : false,
      });
    }
  };

  handlechangecheck = (e) => {
    const { facebook, twitter, website, emailcheck, numbercheck } = this.state;
    if (e.target.name === "facebook") {
      if (facebook === true) {
        this.setState({
          facebook: false,
        });
      } else {
        this.setState({
          facebook: true,
        });
      }
    } else if (e.target.name === "twitter") {
      if (twitter === true) {
        this.setState({
          twitter: false,
        });
      } else {
        this.setState({
          twitter: true,
        });
      }
    } else if (e.target.name === "website") {
      if (website === true) {
        this.setState({
          website: false,
        });
      } else {
        this.setState({
          website: true,
        });
      }
    } else if (e.target.name === "email") {
      if (emailcheck === true) {
        this.setState({
          emailcheck: false,
        });
      } else {
        this.setState({
          emailcheck: true,
        });
      }
    } else if (e.target.name === "number") {
      if (numbercheck === true) {
        this.setState({
          numbercheck: false,
        });
      } else {
        this.setState({
          numbercheck: true,
        });
      }
    }
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  savevistingcard = async () => {
    const {
      userid,
      facebook,
      twitter,
      website,
      twittername,
      websitename,
      facebookname,
      initial,
      firstname,
      number,
      email,
      lastname,
      landline,
      speciality,
      degree,
      emailcheck,
      numbercheck
    } = this.state;
    var data = {
      userid: userid,
      facebook: facebook === true ? 1 : 0,
      twitter: twitter === true ? 1 : 0,
      website: website === true ? 1 : 0,
      twittername: twittername,
      websitename: websitename,
      facebookname: facebookname,
      initial: initial,
      firstname: firstname,
      number: number,
      email: email,
      lastname: lastname,
      landline: landline,
      speciality: speciality,
      degree: degree,
      emailcheck: emailcheck === true ? 1 : 0,
      numbercheck: numbercheck === true ? 1 : 0,
    };
    var newvistingcard = await axios
      .post(`${process.env.REACT_APP_SERVER}/vistingcard`, data)
      .then((res) => {
        return res.data;
      });
    if (newvistingcard === true) {
      window.location.reload();
    }
  };
  updatevistingcard = async () => {
    const {
      userid,
      facebook,
      twitter,
      website,
      twittername,
      websitename,
      facebookname,
      initial,
      firstname,
      number,
      email,
      lastname,
      landline,
      speciality,
      degree,
      emailcheck,
      numbercheck
    } = this.state;
    var data = {
      userid: userid,
      facebook: facebook === true ? 1 : 0,
      twitter: twitter === true ? 1 : 0,
      website: website === true ? 1 : 0,
      twittername: twittername,
      websitename: websitename,
      facebookname: facebookname,
      initial: initial,
      firstname: firstname,
      number: number,
      email: email,
      lastname: lastname,
      landline: landline,
      speciality: speciality,
      degree: degree,
      emailcheck: emailcheck === true ? 1 : 0,
      numbercheck: numbercheck === true ? 1 : 0,
    };
    var newvistingcard = await axios
      .post(
        `${process.env.REACT_APP_SERVER}/vistingcard/update/${userid}`,
        data
      )
      .then((res) => {
        return res.data;
      });
    if (newvistingcard === true) {
      window.location.reload();
    }
  };
  render() {
    const {
      mydata,
      facebook,
      twitter,
      website,
      twittername,
      websitename,
      facebookname,
      setvistingcard,
      emailcheck,
      numbercheck
    } = this.state;
    return (
      <div className="container-fluid row">
        <div className="col-md-10 profileside">
          <h6 className="mt-5">
            <b>Design Visiting Card</b>
          </h6>
          <p>
            Select the checkbox to add specific details to your card in addition
            to the mandatory fields.
          </p>
          <div className="container row">
            <div className="col-md-5 mt-5">
              <div className="mt-3">
                <div className="row">
                  <div className="col-sm-3">
                    <label>
                      <b>
                        Initial <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <select
                      name="initial"
                      id="initial"
                      className="form-control"
                      onChange={(e) => this.handlechange(e)}
                    >
                      {mydata.initial !== null ? (
                        <>
                          <option value={mydata.initial} selected>
                            {mydata.initial}
                          </option>
                          <option value="Mr">Mr</option>
                          <option value="Dr">Dr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </>
                      ) : (
                        <>
                          <option value="Mr">Mr</option>
                          <option value="Dr">Dr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="col-sm-9">
                    <label>
                      <b>
                        First Name <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      value={mydata.first_name}
                      name="firstname"
                      onChange={(e) => this.handlechange(e)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {numbercheck === true ?
                  <input
                    type="checkbox"
                    id="vehicle1"
                    checked
                    name="number"
                    onChange={(e) => this.handlechangecheck(e)}
                  /> : <input
                    type="checkbox"
                    id="vehicle1"
                    name="number"
                    onChange={(e) => this.handlechangecheck(e)}
                  />}
                <label>
                  <b>
                    Mobile Number <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="number"
                  id="number"
                  value={mydata.mobile_number}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="mt-3">
                {emailcheck === true ? <input
                  type="checkbox"
                  id="vehicle1"
                  checked
                  name="email"
                  onChange={(e) => this.handlechangecheck(e)}
                /> : <input
                  type="checkbox"
                  id="vehicle1"
                  name="email"
                  onChange={(e) => this.handlechangecheck(e)}
                />}
                <label>
                  <b>
                    Email Address <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={mydata.email}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="mt-3">
                <label>
                  <b>
                    Degree<span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="degree"
                  id="degree"
                  value={mydata.degree}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>

              <div className="mt-3">
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="twitter"
                  onChange={(e) => this.handlechangecheck(e)}
                />
                <label for="vehicle1">
                  {" "}
                  <b>
                    {" "}
                    Twitter URL <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="twittername"
                  value={twittername}
                  id="city"
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-5 mt-5">
              <div className="mt-3">
                <label>
                  <b>
                    Last Name <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={mydata.last_name}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>Landline Number </b>
                </label>
                <input
                  type="text"
                  name="landline"
                  id="landline"
                  value={mydata.landline_number}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Speciality<span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="speciality"
                  id="speciality"
                  value={mydata.speciality}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>

              <div className="mt-3">
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="website"
                  onChange={(e) => this.handlechangecheck(e)}
                />
                <label for="vehicle1">
                  {" "}
                  <b>
                    {" "}
                    Website URL <span className="red-asterisk"></span>
                  </b>
                </label>
                <input
                  type="text"
                  name="websitename"
                  value={websitename}
                  id="city"
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="facebook"
                  onChange={(e) => this.handlechangecheck(e)}
                />
                <label for="vehicle1">
                  {" "}
                  <b>
                    {" "}
                    Facebook URL <span className="red-asterisk"></span>
                  </b>
                </label>
                <input
                  type="text"
                  name="facebookname"
                  value={facebookname}
                  id="city"
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <h5>Visiting Card Preview</h5>
            <div className=" reviewVisitingcard mt-3">
              <div className="card reviewVisitingcardBody ">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      {mydata.profile_pic !== null ? (
                        <img
                          className="profilepicdisplay"
                          src={mydata.profile_pic}
                          width="50"
                          alt="profilepicdisplay"
                        />
                      ) : (
                        <img
                          className="profilepicdisplay"
                          src={profilepic}
                          width="50"
                          alt="profilepicdisplay"
                        />
                      )}
                    </div>
                    <div className="col-sm-9">
                      {mydata.role === "doctor" ? (
                        <p style={{ color: "#9F63A9", fontWeight: "bold" }}>
                          {mydata.initial}. {mydata.first_name}{" "}
                          {mydata.last_name}{" "}
                        </p>
                      ) : null}

                      <h6 className="profilename">
                        {mydata.degree} - {mydata.speciality}
                      </h6>
                      {numbercheck === "1" ?
                        <div className="flex">
                          <p><b>Phone:</b></p>
                          <span>+91 {mydata.mobile_number}</span>
                        </div> : null}

                      {emailcheck === "1" ?
                        <div className="flex">
                          <p><b>Email :</b></p>
                          <span>{mydata.email}</span>
                        </div> : null}

                      <div className="mt-2">
                        {facebook === true ? (
                          <span className="vistingename m-3">
                            <a href={facebookname}>
                              <FaFacebookF style={{ fontSize: "20px" }} />
                            </a>
                          </span>
                        ) : null}
                        {twitter === true ? (
                          <span className="vistingename  m-3">
                            <a href={twittername}>
                              <FaTwitter style={{ fontSize: "20px" }} />
                            </a>
                          </span>
                        ) : null}
                        {website === true ? (
                          <span className="vistingename  m-3">
                            <a href={websitename}>
                              <LanguageIcon style={{ fontSize: "20px" }} />
                            </a>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {setvistingcard === true ? (
                <button
                  className="addbtn addbtn213 btn-sm m-1"
                  onClick={this.savevistingcard}
                >
                  {" "}
                  Save Visting Card Details{" "}
                </button>
              ) : (
                <button
                  className="addbtn addbtn213 btn-sm m-1"
                  onClick={this.updatevistingcard}
                >
                  {" "}
                  Update Visting Card Details{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
