import React, { Component } from 'react'
import leftimg from "../assest/img/img1.png"
import topimg from "../assest/img/Victor logo2.png"
import "../assest/css/signup.css"
import { firebase, auth } from '../database/firebase';
import { toast, Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { Link } from 'react-router-dom'
import '../pages/Login/Login.css'
export default class signup extends Component {

    constructor(props) {
        super()
        this.state = {
            email: null,
            number: null,
            otp: null,
            result: null,
            role: localStorage.getItem("role"),
            remember: true,
            recapcha: true,
            resend: false,
            send: true,
            loader: false,
            loginloader: false,
        }
    }
    componentDidMount = () => {
        const { role } = this.props.location
        if (role !== undefined) {
            localStorage.setItem("role", role)
            this.setState({
                role: role
            })
        }
    }

    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handlechangecheck = (e) => {
        const { remember } = this.state
        if (remember === true) {
            this.setState({
                remember: false
            })
        } else {
            this.setState({
                remember: true
            })
        }
    }
    sendotp = async () => {

        const { email, number } = this.state
        if (email == null) {
            toast.info("Email Is Required...", {
                autoClose: 2000,
                transition: Slide
            })
        } else if (number == null) {
            toast.info("Mobile Number is Required...", {
                autoClose: 2000,
                transition: Slide
            })
        } else {
            this.setState({
                loader: true
            })
            var users = await axios.get(`${process.env.REACT_APP_SERVER}/users/number/${number}`).then((res) => { return res.data })
            if (users.length !== 0) {
                toast.info("This Number Already Register with us...", {
                    autoClose: 2000,
                    transition: Slide
                })
                this.setState({
                    loader: false
                })
            } else {
                var finalnumber = "+91" + number
                let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
                auth.signInWithPhoneNumber(finalnumber, verify).then((result) => {
                    this.setState({
                        result: result
                    })
                    toast.info("Message Sent To Your Mobile Number...", {
                        autoClose: 2000,
                        transition: Slide
                    })
                    this.setState({
                        recapcha: false,
                        send: false,
                        resend: true
                    })
                    // setshow(true);
                }).catch((err) => {
                    alert(err);
                    window.location.reload()
                });
            }



        }
    }

    ValidateOtp = async () => {
        const { otp, result, email, number, remember } = this.state
        this.setState({
            loginloader: true
        })
        if (otp === null || result === null)
            return;
        result.confirm(otp).then(async (result) => {
            // success 
            var data = {
                email: email,
                mobile_number: number,
                role: localStorage.getItem("role")
            }
            console.log(data)
            var adduser = await axios.post(`${process.env.REACT_APP_SERVER}/users`, data).then((res) => { return res.data })
            console.log(adduser)
            if (adduser != null) {
                toast.success("Account Registered Successfully..", {
                    autoClose: 2000,
                    transition: Slide
                })

                if (remember === false) {
                    sessionStorage.setItem("userid", adduser.userid)
                } else {
                    localStorage.setItem("userid", adduser.userid)
                }
                var role = localStorage.getItem("role")
                if (role === "doctor") {
                    window.location.replace("/dr_profile")
                } else if (role === "receptionist") {
                    window.location.replace("/recp_profile")
                } else if (role === "mr") {
                    window.location.replace("/mr_profile")
                } else {
                    window.location.replace("/nonmr_profile")
                }

            }

        }).catch((err) => {
            alert("Wrong code");
            this.setState({
                loginloader: false
            })
        })
    }
    resend = () => {
        this.setState({
            recapcha: true,
            send: true,
            resend: false,
            loader: false
        })
    }
    render() {
        const { role, resend, send, remember, loader, loginloader } = this.state
        return (
            <div className="Login">
                <div className='leftcol' style={{ backgroundImage: "linear-gradient(#9f62a9, #7201bd)" }}>
                    <div className='leftcol_body'>
                        <h1>Victor brings doctors and medical representatives together</h1>
                        <center><img src={leftimg} alt="" /></center>
                    </div>
                </div>
                <div className='rightcol'>
                    <div className="rightcol_body">
                        <center><img src={topimg} style={{ paddingBottom: "20px" }} alt=""></img></center>
                        <div className="img">
                            <div>
                                <h4 className="mt-3 mb-3 rolename">{role === "doctor" ? "Doctor" : role === "receptionist" ? "Receptionist" : role === "mr" ? "Medical Representative" : "Company Representative (Non-MR)"}</h4>
                            </div>
                            <div className="row option">
                                <div className="col-md-2 col-2">
                                    <Link className="optionlink" to="/login">Login</Link>
                                </div>
                                <div className="col-md-3 col-3">
                                    <Link className="optionlink signuppage" to="/signup">Sign up</Link>
                                </div>
                            </div>
                            <div className="mail mt-3">
                                <label><b>Email<span className='red-asterisk'>*</span></b></label>
                                <input type="text" placeholder="Enter Email" name="email" onChange={(e) => this.handlechange(e)} className="form-control inputfield" />
                                <div className=" mt-3">
                                    <label><b>Mobile<span className='red-asterisk'>*</span></b></label>
                                    <div className='input-group mb-3'>
                                        <input type="tel" placeholder="Enter Number" name="number" onChange={(e) => this.handlechange(e)} className="form-control inputfield" />
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
                                        {resend === true ? <button className="btn-primary mt-1 sendoptbtn" onClick={this.resend}>Resend OTP</button> : null}
                                    </div>
                                </div>
                            </div>
                            {this.state.recapcha === true ? <div id="recaptcha-container"></div> : null}

                            {resend === true ? <div className="textotp mt-3">
                                <label><b>Enter OTP<span className='red-asterisk'>*</span></b></label>
                                <input type="text" placeholder="Enter OTP" name="otp" onChange={(e) => this.handlechange(e)} className="form-control" /><br />
                            </div> : null}


                            <div className="remeber mt-2">
                                <label className="remember mb-3 ml-2">{remember === true ? <input type="checkbox" name="remember" checked value="true" onChange={(e) => this.handlechangecheck(e)} /> : <input type="checkbox" name="remember" value="true" onChange={(e) => this.handlechangecheck(e)} />}  Remember Me</label><br />
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
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    }
}
