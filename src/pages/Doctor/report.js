import React, { Component } from 'react'
import Report from '../../Components/Report/Report'
import Sidebar from '../../Components/Sidebar/DrSidebar'
import '../../assest/css/doctorpage.css'
import Navigation from '../../Components/FixedBottomNavigation'

export default class report extends Component {
    render() {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="waitingroom">
                    <div className="mt-2">
                        <h5><b>Reports</b></h5>
                        <Report/>
                    </div>
                </div>
                <div className='bottomnavigation'>
                    <Navigation />
                </div>
            </div>
        )
    }
}
