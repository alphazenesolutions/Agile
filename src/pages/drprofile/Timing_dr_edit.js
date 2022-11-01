import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/DrSidebar";
import { MdEdit } from "react-icons/md";

import { AiOutlineClose } from "react-icons/ai";
import { GoPlusSmall } from "react-icons/go";
import axios from "axios";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import moment from "moment";

export default class timimg extends Component {
  constructor(props) {
    super();
    this.state = {
      availabilityform: false,
      availabilitybtn: true,
      userid: null,
      clinicdata: [],
      fromtimearray: [],
      totimearray: [],
      clinic: null,
      daily: false,
      weekly: false,
      fromtime: [],
      totime: null,
      fromdate: null,
      clinicdatafinal: [],
      clinicdisplay: true,
      outofclinicdisplay: false,
      updatebtn: false,
      clinicdataoutfinal: [],
      outofficeformedit: false,
      totimeinput: null,
      fromtimeinput: null,
      savebtn: false,
      dailyslotdata: [],
      weeklyslotdata: [],
      loader: false,
      editdata: [],
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
        data.push(clinic[i].clinic_name);
      }
    }
    this.setState({
      clinicdata: data,
    });
    var clinicdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/availability/all`)
      .then((res) => {
        return res.data;
      });
    var clinicdatafinal = [],
      clinicdataoutfinal = [];
    if (clinicdata.length !== 0) {
      for (var a = 0; a < clinicdata.length; a++) {
        if (clinicdata[a].doctor_id === userid) {
          clinicdatafinal.push(clinicdata[a]);
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

    var finallistarray = [];
    for (var i = 0; i < data.length; i++) {
      var list = [];
      for (var j = 0; j < clinicdatafinal.length; j++) {
        if (clinicdatafinal[j].clinic_name === data[i]) {
          list.push(clinicdatafinal[j]);
        }
      }
      finallistarray.push({
        availability: list,
      });
    }

    this.setState({
      clinicdatafinal: finallistarray,
      clinicdataoutfinal: clinicdataoutfinal,
    });
  };
  handlechange = (e) => {
    if (e.target.name === "daily") {
      this.setState({
        weekly: false,
        daily: true,
        availabilityform: true,
      });
    }
  };
  handlechangenew = (e) => {
    if (e.target.name === "weekly") {
      this.setState({
        weekly: true,
        daily: false,
        availabilityform: false,
      });
    }
  };

  addbtn = () => {
    const { fromtime, totime } = this.state;
    var arraytotime = [],
      arrayfromtime = [];
    var clinicname = document.getElementById("clinic").value;
    var fromtimeavail = fromtime;
    var totimeavail = totime;
    var fromdateavail = document.getElementById("fromdate").value;
    arraytotime.push(totimeavail);
    arrayfromtime.push(fromtimeavail);
    if (fromtimeavail.length === 0) {
      toast.info("From time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (totimeavail.length === 0) {
      toast.info("To time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (fromdateavail.length === 0) {
      toast.info("From date Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var data = {
        fromtimearray: arrayfromtime,
        totimearray: arraytotime,
        clinic: clinicname,
        fromtime: fromtimeavail,
        totime: totimeavail,
        fromdate: fromdateavail,
        savebtn: true,
        weekly: false,
      };
      this.setState({
        fromtimearray: arrayfromtime,
        totimearray: arraytotime,
        clinic: clinicname,
        fromtime: fromtimeavail,
        totime: totimeavail,
        fromdate: fromdateavail,
        savebtn: true,
        dailyslotdata: data,
      });
    }
  };
  savebtn = async () => {
    const {
      clinic,
      fromtime,
      totime,
      fromdate,
      userid,
      dailyslotdata,
      weeklyslotdata,
      checkedValue,
    } = this.state;
    if (clinic == null) {
      toast.info("Clinic name Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (fromtime == null) {
      toast.info("From time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (totime == null) {
      toast.info("To time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (fromdate == null) {
      toast.info("From date Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      toast.info("Please Wait...", {
        autoClose: 3000,
        transition: Slide,
      });

      if (dailyslotdata.fromtime !== undefined) {
        var checkedValuenew = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (var i = 0; i < checkedValuenew.length; i++) {
          var data = {
            doctor_id: userid,
            clinic_name: dailyslotdata.clinic,
            from_date: dailyslotdata.fromdate,
            from_time: dailyslotdata.fromtime,
            to_time: dailyslotdata.totime,
            daily: true,
            notes: checkedValuenew[i].toString(),
          };
          await axios
            .post(`${process.env.REACT_APP_SERVER}/availability/`, data)
            .then((res) => {
              return res.data;
            });
        }
      }
      if (weeklyslotdata.fromtime !== undefined) {
        for (var j = 0; j < checkedValue.length; j++) {
          var datanew = {
            doctor_id: userid,
            clinic_name: weeklyslotdata.clinic,
            from_date: weeklyslotdata.fromdate,
            from_time: weeklyslotdata.fromtime,
            to_time: weeklyslotdata.totime,
            weekly: true,
            notes: checkedValue[j].toString(),
          };
          await axios
            .post(`${process.env.REACT_APP_SERVER}/availability/`, datanew)
            .then((res) => {
              return res.data;
            });
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  updatebtn = async () => {
    const { userid, fromtimeinput, fromtime, totime, fromdate, checkedValue } =
      this.state;

    var availability_id = sessionStorage.getItem("availability_id");
    var clinic = document.getElementById("clinic").value;
    // var fromdate = document.getElementById("fromdate").value;
    // var fromtime = document.getElementById("fromtime").value;
    // var totime = document.getElementById("totime").value;
    if (checkedValue === undefined) {
      var data = {
        doctor_id: userid,
        clinic_name: clinic,
        from_date: fromdate,
        from_time: fromtime,
        to_time: totime,
        notes: null,
      };
      var clinictimimg = await axios
        .post(
          `${process.env.REACT_APP_SERVER}/availability/update/${availability_id}`,
          data
        )
        .then((res) => {
          return res.data;
        });
      if (clinictimimg === true) {
        window.location.reload();
      }
    } else {
      var datanew = {
        doctor_id: userid,
        clinic_name: clinic,
        from_date: fromdate,
        from_time: fromtime,
        to_time: totime,
        notes: checkedValue.toString(),
      };
      var clinictimimgnew = await axios
        .post(
          `${process.env.REACT_APP_SERVER}/availability/update/${availability_id}`,
          datanew
        )
        .then((res) => {
          return res.data;
        });
      if (clinictimimgnew === true) {
        window.location.reload();
      }
    }
  };
  updateoutoff = async (e) => {
    var availability_id = sessionStorage.getItem("availability_id");
    var clinic = document.getElementById("clinic").value;
    var fromdate = document.getElementById("fromdate").value;
    var notes = document.getElementById("notes").value;
    var data = {
      clinic_name: clinic,
      from_date: fromdate,
      out_of_office: true,
      notes: notes,
    };
    var clinictimimg = await axios
      .post(
        `${process.env.REACT_APP_SERVER}/availability/update/${availability_id}`,
        data
      )
      .then((res) => {
        return res.data;
      });
    if (clinictimimg === true) {
      window.location.reload();
    }
  };

  editbtn = async (e) => {
    const { clinicdatafinal } = this.state;
    this.setState({
      editdata: clinicdatafinal[e.target.id],
    });

    // var clinictimimg = await axios
    //   .get(`${process.env.REACT_APP_SERVER}/availability/${e.target.id}`)
    //   .then((res) => {
    //     return res.data;
    //   });
    // if (clinictimimg.length !== 0) {
    //   this.setState({
    //     availabilityform: true,
    //     availabilitybtn: false,
    //     clinicdisplay: false,
    //     updatebtn: true,
    //     savebtn: false,
    //   });
    //   sessionStorage.setItem(
    //     "availability_id",
    //     clinictimimg[0].availability_id
    //   );
    //   document.getElementById(
    //     "clinic"
    //   ).innerHTML = `<option value="${clinictimimg[0].clinic_name}" selected>${clinictimimg[0].clinic_name}</option>`;
    //   document.getElementById("fromdate").value = clinictimimg[0].from_date;
    //   this.setState({
    //     fromtimeinput: new Date(
    //       `${clinictimimg[0].from_date}, ${clinictimimg[0].from_time}`
    //     ),
    //     totimeinput: new Date(
    //       `${clinictimimg[0].from_date}, ${clinictimimg[0].to_time}`
    //     ),
    //     fromtime: clinictimimg[0].from_time,
    //     totime: clinictimimg[0].to_time,
    //     fromdate: clinictimimg[0].from_date,
    //   });
    // }
  };
  editbtnout = async (e) => {
    var clinictimimg = await axios
      .get(`${process.env.REACT_APP_SERVER}/availability/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (clinictimimg.length !== 0) {
      this.setState({
        outofficeformedit: true,
        outofclinicdisplay: false,
      });
      sessionStorage.setItem(
        "availability_id",
        clinictimimg[0].availability_id
      );
      document.getElementById("fromdate").value = clinictimimg[0].from_date;
      document.getElementById("notes").value = clinictimimg[0].notes;
      document.getElementById(
        "clinic"
      ).innerHTML = `<option value="${clinictimimg[0].clinic_name}" selected>${clinictimimg[0].clinic_name}</option>`;
    }
  };
  addavailability = () => {
    this.setState({
      availabilityform: true,
      availabilitybtn: false,
    });
  };
  cancel = () => {
    // this.setState({
    //     availabilitybtn: true,
    //     availabilityform: false,
    //     clinicdisplay: true
    // })
    window.location.reload();
  };
  selectdate = (e) => {
    console.log(e.target.id);

    if (e.target.id === "Sunday") {
      var data = document
        .getElementById("Sunday")
        .classList.contains("mystyle");
      if (data === true) {
        document.getElementById("Sunday").classList.remove("mystyle");
      } else {
        document.getElementById("Sunday").classList.add("mystyle");
      }
    } else if (e.target.id === "Monday") {
      var datamon = document
        .getElementById("Monday")
        .classList.contains("mystyle");
      if (datamon === true) {
        document.getElementById("Monday").classList.remove("mystyle");
      } else {
        document.getElementById("Monday").classList.add("mystyle");
      }
    } else if (e.target.id === "Tuesday") {
      var datamontue = document
        .getElementById("Tuesday")
        .classList.contains("mystyle");
      if (datamontue === true) {
        document.getElementById("Tuesday").classList.remove("mystyle");
      } else {
        document.getElementById("Tuesday").classList.add("mystyle");
      }
    } else if (e.target.id === "Wednesday") {
      var datamontueWed = document
        .getElementById("Wednesday")
        .classList.contains("mystyle");
      if (datamontueWed === true) {
        document.getElementById("Wednesday").classList.remove("mystyle");
      } else {
        document.getElementById("Wednesday").classList.add("mystyle");
      }
    } else if (e.target.id === "Thursday") {
      var Thursdaydata = document
        .getElementById("Thursday")
        .classList.contains("mystyle");
      if (Thursdaydata === true) {
        document.getElementById("Thursday").classList.remove("mystyle");
      } else {
        document.getElementById("Thursday").classList.add("mystyle");
      }
    } else if (e.target.id === "Friday") {
      var Fridaydata = document
        .getElementById("Friday")
        .classList.contains("mystyle");
      if (Fridaydata === true) {
        document.getElementById("Friday").classList.remove("mystyle");
      } else {
        document.getElementById("Friday").classList.add("mystyle");
      }
    } else if (e.target.id === "Saturday") {
      var Saturdaydata = document
        .getElementById("Saturday")
        .classList.contains("mystyle");
      if (Saturdaydata === true) {
        document.getElementById("Saturday").classList.remove("mystyle");
      } else {
        document.getElementById("Saturday").classList.add("mystyle");
      }
    }
    var inputElements = document.getElementsByClassName("mystyle");
    var checkedValue = [];
    for (var i = 0; inputElements[i]; ++i) {
      checkedValue.push(inputElements[i].outerText);
    }
    console.log(checkedValue);
    this.setState({
      checkedValue: checkedValue,
    });
  };
  addbtnweek = () => {
    const { fromtime, totime } = this.state;
    var arraytotime = [],
      arrayfromtime = [];
    var clinicname = document.getElementById("clinic").value;
    var fromtimeavail = fromtime;
    var totimeavail = totime;
    var fromdateavail = document.getElementById("fromdate").value;
    arraytotime.push(totimeavail);
    arrayfromtime.push(fromtimeavail);
    if (fromtimeavail.length === 0) {
      toast.info("From time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (totimeavail.length === 0) {
      toast.info("To time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (fromdateavail.length === 0) {
      toast.info("From date Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var data = {
        fromtimearray: arrayfromtime,
        totimearray: arraytotime,
        clinic: clinicname,
        fromtime: fromtimeavail,
        totime: totimeavail,
        fromdate: fromdateavail,
        savebtn: true,
        weekly: true,
      };
      this.setState({
        fromtimearray: arrayfromtime,
        totimearray: arraytotime,
        clinic: clinicname,
        fromtime: fromtimeavail,
        totime: totimeavail,
        fromdate: fromdateavail,
        savebtn: true,
        weeklyslotdata: data,
      });
    }
    console.log("okk");
  };
  savebtnweek = async () => {
    const { clinic, fromtime, totime, fromdate, userid, checkedValue } =
      this.state;

    if (clinic == null) {
      toast.info("Clinic name Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (fromtime == null) {
      toast.info("From time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (totime == null) {
      toast.info("To time Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (fromdate == null) {
      toast.info("From date Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var data = {
        doctor_id: userid,
        clinic_name: clinic,
        from_date: fromdate,
        from_time: fromtime,
        to_time: totime,
        weekly: true,
        notes: checkedValue.toString(),
      };
    }
    var clinicdata = await axios
      .post(`${process.env.REACT_APP_SERVER}/availability/`, data)
      .then((res) => {
        return res.data;
      });
    if (clinicdata === true) {
      window.location.reload();
    }
  };
  outoffice = () => {
    this.setState({
      availabilitybtn: false,
      outofficebtn: true,
      availabilityform: false,
      outofclinicdisplay: true,
      clinicdisplay: false,
      weekly: false,
    });
  };
  outofficebtn = () => {
    this.setState({
      outofficeform: true,
      outofficebtn: false,
      clinicdisplay: false,
    });
  };
  availability = () => {
    this.setState({
      availabilitybtn: true,
      outofficebtn: false,
      outofficeform: false,
      outofclinicdisplay: false,
      clinicdisplay: true,
    });
  };
  saveoutoff = async () => {
    const { userid } = this.state;
    var clinic = document.getElementById("clinic").value;
    var fromdate = document.getElementById("fromdate").value;
    var notes = document.getElementById("notes").value;
    var data = {
      doctor_id: userid,
      clinic_name: clinic,
      from_date: fromdate,
      out_of_office: true,
      notes: notes,
    };
    var clinicdata = await axios
      .post(`${process.env.REACT_APP_SERVER}/availability/`, data)
      .then((res) => {
        return res.data;
      });
    if (clinicdata === true) {
      window.location.reload();
    }
  };
  nextstep = () => {
    this.setState({
      loader: true,
    });
    window.location.replace("/Review_edit_Doctor");
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
  handlechangetime = (e) => {
    const { fromtime } = this.state;
    var httime = moment(e).format("HH:mm");
    if (fromtime.length === 0) {
      this.setState({
        fromtime: httime,
        fromtimeinput: e,
      });
    } else {
      this.setState({
        fromtime: httime,
        fromtimeinput: e,
      });
    }
  };
  handlechangetimeto = (e) => {
    var httime = moment(e).format("h:mm A");
    const [time, modifier] = httime.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    var newtime = `${hours}:${minutes}`;
    if (hours < 10) {
      var newtimenew = `${0}${hours}:${minutes}`;
      this.setState({
        totime: newtimenew,
        totimeinput: e,
      });
    } else {
      this.setState({
        totime: newtime,
        totimeinput: e,
      });
    }
  };
  backbtn = () => {
    window.location.replace("/Review_edit_Doctor");
  };
  savebtnedit = async (e) => {
    var fromtime = document.getElementById(`fromtime${e.target.name}`).value;
    var totime = document.getElementById(`totime${e.target.name}`).value;
    var data = {
      from_time: fromtime,
      to_time: totime,
    };
    var clinictimimg = await axios
      .post(
        `${process.env.REACT_APP_SERVER}/availability/update/${e.target.id}`,
        data
      )
      .then((res) => {
        return res.data;
      });
    if (clinictimimg === true) {
      toast.success("Updated...", {
        autoClose: 2000,
        transition: Slide,
      });
      // window.location.reload();
    }
  };
  render() {
    const {
      availabilityform,
      availabilitybtn,
      clinicdata,

      clinicdatafinal,
      weekly,
      outofficeform,
      outofficebtn,
      updatebtn,
      clinicdataoutfinal,
      outofficeformedit,
      totimeinput,
      fromtimeinput,
      dailyslotdata,
      weeklyslotdata,
      loader,
      editdata,
    } = this.state;
    console.log(editdata);
    return (
      <div className="row">
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
            <b>Complete Your Profile</b>
          </h4>
          <h5>Personal Details</h5>
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
              <button className="btn addrecep  ml-3" onClick={this.nextstep}>
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Loading...</span>
              </button>
            )}
          </div>
          <div className="row">
            <div className="row">
              <div className="col-md-2 col-6">
                <a href="##" className="timimghead" onClick={this.availability}>
                  My Availability
                </a>
              </div>
              <div className="col-md-4 col-6">
                <a href="##" className="timimghead" onClick={this.outoffice}>
                  Out Of Office / Public Holiday
                </a>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row mt-5">
              {availabilitybtn === true ? (
                <div className="col-md-3">
                  <button
                    className="btn addrecep"
                    onClick={this.addavailability}
                  >
                    {" "}
                    <GoPlusSmall /> Add Availability{" "}
                  </button>
                </div>
              ) : null}
              {outofficebtn === true ? (
                <div className="col-md-3">
                  <button className="addbtn" onClick={this.outofficebtn}>
                    {" "}
                    <GoPlusSmall /> Add OutOffice{" "}
                  </button>
                </div>
              ) : null}
            </div>
            {availabilityform === true ? (
              <div className="row">
                <div className="col-md-4">
                  <div className="mt-3">
                    <label>
                      <b>
                        Select Clinic <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <select className="form-control" id="clinic">
                      {clinicdata.length !== 0 ? (
                        clinicdata.map((data, index) => (
                          <option key={index} value={data}>
                            {data}
                          </option>
                        ))
                      ) : (
                        <option selected disabled>
                          No clinic to manage
                        </option>
                      )}
                    </select>
                  </div>
                  <div className="mt-3">
                    <label>
                      <b>
                        Availability For <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <div className="row dailybtn">
                      <div className="col-sm-3 radiobtn">
                        <input
                          type="radio"
                          name="daily"
                          checked
                          value="daily"
                          onClick={(e) => this.handlechange(e)}
                          className="radio-input"
                        />
                        <label htmlFor="daily" className="radio-label">
                          {" "}
                          <span className="radio-border"></span> <b> Daily</b>{" "}
                        </label>
                      </div>
                      <div className="col-sm-1"></div>
                      <div className="col-sm-3 radiobtn">
                        <input
                          type="radio"
                          name="weekly"
                          value="weekly"
                          onClick={(e) => this.handlechangenew(e)}
                          className="radio-input"
                        />
                        <label htmlFor="weekly" className="radio-label">
                          <span className="radio-border"></span>
                          <b> Weekly</b>{" "}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label>
                      <b>
                        From & To Time (Enter time in 24 hr format){" "}
                        <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <div style={{ marginTop: "10px" }} className="row">
                      <div className="col-sm-6">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            id="fromtime"
                            ampm={false}
                            openTo="hours"
                            views={["hours", "minutes"]}
                            inputFormat="HH:mm"
                            mask="__:__"
                            value={fromtimeinput}
                            onChange={(e) => this.handlechangetime(e)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="col-sm-6">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            id="totime"
                            ampm={false}
                            openTo="hours"
                            views={["hours", "minutes"]}
                            inputFormat="HH:mm"
                            mask="__:__"
                            value={totimeinput}
                            onChange={(e) => this.handlechangetimeto(e)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label>
                      <b>
                        From Date <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="date"
                      id="fromdate"
                      className="form-control"
                      name="radio-group"
                    />
                  </div>
                  <div className="mt-5">
                    <button
                      className="cancelbtn btn-sm m-1"
                      onClick={this.addbtn}
                    >
                      Add Slot
                    </button>
                  </div>
                  {dailyslotdata.fromtime !== undefined ? (
                    <div className="mt-2">
                      <span className="timedisplay">
                        {dailyslotdata.fromtime}- to -{dailyslotdata.totime}
                      </span>
                    </div>
                  ) : null}
                  {weeklyslotdata.fromtime !== undefined ? (
                    <div className="mt-2">
                      <span className="timedisplay">
                        {weeklyslotdata.fromtime}- to -{weeklyslotdata.totime}
                      </span>
                    </div>
                  ) : null}

                  <div className="row">
                    {updatebtn === true ? (
                      <div className="col-md-8">
                        <div className="mt-3">
                          <button className="addbtn" onClick={this.updatebtn}>
                            Update Availability
                          </button>
                        </div>
                      </div>
                    ) : this.state.savebtn === true ? (
                      <div className="col-md-8">
                        <div className="mt-3">
                          <button className="savebtn" onClick={this.savebtn}>
                            Save & Add New
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="col-md-4">
                      <div className="mt-3">
                        <button
                          className="cancelbtn btn-sm m-1"
                          onClick={this.cancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {weekly === true ? (
              <div className="row">
                <div className="col-md-12">
                  <div className="mt-3 col-md-4">
                    <label>
                      <b>
                        Select Clinic <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <select className="form-control" id="clinic">
                      {clinicdata.length !== 0
                        ? clinicdata.map((data, index) => (
                            <option key={index} value={data}>
                              {data}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div className="mt-3 col-md-4">
                    <label>
                      <b>
                        Availability For <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <div className="row dailybtn">
                      <div className="col-sm-3 radiobtn">
                        <input
                          type="radio"
                          name="daily"
                          value="daily"
                          onClick={(e) => this.handlechange(e)}
                          className="radio-input"
                        />
                        <label htmlFor="daily" className="radio-label">
                          {" "}
                          <span className="radio-border"></span> <b> Daily</b>{" "}
                        </label>
                      </div>
                      <div className="col-sm-1"></div>
                      <div className="col-sm-3 radiobtn">
                        <input
                          type="radio"
                          name="weekly"
                          checked
                          value="weekly"
                          onClick={(e) => this.handlechangenew(e)}
                          className="radio-input"
                        />
                        <label htmlFor="weekly" className="radio-label">
                          <span className="radio-border"></span>
                          <b> Weekly</b>{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <label>
                      <b>Select Days </b>
                    </label>
                    <div className="col-sm-1">
                      <div
                        value="Sunday"
                        id="Sunday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Sun
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div
                        value="Monday"
                        id="Monday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Mon
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div
                        value="Tuesday"
                        id="Tuesday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Tue
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div
                        value="Wednesday"
                        id="Wednesday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Wed
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div
                        value="Thursday"
                        id="Thursday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Thu
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div
                        value="Friday"
                        id="Friday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Fri
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div
                        value="Saturday"
                        id="Saturday"
                        onClick={this.selectdate}
                        className="daysbutton"
                      >
                        Sat
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 col-md-4">
                    <label>
                      <b>
                        From & To Time (Enter time in 24 hr format){" "}
                        <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <div className="row">
                      <div className="col-sm-6">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            id="fromtime"
                            ampm={false}
                            openTo="hours"
                            views={["hours", "minutes"]}
                            inputFormat="HH:mm"
                            mask="__:__"
                            value={fromtimeinput}
                            onChange={(e) => this.handlechangetime(e)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="col-sm-6">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            id="totime"
                            ampm={false}
                            openTo="hours"
                            views={["hours", "minutes"]}
                            inputFormat="HH:mm"
                            mask="__:__"
                            value={totimeinput}
                            onChange={(e) => this.handlechangetimeto(e)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 col-md-4">
                    <label>
                      <b>
                        From Date <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="date"
                      id="fromdate"
                      className="form-control"
                      name="radio-group"
                    />
                  </div>
                  <div className="mt-5 col-md-4">
                    <button
                      className="cancelbtn btn-sm m-1"
                      onClick={this.addbtnweek}
                    >
                      Add Slot
                    </button>
                  </div>
                  {dailyslotdata.fromtime !== undefined ? (
                    <div className="mt-2">
                      <span className="timedisplay">
                        {dailyslotdata.fromtime}- to -{dailyslotdata.totime}
                      </span>
                    </div>
                  ) : null}
                  {weeklyslotdata.fromtime !== undefined ? (
                    <div className="mt-2">
                      <span className="timedisplay">
                        {weeklyslotdata.fromtime}- to -{weeklyslotdata.totime}
                      </span>
                    </div>
                  ) : null}

                  <div className="row">
                    {updatebtn === true ? (
                      <div className="col-md-8">
                        <div className="mt-3">
                          <button className="addbtn" onClick={this.updatebtn}>
                            Update Availability
                          </button>
                        </div>
                      </div>
                    ) : this.state.savebtn === true ? (
                      <div className="col-md-8">
                        <div className="mt-3">
                          <button className="savebtn" onClick={this.savebtn}>
                            Save & Add New
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="col-md-4">
                      <div className="mt-3">
                        <button
                          className="cancelbtn btn-sm m-1"
                          onClick={this.cancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {outofficeform === true ? (
              <div className="row">
                <div className="col-md-4">
                  <div className="mt-3">
                    <label>
                      <b>
                        Select Clinic <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <select className="form-control" id="clinic">
                      {clinicdata.length !== 0
                        ? clinicdata.map((data, index) => (
                            <option key={index} value={data}>
                              {data}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div className="mt-3">
                    <label>
                      <b>
                        Select Date <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="date"
                      id="fromdate"
                      className="form-control"
                      name="radio-group"
                    />
                  </div>
                  <div className="mt-3">
                    <label>
                      <b>Notes</b>
                    </label>
                    <textarea id="notes" className="form-control"></textarea>
                  </div>
                  <div className="row col-md-12">
                    <div className="col-md-8">
                      <div className="mt-3">
                        <button className="savebtn" onClick={this.saveoutoff}>
                          Save & Add New
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mt-3">
                        <button
                          className="cancelbtn btn-sm m-1"
                          onClick={this.cancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {outofficeformedit === true ? (
              <div className="row">
                <div className="col-md-4">
                  <div className="mt-3">
                    <label>
                      <b>
                        Select Clinic <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <select className="form-control" id="clinic">
                      {clinicdata.length !== 0
                        ? clinicdata.map((data, index) => (
                            <option key={index} value={data}>
                              {data}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div className="mt-3">
                    <label>
                      <b>
                        Select Date <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="date"
                      id="fromdate"
                      className="form-control"
                      name="radio-group"
                    />
                  </div>
                  <div className="mt-3">
                    <label>
                      <b>Notes</b>
                    </label>
                    <textarea id="notes" className="form-control"></textarea>
                  </div>
                  <div className="row col-md-12">
                    <div className="col-md-8">
                      <div className="mt-3">
                        <button className="savebtn" onClick={this.updateoutoff}>
                          Update Availability
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mt-3">
                        <button
                          className="cancelbtn btn-sm m-1"
                          onClick={this.cancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {this.state.clinicdisplay === true ? (
              <div className="col-md-12 text-center">
                {clinicdatafinal.length !== 0 ? (
                  <div className="row mt-5">
                    <div className="col-sm-3 col-4">
                      <span className="clinichead">
                        <b>Clinic / Hospital</b>
                      </span>
                    </div>
                    <div className="col-sm-2 col-4">
                      <span className="clinichead">
                        <b>Days</b>
                      </span>
                    </div>
                    <div className="col-sm-5 col-4">
                      <span className="clinichead">
                        <b>Time</b>
                      </span>
                    </div>
                    <div className="col-sm-1 col-4">
                      <span className="clinichead">
                        <b>Action</b>
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
                                            {datanew.notes === "Mon"
                                              ? "Monday"
                                              : datanew.notes === "Tue"
                                              ? "Tuesday"
                                              : datanew.notes === "Wed"
                                              ? "Wednesday"
                                              : datanew.notes === "Thu"
                                              ? "Thursday"
                                              : datanew.notes === "Fri"
                                              ? "Friday"
                                              : datanew.notes === "Sat"
                                              ? "Saturday"
                                              : datanew.notes === "Sun"
                                              ? "Sunday"
                                              : null}
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
                                            {datanew.from_time} -{" "}
                                            {datanew.to_time}
                                          </span>
                                          <br />
                                        </>
                                      ))
                                    : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-3 col-4">
                              <button
                                className="editbtnnew btn-sm m-1"
                                onClick={this.editbtn}
                                id={index}
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                // id={datafinal.availability_id}
                              >
                                {" "}
                                <MdEdit /> Edit
                              </button>
                              {/* <button
                              className="deletebtn"
                              onClick={this.deletebtn}
                              id={datafinal.availability_id}
                            >
                              <AiOutlineClose />
                              Delete{" "}
                            </button> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            ) : null}
            <div
              class="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content" style={{ width: "150%" }}>
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">
                      Edit Availability
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div className="row ">
                      <div className="col-sm-5 col-4">
                        <span className="clinichead">
                          <b>Day</b>
                        </span>
                      </div>
                      <div className="col-sm-3 col-4">
                        <span className="clinichead">
                          <b>Time</b>
                        </span>
                      </div>
                      <div className="col-sm-4 col-4">
                        <span className="clinichead">
                          <b>Action</b>
                        </span>
                      </div>
                    </div>

                    <div className="card mt-2">
                      {editdata.length !== 0
                        ? editdata.availability.map((datafinal, index) => (
                            <div className="card-body mt-2">
                              <div className="row">
                                <div className="col-sm-4 col-4">
                                  <span className="clinichead">
                                    {datafinal.notes === "Mon"
                                      ? "Monday"
                                      : datafinal.notes === "Tue"
                                      ? "Tuesday"
                                      : datafinal.notes === "Wed"
                                      ? "Wednesday"
                                      : datafinal.notes === "Thu"
                                      ? "Thursday"
                                      : datafinal.notes === "Fri"
                                      ? "Friday"
                                      : datafinal.notes === "Sat"
                                      ? "Saturday"
                                      : datafinal.notes === "Sun"
                                      ? "Sunday"
                                      : null}
                                  </span>
                                </div>

                                <div className="col-sm-4 col-4">
                                  <div className="row">
                                    <div className="col-sm-12">
                                      <input
                                        className="timeinput"
                                        id={`fromtime${index}`}
                                        type="time"
                                        defaultValue={datafinal.from_time}
                                      />
                                      <input
                                        className="timeinput"
                                        id={`totime${index}`}
                                        type="time"
                                        defaultValue={datafinal.to_time}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4 col-4">
                                  <button
                                    className="editbtnnew btn-sm m-1"
                                    onClick={this.savebtnedit}
                                    id={datafinal.availability_id}
                                    name={index}
                                  >
                                    {" "}
                                    <MdEdit /> Save
                                  </button>
                                  <button
                                    className="deletebtn"
                                    onClick={this.deletebtn}
                                    id={datafinal.availability_id}
                                  >
                                    <AiOutlineClose />
                                    Delete{" "}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                              <button
                                className="editbtn btn-sm m-1"
                                onClick={this.editbtnout}
                                id={datafinal.availability_id}
                              >
                                {" "}
                                <MdEdit /> Edit
                              </button>
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

        <ToastContainer />
      </div>
    );
  }
}
