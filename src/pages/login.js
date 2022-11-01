import React, { Component } from "react";
import leftimg from "../assest/img/img1.png";
import topimg from "../assest/img/Victor logo2.png";
import "../assest/css/login.css";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { firebase, auth } from "../database/firebase";
import { Link } from "react-router-dom";
export default class login extends Component {
  constructor(props) {
    super();
    this.state = {
      number: null,
      otp: null,
      role: localStorage.getItem("role"),
      remember: true,
      recapcha: true,
      resend: false,
      send: true,
      userid: null,
      loader: false,
      loginloader: false,
    };
  }
  componentDidMount = () => {
    const { role } = this.props.location;

    if (role !== undefined) {
      localStorage.setItem("role", role);
      this.setState({
        role: role,
      });
    }
  };
  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handlechangecheck = (e) => {
    const { remember } = this.state;
    if (remember === true) {
      this.setState({
        remember: false,
      });
    } else {
      this.setState({
        remember: true,
      });
    }
  };
  sendotp = async () => {
    const { number, role } = this.state;
    if (number == null) {
      toast.info("Mobile Number is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      this.setState({
        recapcha: true,
        loader: true
      });
      var users = await axios
        .get(`${process.env.REACT_APP_SERVER}/users/number/${number}`)
        .then((res) => {
          return res.data;
        });
        console.log(users)
      var checkuser = await users.filter((data) => {
        return data.role === role;
      });
      if (checkuser.length === 0) {
        toast.info(
          `Mobile Number is Not Register With ${role === "doctor"
            ? "Doctor"
            : role === "receptionist"
              ? "Receptionist"
              : role === "mr"
                ? "Medical Representative"
                : "Company Representative (Non-MR)"
          }.Please Register...`,
          {
            autoClose: 2000,
            transition: Slide,
          }
        );
      } else {
        this.setState({
          userid: checkuser[0].userid,
        });
        var finalnumber = "+91" + number;
        let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
        auth
          .signInWithPhoneNumber(finalnumber, verify)
          .then((result) => {
            this.setState({
              result: result,
            });
            toast.info("Message Sent To Your Mobile Number...", {
              autoClose: 2000,
              transition: Slide,
            });
            this.setState({
              recapcha: false,
              send: false,
              resend: true,
              loader: false
            });
            // setshow(true);
          })
          .catch((err) => {
            alert(err);
            window.location.reload();
          });
      }
    }
  };
  ValidateOtp = async () => {
    this.setState({
      loginloader: true
    })
    const { otp, result, remember, userid } = this.state;
    if (otp === null || result === null) return;
    result
      .confirm(otp)
      .then(async (result) => {
        toast.success("Welcome Back to Agile..", {
          autoClose: 2000,
          transition: Slide,
        });
        if (remember === false) {
          sessionStorage.setItem("userid", userid);
        } else {
          localStorage.setItem("userid", userid);
        }
        var role = localStorage.getItem("role");
        if (role === "doctor") {
          window.location.replace("/doctor/waitingroom");
        } else if (role === "receptionist") {
          window.location.replace("/receptionist/waitingroom");
        } else if (role === "mr") {
          window.location.replace("/mr/waitingroom");
        } else {
          window.location.replace("/nonmr/waitingroom");
        }
      })
      .catch((err) => {
        alert("Wrong code");
        this.setState({
          loginloader: false
        })
      });

  };
  resend = () => {
    this.setState({
      recapcha: true,
      send: true,
      resend: false,
      loader: false
    });
  };
  render() {
    const { role, resend, send, remember, loader, loginloader } = this.state;
    return (
      <div className="Login">
        <div
          className="leftcol"
          style={{ backgroundImage: "linear-gradient(#9f62a9, #7201bd)" }}
        >
          <div className="leftcol_body">
            <h1>Victor brings doctors and medical representatives together</h1>
            <center>
              <img src={leftimg} alt="" />
            </center>
          </div>
        </div>
        <div className="rightcol">
          <div className="rightcol_body">
            <center>
              <img src={topimg} style={{ paddingBottom: "20px" }} alt=""></img>
            </center>
            <div className="img">
              <div>
                <h4 className="mt-3 mb-3 rolename">
                  {role === "doctor"
                    ? "Doctor"
                    : role === "receptionist"
                      ? "Receptionist"
                      : role === "mr"
                        ? "Medical Representative"
                        : "Company Representative (Non-MR)"}
                </h4>
              </div>
              <div className="row option">
                <div className="col-md-2 col-2">
                  <Link className="optionlink signuppage" to="/login">
                    Login
                  </Link>
                </div>
                <div className="col-md-3 col-3">
                  <Link className="optionlink" to="/signup">
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="mobile">
                <label>
                  <b>
                    Mobile <span className="red-asterisk">*</span>
                  </b>
                </label>{" "}
                <br />
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="Enter Mobile Number"
                    name="number"
                    onChange={(e) => this.handlechange(e)}
                    className="form-control inputfield"
                  />
                  {send === true ? (
                    loader === false ? <button
                      className="btn-primary mt-1 sendoptbtn"
                      onClick={this.sendotp}
                    >
                      Send OTP
                    </button> : <button
                      className="btn-primary mt-1 sendoptbtn"
                    >
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span class="sr-only">Loading...</span>
                    </button>

                  ) : null}

                  {resend === true ? (
                    <button
                      className="btn-primary mt-1 sendoptbtn"
                      onClick={this.resend}
                    >
                      Resend OTP
                    </button>
                  ) : null}
                </div>
              </div>
              {this.state.recapcha === true ? (
                <div id="recaptcha-container" className="RecaptchaIframe"></div>
              ) : null}
              {resend === true ? (
                <div className="textotp">
                  <label>
                    <b>
                      Enter OTP<span className="red-asterisk">*</span>
                    </b>
                  </label>
                  <br />
                  <input
                    type="tel"
                    placeholder="Enter OTP"
                    name="otp"
                    onChange={(e) => this.handlechange(e)}
                    className="form-control"
                  />
                  <br />
                </div>
              ) : null}

              <div className="remeber mt-2">
                <label className="remember mb-3 ml-2">
                  {remember === true ? (
                    <input
                      type="checkbox"
                      name="remember"
                      checked
                      value="true"
                      onChange={(e) => this.handlechangecheck(e)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      name="remember"
                      value="true"
                      onChange={(e) => this.handlechangecheck(e)}
                    />
                  )}{" "}
                  Remember Me
                </label>
                <br />
              </div>
              {loginloader === false ? <button
                className="btn btn-primary btn-lg btn-block verifybtn"
                onClick={this.ValidateOtp}
              >
                Verify & Login
              </button> : <button
                className="btn btn-primary btn-lg btn-block verifybtn"
              >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="sr-only">Loading...</span>
              </button>}
              <br />
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
