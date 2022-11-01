import React, { Component } from 'react';
import Button from '@mui/material/Button';
import "./MainpageButtons.css"
import { Link } from 'react-router-dom';

export default class MainpageButtons extends Component {
	constructor(props) {
		super()
		this.state = {
			userid: null
		}
	}
	componentDidMount = async () => {
		var userid = sessionStorage.getItem("userid") || localStorage.getItem("userid")
		var role = localStorage.getItem("role")
		this.setState({
			userid: userid,
		})
		if (userid !== null) {
			if (role === "doctor") {
				window.location.replace("/doctor/waitingroom")
			} else if (role === "receptionist") {
				window.location.replace("/receptionist/waitingroom")
			} else if (role === "mr") {
				window.location.replace("/mr/waitingroom")
			} else {
				window.location.replace("/nonmr/waitingroom")
			}
		}
	}
	render() {
		return <div>
			<div className='button-group'>
				<Link className="rolelink" to={{ pathname: "/signup", role: "doctor" }}><Button size="large" variant='contained' className='button' >Doctor</Button></Link>
			</div>
			<div className='button-group'>
				<Link className="rolelink" to={{ pathname: "/signup", role: "mr" }}><Button size="large" variant='contained' className='button' >Medical Representative</Button></Link>
			</div>
			<div className='button-group'>
				<Link className="rolelink" to={{ pathname: "/signup", role: "receptionist" }}><Button size="large" variant='contained' className='button' >Receptionist</Button></Link>
			</div>
			<div className='button-group'>
				<Link className="rolelink" to={{ pathname: "/signup", role: "nonmr" }}><Button size="large" variant='contained' className='button' >Company Non-MR</Button></Link>
			</div>
		</div>;
	}
}
