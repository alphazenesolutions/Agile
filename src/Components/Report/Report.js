import React, { Component } from "react";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import moment from "moment";
import { allappointment } from "../../apis/appointment";


export default class Report extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      shakeholder: null,
      routeplan: null,
      usingapplication: null,
      plan: null,
      startdate: null,
      loader: false,
      enddate: null,
      routeplancard: false,
      performancecard: false,
      reportuserinfo: [],
      role: null,
      downloadbtn: false,
      userinfodatas: [
        {
          key: "profile_pic",
          value: "PHOTO",
        },
        {
          key: "initial",
          value: "INITIALS",
        },
        {
          key: "first_name",
          value: "FIRST NAME",
        },
        {
          key: "last_name",
          value: "LAST NAME",
        },
        {
          key: "mobile_number",
          value: "MOBILE NUMBER",
        },
        {
          key: "email",
          value: "E-MAIL",
        },
        {
          key: "degree",
          value: "Degree",
        },
        {
          key: "speciality",
          value: "Speciality",
        },
        {
          key: "Doctor Call Freequency",
          value: "Doctor Call Freequency",
        },
      ],
      userinfodatasvistingcard: [
        {
          key: "meeting_date",
          value: "DATE OF APPOINTMENT",
        },
        {
          key: "meeting_type",
          value: "VIRTUAL / INCLINIC",
        },
        {
          key: "isinstant",
          value: "CALL TYPE - INSTANT Y / N",
        },
        {
          key: "clinic_name",
          value: "CLINIC NAME",
        },
        {
          key: "address",
          value: "CLINIC ADDRESS",
        },
        {
          key: "city",
          value: "CITY",
        },
        {
          key: "state",
          value: "STATE",
        },
        {
          key: "country",
          value: "COUNTRY",
        },
        {
          key: "postal_code",
          value: "POSTAL CODE",
        },
        {
          key: "participates",
          value: "ADD PARTICIPANT INVITED",
        },
      ],
      userinfodataspending: [
        {
          key: "meeting_date",
          value: "DATE OF APPOINTMENT",
        },
        {
          key: "meeting_type",
          value: "VIRTUAL / INCLINIC",
        },
        {
          key: "isinstant",
          value: "CALL TYPE - INSTANT Y / N",
        },
        {
          key: "isinstant",
          value: "APPOINTMENT SESSION TIME",
        },
        {
          key: "clinic_name",
          value: "CLINIC NAME",
        },
        {
          key: "address",
          value: "CLINIC ADDRESS",
        },
        {
          key: "city",
          value: "CITY",
        },
        {
          key: "state",
          value: "STATE",
        },
        {
          key: "country",
          value: "COUNTRY",
        },
        {
          key: "postal_code",
          value: "POSTAL CODE",
        },
        {
          key: "participates",
          value: "ADD PARTICIPANT INVITED",
        },
      ],
      userinfodatasdrperformance: [
        {
          key: "meeting_date",
          value: "DATE OF APPOINTMENT",
        },
        {
          key: "meeting_type",
          value: "VIRTUAL / INCLINIC",
        },
        {
          key: "isinstant",
          value: "CALL TYPE - INSTANT Y / N",
        },
        {
          key: "clinic_name",
          value: "CLINIC NAME",
        },
        {
          key: "meeting_time",
          value: "APPOINTMENT SESSION TIME",
        },
        {
          key: "waitingroom_time",
          value: "WAITING TIME",
        },
        {
          key: "participates",
          value: "ADD PARTICIPANT INVITED",
        },
      ],
      userinfodatascompleteperformance: [
        {
          key: "DURATION OF CALL",
          value: "DURATION OF CALL",
        },
        {
          key: "TIME OF CALL",
          value: "TIME OF CALL",
        },
        {
          key: "PHOTO TAKEN",
          value: "PHOTO TAKEN",
        },
        {
          key: "VIDEO AVAILABLE",
          value: "VIDEO AVAILABLE",
        },
        {
          key: "SUMMARY OF CALL",
          value: "SUMMARY OF CALL",
        },
        {
          key: "ACTION POINT",
          value: "ACTION POINT",
        },
      ],
    };
  }
  componentDidMount = async () => {
    var userid =
      sessionStorage.getItem("userid") || localStorage.getItem("userid");
    var role = sessionStorage.getItem("role") || localStorage.getItem("role");
    this.setState({
      userid: userid,
      role: role,
    });
    if (role === "doctor") {
      this.setState({
        shakeholder: "mr"
      })
    } else if (role === "mr") {
      this.setState({
        shakeholder: "doctor"
      })
    }
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  generatereport = async () => {
    const { shakeholder, routeplan, plan, startdate, enddate, userid } =
      this.state;
    if (shakeholder === null) {
      toast.error("Please select Shakeholder..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (routeplan === null) {
      toast.error("Please select Routeplan..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (startdate === null) {
      toast.error("Please select Start Date..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (enddate === null) {
      toast.error("Please select End Date..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (plan === null) {
      toast.error("Please select Plan..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var connection = await axios
        .get(`${process.env.REACT_APP_SERVER}/connection/connect`)
        .then((res) => {
          return res.data;
        });
      var myconnection = await connection.filter((connections) => {
        return (
          (connections.to_id === userid || connections.from_id === userid) &&
          connections.connection_status === "Approved"
        );
      });
      var reportdata = [];
      for (var i = 0; i < myconnection.length; i++) {
        if (
          moment(myconnection[i].approved_date).format("YYYY-MM-DD") >=
          startdate &&
          moment(myconnection[i].approved_date).format("YYYY-MM-DD") <= enddate
        ) {
          reportdata.push(myconnection[i]);
        }
      }
      if (reportdata.length !== 0) {
        if (plan === "routeplan") {
          this.setState({
            routeplancard: true,
            performancecard: false,
            downloadbtn: true,
          });
        } else {
          this.setState({
            routeplancard: false,
            performancecard: true,
            downloadbtn: true,
          });
        }

        var allusers = await axios
          .get(`${process.env.REACT_APP_SERVER}/users/`)
          .then((res) => {
            return res.data;
          });
        var userinfo = [];
        for (var j = 0; j < reportdata.length; j++) {
          if (reportdata[j].from_id === userid) {
            for (var a = 0; a < allusers.length; a++) {
              if (allusers[a].userid === reportdata[j].to_id || allusers[a].role === shakeholder) {
                userinfo.push(allusers[a].userid);
              }
            }
          } else {
            for (var b = 0; b < allusers.length; b++) {
              if (
                allusers[b].userid === reportdata[j].from_id ||
                allusers[b].role === shakeholder
              ) {
                userinfo.push(allusers[b].userid);
              }
            }
          }
        }
        this.setState({
          reportuserinfo: userinfo,
        });
      } else {
        toast.error("No Data Found", {
          autoClose: 2000,
          transition: Slide,
        });
      }
    }
  };
  downloadReport = async () => {
    const {
      reportuserinfo,
      userid,
      plan,
      role,
      userinfodatas,
      userinfodatasvistingcard,
      userinfodataspending,
      userinfodatasdrperformance,
      userinfodatascompleteperformance,
    } = this.state;
    toast.info("Please Wait...", {
      autoClose: 5000,
      transition: Slide,
    });
    this.setState({
      loader: true
    })
    var user_infos = document.getElementsByName("user_info");
    var clinic_infos = document.getElementsByName("clinic_info");
    var pending_apps = document.getElementsByName("pending_app");
    var call_info = document.getElementsByName("call_info");
    var per_clinic_info = document.getElementsByName("per_clinic_info");
    var user_infosdata = [],
      clinic_infosdata = [],
      pending_appsdata = [],
      per_clinic_infodata = [],
      call_infodata = [];
    for (var i = 0; i < user_infos.length; i++) {
      if (user_infos[i].checked) {
        user_infosdata.push(user_infos[i].value);
      }
    }
    for (var a = 0; a < clinic_infos.length; a++) {
      if (clinic_infos[a].checked) {
        clinic_infosdata.push(clinic_infos[a].value);
      }
    }
    for (var b = 0; b < pending_apps.length; b++) {
      if (pending_apps[b].checked) {
        pending_appsdata.push(pending_apps[b].value);
      }
    }
    for (var c = 0; c < per_clinic_info.length; c++) {
      if (per_clinic_info[c].checked) {
        per_clinic_infodata.push(per_clinic_info[c].value);
      }
    }
    for (var d = 0; d < call_info.length; d++) {
      if (call_info[d].checked) {
        call_infodata.push(call_info[d].value);
      }
    }
    const report_userinfodatas = [],
      report_approve_appointment = [],
      report_pending_appointment = [];
    for (var e = 0; e < reportuserinfo.length; e++) {
      const filter_user_info = await this.filter_user_infos(reportuserinfo[e]);
      report_userinfodatas.push(...filter_user_info);
    }
    const all_appintments = await allappointment();
    var dr_approve_appointment = await all_appintments.filter((appointment) => {
      return appointment.to_id === userid && appointment.status === "Approved";
    });
    var dr_pending_appointment = await all_appintments.filter((appointment) => {
      return appointment.to_id === userid && appointment.status === "Waiting";
    });
    var mr_approve_appointment = await all_appintments.filter((appointment) => {
      return (
        appointment.from_id === userid && appointment.status === "Approved"
      );
    });
    var mr_pending_appointment = await all_appintments.filter((appointment) => {
      return appointment.from_id === userid && appointment.status === "Waiting";
    });
    if (plan === "routeplan") {
      if (role === "doctor") {
        if (dr_approve_appointment.length !== 0) {
          for (var i = 0; i < dr_approve_appointment.length; i++) {
            var meetingType = `${dr_approve_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : dr_approve_appointment[i].tablename === "Single"
                ? dr_approve_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : dr_approve_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              meeting_id,
            } = dr_approve_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              dr_approve_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length !== 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id === SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                // eslint-disable-next-line no-loop-func
                (clinic) => clinic.clinic_name === clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_approve_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        if (dr_pending_appointment.length !== 0) {
          for (var i = 0; i < dr_pending_appointment.length; i++) {
            var meetingType = `${dr_pending_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : dr_pending_appointment[i].tablename === "single"
                ? dr_pending_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : dr_pending_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              meeting_id,
            } = dr_pending_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              dr_pending_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length !== 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id === SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name == clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_pending_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        var finalreport_userinfodatas = [],
          finalreport_approve_appointment = [],
          finalreport_pending_appointment = [];
        var newuser_infosdata = [];
        for (var i = 0; i < user_infosdata.length; i++) {
          var getValuedata = userinfodatas.filter(
            (data) => data.key === user_infosdata[i]
          );
          if (getValuedata.length !== 0) {
            newuser_infosdata.push(getValuedata[0].value);
          }
        }
        finalreport_userinfodatas.push(newuser_infosdata);
        var newclinic_infosdata = [];
        for (var i = 0; i < clinic_infosdata.length; i++) {
          var getValuedata = userinfodatasvistingcard.filter(
            (data) => data.key === clinic_infosdata[i]
          );
          if (getValuedata.length !== 0) {
            newclinic_infosdata.push(getValuedata[0].value);
          }
        }
        finalreport_approve_appointment.push(newclinic_infosdata);
        var newpending_appsdata = [];
        for (var i = 0; i < pending_appsdata.length; i++) {
          var getValuedata = userinfodataspending.filter(
            (data) => data.key == pending_appsdata[i]
          );
          if (getValuedata.length !== 0) {
            newpending_appsdata.push(getValuedata[0].value);
          }
        }
        finalreport_pending_appointment.push(newpending_appsdata);
        for (var i = 0; i < report_userinfodatas.length; i++) {
          var allvalues = [];
          for (var j = 0; j < user_infosdata.length; j++) {
            var vales = report_userinfodatas[i][user_infosdata[j]];
            allvalues.push(vales);
          }
          finalreport_userinfodatas.push(allvalues);
        }
        for (var i = 0; i < report_approve_appointment.length; i++) {
          var allvalues = [];
          for (var j = 0; j < clinic_infosdata.length; j++) {
            var vales = report_approve_appointment[i][clinic_infosdata[j]];
            allvalues.push(vales);
          }
          finalreport_approve_appointment.push(allvalues);
        }
        for (var i = 0; i < report_pending_appointment.length; i++) {
          var allvalues = [];
          for (var j = 0; j < pending_appsdata.length; j++) {
            var vales = report_pending_appointment[i][pending_appsdata[j]];
            allvalues.push(vales);
          }
          finalreport_pending_appointment.push(allvalues);
        }
        this.generaterouteExcel(
          finalreport_userinfodatas,
          finalreport_approve_appointment,
          finalreport_pending_appointment
        );
      } else {
        if (mr_approve_appointment.length !== 0) {
          for (var i = 0; i < mr_approve_appointment.length; i++) {
            var meetingType = `${mr_approve_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : mr_approve_appointment[i].tablename === "Single"
                ? mr_approve_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : mr_approve_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              meeting_id,
            } = mr_approve_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              mr_approve_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length !== 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id === SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name == clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_approve_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        if (mr_pending_appointment.length !== 0) {
          for (var i = 0; i < mr_pending_appointment.length; i++) {
            var meetingType = `${mr_pending_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : mr_pending_appointment[i].tablename === "single"
                ? mr_pending_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : mr_pending_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              meeting_id,
            } = mr_pending_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              mr_pending_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length != 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id === SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name === clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_pending_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        var finalreport_userinfodatas = [],
          finalreport_approve_appointment = [],
          finalreport_pending_appointment = [];
        var newuser_infosdata = [];
        for (var i = 0; i < user_infosdata.length; i++) {
          var getValuedata = userinfodatas.filter(
            (data) => data.key == user_infosdata[i]
          );
          if (getValuedata.length !== 0) {
            newuser_infosdata.push(getValuedata[0].value);
          }
        }
        finalreport_userinfodatas.push(newuser_infosdata);
        var newclinic_infosdata = [];
        for (var i = 0; i < clinic_infosdata.length; i++) {
          var getValuedata = userinfodatasvistingcard.filter(
            (data) => data.key == clinic_infosdata[i]
          );
          if (getValuedata.length !== 0) {
            newclinic_infosdata.push(getValuedata[0].value);
          }
        }
        finalreport_approve_appointment.push(newclinic_infosdata);
        var newpending_appsdata = [];
        for (var i = 0; i < pending_appsdata.length; i++) {
          var getValuedata = userinfodataspending.filter(
            (data) => data.key == pending_appsdata[i]
          );
          if (getValuedata.length !== 0) {
            newpending_appsdata.push(getValuedata[0].value);
          }
        }
        finalreport_pending_appointment.push(newpending_appsdata);
        for (var i = 0; i < report_userinfodatas.length; i++) {
          var allvalues = [];
          for (var j = 0; j < user_infosdata.length; j++) {
            var vales = report_userinfodatas[i][user_infosdata[j]];
            allvalues.push(vales);
          }
          finalreport_userinfodatas.push(allvalues);
        }
        for (var i = 0; i < report_approve_appointment.length; i++) {
          var allvalues = [];
          for (var j = 0; j < clinic_infosdata.length; j++) {
            var vales = report_approve_appointment[i][clinic_infosdata[j]];
            allvalues.push(vales);
          }
          finalreport_approve_appointment.push(allvalues);
        }
        for (var i = 0; i < report_pending_appointment.length; i++) {
          var allvalues = [];
          for (var j = 0; j < pending_appsdata.length; j++) {
            var vales = report_pending_appointment[i][pending_appsdata[j]];
            allvalues.push(vales);
          }
          finalreport_pending_appointment.push(allvalues);
        }

        this.generaterouteExcel(
          finalreport_userinfodatas,
          finalreport_approve_appointment,
          finalreport_pending_appointment
        );
      }
    } else {
      if (role === "doctor") {
        if (dr_approve_appointment.length !== 0) {
          for (var i = 0; i < dr_approve_appointment.length; i++) {
            var meetingType = `${dr_approve_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : dr_approve_appointment[i].tablename === "single"
                ? dr_approve_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : dr_approve_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var meeting_time = `${dr_approve_appointment[i].tablename === "Recurring"
              ? dr_approve_appointment[i].meeting_time
              : dr_approve_appointment[i].tablename === "single"
                ? dr_approve_appointment[i].meetingtype === "Virtual"
                  ? dr_approve_appointment[i].meeting_time
                  : dr_approve_appointment[i].meeting_slot
                : dr_approve_appointment[i].meeting_type === "Virtual"
                  ? dr_approve_appointment[i].meeting_time
                  : dr_approve_appointment[i].meeting_slot
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              waitingroom_time,
              meeting_id,
            } = dr_approve_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              dr_approve_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length != 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id == SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name == clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_approve_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  meeting_time: meeting_time,
                  waitingroom_time: waitingroom_time,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        if (dr_pending_appointment.length !== 0) {
          for (var i = 0; i < dr_pending_appointment.length; i++) {
            var meetingType = `${dr_pending_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : dr_pending_appointment[i].tablename === "single"
                ? dr_pending_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : dr_pending_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var meeting_time = `${dr_pending_appointment[i].tablename === "Recurring"
              ? dr_pending_appointment[i].meeting_time
              : dr_pending_appointment[i].tablename === "single"
                ? dr_pending_appointment[i].meetingtype === "Virtual"
                  ? dr_pending_appointment[i].meeting_time
                  : dr_pending_appointment[i].meeting_slot
                : dr_pending_appointment[i].meeting_type === "Virtual"
                  ? dr_pending_appointment[i].meeting_time
                  : dr_pending_appointment[i].meeting_slot
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              waitingroom_time,
              meeting_id,
            } = dr_pending_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              dr_pending_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length != 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id == SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name == clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_pending_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  meeting_time: meeting_time,
                  waitingroom_time: waitingroom_time,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        var finalreport_userinfodatas = [],
          finalreport_approve_appointment = [],
          finalreport_call_infodata = [];
        var newuser_infosdata = [];
        for (var i = 0; i < user_infosdata.length; i++) {
          var getValuedata = userinfodatas.filter(
            (data) => data.key == user_infosdata[i]
          );
          if (getValuedata.length !== 0) {
            newuser_infosdata.push(getValuedata[0].value);
          }
        }
        finalreport_userinfodatas.push(newuser_infosdata);
        var newper_clinic_infodata = [];
        for (var i = 0; i < per_clinic_infodata.length; i++) {
          var getValuedata = userinfodatasdrperformance.filter(
            (data) => data.key == per_clinic_infodata[i]
          );
          if (getValuedata.length !== 0) {
            newper_clinic_infodata.push(getValuedata[0].value);
          }
        }
        finalreport_approve_appointment.push(newper_clinic_infodata);
        var newcall_infodata = [];
        for (var i = 0; i < call_infodata.length; i++) {
          var getValuedata = userinfodatascompleteperformance.filter(
            (data) => data.key == call_infodata[i]
          );
          if (getValuedata.length !== 0) {
            newcall_infodata.push(getValuedata[0].value);
          }
        }
        finalreport_call_infodata.push(newcall_infodata);
        for (var i = 0; i < report_userinfodatas.length; i++) {
          var allvalues = [];
          for (var j = 0; j < user_infosdata.length; j++) {
            var vales = report_userinfodatas[i][user_infosdata[j]];
            allvalues.push(vales);
          }
          finalreport_userinfodatas.push(allvalues);
        }
        for (var i = 0; i < report_approve_appointment.length; i++) {
          var allvalues = [];
          for (var j = 0; j < per_clinic_infodata.length; j++) {
            var vales = report_approve_appointment[i][per_clinic_infodata[j]];
            allvalues.push(vales);
          }
          finalreport_approve_appointment.push(allvalues);
        }
        this.generateperformanceExcel(
          finalreport_userinfodatas,
          finalreport_approve_appointment,
          finalreport_call_infodata
        );
      } else {
        if (mr_approve_appointment.length !== 0) {
          for (var i = 0; i < mr_approve_appointment.length; i++) {
            var meetingType = `${mr_approve_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : mr_approve_appointment[i].tablename === "single"
                ? mr_approve_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : mr_approve_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var meeting_time = `${mr_approve_appointment[i].tablename === "Recurring"
              ? mr_approve_appointment[i].meeting_time
              : mr_approve_appointment[i].tablename === "single"
                ? mr_approve_appointment[i].meetingtype === "Virtual"
                  ? mr_approve_appointment[i].meeting_time
                  : mr_approve_appointment[i].meeting_slot
                : mr_approve_appointment[i].meeting_type === "Virtual"
                  ? mr_approve_appointment[i].meeting_time
                  : mr_approve_appointment[i].meeting_slot
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              waitingroom_time,
              meeting_id,
            } = mr_approve_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              mr_approve_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length != 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id == SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name == clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_approve_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  meeting_time: meeting_time,
                  waitingroom_time: waitingroom_time,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        if (mr_pending_appointment.length !== 0) {
          for (var i = 0; i < mr_pending_appointment.length; i++) {
            var meetingType = `${mr_pending_appointment[i].tablename === "Recurring"
              ? "Virtual"
              : mr_pending_appointment[i].tablename === "single"
                ? mr_pending_appointment[i].meetingtype === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
                : mr_pending_appointment[i].meeting_type === "Virtual"
                  ? "Virtual"
                  : "In Clinic"
              }`;
            var meeting_time = `${mr_pending_appointment[i].tablename === "Recurring"
              ? mr_pending_appointment[i].meeting_time
              : mr_pending_appointment[i].tablename === "single"
                ? mr_pending_appointment[i].meetingtype === "Virtual"
                  ? mr_pending_appointment[i].meeting_time
                  : mr_pending_appointment[i].meeting_slot
                : mr_pending_appointment[i].meeting_type === "Virtual"
                  ? mr_pending_appointment[i].meeting_time
                  : mr_pending_appointment[i].meeting_slot
              }`;
            var {
              clinic_name: clinic_names,
              meeting_date,
              from_id,
              waitingroom_time,
              meeting_id,
            } = mr_pending_appointment[i];
            const doctor_clinic_detailss = await this.doctor_clinic_details(
              mr_pending_appointment[i].to_id
            );
            const SingleParticipate = await this.singleparticipates(meeting_id);
            var newparticipates = "null";
            if (SingleParticipate.length != 0) {
              var allusers = await axios
                .get(`${process.env.REACT_APP_SERVER}/users/`)
                .then((res) => {
                  return res.data;
                });
              var participateuser = [];
              for (var j = 0; j < allusers.length; j++) {
                if (allusers[j].user_id == SingleParticipate[0].fromid) {
                  participateuser.push(allusers[j].email);
                }
              }
              newparticipates = participateuser;
            } else {
              newparticipates = "null";
            }
            if (doctor_clinic_detailss.length !== 0) {
              const myclinic = await doctor_clinic_detailss.filter(
                (clinic) => clinic.clinic_name == clinic_names
              );
              if (myclinic.length !== 0) {
                const {
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                } = myclinic[0];
                report_pending_appointment.push({
                  clinic_name,
                  city,
                  address,
                  country,
                  state,
                  postal_code,
                  meeting_type: meetingType,
                  meeting_date,
                  user_id: from_id,
                  meeting_time: meeting_time,
                  waitingroom_time: waitingroom_time,
                  participates: newparticipates,
                  isinstant: "yes",
                });
              }
            }
          }
        }
        var finalreport_userinfodatas = [],
          finalreport_approve_appointment = [],
          finalreport_call_infodata = [];
        var newuser_infosdata = [];
        for (var i = 0; i < user_infosdata.length; i++) {
          var getValuedata = userinfodatas.filter(
            (data) => data.key == user_infosdata[i]
          );
          if (getValuedata.length !== 0) {
            newuser_infosdata.push(getValuedata[0].value);
          }
        }
        finalreport_userinfodatas.push(newuser_infosdata);
        var newper_clinic_infodata = [];
        for (var i = 0; i < per_clinic_infodata.length; i++) {
          var getValuedata = userinfodatasdrperformance.filter(
            (data) => data.key == per_clinic_infodata[i]
          );
          if (getValuedata.length !== 0) {
            newper_clinic_infodata.push(getValuedata[0].value);
          }
        }
        finalreport_approve_appointment.push(newper_clinic_infodata);
        var newcall_infodata = [];
        for (var i = 0; i < call_infodata.length; i++) {
          var getValuedata = userinfodatascompleteperformance.filter(
            (data) => data.key == call_infodata[i]
          );
          if (getValuedata.length !== 0) {
            newcall_infodata.push(getValuedata[0].value);
          }
        }
        finalreport_call_infodata.push(newcall_infodata);
        for (var i = 0; i < report_userinfodatas.length; i++) {
          var allvalues = [];
          for (var j = 0; j < user_infosdata.length; j++) {
            var vales = report_userinfodatas[i][user_infosdata[j]];
            allvalues.push(vales);
          }
          finalreport_userinfodatas.push(allvalues);
        }
        for (var i = 0; i < report_approve_appointment.length; i++) {
          var allvalues = [];
          for (var j = 0; j < per_clinic_infodata.length; j++) {
            var vales = report_approve_appointment[i][per_clinic_infodata[j]];
            allvalues.push(vales);
          }
          finalreport_approve_appointment.push(allvalues);
        }
        this.generateperformanceExcel(
          finalreport_userinfodatas,
          finalreport_approve_appointment,
          finalreport_call_infodata
        );
      }
    }
  };
  filter_user_infos = async (userids) => {
    const { shakeholder } = this.state;
    var allfilterdata = new Promise(async (resolve, reject) => {
      const filter_user_infos = [];
      const allusers = await axios
        .get(`${process.env.REACT_APP_SERVER}/users/`)
        .then((res) => {
          return res.data;
        });
      const singleUser = await allusers.filter(
        (user) => user.userid === userids
      );
      if (shakeholder === "mr") {
        if (singleUser.length !== 0) {
          const {
            profile_pic,
            first_name,
            last_name,
            mobile_number,
            email,
            initial,
          } = singleUser[0];
          filter_user_infos.push({
            user_id: userids,
            profile_pic,
            initial,
            first_name,
            last_name,
            mobile_number,
            email,
            degree: "null",
            speciality: "null",
            "Doctor Call Freequency": "null",
          });
        }
      } else {
        if (singleUser.length !== 0) {
          const {
            profile_pic,
            first_name,
            last_name,
            mobile_number,
            email,
            initial,
          } = singleUser[0];
          const doctor_basic_detailss = await this.doctor_basic_details(
            userids
          );
          if (doctor_basic_detailss.length !== 0) {
            const { speciality, degree } = doctor_basic_detailss[0];
            filter_user_infos.push({
              user_id: userids,
              profile_pic,
              initial,
              first_name,
              last_name,
              mobile_number,
              email,
              degree: degree,
              speciality: speciality,
              "Doctor Call Freequency": "null",
            });
          } else {
            filter_user_infos.push({
              user_id: userids,
              profile_pic,
              initial,
              first_name,
              last_name,
              mobile_number,
              email,
              degree: "null",
              speciality: "null",
              "Doctor Call Freequency": "null",
            });
          }
        }
      }
      return resolve(filter_user_infos);
    });
    return await allfilterdata;
  };
  doctor_basic_details = async (doctorid) => {
    var result = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${doctorid}`)
      .then((res) => {
        return res.data;
      });
    return result;
  };
  doctor_clinic_details = async (doctorid) => {
    var result = await axios
      .get(`${process.env.REACT_APP_SERVER}/clinic/`)
      .then((res) => {
        return res.data;
      });
    var myresult = await result.filter((data) => {
      return data.doctors === doctorid;
    });
    return myresult;
  };
  singleparticipates = async (meeting_id) => {
    var result = await axios
      .get(`${process.env.REACT_APP_SERVER}/participate/view/${meeting_id}`)
      .then((res) => {
        return res.data;
      });
    return result;
  };
  generateperformanceExcel = async (userData, data1, data2) => {
    const { shakeholder, plan } = this.state;
    console.log(userData, data1, data2, "1")
    const generateExcel = await axios
      .post(`${process.env.REACT_APP_SERVER}/excel/performance`, {
        userData,
        data1,
        data2,
        role: shakeholder,
        types: plan,
      })
      .then((res) => res.data)
      .catch((err) => err);
    if (generateExcel) {
      if (generateExcel.status === true) {
        var a = document.createElement("a");
        a.setAttribute("download", generateExcel.path);
        a.setAttribute(
          "href",
          `${process.env.REACT_APP_SERVER}/downloads/${generateExcel.path}`
        );
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };
  generaterouteExcel = async (userData, data1, data2) => {
    console.log(userData, data1, data2, "2")
    const { shakeholder, plan } = this.state;
    const generateExcel = await axios
      .post(`${process.env.REACT_APP_SERVER}/excel/route`, {
        userData,
        data1,
        data2,
        role: shakeholder,
        types: plan,
      })
      .then((res) => res.data)
      .catch((err) => err);
    if (generateExcel) {
      if (generateExcel.status === true) {
        var a = document.createElement("a");
        a.setAttribute("download", generateExcel.path);
        a.setAttribute(
          "href",
          `${process.env.REACT_APP_SERVER}/downloads/${generateExcel.path}`
        );
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  render() {
    const { routeplancard, performancecard, downloadbtn, shakeholder, loader } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            {shakeholder !== null ? null :
              <div className="mt-3">
                <label>CHOOSE SHAKEHOLDER </label>
                <br />
                <button type="button" className="backbtn">
                  <input
                    type="radio"
                    name="shakeholder"
                    id="mrinput"
                    value="mr"
                    onChange={(e) => this.handlechange(e)}
                  />{" "}
                  <b>MR</b>
                </button>

                <button type="button" className="backbtn m-2">
                  <input
                    type="radio"
                    name="shakeholder"
                    value="doctor"
                    onChange={(e) => this.handlechange(e)}
                  />{" "}
                  <b>Doctor</b>
                </button>
              </div>}

            <div className="mt-3">
              <label>ROUTE PLAN </label>
              <br />
              <button type="button" className="backbtn">
                <input
                  type="radio"
                  name="routeplan"
                  value="yes"
                  onChange={(e) => this.handlechange(e)}
                />{" "}
                <b>YES</b>
              </button>
              <button type="button" className="backbtn m-2">
                <input
                  type="radio"
                  name="routeplan"
                  value="no"
                  onChange={(e) => this.handlechange(e)}
                />{" "}
                <b>NO</b>
              </button>
              <button type="button" className="backbtn m-2">
                <input
                  type="radio"
                  name="routeplan"
                  value="both"
                  onChange={(e) => this.handlechange(e)}
                />{" "}
                <b>Both</b>
              </button>
            </div>

            <div className="row mt-3">
              <div className="col-sm-6">
                <label>Starting Date </label>
                <br />
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control date"
                    name="startdate"
                    onChange={(e) => this.handlechange(e)}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <label>Ending Date </label>
                <br />
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control date"
                    name="enddate"
                    onChange={(e) => this.handlechange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label>ROUTE PLAN / PERFORMANCE </label>
              <br />
              <div className="row">
                <div className="col-sm-5">
                  <button type="button" width="108%" className="backbtnn">
                    <input
                      type="radio"
                      name="plan"
                      value="routeplan"
                      onChange={(e) => this.handlechange(e)}
                    />
                    <b> ROUTE PLAN</b>
                  </button>
                </div>
                <div className="col-sm-6">
                  <button type="button" className="backbtn">
                    <input
                      type="radio"
                      name="plan"
                      value="performance"
                      onChange={(e) => this.handlechange(e)}
                    />{" "}
                    <b>PERFORMANCE</b>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button className="backbtn" onClick={this.generatereport}>
                Generate Report
              </button>
            </div>
            {downloadbtn === true ? (
              <div className="mt-3">
                {loader === false ? <button className="backbtn" onClick={this.downloadReport}>
                  Download Report
                </button> : <button className="backbtn" >
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span class="sr-only">Loading...</span>
                </button>}

              </div>
            ) : null}
          </div>

          <div className="col-md-4">
            <h6>
              <b>DOCTOR INFORMATION RELEVANT FOR MR</b>
            </h6>
            <div className="card">
              <div className="card-body">
                <p>VISITING CARD INFORMATION</p>
                <div>
                  <input
                    className="drinfo"
                    type="checkbox"
                    id="user_info1"
                    name="user_info"
                    value="profile_pic"
                  />
                  <label for="user_info1"> PHOTO</label>
                  <br />
                  <input
                    className="drinfo"
                    type="checkbox"
                    checked
                    id="user_info2"
                    name="user_info"
                    value="initial"
                  />
                  <label for="user_info2"> INITIALS</label>
                  <br />
                  <input
                    className="drinfo"
                    type="checkbox"
                    checked
                    id="user_info3"
                    name="user_info"
                    value="first_name"
                  />
                  <label for="user_info3"> FIRST NAME</label>
                  <br />
                  <input
                    className="drinfo"
                    type="checkbox"
                    checked
                    id="user_info4"
                    name="user_info"
                    value="last_name"
                  />
                  <label for="user_info4"> LAST NAME</label>
                  <br />
                  <input
                    type="checkbox"
                    id="user_info5"
                    name="user_info"
                    value="mobile_number"
                  />
                  <label for="user_info5"> MOBILE NUMBER</label>
                  <br />
                  <input
                    type="checkbox"
                    id="user_info6"
                    name="user_info"
                    value="email"
                  />
                  <label for="user_info6"> E-MAIL</label>
                  <br />
                  <input
                    type="checkbox"
                    id="user_info7"
                    name="user_info"
                    value="degree"
                  />
                  <label for="user_info7"> Degree</label>
                  <br />
                  <input
                    type="checkbox"
                    checked
                    id="user_info8"
                    name="user_info"
                    value="speciality"
                  />
                  <label for="user_info8"> Speciality</label>
                  <br />
                  <p>DOCTOR CUSTOMER SEGMENTATION</p>
                  <input
                    type="checkbox"
                    checked
                    id="user_info9"
                    name="user_info"
                    value="Doctor Call Freequency"
                  />
                  <label for="user_info9"> Doctor Call Freequency</label>
                  <br />
                </div>
              </div>
            </div>
          </div>
          {routeplancard === true ? (
            <div className="col-md-4">
              <h6>
                <b>DOCTOR INDIVIDUAL APPOINTMENTS FOR 'PLAN'</b>
              </h6>
              <div className="card">
                <div className="card-body">
                  <p>VISITING CARD INFORMATION</p>
                  <div>
                    <input
                      type="checkbox"
                      checked
                      id="clinic_info1"
                      name="clinic_info"
                      value="meeting_date"
                    />
                    <label for="clinic_info1"> DATE OF APPOINTMENT</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="clinic_info2"
                      name="clinic_info"
                      value="meeting_type"
                    />
                    <label for="clinic_info2"> VIRTUAL / INCLINIC</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info3"
                      name="clinic_info"
                      value="isinstant"
                    />
                    <label for="clinic_info3"> CALL TYPE - INSTANT Y / N</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="clinic_info4"
                      name="clinic_info"
                      value="clinic_name"
                    />
                    <label for="clinic_info4"> CLINIC NAME</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info5"
                      name="clinic_info"
                      value="address"
                    />
                    <label for="clinic_info5"> CLINIC ADDRESS</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info6"
                      name="clinic_info"
                      value="city"
                    />
                    <label for="clinic_info6"> CITY</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info7"
                      name="clinic_info"
                      value="state"
                    />
                    <label for="clinic_info7"> STATE</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info8"
                      name="clinic_info"
                      value="country"
                    />
                    <label for="clinic_info8"> COUNTRY</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info9"
                      name="clinic_info"
                      value="postal_code"
                    />
                    <label for="clinic_info9"> POSTAL CODE</label>
                    <br />
                    <input
                      type="checkbox"
                      id="clinic_info10"
                      name="clinic_info"
                      value="participates"
                    />
                    <label for="clinic_info10"> ADD PARTICIPANT INVITED</label>
                    <br />

                    <p>DOCTOR PENDING APPOINTMENT</p>
                    <input
                      type="checkbox"
                      checked
                      id="pending_app11"
                      name="pending_app"
                      value="meeting_date"
                    />
                    <label for="pending_app11"> DATE OF APPOINTMENT</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="pending_app12"
                      name="pending_app"
                      value="meeting_type"
                    />
                    <label for="pending_app12"> VIRTUAL / INCLINIC</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app13"
                      name="pending_app"
                      value="meeting_type"
                    />
                    <label for="pending_app13">
                      {" "}
                      CALL TYPE - INSTANT Y / N
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="pending_app14"
                      name="pending_app"
                      value="isinstant"
                    />
                    <label for="pending_app14"> APPOINTMENT SESSION TIME</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="pending_app15"
                      name="pending_app"
                      value="clinic_name"
                    />
                    <label for="pending_app15"> CLINIC NAME</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app16"
                      name="pending_app"
                      value="address"
                    />
                    <label for="pending_app16"> CLINIC ADDRESS</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app17"
                      name="pending_app"
                      value="city"
                    />
                    <label for="pending_app17"> CITY</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app18"
                      name="pending_app"
                      value="state"
                    />
                    <label for="pending_app18"> STATE</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app19"
                      name="pending_app"
                      value="country"
                    />
                    <label for="pending_app19"> COUNTRY</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app20"
                      name="pending_app"
                      value="postal_code"
                    />
                    <label for="pending_app20"> POSTAL CODE</label>
                    <br />
                    <input
                      type="checkbox"
                      id="pending_app21"
                      name="pending_app"
                      value="participates"
                    />
                    <label for="pending_app21"> ADD PARTICIPANT INVITED</label>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {performancecard === true ? (
            <div className="col-md-4">
              <h6>
                <b>DOCTOR INDIVIDUAL APPOINTMENTS FOR 'PERFORMANCE'</b>
              </h6>
              <div className="card">
                <div className="card-body">
                  <div>
                    <p>COMPLETED</p>
                    <input
                      type="checkbox"
                      checked
                      id="per_clinic_info1"
                      name="per_clinic_info"
                      value="meeting_date"
                    />
                    <label for="per_clinic_info1"> DATE OF APPOINTMENT</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="per_clinic_info2"
                      name="per_clinic_info"
                      value="meeting_type"
                    />
                    <label for="per_clinic_info2"> VIRTUAL / INCLINIC</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="per_clinic_info3"
                      name="per_clinic_info"
                      value="isinstant"
                    />
                    <label for="per_clinic_info3">
                      {" "}
                      CALL TYPE - INSTANT Y / N
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="per_clinic_info4"
                      name="per_clinic_info"
                      value="meeting_time"
                    />
                    <label for="per_clinic_info4">
                      {" "}
                      APPOINTMENT SESSION TIME
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="per_clinic_info5"
                      name="per_clinic_info"
                      value="clinic_name"
                    />
                    <label for="per_clinic_info5"> CLINIC NAME</label>
                    <br />
                    <input
                      type="checkbox"
                      id="per_clinic_info6"
                      name="per_clinic_info"
                      value="participates"
                    />
                    <label for="per_clinic_info6">
                      {" "}
                      ADD PARTICIPANT INVITED
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="per_clinic_info7"
                      name="per_clinic_info"
                      value="waitingroom_time"
                    />
                    <label for="per_clinic_info7"> WAITING TIME</label>
                    <br />

                    <p>COMPLETED CALLS ADDITIONAL DETAILS</p>

                    <input
                      type="checkbox"
                      checked
                      id="call_info1"
                      name="call_info"
                      value="DURATION OF CALL"
                    />
                    <label for="call_info1"> DURATION OF CALL</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="call_info2"
                      name="call_info"
                      value="TIME OF CALL"
                    />
                    <label for="call_info2"> TIME OF CALL</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="call_info3"
                      name="call_info"
                      value="PHOTO TAKEN"
                    />
                    <label for="call_info3"> PHOTO TAKEN</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="call_info4"
                      name="call_info"
                      value="VIDEO AVAILABLE"
                    />
                    <label for="call_info4"> VIDEO AVAILABLE</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="call_info5"
                      name="call_info"
                      value="SUMMARY OF CALL"
                    />
                    <label for="call_info5"> SUMMARY OF CALL</label>
                    <br />
                    <input
                      type="checkbox"
                      checked
                      id="call_info6"
                      name="call_info"
                      value="ACTION POINT"
                    />
                    <label for="call_info6"> ACTION POINT</label>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <ToastContainer />
      </div>
    );
  }
}
