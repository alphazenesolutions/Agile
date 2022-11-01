import React, { Component } from "react";
import Sidebar from "../../Components/sidebar";
import axios from "axios";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEdit } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
export default class clinic extends Component {
  constructor(props) {
    super();
    this.state = {
      clinicname: null,
      postalcode: null,
      state: null,
      clinicnumber: null,
      address: null,
      city: null,
      country: null,
      userid: null,
      clinicdata: [],
      clinicid: null,
      savebtn: true,
      updatbtn: false,
      cancelbtn: false,
      landlinenumber: null,
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

    var clinidata = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var clinicdata = [];
    for (var i = 0; i < clinidata.length; i++) {
      if (clinidata[i].doctors === userid) {
        clinicdata.push(clinidata[i]);
      }
    }
    this.setState({
      clinicdata: clinicdata,
    });
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
    } else {
      alert("Please Provide Valid Pincode");
    }
  };
  editclinic = async (e) => {
    const { userid } = this.state;
    var oneclinic = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (oneclinic[0].doctors === userid) {
      document.getElementById("state").value = oneclinic[0].state;
      document.getElementById("address").value = oneclinic[0].address;
      document.getElementById("city").value = oneclinic[0].city;
      document.getElementById("clinicname").value = oneclinic[0].clinic_name;
      document.getElementById("code").value = oneclinic[0].pincode;
      document.getElementById("clinicnumber").value =
        oneclinic[0].clinic_number;
      document.getElementById("landlinenumber").value =
        oneclinic[0].landlinenumber;
      document.getElementById(
        "country"
      ).innerHTML = `<option value="${oneclinic[0].country}" selected>${oneclinic[0].country}</option>`;
    }
    this.setState({
      clinicid: e.target.id,
      savebtn: false,
      updatbtn: true,
      cancelbtn: true,
    });
  };
  deleteclinic = async (e) => {
    console.log(e.target.id);
    const { clinicdata } = this.state;
    // eslint-disable-next-line no-restricted-globals
    var alert = confirm(
      "Are You Sure Delete Clinic Now..The timing for the clinic will also be deleted"
    );
    if (alert === true) {
      var checkclinic = await clinicdata.filter((data) => {
        return data.clinic_id === e.target.id;
      });
      var deleteclinic = await axios
        .delete(`${process.env.REACT_APP_SERVER}/clinic/${e.target.id}`)
        .then((res) => {
          return res.data;
        });
      if (deleteclinic === true) {
        var deletedata = await axios
          .delete(
            `${process.env.REACT_APP_SERVER}/availability/clinic/${checkclinic[0].clinic_name}`
          )
          .then((res) => {
            return res.data;
          });
        if (deletedata === true) {
          this.componentDidMount();
        }
      }
    }
  };

