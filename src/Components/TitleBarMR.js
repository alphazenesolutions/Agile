import React, { Component } from 'react'
import axios from 'axios'
import profilepic from '../assest/img/profilepic.png'
import Avatar from '@mui/material/Avatar';

export default class TitleBarMR extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: null,
            profileurl: null
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
                firstname: userdata[0].first_name,
                initial: userdata[0].initial,
                number: userdata[0].mobile_number,
                email: userdata[0].email,
                lastname: userdata[0].last_name,
                profileurl: userdata[0].profile_pic,
                users: user
            })
            if (userdata[0].first_name === null) {
                alert("Thank you for joining Victor. Kindly take 5 min to complete the profile. Mandatory information is essential to be able to use the application")
                window.location.replace("/mr_profile")
            }
        }
        var company = await axios.get(`${process.env.REACT_APP_SERVER}/company/mr`).then((res) => { return res.data })
        for (var i = 0; i < company.length; i++) {
            if (company[i].mr_id === userid) {
                this.setState({
                    company_name: company[i].company_name
                })
            }
        }
    }
    render() {
        return (
            <div>
                <div className="row p-1 mt-1">
                    <div className="col-sm-1 col-4">
                        {this.state.profileurl !== null ? <Avatar src={this.state.profileurl} variant="rounded" sx={{ width: 56, height: 56 }} /> : <Avatar src={profilepic} variant="rounded" sx={{ width: 56, height: 56 }} />}
                    </div>
                    <div className="col-sm-6 col-8" style={{marginLeft:"-30px"}}>
                        <h5>{this.state.initial}. {this.state.firstname} {this.state.lastname}</h5>
                        <span className="headingspan"> {this.state.company_name}</span>
                        {/* <h6 className="profilerole">Medical Representative</h6> */}
                    </div>
                </div>
            </div>
        )
    }
}
