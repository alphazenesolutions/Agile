import React, { Component } from 'react'
import { allappointment } from '../apis/appointment'
import { FcRating } from 'react-icons/fc'
import { MdNoteAlt } from 'react-icons/md'
import { IoMdShare } from 'react-icons/io'
import { BsCameraVideoFill } from 'react-icons/bs'

export default class Completeappointment extends Component {
    constructor(props) {
        super()
        this.state = {
            profileid: sessionStorage.getItem("viewprofile"),
            allnewappointment: [],
            role: localStorage.getItem("role") || sessionStorage.getItem("role")
        }
    }
    componentDidMount = async () => {
        const { profileid } = this.state
        var allappointmentnew = await allappointment()
        // eslint-disable-next-line no-mixed-operators
        var myappointment = await allappointmentnew.filter((res) => { return (res.from_id === profileid && res.meeting_status === "completed") || (res.to_id === profileid && res.meeting_status === "completed") })
        this.setState({
            allnewappointment: myappointment
        })
    }
    render() {
        const { allnewappointment, role } = this.state
        return (
            <div>
                {
                    allnewappointment.length !== 0 ? allnewappointment.map((data, index) => (
                        < div className="row" key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <span className="spanans">{data.meeting_date}</span>
                                        </div>
                                        <div className="col-sm-2">
                                            <span className="spanans"> {data.duration}</span>
                                        </div>
                                        <div className="col-sm-2">
                                            <span className="spanans">{data.meeting_time}</span>
                                        </div>
                                        <div className="col-sm-2">
                                            <span className="spanans meetingstatus"> Finished</span>
                                        </div>
                                        <div className="col-sm-1">
                                            <span className="spanans"><BsCameraVideoFill /> play</span>
                                        </div>
                                        <div className="col-sm-1">
                                            <span className="spanans"><FcRating />{role === "mr" ? data.starto : data.starfrom} </span>
                                        </div>
                                        <div className="col-sm-2">
                                            <span className="spanans"><MdNoteAlt /> {role === "mr" ? data.feedbackto : data.feedbackfrom}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div >
                    )) : null
                }
            </div>

        )
    }
}
