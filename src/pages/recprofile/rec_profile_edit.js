import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/ReceptionistSidebar";
import "../../assest/css/profile.css";
import profilepic from "../../assest/img/profilepic.png";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { firebase } from "../../database/firebase";
import Update from "../../Components/Update";
import Avatar from "@mui/material/Avatar";
export default class rec_profile_edit extends Component {
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
      userdata: [],
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
        userdata: user,
      });
      if (userdata[0].first_name === null) {
        alert(
          "Thank you for joining Victor. Kindly take 5 min to complete the profile. Mandatory information is essential to be able to use the application"
        );
      }
    }
  };
  handleChangenew = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    const logo = await this.convertBase64(file);
    this.setState({
      baseLogo: logo,
      file: e.target.files,
    });
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveprofile = async () => {
    const {
      initial,
      firstname,
      number,
      postalcode,
      email,
      lastname,
      landline,
      city,
      file,
      address,
      state,
      country,
      profileurl,
      userid,
    } = this.state;

    if (initial == null) {
      toast.info("Initial Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (firstname == null) {
      toast.info("First Name is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (lastname == null) {
      toast.info("Last Name is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (number == null) {
      toast.info("Mobile Number is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (email == null) {
      toast.info("Email Address is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (postalcode == null) {
      toast.info("Postal code is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (city == null) {
      toast.info("City is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (address == null) {
      toast.info("Address is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (state == null) {
      toast.info("State is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (country == null) {
      toast.info("Country is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      toast.info("Please Wait...", {
        autoClose: 2000,
        transition: Slide,
      });
      this.setState({
        loader: true,
      });
      if (file[0] !== undefined) {
        let file11 = new Promise((resolve, reject) => {
          var storageRef = firebase.storage().ref("profile/" + file[0].name);
          storageRef.put(file[0]).then(function (snapshot) {
            storageRef.getDownloadURL().then(function (url) {
              //img download link ah ketakiradhu
              setTimeout(() => resolve(url), 1000);
            });
          });
        });
        var imgurl = await file11;
        if (imgurl === null) {
          toast.info("Profile Is Required...", {
            autoClose: 5000,
            transition: Slide,
          });
        } else {
          var data = {
            initial: initial,
            first_name: firstname,
            mobile_number: number,
            postalcode: postalcode,
            email: email,
            last_name: lastname,
            landline_number: landline,
            city: city,
            address: address,
            state: state,
            country: country,
            profile_pic: imgurl,
          };
          var updateuserdata = await axios
            .post(
              `${process.env.REACT_APP_SERVER}/users/update/${userid}`,
              data
            )
            .then((res) => {
              return res.data;
            });
          if (updateuserdata === true) {
            window.location.replace("/rec_review_edit");
          }
        }
      } else {
        var imgurlnew = await profileurl;
        var datanew = {
          initial: initial,
          first_name: firstname,
          mobile_number: number,
          postalcode: postalcode,
          email: email,
          last_name: lastname,
          landline_number: landline,
          city: city,
          address: address,
          state: state,
          country: country,
          profile_pic: imgurlnew,
        };
        var updateuserdatanew = await axios
          .post(
            `${process.env.REACT_APP_SERVER}/users/update/${userid}`,
            datanew
          )
          .then((res) => {
            return res.data;
          });
        if (updateuserdatanew === true) {
          window.location.replace("/rec_review_edit");
        }
      }
    }
  };

  checkpincode = async () => {
    const { postalcode } = this.state;
    if (postalcode.trim().length !== 6)
      return alert("Please Give Valid Pincode");
    var zipinfo = await axios
      .get(`${process.env.REACT_APP_SERVER}/pincode/${postalcode}`)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        if (error) return false;
      });
    if (zipinfo.length === 0) return alert("Please Provide Valid Pincode");
    if (zipinfo.data[0] !== undefined) {
      document.getElementById("state").value = zipinfo.data[0].stateName;
      document.getElementById("city").value = zipinfo.data[0].districtName;
      this.setState({
        city: zipinfo.data[0].districtName,
        state: zipinfo.data[0].stateName,
      });
    } else {
      alert("Please Provide Valid Pincode");
    }
  };
  convertBase64 = async (file) => {
    const convertBase64 = new Promise(async (resolve, reject) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        return resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
    return await convertBase64;
  };
  backbtn = () => {
    window.location.replace("/receptionist/waitingroom");
  };
  render() {
    let { baseLogo, profileurl, loader } = this.state;
    let $imagePreview = null;
    if (baseLogo.trim().length !== 0) {
      $imagePreview = (
        <Avatar
          alt="Remy Sharp"
          src={baseLogo}
          variant="rounded"
          sx={{ width: 76, height: 76 }}
          id="slogos"
        />
      );
    } else if (profileurl === null) {
      $imagePreview = (
        <Avatar
          alt="Remy Sharp"
          src={profilepic}
          variant="rounded"
          sx={{ width: 76, height: 76 }}
          id="slogos"
        />
      );
    } else {
      $imagePreview = (
        <Avatar
          alt="Remy Sharp"
          src={profileurl}
          variant="rounded"
          sx={{ width: 76, height: 76 }}
          id="slogos"
        />
      );
    }
    const { slogo, initial } = this.state;
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
          <h4 className="mt-5">
            <b>Complete Your Receptionist Profile</b>
          </h4>
          <h5>Personal Details</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? (
              <button className="btn addrecep  ml-3" onClick={this.saveprofile}>
                {" "}
                Save & Next Step
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
          <div className="container row">
            <div className="mt-3">
              <label>
                <b>Profile Picture </b>
              </label>
              <div className="mt-2 mb-2"> {$imagePreview}</div>
              <input
                name="slogo"
                type="file"
                defaultValue={slogo}
                id="slogo"
                className="form-control1"
                onChange={(e) => this.handleChangenew(e)}
                placeholder="Full Name"
              />
            </div>
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
                      {initial !== null ? (
                        <>
                          <option value={initial} selected>
                            {initial}
                          </option>
                          <option value="Mr">Mr</option>
                          <option value="Dr">Dr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </>
                      ) : (
                        <>
                          <option value="null">--</option>
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
                      value={this.state.firstname}
                      name="firstname"
                      onChange={(e) => this.handlechange(e)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Mobile Number <span className="red-asterisk">*</span>
                  </b>
                </label>
                <span style={{ float: "right", cursor: "pointer" }}>
                  <Update />
                </span>
                <input
                  type="text"
                  name="number"
                  value={this.state.number}
                  id="number"
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                  disabled
                />
              </div>

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
                  value={this.state.email}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="row">
                <div className="col-sm-9">
                  <div className="mt-3">
                    <label>
                      <b>
                        Postal Code <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="postalcode"
                      id="postalcode"
                      value={this.state.postalcode}
                      onChange={(e) => this.handlechange(e)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="mt-4">
                    <button
                      className="btn checkbtn"
                      onClick={this.checkpincode}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    City <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={this.state.city}
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
                  value={this.state.lastname}
                  id="lastname"
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
                  value={this.state.landline}
                  id="landline"
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Address <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  id="address"
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    State <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={this.state.state}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Country <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={this.state.country}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    );
  }
}
