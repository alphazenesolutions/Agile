import React, { Component } from 'react'
import axios from 'axios'
import profilepic from '../assest/img/profilepic.png'
import Avatar from '@mui/material/Avatar';

export default class waitingroom extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: null,
            profileurl: null,
            users: []
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
                degree: userdata[0].degree,
                email: userdata[0].email,
                lastname: userdata[0].last_name,
                landline: userdata[0].landline_number,
                specility: userdata[0].speciality,
                profileurl: userdata[0].profile_pic,
                users: user
            })
            if (userdata[0].first_name === null) {
                alert("Thank you for joining Victor. Kindly take 5 min to complete the profile. Mandatory information is essential to be able to use the application")
                window.location.replace("/dr_profile")
            }
        }
    }
    render() {
        return (
            <div className="row p-1 mt-1 ml-2">
                <div className="col-sm-1 col-3">
                    {this.state.profileurl !== null ? <Avatar src={this.state.profileurl} variant="rounded" sx={{ width: 56, height: 56 }} /> : <Avatar src={profilepic} variant="rounded" sx={{ width: 56, height: 56 }} />}
                </div>
                <div className="col-sm-6 col-9" style={{marginLeft:"-30px"}}>
                    <h5 className='my-0'>{this.state.initial}. {this.state.firstname} {this.state.lastname}</h5>
                    <span className="headingspan">{this.state.degree} - {this.state.specility}</span>
                    {/* <h6 className="profilerole">Doctor</h6> */}
                </div>
            </div>
        )
    }
}
