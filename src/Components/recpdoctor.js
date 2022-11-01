import React, { Component } from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar';

export default class recpdoctor extends Component {
    constructor(props) {
        super()
        this.state = {
            mydoctor: [],
            userid: null,
            doctorid: sessionStorage.getItem("doctorid")
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
        setTimeout(() => {
            this.getdata()
        }, 2000);
    }
    getdata = async () => {
        const { userid } = this.state
        var mydata = await axios.get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`).then((res) => { return res.data })
        var mydoctor = await axios.get(`${process.env.REACT_APP_SERVER}/receptionist/number/${mydata[0].mobile_number}`).then((res) => { return res.data })
        var users = await axios.get(`${process.env.REACT_APP_SERVER}/users/doctor`).then((res) => { return res.data })
        // var clinic = await axios.get(`${process.env.REACT_APP_SERVER}/clinic/`).then((res) => { return res.data })
        var mydoctorlist = []
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < mydoctor.length; j++) {
                if (mydoctor[j].doctor_id === users[i].userid && mydoctor[j].status !==null ) {
                    sessionStorage.setItem("doctorid", mydoctor[j].doctor_id)
                    mydoctorlist.push({
                        info: users[i],
                        receptionsit: mydoctor[j],
                    })
                }
            }
        }
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
            mydoctor: mydoctorlist
        })
    }
    selectdoctor = (e) => {
        this.setState({
            doctorid: e.target.id
        })
        // window.location.reload()
        this.componentDidMount()
    }
    removedoctor = () => {
        sessionStorage.removeItem("doctorid")
        this.setState({
            doctorid: null
        })
        this.componentDidMount()
    }
    render() {
        const { mydoctor, doctorid } = this.state
        if (doctorid !== null) {
            sessionStorage.setItem("doctorid", doctorid)
        }
        return (
            <div className='container-fluid row ml-2'>
                {mydoctor.length !== 0 ? mydoctor.map((data, index) => (
                    <div className="col-md-3 doctordiv" id={doctorid === data.info.userid ? "selectdrdiv" : null} key={index}>
                        <div className="row">
                            <div className="col-md-3 col-3">
                                <Avatar alt="Remy Sharp" src={data.info.profile_pic} variant="rounded" />
                            </div>
                            <div className="col-md-9" id={data.info.userid} onClick={doctorid === data.info.userid ? this.removedoctor : this.selectdoctor}>
                                <div id={data.info.userid}><b id={data.info.userid}> {data.info.initial}. {data.info.first_name}</b></div>
                                <div id={data.info.userid}><b id={data.info.userid}></b>{data.receptionsit.access_clinic}</div>
                            </div>
                        </div>
                    </div>
                )) : null}
            </div>
        )
    }
}
