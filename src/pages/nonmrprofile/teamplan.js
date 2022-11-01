import React, { Component } from "react";
import Sidebar from "../../Components/sidebarnonmr";
import "../../assest/css/profile.css";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import Avatar from "@mui/material/Avatar";
import profilepic from "../../assest/img/profilepic.png";
export default class teamplan extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: null,
      mycompany: [],
      myteam: [],
      teamselect: null,
      memerlist: false,
      memerlistid: null,
      teammember: [],
      loader: false
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
      .get(`${process.env.REACT_APP_SERVER}/users/mr`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var companydata = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/nonmr`)
      .then((res) => {
        return res.data;
      });
    var allcompanydata = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    if (companydata.length !== 0) {
      var samecompany = [];
      for (var b = 0; b < companydata.length; b++) {
        if (companydata[b].nonmr_id === userid) {
          for (var a = 0; a < allcompanydata.length; a++) {
            if (
              allcompanydata[a].company_name === companydata[b].company_name
            ) {
              samecompany.push(allcompanydata[a]);
            }
          }
        }
      }
      var unique = samecompany.filter((v, i, a) => a.indexOf(v) === i);
      var myteamuser = [];
      for (var i = 0; i < unique.length; i++) {
        for (var j = 0; j < user.length; j++) {
          if (user[j].userid === unique[i].mr_id) {
            myteamuser.push({
              info: user[j],
              comapny: unique[i],
            });
          }
        }
      }
      this.setState({
        mycompany: myteamuser,
      });

      var myteam = await axios
        .get(`${process.env.REACT_APP_SERVER}/team/${userid}`)
        .then((res) => {
          return res.data;
        });
      this.setState({
        myteam: myteam,
      });
    }
  };
  newteam = async () => {
    const { userid } = this.state;
    var teamname = document.getElementById("srch-term").value;
    var data = {
      team: teamname,
      nonmr_id: userid,
    };
    var createteam = await axios
      .post(`${process.env.REACT_APP_SERVER}/team`, data)
      .then((res) => {
        return res.data;
      });
    if (createteam === true) {
      this.componentDidMount();
    }
  };
  addteam = async (e) => {
    // console.log(e.target.id)
    this.setState({ [e.target.name]: e.target.value });
    setTimeout(() => {
      this.addmemember(e.target.id);
    });
  };
  addmemember = async (e) => {
    var alldata = await axios
      .get(`${process.env.REACT_APP_SERVER}/members/all`)
      .then((res) => {
        return res.data;
      });
    if (alldata.length !== 0) {
      var checkuser = await alldata.filter((data) => {
        return data.mr_id === e;
      });
      if (checkuser.length === 0) {
        const { teamselect } = this.state;
        if (teamselect === null || teamselect === "null") {
          toast.info("Team Is Required...", {
            autoClose: 2000,
            transition: Slide,
          });
        } else {
          var data = {
            teamid: teamselect,
            mr_id: e,
          };
          var createteam = await axios
            .post(`${process.env.REACT_APP_SERVER}/members`, data)
            .then((res) => {
              return res.data;
            });
          if (createteam === true) {
            toast.success("Team Added...", {
              autoClose: 2000,
              transition: Slide,
            });
            this.componentDidMount();
          }
        }
      } else {
        toast.info("The User already in Team...", {
          autoClose: 2000,
          transition: Slide,
        });
      }
    } else {
      const { teamselect } = this.state;
      if (teamselect === null || teamselect === "null") {
        toast.info("Team Is Required...", {
          autoClose: 2000,
          transition: Slide,
        });
      } else {
        var datanew = {
          teamid: teamselect,
          mr_id: e,
        };
        var createteamnew = await axios
          .post(`${process.env.REACT_APP_SERVER}/members`, datanew)
          .then((res) => {
            return res.data;
          });
        if (createteamnew === true) {
          toast.success("Team Added...", {
            autoClose: 2000,
            transition: Slide,
          });
          this.componentDidMount();
        }
      }
    }
  };
  getteamuser = async (e) => {
    console.log(e.target.id);
    var myteammember = await axios
      .get(`${process.env.REACT_APP_SERVER}/members/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    console.log(myteammember);
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/mr`)
      .then((res) => {
        return res.data;
      });
    var teammember = [];
    for (var i = 0; i < myteammember.length; i++) {
      for (var j = 0; j < user.length; j++) {
        if (myteammember[i].mr_id === user[j].userid) {
          teammember.push({
            info: user[j],
            team: myteammember[i],
          });
        }
      }
    }
    if (e.target.id !== this.state.memerlistid) {
      this.setState({
        memerlist: true,
        teammember: teammember,
        memerlistid: e.target.id,
      });
    } else {
      this.setState({
        memerlist: false,
        teammember: teammember,
        memerlistid: null,
      });
    }
  };
  removemember = async (e) => {
    console.log(e.target.id);
    var deletemember = await axios
      .delete(`${process.env.REACT_APP_SERVER}/members/${e.target.id}`)
      .then((res) => {
        return res.data;
      });
    if (deletemember === true) {
      window.location.reload();
    }
  };
  searchname = async (e) => {
    const { mycompany } = this.state;
    if (e.target.value.length !== 0) {
      var data = [];
      for (var i = 0; i < mycompany.length; i++) {
        if (
          mycompany[i].info.first_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          mycompany[i].info.last_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          data.push(mycompany[i]);
        }
      }
      this.setState({
        mycompany: data,
      });
    } else {
      this.componentDidMount();
    }
  };
  savecompany = () => {
    this.setState({
      loader: true
    })
    window.location.replace("/nonmr_review");
  };
  backbtn = () => {
    window.location.replace("/nonmr_company");
  };
  render() {
    const { mycompany, myteam, memerlist, teammember, loader } = this.state;
    console.log(myteam);
    return (
      <div className="container-fluid row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Company Representative (Non-MR) Profile</b>
          </h4>
          <h5>Team Planning</h5>

          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? <button className="btn addrecep  ml-3" onClick={this.savecompany}>
              {" "}
              Save & Next Step
            </button> : <button className="btn addrecep  ml-3" >
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="sr-only">Loading...</span>
            </button>}

          </div>

          <div className="row mt-2">
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Search By name"
                onChange={(e) => this.searchname(e)}
                className="form-control"
              />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-7">
              <div className="row">
                <div className="col-sm-6">
                  <h6>Name</h6>
                </div>
                <div className="col-sm-6">
                  <h6>Select Team</h6>
                </div>
                {/* <div className="col-sm-1"></div>
                                <div className="col-sm-3"><h6>Action</h6></div> */}
              </div>
              {mycompany.length !== 0
                ? mycompany.map((data, index) => (
                  <div className="card" key={index}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="row">
                            <div className="col-sm-2">
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
                            <div className="col-sm-10">
                              <h5 className="namehead">
                                {data.info.initial}. {data.info.first_name}{" "}
                                {data.info.last_name}
                              </h5>
                              <br />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <select
                              className="form-control"
                              id={data.info.userid}
                              name="teamselect"
                              onChange={(e) => this.addteam(e)}
                            >
                              <option value="null">Select Team</option>
                              {myteam.length !== 0
                                ? myteam.map((data, index) => (
                                  <option key={index} value={data.teamid}>
                                    {data.team}
                                  </option>
                                ))
                                : null}
                            </select>
                          </div>
                        </div>
                        {/* <div className="col-md-1"></div>
                                            <div className="col-md-3">
                                                <button className="addnowbtn" id={data.info.userid} onClick={this.addmemember}><GoPlusSmall /> Add Now </button>
                                            </div> */}
                      </div>
                    </div>
                  </div>
                ))
                : null}
            </div>
            <div className="col-md-5">
              {/* <div className="">
                                <span><b>My Doctor</b></span> <span className="countspan" style={{ float: "right" }}>06</span>
                            </div> */}

              <div className="row mt-3">
                <div className="xt-blog-form" role="search">
                  <div className="input-group add-on">
                    <input
                      className="form-control"
                      placeholder="Enter Team name"
                      name="srch-term"
                      id="srch-term"
                      type="text"
                    />
                    <div className="input-group-btn">
                      <button
                        className="btn btn-default addbtnnew"
                        type="submit"
                        onClick={this.newteam}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div
                    class="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    {myteam.length !== 0
                      ? myteam.map((data, index) => (
                        <div class="accordion-item" key={index}>
                          <h2
                            class="accordion-header"
                            id={`flush-headingOne${index}`}
                          >
                            <button
                              class="accordion-button collapsed"
                              id={data.teamid}
                              onClick={this.getteamuser}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapseOne${index}`}
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              {data.team}
                            </button>
                          </h2>
                          <div
                            id={`flush-collapseOne${index}`}
                            class="accordion-collapse collapse"
                            aria-labelledby={`flush-headingOne${index}`}
                            data-bs-parent="#accordionFlushExample"
                          >
                            {memerlist === true ? (
                              <div className="card  mt-2">
                                {teammember.length !== 0 ? (
                                  teammember.map((data, index) => (
                                    <>
                                      <div
                                        className="row memberlist mt-2"
                                        key={index}
                                      >
                                        <div className="col-sm-2">
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
                                        <div className="col-sm-6">
                                          <span className="namehead">
                                            {data.info.initial}.{" "}
                                            {data.info.first_name}{" "}
                                            {data.info.last_name}
                                          </span>
                                          <br />
                                          <span>Medical Representative</span>
                                        </div>
                                        <div className="col-sm-3">
                                          <button
                                            className="backbtn btn"
                                            id={data.team.id}
                                            onClick={this.removemember}
                                          >
                                            <AiFillCloseCircle
                                              id={data.team.id}
                                              onClick={this.removemember}
                                            />
                                          </button>
                                        </div>
                                      </div>
                                      <hr />
                                    </>
                                  ))
                                ) : (
                                  <div className="accordion-body">
                                    No team members added yet.
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