  saveclinic = async () => {
    const { userid } = this.state;
    const state = document.getElementById("state").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postalcode = document.getElementById("code").value;
    const clinicname = document.getElementById("clinicname").value;
    const clinicnumber = document.getElementById("clinicnumber").value;
    const country = document.getElementById("country").value;
    const landlinenumber = document.getElementById("landlinenumber").value;

    if (clinicname.length === 0) {
      toast.error("Clinic name Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (postalcode.length === 0) {
      toast.error("Postal code Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (city.length === 0) {
      toast.error("City Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (address.length === 0) {
      toast.error("Address Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (state.length === 0) {
      toast.error("State Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (country.length === 0) {
      toast.error("Country Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var data = {
        doctors: userid,
        clinic_name: clinicname,
        address: address,
        pincode: postalcode,
        city: city,
        state: state,
        country: country,
        clinic_number: clinicnumber,
        landlinenumber: landlinenumber,
      };
      var clinicdata = await axios
        .post(`${process.env.REACT_APP_SERVER}/clinic/`, data)
        .then((res) => {
          return res.data;
        });
      if (clinicdata === true) {
        this.componentDidMount();
        document.getElementById("state").value = "";
        document.getElementById("address").value = "";
        document.getElementById("city").value = "";
        document.getElementById("code").value = "";
        document.getElementById("clinicname").value = "";
        document.getElementById("clinicnumber").value = "";
        document.getElementById("country").value = "";
        document.getElementById("landlinenumber").value = "";
      }
    }
  };
  cancelbtn = () => {
    this.setState({
      savebtn: true,
      updatbtn: false,
      cancelbtn: false,
    });
    window.location.reload();
  };
  updateclinic = async () => {
    const { userid, clinicid } = this.state;
    const state = document.getElementById("state").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postalcode = document.getElementById("code").value;
    const clinicname = document.getElementById("clinicname").value;
    const clinicnumber = document.getElementById("clinicnumber").value;
    const country = document.getElementById("country").value;
    var data = {
      doctors: userid,
      clinic_name: clinicname,
      address: address,
      pincode: postalcode,
      city: city,
      state: state,
      country: country,
      clinic_number: clinicnumber,
    };
    var clinicdata = await axios
      .post(`${process.env.REACT_APP_SERVER}/clinic/update/${clinicid}`, data)
      .then((res) => {
        return res.data;
      });
    if (clinicdata === true) {
      this.componentDidMount();
    }
  };
  nextstep = () => {
    this.setState({
      loader: true,
    });
    window.location.replace("/dr_clinictimimg");
  };
  backbtn = () => {
    window.location.replace("/dr_profile");
  };
  render() {
    const { clinicdata, savebtn, updatbtn, cancelbtn, loader } = this.state;
    return (
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Profile</b>
          </h4>
          <h5>Clinic & Hospital Details</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? (
              <button className="btn addrecep  ml-3" onClick={this.nextstep}>
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
            <div className="col-md-4 mt-5">
              <div className="mt-3">
                <label>
                  <b>
                    Clinic & Hospital <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="clinicname"
                  id="clinicname"
                  placeholder="Enter Clinic Name"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                />
              </div>
              <div className="mt-3">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="mt-3">
                      <label>
                        <b>
                          Postal Code <span className="red-asterisk">*</span>
                        </b>
                      </label>
                      <input
                        type="text"
                        id="code"
                        placeholder="Enter Postal Code"
                        name="postalcode"
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
                  placeholder="Enter Clinic Number"
                  id="state"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>Clinic Mobile </b>
                </label>
                <input
                  type="text"
                  name="clinicnumber"
                  id="clinicnumber"
                  placeholder="Enter Clinic Number"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                />
              </div>
              {savebtn === true ? (
                <div className="mt-5">
                  <button
                    className="addrecep btn-sm m-1"
                    onClick={this.saveclinic}
                  >
                    Save & Add New
                  </button>
                </div>
              ) : null}
              {updatbtn === true ? (
                <div className="mt-5">
                  <button
                    className="addrecep btn-sm m-1"
                    onClick={this.updateclinic}
                  >
                    Save & Add New Clinic
                  </button>
                </div>
              ) : null}
              {cancelbtn === true ? (
                <div className="mt-5">
                  <button
                    className="editbtn btn-sm m-1"
                    onClick={this.cancelbtn}
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
            <div className="col-md-4 mt-5">
              <div className="mt-3">
                <label>
                  <b>
                    Address <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter Address"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                />
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
                  placeholder="Enter City"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
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
                  value={"India"}
                  placeholder="Enter Country"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                />
                {/* <select name="country" id="country" className="form-control" onChange={(e) => this.handlechange(e)}>
                                    <option >Select Country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="China">China</option>
                                </select> */}
              </div>
              <div className="mt-3">
                <label>
                  <b>Landline Number </b>
                </label>
                <input
                  type="text"
                  name="landlinenumber"
                  id="landlinenumber"
                  placeholder="Enter Landline Number"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                />
              </div>
            </div>
            <div className="col-md-1 mt-5"></div>
            <div className="col-md-3 mt-5">
              <h6>Added Clinic / Hospital</h6>
              <div className="row">
                {clinicdata !== null
                  ? clinicdata.map((data, index) => (
                      <div className="card" key={index}>
                        <div
                          className="card-body"
                          style={{ padding: "20px 5px 5px 5px" }}
                        >
                          <div className="row">
                            <div className="col-sm-6">
                              <h6>{data.clinic_name}</h6>
                              <p className="titlehead">{data.city}</p>
                            </div>
                            <div className="col-sm-6">
                              <button
                                className="btn editclinicbtn"
                                onClick={this.editclinic}
                                id={data.clinic_id}
                              >
                                <MdEdit
                                  onClick={this.editclinic}
                                  id={data.clinic_id}
                                />
                              </button>
                              <button
                                className="btn deleteclinibtn"
                                onClick={this.deleteclinic}
                                id={data.clinic_id}
                              >
                                <AiOutlineClose />
                              </button>
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

        <ToastContainer />
      </div>
    );
  }
}
