import React, { Component } from 'react'
import axios from 'axios'
import { toast, Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { firebase, auth } from '../database/firebase';
export default class Update extends Component {
    constructor(props) {
        super()
        this.state = {
            number: null,
            userid: null,
            users: [],
            otp: null,
            role: localStorage.getItem("role"),
            remember: true,
            recapcha: true,
            resend: false,
            send: true,
            numberold: null,
            otpsend: false
        }
    }
    componentDidMount = async () => {
        var userid1 = sessionStorage.getItem("userid")
        if (userid1 === null) {
            var userid2 = localStorage.getItem("userid")
            this.setState({
                userid: userid2
            })
        } else {
            this.setState({
                userid: userid1
            })
        }
        var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/`).then((res) => { return res.data })
        const { userid } = this.state
        var userdata = await axios.get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`).then((res) => { return res.data })
        if (userdata.length !== 0) {
            this.setState({
                numberold: userdata[0].mobile_number,
                users: user
            })
        }
    }
    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    sendotp = async () => {
        const { number, numberold } = this.state
        if (number == null && number === numberold) {
            toast.info("Please Provide Valid Number...", {
                autoClose: 2000,
                transition: Slide
            })
        } else {
            this.setState({
                recapcha: true,
            })
            var users = await axios.get(`${process.env.REACT_APP_SERVER}/users/number/${number}`).then((res) => { return res.data })
            if (users.length === 0) {
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
                        resend: true,
                        otpsend: true

                    })
                }).catch((err) => {
                    alert(err);
                    window.location.reload()
                });
            } else {
                toast.error("This Number Register With Another Account...", {
                    autoClose: 2000,
                    transition: Slide
                })
            }
        }
    }
    
    ValidateOtp = async () => {
        const { otp, result, number, userid } = this.state
        if (otp === null || result === null)
            return;
        result.confirm(otp).then(async (result) => {
            toast.success("Mobile Number Changed Sucessfully...", {
                autoClose: 2000,
                transition: Slide
            })
            var data = {
                mobile_number: number,
            }
            var updateuserdata = await axios.post(`${process.env.REACT_APP_SERVER}/users/update/${userid}`, data).then((res) => { return res.data })
            if (updateuserdata === true) {
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }

        }).catch((err) => {
            alert("Wrong code");
        })
    }
    render() {
        const { numberold, otpsend } = this.state
        return (
            <div>
                <span data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Edit & Update
                </span>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Mobile Number Edit & Update</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mt-3">
                                    <label><b>Old Mobile Number <span className='red-asterisk'>*</span> </b></label>
                                    <input type="text" value={numberold} className="form-control" disabled />
                                </div>
                                <div className="mt-3">
                                    <label><b>New Mobile Number <span className='red-asterisk'>*</span> </b></label>
                                    <input type="text" name="number" id="number" onChange={(e) => this.handlechange(e)} className="form-control" />
                                </div>
                                {this.state.recapcha === true ? <div id="recaptcha-container"></div> : null}
                                {otpsend === true ?
                                    <div className="mt-3">
                                        <label><b>Enter OTP<span className='red-asterisk'>*</span></b></label><br />
                                        <input type="tel" placeholder="Enter OTP" name="otp" onChange={(e) => this.handlechange(e)} className="form-control inputfield" /><br />
                                    </div> : null}
                            </div>
                            <div className="modal-footer">
                                {otpsend === true ? <button type="button" className="editbtn" onClick={this.ValidateOtp}>Change Mobile Number</button> : <button type="button" className="editbtn" onClick={this.sendotp}>Get OTP</button>}
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    }
}
