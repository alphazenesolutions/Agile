import React from 'react'
import axios from 'axios';
import { singleappointment, recurringappointment, instantappointment, updateapoointment, oneapoointment, allappointment, updateapoointmentmeeting } from '../apis/appointment'
import moment from 'moment'
import { FiMoreHorizontal } from 'react-icons/fi'
import { FaHandPaper } from 'react-icons/fa'
import chair from '../assest/img/chair.png'
import Noperson from '../assest/img/No Person.svg'
import { toast, Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Avatar from '@mui/material/Avatar';
import { allparticipate, newparticipate } from '../apis/participate'
import profilepic from '../assest/img/profilepic.png'
import { allconnection } from '../apis/connection'
import { newnotification, newnotificationmsgnew } from '../apis/notification'

class RoomCardMR extends React.Component {
    constructor(props) {
        super()
        this.state = {
            userid: null,
            profileurl: null,
            users: [],
            today: moment().format("YYYY-MM-DD"),
            currentdate: moment().format("YYYY-MM-DD"),
            months: null,
            year: null,
            single: [],
            recurring: [],
            instant: [],
            liveappointment: [],
            totalappointment: [],
            data: [],
            Day: null,
            time: null,
            company_name: null,
            leaveappointment: [],
            invitediv: false,
            modaldata: [],
            ansermodaldata: [],
            ansermodaldiv: false,
            participant: [],
            feedback: true,
            myconnectionuser: [],
            meeting_id: null,
            onlyid: null,
        }
    }
    componentDidMount = async () => {
        var role = sessionStorage.getItem("role") || localStorage.getItem("role")
        if (role === "nonmr") {
            var userid3 = sessionStorage.getItem("doctorid")
            this.setState({
                userid: userid3
            })
        } else {
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
        }

        var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/`).then((res) => { return res.data })
        const { userid, } = this.state
        var userdata = await axios.get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`).then((res) => { return res.data })
        if (userdata.length !== 0) {
            this.setState({
                firstname: userdata[0].first_name,
                initial: userdata[0].initial,
                number: userdata[0].mobile_number,
                email: userdata[0].email,
                lastname: userdata[0].last_name,
                profileurl: userdata[0].profile_pic,
                users: user
            })
        }

        var company = await axios.get(`${process.env.REACT_APP_SERVER}/company/mr`).then((res) => { return res.data })
        for (var i = 0; i < company.length; i++) {
            if (company[i].mr_id === userid) {

                this.setState({
                    company_name: company[i].company_name
                })
            }
        }
        this.todayappointment()
        this.getnotification()
        this.modaldata()

    }
    todayappointment = async () => {
        const { users, userid, today } = this.state
        var singleAppointment = await singleappointment()
        var recurringAppointment = await recurringappointment()
        var instantAppointment = await instantappointment()
        var allappointmentnew = await allappointment()
        var allparticipant = await allparticipate()
        var single = await singleAppointment.filter((res) => { return res.from_id === userid && res.meeting_status === "await" && res.status === "Approved" && res.decline_status === null })
        var recurring = await recurringAppointment.filter((res) => { return res.from_id === userid && res.meeting_status === "await" && res.status === "Approved" && res.decline_status === null })
        var instant = await instantAppointment.filter((res) => { return res.from_id === userid && res.meeting_status === "await" && res.status === "Approved" && res.decline_status === null })
        var participant = await allparticipant.filter((res) => { return res.userid === userid && res.meeting_status === "await" && res.decline_status === null })
        this.setState({
            single: single,
            recurring: recurring,
            instant: instant,
            participant: participant
        })

        var todaysingle = single.filter((data) => { return data.meeting_date === today && data.meeting_type === "Virtual" })
        var todayrecurring = recurring.filter((data) => { return data.meeting_date === today && data.meeting_type === "Virtual" })
        var todayinstant = instant.filter((data) => { return data.meeting_date === today && data.meeting_type === "Virtual" })
        var todayparticipateappointment = participant.filter((data) => { return data.meeting_date === today })
        var totalappointment = []
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < todaysingle.length; j++) {
                if (users[i].userid === todaysingle[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todaysingle[j]
                    })
                }
            }
        }
        for (var i = 0; i < users.length; i++) {
            for (j = 0; j < todayrecurring.length; j++) {
                if (users[i].userid === todayrecurring[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todayrecurring[j]
                    })
                }
            }
        }
        for (var i = 0; i < users.length; i++) {
            for (j = 0; j < todayinstant.length; j++) {
                if (users[i].userid === todayinstant[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todayinstant[j]
                    })
                }
            }
        }
        var myappointmentdata = []
        for (var x = 0; x < todayparticipateappointment.length; x++) {
            var myappointment = await allappointmentnew.filter((data) => { return data.meeting_id === todayparticipateappointment[x].meetingid && data.meeting_status === "await" })
            myappointmentdata.push(myappointment[0])
        }
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < myappointmentdata.length; j++) {
                if (users[i].userid === myappointmentdata[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: myappointmentdata[j]
                    })
                }
            }
        }
        this.setState({
            totalappointment: totalappointment
        })
        this.liveappointment()
    }
    liveappointment = () => {
        const { totalappointment } = this.state
        var time = moment().format('h:mm A');
        var liveappointment = [], nonliveappointment = []
        for (var i = 0; i < totalappointment.length; i++) {
            var colon = time.indexOf(':');
            var hours = time.substr(0, colon),
                minutes = time.substr(colon + 1, 2),
                meridian = time.substr(colon + 4, 2).toUpperCase();
            var hoursInt = parseInt(hours, 10),
                offset = meridian === 'PM' ? 12 : 0;
            if (hoursInt === 12) {
                hoursInt = offset;
            } else {
                hoursInt += offset;
            }
            if (totalappointment[i].appointment.from_time <= hoursInt + ":" + minutes) {
                liveappointment.push(totalappointment[i])
            } else {
                nonliveappointment.push(totalappointment[i])
            }
        }
        var reseduleappointment = [], liveappointmentnew = []
        for (i = 0; i < liveappointment.length; i++) {
            var colon1 = time.indexOf(':');
            var hours1 = time.substr(0, colon1),
                minutes1 = time.substr(colon + 1, 2),
                meridian1 = time.substr(colon + 4, 2).toUpperCase();
            var hoursInt1 = parseInt(hours1, 10),
                offset1 = meridian1 === 'PM' ? 12 : 0;
            if (hoursInt1 === 12) {
                hoursInt1 = offset1;
            } else {
                hoursInt1 += offset1;
            }
            if (liveappointment[i].appointment.to_time <= hoursInt + ":" + minutes1) {
                reseduleappointment.push(liveappointment[i])
            } else {
                liveappointmentnew.push(liveappointment[i])
            }
        }
        var joinroom = [], leaveroom = []
        for (i = 0; i < liveappointmentnew.length; i++) {
            if (liveappointmentnew[i].appointment.waiting_room === "true") {
                var current_time = moment().format("h:mm:ss")
                var mins = moment.utc(moment(current_time, "HH:mm:ss").diff(moment(liveappointmentnew[i].appointment.waitingroom_time, "HH:mm:ss"))).format("mm")

                leaveroom.push({
                    time: mins,
                    appointment: liveappointmentnew[i]
                })
            } else {
                joinroom.push(liveappointmentnew[i])
            }
        }
        leaveroom.sort(function (a, b) {
            return a.appointment.appointment.waitingroom_time.localeCompare(b.appointment.appointment.waitingroom_time);
        });
        this.setState({
            liveappointment: joinroom,
            leaveappointment: leaveroom,
        })
        this.modaldata()
    }
    joinroombtn = async (e) => {
        const { userid } = this.state
        var data = {
            waiting_room: "true",
            waitingroom_time: moment().format("h:mm:ss")
        }
        var nodata = {
            userid: [userid, e.target.value]
        }
        var notimsg = {
            fromid: userid,
            toid: e.target.value,
            notification_from: "Waitingroom",
            tablename: "Waitingroom",
            msg: "New"
        }
        var informationdata = {
            userid: e.target.value,
            msg: "New Waitingroom"
        }
        var appointment = await updateapoointment(data, e.target.id)
        if (appointment === true) {
            var notification = await axios.post(`${process.env.REACT_APP_SERVER}/notification`, nodata).then((res) => { return res.data })
            if (notification === true) {
                var notificationmsg = await axios.post(`${process.env.REACT_APP_SERVER}/notification/msg/create`, notimsg).then((res) => { return res.data })
                if (notificationmsg === true) {
                    var information = await axios.post(`${process.env.REACT_APP_SERVER}/notification/information`, informationdata).then((res) => { return res.data })
                    if (information === true) {
                        this.componentDidMount()
                    }

                }
            }
        }
    }
    leaveroombtn = async (e) => {
        var data = {
            waiting_room: "false",
            waitingroom_time: "00:00"
        }
        var appointment = await updateapoointment(data, e.target.id)
        if (appointment === true) {
            this.componentDidMount()
        }
    }
    modaldata = async () => {
        const { leaveappointment } = this.state
        var modalaction = await leaveappointment.filter((data) => { return data.appointment.appointment.action === "waive" })
        var ansermodal = await leaveappointment.filter((data) => { return data.appointment.appointment.action === "answer" })
        var joinmodal = await leaveappointment.filter((data) => { return data.appointment.appointment.action === "ready" })
        if (joinmodal.length !== 0) {
            this.joincall(joinmodal[0].appointment.appointment.meeting_id)
        }
        this.setState({
            modaldata: modalaction[0],
            ansermodaldata: ansermodal[0],
            ansermodaldiv: true,
            invitediv: true
        })
        setTimeout(() => {
            this.todayappointment()
        }, 10000)

    }

    joincall = async (e) => {
        const { userid } = this.state
        var data = {
            incall: "true",
            meeting_ontime: moment().format("h:mm:ss"),
            action: "incall",
        }
        var appointment = await updateapoointmentmeeting(data, e)
        if (appointment === true) {
            window.open(
                `https://meet.mindinfinitisolutions.com/room/${e}?&id=${userid}`
            );
        }
    }
    stopappointment = async (e) => {
        var data = {
            action: "wait",
        }
        var appointment = await updateapoointment(data, e.target.id)
        if (appointment === true) {
            this.componentDidMount()
        }
    }
    initiatecall = async (e) => {
        var data = {
            action: "answer",
        }
        var appointment = await updateapoointment(data, e.target.id)
        if (appointment === true) {
            this.componentDidMount()
        }
    }
    stopcalling = async (e) => {
        var data = {
            action: "await",
        }
        var appointment = await updateapoointmentmeeting(data, e.target.id)
        if (appointment === true) {
            this.componentDidMount()
            // window.open(`${process.env.REACT_APP_SERVER}/meet?id=${e.target.id}&u_id=${userid}`)
        }
    }

    viewfulldetails = (e) => {
        sessionStorage.setItem("viewprofile", e.target.id)
        window.location.replace("/mr/fulldetails")
    }
    getnotification = () => {
        setTimeout(() => {
            this.notification()
        }, 60000)
    }

    notification = async () => {
        const { userid } = this.state
        var mynotification = await axios.get(`${process.env.REACT_APP_SERVER}/notification/${userid}`).then((res) => { return res.data })
        if (mynotification.length !== 0) {
            var alert = []
            for (var i = 0; i < mynotification.length; i++) {
                if (mynotification[i].msg === "New Connection") {
                    alert.push(mynotification[i])
                    await axios.delete(`${process.env.REACT_APP_SERVER}/notification/${mynotification[i].id}`).then((res) => { return res.data })
                }
            }
            if (alert.length !== 0) {
                toast.info("You Receive New Connection...", {
                    autoClose: 2000,
                    transition: Slide
                })
            }
        }
        setTimeout(() => {
            this.getnotification()
        }, 60000)


    }
    getnotificationcancel = async (e) => {
        var data = {
            action: "wait",
        }
        var appointment = await updateapoointment(data, e)
        if (appointment === true) {
            this.componentDidMount()
        }
    }

    countdown = async (e) => {
        var seconds = 10;
        async function tick() {
            seconds--;
            var finalresult =
                "0:" + (seconds < 10 ? "0" : "") + String(seconds);
            if (seconds > 0) {
                setTimeout(tick, 1000);
            } else {
                var data = {
                    action: "wait",
                }
                await updateapoointment(data, e)
            }
        }
        tick();
    }
    declinebtn = async (e) => {
        var data = {
            decline_status: "true",
        }
        var appointment = await updateapoointment(data, e.target.id)
        if (appointment === true) {
            this.componentDidMount()
        }
    }

    openaddparticipate = async (e) => {
        var appointment = await oneapoointment(e.target.id)
        this.setState({
            meeting_id: e.target.id,
            onlyid: appointment[0].meeting_id,
            myconnectionuser: []
        })
        document.getElementById("usernamesearch").value = ""
    }
    searchuser = async () => {
        const { userid, onlyid } = this.state
        var usernamesearch = document.getElementById("usernamesearch").value
        var connection = await allconnection()
        var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/`).then((res) => { return res.data })
        var myconnection = await connection.filter((connections) => { return (connections.to_id === userid || connections.from_id === userid) && connections.connection_status === "Approved" })
        var doctorinfo = [], doctorinfoid = []
        for (var j = 0; j < myconnection.length; j++) {
            for (var i = 0; i < user.length; i++) {
                if (myconnection[j].to_id === userid) {
                    if (user[i].userid === myconnection[j].from_id) {
                        doctorinfo.push(user[i])
                        doctorinfoid.push(myconnection[j])
                    }
                } else {
                    if (user[i].userid === myconnection[j].to_id) {
                        doctorinfo.push(user[i])
                        doctorinfoid.push(myconnection[j])
                    }
                }
            }
        }
        var myconnectiondata = []
        for (var k = 0; k < doctorinfo.length; k++) {
            if (doctorinfo[k].userid !== userid && doctorinfo[k].role === "mr" || doctorinfo[k].role === "nonmr") {
                myconnectiondata.push(doctorinfo[k])
            }
        }
        var myconnectionuser = []
        if (myconnectiondata.length !== 0) {
            for (var l = 0; l < myconnectiondata.length; l++) {
                if (myconnectiondata[l].first_name.toLocaleLowerCase().includes(usernamesearch.toLocaleLowerCase()) || myconnectiondata[l].email.toLocaleLowerCase().includes(usernamesearch.toLocaleLowerCase())) {
                    myconnectionuser.push(myconnectiondata[l])
                }
            }
        }
        this.setState({
            myconnectionuser: myconnectionuser
        })
    }
    addparticipate = async (e) => {
        const { meeting_id, userid } = this.state
        var appointment = await oneapoointment(meeting_id)
        var data = {
            userid: e.target.id,
            meetingid: appointment[0].meeting_id,
            meeting_table: appointment[0].tablename,
            fromid: userid,
            meeting_date: appointment[0].meeting_date,
            meeting_status: "await",
            meeting_time: appointment[0].meeting_time,
            status: "Approved"
        }
        var nodata = {
            userid: [userid, e.target.id]
        }
        var notimsg = {
            fromid: userid,
            toid: e.target.id,
            notification_from: "Appointment",
            tablename: "Participate",
            msg: "New",
            meeting_date: appointment[0].meeting_date,
        }
        var participate = await newparticipate(data)
        if (participate === true) {
            var notification = await newnotification(nodata)
            if (notification === true) {
                var newnotificationmsg = await newnotificationmsgnew(notimsg)
                if (newnotificationmsg === true) {
                    toast.info("Participate Added..", {
                        autoClose: 2000,
                        transition: Slide
                    })
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                }
            }
        }
    }

    joincallnew = (e) => {
        const { userid } = this.state
        window.open(
            `https://meet.mindinfinitisolutions.com/room/${e.target.id}?&id=${userid}`
        );
    }

    render() {
        const { liveappointment, leaveappointment, modaldata, ansermodaldata, ansermodaldiv, myconnectionuser, feedback } = this.state
        var data = []
        var count = 6 - leaveappointment.length
        for (var i = 0; i < count; i++) {
            data.push(count[i])
        }

        return (
            <>
                {leaveappointment.length !== 0 ? leaveappointment.map((data, index) => (
                    <div className="col-md-4 mt-4" key={index}>
                        <div className="card waitingcard" id='liveappointment'>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-2 col-2">
                                        <Avatar alt="Remy Sharp" src={data.appointment.info.profile_pic} variant="rounded" />

                                    </div>
                                    <div className="col-sm-6 col-6">
                                        <span className='headingwaiting'>{data.appointment.info.initial}. {data.appointment.info.first_name} {data.appointment.info.last_name}</span><br />
                                        <span className="headingspan"><span className='headingwaiting'></span>{data.appointment.appointment.clinic_name}</span>
                                    </div>
                                    <div className="col-sm-4 col-4">
                                        {data.appointment.appointment.action === "incall" ? <button className="savebtn btn-sm" id={data.appointment.appointment.meeting_id} onClick={this.joincallnew}>Join Call</button> : <button className="editbtn btn-sm" id={data.appointment.appointment.appointment_id} onClick={this.leaveroombtn}>Leave Room</button>}
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-sm-3 col-3">
                                        <span className="headingspan"><b>Time slot</b></span><br />
                                        <span className="headingspan">{data.appointment.appointment.meeting_time}</span>
                                    </div>
                                    {data.appointment.appointment.action === "incall" ?
                                        <div className="col-sm-5 col-5">

                                            <span className="headingspan"><b>In Call  {moment.utc(moment(moment().format("h:mm:ss"), "HH:mm:ss").diff(moment(data.appointment.appointment.meeting_ontime, "HH:mm:ss"))).format("mm")} m</b></span><br />
                                        </div> : <div className="col-sm-5 col-5">

                                            <span className="headingspan"><b>Waiting for  {data.time}m</b></span><br />
                                            {data.time < 15 ? <span className="availabletypeshort btn-sm">Short</span> : data.time < 30 ? <span className="availabletypemedium btn-sm">Medium </span> : <span className="availabletypered btn-sm">Long</span>}
                                        </div>}

                                    <div className="col-sm-4 col-4">
                                        <span className="headingspan"><b>Call history</b></span><br />
                                        <button className="editbtn" id={data.appointment.info.userid} onClick={this.viewfulldetails}>View Profile</button><br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <div className='text-center'>
                    <img src={Noperson} width="15%" alt="" />
                    <h6 className='mt-3'><b>There's no one in the meeting room</b></h6>
                </div>}
                {data.length !== 0 && data.length !== 6 ? data.map((data, index) => (
                    <div className="col-md-4 mt-4" key={index}>
                        <div className="card waitingcardempty">
                            <div className="card-body text-center">
                                <img src={chair} alt="" width="15%" />
                                <h6><b>Your waiting room is empty</b></h6>
                            </div>
                        </div>
                    </div>
                )) : null}
                <div className="mt-3 ml-2">
                    <h5>Upcoming Live Appointments</h5>
                </div>
                <div className="row mt-3 ml-2 livetablelabel">
                    <div className="col-md-3 col-3"><h6>Name</h6></div>
                    <div className="col-md-2 col-2"><h6>Meeting Time</h6></div>
                    <div className="col-md-4 col-4"><h6>Actions</h6></div>
                    <div className="col-md-3 col-3"><h6>View Full Details</h6></div>
                </div>
                {liveappointment.length !== 0 ? liveappointment.map((data, index) => (
                    <div className="row" key={index}>
                        <div className="">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3 col-12">
                                            <div className="row">
                                                <div className="col-sm-3 col-3">
                                                    <Avatar alt="Remy Sharp" src={data.info.profile_pic} variant="rounded" />

                                                </div>
                                                <div className="col-sm-9 col-9">
                                                    <span className='heading'>{data.info.initial}. {data.info.first_name} {data.info.last_name}</span><br />
                                                    <span className="headingspan">{data.appointment.clinic_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-3 mt-2">
                                            <span className="headingspan">{data.appointment.meeting_time}</span>
                                        </div>
                                        <div className="col-md-4 col-9 mt-2">
                                            <button className="addbtn" id={data.appointment.appointment_id} value={data.appointment.to_id} onClick={this.joinroombtn}>Join Room</button><span> - Click to join Waiting room​</span>

                                        </div>
                                        <div className="col-md-2 col-6 mt-2">
                                            <button className="editbtn btn-sm m-1">View Full Details</button>
                                        </div>
                                        <div className='col-sm-1 col-1 mt-3'>
                                            <div className="dropdown dropright">
                                                <span className="" data-toggle="dropdown">
                                                    <button className='editbtn btn-sm'><FiMoreHorizontal style={{ fontSize: "20px" }} /></button>
                                                </span>
                                                <div className="dropdown-menu">
                                                    <button className="dropdown-item declinebtn" id={data.appointment.appointment_id} onClick={this.declinebtn} >Decline</button>
                                                    <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id={data.appointment.appointment_id} onClick={this.openaddparticipate} >Add Participate</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <div className='text-center mt-5'><h6>No Appointment Found..</h6></div>}

                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Participate</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body row">
                                <div className='col-md-8'>
                                    <input type="text" className="form-control addinput" id='usernamesearch' />
                                </div>
                                <div className='col-md-4 mb-5'>
                                    <button className='searchbtn btn-sm' onClick={this.searchuser}>Search</button>
                                </div>
                                {myconnectionuser.length !== 0 ? myconnectionuser.map((data, index) => (
                                    <div className="row userlistdiv" key={index}>
                                        <div className="col-md-2">
                                            {data.profile_pic !== null ? <Avatar src={data.profile_pic} variant="rounded" sx={{ width: 56, height: 56 }} /> : <Avatar src={profilepic} variant="rounded" sx={{ width: 56, height: 56 }} />}

                                        </div>
                                        <div className="col-md-6">
                                            <span className="drname">{data.initial}. {data.first_name} {data.last_name}</span><br />
                                            <span className="headingspan"> {data.role === "doctor" ? "Doctor" : data.role === "mr" ? "Medical Representative" : data.role === "nonmr" ? "Non Mr" : "Receptionist"}</span>
                                        </div>
                                        <div className="col-md-4" >
                                            <button type="button" className="editbtn btn-sm" id={data.userid} onClick={this.addparticipate}>Add Participant</button>
                                        </div>
                                    </div>
                                )) : "No User Found"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* {leaveappointment.length !== 0 ? leaveappointment.map((data, index) => (
                    <div className="row" key={index}>
                        <div className="">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3 col-12">
                                            <div className="row">
                                                <div className="col-sm-3 col-3">
                                                    <Avatar alt="Remy Sharp" src={data.appointment.info.profile_pic} variant="rounded" />

                                                </div>
                                                <div className="col-sm-9 col-9">
                                                    <span className='heading'>{data.appointment.info.initial}. {data.appointment.info.first_name} {data.appointment.info.last_name}</span><br />
                                                    <span className="headingspan">{data.appointment.appointment.clinic_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-3 mt-2">
                                            <span className="headingspan">{data.appointment.appointment.meeting_time}</span>
                                        </div>
                                        <div className="col-md-4 col-9 mt-2">
                                            <button className="editbtn btn-sm" id={data.appointment.appointment.appointment_id} onClick={this.leaveroombtn}>Leave Room</button><span> - Attention ! Doctor Might Call you anytime</span>

                                        </div>
                                        <div className="col-md-2 col-6 mt-2">
                                            <button className="editbtn btn-sm m-1">View Full Details</button>
                                        </div>
                                        <div className='col-sm-1 col-1 mt-3'>
                                            <div className="dropdown dropright">
                                                <span className="" data-toggle="dropdown">
                                                    <button className='editbtn btn-sm'><FiMoreHorizontal style={{ fontSize: "20px" }} /></button>
                                                </span>
                                                <div className="dropdown-menu">
                                                    <button className="dropdown-item declinebtn" id={data.appointment.appointment.appointment_id} onClick={this.declinebtn} >Decline</button>
                                                    <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id={data.appointment.appointment.appointment_id} onClick={this.openaddparticipate} >Add Participate</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : null} */}

                {this.state.invitediv === true ?

                    modaldata !== undefined ? <div className="modal mrwaitingroommodal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{modaldata.appointment.info.initial}. {modaldata.appointment.info.first_name} {modaldata.appointment.info.last_name} Waived at you</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" id={modaldata.appointment.appointment.appointment_id} onClick={this.stopappointment} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <h5><b><FaHandPaper /> Waive Received</b></h5>
                                    <div className='row mt-3'>
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <Avatar alt="Remy Sharp" src={modaldata.appointment.info.profile_pic} variant="rounded" />
                                            </div>
                                            <div className="col-sm-10">
                                                <span className='modal-title'>{modaldata.appointment.info.initial}. {modaldata.appointment.info.first_name} {modaldata.appointment.info.last_name} </span><br />
                                                <span className="modal-title">{modaldata.appointment.appointment.clinic_name}</span>
                                            </div>
                                            <div className='mt-3'>
                                                <span className="headingspan">Time Slot</span><br />
                                                <span className='modal-title'>{modaldata.appointment.appointment.meeting_time}</span><br />
                                            </div>
                                            <div className='mt-3 text-center'>
                                                <button className="editbtn" style={{ fontSize: "20px" }} id={modaldata.appointment.appointment.appointment_id} onClick={this.initiatecall}>Click to Initiate Call</button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div> : null
                    : null}

                {ansermodaldiv === true ?
                    ansermodaldata !== undefined ? <div className="modal mrwaitingroommodal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Calling {ansermodaldata.appointment.info.initial}. {ansermodaldata.appointment.info.first_name} {ansermodaldata.appointment.info.last_name}</h5>
                                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal" id={ansermodaldata.appointment.appointment.appointment_id} onClick={this.stopcalling} aria-label="Close"></button> */}
                                </div>
                                <div className="modal-body">
                                    <div className='row mt-3'>
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <Avatar alt="Remy Sharp" src={ansermodaldata.appointment.info.profile_pic} variant="rounded" />
                                            </div>
                                            <div className="col-sm-10">
                                                <span className='modal-title'>{ansermodaldata.appointment.info.initial}. {ansermodaldata.appointment.info.first_name} {ansermodaldata.appointment.info.last_name} </span><br />
                                                <span className="modal-title">{ansermodaldata.appointment.appointment.clinic_name}</span>
                                            </div>
                                            <div className='mt-3'>
                                                <span className="headingspan">Time Slot</span><br />
                                                <span className='modal-title'>{ansermodaldata.appointment.appointment.meeting_time}</span><br />
                                            </div>
                                            <div className='mt-3 text-center'>
                                                <button className="editbtn" style={{ fontSize: "20px" }} id={ansermodaldata.appointment.appointment.meeting_id} onClick={this.stopcalling}>Stop Calling..</button>
                                                <p className='mt-2'><b>Click Here to Stop the Call..</b></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null
                    : null}



                <ToastContainer />

            </>
        );
    }
}

export default RoomCardMR;