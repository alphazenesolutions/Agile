import React, { Component } from "react";
import Sidebar from "../../Components/sidebarrecp";
import profilepic from "../../assest/img/profilepic.png";
import Avatar from "@mui/material/Avatar";
import "../../assest/css/profile.css";
import axios from "axios";

export default class hospitalaccess extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      mydoctor: [],
      loader:false
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
      this.getdata();
    }, 2000);
  };
  getdata = async () => {
    const { userid } = this.state;
    var mydata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`)
      .then((res) => {
        return res.data;
      });
    var mydoctor = await axios
      .get(
        `${process.env.REACT_APP_SERVER}/receptionist/number/${mydata[0].mobile_number}`
      )
      .then((res) => {
        return res.data;
      });
    var users = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/doctor`)
      .then((res) => {
        return res.data;
      });
    // var clinic = await axios.get(`${process.env.REACT_APP_SERVER}/clinic/`).then((res) => { return res.data })
    console.log(mydoctor);
    var mydoctorlist = [];
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < mydoctor.length; j++) {
        if (mydoctor[j].doctor_id === users[i].userid) {
          mydoctorlist.push({
            info: users[i],
            receptionsit: mydoctor[j],
          });
        }
      }
    }
    console.log(mydoctorlist);
    // var finaldata = []
    // for (var i = 0; i < clinic.length; i++) {
    //     for (var j = 0; j < mydoctorlist.length; j++) {
    //         if (mydoctorlist[j].receptionsit.access_clinic === clinic[i].clinic_id) {

    //             finaldata.push({
    //                 info: mydoctorlist[j].info,
    //                 receptionsit: mydoctorlist[j].receptionsit,
    //                 clinic: clinic[i]
    //             })
    //         }
    //     }
    // }
    this.setState({
      mydoctor: mydoctorlist,
    });
  };
  acceptrecp = async (e) => {
    var data = {
      status: true,
    };
    var approve = await axios
      .post(
        `${process.env.REACT_APP_SERVER}/receptionist/update/${e.target.id}`,
        data
      )
      .then((res) => {
        return res.data;
      });
    if (approve === true) {
      window.location.reload();
    }
  };
  declinerecp = async (e) => {
    console.log(e.target.id);
    var approve = await axios
      .delete(`${process.env.REACT_APP_SERVER}/receptionist/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (approve === true) {
      window.location.reload();
    }
  };
  saveprofile = () => {
    this.setState({
      loader:true
    })
    window.location.replace("/recp_review");
  };
  backbtn = () => {
    window.location.replace("/recp_profile");
  };
  render() {
    const { mydoctor, loader } = this.state;
    return (
      <div className=" row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Receptionist Profile</b>
          </h4>
          <h5>Clinic / Hospital Access</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ?
              <button className="btn addrecep  ml-3" onClick={this.saveprofile}>
                {" "}
                Save & Next Step
              </button> : <button className="btn addrecep  ml-3" >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="sr-only">Loading...</span>
              </button>}

          </div>
          <div className="row mt-3">
            <div className="col-sm-3">Name</div>
            <div className="col-sm-3">Clinic Name</div>
            <div className="col-sm-3">Status</div>
            <div className="col-sm-3">Action</div>
          </div>
          <div className="row mt-1">
            {mydoctor.length !== 0
              ? mydoctor.map((data, index) => (
                <div className="card" key={index}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
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
                              {data.info.initial}. {data.info.first_name}{" "}
                              {data.info.last_name}
                            </span>
                            <br />
                            <span className="namevalue">
                              {data.info.degree}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <span className="namehead">
                          {data.receptionsit.access_clinic}
                        </span>
                        <br />
                        <span className="namevalue">
                          {data.info.speciality}
                        </span>
                      </div>
                      <div className="col-sm-3">
                        <p>Connect to manage the Doctor's appointments</p>
                      </div>
                      <div className="col-md-3">
                        {data.receptionsit.status !== null ? (
                          <>
                            <button className="addrecep btn-sm m-1" disabled>
                              {" "}
                              Accepted{" "}
                            </button>
                            <button
                              className="deletebtn btn-sm m-1"
                              id={data.receptionsit.receptionist_id}
                              onClick={this.declinerecp}
                            >
                              Decline{" "}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="editbtnnew btn-sm m-1"
                              id={data.receptionsit.receptionist_id}
                              onClick={this.acceptrecp}
                            >
                              Accept{" "}
                            </button>
                            <button
                              className="deletebtn btn-sm m-1"
                              id={data.receptionsit.receptionist_id}
                              onClick={this.declinerecp}
                            >
                              Decline{" "}
                            </button>
                          </>
                        )}
                      </div>
                      {/* <div className="col-md-1">
                                            <  FiMoreHorizontal data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Right popover" />
                                        </div> */}
                    </div>
                  </div>
                </div>
              ))
              : "No access to any hospital..."}
          </div>
        </div>
      </div>
    );
  }
}
