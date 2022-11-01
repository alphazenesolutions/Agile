import React, { Component } from 'react'
import { allappointment, updateapoointment } from '../apis/appointment'
import moment from 'moment'

export default class upcommingappointment extends Component {
    constructor(props) {
        super()
        this.state = {
            profileid: sessionStorage.getItem("viewprofile"),
            allnewappointment: []
        }
    }
    componentDidMount = async () => {
        const { profileid } = this.state
        var today = moment().format("YYYY-MM-DD")
        var allappointmentnew = await allappointment()
        // eslint-disable-next-line no-mixed-operators
        var myappointment = await allappointmentnew.filter((res) => { return (res.from_id === profileid && res.meeting_status === "await" && res.status === "Approved" && res.decline_status !== "true") || ( res.to_id === profileid  && res.meeting_status === "await" && res.status === "Approved" && res.decline_status !== "true")})
        var allnewappointment = myappointment.filter((data) => { return data.meeting_date > today })
        this.setState({
            allnewappointment: allnewappointment
        })
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
    render() {
        const { allnewappointment } = this.state
        return (
            <div>
                {allnewappointment.length !== 0 ? allnewappointment.map((data, index) => (
                    <div className="row" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <span className="spanans"> {data.meeting_date}</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <span className="spanans"> {data.meeting_type}</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <span className="spanans"> {data.meeting_time}</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <span className="spanans actionstatus" id={data.appointment_id} onClick={this.declinebtn}> Decline</span>
                                    </div>
                                    {/* <div className="col-sm-3">
                                        <span className="spanans"><button className="editbtn btn-sm m-1">+ Add Participant</button></span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )) : "No Appointment Availble.."}

            </div>
        )
    }
}
