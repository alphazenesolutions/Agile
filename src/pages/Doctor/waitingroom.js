import React, { Component } from 'react'
import Sidebar from '../../Components/Sidebar/DrSidebar'
import '../../assest/css/doctorpage.css'
import TitleBar from '../../Components/titlebar'
import RoomCard from '../../Components/RoomCard'
import Navigation from '../../Components/FixedBottomNavigationDr'
import Advertisment from '../../Components/Advertisment/Advertisment'
import Feedback from '../../Components/FeedbackDr'
export default class waitingroom extends Component {

    render() {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="waitingroom">
                    <div className="row p-1 mt-1">
                        <TitleBar />
                    </div>
                    <div className="my-3">
                        <h5>Virtual Waiting Room</h5>
                    </div>
                    <div className="row my-2">
                        <RoomCard />
                        <Feedback />
                        <div className='row' style={{ bottom: "0px", marginLeft: "20rem", marginTop: "10px", position: "fixed" }}>
                            <Advertisment />
                        </div>
                    </div>
                    <div className='bottomnavigation'>
                        <Navigation />
                    </div>
                </div>
            </div>
        )
    }
}
