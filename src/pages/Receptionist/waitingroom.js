import React, { Component } from 'react'
import Sidebar from '../../Components/Sidebar/ReceptionistSidebar'
import '../../assest/css/doctorpage.css'
import RoomCard from '../../Components/RoomCard'
import Navigation from '../../Components/FixedBottomNavigationRecep'
import Doctorlist from '../../Components/recpdoctor'

export default class waitingroom extends Component {

    render() {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="waitingroom">
                    <div className="row p-1 mt-1">
                        <Doctorlist />
                    </div>
                    <div className="my-3">
                        <h5>Virtual Waiting Room</h5>
                    </div>
                    <div className="row my-2">
                        <RoomCard />
                    </div>
                    <div className='bottomnavigation'>
                        <Navigation />
                    </div>
                </div>
            </div>
        )
    }
}
