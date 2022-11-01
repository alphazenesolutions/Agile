import React, { Component } from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar';
export default class nonmrteam extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: null,
            myteam: [],
            teammember: [],
            doctorid: sessionStorage.getItem("doctorid"),
            teamid: sessionStorage.getItem("teamid")
        }
    }
    componentDidMount = async () => {
        const { teamid } = this.state
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
        if (teamid !== null) {
            var myteammember = await axios.get(`${process.env.REACT_APP_SERVER}/members/${teamid}`).then((res) => { return res.data })
            var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/mr`).then((res) => { return res.data })
            var teammember = []
            for (var i = 0; i < myteammember.length; i++) {
                for (var j = 0; j < user.length; j++) {
                    if (myteammember[i].mr_id === user[j].userid) {
                        teammember.push({
                            info: user[j],
                            team: myteammember[i]
                        })
                    }
                }
            }
            this.setState({
                teammember: teammember
            })
        }


        setTimeout(() => {
            this.myteam()
        }, 2000)
    }
    myteam = async () => {
        const { userid } = this.state
        var myteam = await axios.get(`${process.env.REACT_APP_SERVER}/team/${userid}`).then((res) => { return res.data })
        this.setState({
            myteam: myteam
        })
    }
    viewmember = async (e) => {
        sessionStorage.setItem("teamid", e.target.value)
        var myteammember = await axios.get(`${process.env.REACT_APP_SERVER}/members/${e.target.value}`).then((res) => { return res.data })
        var user = await axios.get(`${process.env.REACT_APP_SERVER}/users/mr`).then((res) => { return res.data })
        var teammember = []
        for (var i = 0; i < myteammember.length; i++) {
            for (var j = 0; j < user.length; j++) {
                if (myteammember[i].mr_id === user[j].userid) {
                    teammember.push({
                        info: user[j],
                        team: myteammember[i]
                    })
                }
            }
        }
        this.setState({
            teammember: teammember
        })
    }
    selectdoctor = (e) => {
        this.setState({
            doctorid: e.target.id
        })
        window.location.reload()
    }
    removedoctor = () => {
        sessionStorage.removeItem("doctorid")
        this.setState({
            doctorid: null
        })
    }
    render() {
        const { myteam, teammember, doctorid } = this.state
        if (doctorid !== null) {
            sessionStorage.setItem("doctorid", doctorid)
        }
        return (
            <>
                <div className='row'>
                    <div className='mt-3 col-md-3'>
                        <select className='form-control' onChange={(e) => this.viewmember(e)}>
                            <option>Select Team</option>
                            {myteam.length !== 0 ? myteam.map((data, index) => (
                                <option key={index} value={data.teamid}>{data.team}</option>
                            )) : null}

                        </select>
                    </div>
                </div>
                <div className='container-fluid row mt-2'>
                    {teammember.length !== 0 ? teammember.map((data, index) => (
                        <div className="col-md-3 doctordiv" id={doctorid === data.info.userid ? "selectdrdiv" : null} key={index}>
                            <div className="row">
                                <div className="col-md-3">
                                    <Avatar alt="Remy Sharp" src={data.info.profile_pic} variant="rounded" />
                                </div>
                                <div className="col-md-9" id={data.info.userid} onClick={doctorid === data.info.userid ? this.removedoctor : this.selectdoctor}>
                                    <div id={data.info.userid}><b id={data.info.userid}> {data.info.initial}. {data.info.first_name} {data.info.last_name}</b></div>
                                    {/* <div id={data.info.userid}>Medical Representative</div> */}
                                </div>
                            </div>
                        </div>
                    )) : null}

                </div>
            </>
        )
    }
}
