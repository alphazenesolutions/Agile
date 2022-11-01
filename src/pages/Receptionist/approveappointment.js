import React, { Component } from 'react'
import Sidebar from '../../Components/Sidebar/ReceptionistSidebar'
import '../../assest/css/doctorpage.css'
import axios from 'axios';
import { singleappointment, instantappointment, updateapoointment, deleteapoointment } from '../../apis/appointment'
import Navigation from '../../Components/FixedBottomNavigationRecep'
import Doctorlist from '../../Components/recpdoctor'
import profilepic from '../../assest/img/profilepic.png'

export default class approveappointment extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: null,
            profileurl: null,
            totalappointment: []
        }
    }
    componentDidMount = async () => {
        var userid1 = sessionStorage.getItem("doctorid")
        this.setState({
            userid: userid1
        })
        var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/`).then((res) => { return res.data })
        const { userid } = this.state
        var userdata = await axios.get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`).then((res) => { return res.data })
        if (userdata.length !== 0) {
            this.setState({
                firstname: userdata[0].first_name,
                initial: userdata[0].initial,
                number: userdata[0].mobile_number,
                degree: userdata[0].degree,
                email: userdata[0].email,
                lastname: userdata[0].last_name,
                landline: userdata[0].landline_number,
                specility: userdata[0].speciality,
                profileurl: userdata[0].profile_pic,
            })
        }

        var singleAppointment = await singleappointment()
        var instantAppointment = await instantappointment()
        var single = await singleAppointment.filter((res) => { return res.to_id === userid && res.meeting_status === "await" && res.status === "Waiting" })
        var instant = await instantAppointment.filter((res) => { return res.to_id === userid && res.meeting_status === "await" && res.status === "Waiting" })
        var totalappointment = []
        for (var i = 0; i < user.length; i++) {
            for (var j = 0; j < single.length; j++) {
                if (user[i].userid === single[j].to_id) {
                    totalappointment.push({
                        info: user[i],
                        appointment: single[j]
                    })
                }
            }
        }
        for (i = 0; i < user.length; i++) {
            for (j = 0; j < instant.length; j++) {
                if (user[i].userid === instant[j].to_id) {
                    totalappointment.push({
                        info: user[i],
                        appointment: instant[j]
                    })
                }
            }
        }
        this.setState({
            totalappointment: totalappointment
        })
    }
    accept = async (e) => {
        var data = {
            status: "Approved"
        }
        var appointment = await updateapoointment(data, e.target.id)
        if (appointment === true) {
            this.componentDidMount()
        }
    }
    decline = async (e) => {
        var deleteApoointment = await deleteapoointment(e.target.id)
        if (deleteApoointment === true) {
            this.componentDidMount()
        }
    }
    render() {
        const { totalappointment } = this.state
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="waitingroom">
                    <Doctorlist />
                    <div className="mt-2">
                        <h5>Approve Appointment</h5>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-md-8'>
                            {totalappointment.length !== 0 ? totalappointment.map((data, index) => (
                                <div className='card' key={index}>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='row'>
                                                    <div className="col-sm-4">
                                                        {data.info.profile_pic !== null ? <img className="profilepictop" src={data.info.profile_pic} alt="" /> : <img className="profilepictop" src={profilepic} alt="" />}
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <span><b>{data.appointment.tablename} Appointment</b></span><br />
                                                        <span>{data.info.initial}. {data.info.first_name} {data.info.last_name}</span><br />
                                                        <span pan className="headingspan">{data.appointment.clinic_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-2'>
                                                <span className="headingspan">{data.appointment.meeting_type === null ? "Video Call" : data.appointment.meeting_type}</span><br />
                                                <span className="headingspan">{data.appointment.meeting_time}</span><br />
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='row'>
                                                    <div className="col-sm-6">
                                                        <button className='addbtn' id={data.appointment.appointment_id} onClick={this.accept}>Accept</button>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <button className='editbtn' id={data.appointment.appointment_id} onClick={this.decline}>Decline</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : "No Appointment Available"}

                        </div>
                    </div>
                </div>
                <div className='bottomnavigation'>
                    <Navigation />
                </div>
            </div>
        )
    }
}
