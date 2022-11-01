import React, { Component } from 'react'
import {  updateapoointmentmeeting, allappointment } from '../apis/appointment'
import axios from 'axios'
import profilepic from '../assest/img/profilepic.png'
import Avatar from '@mui/material/Avatar';
import { toast, Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
export default class FeedbackMr extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid") || sessionStorage.getItem("userid"),
            feedback: false,
            meetingid: null,
            modaldata: []
        }
    }
    componentDidMount = async () => {
        const { userid } = this.state
        var allappointmentdata = await allappointment()
        var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/`).then((res) => { return res.data })
        var myappointment = await allappointmentdata.filter((data) => { return data.from_id === userid && data.meeting_status === "completed" && data.starfrom === null })
        if (myappointment.length !== 0) {
            this.setState({
                meetingid: myappointment[0].meeting_id,
                feedback: true
            })
            var totalappointment = []
            for (var i = 0; i < user.length; i++) {
                for (var j = 0; j < myappointment.length; j++) {
                    if (user[i].userid === myappointment[j].to_id) {
                        totalappointment.push({
                            info: user[i],
                            appointment: myappointment[j]
                        })
                    }
                }
            }
            if (totalappointment.length !== 0) {
                this.setState({
                    modaldata: [totalappointment[0]],
                })
            }

        }
    }
    submitfeedback = async () => {
        const { meetingid } = this.state
        var start = document.getElementsByClassName("starrating")
        var checkedValue;
        for (var i = 0; start[i]; ++i) {
            if (start[i].checked) {
                checkedValue = start[i].value
            }
        }

        var feedback = document.getElementById("feedback").value
        if (checkedValue === undefined) {
            toast.error("Please Provide Rating...", {
                autoClose: 2000,
                transition: Slide
            })
        } else if (feedback === "") {
            toast.error("Please Provide Feedback...", {
                autoClose: 2000,
                transition: Slide
            })
        } else {
            var data = {
                starfrom: checkedValue,
                feedbackfrom: feedback
            }
            var feedbacknew = await updateapoointmentmeeting(data, meetingid)
            if (feedbacknew === true) {
                window.location.reload()
            }
        }
    }
    render() {
        const { feedback, modaldata } = this.state
        return (
            <div>
                {feedback === true ?
                    <div className="modal mrwaitingroommodal" tabIndex="-1">
                        <div className="modal-dialog">
                            {modaldata.length !== 0 ?
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Finished your meeting with {modaldata[0].info.initial}. {modaldata[0].info.first_name} {modaldata[0].info.last_name}</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                {modaldata[0].info.profile_pic != null ? <Avatar alt="Remy Sharp" src={modaldata[0].info.profile_pic} variant="rounded" /> : <Avatar alt="Remy Sharp" src={profilepic} variant="rounded" />}

                                            </div>
                                            <div className="col-sm-10">
                                                <span className='heading'>{modaldata[0].info.initial}. {modaldata[0].info.first_name} {modaldata[0].info.last_name} </span><br />
                                                <span className="headingspan">{modaldata[0].appointment.clinic_name}</span>
                                            </div>
                                            <div className='mt-3'>
                                                <span className="headingspan">Time Slot</span><br />
                                                <span className='heading'>{modaldata[0].appointment.meeting_time}</span><br />
                                            </div>

                                        </div>
                                        <div className='row'>
                                            <div className="row text-center">
                                                <h4>Rate Your Experience</h4>
                                                <div className="rate">
                                                    <input type="radio" className='starrating' id="star5" name="rate" value="5" />
                                                    <label for="star5" title="text">5 stars</label>
                                                    <input type="radio" className='starrating' id="star4" name="rate" value="4" />
                                                    <label for="star4" title="text">4 stars</label>
                                                    <input type="radio" className='starrating' id="star3" name="rate" value="3" />
                                                    <label for="star3" title="text">3 stars</label>
                                                    <input type="radio" className='starrating' id="star2" name="rate" value="2" />
                                                    <label for="star2" title="text">2 stars</label>
                                                    <input type="radio" className='starrating' id="star1" name="rate" value="1" />
                                                    <label for="star1" title="text">1 star</label>
                                                </div>
                                                <h4 className='mt-3'>Feed Back</h4>
                                                <div className='row ml-2 mt-2'>
                                                    <textarea className='form-control' id='feedback'></textarea>
                                                </div>
                                                <div className='row mt-4 text-center' style={{ marginLeft: "170px" }}>
                                                    <button className="savebtn" style={{ width: "30%" }} onClick={this.submitfeedback} >Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> : null}

                        </div>
                    </div>
                    : null}
                <ToastContainer />
            </div>
        )
    }
}
