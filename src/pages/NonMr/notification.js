import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/NonmrSidebar";
import "../../assest/css/doctorpage.css";
import axios from "axios";
import moment from "moment";
import { allparticipate } from "../../apis/participate";
import Navigation from "../../Components/FixedBottomNavigation";
import SpeedDial from "../../Components/BasicSpeedDial";
import Team from "../../Components/nonmrteam";
import Avatar from "@mui/material/Avatar";
import profilepic from "../../assest/img/profilepic.png";
export default class notification extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      profileurl: null,
      notificationdata: [],
      mymeeting: [],
    };
  }
  componentDidMount = async () => {
    var role = sessionStorage.getItem("role") || localStorage.getItem("role");
    if (role === "nonmr") {
      var userid3 = sessionStorage.getItem("doctorid");
      if (userid3 !== null) {
        this.setState({
          userid: userid3,
        });
      } else {
        this.setState({
          userid:
            sessionStorage.getItem("userid") || localStorage.getItem("userid"),
        });
      }
    } else {
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
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        profileurl: userdata[0].profile_pic,
      });
    }
    var company = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    for (var x = 0; x < company.length; x++) {
      if (company[x].mr_id === userid) {
        this.setState({
          company_name: company[x].company_name,
        });
      }
    }
    var notification = await axios
      .get(`${process.env.REACT_APP_SERVER}/notification/all`)
      .then((res) => {
        return res.data;
      });
    var mynotification = await notification.filter((data) => {
      return data.fromid === userid || data.toid === userid;
    });
    if (mynotification.length !== 0) {
      var mynotificationdata = [];
      for (var i = 0; i < mynotification.length; i++) {
        for (var j = 0; j < user.length; j++) {
          var a = moment(new Date());
          var b = moment(mynotification[i].createdAt);
          var datedif = a.diff(b, "days");
          if (
            mynotification[i].toid === user[j].userid &&
            mynotification[i].toid !== userid &&
            datedif < 2
          ) {
            mynotificationdata.push({
              user: user[j],
              notification: mynotification[i],
            });
          } else {
            if (
              mynotification[i].fromid === user[j].userid &&
              mynotification[i].fromid !== userid &&
              datedif < 2
            ) {
              mynotificationdata.push({
                user: user[j],
                notification: mynotification[i],
              });
            }
          }
        }
      }
      mynotificationdata.sort(function (a, b) {
        return b.notification.createdAt.localeCompare(a.notification.createdAt);
      });

      this.setState({
        notificationdata: mynotificationdata,
      });
    }
    var data = {
      count: 0,
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/notification/update/${userid}`,
        data
      )
      .then((res) => {
        return res.data;
      });
    var allParticipate = await allparticipate();
    var myparticipate = await allParticipate.filter((data) => {
      return data.userid === userid;
    });
    var mymeeting = [];
    for (var c = 0; c < myparticipate.length; c++) {
      for (var d = 0; d < user.length; d++) {
        var today = moment().format("YYYY-MM-DD");
        console.log(today, myparticipate[c].meeting_date);
        if (
          myparticipate[c].fromid === user[d].userid &&
          today <= myparticipate[c].meeting_date
        ) {
          mymeeting.push({
            user: user[d],
            info: myparticipate[c],
          });
        }
      }
    }
    let unique = [...new Set(mymeeting)];
    console.log(mymeeting, unique);
    this.setState({
      mymeeting: unique,
    });
  };

  render() {
    const { notificationdata, mymeeting } = this.state;
    console.log(mymeeting);
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="waitingroom">
          <Team />
          <div className="mt-2">
            <h5>Notification</h5>
          </div>
          {mymeeting.length !== 0
            ? mymeeting.map((data, index) => (
                <div className="row" key={index}>
                  <div className="col-md-8">
                    <div className="card notificationcard">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-1 col-3">
                            {data.user.profile_pic !== null ? (
                              <Avatar
                                src={data.user.profile_pic}
                                variant="rounded"
                                sx={{ width: 56, height: 56 }}
                              />
                            ) : (
                              <Avatar
                                src={profilepic}
                                variant="rounded"
                                sx={{ width: 56, height: 56 }}
                              />
                            )}
                          </div>
                          <div className="col-sm-11 col-9">
                            <p className="notifcationconten">
                              {data.user.initial}. {data.user.first_name}{" "}
                              {data.user.last_name} ({data.user.email}) Invite a{" "}
                              {data.info.meeting_table} Appointment On{" "}
                              <b>
                                {data.info.meeting_date} at{" "}
                                {data.info.meeting_time}
                              </b>
                              . Join Now{" "}
                              <a
                                className="editbtn"
                                target="__blank"
                                href={`${process.env.REACT_APP_SERVER}/meet?${data.info.meetingid}&u_id=${data.info.fromid}`}
                              >
                                Click Here
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
          {notificationdata.length !== 0
            ? notificationdata.map((data, index) =>
                data.notification.tablename === "Connection" ? (
                  <div className="row" key={index}>
                    <div className="col-md-8">
                      <div className="card notificationcard">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-1 col-3">
                              {data.user.profile_pic !== null ? (
                                <Avatar
                                  src={data.user.profile_pic}
                                  variant="rounded"
                                  sx={{ width: 56, height: 56 }}
                                />
                              ) : (
                                <Avatar
                                  src={profilepic}
                                  variant="rounded"
                                  sx={{ width: 56, height: 56 }}
                                />
                              )}
                            </div>
                            <div className="col-sm-11 col-9">
                              {data.notification.msg === "New" ? (
                                <p className="notifcationconten">
                                  You are <b>connected</b> with{" "}
                                  {data.user.initial}. {data.user.first_name}{" "}
                                  {data.user.last_name} ({data.user.email}). You
                                  may create an appointment with him now.
                                </p>
                              ) : (
                                <p className="notifcationconten">
                                  <b>Declined</b> a Connection with{" "}
                                  {data.user.initial}. {data.user.first_name}{" "}
                                  {data.user.last_name} ({data.user.email}).{" "}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : data.notification.tablename === "Single" ||
                  data.notification.tablename === "Recurring" ? (
                  <div className="row" key={index}>
                    <div className="col-md-8">
                      <div className="card notificationcard">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-1 col-3">
                              {data.user.profile_pic !== null ? (
                                <Avatar
                                  src={data.user.profile_pic}
                                  variant="rounded"
                                  sx={{ width: 56, height: 56 }}
                                />
                              ) : (
                                <Avatar
                                  src={profilepic}
                                  variant="rounded"
                                  sx={{ width: 56, height: 56 }}
                                />
                              )}
                            </div>
                            <div className="col-sm-11 col-9">
                              {data.notification.msg === "New" ? (
                                <p className="notifcationconten">
                                  You created a{" "}
                                  <b>
                                    {data.notification.tablename} appointment
                                  </b>{" "}
                                  with {data.user.initial}.{" "}
                                  {data.user.first_name} {data.user.last_name} (
                                  {data.user.email}) On{" "}
                                  <b>{data.notification.meeting_date}</b>.
                                </p>
                              ) : (
                                <p className="notifcationconten">
                                  {" "}
                                  <b>
                                    Resedule a {data.notification.tablename}{" "}
                                    appointment
                                  </b>{" "}
                                  with {data.user.initial}.{" "}
                                  {data.user.first_name} {data.user.last_name} (
                                  {data.user.email}) On{" "}
                                  <b>{data.notification.meeting_date}</b>.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              )
            : null}
        </div>
        <div className="bottomnavigation">
          <Navigation />
        </div>
        {/* <SpeedDial /> */}
      </div>
    );
  }
}
